import { useParams } from "react-router-dom"
import { FullBlog } from "../components/FullBlog"
import { useBlog, useSummary } from "../hooks"
import { Spinner } from "../components/Spinner"

export const Blog = () => {
    const { id } = useParams()
    const {loading , blog} = useBlog({
        id: id ||""
    })
    const {summary} = useSummary({
        id:id || ""
    })

    if(loading){
        return <div className="h-screen flex flex-col justify-center items-center">
            <div className="flex justify-center">
                <Spinner />
            </div>
        </div>
    }

    if (!blog) {
        return (
            <div className="flex flex-col justify-center items-center">
                Blog not found.
            </div>
        );
    }

    return <div>
            <div>
                <FullBlog blog={blog} summary={summary} />
            </div>
        </div>
}

