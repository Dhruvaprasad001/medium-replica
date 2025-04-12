import { useParams } from "react-router-dom";
import { FullBlog } from "../components/FullBlog";
import { useBlog, useBLOG, useSummary } from "../hooks";
import { Spinner } from "../components/Spinner";

export const Blog = () => {
    const { id, title } = useParams();  // Get id or title from the URL
    const { loading, blog } = id ? useBlog({ id }) : useBLOG({ title: title || "" });
    const { summary } = useSummary({ id: id || "" });

    if (loading) {
        return (
            <div className="h-screen flex flex-col justify-center items-center">
                <div className="flex justify-center">
                    <Spinner />
                </div>
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
            <FullBlog blog={blog} summary={summary} />
        </div>
    );
};
