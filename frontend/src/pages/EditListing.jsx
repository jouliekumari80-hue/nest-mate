import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { FOOD_OPTIONS, SLEEP_OPTIONS, YES_NO, CLEANLINESS_OPTIONS, PROPERTY_TYPES, AMENITY_OPTIONS } from "../utils/constants";

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState(null);

  useEffect(() => {
    api.get(`/listings/${id}`).then(({ data }) => {
      const l = data.listing || data.data || data;
      const prefs = l.roommatePreferences || {};
      setForm({
        propertyType: l.propertyType || "Flat",
        sharingType: l.sharingType || "Single",
        rentPerHead: l.rentPerHead?.toString() || "",
        location: l.location || { city: "", area: "" },
        moveInDate: l.moveInDate ? l.moveInDate.split("T")[0] : "",
        roommatesNeeded: l.roommatesNeeded?.toString() || "1",
        amenities: l.amenities || [],
        foodHabit: prefs.foodHabit || "",
        sleepSchedule: prefs.sleepSchedule || "",
        smoking: prefs.smoking || "",
        drinking: prefs.drinking || "",
        cleanliness: prefs.cleanliness || "",
        preferredGender: l.preferredGender || "Any",
        occupation: l.occupation || "Any",
        description: l.description || "",
      });
    }).catch(() => navigate("/my-listings")).finally(() => setFetching(false));
  }, [id]);

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const toggleAmenity = (a) => {
    update("amenities", form.amenities.includes(a) ? form.amenities.filter((x) => x !== a) : [...form.amenities, a]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        propertyType: form.propertyType,
        location: form.location,
        rentPerHead: Number(form.rentPerHead),
        sharingType: form.sharingType,
        roommatesNeeded: Number(form.roommatesNeeded),
        moveInDate: form.moveInDate,
        amenities: form.amenities,
        preferredGender: form.preferredGender,
        occupation: form.occupation,
        description: form.description,
        roommatePreferences: {
          foodHabit: form.foodHabit || undefined,
          sleepSchedule: form.sleepSchedule || undefined,
          smoking: form.smoking || undefined,
          drinking: form.drinking || undefined,
          cleanliness: form.cleanliness || undefined,
        },
      };
      Object.keys(payload).forEach((k) => { if (payload[k] === undefined) delete payload[k]; });
      await api.put(`/listings/${id}`, payload);
      toast.success("Listing updated!");
      navigate("/my-listings");
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); } finally { setLoading(false); }
  };

  if (fetching) return <div className="flex h-96 items-center justify-center"><div className="h-8 w-8 animate-pulse rounded-full bg-[#5E6AD2]/30" /></div>;
  if (!form) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight gradient-text">Edit Listing</h1>
        <p className="mt-1 text-sm text-[#8A8F98]">Update your listing details</p>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-card space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#EDEDEF]">Property Type</label>
            <select value={form.propertyType} onChange={(e) => update("propertyType", e.target.value)}
              className="w-full bg-[#0F0F12] rounded-lg px-4 py-2.5 text-sm text-[#EDEDEF] border border-white/10 focus:outline-none focus:border-[#5E6AD2]">
              {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#EDEDEF]">Sharing</label>
            <select value={form.sharingType} onChange={(e) => update("sharingType", e.target.value)}
              className="w-full bg-[#0F0F12] rounded-lg px-4 py-2.5 text-sm text-[#EDEDEF] border border-white/10 focus:outline-none focus:border-[#5E6AD2]">
              {["Single", "Double", "Triple", "Four+"].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <Input label="Rent per Head (₹)" type="number" value={form.rentPerHead} onChange={(e) => update("rentPerHead", e.target.value)} />
          <Input label="City" value={form.location.city} onChange={(e) => update("location", { ...form.location, city: e.target.value })} />
          <Input label="Area" value={form.location.area} onChange={(e) => update("location", { ...form.location, area: e.target.value })} />
          <Input label="Move-in Date" type="date" value={form.moveInDate} onChange={(e) => update("moveInDate", e.target.value)} />
          <Input label="Roommates Needed" type="number" value={form.roommatesNeeded} onChange={(e) => update("roommatesNeeded", e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#EDEDEF] mb-2">Amenities</label>
          <div className="flex flex-wrap gap-2">
            {AMENITY_OPTIONS.map((a) => (
              <button key={a} type="button" onClick={() => toggleAmenity(a)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${form.amenities.includes(a) ? "bg-[#5E6AD2]/20 text-[#5E6AD2] border-[#5E6AD2]/50" : "bg-[#0F0F12] text-[#8A8F98] border-white/10 hover:text-[#EDEDEF]"}`}>
                {form.amenities.includes(a) && "✓ "}{a}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[{ key: "foodHabit", label: "Food Habit", opts: FOOD_OPTIONS },
            { key: "sleepSchedule", label: "Sleep Schedule", opts: SLEEP_OPTIONS },
            { key: "smoking", label: "Smoking", opts: YES_NO },
            { key: "drinking", label: "Drinking", opts: YES_NO },
            { key: "cleanliness", label: "Cleanliness", opts: CLEANLINESS_OPTIONS },
          ].map(({ key, label, opts }) => (
            <div key={key} className="space-y-1.5">
              <label className="block text-sm font-medium text-[#EDEDEF]">{label}</label>
              <select value={form[key]} onChange={(e) => update(key, e.target.value)}
                className="w-full bg-[#0F0F12] rounded-lg px-4 py-2.5 text-sm text-[#EDEDEF] border border-white/10 focus:outline-none focus:border-[#5E6AD2]">
                <option value="">Prefer not to say</option>
                {opts.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#EDEDEF]">Gender Preference</label>
            <select value={form.preferredGender} onChange={(e) => update("preferredGender", e.target.value)}
              className="w-full bg-[#0F0F12] rounded-lg px-4 py-2.5 text-sm text-[#EDEDEF] border border-white/10 focus:outline-none focus:border-[#5E6AD2]">
              {["Any", "Male", "Female"].map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#EDEDEF]">Occupation</label>
            <select value={form.occupation} onChange={(e) => update("occupation", e.target.value)}
              className="w-full bg-[#0F0F12] rounded-lg px-4 py-2.5 text-sm text-[#EDEDEF] border border-white/10 focus:outline-none focus:border-[#5E6AD2]">
              {["Any", "Student", "Working Professional"].map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[#EDEDEF]">Description</label>
          <textarea value={form.description} onChange={(e) => update("description", e.target.value)}
            rows={4} className="w-full bg-[#0F0F12] rounded-lg px-4 py-3 text-sm text-[#EDEDEF] border border-white/10 placeholder:text-[#5A5F66] focus:outline-none focus:border-[#5E6AD2] resize-none" />
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => navigate("/my-listings")}>Cancel</Button>
          <Button onClick={handleSubmit} loading={loading}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}