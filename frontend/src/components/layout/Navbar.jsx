import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Heart, User, LogOut, Menu, X, DoorOpen, List, Plus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

const navLinks = [
  { to: "/listings", label: "Browse", icon: Search },
  { to: "/my-listings", label: "My Listings", icon: List },
  { to: "/saved", label: "Saved", icon: Heart },
  { to: "/requests", label: "Requests", icon: DoorOpen },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#050506]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-3xl font-['Pacifico'] tracking-wide gradient-text">NestMate</span>
        </Link>

        {user && (
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.to);
              return (
                <Link key={link.to} to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all duration-200 ${isActive ? "text-[#EDEDEF] bg-white/[0.06]" : "text-[#8A8F98] hover:text-[#EDEDEF] hover:bg-white/[0.05]"}`}>
                  <link.icon className="h-4 w-4" /> {link.label}
                </Link>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/listings/new"><Button size="sm" className="hidden md:flex"><Plus className="h-4 w-4" /> New Listing</Button></Link>
              <Button size="sm" variant="ghost" onClick={handleLogout} className="hidden md:flex"><LogOut className="h-4 w-4" /></Button>
              <Link to="/profile">
                {user.profilePhoto ? (
                  <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-[#5E6AD2]/30">
                    <img src={user.profilePhoto} alt="" className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-[#5E6AD2]/20 border-2 border-[#5E6AD2]/30 flex items-center justify-center">
                    <User className="h-4 w-4 text-[#5E6AD2]" />
                  </div>
                )}
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
              <Link to="/signup"><Button size="sm">Sign up</Button></Link>
            </div>
          )}

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-[#8A8F98] hover:text-[#EDEDEF] transition-colors">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && user && (
        <div className="md:hidden border-t border-white/[0.06] bg-[#050506]/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-all ${location.pathname.startsWith(link.to) ? "text-[#EDEDEF] bg-white/[0.06]" : "text-[#8A8F98] hover:text-[#EDEDEF] hover:bg-white/[0.05]"}`}>
                <link.icon className="h-4 w-4" /> {link.label}
              </Link>
            ))}
            <Link to="/listings/new" onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-[#5E6AD2] rounded-lg hover:bg-[#5E6AD2]/10 transition-all">
              <Plus className="h-4 w-4" /> New Listing
            </Link>
            <button onClick={() => { handleLogout(); setMobileOpen(false); }}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-400 rounded-lg hover:bg-red-500/10 transition-all">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
