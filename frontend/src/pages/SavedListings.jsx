import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, IndianRupee, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";

export default function SavedListings() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchSaved(); }, []);

  const fetchSaved = async () => {
    try {
      const { data } = await api.get("/saved");
      setSaved(data.data || data.saved || data || []);
    } catch {} finally { setLoading(false); }
  };

  const remove = async (listingId) => {
    try {
      await api.post(`/saved/${listingId}`);
      setSaved((prev) => prev.filter((s) => (s.listing?._id || s._id) !== listingId));
      toast.success("Removed");
    } catch { toast.error("Failed"); }
  };

  if (loading) return <div className="mx-auto max-w-4xl px-4 py-8 space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32" />)}</div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight gradient-text">Saved Listings</h1>
        <p className="mt-1 text-sm text-[#8A8F98]">Your bookmarked roommate listings</p>
      </div>

      {saved.length === 0 ? (
        <EmptyState title="No saved listings" description="Browse listings and save the ones you like"
          icon={<Heart className="h-6 w-6 text-[#8A8F98]" />}
          action={<Link to="/listings"><Button>Browse Listings</Button></Link>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {saved.map((item) => {
            const listing = item.listing || item;
            const owner = listing.owner || {};
            return (
              <div key={item._id} className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-5 shadow-card transition-all duration-300 hover:shadow-card-hover">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-[#5E6AD2]/20 border-2 border-accent/30 flex items-center justify-center shrink-0 overflow-hidden">
                    {owner.profilePhoto ? <img src={owner.profilePhoto} alt="" className="h-full w-full object-cover" /> : <span className="text-xs font-semibold text-[#5E6AD2]">{(owner.name || "?").split(" ").map(n => n[0]).join("").slice(0, 2)}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/listings/${listing._id}`} className="font-semibold text-sm text-[#EDEDEF] hover:text-[#5E6AD2] transition-colors">{owner.name || "Roommate"}</Link>
                    <p className="text-xs text-[#8A8F98]">{owner.college || ""}</p>
                  </div>
                  <button onClick={() => remove(listing._id)} className="text-[#8A8F98] hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
                </div>
                <p className="text-xs text-[#8A8F98] flex items-center gap-1 mb-2"><MapPin className="h-3 w-3" />{listing.location?.city}{listing.location?.area ? `, ${listing.location.area}` : ""}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold text-[#EDEDEF]"><IndianRupee className="inline h-3 w-3" />{listing.rentPerHead?.toLocaleString()}<span className="text-[#8A8F98] font-normal">/mo</span></span>
                  <span className="text-xs text-[#8A8F98]">{listing.sharingType || listing.propertyType}</span>
                </div>
                <Link to={`/listings/${listing._id}`}><Button size="sm" className="w-full">View Details</Button></Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
