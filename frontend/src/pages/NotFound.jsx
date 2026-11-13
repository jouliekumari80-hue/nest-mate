import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/[0.05] border border-white/[0.06]">
        <Home className="h-8 w-8 text-[#8A8F98]" />
      </div>
      <h1 className="text-6xl font-semibold tracking-tight gradient-text">404</h1>
      <p className="mt-4 text-lg text-[#8A8F98]">This page doesn't exist</p>
      <Link to="/" className="mt-8"><Button>Go Home</Button></Link>
    </div>
  );
}
