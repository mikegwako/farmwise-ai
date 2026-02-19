import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getMarketData, getPriceTrend, CROPS, COUNTIES, type CropType, type County } from '@/lib/farmData';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Activity, MapPin, Store } from 'lucide-react';

type PriceUnit = 'kg' | 'tonne';
type TimeRange = '1M' | '3M' | '6M' | '1Y';

const RANGE_DAYS: Record<TimeRange, number> = { '1M': 31, '3M': 92, '6M': 183, '1Y': 366 };

export default function MarketDashboard() {
  const [selectedCrop, setSelectedCrop] = useState<CropType>('Maize');
  const [selectedCounty, setSelectedCounty] = useState<County | 'All'>('All');
  const [unit, setUnit] = useState<PriceUnit>('kg');
  const [range, setRange] = useState<TimeRange>('1M');

  const allData = useMemo(() => getMarketData(), []);
  const fullTrendData = useMemo(() => getPriceTrend(selectedCrop), [selectedCrop]);

  // Slice trend data based on selected range
  const trendData = useMemo(() => {
    const days = RANGE_DAYS[range];
    const sliced = fullTrendData.slice(-days);
    if (unit === 'kg') return sliced.map(d => ({ ...d, price: Math.round(d.price / 1000) }));
    return sliced;
  }, [fullTrendData, range, unit]);

  const todayStr = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }, []);

  const filtered = allData.filter(
    (d) => d.crop === selectedCrop && (selectedCounty === 'All' || d.county === selectedCounty)
  );

  const convertPrice = (pricePerTonne: number) => unit === 'kg' ? Math.round(pricePerTonne / 1000) : pricePerTonne;
  const unitLabel = unit === 'kg' ? '/Kg' : '/Tonne';

  const avgPrice = filtered.length
    ? convertPrice(Math.round(filtered.reduce((s, d) => s + d.price, 0) / filtered.length))
    : 0;
  const avg7d = filtered.length
    ? parseFloat((filtered.reduce((s, d) => s + d.change7d, 0) / filtered.length).toFixed(1))
    : 0;

  const formatKES = (n: number) => `KES ${n.toLocaleString()}`;

  // Determine tick interval based on range
  const tickInterval = range === '1M' ? 2 : range === '3M' ? 6 : range === '6M' ? 13 : 29;

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Market Intelligence</h1>
        <p className="text-muted-foreground">Live market prices and trends across Kenyan counties. Data sourced from county markets &amp; NCPB.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value as CropType)}
          className="px-3 py-2 rounded-lg border bg-card text-sm font-medium focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
        >
          {CROPS.slice(0, 6).map((c) => <option key={c}>{c}</option>)}
        </select>
        <select
          value={selectedCounty}
          onChange={(e) => setSelectedCounty(e.target.value as County | 'All')}
          className="px-3 py-2 rounded-lg border bg-card text-sm font-medium focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
        >
          <option value="All">All Counties</option>
          {COUNTIES.slice(0, 5).map((c) => <option key={c}>{c}</option>)}
        </select>
        {/* Unit toggle */}
        <div className="flex items-center rounded-lg border bg-card overflow-hidden text-sm font-medium">
          <button
            onClick={() => setUnit('kg')}
            className={`px-3 py-2 transition-colors ${unit === 'kg' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Per Kg
          </button>
          <button
            onClick={() => setUnit('tonne')}
            className={`px-3 py-2 transition-colors ${unit === 'tonne' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Per Tonne
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <SummaryCard label={`Average Price ${unitLabel}`} value={formatKES(avgPrice)} icon={<Activity className="h-5 w-5" />} />
        <SummaryCard
          label="7-Day Change"
          value={`${avg7d > 0 ? '+' : ''}${avg7d}%`}
          icon={avg7d >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
          positive={avg7d >= 0}
        />
        <SummaryCard label="Markets Tracked" value={`${filtered.length}`} icon={<MapPin className="h-5 w-5" />} />
        <SummaryCard label="Crop" value={selectedCrop} />
      </div>

      {/* Price trend chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl border bg-card shadow-card mb-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="font-display font-bold">
            Price Trend — {selectedCrop} ({unit === 'kg' ? 'per Kg' : 'per Tonne'})
          </h3>
          {/* Time range selector */}
          <div className="flex items-center rounded-lg border bg-muted/30 overflow-hidden text-xs font-medium">
            {(['1M', '3M', '6M', '1Y'] as TimeRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 transition-colors ${range === r ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10 }}
              tickFormatter={(v: string) => {
                const d = new Date(v);
                if (range === '1M') {
                  return d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });
                }
                return d.toLocaleDateString('en-KE', { month: 'short', year: '2-digit' });
              }}
              interval={tickInterval}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(v: number) =>
                unit === 'kg' ? `${v}` : `${(v / 1000).toFixed(0)}K`
              }
            />
            <Tooltip
              labelFormatter={(label: string) => {
                const d = new Date(label);
                return d.toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
              }}
              formatter={(v: number) => [formatKES(v), `Price ${unitLabel}`]}
            />
            <ReferenceLine
              x={todayStr}
              stroke="hsl(var(--destructive))"
              strokeDasharray="4 4"
              label={{ value: 'Today', position: 'top', fontSize: 10, fill: 'hsl(var(--destructive))' }}
            />
            <Line type="monotone" dataKey="price" stroke="hsl(145, 63%, 32%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-2">
          📊 Data sourced from county markets (NCPB, Nairobi commodities exchange). Tomorrow's projection included.
        </p>
      </motion.div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold">County</th>
                <th className="text-left px-4 py-3 font-semibold">Market</th>
                <th className="text-right px-4 py-3 font-semibold">Price{unitLabel}</th>
                <th className="text-right px-4 py-3 font-semibold">7d</th>
                <th className="text-right px-4 py-3 font-semibold">30d</th>
                <th className="text-center px-4 py-3 font-semibold">Volatility</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Top Buyer County</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{row.county}</td>
                  <td className="px-4 py-3 text-muted-foreground flex items-center gap-1.5">
                    <Store className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate max-w-[140px]">{row.market}</span>
                  </td>
                  <td className="px-4 py-3 text-right">{formatKES(convertPrice(row.price))}</td>
                  <td className={`px-4 py-3 text-right font-medium ${row.change7d >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {row.change7d > 0 ? '+' : ''}{row.change7d}%
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${row.change30d >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {row.change30d > 0 ? '+' : ''}{row.change30d}%
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      row.volatility === 'Low' ? 'bg-success/10 text-success' :
                      row.volatility === 'Medium' ? 'bg-warning/10 text-warning' :
                      'bg-destructive/10 text-destructive'
                    }`}>
                      {row.volatility}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{row.highestBuyingCounty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon, positive }: {
  label: string; value: string; icon?: React.ReactNode; positive?: boolean;
}) {
  return (
    <div className="p-4 rounded-xl border bg-card shadow-card">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        {icon && <span className={positive !== undefined ? (positive ? 'text-success' : 'text-destructive') : 'text-primary'}>{icon}</span>}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}
