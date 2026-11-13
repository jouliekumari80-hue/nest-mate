import Button from "../ui/Button";

export default function RequestActions({ request, tab, onAction }) {
  return (
    <div className="flex items-center gap-2">
      {tab === "received" && request.status === "pending" && (
        <>
          <Button size="sm" onClick={() => onAction(request._id, "accept")}>Accept</Button>
          <Button variant="danger" size="sm" onClick={() => onAction(request._id, "reject")}>Reject</Button>
        </>
      )}
      {tab === "sent" && request.status === "pending" && (
        <Button variant="danger" size="sm" onClick={() => onAction(request._id, "cancel")}>Cancel</Button>
      )}
    </div>
  );
}
