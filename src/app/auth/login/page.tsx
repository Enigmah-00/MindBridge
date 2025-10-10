"use client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      usernameOrEmail: fd.get("usernameOrEmail"),
      password: fd.get("password"),
    };
    const res = await fetch("/api/auth/login", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
    });
    if (res.ok) router.push("/dashboard");
    else alert((await res.json()).error || "Login failed");
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
        <button className="btn w-full">Sign in</button>
      </form>
    </section>
  );
}
