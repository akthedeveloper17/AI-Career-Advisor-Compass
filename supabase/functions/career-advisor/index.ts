import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { skills, interests, education, experience } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing career recommendation request", { skills, interests, education, experience });

    const systemPrompt = `You are an expert career advisor with deep knowledge of the modern job market, industry trends, and skill requirements across various sectors. Your role is to provide personalized, actionable career guidance that helps individuals make informed decisions about their professional future.

When analyzing a user's profile, consider:
1. Their current skills and how they map to emerging career opportunities
2. Their interests and how to align them with viable career paths
3. The specific skills gaps they need to address for their target careers
4. Realistic learning paths and timeframes
5. Industry trends and future-proof career options

Provide recommendations in a structured format that includes:
- 3-5 personalized career paths ranked by fit
- Specific skills needed for each path
- Actionable learning roadmap
- Industry insights and salary ranges`;

    const userPrompt = `Please analyze this profile and provide personalized career recommendations:

**Current Skills:** ${skills}
**Interests:** ${interests}
**Education Level:** ${education}
**Experience:** ${experience}

Provide THREE outputs:

1. A comprehensive career advisory text report with:
   - Top 3-5 recommended career paths (with match percentage)
   - Skills gap analysis for each path
   - Prioritized learning roadmap
   - Industry trends and outlook
   - Estimated timeline to transition
   - Use **bold** for emphasis on key points

2. A structured JSON roadmap for the TOP recommended career path with this exact format:
{
  "title": "Career Title",
  "stages": [
    {
      "name": "Stage name (e.g., Fundamentals, Core Skills, Advanced Topics, Specialization)",
      "topics": [
        {
          "name": "Main topic or skill",
          "subtopics": ["specific item 1", "specific item 2"]
        }
      ]
    }
  ]
}

3. Highly personalized next steps (4 specific action items as JSON array):
   - Reference their ACTUAL skills: "${skills}"
   - Consider their ACTUAL interests: "${interests}"
   - Account for their ACTUAL education: "${education}"
   - Factor in their ACTUAL experience: "${experience}"
   
   Make each action item concrete, actionable, and directly relevant to their profile.
   Example format: ["Start learning [specific skill they lack] through [specific resource type] to bridge the gap for [specific career path]", "Leverage your existing [their actual skill] to build [specific project type]", "Connect with [specific type of professionals] in [their interest area] through [specific platform]", "Within the next 30 days, [specific action based on their experience level]"]

Format your complete response as:
RECOMMENDATION:
[Your detailed text here with **bold** formatting]

ROADMAP:
[Your JSON roadmap here]

NEXT_STEPS:
[Your JSON array of 4 personalized action items here]`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const fullContent = data.choices[0].message.content;
    
    // Parse the response to separate recommendation, roadmap, and next steps
    const recommendationMatch = fullContent.match(/RECOMMENDATION:([\s\S]*?)(?=ROADMAP:|$)/);
    const recommendation = recommendationMatch ? recommendationMatch[1].trim() : fullContent;
    
    let roadmap = null;
    const roadmapMatch = fullContent.match(/ROADMAP:([\s\S]*?)(?=NEXT_STEPS:|$)/);
    if (roadmapMatch) {
      try {
        const jsonMatch = roadmapMatch[1].match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          roadmap = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error("Failed to parse roadmap JSON:", e);
      }
    }

    let nextSteps = null;
    const nextStepsMatch = fullContent.match(/NEXT_STEPS:([\s\S]*?)$/);
    if (nextStepsMatch) {
      try {
        const jsonMatch = nextStepsMatch[1].match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          nextSteps = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error("Failed to parse next steps JSON:", e);
      }
    }

    console.log("Career recommendation, roadmap, and next steps generated successfully");

    return new Response(
      JSON.stringify({ recommendation, roadmap, nextSteps }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in career-advisor function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
