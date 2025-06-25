import { Link } from "react-router-dom"
import { useMemo } from "react"

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
    
    // Memoize expensive calculations
    const currentDate = useMemo(() => {
        const date = new Date();
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }, []);
    
    const readingTime = useMemo(() => {
        const words = content.split(/\s+/).length;
        const averageWordsPerMinute = 200;
        return Math.ceil(words / averageWordsPerMinute);
    }, [content]);
    
    const truncatedContent = useMemo(() => {
        return content.slice(0, 100) + "...";
    }, [content]);
    
    const displayName = authorName || "Anonymous";

    return <div className="px-3 pt-3 border-b border-slate-200 pb-4 ">
            <div className="flex pb-2">
                <AuthorImage size="small" name={displayName}/> 
                <div className="flex justify-center flex-col font-extralight mx-1 text-sm text-slate-800 ">
                    {displayName}
                </div> 
                <div className="flex justify-center flex-col px-1">
                    <Circle/>
                </div>
                <div className="flex justify-center flex-col font-thin text-slate-500 text-sm">
                    {currentDate}
                </div>
            </div>
            <Link to={`/blog/${id}`}>
            <div className="text-xl font-bold cursor-pointer">
                {title}
            </div>
            </Link>
            <div className="text-md font-thin">
                {truncatedContent}
            </div>
            <div className="text-sm font-thin text-slate-400 mt-4">
                {`${readingTime} minute(s) read`}
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
