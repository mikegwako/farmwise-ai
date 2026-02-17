import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getMarketplaceListings, type Listing } from '@/lib/farmData';
import { User, Building2, MapPin, Calendar, MessageCircle, Star } from 'lucide-react';

export default function Marketplace() {
  const [filter, setFilter] = useState<'all' | 'farmer' | 'buyer'>('all');
  const listings = useMemo(() => getMarketplaceListings(), []);

  const filtered = filter === 'all' ? listings : listings.filter((l) => l.type === filter);

  const formatKES = (n: number) => `KES ${n.toLocaleString()}`;

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Marketplace</h1>
        <p className="text-muted-foreground">Connect farmers with buyers. Smart matching by location and price.</p>
      </div>

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
            {f === 'all' ? 'All Listings' : f === 'farmer' ? '🌾 Farmers' : '🏢 Buyers'}
          </button>
        ))}
      </div>

      {/* Listings grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((listing, i) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <ListingCard listing={listing} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ListingCard({ listing }: { listing: Listing }) {
  const isFarmer = listing.type === 'farmer';
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
        {listing.matchScore && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/20 text-xs font-semibold">
            <Star className="h-3 w-3 text-secondary" />
            {listing.matchScore}%
          </div>
        )}
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

      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{listing.description}</p>

      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{listing.county}</span>
        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{listing.date}</span>
      </div>

      <button className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
        <MessageCircle className="h-4 w-4" />
        Contact {isFarmer ? 'Farmer' : 'Buyer'}
      </button>
    </div>
  );
}
