import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, IndianRupee, SlidersHorizontal, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { getListings } from "../services/listingService";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import Pagination from "../components/ui/Pagination";
import { SORT_OPTIONS } from "../utils/constants";

export default function BrowseListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ city: "", area: "", minRent: "", maxRent: "", sharing: "Any", preferredGender: "Any" });
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  useEffect(() => { fetchListings(); }, [filters, sort, page]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, sort, ...filters };
      if (filters.sharing === "Any") delete params.sharing;
      if (filters.preferredGender === "Any") delete params.preferredGender;
      if (!filters.city) delete params.city;
      if (!filters.area) delete params.area;
      if (!filters.minRent) delete params.minRent;
      if (!filters.maxRent) delete params.maxRent;
      const { data } = await getListings(params);
      setListings(data.listings || data.data || []);
      setTotalPages(data.totalPages || data.pages || 1);
    } catch { setListings([]); } finally { setLoading(false); }
  };

  const filtered = search
    ? listings.filter((l) => {
        const q = search.toLowerCase();
        return (l.location?.city || "").toLowerCase().includes(q) ||
               (l.location?.area || "").toLowerCase().includes(q) ||
               (l.description || "").toLowerCase().includes(q);
      })
    : listings;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight gradient-text">Find your roommate</h1>
        <p className="mt-1 text-sm text-[#8A8F98]">Browse through students looking for roommates</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8F98]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by city, area, or keywords..."
            className="w-full bg-[#0F0F12] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#EDEDEF] border border-white/10 placeholder:text-[#5A5F66] focus:outline-none focus:border-[#5E6AD2] transition-colors" />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#8A8F98] bg-[#0F0F12] rounded-lg border border-white/10 hover:text-[#EDEDEF] transition-colors">
              {SORT_OPTIONS.find((o) => o.value === sort)?.label || "Sort"} <ChevronDown className="h-3 w-3" />
            </button>
            {showSort && (
              <div className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-white/[0.06] bg-[#0A0A0C] shadow-card py-1 z-20" onMouseLeave={() => setShowSort(false)}>
                {SORT_OPTIONS.map((o) => (
                  <button key={o.value} onClick={() => { setSort(o.value); setShowSort(false); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${sort === o.value ? "text-[#5E6AD2] bg-[#5E6AD2]/10" : "text-[#8A8F98] hover:text-[#EDEDEF] hover:bg-white/[0.05]"}`}>{o.label}</button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg border transition-colors ${showFilters ? "bg-[#5E6AD2]/10 text-[#5E6AD2] border-[#5E6AD2]/30" : "text-[#8A8F98] bg-[#0F0F12] border-white/10 hover:text-[#EDEDEF]"}`}>
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
        </div>
      </div>

      {showFilters && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 rounded-2xl border border-white/[0.06] bg-[#0A0A0C] p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["city", "area"].map((f) => (
              <div key={f}>
                <label className="block text-xs font-medium text-[#8A8F98] mb-1.5 capitalize">{f}</label>
                <input value={filters[f]} onChange={(e) => setFilters({ ...filters, [f]: e.target.value })} placeholder={`e.g. ${f === "city" ? "Mumbai" : "Andheri"}`}
                  className="w-full bg-[#0F0F12] rounded-lg px-3 py-2 text-sm text-[#EDEDEF] border border-white/10 placeholder:text-[#5A5F66] focus:outline-none focus:border-[#5E6AD2]" />
              </div>
            ))}
            {["minRent", "maxRent"].map((f) => (
              <div key={f}>
                <label className="block text-xs font-medium text-[#8A8F98] mb-1.5">{f === "minRent" ? "Min" : "Max"} Rent</label>
                <input type="number" value={filters[f]} onChange={(e) => setFilters({ ...filters, [f]: e.target.value })} placeholder={f === "minRent" ? "₹5000" : "₹50000"}
                  className="w-full bg-[#0F0F12] rounded-lg px-3 py-2 text-sm text-[#EDEDEF] border border-white/10 placeholder:text-[#5A5F66] focus:outline-none focus:border-[#5E6AD2]" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-[#8A8F98] mb-1.5">Sharing</label>
              <select value={filters.sharing} onChange={(e) => setFilters({ ...filters, sharing: e.target.value })}
                className="w-full bg-[#0F0F12] rounded-lg px-3 py-2 text-sm text-[#EDEDEF] border border-white/10 focus:outline-none focus:border-[#5E6AD2]">
                {["Any", "Single", "Double", "Triple"].map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#8A8F98] mb-1.5">Gender</label>
              <select value={filters.preferredGender} onChange={(e) => setFilters({ ...filters, preferredGender: e.target.value })}
                className="w-full bg-[#0F0F12] rounded-lg px-3 py-2 text-sm text-[#EDEDEF] border border-white/10 focus:outline-none focus:border-[#5E6AD2]">
                {["Any", "Male", "Female"].map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button size="sm" variant="ghost" onClick={() => setFilters({ city: "", area: "", minRent: "", maxRent: "", sharing: "Any", preferredGender: "Any" })}>Clear Filters</Button>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-72" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No listings found" description="Try adjusting your filters" icon={<Search className="h-6 w-6 text-[#8A8F98]" />} />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((listing, i) => (
              <motion.div key={listing._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
                <Link to={`/listings/${listing._id}`}>
                  <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 h-full flex flex-col">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-[#5E6AD2]/20 border-2 border-accent/30 flex items-center justify-center shrink-0 overflow-hidden">
                        {listing.owner?.profilePhoto ? <img src={listing.owner.profilePhoto} alt="" className="h-full w-full object-cover" /> : <span className="text-xs font-semibold text-[#5E6AD2]">{(listing.owner?.name || "?").split(" ").map(n => n[0]).join("").slice(0, 2)}</span>}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-[#EDEDEF] truncate">{listing.owner?.name || "Roommate"}</h3>
                        <p className="text-xs text-[#8A8F98] truncate">{listing.owner?.college || "Student"}</p>
                      </div>
                    </div>
                    <div className="space-y-1.5 mb-3 flex-1">
                      <p className="text-xs text-[#8A8F98] flex items-center gap-1"><MapPin className="h-3 w-3 shrink-0" />{listing.location?.city}{listing.location?.area ? `, ${listing.location.area}` : ""}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#EDEDEF]"><IndianRupee className="inline h-3 w-3" />{listing.rentPerHead?.toLocaleString()}</span>
                        <span className="text-xs text-[#8A8F98]">/mo · {listing.sharingType || listing.propertyType}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {listing.roommatePreferences?.foodHabit && <Badge variant="neutral">{listing.roommatePreferences?.foodHabit}</Badge>}
                      {listing.roommatePreferences?.sleepSchedule && <Badge variant="neutral">{listing.roommatePreferences?.sleepSchedule}</Badge>}
                    </div>
                    {listing.description && <p className="text-xs text-[#5A5F66] line-clamp-2 mb-3 leading-relaxed">{listing.description}</p>}
                    <Button size="sm" className="w-full mt-auto">View Details</Button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
