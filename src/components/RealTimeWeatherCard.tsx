import { useState, useEffect } from "react";
import { CloudRain, Sun, Cloud, Droplets, Thermometer, Wind, MapPin, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface WeatherData {
  temperature: number | null;
  humidity: number | null;
  condition: string; // derived from WMO code
  description: string; // friendly text
  windSpeed: number | null; // km/h
  pressure: number | null; // hPa
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  irrigationNeeded: boolean;
  lastUpdated: string;
}

interface LocationData {
  lat: number;
  lon: number;
  city?: string;
  state?: string;
  country?: string;
}

const RealTimeWeatherCard = () => {
  const { t } = useTranslation();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Get user's current location
  const getCurrentLocation = (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Reverse geocoding to get locality using Nominatim (no key required)
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
            );
            if (response.ok) {
              const data = await response.json();
              const addr = data.address || {};
              const locality = addr.city || addr.town || addr.village || addr.hamlet || addr.suburb || "Your Location";
              const state = addr.state;
              const country = (addr.country_code ? String(addr.country_code).toUpperCase() : addr.country) || "";
              resolve({
                lat: latitude,
                lon: longitude,
                city: locality,
                state,
                country,
              });
              return;
            }
            
            // Fallback if reverse geocoding fails
            resolve({
              lat: latitude,
              lon: longitude,
              city: "Your Location",
              country: "Unknown",
            });
          } catch (error) {
            resolve({
              lat: latitude,
              lon: longitude,
              city: "Your Location",
              country: "Unknown",
            });
          }
        },
        (error) => {
          setPermissionDenied(true);
          reject(new Error("Location access denied"));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  };

  // Map WMO weather codes to a simple condition/description
  const describeWeather = (code: number | null, isDay: boolean | null) => {
    const day = isDay ?? true;
    const map: Record<number, { condition: string; description: string }> = {
      0: {
        condition: day ? "clear" : "clear",
        description: day
          ? t("weather_des.clear_sky")
          : t("weather_des.clear_night"),
      },
      1: { condition: "clear", description: t("weather_des.mainly_clear") },
      2: { condition: "clouds", description: t("weather_des.partly_cloudy") },
      3: { condition: "clouds", description: t("weather_des.overcast") },
      45: { condition: "clouds", description: t("weather_des.fog") },
      48: { condition: "clouds", description: t("weather_des.fog") },
      51: { condition: "drizzle", description: t("weather_des.light_drizzle") },
      53: {
        condition: "drizzle",
        description: t("weather_des.modarate_drizzle"),
      },
      55: { condition: "drizzle", description: t("weather_des.dense_drizzle") },
      61: { condition: "rain", description: t("weather_des.slight_rain") },
      63: { condition: "rain", description: t("weather_des.modarate_rain") },
      65: { condition: "rain", description: t("weather_des.heavy_rain") },
      80: { condition: "rain", description: t("weather_des.rain_showers") },
      81: {
        condition: "rain",
        description: t("weather_des.heavy_rain_showers"),
      },
      82: {
        condition: "rain",
        description: t("weather_des.violent_rain_showers"),
      },

      71: { condition: "snow", description: t("weather_des.slight_snow") },
      73: { condition: "snow", description: t("weather_des.moderate_snow") },
      75: { condition: "snow", description: t("weather_des.heavy_snow") },
      95: { condition: "storm", description: t("weather_des.thunderstorm") },
      96: {
        condition: "storm",
        description: t("weather_des.thunderstorm_hail"),
      },
      99: { condition: "storm", description: t("weather_des.thunderstorm_heavy_hail") },
    };
    return (
      map[code ?? -1] || {
        condition: "clear",
        description: t("weather_des.unknown"),
      }
    );
  };

  // Fetch weather data from Open-Meteo
  const fetchWeatherData = async (lat: number, lon: number, loc?: LocationData): Promise<WeatherData> => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,pressure_msl,is_day`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);
    const data = await res.json();
    const current = data.current || {};
    const code: number | null = typeof current.weather_code === 'number' ? current.weather_code : null;
    const isDay: boolean | null = typeof current.is_day === 'number' ? (current.is_day === 1) : (typeof current.is_day === 'boolean' ? current.is_day : null);
    const desc = describeWeather(code, isDay);
    const temp = typeof current.temperature_2m === 'number' ? current.temperature_2m : null;
    const humidity = typeof current.relative_humidity_2m === 'number' ? current.relative_humidity_2m : null;
    const wind = typeof current.wind_speed_10m === 'number' ? current.wind_speed_10m : null;
    const pressure = typeof current.pressure_msl === 'number' ? current.pressure_msl : null;

    // Simple irrigation heuristic: hot or dry -> needed
    const irrigationNeeded = (temp != null && temp > 30) || (humidity != null && humidity < 50);

    return {
      temperature: temp,
      humidity,
      condition: desc.condition,
      description: desc.description,
      windSpeed: wind,
      pressure,
      location: {
        name: loc?.city || location?.city || "Your Location",
        country: loc?.country || location?.country || "",
        lat,
        lon,
      },
      irrigationNeeded,
      lastUpdated: new Date().toISOString(),
    };
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return <Sun className="w-8 h-8 text-sunny" />;
      case "rain":
      case "drizzle":
        return <CloudRain className="w-8 h-8 text-rain" />;
      case "clouds":
        return <Cloud className="w-8 h-8 text-sky" />;
      case "snow":
        return <Cloud className="w-8 h-8 text-snow" />;
      case "storm":
        return <CloudRain className="w-8 h-8 text-storm" />;
      default:
        return <Sun className="w-8 h-8 text-sunny" />;
    }
  };

  const getConditionEmoji = (condition: string): string => {
    switch (condition.toLowerCase()) {
      case "clear":
        return "☀️";
      case "rain":
        return "🌧️";
      case "drizzle":
        return "🌦️";
      case "clouds":
        return "🌥️";
      case "snow":
        return "🌨️";
      case "storm":
        return "⛈️";
      default:
        return "☀️";
    }
  };

  const requestLocationPermission = async () => {
    setLoading(true);
    setError(null);
    setPermissionDenied(false);
    
    try {
      const locationData = await getCurrentLocation();
      setLocation(locationData);
      
      const weatherData = await fetchWeatherData(locationData.lat, locationData.lon, locationData);
      setWeather(weatherData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get location");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Auto-refresh weather data every 10 minutes
  useEffect(() => {
    if (location && weather) {
      const interval = setInterval(async () => {
        try {
          const updatedWeather = await fetchWeatherData(location.lat, location.lon, location);
          setWeather(updatedWeather);
        } catch (err) {
          console.error("Failed to refresh weather data:", err);
        }
      }, 600000); // 10 minutes

      return () => clearInterval(interval);
    }
  }, [location, weather]);

  if (loading) {
    return (
      <div className="weather-widget">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mr-3"></div>
          <span className="text-muted-foreground">{t("Getting your location and weather...")}</span>
        </div>
      </div>
    );
  }

  if (permissionDenied || error) {
    return (
      <div className="weather-widget">
        <div className="text-center py-6">
          <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-2">{t("Location Access Needed")}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {permissionDenied 
              ? t("Please allow location access to get real-time weather data for better farming insights.")
              : error
            }
          </p>
          <Button 
            onClick={requestLocationPermission}
            variant="outline"
            size="sm"
          >
            <MapPin className="w-4 h-4 mr-2" />
            {t("Enable Location")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-widget">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getWeatherIcon(weather.condition)}
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground">
              {getConditionEmoji(weather.condition)} {weather.description}
            </h3>
            {/* getting some error  here */}

            {/* <p className="text-sm text-muted-foreground flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {weather.location.name}
              {weather.location.country ? `, ${weather.location.country}` : ""}
            </p> */}
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center text-2xl font-bold text-foreground">
            <Thermometer className="w-6 h-6 mr-1" />
            {weather.temperature != null
              ? Math.round(weather.temperature)
              : "–"}
            °C
          </div>
          {weather.temperature != null && (
            <p className="text-xs text-muted-foreground">{t("Approximate")}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <Droplets className="w-4 h-4 text-sky mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">
            {t("weather.humidity")}
          </p>
          <p className="font-semibold text-sm">
            {weather.humidity != null
              ? Math.round(weather.humidity) + "%"
              : "–"}
          </p>
        </div>
        <div className="text-center">
          <Wind className="w-4 h-4 text-primary mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">{t("weather.wind")}</p>
          <p className="font-semibold text-sm">
            {weather.windSpeed != null
              ? Math.round(weather.windSpeed) + " km/h"
              : "–"}
          </p>
        </div>
        {weather.pressure != null && (
          <div className="text-center">
            <div className="w-4 h-4 bg-earth rounded-full mx-auto mb-1"></div>
            <p className="text-xs text-muted-foreground">
              {t("weather.pressure")}
            </p>
            <p className="font-semibold text-sm">
              {Math.round(weather.pressure)} hPa
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-center flex-1  mb-2">
          <span
            className={
              weather.irrigationNeeded
                ? "irrigation-needed"
                : "irrigation-not-needed"
            }
          >
            {weather.irrigationNeeded
              ? t("weather.irrigation_needed")
              : t("Irrigation Not Needed")}
          </span>
        </div>
      </div>

      <div className="text-center mt-3 pt-3 border-t border-card-border">
        <p className="text-xs text-muted-foreground">
          {t("weather.last_update")}:{" "}
          {new Date(weather.lastUpdated).toLocaleTimeString()}
        </p>
        <button
          onClick={requestLocationPermission}
          className="text-xs text-primary hover:underline mt-1"
        >
          🔄 {t("weather.refresh")}
        </button>
      </div>
    </div>
  );
};

export default RealTimeWeatherCard;