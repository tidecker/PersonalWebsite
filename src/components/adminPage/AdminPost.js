import { supabase } from "../../supabaseClient";

export async function loadDrafts() {
    const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("status", "draft")
        .order("updated_at", { ascending: false });

    return { data, error };
}

export async function loadPublishedPosts() {
    const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });

    return { data, error };
}

export async function loadHiddenPosts() {
    const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("status", "hidden")
        .order("updated_at", { ascending: false });

    return { data, error };
}

export async function deletePost(id) {
    return await supabase
        .from("posts")
        .delete()
        .eq("id", id);
}

export async function hidePost(id) {
    return await supabase
        .from("posts")
        .update({
            status: "hidden",
            updated_at: new Date().toISOString(),
        })
        .eq("id", id);
}

export async function unhidePost(id, publishedAt) {
    return await supabase
        .from("posts")
        .update({
            status: "published",
            updated_at: new Date().toISOString(),
            published_at: publishedAt,
        })
        .eq("id", id);
}