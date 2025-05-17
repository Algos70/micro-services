import { UpdateProductUi } from "@/components/product-update";
import {ModeToggle} from "@/components/mode-toggle.tsx";
import {ThemeProvider} from "@/components/theme-provider.tsx";

export default function UpdateProductPage() {
    return (

        
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <ModeToggle/>
            <UpdateProductUi></UpdateProductUi>
        </ThemeProvider>
    );
}