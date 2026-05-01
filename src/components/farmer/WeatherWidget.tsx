
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, CloudRain, Sun, Thermometer, Wind, Droplets, MapPin, Loader2, CloudLightning } from "lucide-react";

interface ForecastItem {
  day: string;
  temp: number;
  icon: React.ElementType;
}

interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
  forecast: ForecastItem[];
}

interface WeatherWidgetProps {
  location?: string;
}

interface OpenWeatherListItem {
  dt: number;
  main: {
    temp: number;
  };
  weather: Array<{
    main: string;
  }>;
}

const API_KEY = ""; // User should provide an OpenWeatherMap API key

export const WeatherWidget = ({ location: propLocation = "Nakuru, Kenya" }: WeatherWidgetProps) => {
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        
        // If no API key, use simulated data but honor the location prop
        if (!API_KEY) {
          await new Promise(resolve => setTimeout(resolve, 1500));
          setWeather({
            temp: 24,
            condition: "Partly Cloudy",
            humidity: 65,
            windSpeed: 12,
            location: propLocation,
            forecast: [
              { day: "Tomorrow", temp: 26, icon: Sun },
              { day: "Wed", temp: 23, icon: CloudRain },
              { day: "Thu", temp: 25, icon: Cloud },
            ],
          });
          setLoading(false);
          return;
        }

        // Real API Call
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(propLocation)}&units=metric&appid=${API_KEY}`
        );
        const data = await response.json();

        if (response.ok) {
          // Get forecast too
          const forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(propLocation)}&units=metric&cnt=24&appid=${API_KEY}`
          );
          const forecastData = await forecastRes.json();

          const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          const processedForecast = (forecastData.list as OpenWeatherListItem[])
            .filter((_, i) => i % 8 === 0)
            .slice(1, 4)
            .map((item) => {
              const date = new Date(item.dt * 1000);
              return {
                day: days[date.getDay()],
                temp: Math.round(item.main.temp),
                icon: item.weather[0].main.includes("Rain") ? CloudRain : 
                      item.weather[0].main.includes("Cloud") ? Cloud : Sun
              };
            });

          setWeather({
            temp: Math.round(data.main.temp),
            condition: data.weather[0].main,
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
            location: data.name + ", " + data.sys.country,
            forecast: processedForecast,
          });
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("Weather fetch error:", error);
        // Fallback to simulation on error
        setWeather({
          temp: 24,
          condition: "Partly Cloudy",
          humidity: 65,
          windSpeed: 12,
          location: propLocation,
          forecast: [
            { day: "Tomorrow", temp: 26, icon: Sun },
            { day: "Wed", temp: 23, icon: CloudRain },
            { day: "Thu", temp: 25, icon: Cloud },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [propLocation]);

  if (loading) {
    return (
      <Card className="shadow-soft border-border/50 h-full flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Fetching Forecast...</p>
        </div>
      </Card>
    );
  }

  const getWeatherIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes("rain")) return CloudRain;
    if (c.includes("cloud")) return Cloud;
    if (c.includes("storm") || c.includes("lightning")) return CloudLightning;
    return Sun;
  };

  const WeatherIcon = getWeatherIcon(weather?.condition || "");

  return (
    <Card className="shadow-soft border-border/50 overflow-hidden bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20">
      <CardHeader className="pb-3 border-b border-border/10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Cloud className="w-5 h-5 text-primary" />
              Weather Forecast
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {weather?.location}
            </p>
          </div>
          <Badge variant="secondary" className="bg-white/50 dark:bg-black/20 font-bold">
            Today
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Current Weather */}
          <div className="flex items-center gap-6">
            <div className="p-4 rounded-3xl bg-white dark:bg-zinc-900 shadow-soft shrink-0">
              <WeatherIcon className="w-12 h-12 text-primary" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black tracking-tighter text-foreground">{weather?.temp}°</span>
                <span className="text-xl font-bold text-muted-foreground">C</span>
              </div>
              <p className="text-sm font-bold text-primary uppercase tracking-wider">{weather?.condition}</p>
              
              <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-xs font-bold">{weather?.humidity}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-teal-500" />
                  <span className="text-xs font-bold">{weather?.windSpeed} km/h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Forecast */}
          <div className="bg-muted/30 rounded-2xl p-4 border border-border/50">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1">3-Day Outlook</p>
            <div className="grid grid-cols-3 gap-2">
              {weather?.forecast.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-background/50 border border-border/40">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">{day.day}</span>
                  <day.icon className="w-5 h-5 text-primary/70" />
                  <span className="text-sm font-black">{day.temp}°</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
