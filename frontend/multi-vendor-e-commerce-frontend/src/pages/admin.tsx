import { AdminUi } from "@/components/admin-ui";
import {ModeToggle} from "@/components/mode-toggle.tsx";
import {ThemeProvider} from "@/components/theme-provider.tsx";

export default function VendorPage() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <ModeToggle/>
            <AdminUi></AdminUi>
        </ThemeProvider>
    );
}