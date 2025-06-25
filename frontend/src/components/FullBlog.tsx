import { useRef, useState, useMemo, useEffect } from 'react';
import { Blog, useLikePost, useSummary } from "../hooks";
import { AuthorImage } from "./BlogCards";
import { BACKEND_URL } from "../config";
import like from "../../public/thumb-up.svg"
import likeInactive from "../../public/thumb-up-inactive.svg"

export const FullBlog = ({ blog }: { blog: Blog }) => {
    const [showSummary, setShowSummary] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isLoadingTTS, setIsLoadingTTS] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(blog.likes || 0);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { likePost, unlikePost, isLiking } = useLikePost();
    
    // Only fetch summary when user wants to see it
    const { summary, error: summaryError, loading: summaryLoading } = useSummary({ 
        id: showSummary ? blog.id.toString() : "" 
    });

    // Memoize the date to prevent unnecessary recalculations
    const currentDate = useMemo(() => {
        const date = new Date();
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }, []);

    // Cleanup audio URL on unmount to prevent memory leaks
    useEffect(() => {
        return () => {
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [audioUrl]);

    const handleSummaryToggle = () => {
        setShowSummary(!showSummary);
    };

    const handleLikeToggle = async () => {
        if (isLiking) return; // Prevent multiple clicks
        
        try {
            if (isLiked) {
                // User has liked it, so unlike it
                const newLikesCount = await unlikePost(blog.id);
                setLikesCount(newLikesCount);
                setIsLiked(false);
            } else {
                // User hasn't liked it, so like it
                const newLikesCount = await likePost(blog.id);
                setLikesCount(newLikesCount);
                setIsLiked(true);
            }
        } catch (error) {
            console.error("Failed to toggle like:", error);
        }
    };

    const handleTTS = async () => {
        if (isLoadingTTS) return; // Prevent multiple simultaneous requests
        
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

            // Cleanup old blob URL before setting new one
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }

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
            <div className="grid grid-cols-12 w-full px-12 pt-10 pb-20">
                <div className="px-12 lg:col-span-8 col-span-12">
                    <div className="font-bold text-5xl pb-5">{blog.title}</div>
                    <div className="flex flex-row gap-20">
                        <div className="text-slate-400 pb-4">Posted on {currentDate}</div>
                        <div className="flex flex-row gap-2 items-center">
                            <button 
                                onClick={handleLikeToggle}
                                disabled={isLiking}
                                className="flex items-center hover:opacity-80 transition-opacity disabled:opacity-50"
                                title={isLiked ? "Unlike this post" : "Like this post"}
                            >
                                <img 
                                    src={isLiked ? like : likeInactive} 
                                    alt="like" 
                                    width={20} 
                                    height={20} 
                                    className="w-6 h-6 mb-4" 
                                />
                            </button>
                            <div className="text-slate-400 pb-4">{likesCount}</div>
                        </div>
                    </div>
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
                    {showSummary && (
                        <SummaryRenderer 
                            summary={summaryError ? "Summary could not be loaded" : summary} 
                            loading={summaryLoading}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

interface SummaryRendererProps {
    summary: string;
    loading?: boolean;
}

function SummaryRenderer({ summary, loading }: SummaryRendererProps) {
    return (
        <div>
            <h3 className="text-xl font-semibold pt-8">Summary:</h3>
            {loading ? (
                <div className="flex items-center space-x-2">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    <span>Generating summary...</span>
                </div>
            ) : (
                <p>{summary || "No summary available"}</p>
            )}
        </div>
    );
}
