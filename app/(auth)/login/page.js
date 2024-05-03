import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MyInput from "@/components/myinput";
import LoginForm from "@/components/forms/loginForm";
import Link from "next/link";

export default function Login() {
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
          <LoginForm />
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
