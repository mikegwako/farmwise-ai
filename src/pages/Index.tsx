import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calculator, BarChart3, Store, TrendingUp, Shield, Zap } from 'lucide-react';
import heroImage from '@/assets/hero-farm.jpg';

const FEATURES = [
  {
    icon: Calculator,
    title: 'Financial Planner',
    desc: 'Predict yield, estimate costs, and project profits for any crop and county.',
    link: '/planner',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: BarChart3,
    title: 'Market Intelligence',
    desc: 'Real-time market prices, trends, and volatility data across Kenyan counties.',
    link: '/market',
    color: 'bg-info/10 text-info',
  },
  {
    icon: Store,
    title: 'Marketplace',
    desc: 'Connect with buyers and sellers. Smart matching by location and price.',
    link: '/marketplace',
    color: 'bg-secondary/10 text-secondary-foreground',
  },
];

const STATS = [
  { value: '15+', label: 'Counties Covered' },
  { value: '10+', label: 'Crop Types' },
  { value: '5,000+', label: 'Farmers Connected' },
  { value: '98%', label: 'Accuracy Rate' },
];

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Kenyan farmland" className="w-full h-full object-cover" />
          <div className="absolute inset-0 gradient-hero opacity-80" />
        </div>
        <div className="relative container py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary-foreground/20 text-primary-foreground mb-4">
              🌱 AI-Powered Farm Finance
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground leading-tight mb-6">
              Grow Smarter,{' '}
              <span className="text-secondary">Earn More</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed">
              FarmWise AI helps small-scale Kenyan farmers predict yields, track market prices, and connect with buyers — all in one platform.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/planner"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-foreground text-primary font-semibold hover:bg-primary-foreground/90 transition-colors"
              >
                <Calculator className="h-5 w-5" />
                Start Planning
              </Link>
              <Link
                to="/market"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-primary-foreground/30 text-primary-foreground font-semibold hover:bg-primary-foreground/10 transition-colors"
              >
                <BarChart3 className="h-5 w-5" />
                View Market Prices
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-card">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-6 py-10">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-display font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Everything You Need to Farm Profitably</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            From financial projections to live market data, FarmWise AI gives you the tools to make better farming decisions.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Link
                to={f.link}
                className="block p-6 rounded-xl border bg-card shadow-card hover:shadow-elevated transition-all group"
              >
                <div className={`inline-flex p-3 rounded-lg mb-4 ${f.color}`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-display font-bold mb-2 group-hover:text-primary transition-colors">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why FarmWise */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Why FarmWise AI?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: TrendingUp, title: 'Data-Driven', desc: 'Make decisions backed by real market data and AI predictions.' },
              { icon: Shield, title: 'Risk Aware', desc: 'Understand your risk before planting. Know your break-even point.' },
              { icon: Zap, title: 'Instant Results', desc: 'Get yield and profit estimates in seconds. No complex spreadsheets.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
