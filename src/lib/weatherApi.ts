// Open-Meteo API — free, no API key required
// Provides real weather data for Kenyan counties

const COUNTY_COORDS: Record<string, { lat: number; lon: number }> = {
  'Nakuru': { lat: -0.3031, lon: 36.0800 },
  'Uasin Gishu': { lat: 0.5143, lon: 35.2698 },
  'Trans Nzoia': { lat: 1.0567, lon: 34.9507 },
  'Nyandarua': { lat: -0.1804, lon: 36.5230 },
  'Kiambu': { lat: -1.1714, lon: 36.8356 },
  'Meru': { lat: 0.0480, lon: 37.6559 },
  'Nyeri': { lat: -0.4197, lon: 36.9510 },
  'Kirinyaga': { lat: -0.4989, lon: 37.2803 },
  'Machakos': { lat: -1.5177, lon: 37.2634 },
  'Bungoma': { lat: 0.5635, lon: 34.5607 },
  'Kakamega': { lat: 0.2827, lon: 34.7519 },
  'Kisii': { lat: -0.6698, lon: 34.7675 },
  'Narok': { lat: -1.0876, lon: 35.8600 },
  'Laikipia': { lat: 0.3606, lon: 36.7819 },
  'Embu': { lat: -0.5389, lon: 37.4596 },
};

export interface WeatherData {
  county: string;
  currentTemp: number;
  maxTemp: number;
  minTemp: number;
  rainfall7d: number;
  rainfall30d: number;
  humidity: number;
  weatherCode: number;
  dailyRainfall: { date: string; rain: number }[];
}

export function getCountyCoords(county: string) {
  return COUNTY_COORDS[county] || COUNTY_COORDS['Nakuru'];
}

export async function fetchWeatherData(county: string): Promise<WeatherData> {
  const coords = getCountyCoords(county);

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&past_days=30&forecast_days=7&timezone=Africa%2FNairobi`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Weather API error');
  const data = await res.json();

  const dailyRainfall = (data.daily?.time || []).map((date: string, i: number) => ({
    date,
    rain: data.daily.precipitation_sum?.[i] ?? 0,
  }));

  const allRain = data.daily?.precipitation_sum || [];
  const rainfall30d = allRain.slice(0, 30).reduce((s: number, v: number) => s + v, 0);
  const rainfall7d = allRain.slice(-7).reduce((s: number, v: number) => s + v, 0);

  return {
    county,
    currentTemp: data.current?.temperature_2m ?? 0,
    maxTemp: data.daily?.temperature_2m_max?.[data.daily.temperature_2m_max.length - 1] ?? 0,
    minTemp: data.daily?.temperature_2m_min?.[data.daily.temperature_2m_min.length - 1] ?? 0,
    rainfall7d: Math.round(rainfall7d * 10) / 10,
    rainfall30d: Math.round(rainfall30d * 10) / 10,
    humidity: data.current?.relative_humidity_2m ?? 0,
    weatherCode: data.current?.weather_code ?? 0,
    dailyRainfall,
  };
}

export function getWeatherDescription(code: number): string {
  if (code === 0) return 'Clear sky';
  if (code <= 3) return 'Partly cloudy';
  if (code <= 48) return 'Foggy';
  if (code <= 57) return 'Drizzle';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Rain showers';
  if (code <= 86) return 'Snow showers';
  return 'Thunderstorm';
}

export function getWeatherEmoji(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦️';
  return '⛈️';
}
