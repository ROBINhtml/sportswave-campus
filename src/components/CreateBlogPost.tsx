import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase/client";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ArrowLeft, Upload, Image as ImageIcon, Video, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CreateBlogPostProps {
  onNavigate: (page: string) => void;
  user: any;
  editPostId?: string;
}

export function CreateBlogPost({ onNavigate, user, editPostId }: CreateBlogPostProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Coaching Tips",
    media_type: "article" as "video" | "image" | "article",
    media_url: "",
    thumbnail_url: "",
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [mediaPreview, setMediaPreview] = useState<string>("");

  useEffect(() => {
    if (editPostId) {
      fetchPostForEdit();
    }
  }, [editPostId]);

  const fetchPostForEdit = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-35a8e92d/blog-posts/${editPostId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }

      const result = await response.json();
      const data = result.data;

      setFormData({
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        media_type: data.media_type,
        media_url: data.media_url || "",
        thumbnail_url: data.thumbnail_url || "",
      });

      setThumbnailPreview(data.thumbnail_url || "");
      setMediaPreview(data.media_url || "");
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error("Failed to load post for editing");
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async (file: File, bucket: string): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent, published: boolean = false) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast.error("Please fill in title and content");
      return;
    }

    setLoading(true);
    setUploading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        toast.error("Please log in to create a blog post");
        return;
      }

      let thumbnailUrl = formData.thumbnail_url;
      let mediaUrl = formData.media_url;

      // Upload thumbnail if new file selected
      if (thumbnailFile) {
        thumbnailUrl = await uploadFile(thumbnailFile, "make-35a8e92d-blog-thumbnails");
      }

      // Upload media if new file selected
      if (mediaFile) {
        const bucket = formData.media_type === "video" ? "make-35a8e92d-blog-videos" : "make-35a8e92d-blog-images";
        mediaUrl = await uploadFile(mediaFile, bucket);
      }

      const postData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        media_type: formData.media_type,
        media_url: mediaUrl,
        thumbnail_url: thumbnailUrl,
        author_name: user.name,
        author_avatar: user.avatar,
        published,
      };

      let response;
      
      if (editPostId) {
        // Update existing post
        response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-35a8e92d/blog-posts/${editPostId}`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
          }
        );
      } else {
        // Create new post
        response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-35a8e92d/blog-posts`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
          }
        );
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save blog post');
      }

      const result = await response.json();
      toast.success(editPostId ? "Post updated successfully!" : (published ? "Post published successfully!" : "Post saved as draft!"));
      onNavigate("blog");
    } catch (error) {
      console.error("Error saving blog post:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save blog post");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const categories = [
    "Coaching Tips",
    "Training Techniques",
    "Sports Psychology",
    "Youth Development",
    "Fitness & Conditioning",
    "Nutrition",
    "Team Management",
    "Success Stories",
    "Industry News",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => onNavigate("blog")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
          <h1 className="text-4xl md:text-5xl text-primary">
            {editPostId ? "Edit Blog Post" : "Create New Blog Post"}
          </h1>
          <p className="text-gray-600 mt-2">
            Share your knowledge and insights with the Sportswave community
          </p>
        </div>

        <form onSubmit={(e) => handleSubmit(e, true)}>
          <div className="space-y-6">
            {/* Basic Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Provide the essential details for your blog post</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Post Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter a compelling title..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Brief summary of your post (shown in listing)"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="media-type">Media Type</Label>
                    <Select
                      value={formData.media_type}
                      onValueChange={(value: any) => setFormData({ ...formData, media_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="article">
                          <span className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Article
                          </span>
                        </SelectItem>
                        <SelectItem value="video">
                          <span className="flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            Video
                          </span>
                        </SelectItem>
                        <SelectItem value="image">
                          <span className="flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" />
                            Image
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Card */}
            <Card>
              <CardHeader>
                <CardTitle>Content *</CardTitle>
                <CardDescription>Write your blog post content</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Write your content here..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={15}
                  required
                />
              </CardContent>
            </Card>

            {/* Media Upload Card */}
            <Card>
              <CardHeader>
                <CardTitle>Media</CardTitle>
                <CardDescription>
                  Upload images or videos, or provide YouTube links
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Thumbnail Upload */}
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail Image</Label>
                  <div className="flex flex-col gap-4">
                    <Input
                      id="thumbnail"
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="cursor-pointer"
                    />
                    {thumbnailPreview && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                        <ImageWithFallback
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Media Upload/URL */}
                {formData.media_type === "video" && (
                  <div className="space-y-2">
                    <Label htmlFor="video-url">Video URL or Upload</Label>
                    <Input
                      id="video-url"
                      placeholder="https://youtube.com/watch?v=..."
                      value={formData.media_url}
                      onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                    />
                    <p className="text-sm text-gray-500">Or upload a video file:</p>
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={handleMediaChange}
                      className="cursor-pointer"
                    />
                    {mediaPreview && !formData.media_url.includes("youtube") && (
                      <video src={mediaPreview} controls className="w-full rounded-lg" />
                    )}
                  </div>
                )}

                {formData.media_type === "image" && (
                  <div className="space-y-2">
                    <Label htmlFor="image">Main Image</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleMediaChange}
                      className="cursor-pointer"
                    />
                    {mediaPreview && (
                      <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                        <ImageWithFallback
                          src={mediaPreview}
                          alt="Media preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onNavigate("blog")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={(e) => handleSubmit(e, false)}
                disabled={loading}
              >
                Save as Draft
              </Button>
              <Button type="submit" disabled={loading} className="min-w-[120px]">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {uploading ? "Uploading..." : "Publishing..."}
                  </>
                ) : (
                  "Publish Post"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}