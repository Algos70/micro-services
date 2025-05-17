import {ModeToggle} from "@/components/mode-toggle.tsx";
import {ThemeProvider} from "@/components/theme-provider.tsx";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";

export default function DashboardPage() {
     const { user } = useAuth0();
     const navigate = useNavigate();

    useEffect(() => {
             console.log(user?.roless[0])
            if(user?.roless[0] == 'Customer')
                navigate('/consumer')
            else if(user?.roless[0] == 'Vendor'){
                navigate('/vendor')
            }
        }, []);

    return (

        
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <ModeToggle/>
        </ThemeProvider>
    );
}