import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import RichTextEditor from "../components/RichTextEditor";

function Admin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [tag, setTag] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [slug, setSlug] = useState("");
    const [drafts, setDrafts] = useState([]);
    const [editingPostId, setEditingPostId] = useState(null);
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

    async function handleLogin(event) {
        event.preventDefault();
        setMessage("");

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setMessage(error.message);
            return;
        }

        setMessage("Successfully signed in.");
    }

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

    const handleCreatePost = async (event) => {
        event.preventDefault();

        if (!content || content === "<p></p>") {
            setMessage("Post content is required.");
            return;
        }

        const status = event.nativeEvent.submitter.value;

        const postData = {
            title,
            summary,
            content,
            tag,
            image_url: imageUrl,
            slug,
            status,
            updated_at: new Date().toISOString(),
            published_at:
                status === "published"
                    ? originalPublishedAt || new Date().toISOString()
                    : null,
        };

        let error;
        if (editingPostId) {
            const { data, error: updateError } = await supabase
                .from("posts")
                .update(postData)
                .eq("id", editingPostId)
                .select();

            error = updateError;
            } else {
        const result = await supabase
            .from("posts")
            .insert([postData]);

        error = result.error;
        }

        if (error) {
            console.error(error);
            setMessage("There was an error creating the post.");
            return;
        }

        await loadDrafts();
        await loadPublishedPosts();

        setMessage(
            status === "draft"
                ? "Draft saved successfully."
                : "Post created successfully."
        );

        setTitle("");
        setTag("");
        setSummary("");
        setContent("");
        setImageUrl("");
        setSlug("");
        setEditingPostId(null);
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

    if (loading) {
        return <p className="p-6">Loading...</p>;
    }

    if (session) {
        return (
            <main className="p-6">
                <h1 className="text-3xl font-bold mb-6">Create Blog Post</h1>

                <form onSubmit={handleCreatePost} className="max-w-2xl space-y-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        className="w-full border rounded p-2"
                        required
                    />

                    <input
                        type="text"
                        placeholder="Slug"
                        value={slug}
                        onChange={(event) => setSlug(event.target.value)}
                        className="w-full border rounded p-2"
                        required
                    />

                    <input
                        type="text"
                        placeholder="Tag"
                        value={tag}
                        onChange={(event) => setTag(event.target.value)}
                        className="w-full border rounded p-2"
                        required
                    />

                    <input
                        type="text"
                        placeholder="One-sentence summary"
                        value={summary}
                        onChange={(event) => setSummary(event.target.value)}
                        className="w-full border rounded p-2"
                        required
                    />

                    <RichTextEditor
                        content={content}
                        onChange={setContent}
                    />

                    <input
                        type="url"
                        placeholder="Image URL (optional)"
                        value={imageUrl}
                        onChange={(event) => setImageUrl(event.target.value)}
                        className="w-full border rounded p-2"
                    />

                    {editingPostId && (
                        <button
                            type="button"
                            onClick={async () => {
                                setEditingPostId(null);
                                setTitle("");
                                setTag("");
                                setSummary("");
                                setContent("");
                                setImageUrl("");
                                setSlug("");

                                await loadDrafts();
                            }}
                            className="rounded border px-4 py-2"
                        >
                            Cancel Editing
                        </button>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            value="draft"
                            className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
                        >
                            Save as Draft
                        </button>

                        <button
                            type="submit"
                            value="published"
                            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 cursor-pointer"
                        >
                            Publish
                        </button>
                    </div>

                    {message && <p>{message}</p>}
                </form>

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
                                            disabled={editingPostId !== null}
                                            onClick={() => {
                                                setEditingPostId(draft.id);
                                                setTitle(draft.title);
                                                setTag(draft.tag);
                                                setSummary(draft.summary);
                                                setContent(draft.content);
                                                setImageUrl(draft.image_url || "");
                                                setSlug(draft.slug || "");
                                                setOriginalPublishedAt(post.published_at);

                                                setDrafts((currentDrafts) =>
                                                    currentDrafts.filter(
                                                        (item) => item.id !== draft.id
                                                    )
                                                );
                                            }}
                                            className="mt-3 rounded border px-3 py-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDeletePost(draft.id)}
                                            disabled={editingPostId !== null}
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
                                                disabled={editingPostId !== null}
                                                onClick={() => {
                                                    setEditingPostId(post.id);
                                                    setTitle(post.title);
                                                    setTag(post.tag);
                                                    setSummary(post.summary);
                                                    setContent(post.content);
                                                    setImageUrl(post.image_url || "");
                                                    setSlug(post.slug || "");
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

    {/* This is the login form */}
    return (
        <main className="p-6">
            <h1 className="text-3xl font-bold mb-6">Admin</h1>

            <form onSubmit={handleLogin} className="max-w-md space-y-4">
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full border rounded p-2"
                required
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full border rounded p-2"
                required
            />

            <button
                type="submit"
                className="border rounded px-4 py-2 cursor-pointer"
            >
                Sign In
            </button>

            {message && <p>{message}</p>}
            </form>

            
        </main>
    );
}

export default Admin;