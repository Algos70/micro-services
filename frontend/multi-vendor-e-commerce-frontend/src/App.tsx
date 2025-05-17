import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
    const { isAuthenticated, isLoading } = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/landing');
        }
        if (!isLoading && isAuthenticated) {
            navigate('/consumer');
        }
    }, [isAuthenticated, isLoading, navigate]);

    return <>
        {/* This is a placeholder for the main application content */}
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <h1 className="text-3xl">Redirecting...</h1>
        </div>
    </>;
}

export default App;