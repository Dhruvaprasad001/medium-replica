import { AppBar } from "../components/AppBar"
import { BlogCards } from "../components/BlogCards"
import { BlogSkeleton } from "../components/BlogSkeleton"
import { useBlogs } from "../hooks"

export const Blogs = () =>{

    const {loading , blogs} = useBlogs()

    if(loading){
        return<>
            <AppBar />
            <div className=" flex flex-col justify-center items-center ">
                <BlogSkeleton />
                <BlogSkeleton />
                <BlogSkeleton />
                <BlogSkeleton />
                <BlogSkeleton />

            </div>
        </>
    }

    return <div>
        <div>
            <AppBar />
        </div>
        <div className="flex justify-center ">
            <div className=" max-w-xl">
                {blogs.map(blog=> <BlogCards 
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