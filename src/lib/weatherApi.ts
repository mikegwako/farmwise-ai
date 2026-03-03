// Open-Meteo API — free, no API key required
// Provides real weather data for all 47 Kenyan counties

const COUNTY_COORDS: Record<string, { lat: number; lon: number }> = {
  'Baringo': { lat: 0.4669, lon: 35.9813 },
  'Bomet': { lat: -0.7813, lon: 35.3390 },
  'Bungoma': { lat: 0.5635, lon: 34.5607 },
  'Busia': { lat: 0.4608, lon: 34.1115 },
  'Elgeyo-Marakwet': { lat: 0.6783, lon: 35.5175 },
  'Embu': { lat: -0.5389, lon: 37.4596 },
  'Garissa': { lat: -0.4532, lon: 39.6461 },
  'Homa Bay': { lat: -0.5273, lon: 34.4571 },
  'Isiolo': { lat: 0.3546, lon: 37.5822 },
  'Kajiado': { lat: -2.0981, lon: 36.7820 },
  'Kakamega': { lat: 0.2827, lon: 34.7519 },
  'Kericho': { lat: -0.3692, lon: 35.2863 },
  'Kiambu': { lat: -1.1714, lon: 36.8356 },
  'Kilifi': { lat: -3.5107, lon: 39.9093 },
  'Kirinyaga': { lat: -0.4989, lon: 37.2803 },
  'Kisii': { lat: -0.6698, lon: 34.7675 },
  'Kisumu': { lat: -0.0917, lon: 34.7680 },
  'Kitui': { lat: -1.3668, lon: 38.0106 },
  'Kwale': { lat: -4.1816, lon: 39.4610 },
  'Laikipia': { lat: 0.3606, lon: 36.7819 },
  'Lamu': { lat: -2.2717, lon: 40.9020 },
  'Machakos': { lat: -1.5177, lon: 37.2634 },
  'Makueni': { lat: -1.8040, lon: 37.6200 },
  'Mandera': { lat: 3.9373, lon: 41.8569 },
  'Marsabit': { lat: 2.3284, lon: 37.9910 },
  'Meru': { lat: 0.0480, lon: 37.6559 },
  'Migori': { lat: -1.0634, lon: 34.4731 },
  'Mombasa': { lat: -4.0435, lon: 39.6682 },
  'Muranga': { lat: -0.7210, lon: 37.1526 },
  'Nairobi': { lat: -1.2921, lon: 36.8219 },
  'Nakuru': { lat: -0.3031, lon: 36.0800 },
  'Nandi': { lat: 0.1836, lon: 35.1269 },
  'Narok': { lat: -1.0876, lon: 35.8600 },
  'Nyamira': { lat: -0.5633, lon: 34.9349 },
  'Nyandarua': { lat: -0.1804, lon: 36.5230 },
  'Nyeri': { lat: -0.4197, lon: 36.9510 },
  'Samburu': { lat: 1.2149, lon: 36.9541 },
  'Siaya': { lat: 0.0607, lon: 34.2422 },
  'Taita-Taveta': { lat: -3.3961, lon: 38.5548 },
  'Tana River': { lat: -1.4953, lon: 39.9883 },
  'Tharaka-Nithi': { lat: -0.2965, lon: 37.7236 },
  'Trans Nzoia': { lat: 1.0567, lon: 34.9507 },
  'Turkana': { lat: 3.1122, lon: 35.5987 },
  'Uasin Gishu': { lat: 0.5143, lon: 35.2698 },
  'Vihiga': { lat: 0.0838, lon: 34.7233 },
  'Wajir': { lat: 1.7471, lon: 40.0573 },
  'West Pokot': { lat: 1.2380, lon: 35.1119 },
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
