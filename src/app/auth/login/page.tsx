"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const fd = new FormData(e.currentTarget);
    const payload = {
      usernameOrEmail: fd.get("usernameOrEmail"),
      password: fd.get("password"),
    };
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include" // Important: This allows cookies to be set
      });
      
      if (res.ok) {
        // Use window.location for a hard redirect to ensure middleware runs
        window.location.href = "/dashboard";
      } else {
        setLoading(false);
        const errorData = await res.json().catch(() => ({ error: "Login failed" }));
        alert(errorData.error || "Login failed");
      }
    } catch (error) {
      setLoading(false);
      alert("Network error. Please try again.");
      console.error("Login error:", error);
    }
  }

  return (
    <section className="max-w-md mx-auto card p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Welcome back</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label">Username or Email</label>
          <input name="usernameOrEmail" className="input" required />
        </div>
        <div>
          <label className="label">Password</label>
          <input type="password" name="password" className="input" required />
        </div>
        <button className="btn w-full" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </section>
  );
}
