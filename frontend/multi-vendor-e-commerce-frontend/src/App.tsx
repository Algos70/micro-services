import {ThemeProvider} from "@/components/theme-provider.tsx";
import {ModeToggle} from "@/components/mode-toggle.tsx";
import SignUpPage from "@/pages/sign-up.tsx";
import LandingPage from "./pages/landing";

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <ModeToggle/>
           {/* <SignUpPage></SignUpPage> */}
           <LandingPage></LandingPage>
        </ThemeProvider>
    )
}

export default App
