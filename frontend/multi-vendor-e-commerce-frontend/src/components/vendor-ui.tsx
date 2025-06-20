import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAuth0 } from "@auth0/auth0-react";
import getAuthAxiosInstance from "@/requests/authAxiosInstance.ts";
import ProductGrid2 from "./product-grid2";
import getConsumerAxiosInstance from "@/requests/consumerAxiosInstance";
import { AxiosError } from "axios";
import Homepage from '../../public/assets/landing-page/shop-svgrepo-com.svg';
import User from '../../public/assets/user.svg';



export function VendorUi() {
    const { logout, getIdTokenClaims, getAccessTokenSilently , user } = useAuth0();
    const [products, setProducts] = useState<{
        Id: string;
        Name: string;
        Description: string;
        Price: number;
        Stock: number;
        CategoryId: string;
        Image: string;
        VendorId: string;
    }[]>([]);
    console.log(user)

    async function getProducts(): Promise<{
        Id: string;
        Name: string;
        Description: string;
        Price: number;
        Stock: number;
        CategoryId: string;
        Image: string;
        VendorId: string;
    }[] | null> {
        const axios = await getConsumerAxiosInstance();
        try {
            const response = await axios?.get(`/product/vendor/${user?.email}`);
            if (response?.status === 200) {
                return response.data.data; // Assuming response.data.data is an array of product objects
            }
            return null;
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response) {
                const problemDetails: { detail: string } = error.response.data;
                console.error("Product fetch error:", problemDetails.detail);
            } else {
                console.error("An unexpected error occurred while fetching products.");
            }
            return null;
        }
    }


    useEffect(() => {

        const fetchAllProducts = async () => {
            const data = await getProducts();
            if (data) setProducts(data); // Set products correctly
            console.log(data); // Log to check the fetched data
        };
        fetchAllProducts();

    }, []);


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

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleReturn = () => {
        logout({ logoutParams: { returnTo: window.location.origin } });
    };


    const handleProductCreate = () => {
        navigate('/product-create');
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
                <div onClick={handleProductCreate} className="bg-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-2xl p-6 w-full max-w-sm mt-10 ml-60 text-center">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Create a Product</h2>
                </div>
                <div className="ml-60 mt-10 ">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">
                        My Products
                    </h2>

                </div>
                <div /* Products-menu div */ className="flex ml-55 h-3/4 w-1.05/2">
                    {products.length > 0 ? (
                        <ProductGrid2 products={products} maxProducts={15} />
                    ) : (
                        <p>No products found for the selected category.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
