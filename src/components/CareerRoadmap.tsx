import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ChevronRight } from "lucide-react";

interface RoadmapTopic {
  name: string;
  subtopics?: string[];
}

interface RoadmapStage {
  name: string;
  topics: RoadmapTopic[];
}

interface RoadmapData {
  title: string;
  stages: RoadmapStage[];
}

interface CareerRoadmapProps {
  roadmap: RoadmapData;
}

const CareerRoadmap = ({ roadmap }: CareerRoadmapProps) => {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card hover:shadow-glow transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <MapPin className="h-6 w-6 text-primary" />
          Career Roadmap: {roadmap.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {roadmap.stages.map((stage, stageIdx) => (
            <div key={stageIdx} className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-base px-4 py-2">
                  {stage.name}
                </Badge>
                {stageIdx < roadmap.stages.length - 1 && (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-4">
                {stage.topics.map((topic, topicIdx) => (
                  <div key={topicIdx} className="relative group">
                    {/* Connection line to next topic */}
                    {topicIdx < stage.topics.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 w-4 h-0.5 bg-primary/30 z-0" />
                    )}
                    
                    <div className="relative bg-gradient-to-br from-accent/10 to-secondary/10 border-2 border-accent/30 rounded-lg p-4 hover:border-accent hover:shadow-glow transition-all">
                      <h4 className="font-semibold text-foreground mb-2 text-sm">
                        {topic.name}
                      </h4>
                      
                      {topic.subtopics && topic.subtopics.length > 0 && (
                        <ul className="space-y-1">
                          {topic.subtopics.map((subtopic, subIdx) => (
                            <li
                              key={subIdx}
                              className="text-xs text-muted-foreground flex items-start gap-1"
                            >
                              <span className="text-accent mt-0.5">•</span>
                              <span>{subtopic}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            Follow this roadmap step-by-step to build expertise in {roadmap.title}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerRoadmap;
