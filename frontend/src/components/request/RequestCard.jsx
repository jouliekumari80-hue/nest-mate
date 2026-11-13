import { User, X, Check, Clock, MapPin, IndianRupee, Phone, Mail } from "lucide-react";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

const statusVariant = { pending: "warning", accepted: "success", rejected: "danger", cancelled: "neutral" };

export default function RequestCard({ request, tab, onAction, pending }) {
  const person = tab === "received" ? request.sender : request.receiver;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-5 shadow-card transition-all duration-300 hover:shadow-card-hover">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-[#5E6AD2]/20 border-2 border-accent/30 flex items-center justify-center shrink-0">
            {person?.profilePhoto ? <img src={person.profilePhoto} alt="" className="h-full w-full rounded-full object-cover" />
              : <User className="h-4 w-4 text-[#5E6AD2]" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[#EDEDEF]">{person?.name || "Unknown"}</h3>
              <Badge variant={statusVariant[request.status]}>{request.status}</Badge>
            </div>
            <p className="mt-1 text-xs text-[#8A8F98]">
              {request.listing?.location?.city && <><MapPin className="inline h-3 w-3 mr-0.5" />{request.listing.location.city} · </>}
              ₹{request.listing?.rentPerHead?.toLocaleString()}/mo
            </p>
            {request.message && <p className="mt-2 text-xs text-[#8A8F98] italic">"{request.message}"</p>}
            {request.contact?.phone && <a href={`tel:${request.contact.phone}`} className="mt-1 inline-flex items-center gap-1 text-xs text-[#5E6AD2] hover:underline"><Phone className="h-3 w-3" />{request.contact.phone}</a>}
            {request.contact?.email && <a href={`mailto:${request.contact.email}`} className="mt-1 inline-flex items-center gap-1 text-xs text-[#5E6AD2] hover:underline"><Mail className="h-3 w-3" />{request.contact.email}</a>}
            <p className="mt-1 text-xs text-[#8A8F98]"><Clock className="inline h-3 w-3 mr-1" />{new Date(request.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {tab === "received" && request.status === "pending" && (
            <>
              <Button size="sm" loading={pending} disabled={pending} onClick={() => onAction(request._id, "accept")}><Check className="h-4 w-4" /> Accept</Button>
              <Button variant="danger" size="sm" disabled={pending} onClick={() => onAction(request._id, "reject")}><X className="h-4 w-4" /> Reject</Button>
            </>
          )}
          {tab === "sent" && request.status === "pending" && (
            <Button variant="danger" size="sm" loading={pending} disabled={pending} onClick={() => onAction(request._id, "cancel")}><X className="h-4 w-4" /> Cancel</Button>
          )}
        </div>
      </div>
    </div>
  );
}
