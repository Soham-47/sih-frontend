import { useState } from "react";
import { TrendingUp, MapPin, Droplets, Thermometer, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PredictionResult {
  expectedYield: number;
  confidence: number;
  recommendations: string[];
  factors: {
    weather: number;
    soil: number;
    irrigation: number;
  };
}

const PredictionCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [formData, setFormData] = useState({
    cropType: "",
    area: "",
    soilType: "",
    region: "",
  });

  const cropTypes = [
    "Rice (धान)",
    "Wheat (गेहूं)", 
    "Cotton (कपास)",
    "Sugarcane (गन्ना)",
    "Maize (मक्का)",
    "Pulses (दाल)",
    "Soybean (सोयाबीन)",
    "Groundnut (मूंगफली)"
  ];

  const soilTypes = [
    "Alluvial Soil (जलोढ़ मिट्टी)",
    "Black Soil (काली मिट्टी)",
    "Red Soil (लाल मिट्टी)",
    "Laterite Soil (लेटेराइट मिट्टी)",
    "Desert Soil (रेगिस्तानी मिट्टी)",
    "Mountain Soil (पर्वतीय मिट्टी)"
  ];

  const handlePredict = async () => {
    if (!formData.cropType || !formData.area || !formData.soilType) {
      return;
    }

    setIsLoading(true);
    
    // Simulate AI prediction API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockPrediction: PredictionResult = {
      expectedYield: Math.floor(Math.random() * 50) + 30,
      confidence: Math.floor(Math.random() * 20) + 75,
      recommendations: [
        "Apply organic fertilizer after 2 weeks",
        "Maintain irrigation schedule twice weekly",
        "Monitor for pest activity in next 10 days",
        "Consider intercropping with legumes"
      ],
      factors: {
        weather: Math.floor(Math.random() * 30) + 70,
        soil: Math.floor(Math.random() * 25) + 65,
        irrigation: Math.floor(Math.random() * 20) + 75,
      }
    };

    setPrediction(mockPrediction);
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card className="gov-card">
        <CardHeader className="gov-card-header">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-6 h-6" />
            <span>AI Crop Yield Prediction</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="cropType">Crop Type (फसल का प्रकार)</Label>
                <Select onValueChange={(value) => setFormData({...formData, cropType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop type" />
                  </SelectTrigger>
                  <SelectContent>
                    {cropTypes.map((crop) => (
                      <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="area">Farm Area (खेत का क्षेत्रफल) - Hectares</Label>
                <Input
                  id="area"
                  type="number"
                  placeholder="Enter area in hectares"
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="soilType">Soil Type (मिट्टी का प्रकार)</Label>
                <Select onValueChange={(value) => setFormData({...formData, soilType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    {soilTypes.map((soil) => (
                      <SelectItem key={soil} value={soil}>{soil}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="region">Region (क्षेत्र)</Label>
                <Input
                  id="region"
                  placeholder="Enter your region/district"
                  value={formData.region}
                  onChange={(e) => setFormData({...formData, region: e.target.value})}
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={handlePredict}
            disabled={!formData.cropType || !formData.area || !formData.soilType || isLoading}
            className="w-full mt-6 bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-primary-foreground"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                AI is Analyzing...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Predict Yield with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {prediction && (
        <Card className="gov-card">
          <CardHeader className="bg-gradient-to-r from-success to-primary text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-6 h-6" />
              <span>AI Prediction Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {prediction.expectedYield} tons/hectare
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Expected Yield (अपेक्षित उत्पादन)
                  </div>
                  <div className="status-success mt-2">
                    {prediction.confidence}% Confidence
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Influencing Factors:</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center"><Thermometer className="w-4 h-4 mr-2" />Weather</span>
                      <span className="font-semibold">{prediction.factors.weather}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center"><MapPin className="w-4 h-4 mr-2" />Soil Quality</span>
                      <span className="font-semibold">{prediction.factors.soil}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center"><Droplets className="w-4 h-4 mr-2" />Irrigation</span>
                      <span className="font-semibold">{prediction.factors.irrigation}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-3">AI Recommendations (सुझाव):</h4>
                <div className="space-y-3">
                  {prediction.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-accent rounded-lg">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-sm text-foreground">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PredictionCard;