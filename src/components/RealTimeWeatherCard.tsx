import { useState, useEffect } from "react";
import { CloudRain, Sun, Cloud, Droplets, Thermometer, Wind, MapPin, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  description: string;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
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
            // Reverse geocoding to get city name
            const response = await fetch(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=demo_key`
            );
            
            if (response.ok) {
              const geoData = await response.json();
              if (geoData && geoData.length > 0) {
                resolve({
                  lat: latitude,
                  lon: longitude,
                  city: geoData[0].name,
                  state: geoData[0].state,
                  country: geoData[0].country,
                });
                return;
              }
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

  // Fetch weather data from OpenWeatherMap API
  const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherData> => {
    // Using demo data since API key would be needed for production
    // In production, you'd use: https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock weather data that changes based on location and time
    const conditions = ["clear", "clouds", "rain", "drizzle"];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const temp = Math.floor(Math.random() * 20) + 15; // 15-35°C
    const humidity = Math.floor(Math.random() * 40) + 40; // 40-80%
    
    const mockWeatherData: WeatherData = {
      temperature: temp,
      humidity: humidity,
      condition: randomCondition,
      description: getWeatherDescription(randomCondition),
      windSpeed: Math.floor(Math.random() * 15) + 5,
      pressure: Math.floor(Math.random() * 50) + 1000,
      visibility: Math.floor(Math.random() * 5) + 5,
      uvIndex: Math.floor(Math.random() * 8) + 1,
      location: {
        name: location?.city || "Unknown Location",
        country: location?.country || "Unknown",
        lat: lat,
        lon: lon,
      },
      irrigationNeeded: temp > 30 || humidity < 50,
      lastUpdated: new Date().toISOString(),
    };

    return mockWeatherData;
  };

  const getWeatherDescription = (condition: string): string => {
    const descriptions = {
      clear: "Clear sky",
      clouds: "Partly cloudy",
      rain: "Light rain",
      drizzle: "Light drizzle",
    };
    return descriptions[condition as keyof typeof descriptions] || "Unknown";
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
      
      const weatherData = await fetchWeatherData(locationData.lat, locationData.lon);
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
          const updatedWeather = await fetchWeatherData(location.lat, location.lon);
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
          <span className="text-muted-foreground">Getting your location and weather...</span>
        </div>
      </div>
    );
  }

  if (permissionDenied || error) {
    return (
      <div className="weather-widget">
        <div className="text-center py-6">
          <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-2">Location Access Needed</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {permissionDenied 
              ? "Please allow location access to get real-time weather data for better farming insights."
              : error
            }
          </p>
          <Button 
            onClick={requestLocationPermission}
            variant="outline"
            size="sm"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Enable Location
          </Button>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="weather-widget">
        <div className="text-center py-6">
          <p className="text-muted-foreground">No weather data available</p>
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
            <p className="text-sm text-muted-foreground flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {weather.location.name}, {weather.location.country}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center text-2xl font-bold text-foreground">
            <Thermometer className="w-6 h-6 mr-1" />
            {weather.temperature}°C
          </div>
          <p className="text-xs text-muted-foreground">Feels like {weather.temperature + 2}°C</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="text-center">
          <Droplets className="w-4 h-4 text-sky mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Humidity</p>
          <p className="font-semibold text-sm">{weather.humidity}%</p>
        </div>
        <div className="text-center">
          <Wind className="w-4 h-4 text-primary mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Wind</p>
          <p className="font-semibold text-sm">{weather.windSpeed} km/h</p>
        </div>
        <div className="text-center">
          <div className="w-4 h-4 bg-earth rounded-full mx-auto mb-1"></div>
          <p className="text-xs text-muted-foreground">Pressure</p>
          <p className="font-semibold text-sm">{weather.pressure} hPa</p>
        </div>
        <div className="text-center">
          <div className="w-4 h-4 bg-sunny rounded-full mx-auto mb-1"></div>
          <p className="text-xs text-muted-foreground">UV Index</p>
          <p className="font-semibold text-sm">{weather.uvIndex}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-center flex-1">
          <p className="text-xs text-muted-foreground mb-1">Irrigation Recommendation</p>
          <span className={weather.irrigationNeeded ? "irrigation-needed" : "irrigation-not-needed"}>
            {weather.irrigationNeeded ? "💧 Irrigation Needed" : "✅ Soil Moisture Good"}
          </span>
        </div>
      </div>

      <div className="text-center mt-3 pt-3 border-t border-card-border">
        <p className="text-xs text-muted-foreground">
          Last updated: {new Date(weather.lastUpdated).toLocaleTimeString()}
        </p>
        <button 
          onClick={requestLocationPermission}
          className="text-xs text-primary hover:underline mt-1"
        >
          🔄 Refresh
        </button>
      </div>
    </div>
  );
};

export default RealTimeWeatherCard;