import { CategoryUi } from "@/components/category-create";
import {ModeToggle} from "@/components/mode-toggle.tsx";
import {ThemeProvider} from "@/components/theme-provider.tsx";

export default function CategoryPage() {
    return (
           
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <ModeToggle/>
            <CategoryUi></CategoryUi>
        </ThemeProvider>
    );
}