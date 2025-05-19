import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAuth0 } from "@auth0/auth0-react";
import getAuthAxiosInstance from "@/requests/authAxiosInstance.ts";
import Homepage from '../../public/assets/landing-page/shop-svgrepo-com.svg';
import User from '../../public/assets/user.svg';
import getConsumerAxiosInstance from "@/requests/consumerAxiosInstance";
import { AxiosError } from "axios";
import { deleteCategory } from "@/requests/deleteCategory";



export function AdminUi() {
    const { logout, getIdTokenClaims, getAccessTokenSilently, user } = useAuth0();
    const [categories, setCategories] = useState<{ Id: string; Name: string; ParentId: string }[]>([]);

    const navigate = useNavigate();

    console.log(user)

    const fetchCategories = async () => {
        const axios = await getConsumerAxiosInstance();
        try {
            const response = await axios?.get('/category');
            if (response?.status === 200) {
                setCategories(response.data.data);
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response) {
                const problemDetails: { detail: string } = error.response.data;
                console.error("Category fetch error:", problemDetails.detail);
            } else {
                console.error("An unexpected error occurred while fetching categories.");
            }
        }
    };

    useEffect(() => {
        const callRegisterApi = async () => {
            try {
                const axios = await getAuthAxiosInstance(getAccessTokenSilently, getIdTokenClaims);
                if (!axios) {
                    console.error("Failed to initialize Axios instance.");
                    return;
                }
                axios.get('/register');
            } catch (error) {
                console.error("Error during /register API call:", error);
            }
        };

        callRegisterApi();
        fetchCategories();
    }, []);

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleReturn = () => {
        logout({ logoutParams: { returnTo: window.location.origin } });
    };

    const handleCategoryCreate = () => {
        navigate('/category-create');
    };

    const handleCategoryDeletion = async (id: string) => {
        try {
            await deleteCategory(id);
            await fetchCategories(); // Refresh the category list
            console.log("Category succesfully deleted.")
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };




    return (
        <div /* Container */ className="min-h-screen flex-col ">
            <div /* Content */ className="h-33 w-1/1 flex ">
                <div /* logo-div */ className="w-1/3 items-center flex">
                    <button
                        onClick={() => window.location.reload()} // Reload the page on click
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

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <img
                                src={User}
                                alt="Clickable"
                                className="w-10 ml-240 h-10 cursor-pointer rounded-lg hover:shadow-lg transition-shadow duration-200"
                            />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={handleProfileClick}>Profile</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleReturn}>Signout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div /*vendor-dashboard*/ className="flex flex-col w-1/1 h-1/2">
                <div onClick={handleCategoryCreate} className="bg-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-2xl p-6 w-full max-w-sm mt-10 ml-60 text-center">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Create a Category</h2>
                </div>
                <div className="ml-60 mt-10 w-3/4 ">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">
                        Existing Categories
                    </h2>
                    <div className="grid grid-cols-4 gap-4">
                        {categories && categories.length > 0 ? (
                            categories.map((category) => (
                                <div
                                    key={category.Id}
                                    className="relative bg-gray-100 flex flex-col justify-center items-center dark:bg-gray-700 p-4 rounded-xl shadow hover:shadow-sm transition-shadow text-center"
                                >
                                    <p className="font-medium text-gray-800 dark:text-white">{category.Name}</p>

                                    <button
                                        onClick={() => handleCategoryDeletion(category.Id)}
                                        className="absolute bottom-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1 px-2 rounded-md transition-colors duration-200"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">No existing categories. Please create one.</p>
                        )}

                    </div>

                </div>
            </div>
        </div>
    );
}
