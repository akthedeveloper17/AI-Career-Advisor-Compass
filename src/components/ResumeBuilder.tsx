import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDown, Briefcase } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";

interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string;
  education: string;
  experience: string;
}

interface ResumeBuilderProps {
  initialSkills: string;
  initialEducation: string;
  initialExperience: string;
  careerPath?: string;
}

export const ResumeBuilder = ({ initialSkills, initialEducation, initialExperience, careerPath }: ResumeBuilderProps) => {
  const [template, setTemplate] = useState<string>("professional");
  const [resumeData, setResumeData] = useState<ResumeData>({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    skills: initialSkills,
    education: initialEducation,
    experience: initialExperience,
  });

  const handleInputChange = (field: keyof ResumeData, value: string) => {
    setResumeData(prev => ({ ...prev, [field]: value }));
  };

  const downloadPDF = async () => {
    const resumeElement = document.getElementById("resume-preview");
    if (!resumeElement) return;

    try {
      toast.loading("Generating your resume...");
      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${resumeData.fullName.replace(/\s+/g, "_")}_Resume.pdf`);
      toast.success("Resume downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  const getTemplateStyles = () => {
    switch (template) {
      case "modern":
        return "bg-gradient-to-br from-primary/5 to-accent/5";
      case "creative":
        return "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20";
      default:
        return "bg-background";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <CardTitle>Build Your Professional Resume</CardTitle>
          </div>
          <CardDescription>
            Create a tailored resume for your {careerPath || "target career path"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="template">Resume Template</Label>
              <Select value={template} onValueChange={setTemplate}>
                <SelectTrigger id="template">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={resumeData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={resumeData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={resumeData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={resumeData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="New York, NY"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="summary">Professional Summary</Label>
              <Textarea
                id="summary"
                value={resumeData.summary}
                onChange={(e) => handleInputChange("summary", e.target.value)}
                placeholder="A brief overview of your professional background and career objectives..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="skills">Skills</Label>
              <Textarea
                id="skills"
                value={resumeData.skills}
                onChange={(e) => handleInputChange("skills", e.target.value)}
                placeholder="List your key skills..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="education">Education</Label>
              <Textarea
                id="education"
                value={resumeData.education}
                onChange={(e) => handleInputChange("education", e.target.value)}
                placeholder="Your educational background..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="experience">Experience</Label>
              <Textarea
                id="experience"
                value={resumeData.experience}
                onChange={(e) => handleInputChange("experience", e.target.value)}
                placeholder="Your work experience and achievements..."
                rows={4}
              />
            </div>
          </div>

          <Button onClick={downloadPDF} className="w-full" size="lg">
            <FileDown className="mr-2 h-4 w-4" />
            Download Resume as PDF
          </Button>
        </CardContent>
      </Card>

      {/* Resume Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Resume Preview</CardTitle>
          <CardDescription>Preview how your resume will look</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            id="resume-preview"
            className={`p-8 rounded-lg border ${getTemplateStyles()} min-h-[800px]`}
          >
            {/* Header */}
            <div className="text-center mb-6 pb-6 border-b-2 border-primary/20">
              <h1 className="text-4xl font-bold mb-2 text-foreground">
                {resumeData.fullName || "Your Name"}
              </h1>
              <div className="flex justify-center gap-4 text-sm text-muted-foreground flex-wrap">
                {resumeData.email && <span>{resumeData.email}</span>}
                {resumeData.phone && <span>•</span>}
                {resumeData.phone && <span>{resumeData.phone}</span>}
                {resumeData.location && <span>•</span>}
                {resumeData.location && <span>{resumeData.location}</span>}
              </div>
            </div>

            {/* Professional Summary */}
            {resumeData.summary && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-primary border-b pb-2">
                  Professional Summary
                </h2>
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {resumeData.summary}
                </p>
              </div>
            )}

            {/* Skills */}
            {resumeData.skills && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-primary border-b pb-2">
                  Skills
                </h2>
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {resumeData.skills}
                </p>
              </div>
            )}

            {/* Experience */}
            {resumeData.experience && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-primary border-b pb-2">
                  Experience
                </h2>
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {resumeData.experience}
                </p>
              </div>
            )}

            {/* Education */}
            {resumeData.education && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-primary border-b pb-2">
                  Education
                </h2>
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {resumeData.education}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
