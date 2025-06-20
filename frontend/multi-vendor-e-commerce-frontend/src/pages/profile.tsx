import { ProfileUi } from "@/components/profile-ui";
import {ModeToggle} from "@/components/mode-toggle.tsx";
import {ThemeProvider} from "@/components/theme-provider.tsx";

export default function ProfilePage() {
    return (

        
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <ModeToggle/>
            <ProfileUi></ProfileUi>
        </ThemeProvider>
    );
}