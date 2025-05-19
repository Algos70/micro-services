import { ModeToggle } from "@/components/mode-toggle.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";

export default function DashboardPage() {
    const { user } = useAuth0();
    const navigate = useNavigate();

    const role = user?.roless?.toLowerCase();

    useEffect(() => {
            if (role === 'customer') {
                navigate('/consumer');
            } else if (role === 'vendor') {
                navigate('/vendor');
            } else if (role === 'admin'){
                navigate('/admin');
            }
    }, [user]);

    return (


        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <ModeToggle />
        </ThemeProvider>
    );
}