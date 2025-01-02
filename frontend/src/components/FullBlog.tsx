import { useState } from 'react'; 
import { Blog } from "../hooks"
import { AppBar } from "./AppBar"
import { AuthorImage } from "./BlogCards"

export const FullBlog = ({ blog, summary }: { blog: Blog; summary: string }) => {
    const [showSummary, setShowSummary] = useState(false);

    const handleSummaryToggle = () => {
        setShowSummary(!showSummary);
    };

    return (
        <div>
            <AppBar />
            <div className="grid grid-cols-12 w-full px-12 pt-10 pb-20">
                <div className="px-12 lg:col-span-8 col-span-12">
                    <div className="font-bold text-5xl pb-5">{blog.title}</div>
                    <div className="text-slate-400 pb-4">Posted on {date()}</div>
                    <div className="text-xl" style={{ whiteSpace: 'pre-wrap' }}>
                        {blog.content}
                    </div>
                </div>
                <div className="col-span-4 flex-col px-4 lg:col-span-4 hidden lg:block">
                    <div className="pl-3 font-semibold">Author</div>
                    <div className="flex flex-row pt-4">
                        <div className="pt-5 px-3">
                            <AuthorImage name={blog.author.name || "Anonymous"} size="big" />
                        </div>
                        <div>
                            <div className="font-bold text-2xl">{blog.author.name || "Anonymous"}</div>
                            <div className="text-slate-500">Some random catchphrase...</div>
                        </div>
                    </div>

                    <div className="pt-10">
                        <button
                            onClick={handleSummaryToggle}
                            type="button"
                            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 
                            font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
                            {showSummary ? 'Hide Summary' : 'Show Summary'}
                        </button>
                    </div>

                    {showSummary && <SummaryRenderer summary={summary} />} {/* Pass summary as a string */}
                </div>
            </div>
        </div>
    );
};


export function date() {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    return formattedDate;
}

interface SummaryRendererProps {
    summary: string;
}

function SummaryRenderer({ summary }: SummaryRendererProps) {
    return <div>
        <h3 className="text-xl font-semibold">Summary:</h3>
        <p>{summary || "No summary available"}</p>  {/* Directly render the summary string */}
    </div>;
}

