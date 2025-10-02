import { useState } from "react";
import { Mic, Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface QuestionInputProps {
  onAddQuestion: (content: string, isAudio: boolean) => void;
}

export const QuestionInput = ({ onAddQuestion }: QuestionInputProps) => {
  const { t } = useTranslation();
  const [questionText, setQuestionText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const handleSubmit = () => {
    if (questionText.trim()) {
      onAddQuestion(questionText, false);
      setQuestionText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingTime(0);
      const interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      (window as any).recordingInterval = interval;
    } else {
      setIsRecording(false);
      clearInterval((window as any).recordingInterval);
      onAddQuestion(`Audio recording (${recordingTime}s)`, true);
      setRecordingTime(0);
    }
  };

  return (
    <Card className="p-6 shadow-lg w-full max-w-4xl mx-auto bg-white border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {t("ask_question")}
      </h2>

      <div className="space-y-4">
        {/* Textarea */}
        <Textarea
          placeholder={t("ask_placeholder")}
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[100px] resize-none border-gray-300 focus:ring-green-500 focus:border-green-500"
          disabled={isRecording}
        />

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            size="lg"
            onClick={toggleRecording}
            className={`w-full sm:w-1/2 whitespace-normal break-words ${
              isRecording
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {isRecording ? (
              <>
                <Square className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{t("stop_recording")}</span>
                <span className="ml-1">({recordingTime}s)</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2 flex-shrink-0" />
                {t("record_audio")}
              </>
            )}
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!questionText.trim() || isRecording}
            size="lg"
            className="w-full sm:w-1/2 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300"
          >
            <Send className="w-4 h-4 mr-2 flex-shrink-0" />
            {t("post_question")}
          </Button>
        </div>

        {/* Recording indicator */}
        {isRecording && (
          <div className="flex items-center justify-center gap-2 text-orange-600 animate-pulse">
            <div className="w-3 h-3 bg-orange-600 rounded-full" />
            <span className="text-sm font-medium">
              {t("recording_progress")}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};
