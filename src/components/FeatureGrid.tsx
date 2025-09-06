import { 
  Wheat, 
  Sprout, 
  Bug, 
  MessageCircle, 
  BarChart3, 
  MapPin,
  Calculator,
  Camera
} from "lucide-react";

const features = [
  {
    id: "predict-yield",
    title: "🌾 Predict Yield",
    description: "AI-powered crop yield predictions",
    icon: Wheat,
    gradient: "from-primary to-primary-light",
  },
  {
    id: "fertilizer",
    title: "🌱 Fertilizer Guide",
    description: "Smart fertilization recommendations",
    icon: Sprout,
    gradient: "from-earth to-earth-light",
  },
  {
    id: "pest-control",
    title: "🐛 Pest Detection",
    description: "Identify pests and get solutions",
    icon: Bug,
    gradient: "from-warning to-sunny",
  },
  {
    id: "ai-assistant",
    title: "🤖 AI Assistant",
    description: "Ask farming questions anytime",
    icon: MessageCircle,
    gradient: "from-sky to-sky-light",
  },
  {
    id: "reports",
    title: "📊 Farm Reports",
    description: "Track your farming progress",
    icon: BarChart3,
    gradient: "from-success to-primary",
  },
  {
    id: "soil-health",
    title: "🧪 Soil Analysis",
    description: "Monitor soil health metrics",
    icon: Calculator,
    gradient: "from-earth to-primary",
  },
];

interface FeatureGridProps {
  onFeatureClick: (featureId: string) => void;
}

const FeatureGrid = ({ onFeatureClick }: FeatureGridProps) => {
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
            <div className={`feature-btn-icon bg-gradient-to-br ${feature.gradient} rounded-full p-3 group-hover:scale-110 transition-transform duration-200`}>
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