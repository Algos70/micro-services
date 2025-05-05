import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react";
import { useNavigate } from 'react-router-dom';



export function ConsumerUi() {

    const navigate = useNavigate();

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
                        className="w-150 h-12 placeholder:text-base placeholder:font-200 border-2 border-gray-300 rounded-3xl"
                    />
                    <Button className=" bg-translucent absolute flex transform mt-10 ml-137 -translate-y-1/2 h-10 px-1 text-sm rounded-3xl "><img
                        src="src\assets\search-alt-2-svgrepo-com.svg"
                        alt="Description of image"
                        className="w-10 h-10"
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

            </div>
        </div>
    );
}