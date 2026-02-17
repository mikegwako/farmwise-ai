import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllListings, addListing, deleteListing, computeMatchScore, type MarketListing } from '@/lib/marketplaceStore';
import { CROPS, COUNTIES, type CropType, type County } from '@/lib/farmData';
import { User, Building2, MapPin, Calendar, MessageCircle, Star, Plus, X, Trash2, Phone } from 'lucide-react';

export default function Marketplace() {
  const [filter, setFilter] = useState<'all' | 'farmer' | 'buyer'>('all');
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const listings = useMemo(() => getAllListings(), [refresh]);
  const filtered = filter === 'all' ? listings : listings.filter((l) => l.type === filter);

  // Enrich with match scores
  const enriched = filtered.map((l) => ({
    ...l,
    matchScore: computeMatchScore(l, listings),
  }));

  const handleAdd = (listing: Omit<MarketListing, 'id' | 'createdAt'>) => {
    addListing(listing);
    setRefresh((r) => r + 1);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    deleteListing(id);
    setRefresh((r) => r + 1);
  };

  return (
    <div className="container py-8 md:py-12">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Marketplace</h1>
          <p className="text-muted-foreground">Connect farmers with buyers. Smart matching by location and price.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          New Listing
        </button>
      </div>

      {/* New Listing Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-card rounded-xl border shadow-elevated p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg">Create Listing</h2>
                <button onClick={() => setShowForm(false)} className="p-1 rounded hover:bg-muted"><X className="h-5 w-5" /></button>
              </div>
              <NewListingForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-8">
        {(['all', 'farmer', 'buyer'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {f === 'all' ? `All (${listings.length})` : f === 'farmer' ? `🌾 Farmers (${listings.filter(l=>l.type==='farmer').length})` : `🏢 Buyers (${listings.filter(l=>l.type==='buyer').length})`}
          </button>
        ))}
      </div>

      {/* Listings grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {enriched.map((listing, i) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <ListingCard listing={listing} onDelete={handleDelete} />
          </motion.div>
        ))}
      </div>

      {enriched.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="font-medium">No listings found</p>
          <p className="text-sm">Create a new listing to get started</p>
        </div>
      )}
    </div>
  );
}

function NewListingForm({ onSubmit, onCancel }: {
  onSubmit: (l: Omit<MarketListing, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    type: 'farmer' as 'farmer' | 'buyer',
    name: '',
    phone: '',
    crop: 'Maize' as CropType,
    county: 'Nakuru' as County,
    quantity: 10,
    price: 35000,
    date: '2026-03-15',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        {(['farmer', 'buyer'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setForm({ ...form, type: t })}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              form.type === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            {t === 'farmer' ? '🌾 Farmer' : '🏢 Buyer'}
          </button>
        ))}
      </div>
      <input placeholder="Your Name / Company" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30" />
      <input placeholder="Phone (e.g. 0712345678)" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30" />
      <select value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value as CropType })}
        className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30">
        {CROPS.map((c) => <option key={c}>{c}</option>)}
      </select>
      <select value={form.county} onChange={(e) => setForm({ ...form, county: e.target.value as County })}
        className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30">
        {COUNTIES.map((c) => <option key={c}>{c}</option>)}
      </select>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1">Quantity (tons)</label>
          <input type="number" min={1} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: +e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">{form.type === 'farmer' ? 'Min Price' : 'Offer Price'} (KES/ton)</label>
          <input type="number" min={1000} step={1000} value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
      </div>
      <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
        className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30" />
      <textarea placeholder="Description..." rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 rounded-lg bg-muted text-muted-foreground text-sm font-medium">Cancel</button>
        <button type="submit" className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Create Listing</button>
      </div>
    </form>
  );
}

function ListingCard({ listing, onDelete }: { listing: MarketListing & { matchScore: number }; onDelete: (id: string) => void }) {
  const isFarmer = listing.type === 'farmer';
  const [showContact, setShowContact] = useState(false);
  const formatKES = (n: number) => `KES ${n.toLocaleString()}`;

  return (
    <div className="p-5 rounded-xl border bg-card shadow-card hover:shadow-elevated transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isFarmer ? 'bg-primary/10 text-primary' : 'bg-info/10 text-info'}`}>
            {isFarmer ? <User className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
          </div>
          <div>
            <h3 className="font-semibold text-sm">{listing.name}</h3>
            <span className={`text-xs font-medium ${isFarmer ? 'text-primary' : 'text-info'}`}>
              {isFarmer ? 'Farmer' : 'Buyer'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {listing.matchScore > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/20 text-xs font-semibold">
              <Star className="h-3 w-3 text-secondary" />
              {listing.matchScore}%
            </div>
          )}
          <button onClick={() => onDelete(listing.id)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Crop</span>
          <span className="font-medium">{listing.crop}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Quantity</span>
          <span className="font-medium">{listing.quantity} tons</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{isFarmer ? 'Min Price' : 'Offer Price'}</span>
          <span className="font-medium">{formatKES(listing.price)}/ton</span>
        </div>
      </div>

      {listing.description && (
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{listing.description}</p>
      )}

      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{listing.county}</span>
        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{listing.date}</span>
      </div>

      {showContact ? (
        <div className="p-3 rounded-lg bg-muted/50 text-sm space-y-1">
          <div className="flex items-center gap-2 font-medium">
            <Phone className="h-4 w-4 text-primary" />
            {listing.phone}
          </div>
          <p className="text-xs text-muted-foreground">Call or WhatsApp this number to connect</p>
        </div>
      ) : (
        <button
          onClick={() => setShowContact(true)}
          className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          Contact {isFarmer ? 'Farmer' : 'Buyer'}
        </button>
      )}
    </div>
  );
}
