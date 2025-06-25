import { useParams } from "react-router-dom";
import { FullBlog } from "../components/FullBlog";
import { useBlog, useBLOG } from "../hooks";
import { Spinner } from "../components/Spinner";

export const Blog = () => {
    const { id, title } = useParams();  // Get id or title from the URL
    const { loading, blog, error } = id ? useBlog({ id }) : useBLOG({ title: title || "" });

    if (loading) {
        return (
            <div className="h-screen flex flex-col justify-center items-center">
                <div className="flex justify-center">
                    <Spinner />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center mt-8">
                <div className="text-red-500 text-lg">
                    {error}
                </div>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="flex flex-col justify-center items-center">
                Blog not found.
            </div>
        );
    }

    return (
        <div>
            <FullBlog blog={blog} />
        </div>
    );
};
