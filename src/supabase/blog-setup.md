# Blog System Database Setup Guide

This document outlines the required database tables and storage buckets for the Sportswave Campus blog functionality.

## Database Tables

### 1. blog_posts Table

Create this table in your Supabase SQL Editor:

```sql
-- Create blog_posts table
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  media_type TEXT CHECK (media_type IN ('video', 'image', 'article')) NOT NULL DEFAULT 'article',
  media_url TEXT,
  thumbnail_url TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  views INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone to read published posts
CREATE POLICY "Anyone can view published posts" 
  ON blog_posts FOR SELECT 
  USING (published = true);

-- Allow instructors to insert their own posts
CREATE POLICY "Instructors can create posts" 
  ON blog_posts FOR INSERT 
  WITH CHECK (auth.uid()::text = author_id);

-- Allow instructors to update their own posts
CREATE POLICY "Instructors can update own posts" 
  ON blog_posts FOR UPDATE 
  USING (auth.uid()::text = author_id);

-- Allow instructors to delete their own posts
CREATE POLICY "Instructors can delete own posts" 
  ON blog_posts FOR DELETE 
  USING (auth.uid()::text = author_id);
```

## Storage Buckets

### 2. Create Storage Buckets

Run these commands in the Supabase SQL Editor to create storage buckets:

```sql
-- Create blog-thumbnails bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-thumbnails', 'blog-thumbnails', true);

-- Create blog-images bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true);

-- Create blog-videos bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-videos', 'blog-videos', true);
```

### 3. Set Storage Policies

```sql
-- Allow anyone to read blog thumbnails
CREATE POLICY "Public Access to Blog Thumbnails"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-thumbnails');

-- Allow authenticated users to upload thumbnails
CREATE POLICY "Authenticated users can upload thumbnails"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'blog-thumbnails' AND auth.role() = 'authenticated');

-- Allow anyone to read blog images
CREATE POLICY "Public Access to Blog Images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

-- Allow anyone to read blog videos
CREATE POLICY "Public Access to Blog Videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-videos');

-- Allow authenticated users to upload videos
CREATE POLICY "Authenticated users can upload videos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'blog-videos' AND auth.role() = 'authenticated');

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files"
  ON storage.objects FOR DELETE
  USING (auth.uid()::text = (storage.foldername(name))[1]);
```

## Sample Data (Optional)

You can insert some sample blog posts for testing:

```sql
-- Insert sample blog posts
INSERT INTO blog_posts (
  title, 
  content, 
  excerpt, 
  author_id, 
  author_name, 
  author_avatar, 
  media_type, 
  thumbnail_url, 
  category, 
  published,
  views
) VALUES 
(
  '5 Essential Drills for Youth Football Development',
  'Youth football coaching requires a careful balance of skill development, fun, and safety. In this comprehensive guide, we''ll explore five fundamental drills that every youth coach should incorporate into their training sessions.\n\n1. Dribbling Cone Weave: This classic drill helps young players develop close ball control and spatial awareness...\n\n2. Pass and Move: Teaching players to move after passing is crucial for developing game intelligence...\n\n3. Small-Sided Games: Nothing beats real game situations for learning...',
  'Discover the top drills that will help young footballers develop essential skills while having fun on the pitch.',
  'instructor-1',
  'Dr. Sarah Okafor',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
  'article',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop',
  'Coaching Tips',
  true,
  234
),
(
  'Understanding Sports Psychology in Coaching',
  'The mental game is just as important as physical preparation. As coaches, understanding sports psychology principles can dramatically improve your athletes'' performance and enjoyment of the sport.\n\nKey concepts covered:\n- Motivation and goal setting\n- Building mental resilience\n- Team dynamics and cohesion\n- Handling pressure situations\n\nLet''s dive into each of these areas...',
  'Learn how to apply sports psychology principles to enhance your coaching effectiveness and athlete performance.',
  'instructor-1',
  'Dr. Sarah Okafor',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
  'article',
  'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=600&fit=crop',
  'Sports Psychology',
  true,
  189
),
(
  'Video: Proper Warm-Up Routines for Athletes',
  'In this video tutorial, I demonstrate a comprehensive warm-up routine that prepares athletes physically and mentally for training or competition. A proper warm-up reduces injury risk and improves performance.',
  'Watch this detailed video guide on conducting effective warm-up sessions for your team.',
  'instructor-2',
  'Coach Emmanuel Mensah',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
  'video',
  'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop',
  'Training Techniques',
  true,
  412
);
```

## Verification

After setup, verify everything works:

1. Check that the `blog_posts` table exists with all columns
2. Verify storage buckets are created and public
3. Test insert/update permissions
4. Try uploading a file to each bucket
5. Check that published posts are visible to unauthenticated users

## Notes

- Posts are only visible to the public when `published = true`
- The `views` counter increments when users view a post
- Video posts can contain either uploaded videos or YouTube URLs
- All file uploads are organized by user ID in storage buckets
