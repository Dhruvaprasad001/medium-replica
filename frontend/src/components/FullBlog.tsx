import { useRef, useState } from 'react';
import { Blog } from "../hooks";
import { AppBar } from "./AppBar";  
import { AuthorImage } from "./BlogCards";
import { BACKEND_URL } from "../config";

export const FullBlog = ({ blog, summary }: { blog: Blog; summary: string }) => {
    const [showSummary, setShowSummary] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isLoadingTTS, setIsLoadingTTS] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handleSummaryToggle = () => {
        setShowSummary(!showSummary);
    };

    const handleTTS = async () => {
        setIsLoadingTTS(true);
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("No token found. Please login first.");
            setIsLoadingTTS(false);
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/api/v1/blog/tts/${blog.id}`, {
                method: "GET",
                headers: {
                    "Authorization": `${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("TTS request failed");
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            // If audio is already set to same blob, do nothing
            if (audioUrl) URL.revokeObjectURL(audioUrl); // cleanup old blob

            setAudioUrl(url);

            // Delay to ensure audio source is set before playing
            setTimeout(() => {
                audioRef.current?.play().catch(err => {
                    console.error("Autoplay failed:", err);
                });
            }, 100);
        } catch (err) {
            console.error("Failed to fetch TTS audio:", err);
        } finally {
            setIsLoadingTTS(false);
        }
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
                            <div className="text-slate-500">"Learning is the key to growth."
                        </div>
                        </div>
                    </div>

                    {/* Summary Toggle */}
                    <div className="pt-10">
                        <button
                            onClick={handleSummaryToggle}
                            type="button"
                            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 
                            font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                        >
                            {showSummary ? 'Hide Summary' : 'Show Summary'}
                        </button>
                    </div>

                    {/* TTS Button */}
                    <div className="pt-5">
                        <button
                            onClick={handleTTS}
                            type="button"
                            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 
                            font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                            disabled={isLoadingTTS}
                        >
                            {isLoadingTTS ? 'Generating Audio...' : 'Play TTS'}
                        </button>
                    </div>

                    {/* Audio Player */}
                    <div className="pt-4">
                        <audio
                            ref={audioRef}
                            controls
                            className="w-full"
                            src={audioUrl || undefined}
                        >
                            Your browser does not support the audio element.
                        </audio>
                        {audioUrl && (
                            <a
                                href={audioUrl}
                                download="tts.mp3"
                                className="block mt-2 text-blue-600 underline text-sm"
                            >
                                Download Audio
                            </a>
                        )}
                    </div>

                    {/* Summary Renderer */}
                    {showSummary && <SummaryRenderer summary={summary} />}
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
    return (
        <div>
            <h3 className="text-xl font-semibold pt-8">Summary:</h3>
            <p>{summary || "No summary available"}</p>
        </div>
    );
}
