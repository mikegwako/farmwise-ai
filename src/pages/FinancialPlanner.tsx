import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CROPS, COUNTIES, SOIL_TYPES, calculateFarmAnalysis,
  type FarmInput, type FarmAnalysis, type CropType, type County, type SoilType,
} from '@/lib/farmData';
import { CROP_COUNTIES, CROP_ADVISORIES, getEstimatedHarvestDate } from '@/lib/cropData';
import { saveFarmAnalysis, getFarmHistory, deleteFarmEntry, type SavedFarmAnalysis } from '@/lib/farmHistory';
import { fetchWeatherData, getWeatherEmoji, getWeatherDescription, type WeatherData } from '@/lib/weatherApi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Leaf, CloudRain, Loader2,
  Save, History, Trash2, Sprout, Calendar, Beaker, ChevronDown, ChevronUp,
} from 'lucide-react';

const FRACTIONAL_PRESETS = [
  { label: '⅛ acre', value: 0.125 },
  { label: '¼ acre', value: 0.25 },
  { label: '½ acre', value: 0.5 },
  { label: '¾ acre', value: 0.75 },
  { label: '1 acre', value: 1 },
];

function formatAcres(acres: number): string {
  if (acres >= 1) return `${acres} acre${acres !== 1 ? 's' : ''}`;
  const fracs: [number, string][] = [[0.125, '⅛'], [0.25, '¼'], [0.375, '⅜'], [0.5, '½'], [0.625, '⅝'], [0.75, '¾'], [0.875, '⅞']];
  const match = fracs.find(([v]) => Math.abs(v - acres) < 0.01);
  return match ? `${match[1]} acre` : `${acres} acres`;
}

export default function FinancialPlanner() {
  const [farmName, setFarmName] = useState('');
  const [input, setInput] = useState<FarmInput>({
    crop: 'Maize',
    county: 'Nakuru',
    farmSize: 1,
    soilType: 'Loam',
    fertilizerBudget: 20000,
    expectedRainfall: undefined,
  });
  const [result, setResult] = useState<FarmAnalysis | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAdvisory, setShowAdvisory] = useState(true);
  const [history, setHistory] = useState<SavedFarmAnalysis[]>([]);

  // Counties filtered by selected crop
  const availableCounties = useMemo(() => {
    const cropCounties = CROP_COUNTIES[input.crop] || [];
    return cropCounties.length > 0 ? cropCounties : [...COUNTIES];
  }, [input.crop]);

  // Reset county if current selection not valid for new crop
  useEffect(() => {
    if (!availableCounties.includes(input.county)) {
      setInput(prev => ({ ...prev, county: availableCounties[0] }));
    }
  }, [availableCounties, input.county]);

  // Fetch weather when county changes
  useEffect(() => {
    let cancelled = false;
    setLoadingWeather(true);
    fetchWeatherData(input.county)
      .then((data) => {
        if (cancelled) return;
        setWeather(data);
        const annualizedRainfall = Math.round(data.rainfall30d * 12);
        setInput((prev) => ({ ...prev, expectedRainfall: annualizedRainfall }));
      })
      .catch(() => { if (!cancelled) setWeather(null); })
      .finally(() => { if (!cancelled) setLoadingWeather(false); });
    return () => { cancelled = true; };
  }, [input.county]);

  // Load history
  useEffect(() => {
    setHistory(getFarmHistory());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(calculateFarmAnalysis(input));
    setSaved(false);
  };

  const handleSave = () => {
    if (!result) return;
    const name = farmName.trim() || `${input.crop} farm — ${input.county}`;
    saveFarmAnalysis(name, input, result);
    setSaved(true);
    setHistory(getFarmHistory());
  };

  const handleDeleteHistory = (id: string) => {
    deleteFarmEntry(id);
    setHistory(getFarmHistory());
  };

  const handleLoadHistory = (entry: SavedFarmAnalysis) => {
    setFarmName(entry.farmName);
    setInput(entry.input);
    setResult(entry.result);
    setSaved(true);
    setShowHistory(false);
  };

  const formatKES = (n: number) => `KES ${n.toLocaleString()}`;
  const advisory = CROP_ADVISORIES[input.crop];
  const harvestDates = getEstimatedHarvestDate(input.crop);

  const chartData = result
    ? [
        { name: 'Revenue', value: result.estimatedRevenue, fill: 'hsl(145, 63%, 32%)' },
        { name: 'Cost', value: result.estimatedCost, fill: 'hsl(38, 92%, 50%)' },
        { name: 'Profit', value: Math.max(0, result.projectedProfit), fill: 'hsl(145, 63%, 42%)' },
      ]
    : [];

  return (
    <div className="container py-8 md:py-12">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Farm Financial Planner</h1>
          <p className="text-muted-foreground">Enter your farm details to get AI-powered yield and profit projections.</p>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-card text-sm font-medium hover:bg-muted transition-colors"
        >
          <History className="h-4 w-4" />
          History ({history.length})
        </button>
      </div>

      {/* History panel */}
      <AnimatePresence>
        {showHistory && history.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="rounded-xl border bg-card shadow-card p-4">
              <h3 className="font-display font-bold mb-3">Saved Farm Analyses</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {history.slice(0, 9).map((entry) => (
                  <div key={entry.id} className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-1">
                      <button onClick={() => handleLoadHistory(entry)} className="text-left">
                        <h4 className="font-semibold text-sm">{entry.farmName}</h4>
                        <p className="text-xs text-muted-foreground">{entry.input.crop} — {entry.input.county} — {formatAcres(entry.input.farmSize)}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Profit: {formatKES(entry.result.projectedProfit)} | {new Date(entry.savedAt).toLocaleDateString()}
                        </p>
                      </button>
                      <button onClick={() => handleDeleteHistory(entry.id)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
          <div className="p-6 rounded-xl border bg-card shadow-card space-y-4">
            {/* Farm name */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Farm Name (optional)</label>
              <input
                type="text"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                placeholder="e.g. Shamba la Nyeri, Plot 2 Busia..."
                className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
              />
            </div>

            <SelectField label="Crop Type" value={input.crop} options={[...CROPS]}
              onChange={(v) => setInput({ ...input, crop: v as CropType })} />

            <SelectField label="County / Location" value={input.county} options={availableCounties as unknown as string[]}
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

            {/* Farm size with fractional presets */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Farm Size ({formatAcres(input.farmSize)})</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {FRACTIONAL_PRESETS.map(({ label, value }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setInput({ ...input, farmSize: value })}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      Math.abs(input.farmSize - value) < 0.01
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={input.farmSize}
                onChange={(e) => setInput({ ...input, farmSize: parseFloat(e.target.value) || 0.125 })}
                min={0.125}
                step={0.125}
                className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
              />
            </div>

            <SelectField label="Soil Type" value={input.soilType} options={[...SOIL_TYPES]}
              onChange={(v) => setInput({ ...input, soilType: v as SoilType })} />
            <NumberField label="Fertilizer Budget (KES)" value={input.fertilizerBudget}
              onChange={(v) => setInput({ ...input, fertilizerBudget: v })} min={0} step={1000} />
            <div>
              <label className="block text-sm font-medium mb-1.5">Expected Annual Rainfall (mm)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={input.expectedRainfall ?? 0}
                  readOnly
                  className="w-full px-3 py-2.5 rounded-lg border bg-muted/50 text-sm outline-none cursor-default"
                />
                <span className="text-xs text-muted-foreground whitespace-nowrap">Auto from weather</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Leaf className="h-5 w-5" />
              Calculate Projections
            </button>
          </div>

          {/* Planting Advisory Card */}
          <div className="rounded-xl border bg-card shadow-card overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvisory(!showAdvisory)}
              className="w-full p-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <Sprout className="h-5 w-5 text-primary" />
                <span className="font-display font-bold">Planting Advisory — {input.crop}</span>
              </div>
              {showAdvisory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            <AnimatePresence>
              {showAdvisory && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-3 text-sm">
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <div className="flex items-center gap-2 font-medium text-primary mb-1">
                        <Calendar className="h-4 w-4" />
                        Planting Season
                      </div>
                      <p className="text-muted-foreground">{advisory.plantingSeason}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 font-medium mb-1">
                        <Calendar className="h-4 w-4 text-success" />
                        Expected Harvest
                      </div>
                      <p className="text-muted-foreground">
                        {advisory.daysToMaturity[0]}–{advisory.daysToMaturity[1]} days after planting
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        If planted today: {harvestDates.earliest.toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })} — {harvestDates.latest.toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 font-medium mb-2">
                        <Beaker className="h-4 w-4 text-warning" />
                        Recommended Fertilizers
                      </div>
                      {advisory.fertilizers.map((f, i) => (
                        <div key={i} className="mb-2 last:mb-0">
                          <p className="font-medium text-xs">{f.name} — {f.rate}</p>
                          <p className="text-xs text-muted-foreground">{f.timing}</p>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="font-medium mb-1">🌱 Recommended Seed Varieties</p>
                      <div className="flex flex-wrap gap-1.5">
                        {advisory.seedVarieties.map((v, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">{v}</span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="font-medium mb-1">📏 Spacing</p>
                      <p className="text-muted-foreground text-xs">{advisory.spacing}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="font-medium mb-1">💡 Expert Tips</p>
                      <ul className="space-y-1">
                        {advisory.tips.map((tip, i) => (
                          <li key={i} className="flex gap-2 text-xs text-muted-foreground">
                            <CheckCircle className="h-3 w-3 mt-0.5 text-primary shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
                {/* Save button */}
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-bold text-lg">
                    {farmName || `${input.crop} — ${input.county}`} ({formatAcres(input.farmSize)})
                  </h2>
                  <button
                    onClick={handleSave}
                    disabled={saved}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      saved
                        ? 'bg-success/10 text-success cursor-default'
                        : 'bg-primary text-primary-foreground hover:opacity-90'
                    }`}
                  >
                    {saved ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                    {saved ? 'Saved' : 'Save Analysis'}
                  </button>
                </div>

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
