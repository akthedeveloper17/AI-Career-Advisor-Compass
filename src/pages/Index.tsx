import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import SkillsAssessment, { AssessmentData } from "@/components/SkillsAssessment";
import CareerRecommendations from "@/components/CareerRecommendations";
import { Sparkles, TrendingUp, Target, Users } from "lucide-react";
import heroImage from "@/assets/hero-career.jpg";

const Index = () => {
  const [step, setStep] = useState<"landing" | "assessment" | "results">("landing");
  const [recommendation, setRecommendation] = useState<string>("");
  const [roadmap, setRoadmap] = useState<any>(null);
  const [nextSteps, setNextSteps] = useState<string[]>([]);
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    skills: "",
    interests: "",
    education: "",
    experience: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async (data: AssessmentData) => {
    setIsLoading(true);
    setAssessmentData(data); // Store assessment data for resume builder
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/career-advisor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again in a few moments.");
        }
        if (response.status === 402) {
          throw new Error("Service temporarily unavailable. Please try again later.");
        }
        throw new Error("Failed to generate recommendations");
      }

      const result = await response.json();
      setRecommendation(result.recommendation);
      setRoadmap(result.roadmap);
      setNextSteps(result.nextSteps || []);
      setStep("results");
      
      toast({
        title: "Success!",
        description: "Your personalized career recommendations are ready.",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAssessment = () => {
    setStep("assessment");
  };

  const handleStartOver = () => {
    setStep("landing");
    setRecommendation("");
    setRoadmap(null);
    setNextSteps([]);
    setAssessmentData({
      skills: "",
      interests: "",
      education: "",
      experience: ""
    });
  };

  if (step === "results" && recommendation) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <CareerRecommendations 
          recommendation={recommendation}
          roadmap={roadmap}
          nextSteps={nextSteps}
          onStartOver={handleStartOver}
          assessmentData={assessmentData}
        />
      </div>
    );
  }

  if (step === "assessment") {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="mb-8 text-center">
          <Button
            onClick={() => setStep("landing")}
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            ← Back to Home
          </Button>
        </div>
        <SkillsAssessment onAnalyze={handleAnalyze} isLoading={isLoading} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'var(--gradient-accent)',
          }}
        />
        <div 
          className="absolute inset-0 z-0 opacity-40"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        
        <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Powered Career Intelligence</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight animate-fade-in">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Navigate Your Career
              </span>
              <br />
              <span className="text-foreground">With Confidence</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
              Get personalized career recommendations powered by AI. Map your skills, discover opportunities, 
              and build a roadmap for success in the evolving job market.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button
                onClick={handleStartAssessment}
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-semibold shadow-glow text-lg px-8 py-6"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Start Your Career Assessment
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Our AI Career Advisor?
            </h2>
            <p className="text-muted-foreground text-lg">
              Intelligent insights tailored to your unique profile
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-glow">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Personalized Recommendations
              </h3>
              <p className="text-muted-foreground">
                Receive career paths tailored to your unique skills, interests, and background—not generic advice.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-glow">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Market Intelligence
              </h3>
              <p className="text-muted-foreground">
                Get insights on emerging opportunities, industry trends, and in-demand skills for future-proof careers.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-glow">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Actionable Roadmap
              </h3>
              <p className="text-muted-foreground">
                Receive a clear, step-by-step plan with specific skills to learn and milestones to achieve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="relative rounded-3xl overflow-hidden">
            <div 
              className="absolute inset-0 z-0"
              style={{
                background: 'var(--gradient-primary)',
              }}
            />
            <div className="relative z-10 p-12 md:p-16 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
                Ready to Transform Your Career?
              </h2>
              <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto">
                Join thousands of professionals who've discovered their ideal career path with AI-powered guidance.
              </p>
              <Button
                onClick={handleStartAssessment}
                size="lg"
                className="bg-background hover:bg-background/90 text-foreground font-semibold text-lg px-8 py-6 shadow-xl"
              >
                Get Started Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
