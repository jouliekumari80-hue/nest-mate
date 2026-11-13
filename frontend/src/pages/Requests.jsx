import { useState, useEffect } from "react";
import { Check, X, Clock, Send, User, MapPin, IndianRupee, Phone, Mail } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";

const tabs = ["received", "sent"];

export default function Requests() {
  const [tab, setTab] = useState("received");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState(null);

  useEffect(() => { fetchRequests(); }, [tab]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/requests/${tab}`);
      setRequests(data.data || data || []);
    } catch {} finally { setLoading(false); }
  };

  const handleAction = async (id, action) => {
    if (pendingId) return;
    setPendingId(id);
    try {
      if (action === "accept") {
        await api.patch(`/requests/${id}/accept`);
        setRequests((prev) => prev.map((r) => r._id === id ? { ...r, status: "accepted" } : r));
        toast.success("Request accepted");
      } else if (action === "reject") {
        await api.patch(`/requests/${id}/reject`);
        setRequests((prev) => prev.map((r) => r._id === id ? { ...r, status: "rejected" } : r));
        toast.success("Request rejected");
      } else if (action === "cancel") {
        await api.patch(`/requests/${id}/cancel`);
        setRequests((prev) => prev.map((r) => r._id === id ? { ...r, status: "cancelled" } : r));
        toast.success("Request cancelled");
      }
    } catch (err) { toast.error(err.response?.data?.message || `Failed`); } finally { setPendingId(null); }
  };

  const statusVar = { pending: "warning", accepted: "success", rejected: "danger", cancelled: "neutral" };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight gradient-text">Requests</h1>
        <p className="mt-1 text-sm text-[#8A8F98]">Manage your roommate requests</p>
      </div>

      <div className="mb-6 flex gap-1 rounded-xl bg-white/[0.05] p-1 w-fit">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${tab === t ? "bg-[#5E6AD2] text-white shadow-sm" : "text-[#8A8F98] hover:text-[#EDEDEF]"}`}>
            {t === "received" ? "Incoming" : "Sent"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
      ) : requests.length === 0 ? (
        <EmptyState title={`No ${tab} requests`} icon={<Send className="h-6 w-6 text-[#8A8F98]" />} />
      ) : (
        <div className="space-y-4">
          {requests.map((r) => {
            const person = tab === "received" ? r.sender : r.receiver;
            return (
              <div key={r._id} className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-5 shadow-card transition-all duration-300 hover:shadow-card-hover">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-[#5E6AD2]/20 border-2 border-accent/30 flex items-center justify-center shrink-0">
                      {person?.profilePhoto ? <img src={person.profilePhoto} alt="" className="h-full w-full rounded-full object-cover" />
                        : <User className="h-4 w-4 text-[#5E6AD2]" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-[#EDEDEF]">{person?.name || "Unknown"}</h3>
                        <Badge variant={statusVar[r.status]}>{r.status}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-[#8A8F98]">
                        {r.listing?.location?.city && <><MapPin className="inline h-3 w-3 mr-0.5" />{r.listing.location.city} · </>}
                        ₹{r.listing?.rentPerHead?.toLocaleString()}/mo
                      </p>
                      {r.message && <p className="mt-2 text-xs text-[#8A8F98] italic">"{r.message}"</p>}
                      {r.contact?.phone && <a href={`tel:${r.contact.phone}`} className="mt-1 inline-flex items-center gap-1 text-xs text-[#5E6AD2] hover:underline"><Phone className="h-3 w-3" />{r.contact.phone}</a>}
                      {r.contact?.email && <a href={`mailto:${r.contact.email}`} className="mt-1 inline-flex items-center gap-1 text-xs text-[#5E6AD2] hover:underline"><Mail className="h-3 w-3" />{r.contact.email}</a>}
                      <p className="mt-1 text-xs text-[#8A8F98]"><Clock className="inline h-3 w-3 mr-1" />{new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {tab === "received" && r.status === "pending" && (
                      <>
                        <Button size="sm" loading={pendingId === r._id} disabled={pendingId !== null} onClick={() => handleAction(r._id, "accept")}><Check className="h-4 w-4" /> Accept</Button>
                        <Button variant="danger" size="sm" disabled={pendingId !== null} onClick={() => handleAction(r._id, "reject")}><X className="h-4 w-4" /> Reject</Button>
                      </>
                    )}
                    {tab === "sent" && r.status === "pending" && (
                      <Button variant="danger" size="sm" loading={pendingId === r._id} disabled={pendingId !== null} onClick={() => handleAction(r._id, "cancel")}><X className="h-4 w-4" /> Cancel</Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
