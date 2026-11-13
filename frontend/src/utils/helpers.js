export function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function formatCurrency(amount) {
  if (!amount) return "₹0";
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
