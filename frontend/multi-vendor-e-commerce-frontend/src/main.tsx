import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {BrowserRouter, Route, Routes} from "react-router";
import App from "@/App.tsx";
import SignInPage from "@/pages/sign-in.tsx";
import SignUpPage from "@/pages/sign-up.tsx";
import LandingPage from './pages/landing';
import ConsumerPage from './pages/consumer';
import ProfilePage from './pages/profile';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App/>}/>
                <Route path="/landing" element={<LandingPage/>}/>
                <Route path="/sign-up" element={<SignUpPage/>}/>
                <Route path="/sign-in" element={<SignInPage/>}/>
                <Route path="/dashboard" element={<ConsumerPage/>}/>
                <Route path="/profile" element={<ProfilePage/>}/>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)
