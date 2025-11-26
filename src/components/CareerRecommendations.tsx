import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, TrendingUp, BookOpen, Target, ArrowRight, RefreshCw, FileText } from "lucide-react";
import CareerRoadmap from "./CareerRoadmap";
import { ResumeBuilder } from "./ResumeBuilder";
import ReactMarkdown from "react-markdown";

interface RoadmapData {
  title: string;
  stages: Array<{
    name: string;
    topics: Array<{
      name: string;
      subtopics?: string[];
    }>;
  }>;
}

interface CareerRecommendationsProps {
  recommendation: string;
  roadmap?: RoadmapData | null;
  nextSteps?: string[];
  onStartOver: () => void;
  assessmentData: {
    skills: string;
    education: string;
    experience: string;
  };
}

const CareerRecommendations = ({ 
  recommendation, 
  roadmap, 
  nextSteps = [], 
  onStartOver,
  assessmentData 
}: CareerRecommendationsProps) => {
  // Parse the recommendation text into structured sections
  const sections = recommendation.split('\n\n').filter(section => section.trim());
  
  // Default next steps if none provided
  const defaultNextSteps = [
    "Review the recommended career paths and identify which aligns best with your goals",
    "Start building the identified skills through online courses, projects, or certifications",
    "Connect with professionals in your target field through networking events or LinkedIn",
    "Create a 30-60-90 day action plan to track your progress and stay accountable"
  ];
  
  const displayNextSteps = nextSteps.length > 0 ? nextSteps : defaultNextSteps;

  // Extract career path title from recommendation
  const careerPathMatch = recommendation.match(/##?\s*(?:1\.|Top\s+Career\s+Path:?)\s*\*?\*?([^*\n]+)/i);
  const careerPath = careerPathMatch ? careerPathMatch[1].trim() : undefined;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Your Personalized Career Roadmap
          </h2>
          <p className="text-muted-foreground mt-2">
            AI-powered recommendations tailored to your unique profile
          </p>
        </div>
        <Button
          onClick={onStartOver}
          variant="outline"
          className="border-border/50 hover:border-primary transition-colors"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Start Over
        </Button>
      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="recommendations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Recommendations</span>
          </TabsTrigger>
          <TabsTrigger value="roadmap" className="gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Learning Roadmap</span>
          </TabsTrigger>
          <TabsTrigger value="resume" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Build Resume</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Career Paths Card */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card hover:shadow-glow transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Recommended Career Paths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {sections.slice(0, Math.ceil(sections.length / 2)).map((section, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="text-foreground prose prose-sm max-w-none dark:prose-invert prose-strong:text-foreground prose-p:text-foreground prose-li:text-foreground">
                          <ReactMarkdown>{section}</ReactMarkdown>
                        </div>
                        {idx < Math.ceil(sections.length / 2) - 1 && (
                          <div className="h-px bg-border/30 my-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Skills & Learning Card */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card hover:shadow-glow transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <BookOpen className="h-5 w-5 text-secondary" />
                  Skills & Learning Path
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {sections.slice(Math.ceil(sections.length / 2)).map((section, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="text-foreground prose prose-sm max-w-none dark:prose-invert prose-strong:text-foreground prose-p:text-foreground prose-li:text-foreground">
                          <ReactMarkdown>{section}</ReactMarkdown>
                        </div>
                        {idx < sections.slice(Math.ceil(sections.length / 2)).length - 1 && (
                          <div className="h-px bg-border/30 my-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Action Items Card */}
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 shadow-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Target className="h-5 w-5 text-accent" />
                Your Personalized Next Steps
              </CardTitle>
              <CardDescription>
                Actionable steps tailored specifically to your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {displayNextSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5 shrink-0">
                      {idx + 1}
                    </Badge>
                    <p className="text-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <p>Recommendations are based on current market trends and your unique profile</p>
          </div>
        </TabsContent>

        <TabsContent value="roadmap" className="mt-6">
          {roadmap ? (
            <CareerRoadmap roadmap={roadmap} />
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No learning roadmap available yet. Complete your assessment to generate a personalized roadmap.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="resume" className="mt-6">
          <ResumeBuilder
            initialSkills={assessmentData.skills}
            initialEducation={assessmentData.education}
            initialExperience={assessmentData.experience}
            careerPath={careerPath}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CareerRecommendations;
