import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Settings, MapPin, Mail, GraduationCap, BookOpen, Edit3 } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Skeleton from "../components/ui/Skeleton";

export default function Profile() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => { api.get("/auth/me").then(({ data }) => setProfile(data)).catch(() => {}); }, []);

  if (!profile) return <div className="flex h-96 items-center justify-center"><Skeleton className="h-48 w-96" /></div>;

  const traits = [
    { label: "Food", value: profile.foodHabit }, { label: "Sleep", value: profile.sleepSchedule },
    { label: "Smoking", value: profile.smoking }, { label: "Drinking", value: profile.drinking },
    { label: "Cleanliness", value: profile.cleanliness },
  ].filter((t) => t.value);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-[#5E6AD2]/20 border-2 border-accent/30 overflow-hidden">
          {profile.profilePhoto ? <img src={profile.profilePhoto} alt="" className="h-full w-full object-cover" />
            : <div className="flex h-full items-center justify-center"><User className="h-8 w-8 text-[#5E6AD2]" /></div>}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight gradient-text">{profile.name}</h1>
        <p className="mt-1 text-sm text-[#8A8F98]">{profile.email}</p>
        {profile.college && <p className="mt-1 text-sm text-[#8A8F98]"><GraduationCap className="inline h-3.5 w-3.5 mr-1" />{profile.college}{profile.course ? ` - ${profile.course}` : ""}</p>}
        <div className="mt-4"><Button size="sm" variant="secondary" onClick={() => navigate("/profile/edit")}><Settings className="h-4 w-4" /> Edit Profile</Button></div>
      </div>

      {profile.bio && (
        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 shadow-card mb-6">
          <p className="text-sm text-[#8A8F98] leading-relaxed">{profile.bio}</p>
        </div>
      )}

      {traits.length > 0 && (
        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 shadow-card mb-6">
          <h2 className="mb-4 text-sm font-semibold text-[#EDEDEF]">Lifestyle</h2>
          <div className="flex flex-wrap gap-2">{traits.map((t) => <Badge key={t.label}>{t.label}: {t.value}</Badge>)}</div>
        </div>
      )}

      {profile.interests?.length > 0 && (
        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 shadow-card mb-6">
          <h2 className="mb-4 text-sm font-semibold text-[#EDEDEF]">Interests</h2>
          <div className="flex flex-wrap gap-2">{profile.interests.map((i) => <Badge key={i} variant="neutral">{i}</Badge>)}</div>
        </div>
      )}

      <div className="flex justify-center gap-4">
        <Link to="/my-listings"><Button variant="secondary" size="sm">My Listings</Button></Link>
        <Link to="/profile/edit"><Button size="sm"><Edit3 className="h-4 w-4" /> Edit</Button></Link>
      </div>

      {!profile.profileCompleted && (
        <div className="mt-6 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
          <p className="text-sm text-yellow-400">Your profile is incomplete. <Link to="/profile/edit" className="underline">Complete it now</Link> to get better roommate matches.</p>
        </div>
      )}
    </div>
  );
}
