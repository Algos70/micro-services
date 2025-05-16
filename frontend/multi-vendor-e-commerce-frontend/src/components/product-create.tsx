import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import getAuthAxiosInstance from "@/requests/authAxiosInstance.ts";


export function ProductUi() {
    const { getIdTokenClaims, getAccessTokenSilently } = useAuth0();

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

  

    return (
        <div /* Container */ className="min-h-screen flex-col ">
            <div /* Content */ className="h-33 w-1/1 flex ">
                <div /* logo-div */ className="w-1/3 items-center flex">
                    <button
                        onClick={handleReturn} // Reload the page on click
                        className="flex items-center"
                    >
                        <img
                            src="src\assets\landing-page\shop-svgrepo-com.svg"
                            alt="Description of image"
                            className="w-10 h-10 ml-60"
                        />
                        <p className="text-2xl ml-1 mb-1 italic font-bold">Shoply</p>
                    </button>
                </div>

                <div /* Button-div */ className="w-1/3 items-center flex">

                </div>
            </div>
            <div /*product-creation*/ className="flex w-1/1 h-1/2">
                <div>

                </div>
                <div>
                    
                </div>
            </div>
        </div>
    );
}
