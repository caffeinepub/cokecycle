import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Gift,
  Globe,
  Leaf,
  QrCode,
  Recycle,
  ShoppingBag,
  Trash2,
  TrendingDown,
  Users,
  Waves,
  Zap,
} from "lucide-react";
import { useRef } from "react";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const stats = [
  {
    icon: Waves,
    value: "8M Tons",
    label: "Dumped in oceans yearly",
    color: "text-blue-400",
  },
  {
    icon: Trash2,
    value: "91%",
    label: "Of plastic never recycled",
    color: "text-secondary",
  },
  {
    icon: ShoppingBag,
    value: "500B",
    label: "Bottles produced annually",
    color: "text-yellow-400",
  },
  {
    icon: TrendingDown,
    value: "30%",
    label: "Recycling participation rate",
    color: "text-primary",
  },
];

const steps = [
  {
    num: "01",
    icon: ShoppingBag,
    title: "Buy Bottle",
    desc: "Purchase any CokeCycle partner product with a unique QR code printed on the label.",
  },
  {
    num: "02",
    icon: QrCode,
    title: "Scan QR Code",
    desc: "Use our app to scan the QR code on your bottle before or after consumption.",
  },
  {
    num: "03",
    icon: Recycle,
    title: "Return Bottle",
    desc: "Drop your bottle at any smart recycling bin or partner collection center near you.",
  },
  {
    num: "04",
    icon: Gift,
    title: "Earn Rewards",
    desc: "Instantly earn reward points redeemable for discounts, gifts, and eco-certificates.",
  },
];

const badges = [
  { emoji: "🌱", name: "Eco Beginner", desc: "Recycle your first bottle" },
  { emoji: "♻️", name: "Recycling Champion", desc: "Recycle 10 bottles" },
  { emoji: "🌍", name: "Planet Protector", desc: "Recycle 50 bottles" },
];

export function LandingPage() {
  const { login, identity } = useInternetIdentity();
  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();
  const featuresRef = useRef<HTMLElement>(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-primary mb-6">
                <Zap className="w-3.5 h-3.5" />
                <span>Smart Recycling Platform</span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                Turn Plastic
                <br />
                <span className="text-gradient-green">Bottles</span> into
                <br />
                <span className="text-secondary">Rewards.</span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
                CokeCycle is a smart recycling incentive platform that motivates
                people to return plastic bottles using QR tracking and instant
                rewards.
              </p>
              <div className="flex flex-wrap gap-4">
                {isLoggedIn ? (
                  <Link to="/scan">
                    <Button
                      size="lg"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 glow-green px-8 text-base"
                      data-ocid="hero.primary_button"
                    >
                      <QrCode className="w-5 h-5 mr-2" />
                      Scan Bottle
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    size="lg"
                    onClick={login}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 glow-green px-8 text-base"
                    data-ocid="hero.primary_button"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
                <Button
                  size="lg"
                  variant="outline"
                  onClick={scrollToFeatures}
                  className="border-border text-muted-foreground hover:text-foreground px-8 text-base"
                  data-ocid="hero.secondary_button"
                >
                  How It Works
                </Button>
              </div>
              <div className="flex gap-8 mt-10 pt-8 border-t border-white/5">
                {[
                  { v: "45K+", l: "Bottles Recycled" },
                  { v: "2.4K+", l: "Active Users" },
                  { v: "5★", l: "Avg Rating" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="font-display text-2xl font-bold text-primary">
                      {s.v}
                    </div>
                    <div className="text-muted-foreground text-xs mt-0.5">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative flex items-center justify-center animate-fade-in">
              <div className="relative w-full max-w-lg">
                <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-2xl scale-105" />
                <img
                  src="/assets/generated/hero-bottle.dim_800x600.png"
                  alt="CokeCycle - Smart Bottle Recycling"
                  className="relative rounded-2xl w-full shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 glass rounded-xl px-4 py-3 shadow-lg animate-pulse-glow">
                  <div className="text-xs text-muted-foreground">
                    Points Earned
                  </div>
                  <div className="font-display text-xl font-bold text-primary">
                    +5 pts ✨
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 glass rounded-xl px-4 py-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs text-primary font-medium">
                      Verified Recycled
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-secondary mb-4">
            <Trash2 className="w-3.5 h-3.5" />
            The Crisis
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            The Plastic Waste <span className="text-secondary">Problem</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every year, billions of plastic bottles go unrecycled. The scale of
            this crisis demands immediate action.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="glass glass-hover rounded-2xl p-6"
              data-ocid={`problem.card.${i + 1}`}
            >
              <div
                className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${stat.color}`}
              >
                <stat.icon className="w-5 h-5" />
              </div>
              <div
                className={`font-display text-3xl font-bold mb-2 ${stat.color}`}
              >
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm leading-relaxed">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section ref={featuresRef} className="py-20 relative">
        <div className="absolute inset-0 bg-primary/2 pointer-events-none" />
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-primary mb-4">
              <Recycle className="w-3.5 h-3.5" />
              The Process
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              How <span className="text-gradient-green">CokeCycle</span> Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className="glass rounded-2xl p-6 relative group hover:border-primary/30 transition-all duration-300"
                data-ocid={`steps.card.${i + 1}`}
              >
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-3 w-6 h-px bg-primary/30 z-10" />
                )}
                <div className="text-primary/30 font-display text-5xl font-black leading-none mb-4">
                  {step.num}
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Badges Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Earn <span className="text-gradient-green">Achievement Badges</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {badges.map((badge, i) => (
            <div
              key={badge.name}
              className="glass glass-hover rounded-2xl p-8 text-center"
              data-ocid={`badges.card.${i + 1}`}
            >
              <div className="text-5xl mb-4">{badge.emoji}</div>
              <h3 className="font-display font-bold text-lg mb-2 text-primary">
                {badge.name}
              </h3>
              <p className="text-muted-foreground text-sm">{badge.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Counters */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-primary mb-4">
              <Globe className="w-3.5 h-3.5" />
              Live Impact
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Our{" "}
              <span className="text-gradient-green">Environmental Impact</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                value: 45200,
                suffix: "",
                label: "Bottles Recycled",
                icon: Recycle,
                decimals: 0,
              },
              {
                value: 1.2,
                suffix: " Tons",
                label: "Plastic Saved",
                icon: Leaf,
                decimals: 1,
              },
              {
                value: 3.4,
                suffix: " Tons",
                label: "Carbon Reduced",
                icon: Globe,
                decimals: 1,
              },
            ].map((item, i) => (
              <div
                key={item.label}
                className="glass rounded-2xl p-8 text-center glow-green"
                data-ocid={`impact.card.${i + 1}`}
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="font-display text-5xl font-black text-primary mb-2">
                  <AnimatedCounter
                    target={item.value}
                    suffix={item.suffix}
                    decimals={item.decimals}
                  />
                </div>
                <div className="text-foreground font-semibold text-lg">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 container mx-auto px-4">
        <div className="glass rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-secondary/5 pointer-events-none" />
          <div className="relative">
            <h2 className="font-display text-4xl md:text-6xl font-black mb-6">
              Join the
              <br />
              <span className="text-gradient-green">Recycling Revolution.</span>
            </h2>
            <p className="text-muted-foreground text-xl mb-10 max-w-2xl mx-auto">
              Thousands of eco-warriors are already earning rewards. Start your
              journey today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {isLoggedIn ? (
                <Link to="/scan">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 glow-green px-10 text-lg h-14"
                    data-ocid="cta.primary_button"
                  >
                    <QrCode className="w-5 h-5 mr-2" />
                    Start Scanning
                  </Button>
                </Link>
              ) : (
                <>
                  <Button
                    size="lg"
                    onClick={login}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 glow-green px-10 text-lg h-14"
                    data-ocid="cta.primary_button"
                  >
                    <QrCode className="w-5 h-5 mr-2" />
                    Start Scanning
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={login}
                    className="border-border text-foreground px-10 text-lg h-14"
                    data-ocid="cta.secondary_button"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Create Account
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
