import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase/client";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Clock, Eye, Video, Image as ImageIcon, FileText, Search } from "lucide-react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
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

interface BlogPageProps {
  onNavigate: (page: string, postId?: string) => void;
  user: any;
}

export function BlogPage({ onNavigate, user }: BlogPageProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [mediaTypeFilter, setMediaTypeFilter] = useState("all");

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchQuery, categoryFilter, mediaTypeFilter]);

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-35a8e92d/blog-posts?published=true`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }

      const result = await response.json();
      setPosts(result.data || []);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      toast.error("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = [...posts];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((post) => post.category === categoryFilter);
    }

    // Media type filter
    if (mediaTypeFilter !== "all") {
      filtered = filtered.filter((post) => post.media_type === mediaTypeFilter);
    }

    setFilteredPosts(filtered);
  };

  const handlePostClick = (postId: string) => {
    onNavigate("blog-post-detail", postId);
  };

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "image":
        return <ImageIcon className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const categories = ["all", ...new Set(posts.map((post) => post.category))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-4 text-primary">
            Sportswave Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover insights, tips, and stories from our community of expert coaches
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Media Type Filter */}
            <Select value={mediaTypeFilter} onValueChange={setMediaTypeFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Media Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="article">Articles</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="image">Images</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>
              Showing {filteredPosts.length} of {posts.length} posts
            </p>
            {user?.role === "instructor" && (
              <Button onClick={() => onNavigate("create-blog-post")} size="sm">
                Create New Post
              </Button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse" />
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl mb-2">No posts found</h3>
            <p className="text-gray-600">
              {searchQuery || categoryFilter !== "all" || mediaTypeFilter !== "all"
                ? "Try adjusting your filters"
                : "Be the first to create a blog post!"}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => handlePostClick(post.id)}
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
                  {post.thumbnail_url ? (
                    <ImageWithFallback
                      src={post.thumbnail_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="p-6 rounded-full bg-primary/10">
                        {getMediaIcon(post.media_type)}
                      </div>
                    </div>
                  )}
                  <Badge className="absolute top-3 left-3 bg-white text-primary">
                    {post.category}
                  </Badge>
                  <Badge
                    className="absolute top-3 right-3 bg-primary/90 text-white"
                    variant="default"
                  >
                    <span className="flex items-center gap-1">
                      {getMediaIcon(post.media_type)}
                      <span className="capitalize">{post.media_type}</span>
                    </span>
                  </Badge>
                </div>

                <CardHeader>
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {/* Author Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={post.author_avatar} />
                      <AvatarFallback>{post.author_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{post.author_name}</p>
                      <p className="text-xs text-gray-500">{formatDate(post.created_at)}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.views}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}