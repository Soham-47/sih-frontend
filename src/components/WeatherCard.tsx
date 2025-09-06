import { useState, useEffect } from "react";
import { CloudRain, Sun, Cloud, Droplets, Thermometer, Wind } from "lucide-react";

interface WeatherData {
  temperature: number;
  humidity: number;
  condition: "sunny" | "rainy" | "cloudy";
  windSpeed: number;
  location: string;
  irrigationNeeded: boolean;
}

const WeatherCard = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 28,
    humidity: 65,
    condition: "sunny",
    windSpeed: 12,
    location: "Your Location",
    irrigationNeeded: false,
  });

  const [location, setLocation] = useState<string>("Detecting location...");

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // In a real app, you'd call a reverse geocoding API here
          setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
          // Mock weather data based on location
          fetchWeatherData(latitude, longitude);
        },
        () => {
          setLocation("Location access denied");
        }
      );
    }
  }, []);

  const fetchWeatherData = async (lat: number, lon: number) => {
    // Mock weather API call - replace with real API
    try {
      // Simulate API response
      const mockWeatherData: WeatherData = {
        temperature: Math.floor(Math.random() * 15) + 20,
        humidity: Math.floor(Math.random() * 40) + 40,
        condition: ["sunny", "rainy", "cloudy"][Math.floor(Math.random() * 3)] as "sunny" | "rainy" | "cloudy",
        windSpeed: Math.floor(Math.random() * 20) + 5,
        location: `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`,
        irrigationNeeded: Math.random() > 0.5,
      };
      setWeather(mockWeatherData);
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
    }
  };

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case "sunny":
        return <Sun className="w-8 h-8 text-sunny" />;
      case "rainy":
        return <CloudRain className="w-8 h-8 text-rain" />;
      case "cloudy":
        return <Cloud className="w-8 h-8 text-sky" />;
      default:
        return <Sun className="w-8 h-8 text-sunny" />;
    }
  };

  const getConditionText = () => {
    switch (weather.condition) {
      case "sunny":
        return "☀️ Sunny";
      case "rainy":
        return "🌧️ Rainy";
      case "cloudy":
        return "🌥️ Cloudy";
      default:
        return "☀️ Sunny";
    }
  };

  return (
    <div className="weather-widget">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getWeatherIcon()}
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground">
              {getConditionText()}
            </h3>
            <p className="text-sm text-muted-foreground">📍 {location}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center text-2xl font-bold text-foreground">
            <Thermometer className="w-6 h-6 mr-1" />
            {weather.temperature}°C
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Droplets className="w-5 h-5 text-sky" />
          <div>
            <p className="text-xs text-muted-foreground">Humidity</p>
            <p className="font-semibold">{weather.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Wind className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Wind</p>
            <p className="font-semibold">{weather.windSpeed} km/h</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Irrigation Status</p>
          <span className={weather.irrigationNeeded ? "irrigation-needed" : "irrigation-not-needed"}>
            {weather.irrigationNeeded ? "💧 Needed" : "✅ Good"}
          </span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default WeatherCard;