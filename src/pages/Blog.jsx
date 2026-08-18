import { useEffect, useState } from "react";
import { Link } from "react-router";
import { supabase } from "../supabaseClient";

function Blog() {
    const [blogPosts, setBlogPosts] = useState([]);
    const [expandedPostId, setExpandedPostId] = useState(null);

    useEffect(() => {
        async function getBlogPosts() {
            const { data, error } = await supabase
                .from("posts")
                .select("*")
                .eq("status", "published")
                .order("published_at", { ascending: false });

            if (error) {
                console.error("Error loading posts:", error);
                return;
            }

            setBlogPosts(data);
        }

        getBlogPosts();
    }, []);

    return (
        <main className="p-6">
            <h1 className="text-3xl font-bold mb-6">Blog</h1>

            <div className="space-y-4">
            {blogPosts.map((post) => (
                <article
                    key={post.id}
                    onClick={() =>
                        setExpandedPostId(
                        expandedPostId === post.id ? null : post.id
                        )
                    }
                    className="border rounded-lg p-4 cursor-pointer"
                >
                <p className="text-sm text-gray-500">
                    Published: {new Date(post.published_at).toLocaleString()}
                </p>

                {post.updated_at && (
                    <p className="text-sm text-gray-500">
                        Updated: {new Date(post.updated_at).toLocaleString()}
                    </p>
                )}
                <h2 className="text-xl font-semibold">
                    {post.title}
                </h2>

                <span className="text-sm">
                    {post.tag}
                </span>

                <p className="mt-2">
                    {post.summary}
                </p>

                <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        expandedPostId === post.id
                            ? "max-h-64 opacity-100 mt-4"
                            : "max-h-0 opacity-0 mt-0"
                    }`}
                >
                    <div className="relative">
                        <div
                            className="prose max-w-none [&_p]:mb-4 [&_p]:indent-8"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        <div className="pointer-events-none absolute bottom-0 left-0 h-20 w-full bg-gradient-to-t from-white to-transparent" />
                    </div>
                </div>

                <div
                    className={`overflow-hidden transition-all duration-500 ${
                        expandedPostId === post.id
                            ? "max-h-20 opacity-100"
                            : "max-h-0 opacity-0"
                    }`}
                >
                    <Link
                        to={`/blog/${post.slug}`}
                        onClick={(event) => event.stopPropagation()}
                        className="block mt-4 text-center text-blue-600 hover:underline"
                    >
                        Read full post
                    </Link>
                </div>
                
                </article>
            ))}
            </div>
        </main>
    );
}

export default Blog;