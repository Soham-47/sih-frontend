// import { 
//   Wheat, 
//   Sprout, 
//   Bug, 
//   MessageCircle, 
//   BarChart3, 
//   MapPin,
//   Calculator,
//   Camera
// } from "lucide-react";
// import { useTranslation } from "react-i18next";


// const features = [
//   {
//     id: "predict-yield",
//     title: `🌾 ${t("tools.predict_yield.title")}`,
//     description: "AI-powered crop yield predictions",
//     icon: Wheat,
//     gradient: "from-primary to-primary-light",
//   },
//   {
//     id: "fertilizer",
//     title: "🌱 Fertilizer Guide",
//     description: "Smart fertilization recommendations",
//     icon: Sprout,
//     gradient: "from-earth to-earth-light",
//   },
//   {
//     id: "pest-control",
//     title: "🐛 Pest Detection",
//     description: "Identify pests and get solutions",
//     icon: Bug,
//     gradient: "from-warning to-sunny",
//   },
//   {
//     id: "ai-assistant",
//     title: "🤖 AI Assistant",
//     description: "Ask farming questions anytime",
//     icon: MessageCircle,
//     gradient: "from-sky to-sky-light",
//   },
//   {
//     id: "reports",
//     title: "📊 Farm Reports",
//     description: "Track your farming progress",
//     icon: BarChart3,
//     gradient: "from-success to-primary",
//   },
//   {
//     id: "soil-health",
//     title: "🧪 Soil Analysis",
//     description: "Monitor soil health metrics",
//     icon: Calculator,
//     gradient: "from-earth to-primary",
//   },
// ];

// interface FeatureGridProps {
   
//   onFeatureClick: (featureId: string) => void;
// }

// const FeatureGrid = ({ onFeatureClick }: FeatureGridProps) => {
//   const { t } = useTranslation();
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {features.map((feature) => {
//         const IconComponent = feature.icon;
//         return (
//           <button
//             key={feature.id}
//             onClick={() => onFeatureClick(feature.id)}
//             className="feature-btn group"
//           >
//             <div className={`feature-btn-icon bg-gradient-to-br ${feature.gradient} rounded-full p-3 group-hover:scale-110 transition-transform duration-200`}>
//               <IconComponent className="w-6 h-6 text-white" />
//             </div>
//             <h3 className="font-display font-semibold text-lg text-foreground mb-2">
//               {feature.title}
//             </h3>
//             <p className="text-sm text-muted-foreground">
//               {feature.description}
//             </p>
//           </button>
//         );
//       })}
//     </div>
//   );
// };

// export default FeatureGrid;


import {
  Wheat,
  Sprout,
  Bug,
  MessageCircle,
  BarChart3,
  Calculator,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface FeatureGridProps {
  onFeatureClick: (featureId: string) => void;
}

const FeatureGrid = ({ onFeatureClick }: FeatureGridProps) => {
  const { t } = useTranslation();

  const features = [
    {
      id: "predict-yield",
      title: `🌾 ${t("tools.predict_yield.title")}`,
      description: t("tools.predict_yield.desc"),
      icon: Wheat,
      gradient: "from-primary to-primary-light",
    },
    {
      id: "fertilizer",
      title: `🌱 ${t("tools.fertilizer_guide.title")}`,
      description: t("tools.fertilizer_guide.desc"),
      icon: Sprout,
      gradient: "from-earth to-earth-light",
    },
    {
      id: "pest-control",
      title: `🐛 ${t("tools.pest_detection.title")}`,
      description: t("tools.pest_detection.desc"),
      icon: Bug,
      gradient: "from-warning to-sunny",
    },
    {
      id: "ai-assistant",
      title: `🤖 ${t("tools.ai_assistant.title")}`,
      description: t("tools.ai_assistant.desc"),
      icon: MessageCircle,
      gradient: "from-sky to-sky-light",
    },
    {
      id: "reports",
      title: `📊 ${t("tools.farm_reports.title")}`,
      description: t("tools.farm_reports.desc"),
      icon: BarChart3,
      gradient: "from-success to-primary",
    },
    {
      id: "soil-health",
      title: `🧪 ${t("tools.soil_analysis.title")}`,
      description: t("tools.soil_analysis.desc"),
      icon: Calculator,
      gradient: "from-earth to-primary",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature) => {
        const IconComponent = feature.icon;
        return (
          <button
            key={feature.id}
            onClick={() => onFeatureClick(feature.id)}
            className="feature-btn group"
          >
            <div
              className={`feature-btn-icon bg-gradient-to-br ${feature.gradient} rounded-full p-3 group-hover:scale-110 transition-transform duration-200`}
            >
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-display font-semibold text-lg text-foreground mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {feature.description}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default FeatureGrid;
