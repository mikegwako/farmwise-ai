import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getMarketData, getPriceTrend, CROPS, COUNTIES, type CropType, type County } from '@/lib/farmData';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Activity, MapPin } from 'lucide-react';

export default function MarketDashboard() {
  const [selectedCrop, setSelectedCrop] = useState<CropType>('Maize');
  const [selectedCounty, setSelectedCounty] = useState<County | 'All'>('All');

  const allData = useMemo(() => getMarketData(), []);
  const trendData = useMemo(() => getPriceTrend(selectedCrop), [selectedCrop]);

  const filtered = allData.filter(
    (d) => d.crop === selectedCrop && (selectedCounty === 'All' || d.county === selectedCounty)
  );

  const avgPrice = filtered.length
    ? Math.round(filtered.reduce((s, d) => s + d.price, 0) / filtered.length)
    : 0;
  const avg7d = filtered.length
    ? parseFloat((filtered.reduce((s, d) => s + d.change7d, 0) / filtered.length).toFixed(1))
    : 0;

  const formatKES = (n: number) => `KES ${n.toLocaleString()}`;

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Market Intelligence</h1>
        <p className="text-muted-foreground">Live market prices and trends across Kenyan counties.</p>
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
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <SummaryCard label="Average Price / Ton" value={formatKES(avgPrice)} icon={<Activity className="h-5 w-5" />} />
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
        <h3 className="font-display font-bold mb-4">30-Day Price Trend — {selectedCrop}</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={trendData}>
            <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={4} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
            <Tooltip formatter={(v: number) => formatKES(v)} />
            <Line type="monotone" dataKey="price" stroke="hsl(145, 63%, 32%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold">County</th>
                <th className="text-right px-4 py-3 font-semibold">Price/Ton</th>
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
                  <td className="px-4 py-3 text-right">{formatKES(row.price)}</td>
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
