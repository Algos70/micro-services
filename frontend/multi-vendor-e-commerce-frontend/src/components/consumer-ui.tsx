import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import CategoryMenu from "./category-menu";
import getConsumerAxiosInstance from "@/requests/consumerAxiosInstance";
import {AxiosError} from "axios";


export function ConsumerUi() {

    const navigate = useNavigate();
    const [searched, setSearched] = useState("");
    const [categories, setCategories] = useState<string[]>([]);
    const [products, setProducts] = useState<string[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearched(e.target.value); // Update searched when input changes
    };

    const handleSearchButtonClick = () => {
        console.log("Search clicked, searched value is:", searched); // Do something with searched
    };
    /*
    async function getCategories(): Promise<string[] | null> {
        const axios = await getConsumerAxiosInstance();
        try {
            const response = await axios?.get('/category');
            if (response?.status === 200) {
                return response.data; 
            }
            return null;
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response) {
                const problemDetails: { detail: string } = error.response.data;
                console.error("Category fetch error:", problemDetails.detail);
            } else {
                console.error("An unexpected error occurred while fetching categories.");
            }
            return null;
        }
    }
    async function getProducts(): Promise<string[] | null> {
        const axios = await getConsumerAxiosInstance();
        try {
            const response = await axios?.get('/product');
            if (response?.status === 200) {
                return response.data; 
            }
            return null;
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response) {
                const problemDetails: { detail: string } = error.response.data;
                console.error("Category fetch error:", problemDetails.detail);
            } else {
                console.error("An unexpected error occurred while fetching products.");
            }
            return null;
        }
    }

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getCategories();
            if (data) setCategories(data);
        };

        fetchCategories();
        console.log(categories)
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getProducts();
            if (data) setProducts(data);
        };

        fetchProducts();
        console.log(products)
    }, []);
    */


    console.log(searched)








    return (
        <div /* Container */ className="min-h-screen flex-col ">
            <div /* Content */ className="h-20 w-1/1 flex ">
                <div /* logo-div */ className="w-1/3 items-center flex">
                    <img
                        src="src\assets\landing-page\shop-svgrepo-com.svg"
                        alt="Description of image"
                        className="w-10 h-10 ml-60"
                    />
                    <p className="text-2xl ml-1 mb-1 italic font-bold">Shoply</p>
                </div>
                <div /* search-bar */ className="w-1/3 items-center flex">
                    <Input
                        type="email"
                        placeholder="Search"
                        value={searched}
                        onChange={handleInputChange}
                        className="w-150 h-12 placeholder:text-base placeholder:font-200 border-2 border-gray-300 rounded-3xl"
                    />
                    <Button className=" bg-translucent absolute flex transform mt-10 ml-137 -translate-y-1/2 h-10 px-1 text-sm rounded-3xl "><img
                        src="src\assets\search-alt-2-svgrepo-com.svg"
                        alt="Description of image"
                        className="w-10 h-10"
                        onClick={handleSearchButtonClick}
                    /></Button>
                </div>
                <div /* Button-div */ className="w-1/3 items-center flex">
                    <Button className="ml-70 w-23 h-23 flex bg-translucent hover:bg-transparent" >
                        <img
                            src="src\assets\bag-shopping-svgrepo-com.svg"
                            alt="Description of image"
                            className=""
                        />
                    </Button>
                </div>
            </div>
            <div className="h-200 w-1/1 flex">
                <div /* Category-menu div */ className="flex h-1/1 w-1/3 ml-60">
                    <CategoryMenu categories={categories} />
                </div>
            </div>
        </div>
    );
}