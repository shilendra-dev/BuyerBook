"use client";

import { useState } from "react";
import { Button } from "@/ui/atoms/button";
import { Input } from "@/ui/atoms/input";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await signUp.email({
        email,
        password,
        name,
      });

      if(data){
        toast.success("Signed up successfully!");
        router.push("/signin");
      }

      if (error) {
        setError(error.message || "Invalid email or password");
        toast.error(error.message || "Invalid email or password");
      }

      setIsLoading(false);
    } catch (err) {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    }
  };

  // Main signup form
  return (
    <div className="w-80 max-w-sm mx-auto text-center space-y-8">
      {/* DoDesk Logo */}
      <div className="flex flex-col gap-4 space-y-2">
        <div className="flex items-center justify-center flex-col">
          <h1 className="text-2xl font-medium">Sign Up</h1>
          <p className="text-xs text-muted-foreground tracking-wider">
            Create your account
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <Input
            type="name"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="name"
            className="h-12 bg-background border-border/50 focus:border-primary/50 transition-colors"
          />
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="email"
            className="h-12 bg-background border-border/50 focus:border-primary/50 transition-colors"
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="new-password"
            className="h-12 bg-background border-border/50 focus:border-primary/50 transition-colors"
          />
        </div>

        {error && (
          <div className="bg-destructive/5 border border-destructive/20 text-destructive p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-12 font-medium"
          disabled={isLoading || !email || !password}
          size="lg"
        >
          {isLoading ? "Signing up..." : "Sign up"}
        </Button>
      </form>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground space-y-2">
        <div>
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-primary hover:underline font-medium transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
