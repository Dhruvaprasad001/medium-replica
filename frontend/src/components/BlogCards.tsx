import { Link } from "react-router-dom"
import { date } from "./FullBlog"

interface BlogCardsInput{
    authorName:string 
    title:string
    content:string 
    publishDate:string
    id:number
}
export const BlogCards = ({
    id,
    authorName ,
    title,
    content,
}:BlogCardsInput) =>{
    return <div className="px-3 pt-3 border-b border-slate-200 pb-4 ">
            <div className="flex pb-2">
                <AuthorImage size="small" name={authorName ? authorName : "Anonymus"}/> 
                <div className="flex justify-center flex-col font-extralight mx-1 text-sm text-slate-800 ">
                    {authorName ? authorName : "Anonymus"}
                </div> 
                <div className="flex justify-center flex-col px-1">
                    <Circle/>
                </div>
                <div className="flex justify-center flex-col font-thin text-slate-500 text-sm">
                    {date()}
                </div>
            </div>
            <Link to={`/blog/${id}`}>
            <div className="text-xl font-bold cursor-pointer">
                {title}
            </div>
            </Link>
            <div className="text-md font-thin">
                {content.slice(0, 100)+ "..."}
            </div>
            <div className="text-sm font-thin text-slate-400 mt-4">
                {`${calculateReadingTime(content)} minute(s) read`}
            </div>   
    </div>
}
export function AuthorImage({ name, size }: { name: string, size: 'big' | 'small' }) {
    const sizeClass = size === 'big' ? 'w-9 h-9' : 'w-7 h-7';

    return (
        <div className={`mr-2 relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gray-600 pb-0.5 ${sizeClass}`}>
            <span className="font-medium text-gray-400">
                {name[0]}
            </span>
        </div>
    );
}


function Circle(){
    return <div className="rounded-full h-1 w-1  bg-gray-500 ml-1 mr-1">
        
    </div>
}
    const calculateReadingTime = (content: string) => {
        const words = content.split(/\s+/).length;  // Split content by spaces and count words
        const averageWordsPerMinute = 200;  // Average reading speed in words per minute
        const minutes = Math.ceil(words / averageWordsPerMinute); // Round up to the nearest whole number
        return minutes;
    };
