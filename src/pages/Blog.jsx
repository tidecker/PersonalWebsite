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
                {expandedPostId === post.id && (
                    <p className="mt-4">
                        {post.content}
                        <Link
                            to={`/blog/${post.slug}`}
                            className="block text-center mt-4 text-blue-600 hover:underline"
                        >
                            Read full post
                        </Link>
                    </p>
                )}
                </article>
            ))}
            </div>
        </main>
    );
}

export default Blog;