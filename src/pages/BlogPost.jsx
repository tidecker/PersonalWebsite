import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { supabase } from "../supabaseClient";

function BlogPost() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPost() {
            const { data, error } = await supabase
                .from("posts")
                .select("*")
                .eq("slug", slug)
                .eq("status", "published")
                .single();

            if (error) {
                console.error(error);
                setLoading(false);
                return;
            }

            setPost(data);
            setLoading(false);
        }

        loadPost();
    }, [slug]);

    if (loading) {
        return <p className="p-6">Loading...</p>;
    }

    if (!post) {
        return <p className="p-6">Post not found.</p>;
    }

    return (
        <main className="max-w-3xl mx-auto p-6">
            <p className="text-sm text-gray-500">
                Published: {new Date(post.published_at).toLocaleString()}
            </p>

            <p className="text-sm text-gray-500">
                Updated: {new Date(post.updated_at).toLocaleString()}
            </p>
            <h1 className="text-4xl font-bold mb-3">
                {post.title}
            </h1>

            <p className="text-gray-500 mb-6">
                {post.tag}
            </p>

            {post.image_url && (
                <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full rounded mb-6"
                />
            )}

            <div
                className="prose max-w-none [&_p]:mb-4"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />
        </main>
    );
}

export default BlogPost;