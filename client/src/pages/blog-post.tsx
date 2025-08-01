import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Calendar, Clock, User, Share2, BookmarkPlus, LoaderCircle } from "lucide-react";
import { Helmet } from "react-helmet";
import { useLanguage } from "@/contexts/language-context";
import { useDesign } from "@/contexts/design-context";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  author: string;
  date: string;
  published_date: string;
  categories: string[];
  tags: string[];
  reading_time: string;
  url: string;
  published: boolean;
}

interface BlogPostAPIResponse {
  post: BlogPost;
  status: string;
  message?: string;
}

export default function BlogPost() {
  const { t } = useLanguage();
  const { theme, getThemeClasses } = useDesign();
  const [match, params] = useRoute("/blog/:slug");
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!params?.slug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/blog/post/${params.slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError("Blog post not found");
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: BlogPostAPIResponse = await response.json();
        
        if (data.status === 'success' && data.post) {
          setPost(data.post);
        } else {
          setError(data.message || 'Failed to load blog post');
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError(err instanceof Error ? err.message : 'Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params?.slug]);

  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="flex items-center">
          <LoaderCircle className="w-8 h-8 animate-spin text-[#007aff]" />
          <span className="ml-2 text-gray-600">Loading article...</span>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error === "Blog post not found" ? "Article Not Found" : "Error Loading Article"}
          </h1>
          <p className="text-gray-600 mb-6">
            {error === "Blog post not found" 
              ? "The article you're looking for doesn't exist or has been moved."
              : error || "Something went wrong while loading the article."
            }
          </p>
          <div className="space-x-3">
            <Link href="/blog">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
            {error !== "Blog post not found" && (
              <Button 
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | MxSmiles Blog</title>
        <meta name="description" content={post.summary} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.summary} />
        <meta property="og:type" content="article" />
        <meta property="article:author" content={post.author} />
        <meta property="article:published_time" content={post.published_date} />
        {post.categories.map((category, index) => (
          <meta key={index} property="article:section" content={category} />
        ))}
        {post.tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link href="/blog">
              <button className="inline-flex items-center text-[#007aff] hover:text-[#0051d0] mb-6 transition-colors duration-200">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </button>
            </Link>
            
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {post.categories.map((category, index) => (
                <Badge key={index} variant="secondary">
                  {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                </Badge>
              ))}
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{post.reading_time}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-[#007aff]/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-[#007aff]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{post.author}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(post.published_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                  <BookmarkPlus className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 md:p-12">
              <div 
                className="prose prose-lg max-w-none
                  prose-headings:text-gray-900 prose-headings:font-bold
                  prose-p:text-gray-700 prose-p:leading-relaxed
                  prose-a:text-[#007aff] prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-900 prose-strong:font-semibold
                  prose-ul:text-gray-700 prose-ol:text-gray-700
                  prose-li:text-gray-700 prose-li:leading-relaxed
                  prose-blockquote:border-l-[#007aff] prose-blockquote:bg-blue-50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg
                  prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                  prose-pre:bg-gray-900 prose-pre:text-gray-100
                  prose-img:rounded-lg prose-img:shadow-md"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors duration-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-12">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Ready to Start Your Dental Journey?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Get a free consultation and personalized treatment plan from our network of verified Mexican dental providers.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/booking">
                  <Button size="lg" className="w-full sm:w-auto">
                    Schedule Free Consultation
                  </Button>
                </Link>
                <Link href="/#pricing">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Calculate Your Savings
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}