import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigate } from 'react-router-dom';


export function OrderUi() {

    const navigate = useNavigate();


    return (
        <div /* Container */ className="min-h-screen flex-col ">
            <div /* Content */ className="h-20 w-1/1 flex ">
                <div /* logo-div */ className="w-1/2 content-center items-center flex">
                    <img
                        src="src\assets\landing-page\shop-svgrepo-com.svg"
                        alt="Description of image"
                        className="w-10 h-10 ml-60"
                    />
                    <p className="text-2xl ml-1 mb-1 italic font-bold">Shoply</p>
                </div>
                <div /* Button-div */ className="w-1/2 items-center content-center flex">
                    <Button className="px-9 py-4 w-30 h-11 text-lg ml-143 rounded-3xl" >Sign In</Button>
                </div>
            </div>
            <div /* Information */ className=" flex w-1/1 h-1/2">
                <div /* sign-up-div */ className="w-1/2 flex-col pt-25">
                    <p className="ml-60 text-6xl font-100 max-w-xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className="ml-60 mt-5 text-xl font-50 max-w-md">Ullamcorper a lacus vestibulum sed. Scelerisque eleifend donec.</p>
                    <div className="ml-60 mt-5 flex items-center space-x-2 relative">
                        <Input
                            type="email"
                            placeholder="Enter your email address"
                            className="w-150 h-12 placeholder:text-base placeholder:font-200 border-2 border-gray-300 rounded-3xl"
                        />
                        <Button className="absolute mr-30 top-1/2 right-1 transform -translate-y-1/2 h-10 px-4 text-sm rounded-3xl">Sign Up</Button>
                    </div>
                    <p className="ml-60 mt-5 text-lg font-50 max-w-md">Quis varius quam quisque id diam. Aliquam sem et tortor consequat id porta nibh venenatis cras.</p>
                </div>
                <div /* Image-div */ className="w-1/2  pt-18">
                    <img
                        src="https://cdn.shopify.com/b/shopify-brochure2-assets/60a52584834d6d460eebd0cb77b4ab23.png?originalWidth=1392&originalHeight=1095"
                        alt="Description of image"
                        className="w-150 h-120 ml-35"
                    />
                </div>
            </div>
        </div>
    );
}