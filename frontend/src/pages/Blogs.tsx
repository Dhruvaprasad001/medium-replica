import Lottie from "lottie-react"
import { AppBar } from "../components/AppBar"
import { BlogCards } from "../components/BlogCards"
import { BlogSkeleton } from "../components/BlogSkeleton"
import { useBlogs } from "../hooks"
import animationData from "../../public/Animation.json"
import animationData2 from "../../public/Animation2.json"

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
        <div className="flex justify-start items-start ">
            <div className="flex flex-col gap-4 w-[35%] justify-start ">
                <Lottie animationData={animationData} loop={true} />
                <Lottie animationData={animationData2} loop={true} className="mt-[200px]"/>
            </div>

            <div className=" max-w-xl w-full">
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