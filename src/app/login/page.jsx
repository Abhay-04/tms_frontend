"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/lib/userSlice";
import { useRouter } from "next/navigation";
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

import api from "@/lib/api";
import { setAuthToken } from "@/lib/auth";
import Cookies from "js-cookie";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("abhay@gmail.com");
  const [password, setPassword] = useState("Abhay@123");
  const [name, setName] = useState("");
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [error, setError] = useState("");

  console.log(error);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post(
        "/login",
        { email, password },
        { withCredentials: true }
      );
      const { user } = res.data;
      toast.success("🎉 Login success! ");
      dispatch(setUser(user)); // ✅ store user in redux
      router.push("/task");
    } catch (err) {
      toast.error(err.response.data.error || "Login failed");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post(
        "/signup",
        { name, email, password },
        { withCredentials: true }
      );

      const user = res.data;
      toast.success("🎉 User created ! ");
      dispatch(setUser(user)); // ✅ store user in redux
      router.push("/task");
    } catch (err) {
      toast.error("Email is already present!");
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      router.push("/dashboard");
    }
  }, []);

  return (
    <div className="max-w-md mx-auto b mt-20 space-y-6 p-6 ">
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
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Michael Scott"
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
              <span className="text-red-400">{error}</span>
              <Button type="submit" className="w-full cursor-pointer">
                {isLoginPage ? "Login" : "Sign up"}
              </Button>
              {isLoginPage && (
                <Button variant="outline" className="w-full cursor-pointer">
                  Login with Google
                </Button>
              )}
            </div>
            <div className="mt-4 text-center text-sm">
              {isLoginPage
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <button
                onClick={() => {
                  setIsLoginPage(!isLoginPage);
                }}
                type="button"
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
