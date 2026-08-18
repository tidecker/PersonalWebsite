import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import AdminLogin from "../components/adminPage/AdminLogin";
import BlogPostForm from "../components/adminPage/BlogPostForm";

function Admin() {
    const [message, setMessage] = useState("");
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [drafts, setDrafts] = useState([]);
    const [editingPost, setEditingPost] = useState(null);
    const [publishedPosts, setPublishedPosts] = useState([]);
    const [hiddenPosts, setHiddenPosts] = useState([]);
    const [originalPublishedAt, setOriginalPublishedAt] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setLoading(false);
        });

        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            data.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (session) {
            loadDrafts();
            loadPublishedPosts();
            loadHiddenPosts();
        }
    }, [session]);

    async function loadPublishedPosts() {
        const { data, error } = await supabase
            .from("posts")
            .select("*")
            .eq("status", "published")
            .order("published_at", { ascending: false });

        if (error) {
            console.error(error);
            return;
        }

        setPublishedPosts(data);
    }

    async function loadDrafts() {
        const { data, error } = await supabase
            .from("posts")
            .select("*")
            .eq("status", "draft")
            .order("updated_at", { ascending: false });

        if (error) {
            console.error(error);
            return;
        }

        setDrafts(data);
    }

    async function loadHiddenPosts() {
        const { data, error } = await supabase
            .from("posts")
            .select("*")
            .eq("status", "hidden")
            .order("updated_at", { ascending: false });

        if (error) {
            console.error(error);
            return;
        }

        setHiddenPosts(data);
    }

    async function handleDeletePost(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this post?"
        );

        if (!confirmed) return;

        const { error } = await supabase
            .from("posts")
            .delete()
            .eq("id", id);

        if (error) {
            console.error(error);
            setMessage("There was an error deleting the post.");
            return;
        }

        await loadDrafts();
        await loadPublishedPosts();
    }

    async function handleHidePost(id) {
        const { error } = await supabase
            .from("posts")
            .update({
            status: "hidden",
            updated_at: new Date().toISOString(),
            })
            .eq("id", id);

        if (error) {
            console.error(error);
            return;
        }

        await loadPublishedPosts();
        await loadHiddenPosts();
    }

    async function handleUnhidePost(id) {
        const { error } = await supabase
            .from("posts")
            .update({
                status: "published",
                updated_at: new Date().toISOString(),
                published_at: new Date().toISOString(),
            })
            .eq("id", id);

        if (error) {
            console.error(error);
            return;
        }

        await loadPublishedPosts();
        await loadHiddenPosts();
    }

    async function handleSavePost(formData) {
        if (!formData.content || formData.content === "<p></p>") {
            setMessage("Post content is required.");
            return;
        }

        const postData = {
            ...formData,
            updated_at: new Date().toISOString(),
            published_at:
                formData.status === "published"
                    ? originalPublishedAt || new Date().toISOString()
                    : null,
        };

        let error;

        if (editingPost) {
            const result = await supabase
                .from("posts")
                .update(postData)
                .eq("id", editingPost.id);

            error = result.error;
        } else {
            const result = await supabase
                .from("posts")
                .insert([postData]);

            error = result.error;
        }

        if (error) {
            console.error(error);
            setMessage("There was an error saving the post.");
            return;
        }

        setEditingPost(null);
        setOriginalPublishedAt(null);

        await loadDrafts();
        await loadPublishedPosts();
        await loadHiddenPosts();

        setMessage(
            formData.status === "draft"
                ? "Draft saved successfully."
                : "Post published successfully."
        );
    }

    function handleCancelEditing() {
        setEditingPost(null);
        setOriginalPublishedAt(null);
        loadDrafts();
    }

    if (loading) {
        return <p className="p-6">Loading...</p>;
    }

    if (session) {
        return (
            <main className="p-6">
                <h1 className="text-3xl font-bold mb-6">Create Blog Post</h1>

                <BlogPostForm
                    initialPost={editingPost}
                    onSave={handleSavePost}
                    onCancel={handleCancelEditing}
                    message={message}
                />

                <details className="mt-10 max-w-2xl" open>
                    <summary className="cursor-pointer text-2xl font-bold">
                        Drafts ({drafts.length})
                    </summary>

                    <div className="mt-4">
                        {drafts.length === 0 ? (
                            <p>No drafts saved.</p>
                        ) : (
                            <div className="space-y-3">
                                {drafts.map((draft) => (
                                    <div key={draft.id} className="border rounded p-4">
                                        <h3 className="font-semibold">{draft.title}</h3>
                                        <p>{draft.summary}</p>

                                        <button
                                            type="button"
                                            disabled={editingPost !== null}
                                            onClick={() => {
                                                setEditingPost(draft);

                                                setDrafts((currentDrafts) =>
                                                    currentDrafts.filter((item) => item.id !== draft.id)
                                                );
                                            }}
                                            className="mt-3 rounded border px-3 py-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDeletePost(draft.id)}
                                            disabled={editingPost !== null}
                                            className="mt-3 ml-2 rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700 disabled:opacity-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </details>

                <details className="mt-10 max-w-2xl">
                    <summary className="cursor-pointer text-2xl font-bold">
                        Published Posts ({publishedPosts.length})
                    </summary>

                    <div className="mt-4">
                        {publishedPosts.length === 0 ? (
                            <p>No published posts.</p>
                        ) : (
                            <div className="space-y-3">
                                {publishedPosts.map((post) => (
                                    <div key={post.id} className="border rounded p-4">
                                        <h3 className="font-semibold">{post.title}</h3>
                                        <p>{post.summary}</p>

                                        <div className="mt-3 flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => handleHidePost(post.id)}
                                                className="rounded bg-gray-600 px-3 py-1 text-white"
                                            >
                                                Hide
                                            </button>

                                            <button
                                                type="button"
                                                disabled={editingPost !== null}
                                                onClick={() => {
                                                    setEditingPost(post);
                                                    setOriginalPublishedAt(post.published_at);
                                                }}
                                                className="rounded border px-3 py-1"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDeletePost(post.id)}
                                                className="rounded bg-red-600 px-3 py-1 text-white"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </details>

                <details className="mt-10 max-w-2xl">
                    <summary className="cursor-pointer text-2xl font-bold">
                        Hidden Posts ({hiddenPosts.length})
                    </summary>

                    <div className="mt-4">
                        {hiddenPosts.length === 0 ? (
                            <p>No hidden posts.</p>
                        ) : (
                            <div className="space-y-3">
                                {hiddenPosts.map((post) => (
                                    <div key={post.id} className="border rounded p-4">
                                        <h3 className="font-semibold">{post.title}</h3>
                                        <p>{post.summary}</p>

                                        <button
                                            type="button"
                                            onClick={() => handleUnhidePost(post.id)}
                                            className="mt-3 rounded bg-blue-600 px-3 py-1 text-white"
                                        >
                                            Unhide
                                        </button>

                                        <button
                                            type="button"
                                            disabled={editingPost !== null}
                                            onClick={() => {
                                                setEditingPost(post);
                                                setOriginalPublishedAt(post.published_at);
                                            }}
                                            className="rounded border px-3 py-1"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDeletePost(post.id)}
                                            className="mt-3 ml-2 rounded bg-red-600 px-3 py-1 text-white"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </details>
            </main>
        );
    }

    return (
        <AdminLogin />
    );
}

export default Admin;