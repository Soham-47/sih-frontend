import { useState } from "react";
import { TrendingUp, MapPin, Droplets, Thermometer, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
interface PredictionResult {
  expectedYield: number;
  confidence: number;
  recommendations: string[];
  factors: {
    weather: number;
    soil: number;
    irrigation: number;
  };
  explanation: string;
}

const PredictionCard = () => {
  const {t}=useTranslation()
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [formData, setFormData] = useState({
    nitrogen: "", // N
    phosphorus: "", // P
    potassium: "", // K
    state: "",
    rainfall: "",
    area: "",
  });

  const indianStates = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"
  ];

  const handlePredict = async () => {
    if (!formData.nitrogen || !formData.phosphorus || !formData.potassium || !formData.state || !formData.rainfall || !formData.area) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const prompt = `You are an agriculture assistant. Return a STRICT JSON object (no prose) with keys: expectedYield (number, tons per hectare), confidence (number 0-100), explanation (short string, 1-3 sentences explaining the predicted yield), recommendations (array of 3-5 short strings), factors (object with weather, soil, irrigation as numbers 0-100).\n\nInput:\n- Nitrogen (N): ${formData.nitrogen}\n- Phosphorus (P): ${formData.phosphorus}\n- Potassium (K): ${formData.potassium}\n- State: ${formData.state}\n- Rainfall (mm): ${formData.rainfall}\n- Area (hectares): ${formData.area}`;

      const resp = await fetch('/api/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'openai', prompt }),
      });

      const raw = await resp.text();
      let data: any = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch (_) {
        data = null;
      }

      if (!resp.ok) {
        // Prefer server-provided error if available
        const serverErr = data?.error || raw;
        throw new Error(serverErr || `HTTP ${resp.status}`);
      }

      if (!data) {
        throw new Error('Empty or non-JSON response from /api/llm. Ensure your dev server runs Edge functions (e.g., "vercel dev" or "netlify dev").');
      }

      // The server returns { content } where content should be JSON text per our prompt
      let parsed: any;
      try {
        parsed = JSON.parse(data.content);
      } catch (e) {
        // Fallback: try to extract JSON block
        const match = String(data.content).match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
      }

      if (!parsed) throw new Error('Invalid JSON from model');

      // Basic shape validation and coercion
      const result: PredictionResult = {
        expectedYield: Number(parsed.expectedYield) || 0,
        confidence: Math.min(100, Math.max(0, Number(parsed.confidence) || 0)),
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations.map((r: any) => String(r)) : [],
        factors: {
          weather: Math.min(100, Math.max(0, Number(parsed.factors?.weather) || 0)),
          soil: Math.min(100, Math.max(0, Number(parsed.factors?.soil) || 0)),
          irrigation: Math.min(100, Math.max(0, Number(parsed.factors?.irrigation) || 0)),
        },
        explanation: String(parsed.explanation || ""),
      };

      setPrediction(result);
    } catch (err: any) {
      console.error('Prediction failed:', err);
      setError(err?.message || 'Prediction failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="gov-card">
        <CardHeader className="gov-card-header">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-6 h-6" />
            <span>{t("crop_yield.title")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200 text-sm">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="nitrogen">{t("crop_yield.nitrogen")}</Label>
                <Input
                  id="nitrogen"
                  type="number"
                  placeholder={t("crop_yield.nitrogen_placeholder")}
                  value={formData.nitrogen}
                  onChange={(e) =>
                    setFormData({ ...formData, nitrogen: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="phosphorus">{t("crop_yield.phosphorus")}</Label>
                <Input
                  id="phosphorus"
                  type="number"
                  placeholder={t("crop_yield.phosphorus_placeholder")}
                  value={formData.phosphorus}
                  onChange={(e) =>
                    setFormData({ ...formData, phosphorus: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="potassium">{t("crop_yield.potassium")}</Label>
                <Input
                  id="potassium"
                  type="number"
                  placeholder={t("crop_yield.potassium_placeholder")}
                  value={formData.potassium}
                  onChange={(e) =>
                    setFormData({ ...formData, potassium: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="state">{t("crop_yield.state")}</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, state: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("crop_yield.state_placeholder")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {indianStates.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="rainfall">{t("crop_yield.rainfall")}</Label>
                <Input
                  id="rainfall"
                  type="number"
                  placeholder={t("crop_yield.rainfall_placeholder")}
                  value={formData.rainfall}
                  onChange={(e) =>
                    setFormData({ ...formData, rainfall: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="area">{t("crop_yield.area")}</Label>
                <Input
                  id="area"
                  type="number"
                  placeholder={t("crop_yield.area_placeholder")}
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handlePredict}
            disabled={
              !formData.nitrogen ||
              !formData.phosphorus ||
              !formData.potassium ||
              !formData.state ||
              !formData.rainfall ||
              !formData.area ||
              isLoading
            }
            className="w-full mt-6 bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-primary-foreground"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("AI is Analyzing...")}
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                {t("crop_yield.predict_button")}
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
              <span>{t("prediction_results.title")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {prediction.expectedYield} {t("prediction_results.unit")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("prediction_results.expected_yield")}
                  </div>
                  <div className="status-success mt-2">
                    {prediction.confidence}%{" "}
                    {t("prediction_results.confidence")}
                  </div>
                  {prediction.explanation && (
                    <p className="mt-4 text-sm text-foreground/80 leading-relaxed">
                      {prediction.explanation}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">
                    {t("prediction_results.influencing_factors")}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        <Thermometer className="w-4 h-4 mr-2" />
                        {t("prediction_results.weather")}
                      </span>
                      <span className="font-semibold">
                        {prediction.factors.weather}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {t("prediction_results.soil_quality")}
                      </span>
                      <span className="font-semibold">
                        {prediction.factors.soil}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        <Droplets className="w-4 h-4 mr-2" />
                        {t("prediction_results.irrigation")}
                      </span>
                      <span className="font-semibold">
                        {prediction.factors.irrigation}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-3">
                  {t("prediction_results.ai_recommendations")}
                </h4>
                <div className="space-y-3">
                  {prediction.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-accent rounded-lg"
                    >
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