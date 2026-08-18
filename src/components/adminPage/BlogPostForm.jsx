import RichTextEditor from "../../components/RichTextEditor";
import { useEffect, useState  } from "react";

function BlogPostForm({ initialPost = null, onSave, onCancel, message }) {
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [tag, setTag] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        if (initialPost) {
            setTitle(initialPost.title);
            setSlug(initialPost.slug);
            setTag(initialPost.tag);
            setSummary(initialPost.summary);
            setContent(initialPost.content);
            setImageUrl(initialPost.image_url || "");
        } else {
            setTitle("");
            setSlug("");
            setTag("");
            setSummary("");
            setContent("");
            setImageUrl("");
        }
    }, [initialPost]);

    
    function handleSubmit(event) {
    event.preventDefault();

    const status = event.nativeEvent.submitter.value;

    onSave({
        title,
        slug,
        tag,
        summary,
        content,
        image_url: imageUrl,
        status,
    });
}

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
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

                    {initialPost  && (
                        <button
                            type="button"
                            onClick={onCancel}
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

                        {initialPost?.status === "hidden" && (
                            <button
                                type="submit"
                                value="hidden"
                                className="rounded bg-gray-800 px-4 py-2 text-white"
                            >
                                Save Hidden
                            </button>
                        )}

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
    )
}

export default BlogPostForm;