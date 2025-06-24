import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { AuthorImage } from "./BlogCards";
import { useName } from "../hooks";
import { useSearchAuthors } from "../hooks";

export const AppBar = () => {
    const navigate = useNavigate();
    const [ showLogout, setShowLogout ] = useState(false);
    const [ showSearchResults, setShowSearchResults ] = useState(false);
    const { username }  = useName() 
    const [searchTerm, setSearchTerm] = useState("");
    const { loading, results } = useSearchAuthors({ searchTerm });
    const searchRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/signin");
    };

    const handleAuthorClick = (authorId: string, authorName: string) => {
        setSearchTerm("");
        setShowSearchResults(false);
        // Navigate to author page - you'll need to create this route
        navigate(`/author/${authorId}`);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        setShowSearchResults(value.trim().length > 0);
    };

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="w-full h-15 flex justify-between px-10 pb-4 pt-4 border-b border-slate-300 mb-8">
            <div className="flex flex-col justify-center font-semibold text-xl">
                <Link to={'/blogs'}>
                    Edu Bridge
                </Link>
            </div>
            <div className="relative flex flex-row gap-2" ref={searchRef}>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search authors..." 
                        className="border border-gray-300 rounded-lg p-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        value={searchTerm} 
                        onChange={handleSearchChange}
                        onFocus={() => setShowSearchResults(searchTerm.trim().length > 0)}
                    />
                    
                    {/* Search Results Dropdown */}
                    {showSearchResults && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                            {loading && (
                                <div className="p-3 text-center text-gray-500">
                                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                                    <span className="ml-2">Searching...</span>
                                </div>
                            )}
                            
                            {!loading && results.length === 0 && searchTerm.trim().length > 0 && (
                                <div className="p-3 text-center text-gray-500">
                                    No authors found for "{searchTerm}"
                                </div>
                            )}
                            
                            {!loading && results.length > 0 && (
                                <div>
                                    {results.map((author) => (
                                        <div 
                                            key={author.id}
                                            onClick={() => handleAuthorClick(author.id, author.name)}
                                            className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <AuthorImage size="small" name={author.name} />
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900">{author.name}</div>
                                                    <div className="text-xs text-gray-400">{author.postCount} posts</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
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


