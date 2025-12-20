import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Initialize storage buckets on startup
async function initializeStorage() {
  const buckets = [
    {
      name: 'make-35a8e92d-course-materials',
      public: false,
      allowedMimeTypes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'video/mp4',
        'video/webm',
        'image/jpeg',
        'image/png',
        'image/webp',
        'text/plain'
      ],
      fileSizeLimit: 100 * 1024 * 1024, // 100MB
    },
    {
      name: 'make-35a8e92d-blog-thumbnails',
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      fileSizeLimit: 5 * 1024 * 1024, // 5MB
    },
    {
      name: 'make-35a8e92d-blog-images',
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      fileSizeLimit: 10 * 1024 * 1024, // 10MB
    },
    {
      name: 'make-35a8e92d-blog-videos',
      public: true,
      allowedMimeTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
      fileSizeLimit: 200 * 1024 * 1024, // 200MB
    }
  ];

  const { data: existingBuckets } = await supabase.storage.listBuckets();
  
  for (const bucketConfig of buckets) {
    const bucketExists = existingBuckets?.some(bucket => bucket.name === bucketConfig.name);
    
    if (!bucketExists) {
      console.log(`Creating ${bucketConfig.name} bucket...`);
      const { error } = await supabase.storage.createBucket(bucketConfig.name, {
        public: bucketConfig.public,
        allowedMimeTypes: bucketConfig.allowedMimeTypes,
        fileSizeLimit: bucketConfig.fileSizeLimit,
      });
      if (error) {
        console.error(`Error creating ${bucketConfig.name} bucket:`, error);
      } else {
        console.log(`${bucketConfig.name} bucket created successfully`);
      }
    }
  }
}

// Initialize on startup
initializeStorage().catch(console.error);

// Upload course material
app.post('/make-server-35a8e92d/upload-material', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized - Please login to upload materials' }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string; // notes, quizzes, videos, documents
    const courseId = formData.get('courseId') as string;

    if (!file || !title || !category || !courseId) {
      return c.json({ error: 'Missing required fields: file, title, category, courseId' }, 400);
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const uniqueId = crypto.randomUUID();
    const fileName = `${courseId}/${category}/${Date.now()}-${uniqueId}.${fileExtension}`;

    // Convert File to ArrayBuffer for upload
    const fileBuffer = await file.arrayBuffer();
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('make-35a8e92d-course-materials')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return c.json({ error: 'Failed to upload file to storage' }, 500);
    }

    // Create signed URL for file access
    const { data: urlData } = await supabase.storage
      .from('make-35a8e92d-course-materials')
      .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year expiry

    // Store material metadata in KV store
    const materialId = crypto.randomUUID();
    const materialData = {
      id: materialId,
      title,
      description: description || '',
      category,
      courseId,
      fileName,
      originalName: file.name,
      fileType: file.type,
      fileSize: file.size,
      uploadedBy: user.id,
      uploadedAt: new Date().toISOString(),
      url: urlData?.signedUrl,
      path: uploadData.path
    };

    await kv.set(`material:${materialId}`, materialData);
    
    // Add to course materials list
    const courseKey = `course:${courseId}:materials`;
    const existingMaterials = await kv.get(courseKey) || [];
    const updatedMaterials = [...existingMaterials, materialId];
    await kv.set(courseKey, updatedMaterials);

    // Add to category index
    const categoryKey = `course:${courseId}:${category}`;
    const existingCategoryMaterials = await kv.get(categoryKey) || [];
    const updatedCategoryMaterials = [...existingCategoryMaterials, materialId];
    await kv.set(categoryKey, updatedCategoryMaterials);

    return c.json({
      success: true,
      material: materialData,
      message: 'Course material uploaded successfully'
    });

  } catch (error) {
    console.error('Upload material error:', error);
    return c.json({ error: 'Internal server error during material upload' }, 500);
  }
});

// Get course materials
app.get('/make-server-35a8e92d/course/:courseId/materials', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const courseId = c.req.param('courseId');
    const category = c.req.query('category'); // optional filter

    let materialIds = [];
    
    if (category) {
      materialIds = await kv.get(`course:${courseId}:${category}`) || [];
    } else {
      materialIds = await kv.get(`course:${courseId}:materials`) || [];
    }

    // Fetch all material details
    const materials = [];
    for (const materialId of materialIds) {
      const material = await kv.get(`material:${materialId}`);
      if (material) {
        // Create fresh signed URL
        const { data: urlData } = await supabase.storage
          .from('make-35a8e92d-course-materials')
          .createSignedUrl(material.path, 60 * 60 * 24); // 24 hours

        materials.push({
          ...material,
          url: urlData?.signedUrl || material.url
        });
      }
    }

    return c.json({
      success: true,
      materials: materials.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()),
      total: materials.length
    });

  } catch (error) {
    console.error('Get materials error:', error);
    return c.json({ error: 'Internal server error while fetching materials' }, 500);
  }
});

// Delete course material
app.delete('/make-server-35a8e92d/material/:materialId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const materialId = c.req.param('materialId');
    const material = await kv.get(`material:${materialId}`);

    if (!material) {
      return c.json({ error: 'Material not found' }, 404);
    }

    if (material.uploadedBy !== user.id) {
      return c.json({ error: 'Unauthorized - You can only delete your own materials' }, 403);
    }

    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from('make-35a8e92d-course-materials')
      .remove([material.path]);

    if (deleteError) {
      console.error('Storage delete error:', deleteError);
    }

    // Remove from KV store
    await kv.del(`material:${materialId}`);

    // Remove from course materials list
    const courseKey = `course:${material.courseId}:materials`;
    const existingMaterials = await kv.get(courseKey) || [];
    const updatedMaterials = existingMaterials.filter(id => id !== materialId);
    await kv.set(courseKey, updatedMaterials);

    // Remove from category index
    const categoryKey = `course:${material.courseId}:${material.category}`;
    const existingCategoryMaterials = await kv.get(categoryKey) || [];
    const updatedCategoryMaterials = existingCategoryMaterials.filter(id => id !== materialId);
    await kv.set(categoryKey, updatedCategoryMaterials);

    return c.json({
      success: true,
      message: 'Course material deleted successfully'
    });

  } catch (error) {
    console.error('Delete material error:', error);
    return c.json({ error: 'Internal server error during material deletion' }, 500);
  }
});

// Generate and track certificate
app.post('/make-server-35a8e92d/generate-certificate', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { courseId, courseName, completionDate } = await c.req.json();

    if (!courseId || !courseName) {
      return c.json({ error: 'Missing required fields: courseId, courseName' }, 400);
    }

    // Create certificate record
    const certificateId = crypto.randomUUID();
    const certificateData = {
      id: certificateId,
      userId: user.id,
      courseId,
      courseName,
      studentName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student',
      completionDate: completionDate || new Date().toISOString(),
      generatedAt: new Date().toISOString(),
      certificateNumber: `SW-${courseId}-${Date.now()}`,
    };

    // Store certificate in KV
    await kv.set(`certificate:${certificateId}`, certificateData);
    
    // Add to user's certificates list
    const userCertsKey = `user:${user.id}:certificates`;
    const existingCerts = await kv.get(userCertsKey) || [];
    const updatedCerts = [...existingCerts, certificateId];
    await kv.set(userCertsKey, updatedCerts);

    return c.json({
      success: true,
      certificate: certificateData,
      message: 'Certificate generated successfully'
    });

  } catch (error) {
    console.error('Generate certificate error:', error);
    return c.json({ error: 'Internal server error during certificate generation' }, 500);
  }
});

// Get user certificates
app.get('/make-server-35a8e92d/certificates', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userCertsKey = `user:${user.id}:certificates`;
    const certificateIds = await kv.get(userCertsKey) || [];

    // Fetch all certificate details
    const certificates = [];
    for (const certId of certificateIds) {
      const cert = await kv.get(`certificate:${certId}`);
      if (cert) {
        certificates.push(cert);
      }
    }

    return c.json({
      success: true,
      certificates: certificates.sort((a, b) => 
        new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
      ),
      total: certificates.length
    });

  } catch (error) {
    console.error('Get certificates error:', error);
    return c.json({ error: 'Internal server error while fetching certificates' }, 500);
  }
});

// Create blog post
app.post('/make-server-35a8e92d/blog-posts', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized - Please login to create blog posts' }, 401);
    }

    const postData = await c.req.json();
    const postId = crypto.randomUUID();
    
    const blogPost = {
      id: postId,
      title: postData.title,
      content: postData.content,
      excerpt: postData.excerpt || '',
      author_id: user.id,
      author_name: postData.author_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Instructor',
      author_avatar: postData.author_avatar || '',
      media_type: postData.media_type || 'article',
      media_url: postData.media_url || '',
      thumbnail_url: postData.thumbnail_url || '',
      category: postData.category || 'General',
      views: 0,
      published: postData.published || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Store blog post in KV
    await kv.set(`blog:post:${postId}`, blogPost);
    
    // Add to all posts index
    const allPostsKey = 'blog:all_posts';
    const existingPosts = await kv.get(allPostsKey) || [];
    await kv.set(allPostsKey, [postId, ...existingPosts]);

    // Add to author's posts index
    const authorPostsKey = `blog:author:${user.id}:posts`;
    const authorPosts = await kv.get(authorPostsKey) || [];
    await kv.set(authorPostsKey, [postId, ...authorPosts]);

    // Add to category index
    const categoryKey = `blog:category:${postData.category}:posts`;
    const categoryPosts = await kv.get(categoryKey) || [];
    await kv.set(categoryKey, [postId, ...categoryPosts]);

    return c.json({
      success: true,
      data: blogPost,
      message: 'Blog post created successfully'
    });

  } catch (error) {
    console.error('Create blog post error:', error);
    return c.json({ error: 'Internal server error during blog post creation' }, 500);
  }
});

// Get all blog posts
app.get('/make-server-35a8e92d/blog-posts', async (c) => {
  try {
    const category = c.req.query('category');
    const authorId = c.req.query('author_id');
    const publishedOnly = c.req.query('published') !== 'false';

    let postIds = [];
    
    if (authorId) {
      postIds = await kv.get(`blog:author:${authorId}:posts`) || [];
    } else if (category && category !== 'All') {
      postIds = await kv.get(`blog:category:${category}:posts`) || [];
    } else {
      postIds = await kv.get('blog:all_posts') || [];
    }

    // Fetch all post details
    const posts = [];
    for (const postId of postIds) {
      const post = await kv.get(`blog:post:${postId}`);
      if (post) {
        // Filter by published status if needed
        if (!publishedOnly || post.published) {
          posts.push(post);
        }
      }
    }

    return c.json({
      success: true,
      data: posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
      total: posts.length
    });

  } catch (error) {
    console.error('Get blog posts error:', error);
    return c.json({ error: 'Internal server error while fetching blog posts' }, 500);
  }
});

// Get single blog post
app.get('/make-server-35a8e92d/blog-posts/:id', async (c) => {
  try {
    const postId = c.req.param('id');
    const post = await kv.get(`blog:post:${postId}`);

    if (!post) {
      return c.json({ error: 'Blog post not found' }, 404);
    }

    // Increment views
    post.views = (post.views || 0) + 1;
    await kv.set(`blog:post:${postId}`, post);

    return c.json({
      success: true,
      data: post
    });

  } catch (error) {
    console.error('Get blog post error:', error);
    return c.json({ error: 'Internal server error while fetching blog post' }, 500);
  }
});

// Update blog post
app.put('/make-server-35a8e92d/blog-posts/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const postId = c.req.param('id');
    const existingPost = await kv.get(`blog:post:${postId}`);

    if (!existingPost) {
      return c.json({ error: 'Blog post not found' }, 404);
    }

    if (existingPost.author_id !== user.id) {
      return c.json({ error: 'Unauthorized - You can only edit your own posts' }, 403);
    }

    const updateData = await c.req.json();
    
    const updatedPost = {
      ...existingPost,
      title: updateData.title || existingPost.title,
      content: updateData.content || existingPost.content,
      excerpt: updateData.excerpt !== undefined ? updateData.excerpt : existingPost.excerpt,
      media_type: updateData.media_type || existingPost.media_type,
      media_url: updateData.media_url !== undefined ? updateData.media_url : existingPost.media_url,
      thumbnail_url: updateData.thumbnail_url !== undefined ? updateData.thumbnail_url : existingPost.thumbnail_url,
      category: updateData.category || existingPost.category,
      published: updateData.published !== undefined ? updateData.published : existingPost.published,
      updated_at: new Date().toISOString(),
    };

    await kv.set(`blog:post:${postId}`, updatedPost);

    // Update category index if category changed
    if (updateData.category && updateData.category !== existingPost.category) {
      // Remove from old category
      const oldCategoryKey = `blog:category:${existingPost.category}:posts`;
      const oldCategoryPosts = await kv.get(oldCategoryKey) || [];
      await kv.set(oldCategoryKey, oldCategoryPosts.filter(id => id !== postId));

      // Add to new category
      const newCategoryKey = `blog:category:${updateData.category}:posts`;
      const newCategoryPosts = await kv.get(newCategoryKey) || [];
      await kv.set(newCategoryKey, [postId, ...newCategoryPosts]);
    }

    return c.json({
      success: true,
      data: updatedPost,
      message: 'Blog post updated successfully'
    });

  } catch (error) {
    console.error('Update blog post error:', error);
    return c.json({ error: 'Internal server error during blog post update' }, 500);
  }
});

// Delete blog post
app.delete('/make-server-35a8e92d/blog-posts/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const postId = c.req.param('id');
    const post = await kv.get(`blog:post:${postId}`);

    if (!post) {
      return c.json({ error: 'Blog post not found' }, 404);
    }

    if (post.author_id !== user.id) {
      return c.json({ error: 'Unauthorized - You can only delete your own posts' }, 403);
    }

    // Delete from KV
    await kv.del(`blog:post:${postId}`);

    // Remove from all posts index
    const allPosts = await kv.get('blog:all_posts') || [];
    await kv.set('blog:all_posts', allPosts.filter(id => id !== postId));

    // Remove from author's posts
    const authorPosts = await kv.get(`blog:author:${user.id}:posts`) || [];
    await kv.set(`blog:author:${user.id}:posts`, authorPosts.filter(id => id !== postId));

    // Remove from category index
    const categoryPosts = await kv.get(`blog:category:${post.category}:posts`) || [];
    await kv.set(`blog:category:${post.category}:posts`, categoryPosts.filter(id => id !== postId));

    return c.json({
      success: true,
      message: 'Blog post deleted successfully'
    });

  } catch (error) {
    console.error('Delete blog post error:', error);
    return c.json({ error: 'Internal server error during blog post deletion' }, 500);
  }
});

// Health check endpoint
app.get("/make-server-35a8e92d/health", (c) => {
  return c.json({ status: "ok" });
});

Deno.serve(app.fetch);