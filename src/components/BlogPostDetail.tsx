import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase/client";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ArrowLeft, Clock, Eye, Share2, Video } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  media_type: "video" | "image" | "article";
  media_url: string | null;
  thumbnail_url: string | null;
  category: string;
  views: number;
  created_at: string;
  updated_at: string;
}

interface BlogPostDetailProps {
  postId: string;
  onNavigate: (page: string) => void;
  user: any;
}

export function BlogPostDetail({ postId, onNavigate, user }: BlogPostDetailProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-35a8e92d/blog-posts/${postId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch blog post');
      }

      const result = await response.json();
      setPost(result.data);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      toast.error("Failed to load blog post");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderMedia = () => {
    if (!post?.media_url) return null;

    switch (post.media_type) {
      case "video":
        return (
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-8">
            {post.media_url.includes("youtube.com") || post.media_url.includes("youtu.be") ? (
              <iframe
                src={post.media_url.replace("watch?v=", "embed/")}
                title={post.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video controls className="w-full h-full">
                <source src={post.media_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        );
      case "image":
        return (
          <div className="mb-8">
            <ImageWithFallback
              src={post.media_url}
              alt={post.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-8" />
            <div className="h-96 bg-gray-200 rounded mb-8" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl mb-4">Post not found</h2>
          <Button onClick={() => onNavigate("blog")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => onNavigate("blog")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Button>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge>{post.category}</Badge>
            <Badge variant="outline" className="capitalize">
              {post.media_type}
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl mb-6 text-primary">
            {post.title}
          </h1>

          {/* Author Info & Meta */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.author_avatar} />
                <AvatarFallback>{post.author_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.author_name}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatDate(post.created_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {post.views} views
                  </span>
                </div>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Media Content */}
        {renderMedia()}

        {/* Article Content */}
        <Card className="mb-8">
          <CardContent className="prose prose-lg max-w-none pt-6">
            <div
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </CardContent>
        </Card>

        {/* Author Bio Card */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={post.author_avatar} />
                <AvatarFallback>{post.author_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg mb-2">About {post.author_name}</h3>
                <p className="text-gray-600 text-sm">
                  Expert instructor at Sportswave Campus, dedicated to empowering coaches
                  across Africa with world-class education and insights.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}