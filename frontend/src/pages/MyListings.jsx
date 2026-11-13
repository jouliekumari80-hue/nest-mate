import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Edit3, Trash2, MapPin, IndianRupee, ToggleLeft, ToggleRight } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchListings(); }, []);

  const fetchListings = async () => {
    try {
      const { data } = await api.get("/listings/me/all");
      setListings(data.listings || data.data || []);
    } catch {} finally { setLoading(false); }
  };

  const toggleStatus = async (id) => {
    try {
      await api.patch(`/listings/${id}/status`);
      setListings((prev) => prev.map((l) => l._id === id ? { ...l, status: l.status === "Active" ? "Filled" : "Active" } : l));
      toast.success("Status updated");
    } catch { toast.error("Failed"); }
  };

  const deleteListing = async (id) => {
    if (!confirm("Delete this listing?")) return;
    try {
      await api.delete(`/listings/${id}`);
      setListings((prev) => prev.filter((l) => l._id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed"); }
  };

  if (loading) return <div className="mx-auto max-w-4xl px-4 py-8 space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32" />)}</div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight gradient-text">My Listings</h1>
          <p className="mt-1 text-sm text-[#8A8F98]">Manage your roommate listings</p>
        </div>
        <Link to="/listings/new"><Button>+ New Listing</Button></Link>
      </div>

      {listings.length === 0 ? (
        <EmptyState title="No listings yet" description="Create your first roommate listing" icon={<Edit3 className="h-6 w-6 text-[#8A8F98]" />}
          action={<Link to="/listings/new"><Button>Create Listing</Button></Link>} />
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div key={listing._id} className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-5 shadow-card transition-all duration-300 hover:shadow-card-hover">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-[#EDEDEF]">{listing.propertyType || "Roommate Listing"}</h3>
                    <Badge variant={listing.status === "Active" ? "success" : "neutral"}>{listing.status || "Active"}</Badge>
                  </div>
                  <p className="text-xs text-[#8A8F98] flex items-center gap-1"><MapPin className="h-3 w-3" />{listing.location?.city}{listing.location?.area ? `, ${listing.location.area}` : ""}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-sm font-semibold text-[#EDEDEF]"><IndianRupee className="inline h-3 w-3" />{listing.rentPerHead?.toLocaleString()}<span className="text-[#8A8F98] font-normal">/mo</span></span>
                    <span className="text-xs text-[#8A8F98]">{listing.sharingType || listing.propertyType}</span>
                    {listing.roommatesNeeded != null && <span className="text-xs text-[#8A8F98]">{listing.roommatesNeeded} needed</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => toggleStatus(listing._id)}>
                    {listing.status === "Active" ? <ToggleRight className="h-4 w-4 text-green-400" /> : <ToggleLeft className="h-4 w-4 text-[#8A8F98]" />}
                  </Button>
                  <Link to={`/listings/${listing._id}/edit`}><Button size="sm" variant="ghost"><Edit3 className="h-4 w-4" /></Button></Link>
                  <Button size="sm" variant="ghost" onClick={() => deleteListing(listing._id)}><Trash2 className="h-4 w-4 text-red-400" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
