import { useEffect, useState } from "react"
import axios from "axios";
import { BACKEND_URL } from "../config";


export interface Blog {
    "content": string;
    "title": string;
    "id": number,
    "publishedDate":string,
    "likes":number,
    "author": {
        "name": string
    }
}

    export const useBlog = ({ id }: {id:string}) => {
        const [loading, setLoading] = useState(true);
        const [blog, setBlog] = useState<Blog>();
        const [error, setError] = useState<string | null>(null);

        useEffect(() => {
            if (!id) return;
            
            const abortController = new AbortController();
            
            setLoading(true);
            setError(null);
            
            axios.get(`${BACKEND_URL}/api/v1/blog/${id}`,{
                headers:{
                    Authorization: localStorage.getItem("token")
                },
                signal: abortController.signal
            })
                .then(response => {
                    if (!abortController.signal.aborted) {
                        setBlog(response.data.post);
                        setLoading(false);
                    }
                })
                .catch(error => {
                    if (!abortController.signal.aborted) {
                        console.error("Error fetching blog:", error);
                        setError("Failed to load blog");
                        setLoading(false);
                    }
                });
                
            return () => abortController.abort();
        }, [id])

        return {
            loading,
            blog,
            error
        }
    }

    export const useBLOG = ({ title }: {title:string}) => {
        const [loading, setLoading] = useState(true);
        const [blog, setBlog] = useState<Blog>();
        const [error, setError] = useState<string | null>(null);

        useEffect(() => {
            if (!title) return;
            
            const abortController = new AbortController();
            
            setLoading(true);
            setError(null);
            
            axios.get(`${BACKEND_URL}/api/v1/blog/by-title/${title}`,{
                headers:{
                    Authorization: localStorage.getItem("token")
                },
                signal: abortController.signal
            })
                .then(response => {
                    if (!abortController.signal.aborted) {
                        setBlog(response.data.post);
                        setLoading(false);
                    }
                })
                .catch(error => {
                    if (!abortController.signal.aborted) {
                        console.error("Error fetching blog by title:", error);
                        setError("Failed to load blog");
                        setLoading(false);
                    }
                });
                
            return () => abortController.abort();
        }, [title])

        return {
            loading,
            blog,
            error
        }
    }


export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk`,{
            headers:{
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                setBlogs(response.data.posts);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching blogs:", error);
                setError("Failed to load blogs");
                setLoading(false);
            });
    }, [])

    return {
        loading,
        blogs,
        error
    }
}

export const useSummary = ({ id }: {id:string}) =>{
    
    const [loading , setLoading] = useState(true)
    const [summary , setSummary] = useState<string>("")
    const [error, setError] = useState<string | null>(null);
    
    useEffect(()=>{
        if (!id) return;
        
        const abortController = new AbortController();
        
        setLoading(true);
        setError(null);
        
        axios.get(`${BACKEND_URL}/api/v1/blog/summarize/${id}` , {
            headers:{
                Authorization : localStorage.getItem("token")
            },
            signal: abortController.signal
        }).then(response =>{
            if (!abortController.signal.aborted) {
                setSummary(response.data.summary)
                setLoading(false)
            }
        }).catch(error => {
            if (!abortController.signal.aborted) {
                console.error("Error fetching summary:", error);
                setError("Failed to load summary");
                setLoading(false);
            }
        });
        
        return () => abortController.abort();
    }, [id])

    return {
        loading,
        summary,
        error
    }
}

export const useUserInfo = () => {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [designation, setDesignation] = useState("");

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/user/name`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            setUsername(response.data.name);
            setDesignation(response.data.description);
            setLoading(false);
        }).catch(error => {
            console.error("Error fetching user info:", error);
            setLoading(false);
        });
    }, []);

    return {
        loading,
        username,
        designation
    };
}

export interface Author {
    id: string;
    name: string;
    description: string;
    postCount: number;
}

export const useSearchAuthors = ({ searchTerm }: {searchTerm:string}) =>{

    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState<Author[]>([])

    useEffect(()=>{
        if (!searchTerm || searchTerm.trim().length === 0) {
            setResults([]);
            setLoading(false);
            return;
        }

        // Debounce the search to avoid excessive API calls
        const debounceTimer = setTimeout(() => {
            setLoading(true);
            axios.get(`${BACKEND_URL}/api/v1/blog/search/authors/${searchTerm.trim()}`,{
                headers:{
                    Authorization : localStorage.getItem("token")
                }
            }).then(response =>{
                setResults(response.data.authors || [])
                setLoading(false)
            }).catch(error => {
                console.error("Search error:", error);
                setResults([]);
                setLoading(false);
            })
        }, 300); // 300ms delay

        // Cleanup function to cancel the previous timer
        return () => clearTimeout(debounceTimer);
    }, [searchTerm])

    return {
        loading,
        results
    }
}

export interface AuthorWithPosts {
    author: {
        id: string;
        name: string;
        description: string;
        email: string;
    };
    posts: Blog[];
    totalPosts: number;
}

export const useAuthorPosts = ({ authorId }: {authorId: string}) => {
    const [loading, setLoading] = useState(true);
    const [authorData, setAuthorData] = useState<AuthorWithPosts | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!authorId) return;

        setLoading(true);
        setError(null);
        axios.get(`${BACKEND_URL}/api/v1/blog/author/${authorId}/posts`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
        .then(response => {
            setAuthorData(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching author posts:", error);
            setError("Failed to load author data");
            setAuthorData(null);
            setLoading(false);
        });
    }, [authorId]);

    return {
        loading,
        authorData,
        error
    };
}

export const useLikePost = () => {
    const [isLiking, setIsLiking] = useState(false);

    const likePost = async (postId: number) => {
        setIsLiking(true);
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/blog/like/${postId}`, {}, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            });
            setIsLiking(false);
            return response.data.likes;
        } catch (error) {
            console.error("Error liking post:", error);
            setIsLiking(false);
            throw error;
        }
    };

    const unlikePost = async (postId: number) => {
        setIsLiking(true);
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/blog/unlike/${postId}`, {}, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            });
            setIsLiking(false);
            return response.data.likes;
        } catch (error) {
            console.error("Error unliking post:", error);
            setIsLiking(false);
            throw error;
        }
    };

    return {
        likePost,
        unlikePost,
        isLiking
    };
}