export default function ListingGallery({ images = [] }) {
  if (images.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] h-48 flex items-center justify-center">
        <p className="text-sm text-[#8A8F98]">No images yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {images.slice(0, 4).map((img, i) => (
        <div key={i} className={`rounded-xl overflow-hidden ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
          <img src={img} alt="" className="h-full w-full object-cover" />
        </div>
      ))}
    </div>
  );
}
