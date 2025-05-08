"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { redirect } from "next/navigation";
import api from "@/lib/api";
import { setAuthToken } from "@/lib/auth";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/login", { email, password });
      const { token } = res.data;
      setAuthToken(token);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/signup", { name, email, password });
      const { token } = res.data;
      setAuthToken(token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  useEffect(() => {
    // const token = Cookies.get("token");
    // if (token) {
    //   router.push("/dashboard"); // client-side redirect
    // }
  }, []);

  return (
    <div className="max-w-md mx-auto mt-20 space-y-6 p-6 ">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {isLoginPage ? "Login" : "Sign up"}
          </CardTitle>
          <CardDescription>
            {isLoginPage
              ? "Enter your email below to login to your account"
              : "Enter your details below to signup"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={isLoginPage ? handleLogin : handleSignup}>
            <div className="flex flex-col gap-6">
              {!isLoginPage && (
                <div className="grid gap-2">
                  <Label htmlFor="email">Name</Label>
                  <Input
                    id="name"
                    type="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Michale Scott"
                    required
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {isLoginPage && (
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full cursor-pointer">
                {isLoginPage ? "Login" : "Sign up"}
              </Button>
              {isLoginPage && (
                <Button variant="outline" className="w-full">
                  Login with Google
                </Button>
              )}
            </div>
            <div className="mt-4 text-center text-sm">
              {isLoginPage
                ? "Don't have an account ?"
                : "Already have an account ? "}{" "}
              <button
                onClick={() => {
                  setIsLoginPage(!isLoginPage);
                }}
                className="underline underline-offset-4 cursor-pointer font-semibold"
              >
                {isLoginPage ? "Sign up" : "Login"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
