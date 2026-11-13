import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Camera } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function EditProfile() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.put("/auth/profile", data);
      await refreshUser();
      toast.success("Profile updated!");
      navigate("/profile");
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); } finally { setLoading(false); }
  };

  const uploadPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    try {
      const fd = new FormData();
      fd.append("photo", file);
      const base = import.meta.env.VITE_API_URL || "/api";
      const token = localStorage.getItem("token");
      const res = await fetch(`${base}/auth/profile/photo`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Upload failed (${res.status})`);
      }
      await refreshUser();
      toast.success("Photo updated!");
    } catch (err) { toast.error(err.message || "Upload failed"); } finally { setPhotoUploading(false); }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight gradient-text">Edit Profile</h1>
        <p className="mt-1 text-sm text-[#8A8F98]">Help others find you based on your lifestyle</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-card">
          <h2 className="mb-4 text-sm font-semibold text-[#EDEDEF]">Profile Photo</h2>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[#5E6AD2] hover:text-[#6872D9] transition-colors">
            <Camera className="h-4 w-4" />{photoUploading ? "Uploading..." : "Upload photo"}
            <input type="file" accept="image/*" onChange={uploadPhoto} className="hidden" disabled={photoUploading} />
          </label>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-card space-y-4">
          <h2 className="text-sm font-semibold text-[#EDEDEF]">Basic Info</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="College" placeholder="e.g. IIT Bombay" {...register("college")} />
            <Input label="Course" placeholder="e.g. B.Tech CSE" {...register("course")} />
          </div>
          <textarea {...register("bio")} placeholder="Write a short bio about yourself..." rows={3}
            className="w-full bg-[#0F0F12] rounded-lg px-4 py-2.5 text-sm text-[#EDEDEF] border border-white/10 placeholder:text-[#5A5F66] focus:outline-none focus:border-[#5E6AD2] resize-none" />
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-card space-y-4">
          <h2 className="text-sm font-semibold text-[#EDEDEF]">Lifestyle</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { key: "foodHabit", label: "Food Habit", opts: ["Veg", "Non-Veg", "Vegan", "Any"] },
              { key: "sleepSchedule", label: "Sleep Schedule", opts: ["Early Bird", "Night Owl", "Flexible"] },
              { key: "smoking", label: "Smoking", opts: ["Yes", "No"] },
              { key: "drinking", label: "Drinking", opts: ["Yes", "No"] },
              { key: "cleanliness", label: "Cleanliness", opts: ["Very Clean", "Moderate", "Doesn't Matter"] },
            ].map(({ key, label, opts }) => (
              <div key={key} className="space-y-1.5">
                <label className="block text-sm font-medium text-[#EDEDEF]">{label}</label>
                <select {...register(key)} className="w-full bg-[#0F0F12] rounded-lg px-4 py-2.5 text-sm text-[#EDEDEF] border border-white/10 focus:outline-none focus:border-[#5E6AD2]">
                  <option value="">Select</option>
                  {opts.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-card space-y-4">
          <h2 className="text-sm font-semibold text-[#EDEDEF]">Interests</h2>
          <Input placeholder="Music, Reading, Gaming, Gym..." {...register("interests")} />
          <p className="text-xs text-[#8A8F98]">Separate with commas</p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" type="button" onClick={() => navigate("/profile")}>Cancel</Button>
          <Button type="submit" disabled={loading}><Save className="h-4 w-4" /> {loading ? "Saving..." : "Save Profile"}</Button>
        </div>
      </form>
    </div>
  );
}
