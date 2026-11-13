import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, IndianRupee, Send, Heart, ArrowLeft, Sparkles, Home, Phone, Mail } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import Skeleton from "../components/ui/Skeleton";

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [requestModal, setRequestModal] = useState(false);
  const [message, setMessage] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  useEffect(() => { fetchListing(); checkSaved(); }, [id]);

  const fetchListing = async () => {
    try {
      const { data } = await api.get(`/listings/${id}`);
      setListing(data.listing || data.data || data);
    } catch { navigate("/listings"); } finally { setLoading(false); }
  };

  const checkSaved = async () => {
    try { const { data } = await api.get(`/saved/${id}/check`); setSaved(data.saved); } catch {}
   };

   const toggleSave = async () => {
     try { await api.post(`/saved/${id}`); setSaved(!saved); toast.success(saved ? "Removed" : "Saved!"); } catch {}
   };

   const sendRequest = async () => {
     setRequestLoading(true);
     try {
       const contact = { email: contactEmail.trim(), phone: contactPhone.trim() };
       const hasContact = contact.email || contact.phone;
       await api.post("/requests", {
         listingId: id,
         message: message.trim(),
         contact: hasContact ? contact : undefined,
       });
       toast.success("Request sent!");
       setRequestModal(false);
       setMessage("");
       setContactPhone("");
       setContactEmail("");
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); } finally { setRequestLoading(false); }
  };

  if (loading) return <div className="mx-auto max-w-4xl px-4 py-8 space-y-6"><Skeleton className="h-96" /><Skeleton className="h-48" /></div>;
  if (!listing) return null;

  const owner = listing.owner || {};
  const prefs = listing.roommatePreferences || {};
  const traits = [
    { label: "Food", value: prefs.foodHabit }, { label: "Sleep", value: prefs.sleepSchedule },
    { label: "Smoking", value: prefs.smoking }, { label: "Drinking", value: prefs.drinking },
    { label: "Cleanliness", value: prefs.cleanliness },
  ].filter((t) => t.value);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-[#8A8F98] hover:text-[#EDEDEF] transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 shadow-card mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 rounded-full bg-[#5E6AD2]/20 border-2 border-accent/30 flex items-center justify-center shrink-0 overflow-hidden">
              {owner.profilePhoto ? <img src={owner.profilePhoto} alt="" className="h-full w-full object-cover" /> : <span className="text-2xl font-semibold text-[#5E6AD2]">{(owner.name || "?").split(" ").map(n => n[0]).join("").slice(0, 2)}</span>}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#EDEDEF]">{owner.name || "Roommate"}</h1>
              {owner.college && <p className="text-sm text-[#8A8F98] mt-0.5">{owner.college}{owner.course ? ` · ${owner.course}` : ""}</p>}
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm font-semibold text-[#EDEDEF]"><IndianRupee className="inline h-3.5 w-3.5" />{listing.rentPerHead?.toLocaleString()}<span className="text-[#8A8F98] font-normal">/mo</span></span>
                <span className="text-xs text-[#8A8F98]">{listing.sharingType || listing.propertyType}</span>
              </div>
              <p className="text-xs text-[#8A8F98] flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" />{listing.location?.city}{listing.location?.area ? `, ${listing.location.area}` : ""}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={toggleSave}><Heart className={`h-4 w-4 ${saved ? "fill-red-500 text-red-500" : ""}`} /></Button>
        </div>
        {owner.bio && <p className="mt-4 text-sm text-[#8A8F98] leading-relaxed border-t border-white/[0.06] pt-4">{owner.bio}</p>}
      </div>

      {traits.length > 0 && (
        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 shadow-card mb-6">
          <h2 className="text-sm font-semibold text-[#EDEDEF] mb-4">Lifestyle & Preferences</h2>
          <div className="flex flex-wrap gap-2">
            {traits.map((t) => <Badge key={t.label}>{t.label}: {t.value}</Badge>)}
            {listing.preferredGender && <Badge variant="neutral">Prefers: {listing.preferredGender}</Badge>}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 shadow-card mb-6">
        <h2 className="text-sm font-semibold text-[#EDEDEF] mb-4">Accommodation</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-[#8A8F98]">Type</span><p className="text-[#EDEDEF]">{listing.propertyType || "Apartment"}</p></div>
          <div><span className="text-[#8A8F98]">Sharing</span><p className="text-[#EDEDEF]">{listing.sharingType || listing.propertyType}</p></div>
          {listing.moveInDate && <div><span className="text-[#8A8F98]">Move-in</span><p className="text-[#EDEDEF]">{new Date(listing.moveInDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p></div>}
          {listing.roommatesNeeded != null && <div><span className="text-[#8A8F98]">Needed</span><p className="text-[#EDEDEF]">{listing.roommatesNeeded}</p></div>}
        </div>
      </div>

      {listing.amenities?.length > 0 && (
        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 shadow-card mb-6">
          <h2 className="text-sm font-semibold text-[#EDEDEF] mb-4">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {listing.amenities.map((a) => <Badge key={a} variant="neutral">{a}</Badge>)}
          </div>
        </div>
      )}

      {listing.description && (
        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 shadow-card mb-6">
          <h2 className="text-sm font-semibold text-[#EDEDEF] mb-4">About</h2>
          <p className="text-sm text-[#8A8F98] leading-relaxed">{listing.description}</p>
        </div>
      )}

      <div className="rounded-2xl border border-[#5E6AD2]/20 bg-[#5E6AD2]/5 p-6 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="h-5 w-5 text-[#5E6AD2]" />
          <h2 className="text-sm font-semibold text-[#5E6AD2]">AI Compatibility Insights</h2>
        </div>
        <p className="text-sm text-[#8A8F98]">AI-powered compatibility analysis coming soon.</p>
      </div>

      <div className="sticky bottom-0 -mx-4 -mb-8 mt-8 border-t border-white/[0.06] bg-[#050506]/95 backdrop-blur-xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div>
            <p className="text-sm font-semibold text-[#EDEDEF]"><IndianRupee className="inline h-3.5 w-3.5" />{listing.rentPerHead?.toLocaleString()}/mo</p>
            <p className="text-xs text-[#8A8F98]">{listing.location?.city}{listing.location?.area ? `, ${listing.location.area}` : ""}</p>
          </div>
          <Button onClick={() => setRequestModal(true)} disabled={listing.status === "Filled"}>
            <Send className="h-4 w-4" /> {listing.status === "Filled" ? "Filled" : "Send Request"}
          </Button>
        </div>
      </div>

      <Modal open={requestModal} onClose={() => setRequestModal(false)} title="Send Roommate Request">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#EDEDEF]">Message (optional)</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} maxLength={300}
              placeholder="Hi! I'm looking for a roommate and I think we could be a great fit..."
              className="w-full bg-[#0F0F12] rounded-lg px-4 py-2.5 text-sm text-[#EDEDEF] border border-white/10 placeholder:text-[#5A5F66] focus:outline-none focus:border-[#5E6AD2] resize-none" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#EDEDEF]">Phone (optional)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8F98]" />
                <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="9876543210"
                  className="w-full bg-[#0F0F12] rounded-lg pl-9 pr-4 py-2.5 text-sm text-[#EDEDEF] border border-white/10 placeholder:text-[#5A5F66] focus:outline-none focus:border-[#5E6AD2]" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#EDEDEF]">Email (optional)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8F98]" />
                <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="you@email.com"
                  className="w-full bg-[#0F0F12] rounded-lg pl-9 pr-4 py-2.5 text-sm text-[#EDEDEF] border border-white/10 placeholder:text-[#5A5F66] focus:outline-none focus:border-[#5E6AD2]" />
              </div>
            </div>
          </div>
          <p className="text-xs text-[#8A8F98]">Share your contact details so the listing owner can reach you directly.</p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setRequestModal(false)}>Cancel</Button>
            <Button onClick={sendRequest} loading={requestLoading}><Send className="h-4 w-4" /> Send Request</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
