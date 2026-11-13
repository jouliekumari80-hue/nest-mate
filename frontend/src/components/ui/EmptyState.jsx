export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center py-24">
      {icon && <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.05]">{icon}</div>}
      <p className="text-[#8A8F98]">{title}</p>
      {description && <p className="text-sm text-[#5A5F66] mt-1">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
