import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "@/components/forms/loginForm";
import Link from "next/link";
import RegistrationForm from "@/components/forms/registerForm";

export default function Signup() {
  return (
    <div className="flex items-center justify-center py-40">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login </CardTitle>
          <CardDescription>
            Enter your details to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegistrationForm />
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="font-light text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-600 font-normal">
              Create now
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
