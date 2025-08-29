import React, { useEffect, useState } from "react";

interface BlogPost {
  id: number;
  title: string;
  author: string;
  date: string;
  summary: string;
  image: string;
}

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("https://app.pjmoneypower.com/api/blogs/");
        const data = await res.json();
        console.log("Fetched Blogs:", data);

        setPosts(data); // backend returns array directly
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="text-center mt-20">Loading blogs...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 md:px-0">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-800 mb-12 text-center">
          PJ Money Power Blog
        </h1>
        <div className="flex flex-col gap-16">
          {posts.map((post, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={post.id}
                className={`flex flex-col md:flex-row ${
                  isEven ? "" : "md:flex-row-reverse"
                } items-center bg-white rounded-xl shadow p-6 border border-blue-100 hover:shadow-lg transition`}
              >
                <div className="md:w-1/2 w-full flex justify-center mb-4 md:mb-0">
                  <img
                    src={`https://app.pjmoneypower.com/api/blogs/${post.image}`} 
                    alt={post.title}
                    className="rounded-lg shadow-md object-cover w-full max-w-xs h-56"
                  />
                  
                </div>
                <div className="md:w-1/2 w-full md:px-8 flex flex-col items-start">
                  <h2 className="text-2xl font-semibold text-blue-700 mb-2">
                    {post.title}
                  </h2>
                  <div className="text-sm text-gray-500 mb-2">
                    {post.date} • {post.author}
                  </div>
                  <p className="text-gray-700 mb-2">{post.summary}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Blog;
