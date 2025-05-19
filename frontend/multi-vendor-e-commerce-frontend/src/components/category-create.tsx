import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import getAuthAxiosInstance from "@/requests/authAxiosInstance.ts";
import getConsumerAxiosInstance from "@/requests/consumerAxiosInstance";
import Homepage from '../../public/assets/landing-page/shop-svgrepo-com.svg'
import { createCategory } from "@/requests/createCategory";


export function CategoryUi() {
    const { getIdTokenClaims, getAccessTokenSilently } = useAuth0();
    const [parentCategoryId, setParentCategoryId] = useState('');
    const [categories, setCategories] = useState<{ Id: string; Name: string }[]>([]);
    const [name, setName] = useState('');
    const inputRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const callRegisterApi = async () => {
            try {
                const axios = await getAuthAxiosInstance(getAccessTokenSilently, getIdTokenClaims); // Pass the function here
                if (!axios) {
                    console.error("Failed to initialize Axios instance.");
                    return;
                }

                axios.get('/register');
            } catch (error) {
                console.error("Error during /register API call:", error);
            }
        };

        callRegisterApi(); // Call the function when the component mounts
    }, []);
    const navigate = useNavigate();

    const handleReturn = () => {
        navigate('/admin')
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const axiosInstance = await getConsumerAxiosInstance();
                if (!axiosInstance) throw new Error("Axios instance is null");

                const response = await axiosInstance.get('/category');
                setCategories(response.data.data);
            } catch (err) {
                console.error("Error fetching categories", err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (inputRef.current && !(inputRef.current as any).contains(event.target)) {
                setMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleCategoryCreation = async () => {
        try {
            await createCategory({
                name: name,
                category_id: parentCategoryId,
            });

            console.log("Category created.")
            navigate('/admin')
        } catch (error) {
            console.log("Error occured: " + error)
        }
    };



    return (
        <div /* Container */ className="min-h-screen flex-col ">
            <div /* Content */ className="h-33 w-1/1 flex ">
                <div /* logo-div */ className="w-1/3 items-center flex">
                    <button
                        onClick={handleReturn} // Reload the page on click
                        className="flex items-center"
                    >
                        <img
                            src={Homepage}
                            alt="Description of image"
                            className="w-10 h-10 ml-60"
                        />
                        <p className="text-2xl ml-1 mb-1 italic font-bold">Shoply</p>
                    </button>
                </div>

                <div /* Button-div */ className="w-1/3 items-center flex">

                </div>
            </div>
            <div /*product-creation*/ className="flex flex-col w-1/1 h-1/2">
                <div /*input-div*/ className=" ml-60 w-200 flex flex-col space-y-4 p-4 bg-gray-100 rounded-md shadow-md">

                    <label htmlFor="name" className="text-sm font-medium text-gray-700">Category Name</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter category name"
                    />
                    <div className="relative" ref={inputRef}>
                        <label htmlFor="category_id" className="text-sm font-medium text-gray-700">Parent Category</label>
                        <input
                            id="category_id"
                            type="text"
                            value={parentCategoryId}
                            onFocus={() => setMenuOpen(true)}
                            readOnly
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                            placeholder="Select Parent Category"
                        />
                        {menuOpen && (
                            <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                {categories && categories.length > 0 ? (
                                    categories.map((cat) => (
                                        <li
                                            key={cat.Id}
                                            onClick={() => {
                                                setParentCategoryId(cat.Id);
                                                setMenuOpen(false);
                                            }}
                                            className="p-2 hover:bg-indigo-100 cursor-pointer"
                                        >
                                            {cat.Name}
                                        </li>
                                    ))
                                ) : (
                                    <li className="p-2 text-gray-500">No categories available.</li>
                                )}
                            </ul>
                        )}

                    </div>
                </div>
                <button onClick={handleCategoryCreation}
                    className="ml-220 mt-5 w-40 bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md shadow-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300"
                >
                    Create
                </button>
            </div>
        </div>
    );
}
