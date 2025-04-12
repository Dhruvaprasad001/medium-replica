import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthorImage } from "./BlogCards";
import { useName } from "../hooks";

export const AppBar = () => {
    const navigate = useNavigate();
    const [ showLogout, setShowLogout ] = useState(false);
    const { username }  = useName() 

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/signin");
    };

    return (
        <div className="w-full h-15 flex justify-between px-10 pb-4 pt-4 border-b border-slate-300 mb-8">
            <div className="flex flex-col justify-center font-semibold text-xl">
                <Link to={'/blogs'}>
                    Edu Bridge
                </Link>
            </div>
            <div className="relative ">
                <Link to={'/publish'}>
                    <button
                        type="button"
                        className="focus:outline-none text-white bg-green-700 hover:bg-green-800 
                        font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2"
                    >
                        New
                    </button>
                </Link>
                <button
                    onClick={() => setShowLogout(!showLogout)}
                    className="focus:outline-none"
                >
                    <AuthorImage size="big" name={username} />
                </button>
                {showLogout && (
                    <div
                        className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-50"
                    >
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


