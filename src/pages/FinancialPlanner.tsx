import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CROPS, COUNTIES, SOIL_TYPES, calculateFarmAnalysis,
  type FarmInput, type FarmAnalysis, type CropType, type County, type SoilType,
} from '@/lib/farmData';
import { fetchWeatherData, getWeatherEmoji, getWeatherDescription, type WeatherData } from '@/lib/weatherApi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Leaf, CloudRain, Loader2,
} from 'lucide-react';

export default function FinancialPlanner() {
  const [input, setInput] = useState<FarmInput>({
    crop: 'Maize',
    county: 'Nakuru',
    farmSize: 5,
    soilType: 'Loam',
    fertilizerBudget: 20000,
    expectedRainfall: undefined,
  });
  const [result, setResult] = useState<FarmAnalysis | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  // Fetch weather when county changes
  useEffect(() => {
    let cancelled = false;
    setLoadingWeather(true);
    fetchWeatherData(input.county)
      .then((data) => {
        if (cancelled) return;
        setWeather(data);
        // Auto-fill rainfall estimate (annualized from 30-day data)
        const annualizedRainfall = Math.round(data.rainfall30d * 12);
        setInput((prev) => ({ ...prev, expectedRainfall: annualizedRainfall }));
      })
      .catch(() => {
        if (!cancelled) setWeather(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingWeather(false);
      });
    return () => { cancelled = true; };
  }, [input.county]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(calculateFarmAnalysis(input));
  };

  const formatKES = (n: number) => `KES ${n.toLocaleString()}`;

  const chartData = result
    ? [
        { name: 'Revenue', value: result.estimatedRevenue, fill: 'hsl(145, 63%, 32%)' },
        { name: 'Cost', value: result.estimatedCost, fill: 'hsl(38, 92%, 50%)' },
        { name: 'Profit', value: Math.max(0, result.projectedProfit), fill: 'hsl(145, 63%, 42%)' },
      ]
    : [];

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Farm Financial Planner</h1>
        <p className="text-muted-foreground">Enter your farm details to get AI-powered yield and profit projections.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
          <div className="p-6 rounded-xl border bg-card shadow-card space-y-4">
            <SelectField label="Crop Type" value={input.crop} options={[...CROPS]}
              onChange={(v) => setInput({ ...input, crop: v as CropType })} />
            <SelectField label="County / Location" value={input.county} options={[...COUNTIES]}
              onChange={(v) => setInput({ ...input, county: v as County })} />
            
            {/* Live weather widget */}
            {loadingWeather ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 rounded-lg bg-muted/50">
                <Loader2 className="h-4 w-4 animate-spin" />
                Fetching weather for {input.county}...
              </div>
            ) : weather ? (
              <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="text-lg">{getWeatherEmoji(weather.weatherCode)}</span>
                  {getWeatherDescription(weather.weatherCode)} — {weather.currentTemp}°C
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><CloudRain className="h-3 w-3" /> 7d: {weather.rainfall7d}mm</span>
                  <span>30d: {weather.rainfall30d}mm</span>
                  <span>Humidity: {weather.humidity}%</span>
                </div>
              </div>
            ) : null}

            <NumberField label="Farm Size (acres)" value={input.farmSize}
              onChange={(v) => setInput({ ...input, farmSize: v })} min={0.5} step={0.5} />
            <SelectField label="Soil Type" value={input.soilType} options={[...SOIL_TYPES]}
              onChange={(v) => setInput({ ...input, soilType: v as SoilType })} />
            <NumberField label="Fertilizer Budget (KES)" value={input.fertilizerBudget}
              onChange={(v) => setInput({ ...input, fertilizerBudget: v })} min={0} step={1000} />
            <NumberField label="Expected Annual Rainfall (mm)" value={input.expectedRainfall ?? 0}
              onChange={(v) => setInput({ ...input, expectedRainfall: v || undefined })} min={0} step={50} />

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Leaf className="h-5 w-5" />
              Calculate Projections
            </button>
          </div>
        </form>

        {/* Results */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Metric cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <MetricCard label="Estimated Yield" value={`${result.estimatedYield} tons`} icon={<Leaf className="h-5 w-5" />} />
                  <MetricCard label="Revenue" value={formatKES(result.estimatedRevenue)} icon={<TrendingUp className="h-5 w-5" />} positive />
                  <MetricCard label="Total Cost" value={formatKES(result.estimatedCost)} icon={<TrendingDown className="h-5 w-5" />} />
                  <MetricCard label="Net Profit" value={formatKES(result.projectedProfit)} icon={result.projectedProfit >= 0 ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />} positive={result.projectedProfit >= 0} />
                  <MetricCard label="Profit Margin" value={`${result.profitMargin}%`} positive={result.profitMargin > 0} />
                  <MetricCard label="Risk Level" value={result.riskLevel} icon={<AlertTriangle className="h-5 w-5" />}
                    className={result.riskLevel === 'Low' ? 'border-success/30' : result.riskLevel === 'Medium' ? 'border-warning/30' : 'border-destructive/30'} />
                </div>

                {/* Chart */}
                <div className="p-6 rounded-xl border bg-card shadow-card">
                  <h3 className="font-display font-bold mb-4">Financial Breakdown</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                      <Tooltip formatter={(v: number) => formatKES(v)} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {chartData.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Recommendations */}
                <div className="p-6 rounded-xl border bg-card shadow-card">
                  <h3 className="font-display font-bold mb-3">Recommendations</h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-64 rounded-xl border border-dashed bg-muted/30"
              >
                <div className="text-center text-muted-foreground">
                  <Leaf className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Fill in your farm details</p>
                  <p className="text-sm">Results will appear here</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function SelectField({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function NumberField({ label, value, onChange, min, step }: {
  label: string; value: number; onChange: (v: number) => void; min: number; step: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={min}
        step={step}
        className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
      />
    </div>
  );
}

function MetricCard({ label, value, icon, positive, className = '' }: {
  label: string; value: string; icon?: React.ReactNode; positive?: boolean; className?: string;
}) {
  return (
    <div className={`p-4 rounded-xl border bg-card shadow-card ${className}`}>
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        {icon && <span className={positive ? 'text-success' : 'text-muted-foreground'}>{icon}</span>}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}
