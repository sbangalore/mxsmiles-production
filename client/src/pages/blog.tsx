import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Calendar, Clock, User, ArrowRight, Tag, LoaderCircle } from "lucide-react";
import { Helmet } from "react-helmet";
import { useLanguage } from "@/contexts/language-context";
import { useDesign } from "@/contexts/design-context";
import { BlogSEO } from "@/components/seo-optimization";
import { motion } from "framer-motion";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
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

interface BlogAPIResponse {
  posts: BlogPost[];
  total: number;
  status: string;
}

export default function Blog() {
  const { t } = useLanguage();
  const { theme, getThemeClasses } = useDesign();
  const themeClasses = getThemeClasses();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(["All"]);

  // Fetch blog posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let url = '/api/blog/posts';
        const params = new URLSearchParams();
        
        if (searchTerm) {
          url = '/api/blog/search';
          params.append('q', searchTerm);
        } else if (selectedCategory !== "All") {
          url = `/api/blog/category/${selectedCategory.toLowerCase().replace(' ', '-')}`;
        }
        
        if (params.toString() && !searchTerm) {
          url += '?' + params.toString();
        } else if (searchTerm) {
          url += '?' + params.toString();
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: BlogAPIResponse = await response.json();
        
        if (data.status === 'success') {
          setPosts(data.posts || []);
          
          // Extract unique categories for filter
          const allCategories = ["All"];
          data.posts?.forEach(post => {
            post.categories.forEach(cat => {
              const formattedCat = cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ');
              if (!allCategories.includes(formattedCat)) {
                allCategories.push(formattedCat);
              }
            });
          });
          setCategories(allCategories);
        } else {
          throw new Error(data.message || 'Failed to fetch posts');
        }
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError(err instanceof Error ? err.message : 'Failed to load blog posts');
        setPosts([]); // Fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchTerm, selectedCategory]);

  // Scroll to top when the blog page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const featuredPost = posts.find(post => post.categories.includes('featured')) || posts[0];
  const regularPosts = posts.filter(post => !post.categories.includes('featured'));

  return (
    <>
      <BlogSEO />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 bg-gradient-to-br from-pink-400 via-red-500 via-yellow-500 via-green-500 to-blue-600">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 via-pink-600/20 to-orange-500/20"></div>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mb-6 flex justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-white/90 ring-1 ring-white/20 hover:ring-white/30">
                Expert Dental Tourism Insights{' '}
                <span className="font-semibold text-white" aria-hidden="true">
                  →
                </span>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl mb-6 text-white drop-shadow-lg">
                <span className="font-bold">MX</span>
                <span className="font-medium text-gray-100"> Smiles Blog</span>
              </h1>
              <p className="text-xl max-w-3xl mx-auto text-white/90 drop-shadow">
                Expert advice, patient stories, and comprehensive guides for your dental tourism journey
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white rounded-t-2xl -mt-4 relative z-10 shadow-lg">
          {/* Search and Filter Section */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? "bg-[#007aff] text-white shadow-sm"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <LoaderCircle className="w-8 h-8 animate-spin text-[#007aff]" />
              <span className="ml-2 text-gray-600">Loading blog posts...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Failed to load blog posts: {error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-[#007aff] hover:bg-[#0051d0] text-white font-medium rounded-2xl transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Featured Post */}
          {!loading && !error && featuredPost && selectedCategory === "All" && searchTerm === "" && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Featured Article</h2>
              <div className="overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="md:flex">
                  <div className="md:w-1/2 bg-gray-200">
                    <div className="w-full h-64 md:h-full flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <Calendar className="w-12 h-12 mx-auto mb-2" />
                        <p>Featured Image</p>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-1/2 p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary">{featuredPost.categories[0] || 'Blog'}</Badge>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{featuredPost.reading_time}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">
                      {featuredPost.title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {featuredPost.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{featuredPost.author}</p>
                          <p className="text-sm text-gray-500">{new Date(featuredPost.published_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Link href={`/blog/${featuredPost.slug}`}>
                        <button className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-2xl transition-colors duration-200">
                          Read More <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Blog Posts Grid */}
          {!loading && !error && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                {selectedCategory === "All" ? "Latest Articles" : `${selectedCategory} Articles`}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <div className="h-full bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
                      <div className="aspect-video bg-gray-200 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <Calendar className="w-8 h-8 mx-auto mb-1" />
                          <p className="text-sm">Article Image</p>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                            {post.categories[0] || 'Blog'}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{post.reading_time}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                          {post.summary}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{post.author}</p>
                              <p className="text-xs text-gray-500">{new Date(post.published_date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                            <ArrowRight className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {posts.length === 0 && !loading && !error && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
                  <button 
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All");
                    }}
                    className="mt-4 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-2xl transition-colors duration-200"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Newsletter Signup */}
          <div className="mt-16">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  Stay Updated with Dental Tourism Tips
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Get the latest articles, patient stories, and exclusive offers delivered to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:border-transparent transition-all duration-200"
                  />
                  <button className="px-6 py-3 bg-[#007aff] hover:bg-[#0051d0] text-white font-semibold rounded-2xl transition-colors duration-200">
                    Subscribe
                  </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}