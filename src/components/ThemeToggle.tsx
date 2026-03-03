import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const MODES = [
  { value: 'light' as const, icon: Sun, label: 'Light mode' },
  { value: 'dark' as const, icon: Moon, label: 'Dark mode' },
  { value: 'system' as const, icon: Monitor, label: 'System default' },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const idx = MODES.findIndex(m => m.value === theme);
  const current = MODES[idx >= 0 ? idx : 0];

  const cycle = () => {
    const next = MODES[((idx >= 0 ? idx : 0) + 1) % MODES.length];
    setTheme(next.value);
  };

  return (
    <button
      onClick={cycle}
      className="p-2 rounded-lg border bg-muted/50 hover:bg-muted transition-colors"
      aria-label={current.label}
      title={current.label}
    >
      <current.icon className="h-4 w-4" />
    </button>
  );
}
