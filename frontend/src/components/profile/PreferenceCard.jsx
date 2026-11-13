import Badge from "../ui/Badge";

export default function PreferenceCard({ preferences = {} }) {
  const items = [
    { label: "Food", value: preferences.foodHabit },
    { label: "Sleep", value: preferences.sleepSchedule },
    { label: "Smoking", value: preferences.smoking },
    { label: "Drinking", value: preferences.drinking },
    { label: "Cleanliness", value: preferences.cleanliness },
    { label: "Gender", value: preferences.genderPreference },
  ].filter((t) => t.value);

  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 shadow-card">
      <h2 className="text-sm font-semibold text-[#EDEDEF] mb-4">Preferences</h2>
      <div className="flex flex-wrap gap-2">
        {items.map((t) => <Badge key={t.label} variant="neutral">{t.label}: {t.value}</Badge>)}
      </div>
      {preferences.interests?.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-[#8A8F98] mb-2">Interests</p>
          <div className="flex flex-wrap gap-1">
            {preferences.interests.map((i) => <Badge key={i} variant="neutral">{i}</Badge>)}
          </div>
        </div>
      )}
    </div>
  );
}
