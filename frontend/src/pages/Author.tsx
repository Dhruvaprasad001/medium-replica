import { useParams } from "react-router-dom";
import { AppBar } from "../components/AppBar";
import { BlogCards } from "../components/BlogCards";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { Spinner } from "../components/Spinner";
import { useAuthorPosts } from "../hooks";

export const Author = () => {
    const { authorId } = useParams<{ authorId: string }>();
    const { loading, authorData } = useAuthorPosts({ authorId: authorId || "" });

    if (loading) {
        return (
            <div>
                <AppBar />
                <div className="flex justify-center">
                    <div className="max-w-xl">
                        <div className="p-4">
                            <Spinner />
                        </div>
                        <BlogSkeleton />
                        <BlogSkeleton />
                        <BlogSkeleton />
                    </div>
                </div>
            </div>
        );
    }

    if (!authorData) {
        return (
            <div>
                <AppBar />
                <div className="flex justify-center">
                    <div className="max-w-xl p-4">
                        <div className="text-center text-gray-500">
                            <h2 className="text-2xl font-bold mb-2">Author Not Found</h2>
                            <p>The author you're looking for doesn't exist or has no posts.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const { author, posts, totalPosts } = authorData;

    return (
        <div>
            <AppBar />
            <div className="flex justify-center">
                <div className="max-w-4xl w-full px-4">
                    {/* Author Header */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 bg-gray-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                {author.name?.[0]?.toUpperCase() || "?"}
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{author.name}</h1>
                                {author.description && (
                                    <p className="text-gray-600 mb-2">{author.description}</p>
                                )}
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span>{totalPosts} {totalPosts === 1 ? 'post' : 'posts'}</span>
                                    {author.email && (
                                        <span>• {author.email}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Posts Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Posts by {author.name}
                        </h2>
                        
                        {posts.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                <p>This author hasn't published any posts yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {posts.map(post => (
                                    <BlogCards
                                        key={post.id}
                                        id={post.id}
                                        authorName={author.name || "Anonymous"}
                                        title={post.title}
                                        content={post.content}
                                        publishDate={post.publishedDate}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}; 