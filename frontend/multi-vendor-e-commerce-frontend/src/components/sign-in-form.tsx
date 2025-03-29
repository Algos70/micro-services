import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {SignInFormProps} from "@/types.ts";

const signUpFormSchema = z.object(
    {
        email: z.string({
            required_error: 'Email is required',
            invalid_type_error: 'Invalid email',
        }).email(),
        password: z.string({
            required_error: 'Password is required',
            invalid_type_error: 'Password must be at least 8 and at most 16 characters.',
        })
            .min(8, "Password must be at least 8 characters long.")
            .max(16, "Password must be at most 16 characters long.")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
            .regex(/[0-9]/, "Password must contain at least one digit.")
            .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character.")
    });

const signInFormSchema = z.object(
    {
        email: z.string({
            required_error: 'Email is required',
            invalid_type_error: 'Invalid email',
        }).email(),
        password: z.string({
            required_error: 'Password is required',
        })
    }
)

export function SignInForm({type}: SignInFormProps) {
    const formSchema = type === 'sign-in' ? signInFormSchema : signUpFormSchema;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {email: "", password: ""},
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField control={form.control} name="password" render={({field}) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input placeholder="" {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}