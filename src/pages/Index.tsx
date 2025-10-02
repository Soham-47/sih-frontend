import { useState } from "react";
import ImprovedHeader, { translations } from "@/components/ImprovedHeader";
import RealTimeWeatherCard from "@/components/RealTimeWeatherCard";
import FeatureGrid from "@/components/FeatureGrid";
import PredictionCard from "@/components/PredictionCard";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Blog from "@/components/blog";

const Index = () => {
  const { t } = useTranslation();
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
            <h2 className="font-display font-bold text-2xl text-foreground mb-4">
              🌱 {t("tool.fertilizer.title")}
            </h2>
            <p className="text-muted-foreground">{t("tool.fertilizer.desc")}</p>
          </div>
        );
      case "pest-control":
        return (
          <div className="gov-card p-6">
            <h2 className="font-display font-bold text-2xl text-foreground mb-4">
              🐛 {t("tool.pest_detection.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("tool.pest_detection.desc")}
            </p>
          </div>
        );
      case "ai-assistant":
        return (
          <div className="gov-card p-6">
            <h2 className="font-display font-bold text-2xl text-foreground mb-4">
              🤖{t("tool.ai_assistant.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("tool.ai_assistant.desc")}
            </p>
          </div>
        );
      case "reports":
        return (
          <div className="gov-card p-6">
            <h2 className="font-display font-bold text-2xl text-foreground mb-4">
              📊 {t("tool.farm_reports.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("tool.farm_reports.desc")}
            </p>
          </div>
        );
      case "soil-health":
        return (
          <div className="gov-card p-6">
            <h2 className="font-display font-bold text-2xl text-foreground mb-4">
              🧪 {t("tool.soil_analysis.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("tool.soil_analysis.desc")}
            </p>
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
              {t("back_to_home")}
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
                {t("welcome.title")}
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t("welcome.description")}
              </p>
              <div className="flex justify-center space-x-4 mt-6">
                <div className="status-success">{t("tags.govt_certified")}</div>
                <div className="status-info">🤖 {t("tags.ai_powered")}</div>
                <div className="status-success">
                  🌾 {t("tags.farmer_friendly")}
                </div>
              </div>
            </div>

            {/* Feature Grid */}
            <div>
              <h2 className="font-display font-bold text-2xl text-foreground mb-6 text-center">
                {t("tools.heading")}
              </h2>
              <FeatureGrid onFeatureClick={handleFeatureClick} />
            </div>

            {/* Stats Section removed by request */}
          </div>
        )}
        {/* <div className="flex flex-col items-center mt-6 justify-center bg-gray-50">
          <Link to="/forum">
            <button className="bg-blue-800 text-yellow-100 px-6 py-3 rounded-lg hover:bg-blue-700 hover:text-yellow-50 font-medium shadow-md transition-colors">
              {t("join_community")}
            </button>
          </Link>
        </div> */}
        <div className="w-full rounded-lg bg-[#F1F5F9] py-6 px-6 flex items-center justify-center mt-8 shadow-md">
          {/* Text */}
         

          {/* Button */}
          <Link to="/forum">
            <button className="bg-[#FF9933] text-white px-10 py-4 rounded-lg font-semibold text-lg shadow-md hover:bg-[#e6892e] transition-all">
              {t("join_community")}
            </button>
          </Link>
        </div>
      </main>
      <Blog />
      {/* Footer */}
      <footer className="bg-card border-t border-card-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-muted-foreground">
            <p>{t("footer.copyright")}</p>
            <p className="text-sm mt-2">{t("footer.powered_by")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
