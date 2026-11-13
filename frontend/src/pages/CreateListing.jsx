import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { FOOD_OPTIONS, SLEEP_OPTIONS, YES_NO, CLEANLINESS_OPTIONS, PROPERTY_TYPES, AMENITY_OPTIONS, OCCUPATION_OPTIONS } from "../utils/constants";

const sections = ["Accommodation", "Features", "Preferences", "Lifestyle", "Description", "Review"];

export default function CreateListing() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    propertyType: "Flat", sharingType: "Single", rentPerHead: "", securityDeposit: "",
    location: { city: "", area: "" }, moveInDate: "", roommatesNeeded: "1",
    amenities: [], foodHabit: "", sleepSchedule: "", smoking: "", drinking: "", cleanliness: "",
    preferredGender: "Any", occupation: "Any", description: "",
  });

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
        securityDeposit: form.securityDeposit ? Number(form.securityDeposit) : undefined,
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
      await api.post("/listings", payload);
      toast.success("Listing created!");
      navigate("/my-listings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally { setLoading(false); }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#EDEDEF]">Accommodation Details</h2>
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
              <Input label="Rent per Head (₹)" type="number" value={form.rentPerHead} onChange={(e) => update("rentPerHead", e.target.value)} placeholder="15000" />
              <Input label="Security Deposit (₹)" type="number" value={form.securityDeposit} onChange={(e) => update("securityDeposit", e.target.value)} placeholder="30000" />
              <Input label="City" value={form.location.city} onChange={(e) => update("location", { ...form.location, city: e.target.value })} placeholder="Mumbai" />
              <Input label="Area" value={form.location.area} onChange={(e) => update("location", { ...form.location, area: e.target.value })} placeholder="Andheri" />
              <Input label="Move-in Date" type="date" value={form.moveInDate} onChange={(e) => update("moveInDate", e.target.value)} />
              <Input label="Roommates Needed" type="number" value={form.roommatesNeeded} onChange={(e) => update("roommatesNeeded", e.target.value)} min="1" />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#EDEDEF]">Property Features</h2>
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
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#EDEDEF]">Roommate Preferences</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#EDEDEF]">Food Habit</label>
                <select value={form.foodHabit} onChange={(e) => update("foodHabit", e.target.value)}
                  className="w-full bg-[#0F0F12] rounded-lg px-4 py-2.5 text-sm text-[#EDEDEF] border border-white/10 focus:outline-none focus:border-[#5E6AD2]">
                  <option value="">Prefer not to say</option>
                  {FOOD_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#EDEDEF]">Sleep Schedule</label>
                <select value={form.sleepSchedule} onChange={(e) => update("sleepSchedule", e.target.value)}
                  className="w-full bg-[#0F0F12] rounded-lg px-4 py-2.5 text-sm text-[#EDEDEF] border border-white/10 focus:outline-none focus:border-[#5E6AD2]">
                  <option value="">Prefer not to say</option>
                  {SLEEP_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#EDEDEF]">Smoking</label>
                <select value={form.smoking} onChange={(e) => update("smoking", e.target.value)}
                  className="w-full bg-[#0F0F12] rounded-lg px-4 py-2.5 text-sm text-[#EDEDEF] border border-white/10 focus:outline-none focus:border-[#5E6AD2]">
                  <option value="">Prefer not to say</option>
                  {YES_NO.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#EDEDEF]">Drinking</label>
                <select value={form.drinking} onChange={(e) => update("drinking", e.target.value)}
                  className="w-full bg-[#0F0F12] rounded-lg px-4 py-2.5 text-sm text-[#EDEDEF] border border-white/10 focus:outline-none focus:border-[#5E6AD2]">
                  <option value="">Prefer not to say</option>
                  {YES_NO.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#EDEDEF]">Cleanliness</label>
                <select value={form.cleanliness} onChange={(e) => update("cleanliness", e.target.value)}
                  className="w-full bg-[#0F0F12] rounded-lg px-4 py-2.5 text-sm text-[#EDEDEF] border border-white/10 focus:outline-none focus:border-[#5E6AD2]">
                  <option value="">Prefer not to say</option>
                  {CLEANLINESS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
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
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#EDEDEF]">Description</h2>
            <textarea value={form.description} onChange={(e) => update("description", e.target.value)}
              placeholder="Describe what you're looking for in a roommate, your lifestyle, and what the accommodation is like..."
              rows={6} className="w-full bg-[#0F0F12] rounded-lg px-4 py-3 text-sm text-[#EDEDEF] border border-white/10 placeholder:text-[#5A5F66] focus:outline-none focus:border-[#5E6AD2] resize-none" />
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#EDEDEF]">Review</h2>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-6 space-y-3 text-sm">
              <p><span className="text-[#8A8F98]">Type:</span> <span className="text-[#EDEDEF]">{form.propertyType} · {form.sharingType}</span></p>
              <p><span className="text-[#8A8F98]">Rent:</span> <span className="text-[#EDEDEF]">₹{form.rentPerHead}/mo</span></p>
              <p><span className="text-[#8A8F98]">Location:</span> <span className="text-[#EDEDEF]">{form.location.city}{form.location.area ? `, ${form.location.area}` : ""}</span></p>
              <p><span className="text-[#8A8F98]">Amenities:</span> <span className="text-[#EDEDEF]">{form.amenities.join(", ") || "None"}</span></p>
              <p><span className="text-[#8A8F98]">Preferences:</span> <span className="text-[#EDEDEF]">{form.foodHabit || "Any"} · {form.sleepSchedule || "Flexible"}</span></p>
              {form.description && <p><span className="text-[#8A8F98]">Description:</span> <span className="text-[#EDEDEF]">{form.description.slice(0, 100)}...</span></p>}
            </div>
            <Button onClick={handleSubmit} loading={loading} className="w-full"><Save className="h-4 w-4" /> Create Listing</Button>
          </div>
        );
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight gradient-text">Create Listing</h1>
        <p className="mt-1 text-sm text-[#8A8F98]">Find the perfect roommate</p>
      </div>

      {/* Steps */}
      <div className="mb-8 flex gap-1 rounded-xl bg-white/[0.05] p-1 overflow-x-auto">
        {sections.map((s, i) => (
          <button key={s} onClick={() => setStep(i)}
            className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${step === i ? "bg-[#5E6AD2] text-white" : "text-[#8A8F98] hover:text-[#EDEDEF]"}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-card">
        {renderStep()}
        <div className="flex justify-between mt-8">
          <Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
          {step < sections.length - 1 ? (
            <Button onClick={() => setStep(step + 1)}>Continue</Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
