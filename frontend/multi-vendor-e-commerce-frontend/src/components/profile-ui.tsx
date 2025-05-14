import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";

export function ProfileUi() {
    const navigate = useNavigate();
    const { user } = useAuth0(); // Get user data from Auth0

    const handleReturn = () => {
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-800 shadow-md">
                <div onClick={handleReturn} className="flex items-center cursor-pointer">
                    <img
                        src="src/assets/landing-page/shop-svgrepo-com.svg"
                        alt="Shoply Logo"
                        className="w-10 h-10"
                    />
                    <p className="text-2xl ml-2 italic font-bold text-white">Shoply</p>
                </div>
            </div>

            {/* Profile Section */}
            <div className="flex justify-center items-center flex-grow">
                {user ? (
                    <div className="flex flex-col border rounded-md shadow-md p-6 w-full max-w-md bg-gray-800 border-gray-700">
                        <div className="text-center">
                            <img
                                src={user.picture}
                                alt="Profile"
                                className="w-24 h-24 object-cover rounded-full mx-auto shadow-md mb-4"
                            />
                            <h1 className="text-lg font-semibold text-white">{user.name}</h1>
                            <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                        <div className="mt-6 space-y-4">
                            <div>
                                <h2 className="text-sm font-semibold text-gray-400">Nickname</h2>
                                <p className="text-base text-white">{user.nickname}</p>
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-gray-400">Email</h2>
                                <p className="text-base text-white">{user.email}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-xl text-white">Loading user data...</p>
                )}
            </div>

            {/* Back Button */}
            <div className="flex justify-center py-4">
                <Button onClick={handleReturn} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md">
                    Back to Dashboard
                </Button>
            </div>
        </div>
    );
}