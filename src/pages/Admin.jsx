import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import AdminLogin from "../components/adminPage/AdminLogin";
import BlogPostForm from "../components/adminPage/BlogPostForm";
import PostList from "../components/adminPage/PostList";
import { loadDrafts, loadPublishedPosts, loadHiddenPosts, deletePost, hidePost, unhidePost } from "../components/adminPage/AdminPost";

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
            refreshPosts();
        }
    }, [session]);

    async function refreshPosts() {
        const draftsResult = await loadDrafts();
        const publishedResult = await loadPublishedPosts();
        const hiddenResult = await loadHiddenPosts();

        if (!draftsResult.error) setDrafts(draftsResult.data);
        if (!publishedResult.error) setPublishedPosts(publishedResult.data);
        if (!hiddenResult.error) setHiddenPosts(hiddenResult.data);
    }
    
    async function handleDeletePost(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this post?"
        );

        if (!confirmed) return;

        const { error } = await deletePost(id);

        if (error) {
            console.error(error);
            setMessage("There was an error deleting the post.");
            return;
        }

        await refreshPosts();
    }

    async function handleHidePost(id) {
        const { error } = await hidePost(id);

        if (error) {
            console.error(error);
            return;
        }

        await refreshPosts();
    }

    async function handleUnhidePost(id) {
        const { error } = await unhidePost(id);

        if (error) {
            console.error(error);
            return;
        }
        
        await refreshPosts();
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

        await refreshPosts();

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

                <PostList
                    title="Drafts"
                    status="draft"
                    posts={drafts}
                    editingPost={editingPost}
                    onEdit={(post) => {
                        setEditingPost(post);
                    }}
                    onDelete={handleDeletePost}
                />

                <PostList
                    title="Published Posts"
                    status="published"
                    posts={publishedPosts}
                    editingPost={editingPost}
                    onEdit={(post) => {
                        setEditingPost(post);
                        setOriginalPublishedAt(post.published_at);
                    }}
                    onDelete={handleDeletePost}
                    onHide={handleHidePost}
                />  

                <PostList
                    title="Hidden Posts"
                    status="hidden"
                    posts={hiddenPosts}
                    editingPost={editingPost}
                    onEdit={(post) => {
                        setEditingPost(post);
                        setOriginalPublishedAt(post.published_at);
                    }}
                    onDelete={handleDeletePost}
                    onUnhide={handleUnhidePost}
                />                
            </main>
        );
    }

    return (
        <AdminLogin />
    );
}

export default Admin;