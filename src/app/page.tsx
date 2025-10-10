import Link from "next/link";

export default async function HomePage() {
  return (
    <section className="grid md:grid-cols-2 gap-8 items-center">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">
          MindBridge
        </h1>
        <p className="text-lg text-gray-600">
          Bridge your lifestyle and mental wellbeing. Get personalized insights, take validated screeners,
          and connect to nearby specialists.
        </p>
        <div className="flex gap-3">
          <Link href="/auth/signup" className="btn">Get Started</Link>
          <Link href="/auth/login" className="btn bg-gray-900 hover:bg-black">Sign In</Link>
        </div>
        <ul className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <li className="card p-4">Lifestyle Profile</li>
          <li className="card p-4">Personalized Suggestions</li>
          <li className="card p-4">PHQ-9 & GAD-7</li>
          <li className="card p-4">Doctor Matching & Booking</li>
        </ul>
      </div>
      <div className="card p-6">
        <img
          src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop"
          alt="MindBridge brain network illustration"
          className="rounded-lg w-full object-cover h-96"
        />
      </div>
    </section>
  );
}