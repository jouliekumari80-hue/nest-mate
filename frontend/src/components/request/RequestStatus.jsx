import Badge from "../ui/Badge";

export default function RequestStatus({ status }) {
  const variants = { pending: "warning", accepted: "success", rejected: "danger", cancelled: "neutral" };
  return <Badge variant={variants[status]}>{status}</Badge>;
}
