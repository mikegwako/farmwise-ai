import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sprout, Target, Users, BarChart3, Shield, Zap, Globe, Heart,
  TrendingUp, Calculator, Store, CheckCircle, ArrowRight,
} from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const TEAM_VALUES = [
  { icon: Target, title: 'Precision', desc: 'Every calculation is backed by real meteorological data and verified market prices from county markets across Kenya.' },
  { icon: Users, title: 'Community', desc: 'We connect over 5,000 farmers with buyers directly, eliminating middlemen and ensuring fair prices for everyone.' },
  { icon: Shield, title: 'Trust', desc: 'Transparent risk analysis helps farmers understand exactly what they\'re getting into before planting a single seed.' },
  { icon: Globe, title: 'Accessibility', desc: 'Designed for laymen — no spreadsheets, no jargon. Just clear, actionable insights in plain language.' },
];

const HOW_IT_WORKS = [
  { icon: Calculator, step: '01', title: 'Plan Your Farm', desc: 'Enter your crop, county, and farm size. Our AI auto-fills rainfall data from meteorological services and calculates everything for you.' },
  { icon: BarChart3, step: '02', title: 'Track Markets', desc: 'Real-time price trends from NCPB, Nairobi Commodities Exchange, and county markets. Switch between per-kg and per-tonne views.' },
  { icon: Store, step: '03', title: 'Connect & Sell', desc: 'Post your produce or find sellers. Our smart matching algorithm scores compatibility by crop, location, and price — no middlemen.' },
  { icon: TrendingUp, step: '04', title: 'Grow Profits', desc: 'Data-driven recommendations help you optimize soil, fertilizer, and timing. Know your break-even point before you plant.' },
];

const IMPACT_STATS = [
  { value: '15+', label: 'Counties Covered', sub: 'From Nakuru to Meru' },
  { value: '10', label: 'Crop Types', sub: 'Maize, Beans, Tea & more' },
  { value: '5,000+', label: 'Farmers Empowered', sub: 'And growing daily' },
  { value: '30%', label: 'Avg. Profit Increase', sub: 'With data-driven planning' },
];

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero py-20 md:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(var(--primary-foreground) / 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, hsl(var(--secondary) / 0.15) 0%, transparent 50%)',
          }} />
        </div>
        <div className="container relative">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/15 text-primary-foreground text-sm font-medium mb-6">
              <Sprout className="h-4 w-4" />
              About FarmWise AI
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground leading-tight mb-6">
              Empowering Kenya's Farmers with{' '}
              <span className="text-secondary">Intelligent Data</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto">
              We believe every small-scale farmer deserves access to the same quality market intelligence
              and financial planning tools that large agribusinesses use. FarmWise AI levels the playing field.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="container py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }}>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Mission</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-6">
              Transforming Agriculture Through Technology
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                In Kenya, over 75% of the population depends on agriculture. Yet most small-scale farmers
                operate without access to market data, weather analytics, or financial planning tools.
                They plant based on tradition, sell at whatever price middlemen offer, and hope for the best.
              </p>
              <p>
                <strong className="text-foreground">FarmWise AI changes this.</strong> We combine real-time weather data
                from meteorological services, live market prices from NCPB and county markets, and
                AI-powered analytics to give every farmer — from Nakuru to Meru — the power to make
                informed decisions.
              </p>
              <p>
                No complex spreadsheets. No agricultural jargon. Just clear, actionable insights
                that help you grow smarter and earn more.
              </p>
            </div>
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }} className="grid grid-cols-2 gap-4">
            {TEAM_VALUES.map((v, i) => (
              <div key={v.title} className="p-5 rounded-xl border bg-card shadow-card">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary inline-flex mb-3">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display font-bold mb-1">{v.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">How It Works</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">
              From Planting to Profit in 4 Steps
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                {...fadeUp}
                transition={{ delay: i * 0.12 }}
                className="relative p-6 rounded-xl border bg-card shadow-card group hover:shadow-elevated transition-all"
              >
                <span className="text-5xl font-display font-bold text-primary/10 absolute top-4 right-4">
                  {step.step}
                </span>
                <div className="p-3 rounded-lg bg-primary/10 text-primary inline-flex mb-4">
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="container py-16 md:py-24">
        <motion.div {...fadeUp} className="text-center mb-14">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Impact</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">Numbers That Matter</h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {IMPACT_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              {...fadeUp}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 rounded-xl border bg-card shadow-card"
            >
              <div className="text-4xl md:text-5xl font-display font-bold text-primary mb-1">{stat.value}</div>
              <div className="font-semibold text-sm">{stat.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Deep Dive */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Platform Features</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">Built for Real Farmers</h2>
          </motion.div>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              { title: 'Automatic Weather Integration', desc: 'We pull real-time rainfall, temperature, and humidity data from meteorological services. No farmer needs to guess their annual rainfall — we calculate it for you.', icon: '🌦️' },
              { title: 'Real Market Prices', desc: 'Prices sourced from NCPB, Eldoret Main Market, Karatina Market, and 20+ county markets. Updated daily with 12-month historical charts.', icon: '📊' },
              { title: 'Smart Buyer-Farmer Matching', desc: 'Our algorithm scores each listing against potential matches based on crop type, proximity, and price compatibility. No more selling at unfair prices.', icon: '🤝' },
              { title: 'Risk Analysis', desc: 'Know your break-even point, profit margins, and risk level before you invest. We factor in soil type, weather patterns, and fertilizer costs.', icon: '🛡️' },
              { title: 'Multi-County Coverage', desc: 'From Trans Nzoia\'s wheat fields to Meru\'s tea estates, we cover 15+ counties with localized data and market intelligence.', icon: '🗺️' },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                {...fadeUp}
                transition={{ delay: i * 0.08 }}
                className="flex gap-5 p-6 rounded-xl border bg-card shadow-card"
              >
                <span className="text-3xl shrink-0">{feat.icon}</span>
                <div>
                  <h3 className="font-display font-bold text-lg mb-1">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16 md:py-24">
        <motion.div
          {...fadeUp}
          className="text-center max-w-2xl mx-auto p-10 rounded-2xl gradient-hero"
        >
          <Heart className="h-10 w-10 text-secondary mx-auto mb-4" />
          <h2 className="text-3xl font-display font-bold text-primary-foreground mb-4">
            Ready to Farm Smarter?
          </h2>
          <p className="text-primary-foreground/80 mb-8 leading-relaxed">
            Join thousands of Kenyan farmers who are already making data-driven decisions.
            Create your free account in 30 seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-foreground text-primary font-semibold hover:bg-primary-foreground/90 transition-colors"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/planner"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-primary-foreground/30 text-primary-foreground font-semibold hover:bg-primary-foreground/10 transition-colors"
            >
              <Calculator className="h-4 w-4" />
              Try the Planner
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
