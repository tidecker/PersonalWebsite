function PostList({ title, status, posts, editingPost, onEdit, onDelete, onHide, onUnhide }) {
    return (
        <details className="mt-10 max-w-2xl">
                    <summary className="cursor-pointer text-2xl font-bold">
                        {title} ({posts.length})
                    </summary>

                    <div className="mt-4">
                        {posts.length === 0 ? (
                            <p>No {title.toLowerCase()}.</p>
                        ) : (
                            <div className="space-y-3">
                                {posts.map((post) => (
                                    <div key={post.id} className="border rounded p-4">
                                        <h3 className="font-semibold">{post.title}</h3>
                                        <p>{post.summary}</p>

                                        <button
                                            type="button"
                                            disabled={editingPost !== null}
                                            onClick={() => { onEdit(post); }}
                                            className="mt-3 rounded border px-3 py-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => onDelete(post.id)}
                                            disabled={editingPost !== null}
                                            className="mt-3 ml-2 rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700 disabled:opacity-50"
                                        >
                                            Delete
                                        </button>

                                        {status === "published" && (
                                            <button 
                                            type="button"
                                            className="mt-3 ml-2 rounded bg-gray-600 px-3 py-1 text-white hover:bg-gray-700 disabled:opacity-50"
                                            onClick={() => onHide(post.id)}>
                                                Hide
                                            </button>
                                        )}

                                        {status === "hidden" && (
                                            <button 
                                            type="button"
                                            className="mt-3 ml-2 rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700 disabled:opacity-50"
                                            onClick={() => onUnhide(post.id)}>
                                                Unhide
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </details>
    );
}

export default PostList;