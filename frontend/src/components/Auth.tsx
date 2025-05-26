import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { BACKEND_URL } from "../config";
import { SignupInput } from "@dhruvaprasad001/medium-common";

export const Auth = ({type}: {type: 'signin' | 'signup'}) =>{
    const navigate = useNavigate()
    const [postInputs , setPostInputs] = useState<SignupInput >({
        email:"",
        password:"",
        name:"",
    })

    async function sendRequest() {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, postInputs);
            const jwt = response.data.jwt;
            localStorage.setItem("token", jwt);
            navigate("/blogs");
        } catch(e) {
            console.log(e);
        }
    }

    return <>
        <div className="h-screen flex justify-center flex-col ">
            <div className="flex justify-center ">
                <div>
                    <div className="text-center mb-6">
                        <div className="text-2xl font-extrabold px-3">
                        {type==="signin"? "LOGIN TO YOUR ACCOUNT" :  "CREATE AN ACCOUNT" }
                        </div>
                        <div className="text-slate-400">
                            {type==="signin"? "Want to create an account" : "ALREADY HAVE AN ACCOUNT? " }
                            <Link to={type==="signin" ?'/signup':'/signin'} className="pl-2 underline">
                                {type==="signin" ?'Sign Up':'Sign In'}
                            </Link>
                        </div>
                        <div className="mt-2">

                        </div>
                    </div>
                    <div>
                    {type === "signup" && (
                                <LabbledInput label="Name" placeholder="Enter name" onChange={e => {
                                    setPostInputs({
                                        ...postInputs,
                                        name: e.target.value,
                                    })
                                }} />
                            )}
                    <LabbledInput label="Username" placeholder="Enter email" onChange={e=>{
                        setPostInputs({
                            ...postInputs,
                            email:e.target.value,
                        })
                    }}/>
                    <LabbledInput label="Password" type='password' placeholder="Enter password (minimum 5 character)" onChange={e=>{
                        setPostInputs({
                            ...postInputs,
                            password:e.target.value,
                        })
                    }} />
                    <button onClick={sendRequest} type="button" className="w-full mt-4 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4
                     focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2
                     dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type==="signin" ? "Sign in" : "Sign up"}</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}

interface LablledInputType {
    label: string ,
    placeholder: string ,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?:string
}


function LabbledInput({label , placeholder , onChange , type}: LablledInputType){
    return <div>
        <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-black mb-3">{label}</label>
            <input
                onChange={onChange}
                type={type || "type"}
                className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg text-sm 
                            placeholder:text-gray-500 focus:outline-none focus:border-gray-300
                            transition-colors duration-200 mb-3"
                placeholder={placeholder}required
                />
        </div>
    </div>
}
