export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#020203]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-sm text-[#8A8F98]">
            Made with <span className="text-red-400">💗</span> by Ishita Singla
          </p>
          <p className="text-xs text-[#8A8F98]">&copy; {new Date().getFullYear()} NestMate. Find your perfect roommate.</p>
        </div>
      </div>
    </footer>
  );
}
