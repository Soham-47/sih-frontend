import { useState } from "react";
import ImprovedHeader, { translations } from "@/components/ImprovedHeader";
import RealTimeWeatherCard from "@/components/RealTimeWeatherCard";
import FeatureGrid from "@/components/FeatureGrid";
import PredictionCard from "@/components/PredictionCard";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  console.log("Index component is rendering");
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const handleFeatureClick = (featureId: string) => {
    setActiveFeature(featureId);
  };

  const handleBackToHome = () => {
    setActiveFeature(null);
  };

  const renderActiveFeature = () => {
    switch (activeFeature) {
      case "predict-yield":
        return <PredictionCard />;
      case "fertilizer":
        return (
          <div className="gov-card p-6">
            <h2 className="font-display font-bold text-2xl text-foreground mb-4">🌱 Fertilizer Recommendations</h2>
            <p className="text-muted-foreground">Smart fertilizer suggestions based on your soil and weather conditions coming soon...</p>
          </div>
        );
      case "pest-control":
        return (
          <div className="gov-card p-6">
            <h2 className="font-display font-bold text-2xl text-foreground mb-4">🐛 Pest Detection & Control</h2>
            <p className="text-muted-foreground">AI-powered pest identification and treatment recommendations coming soon...</p>
          </div>
        );
      case "ai-assistant":
        return (
          <div className="gov-card p-6">
            <h2 className="font-display font-bold text-2xl text-foreground mb-4">🤖 AI Farming Assistant</h2>
            <p className="text-muted-foreground">Chat with our AI assistant for instant farming advice coming soon...</p>
          </div>
        );
      case "reports":
        return (
          <div className="gov-card p-6">
            <h2 className="font-display font-bold text-2xl text-foreground mb-4">📊 Farm Analytics & Reports</h2>
            <p className="text-muted-foreground">Detailed analytics and progress tracking coming soon...</p>
          </div>
        );
      case "soil-health":
        return (
          <div className="gov-card p-6">
            <h2 className="font-display font-bold text-2xl text-foreground mb-4">🧪 Soil Health Analysis</h2>
            <p className="text-muted-foreground">Comprehensive soil testing and health monitoring coming soon...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ImprovedHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {activeFeature ? (
          <div className="space-y-6">
            <Button 
              onClick={handleBackToHome}
              variant="outline"
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            {renderActiveFeature()}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Weather Card - Home only */}
            <div className="mb-8">
              <RealTimeWeatherCard />
            </div>
            {/* Welcome Section */}
            <div className="text-center py-8">
              <h1 className="font-display font-bold text-4xl text-foreground mb-4">
                Welcome to KisanAI Platform
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Empowering farmers with AI-driven insights for better crop yields, 
                smart irrigation, and sustainable farming practices.
              </p>
              <div className="flex justify-center space-x-4 mt-6">
                <div className="status-success">🇮🇳 Government Certified</div>
                <div className="status-info">🤖 AI Powered</div>
                <div className="status-success">🌾 Farmer Friendly</div>
              </div>
            </div>

            {/* Feature Grid */}
            <div>
              <h2 className="font-display font-bold text-2xl text-foreground mb-6 text-center">
                Smart Farming Tools
              </h2>
              <FeatureGrid onFeatureClick={handleFeatureClick} />
            </div>

            {/* Stats Section removed by request */}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-card-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-muted-foreground">
            <p>© 2024 KisanAI Platform - Ministry of Agriculture & Farmers Welfare</p>
            <p className="text-sm mt-2">Powered by Artificial Intelligence for Indian Agriculture</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
