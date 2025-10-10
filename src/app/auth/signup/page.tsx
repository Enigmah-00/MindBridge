"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [role, setRole] = useState<"USER" | "DOCTOR">("USER");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: any = {
      username: fd.get("username"),
      email: fd.get("email") || undefined,
      password: fd.get("password"),
      role,
    };
    if (role === "DOCTOR") {
      payload.doctorProfile = {
        name: fd.get("doctorName") || fd.get("username"),
        city: fd.get("city") || undefined,
        country: fd.get("country") || undefined,
        latitude: fd.get("latitude") ? Number(fd.get("latitude")) : undefined,
        longitude: fd.get("longitude") ? Number(fd.get("longitude")) : undefined,
        telehealth: fd.get("telehealth") === "on",
      };
    }
    const res = await fetch("/api/auth/signup", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
    });
    if (res.ok) router.push("/dashboard");
    else alert((await res.json()).error || "Signup failed");
  }

  return (
    <section className="max-w-xl mx-auto card p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Create your account</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex gap-3">
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="role" checked={role === "USER"} onChange={() => setRole("USER")} />
            <span>User</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="role" checked={role === "DOCTOR"} onChange={() => setRole("DOCTOR")} />
            <span>Doctor</span>
          </label>
        </div>
        <div>
          <label className="label">Username</label>
          <input name="username" className="input" required />
        </div>
        <div>
          <label className="label">Email (optional)</label>
          <input type="email" name="email" className="input" />
        </div>
        <div>
          <label className="label">Password</label>
          <input type="password" name="password" className="input" required />
        </div>

        {role === "DOCTOR" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Display Name</label>
              <input name="doctorName" className="input" />
            </div>
            <div>
              <label className="label">City</label>
              <input name="city" className="input" />
            </div>
            <div>
              <label className="label">Country</label>
              <input name="country" className="input" />
            </div>
            <div>
              <label className="label">Latitude</label>
              <input name="latitude" className="input" />
            </div>
            <div>
              <label className="label">Longitude</label>
              <input name="longitude" className="input" />
            </div>
            <label className="inline-flex items-center gap-2 mt-2">
              <input type="checkbox" name="telehealth" />
              <span>Offers Telehealth</span>
            </label>
          </div>
        )}
        <button className="btn w-full">Sign up</button>
      </form>
    </section>
  );
}
