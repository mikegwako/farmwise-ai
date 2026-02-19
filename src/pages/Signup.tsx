import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/authStore';
import { COUNTIES } from '@/lib/farmData';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'farmer' as 'farmer' | 'buyer', county: COUNTIES[0] as string });
  const [error, setError] = useState('');

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    const result = signup({ name: form.name, email: form.email, phone: form.phone, password: form.password, role: form.role, county: form.county });
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary font-display text-2xl font-bold">
            <Sprout className="h-8 w-8" />
            FarmWise AI
          </Link>
          <p className="text-muted-foreground mt-2">Create your account to get started.</p>
        </div>

        <div className="p-6 rounded-xl border bg-card shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
            )}
            <div>
              <label className="text-sm font-medium mb-1 block">Full Name</label>
              <Input value={form.name} onChange={e => update('name', e.target.value)} placeholder="John Kamau" required />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <Input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" required />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Phone</label>
              <Input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="0712345678" required />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">I am a</label>
              <select
                value={form.role}
                onChange={e => update('role', e.target.value)}
                className="w-full px-3 py-2 rounded-md border bg-background text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
              >
                <option value="farmer">Farmer</option>
                <option value="buyer">Buyer</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">County</label>
              <select
                value={form.county}
                onChange={e => update('county', e.target.value)}
                className="w-full px-3 py-2 rounded-md border bg-background text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
              >
                {COUNTIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Password</label>
              <Input type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder="••••••••" required />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Confirm Password</label>
              <Input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full gap-2">
              <UserPlus className="h-4 w-4" />
              Create Account
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
