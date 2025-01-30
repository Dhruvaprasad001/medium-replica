import { useEffect, useState } from "react"
import axios from "axios";
import { BACKEND_URL } from "../config";


export interface Blog {
    "content": string;
    "title": string;
    "id": number,
    "publishedDate":string
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