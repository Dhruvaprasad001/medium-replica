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

        useEffect(() => {
            axios.get(`${BACKEND_URL}/api/v1/blog/${id}`,{
                headers:{
                    Authorization: localStorage.getItem("token")
                }
            })
                .then(response => {
                    setBlog(response.data.post);
                    setLoading(false);
                })
        }, [id])

        return {
            loading,
            blog
        }
    }

    export const useBLOG = ({ title }: {title:string}) => {
        const [loading, setLoading] = useState(true);
        const [blog, setBlog] = useState<Blog>();

        useEffect(() => {
            axios.get(`${BACKEND_URL}/api/v1/blog/by-title/${title}`,{
                headers:{
                    Authorization: localStorage.getItem("token")
                }
            })
                .then(response => {
                    setBlog(response.data.post);
                    setLoading(false);
                })
        }, [title])

        return {
            loading,
            blog
        }
    }


export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk`,{
            headers:{
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                setBlogs(response.data.posts);
                setLoading(false);
            })
    }, [])

    return {
        loading,
        blogs
    }
}

export const useSummary = ({ id }: {id:string}) =>{
    
    const [loadingData , setLoadingData] = useState(true)
    const [summary , setSummary] = useState<string>("")
    
    useEffect(()=>{
        axios.get(`${BACKEND_URL}/api/v1/blog/summarize/${id}` , {
            headers:{
                Authorization : localStorage.getItem("token")
            }
        }).then(response =>{
            setSummary(response.data.summary)
            setLoadingData(false)
        })
    }, [id])

    return {
        loadingData,
        summary
    }
}

export const useName = () =>{

    const [username , setUsername] = useState("")

    useEffect(()=>{
        axios.get(`${BACKEND_URL}/api/v1/user/name` , {
            headers:{
                Authorization : localStorage.getItem("token")
            }
        }).then(response =>{
            setUsername(response.data.name)
        })
    }, [])

    return {
        username
    }
}

export const useDesig = () =>{

    const [designation , setDesignation] = useState("")

    useEffect(()=>{
        axios.get(`${BACKEND_URL}/api/v1/user/name` , {
            headers:{
                Authorization : localStorage.getItem("token")
            }
        }).then(response =>{
            setDesignation(response.data.description)
        })
    }, [])

    return {
        designation
    }
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

    useEffect(() => {
        if (!authorId) return;

        setLoading(true);
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
            setAuthorData(null);
            setLoading(false);
        });
    }, [authorId]);

    return {
        loading,
        authorData
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