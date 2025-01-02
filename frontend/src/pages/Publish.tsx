import { ChangeEvent, useState } from "react"
import { AppBar } from "../components/AppBar"
import axios from "axios"
import { BACKEND_URL } from "../config"
import { useNavigate } from "react-router-dom"

export const Publish = () =>{

    const [title , setTitle] = useState("")
    const [content , setContent] = useState("")
    const navigate = useNavigate()

    return <div>    
        <AppBar />
        <div>

            <div className="max-w-5xl mx-auto  ">
                <input 
                onChange={(e)=>{
                    setTitle(e.target.value)
                }}
                type="text"
                placeholder="Title" 
                className="text-4xl font-light w-full focus:outline-none placeholder-gray-400 pl-3"/>
            </div>
            <TextSpace onChange={(e) =>{
                setContent(e.target.value)
            }} />
            <div className="flex ml-10 justify-center">
                <button onClick={async ()=>{
                    const response = await axios.post(`${BACKEND_URL}/api/v1/blog`,{
                        title,
                        content
                    },{
                        headers:{
                            Authorization : localStorage.getItem("token")
                        }
                    })
                    navigate(`/blog/${response.data.id}`)
                }}
                    className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition-colors duration-200">
                    Publish Post
                </button>
            </div>
        </div>
    </div>
}

function TextSpace({ onChange }:{ onChange: (e: ChangeEvent<HTMLTextAreaElement>)=> void }){
    return <div className="max-w-5xl mx-auto p-3 space-y-6">
    <div className="flex items-center gap-4">
    </div>
    <textarea onChange={onChange}
      placeholder="Tell your story..." 
      className="w-full min-h-[400px] text-lg resize-none focus:outline-none placeholder-gray-400 p-4 rounded-md"/>
  </div>
}