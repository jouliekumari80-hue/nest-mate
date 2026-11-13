import { Link } from "react-router-dom";
import { ArrowRight, Search, Heart, Shield, Sparkles, Users, Home, MessageCircle, Star, MapPin, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.2 }, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } };
const stagger = { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } };

const featured = [
  { name: "Arjun Mehta", college: "IIT Bombay", city: "Powai, Mumbai", rent: 18000, sharing: "Double", badges: ["Non-Veg", "Night Owl"] },
  { name: "Priya Sharma", college: "NMIMS", city: "Andheri West, Mumbai", rent: 22000, sharing: "Single", badges: ["Veg", "Early Bird"] },
  { name: "Rahul Verma", college: "SP Jain", city: "BKC, Mumbai", rent: 25000, sharing: "Single", badges: ["Vegan", "Flexible"] },
];

export default function Landing() {
  return (
    <div>
      <section className="relative overflow-hidden px-4 pt-32 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#5E6AD2]" />
              <span className="text-xs font-medium text-[#5E6AD2] tracking-widest uppercase">Find Your Perfect Roommate</span>
            </div>
            <h1 className="mx-auto max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-7xl lg:text-8xl leading-tight">
              <span className="gradient-text">Live with people who</span>{" "}
              <span className="gradient-text-accent">actually get you</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[#8A8F98] leading-relaxed">
              NestMate matches you with compatible roommates based on lifestyle, habits, and preferences — not just budget.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link to="/signup"><Button size="lg">Get Started <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link to="/listings"><Button variant="secondary" size="lg">Browse Listings</Button></Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeUp} className="mb-12 text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl gradient-text">Featured Roommates</h2>
            <p className="mt-4 text-lg text-[#8A8F98]">Students looking for their perfect match right now</p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {featured.map((item, i) => (
              <motion.div key={item.name} {...stagger} transition={{ ...stagger.transition, delay: i * 0.1 }}>
                <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-14 w-14 rounded-full bg-[#5E6AD2]/20 border-2 border-accent/30 flex items-center justify-center shrink-0">
                      <span className="text-lg font-semibold text-[#5E6AD2]">{item.name.split(" ").map(n => n[0]).join("")}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#EDEDEF]">{item.name}</h3>
                      <p className="text-xs text-[#8A8F98] mt-0.5">{item.college}</p>
                      <p className="text-xs text-[#8A8F98] flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" /> {item.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm font-semibold text-[#EDEDEF]"><IndianRupee className="inline h-3 w-3" />{item.rent.toLocaleString()}</span>
                    <span className="text-xs text-[#8A8F98]">/mo · {item.sharing}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">{item.badges.map((b) => <Badge key={b}>{b}</Badge>)}</div>
                  <Link to="/signup"><Button size="sm" className="w-full">Connect</Button></Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeUp} className="mb-16 text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl gradient-text">How it works</h2>
            <p className="mt-4 text-lg text-[#8A8F98]">Three simple steps to find your ideal roommate</p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: <Search className="h-6 w-6 text-[#5E6AD2]" />, title: "Browse Listings", desc: "Search through roommate listings filtered by city, budget, and lifestyle preferences." },
              { icon: <Heart className="h-6 w-6 text-[#5E6AD2]" />, title: "Send Requests", desc: "Found someone compatible? Send them a roommate request with a personal message." },
              { icon: <MessageCircle className="h-6 w-6 text-[#5E6AD2]" />, title: "Connect & Move In", desc: "Once accepted, connect with your new roommate and start your living arrangement." },
            ].map((step, i) => (
              <motion.div key={step.title} {...stagger} transition={{ ...stagger.transition, delay: i * 0.1 }}
                className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-8 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#5E6AD2]/10 border border-accent/30">{step.icon}</div>
                <h3 className="text-lg font-semibold text-[#EDEDEF]">{step.title}</h3>
                <p className="mt-2 text-sm text-[#8A8F98] leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeUp} className="mb-16 text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl gradient-text">Why NestMate?</h2>
            <p className="mt-4 text-lg text-[#8A8F98]">Built for students who care about compatibility</p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <Users className="h-5 w-5 text-[#5E6AD2]" />, title: "Lifestyle Matching", desc: "Match based on sleep schedule, cleanliness, food habits, and more." },
              { icon: <Shield className="h-5 w-5 text-[#5E6AD2]" />, title: "Verified Profiles", desc: "College-verified profiles ensure real student connections." },
              { icon: <Home className="h-5 w-5 text-[#5E6AD2]" />, title: "Detailed Listings", desc: "Comprehensive listings with photos, amenities, and preferences." },
              { icon: <Sparkles className="h-5 w-5 text-[#5E6AD2]" />, title: "AI Compatibility", desc: "Smart matching insights to find your perfect roommate." },
              { icon: <Heart className="h-5 w-5 text-[#5E6AD2]" />, title: "Save Favorites", desc: "Bookmark listings and compare them side by side." },
              { icon: <MessageCircle className="h-5 w-5 text-[#5E6AD2]" />, title: "Request System", desc: "Send, accept, and manage roommate requests seamlessly." },
            ].map((f, i) => (
              <motion.div key={f.title} {...stagger} transition={{ ...stagger.transition, delay: i * 0.05 }}
                className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 shadow-card">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.05]">{f.icon}</div>
                <h3 className="text-sm font-semibold text-[#EDEDEF]">{f.title}</h3>
                <p className="mt-1.5 text-xs text-[#8A8F98] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeUp} className="mb-16 text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl gradient-text">Loved by students</h2>
            <p className="mt-4 text-lg text-[#8A8F98]">Here's what our users say about NestMate</p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: "Ananya K.", college: "IIT Delhi", text: "Found my ideal roommate in 2 days. The lifestyle matching is incredible." },
              { name: "Rohit P.", college: "BITS Pilani", text: "Way better than random Facebook groups. Actually found someone who gets me." },
              { name: "Sneha M.", college: "Christ University", text: "The profile system made it easy to find someone with similar habits." },
            ].map((t, i) => (
              <motion.div key={t.name} {...stagger} transition={{ ...stagger.transition, delay: i * 0.1 }}
                className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 shadow-card">
                <div className="flex gap-1 mb-4">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-4 w-4 fill-yellow-500 text-yellow-500" />)}</div>
                <p className="text-sm text-[#8A8F98] leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#5E6AD2]/20 border-2 border-accent/30 flex items-center justify-center">
                    <span className="text-xs font-semibold text-[#5E6AD2]">{t.name.split(" ").map(n => n[0]).join("")}</span>
                  </div>
                  <div><p className="text-sm font-medium text-[#EDEDEF]">{t.name}</p><p className="text-xs text-[#8A8F98]">{t.college}</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl gradient-text">Ready to find your people?</h2>
            <p className="mt-4 text-lg text-[#8A8F98]">Join NestMate and discover roommates who share your lifestyle.</p>
            <div className="mt-8"><Link to="/signup"><Button size="lg">Create your profile <ArrowRight className="h-4 w-4" /></Button></Link></div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
