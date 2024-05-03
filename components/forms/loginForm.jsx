"use client";

import {z} from "zod";
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { Form,FormField,FormItem,FormLabel,FormControl,FormDescription,FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import {Button} from "../ui/button";
import { login } from "@/utils/auth/action";
import { toast } from "sonner";


export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

const LoginForm = () => {
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues:{
            email:"",
            password:""
        }
    })

    async function onSubmit(values) {
        const error = await login(values) ;
        if(error){
            toast(error, "error")
        }
    }
    return(

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              {/* <FormDescription>
            Enter your email address.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              {/* <FormDescription>
                Create your password.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}

export default LoginForm;