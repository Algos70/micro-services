import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import getAuthAxiosInstance from "@/requests/authAxiosInstance.ts";
import getConsumerAxiosInstance from "@/requests/consumerAxiosInstance";
import { createProduct } from "@/requests/createProduct";
import Homepage from '../../public/assets/landing-page/shop-svgrepo-com.svg'


export function ProductUi() {
    const { user, getIdTokenClaims, getAccessTokenSilently } = useAuth0();
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState<{ Id: string; Name: string }[]>([]);
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
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
        navigate('/vendor')
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

    const handleProductCreation = async () => {
        try {
            await createProduct({
                category_id: categoryId,
                description: description,
                image: image,
                name: name,
                price: price,
                stock: stock,
                vendor_id: user?.email
            });

            console.log("Product created.")
            navigate('/vendor')
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
            <div /*product-creation*/ className="flex flex-row w-1/1 h-1/2">
                <div /*image-div*/ className="ml-60">

                    <img
                        src={image}
                        alt="Please add an existing image source"
                        className="w-100 h-100 object-cover  border-2 border-gray-500 shadow-lg"
                    />
                </div>
                <div /*input-div*/ className=" ml-40 w-200 flex flex-col space-y-4 p-4 bg-gray-100 rounded-md shadow-md">
                    <div className="relative" ref={inputRef}>
                        <label htmlFor="category_id" className="text-sm font-medium text-gray-700">Category</label>
                        <input
                            id="category_id"
                            type="text"
                            value={categoryId}
                            onFocus={() => setMenuOpen(true)}
                            readOnly
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                            placeholder="Select Category"
                        />
                        {menuOpen && (
                            <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                {categories && categories.length > 0 ? (
                                    categories.map((cat) => (
                                        <li
                                            key={cat.Id}
                                            onClick={() => {
                                                setCategoryId(cat.Id);
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

                    <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
                    <input
                        id="description"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter description"
                    />

                    <label htmlFor="image" className="text-sm font-medium text-gray-700">Image</label>
                    <input
                        id="image"
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter image URL"
                    />

                    <label htmlFor="name" className="text-sm font-medium text-gray-700">Product Name</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter product name"
                    />

                    <label htmlFor="price" className="text-sm font-medium text-gray-700">Price</label>
                    <input
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter product price"
                    />

                    <label htmlFor="stock" className="text-sm font-medium text-gray-700">Stock</label>
                    <input
                        id="stock"
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(Number(e.target.value))}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter stock quantity"
                    />
                </div>

            </div>
            <button onClick={handleProductCreation}
                className="ml-380 mt-10 bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md shadow-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300"
            >
                Create
            </button>

        </div>
    );
}
