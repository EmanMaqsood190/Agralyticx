import { WeatherData } from '../types';

export const PAKISTANI_CITIES: Record<string, { lat: number; lon: number; district: string; province: string }> = {
  'Lahore': { lat: 31.5497, lon: 74.3436, district: 'Lahore', province: 'Punjab' },
  'Multan': { lat: 30.1575, lon: 71.5249, district: 'Multan', province: 'Punjab' },
  'Faisalabad': { lat: 31.4504, lon: 73.1350, district: 'Faisalabad', province: 'Punjab' },
  'Sargodha': { lat: 32.0836, lon: 72.6711, district: 'Sargodha', province: 'Punjab' },
  'Gujranwala': { lat: 32.1877, lon: 74.1945, district: 'Gujranwala', province: 'Punjab' },
  'Bahawalpur': { lat: 29.3544, lon: 71.6911, district: 'Bahawalpur', province: 'Punjab' },
  'Rahim Yar Khan': { lat: 28.4212, lon: 70.2989, district: 'Rahim Yar Khan', province: 'Punjab' },
  'Sahiwal': { lat: 30.6682, lon: 73.1114, district: 'Sahiwal', province: 'Punjab' },
  'Hyderabad': { lat: 25.3960, lon: 68.3578, district: 'Hyderabad', province: 'Sindh' },
  'Sukkur': { lat: 27.7052, lon: 68.8574, district: 'Sukkur', province: 'Sindh' },
  'Peshawar': { lat: 34.0151, lon: 71.5249, district: 'Peshawar', province: 'KPK' },
  'Quetta': { lat: 30.1798, lon: 66.9750, district: 'Quetta', province: 'Balochistan' }
};

class WeatherService {
  public async getLiveWeather(cityName: string = 'Lahore', customCoords?: { lat: number; lon: number }): Promise<WeatherData> {
    const coords = customCoords || PAKISTANI_CITIES[cityName] || PAKISTANI_CITIES['Lahore'];

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FKarachi`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Weather API request failed');

      const data = await res.json();
      const current = data.current;
      const daily = data.daily;

      const rainProb = daily.precipitation_probability_max?.[0] ?? (current.precipitation > 0 ? 80 : 10);
      const temp = Math.round(current.temperature_2m);
      const wind = Math.round(current.wind_speed_10m);
      const humidity = Math.round(current.relative_humidity_2m);

      const daysOfWeek = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
      const forecast7Days = (daily.time || []).slice(0, 7).map((_t: string, idx: number) => ({
        day: daysOfWeek[idx] || `Day ${idx + 1}`,
        maxTemp: Math.round(daily.temperature_2m_max[idx]),
        minTemp: Math.round(daily.temperature_2m_min[idx]),
        condition: this.mapWeatherCode(daily.weather_code[idx]),
        rainProb: daily.precipitation_probability_max[idx] || 0
      }));

      // Compute smart farming advisories based on live atmospheric data
      const isSpraySafe = wind < 12 && rainProb < 25;
      const sprayAdvisory = {
        en: isSpraySafe
          ? `Favorable conditions for pesticide & foliar spray (Wind ${wind} km/h, Rain chance ${rainProb}%).`
          : `Unfavorable for spraying: Wind is ${wind} km/h with ${rainProb}% rain probability.`,
        ur: isSpraySafe
          ? `سپرے کے لیے موسم سازگار ہے (ہوا ${wind} کلومیٹر، بارش کا امکان ${rainProb} فیصد)۔`
          : `سپرے کے لیے موسم نامناسب: تیز ہوا (${wind} کلومیٹر) اور بارش کا امکان (${rainProb} فیصد)۔`,
        pa: isSpraySafe
          ? `سپرے کرن لئی موسم سوہنا اے (ہوا ${wind} کلومیٹر، مینھ دا امکان ${rainProb}%)۔`
          : `سپرے نہ کرو: تیز ہوا (${wind} کلومیٹر) تے مینھ دا خطرہ (${rainProb}%) اے۔`
      };

      const sowingAdvisory = {
        en: rainProb > 50
          ? 'Heavy rain expected: Delay irrigation and canal water intake to avoid root asphyxiation.'
          : 'Normal conditions: Safe for routine irrigation, fertilization, and seed sowing.',
        ur: rainProb > 50
          ? 'بارش کی پیشگوئی: جڑوں کے گلنے سے بچاؤ کے لیے اضافی آبپاشی فی الحال روک دیں۔'
          : 'معمول کا موسم: معمول کی آبپاشی، کھاد اور بیجائی کے لیے بہترین وقت۔',
        pa: rainProb > 50
          ? 'مینھ دی پیشگوئی: پانی لان توں پرہیز کرو تاں جو بوٹے گل نہ جان۔'
          : 'موسم ٹھیک اے: نہری پانی تے بیجائی لئی چنگا ویلا اے۔'
      };

      return {
        city: cityName,
        district: PAKISTANI_CITIES[cityName]?.district || cityName,
        temperature: temp,
        feelsLike: Math.round(current.apparent_temperature),
        humidity,
        windSpeed: wind,
        rainProbability: rainProb,
        condition: this.mapWeatherCode(current.weather_code),
        icon: this.mapWeatherIcon(current.weather_code),
        isRealTime: true,
        sprayAdvisory,
        sowingAdvisory,
        forecast7Days
      };
    } catch (err) {
      console.warn('Using live fallback weather data:', err);
      // Fallback data with clear labeling
      return this.getFallbackWeather(cityName);
    }
  }

  private mapWeatherCode(code: number): string {
    if (code === 0) return 'Clear Sky / Sunny';
    if (code === 1 || code === 2 || code === 3) return 'Partly Cloudy';
    if (code === 45 || code === 48) return 'Foggy / Hazy';
    if (code >= 51 && code <= 67) return 'Rain / Drizzle';
    if (code >= 80 && code <= 82) return 'Rain Showers';
    if (code >= 95) return 'Thunderstorm';
    return 'Clear';
  }

  private mapWeatherIcon(code: number): string {
    if (code === 0) return 'Sun';
    if (code >= 1 && code <= 3) return 'CloudSun';
    if (code >= 51 && code <= 82) return 'CloudRain';
    if (code >= 95) return 'CloudLightning';
    return 'Cloud';
  }

  private getFallbackWeather(cityName: string): WeatherData {
    return {
      city: cityName,
      district: PAKISTANI_CITIES[cityName]?.district || cityName,
      temperature: 31,
      feelsLike: 33,
      humidity: 58,
      windSpeed: 8,
      rainProbability: 15,
      condition: 'Sunny / Mild Breeze (Demo Mode)',
      icon: 'Sun',
      isRealTime: false,
      sprayAdvisory: {
        en: 'Safe for spraying (Demo Advisory: Wind speed within normal limits).',
        ur: 'سپرے کے لیے محفوظ ہے (ڈیمو مشورہ: ہوا معمول کے مطابق)۔',
        pa: 'سپرے لئی موسم ٹھیک اے (ڈیمو رپورٹ)۔'
      },
      sowingAdvisory: {
        en: 'Standard sowing window active.',
        ur: 'فصل کی کاشت کا موزوں وقت ہے۔',
        pa: 'فصل بیجن لئی صحیح ویلا اے۔'
      },
      forecast7Days: [
        { day: 'Today', maxTemp: 32, minTemp: 22, condition: 'Sunny', rainProb: 10 },
        { day: 'Tomorrow', maxTemp: 33, minTemp: 23, condition: 'Clear', rainProb: 15 },
        { day: 'Day 3', maxTemp: 31, minTemp: 21, condition: 'Partly Cloudy', rainProb: 25 },
        { day: 'Day 4', maxTemp: 30, minTemp: 20, condition: 'Sunny', rainProb: 10 },
        { day: 'Day 5', maxTemp: 32, minTemp: 22, condition: 'Sunny', rainProb: 5 },
        { day: 'Day 6', maxTemp: 34, minTemp: 24, condition: 'Hot', rainProb: 10 },
        { day: 'Day 7', maxTemp: 33, minTemp: 23, condition: 'Clear', rainProb: 15 }
      ]
    };
  }
}

export const weatherService = new WeatherService();
