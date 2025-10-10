"use client";
import { useEffect, useState } from "react";

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria", "Bangladesh", "Belgium", 
  "Brazil", "Canada", "Chile", "China", "Colombia", "Denmark", "Egypt", "Finland", "France", "Germany", 
  "Ghana", "Greece", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Japan", 
  "Kenya", "Malaysia", "Mexico", "Netherlands", "New Zealand", "Nigeria", "Norway", "Pakistan", 
  "Philippines", "Poland", "Portugal", "Russia", "Saudi Arabia", "Singapore", "South Africa", 
  "South Korea", "Spain", "Sweden", "Switzerland", "Thailand", "Turkey", "UAE", "UK", "USA", 
  "Ukraine", "Vietnam"
];

export default function ProfilePage() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/profile", { credentials: "include" }).then(async r => {
      const j = await r.json();
      setData(j || {});
      setLoading(false);
    });
  }, []);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const body: any = {};
    for (const [k, v] of fd.entries()) {
      if (v === "") continue;
      if (["age","heightCm","weightKg","latitude","longitude","exerciseMinutes","dietQuality","socialInteraction","workStress","substanceUse","sleepHours","screenTimeHours"].includes(k)) {
        body[k] = Number(v);
      } else {
        body[k] = v;
      }
    }
    const res = await fetch("/api/profile", { 
      method: "PUT", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify(body),
      credentials: "include"
    });
    setSaving(false);
    if (res.ok) {
      alert("✅ Profile saved successfully!");
      const updated = await res.json();
      setData(updated);
    } else {
      alert("❌ Failed to save profile");
    }
  }

  function locate() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setData((d: any) => ({ 
            ...d, 
            latitude: pos.coords.latitude, 
            longitude: pos.coords.longitude 
          }));
          alert("✅ Location detected successfully!");
        },
        (error) => {
          alert("❌ Unable to detect location. Please allow location access.");
          console.error(error);
        }
      );
    } else {
      alert("❌ Geolocation is not supported by your browser");
    }
  }

  if (loading) return <div className="card p-6"><div className="animate-pulse">Loading your profile...</div></div>;

  return (
    <section className="max-w-4xl mx-auto space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-semibold mb-2">Lifestyle Profile</h1>
        <p className="text-gray-600 text-sm">Complete your profile for personalized mental health insights and doctor recommendations</p>
      </div>
      
      <form onSubmit={save} className="space-y-6">
        {/* Personal Information */}
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Age *</label>
              <input 
                type="number" 
                className="input" 
                name="age" 
                defaultValue={data.age ?? ""} 
                placeholder="e.g., 25"
                min="1"
                max="120"
                required
              />
            </div>
            <div>
              <label className="label">Gender *</label>
              <select 
                className="input" 
                name="gender" 
                defaultValue={data.gender ?? ""}
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">City</label>
              <input 
                className="input" 
                name="city" 
                defaultValue={data.city ?? ""}
                placeholder="e.g., Dhaka"
              />
            </div>
            <div>
              <label className="label">Country</label>
              <select 
                className="input" 
                name="country" 
                defaultValue={data.country ?? ""}
              >
                <option value="">Select country</option>
                {COUNTRIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Latitude</label>
              <input 
                type="number" 
                step="any"
                className="input" 
                name="latitude" 
                value={data.latitude ?? ""} 
                onChange={e => setData({ ...data, latitude: e.target.value })}
                placeholder="Auto-filled via location"
              />
            </div>
            <div>
              <label className="label">Longitude</label>
              <input 
                type="number" 
                step="any"
                className="input" 
                name="longitude" 
                value={data.longitude ?? ""} 
                onChange={e => setData({ ...data, longitude: e.target.value })}
                placeholder="Auto-filled via location"
              />
            </div>
          </div>
          <button type="button" className="btn" onClick={locate}>
            📍 Use My Current Location
          </button>
        </div>

        {/* Physical Health */}
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Physical Health</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Height (cm)</label>
              <input 
                type="number" 
                step="0.1"
                className="input" 
                name="heightCm" 
                defaultValue={data.heightCm ?? ""}
                placeholder="e.g., 170"
              />
            </div>
            <div>
              <label className="label">Weight (kg)</label>
              <input 
                type="number" 
                step="0.1"
                className="input" 
                name="weightKg" 
                defaultValue={data.weightKg ?? ""}
                placeholder="e.g., 65"
              />
            </div>
          </div>
        </div>

        {/* Lifestyle Habits */}
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Lifestyle Habits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Sleep hours per night</label>
              <input 
                type="number" 
                step="0.5"
                className="input" 
                name="sleepHours" 
                defaultValue={data.sleepHours ?? ""}
                placeholder="e.g., 7.5"
                min="0"
                max="24"
              />
            </div>
            <div>
              <label className="label">Exercise (minutes/week)</label>
              <input 
                type="number" 
                className="input" 
                name="exerciseMinutes" 
                defaultValue={data.exerciseMinutes ?? ""}
                placeholder="e.g., 150"
                min="0"
              />
            </div>
            <div>
              <label className="label">Screen time (hours/day)</label>
              <input 
                type="number" 
                step="0.5"
                className="input" 
                name="screenTimeHours" 
                defaultValue={data.screenTimeHours ?? ""}
                placeholder="e.g., 6"
                min="0"
                max="24"
              />
            </div>
            <div>
              <label className="label">Diet quality (1-5)</label>
              <select 
                className="input" 
                name="dietQuality" 
                defaultValue={data.dietQuality ?? ""}
              >
                <option value="">Select rating</option>
                <option value="1">1 - Very Poor</option>
                <option value="2">2 - Poor</option>
                <option value="3">3 - Average</option>
                <option value="4">4 - Good</option>
                <option value="5">5 - Excellent</option>
              </select>
            </div>
            <div>
              <label className="label">Social interaction (1-5)</label>
              <select 
                className="input" 
                name="socialInteraction" 
                defaultValue={data.socialInteraction ?? ""}
              >
                <option value="">Select rating</option>
                <option value="1">1 - Very Low</option>
                <option value="2">2 - Low</option>
                <option value="3">3 - Moderate</option>
                <option value="4">4 - High</option>
                <option value="5">5 - Very High</option>
              </select>
            </div>
            <div>
              <label className="label">Work stress (1-5)</label>
              <select 
                className="input" 
                name="workStress" 
                defaultValue={data.workStress ?? ""}
              >
                <option value="">Select rating</option>
                <option value="1">1 - Very Low</option>
                <option value="2">2 - Low</option>
                <option value="3">3 - Moderate</option>
                <option value="4">4 - High</option>
                <option value="5">5 - Very High</option>
              </select>
            </div>
            <div>
              <label className="label">Substance use (1-5)</label>
              <select 
                className="input" 
                name="substanceUse" 
                defaultValue={data.substanceUse ?? ""}
              >
                <option value="">Select rating</option>
                <option value="1">1 - None</option>
                <option value="2">2 - Minimal</option>
                <option value="3">3 - Moderate</option>
                <option value="4">4 - High</option>
                <option value="5">5 - Very High</option>
              </select>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="btn w-full text-lg py-3" 
          disabled={saving}
        >
          {saving ? "Saving..." : "💾 Save Profile"}
        </button>
      </form>
    </section>
  );
}
