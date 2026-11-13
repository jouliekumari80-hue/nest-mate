import { User, MapPin, GraduationCap } from "lucide-react";
import Button from "../ui/Button";

export default function ProfileCard({ profile, onEdit }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 shadow-card text-center">
      <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-[#5E6AD2]/20 border-2 border-accent/30 overflow-hidden">
        {profile?.profilePhoto ? <img src={profile.profilePhoto} alt="" className="h-full w-full object-cover" />
          : <div className="flex h-full items-center justify-center"><User className="h-8 w-8 text-[#5E6AD2]" /></div>}
      </div>
      <h2 className="text-lg font-semibold text-[#EDEDEF]">{profile?.name || "User"}</h2>
      {profile?.email && <p className="text-xs text-[#8A8F98] mt-1">{profile.email}</p>}
      {profile?.college && <p className="text-xs text-[#8A8F98] mt-1 flex items-center justify-center gap-1"><GraduationCap className="h-3 w-3" />{profile.college}</p>}
      {profile?.bio && <p className="text-sm text-[#8A8F98] mt-4 leading-relaxed">{profile.bio}</p>}
      {onEdit && <div className="mt-6"><Button size="sm" onClick={onEdit}>Edit Profile</Button></div>}
    </div>
  );
}
