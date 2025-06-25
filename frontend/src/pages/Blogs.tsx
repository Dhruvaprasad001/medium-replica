import { BlogCards } from "../components/BlogCards"
import { BlogSkeleton } from "../components/BlogSkeleton"
import { useBlogs } from "../hooks"


export const Blogs = () =>{

    const {loading, blogs, error} = useBlogs()

    if(loading){
        return<>
            <div className=" flex flex-col justify-center items-center ">
                <BlogSkeleton />
                <BlogSkeleton />
                <BlogSkeleton />
                <BlogSkeleton />
                <BlogSkeleton />

            </div>
        </>
    }

    if(error){
        return<>
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
        </>
    }

    return <div>
        <div className="flex justify-center items-center ">

            <div className=" max-w-xl w-full">
                {blogs.map(blog=> <BlogCards 
                key={blog.id}
                id={blog.id}
                authorName={blog.author.name} 
                title={blog.title} 
                content={blog.content}
                publishDate="27-12-24"  />
                )}    
            </div>
        </div>
    </div>
}