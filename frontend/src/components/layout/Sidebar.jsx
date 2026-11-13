import { Link, useLocation } from "react-router-dom";
import { Search, Heart, DoorOpen, List, User } from "lucide-react";

const links = [
  { to: "/listings", label: "Browse", icon: Search },
  { to: "/my-listings", label: "My Listings", icon: List },
  { to: "/saved", label: "Saved", icon: Heart },
  { to: "/requests", label: "Requests", icon: DoorOpen },
  { to: "/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-56 border-r border-white/[0.06] bg-[#050506] pt-6 px-3">
      <nav className="space-y-1">
        {links.map((link) => {
          const isActive = location.pathname.startsWith(link.to);
          return (
            <Link key={link.to} to={link.to}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-all ${isActive ? "text-[#EDEDEF] bg-white/[0.06]" : "text-[#8A8F98] hover:text-[#EDEDEF] hover:bg-white/[0.05]"}`}>
              <link.icon className="h-4 w-4" /> {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
