import { Link } from "react-router-dom";
import { MapPin, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

export default function ListingCard({ listing, index = 0 }) {
  const owner = listing.owner || {};

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
      <Link to={`/listings/${listing._id}`}>
        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 h-full flex flex-col">
          <div className="flex items-start gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-[#5E6AD2]/20 border-2 border-accent/30 flex items-center justify-center shrink-0 overflow-hidden">
              {owner.profilePhoto ? <img src={owner.profilePhoto} alt="" className="h-full w-full object-cover" /> : <span className="text-xs font-semibold text-[#5E6AD2]">{(owner.name || "?").split(" ").map(n => n[0]).join("").slice(0, 2)}</span>}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-[#EDEDEF] truncate">{owner.name || "Roommate"}</h3>
              <p className="text-xs text-[#8A8F98] truncate">{owner.college || "Student"}</p>
            </div>
          </div>
          <div className="space-y-1.5 mb-3 flex-1">
            <p className="text-xs text-[#8A8F98] flex items-center gap-1"><MapPin className="h-3 w-3 shrink-0" />{listing.location?.city}{listing.location?.area ? `, ${listing.location.area}` : ""}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#EDEDEF]"><IndianRupee className="inline h-3 w-3" />{listing.rentPerHead?.toLocaleString()}</span>
              <span className="text-xs text-[#8A8F98]">/mo · {listing.sharingType || listing.propertyType}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {listing.roommatePreferences?.foodHabit && <Badge variant="neutral">{listing.roommatePreferences?.foodHabit}</Badge>}
            {listing.roommatePreferences?.sleepSchedule && <Badge variant="neutral">{listing.roommatePreferences?.sleepSchedule}</Badge>}
          </div>
          {listing.description && <p className="text-xs text-[#5A5F66] line-clamp-2 mb-3 leading-relaxed">{listing.description}</p>}
          <Button size="sm" className="w-full mt-auto">View Details</Button>
        </div>
      </Link>
    </motion.div>
  );
}
