import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader2 } from "lucide-react";

interface SkillsAssessmentProps {
  onAnalyze: (data: AssessmentData) => void;
  isLoading: boolean;
}

export interface AssessmentData {
  skills: string;
  interests: string;
  education: string;
  experience: string;
}

const SkillsAssessment = ({ onAnalyze, isLoading }: SkillsAssessmentProps) => {
  const [formData, setFormData] = useState<AssessmentData>({
    skills: "",
    interests: "",
    education: "",
    experience: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(formData);
  };

  const isFormValid = formData.skills && formData.interests && formData.education && formData.experience;

  return (
    <Card className="w-full max-w-3xl mx-auto bg-card/50 backdrop-blur-sm border-border/50 shadow-card">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Tell Us About Yourself
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Share your skills, interests, and background to receive personalized career recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="skills" className="text-foreground font-medium">
              Current Skills
            </Label>
            <Textarea
              id="skills"
              placeholder="e.g., JavaScript, React, Data Analysis, Project Management..."
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="min-h-[100px] bg-background/50 border-border/50 focus:border-primary transition-colors"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interests" className="text-foreground font-medium">
              Interests & Passions
            </Label>
            <Textarea
              id="interests"
              placeholder="e.g., Technology, Design, Healthcare, Education, Entrepreneurship..."
              value={formData.interests}
              onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
              className="min-h-[100px] bg-background/50 border-border/50 focus:border-primary transition-colors"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="education" className="text-foreground font-medium">
              Education Level
            </Label>
            <Select
              value={formData.education}
              onValueChange={(value) => setFormData({ ...formData, education: value })}
              disabled={isLoading}
            >
              <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary">
                <SelectValue placeholder="Select your education level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high-school">High School</SelectItem>
                <SelectItem value="associate">Associate Degree</SelectItem>
                <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                <SelectItem value="master">Master's Degree</SelectItem>
                <SelectItem value="phd">PhD/Doctorate</SelectItem>
                <SelectItem value="bootcamp">Bootcamp/Certificate</SelectItem>
                <SelectItem value="self-taught">Self-Taught</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience" className="text-foreground font-medium">
              Work Experience
            </Label>
            <Textarea
              id="experience"
              placeholder="Describe your work experience, internships, projects, or volunteer work..."
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="min-h-[100px] bg-background/50 border-border/50 focus:border-primary transition-colors"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-semibold shadow-glow transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing Your Profile...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Get AI-Powered Recommendations
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SkillsAssessment;
