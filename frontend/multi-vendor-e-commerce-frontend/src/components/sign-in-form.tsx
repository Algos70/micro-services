import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {SignInFormProps} from "@/types.ts";
import {SignInImage} from "@/components/sign-in-image.tsx";
import {useNavigate} from "react-router";
import getAuthAxiosInstance from "@/requests/authAxiosInstance.ts";
import {AxiosError} from "axios";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle} from "lucide-react";
import {useEffect, useState} from "react";


const signUpFormSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long.")
        .max(16, "Password must be at most 16 characters long.")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
        .regex(/[0-9]/, "Password must contain at least one digit.")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character."),
});

const signInFormSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
});

export function SignInForm({type}: SignInFormProps) {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    const formSchema = type === "sign-in" ? signInFormSchema : signUpFormSchema;
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {email: "", password: ""},
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const axios = await getAuthAxiosInstance();
        try {
            const response = await axios?.post('/register', {
                email: values.email,
                password: values.password,
                userType: 'Customer',
            });
            if (response?.status === 200) {
                console.log(response.data);
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response) {
                const problemDetails: { detail: string } = error.response.data;
                setErrorMessage(problemDetails.detail);
            } else {
                setErrorMessage("An unexpected error occurred.")
            }
        }
    }

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    return (
        <div /* Container */ className="min-h-screen flex">
            <Alert variant="destructive"
                   className={`absolute top-2 left-1/3 max-w-1/3 flex flex-col items-center transition-opacity duration-500 ${errorMessage ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                <div className="flex flex-row gap-2">
                    <AlertCircle className="h-4 w-4"/>
                    <AlertTitle>Error</AlertTitle>
                </div>
                <AlertDescription>
                    {errorMessage}
                </AlertDescription>
            </Alert>


            <div /* Content */ className="w-1/2 flex justify-center items-center bg-primary-900 text-white">
                <div className="max-w-md w-full bg-white text-gray-900 shadow-lg rounded-lg p-8">
                    <h1 className="text-2xl font-extrabold text-center">
                        {type === "sign-in" ? "Sign In" : "Sign Up"}
                    </h1>
                    <div className="mt-6">
                        <Form {...form}>
                            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 text-sm focus:outline-none focus:border-gray-500 focus:bg-white"
                                                    placeholder="Enter your email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 text-sm focus:outline-none focus:border-gray-500 focus:bg-white"
                                                    type="password"
                                                    placeholder="Enter your password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    className="w-full dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800 bg-blue-400 text-gray-50 hover:bg-blue-500 rounded-lg transition-all duration-300"
                                    type="submit"
                                >
                                    {type === "sign-in" ? "Sign In" : "Sign Up"}
                                </Button>
                                <p className='text-center'>Already have an account? <a
                                    className='underline decoration-dotted underline-offset-2 hover:cursor-pointer'
                                    onClick={() => {
                                        navigate('/sign-in')
                                    }}>Sign in</a></p>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>

            {/* Right Section: Image */}
            <div className="w-1/2 h-screen">
                <SignInImage/>
            </div>
        </div>
    );
}