import {useNavigate} from "react-router";
import {useEffect} from "react";

function App() {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('sign-up');
    }, [navigate])
    return (<></>);
}

export default App
