import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { AnalysisResult, ReportStatus } from "../types";

const processFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const analyzeMedicalReport = async (files: File[]): Promise<AnalysisResult> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("No API Key found. Returning demo data.");
      await new Promise(resolve => setTimeout(resolve, 3000));
      return getMockData();
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Process all files to base64
    const fileDataPromises = files.map(async (file) => ({
      inlineData: {
        mimeType: file.type,
        data: await processFileToBase64(file)
      }
    }));
    const fileData = await Promise.all(fileDataPromises);
    
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            overallStatus: { type: SchemaType.STRING, enum: ["NORMAL", "ATTENTION", "URGENT"] },
            summary: { type: SchemaType.STRING },
            tests: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  name: { type: SchemaType.STRING },
                  value: { type: SchemaType.STRING },
                  range: { type: SchemaType.STRING },
                  explanation: { type: SchemaType.STRING },
                  status: { type: SchemaType.STRING, enum: ["normal", "warning", "alert"] }
                }
              }
            },
            disclaimer: { type: SchemaType.STRING }
          }
        }
      }
    });

    const prompt = `
      You are Doclyst, a reassuring, calm, and friendly medical assistant. 
      Analyze ALL the attached medical report images/pages together as one complete report.
      
      Your goal is to simplify the medical jargon into plain, comforting English.
      
      IMPORTANT:
      1. Analyze all ${files.length} page(s) together to get the complete picture.
      2. Determine the overall status: 
         - NORMAL (Everything looks good)
         - ATTENTION (Some values are off, but not critical)
         - URGENT (Immediate doctor visit recommended)
      3. Write a "Simple Summary" paragraph. It should be warm, human, and easy to understand (5th-grade reading level).
      4. Extract ALL key test items from ALL pages. For each item, provide the name, the value found, the normal range, and a 1-sentence simple explanation.
      5. If the images are not medical reports, return a polite error in the summary explaining you can only read medical reports.
    `;

    const response = await model.generateContent([
      ...fileData,
      prompt
    ]);

    const text = response.response.text();
    if (!text) throw new Error("No response from AI");
    
    const result = JSON.parse(text) as AnalysisResult;
    
    return {
      ...result,
      overallStatus: result.overallStatus as ReportStatus || ReportStatus.ATTENTION
    };

  } catch (error) {
    console.error("Analysis failed", error);
    throw new Error("We couldn't read those files. Please try clearer images.");
  }
};


// Mock data for fallback or testing without API key
const getMockData = (): AnalysisResult => ({
  overallStatus: ReportStatus.ATTENTION,
  summary: "We've looked at your Complete Blood Count. Most things look great! Your Vitamin D is a little lower than we'd like, which is very common. The rest of your blood cell counts are healthy.",
  tests: [
    {
      name: "Hemoglobin",
      value: "14.2 g/dL",
      range: "13.5 - 17.5",
      explanation: "The protein in your red blood cells that carries oxygen. Your level is perfect.",
      status: "normal"
    },
    {
      name: "Vitamin D",
      value: "18 ng/mL",
      range: "30 - 100",
      explanation: "Helps with strong bones. You are slightly low, so some sunshine or supplements might help.",
      status: "warning"
    },
    {
      name: "WBC Count",
      value: "6.5 K/uL",
      range: "4.5 - 11.0",
      explanation: "Your immune system cells. This normal number means you likely aren't fighting an infection right now.",
      status: "normal"
    }
  ],
  disclaimer: "Doclyst does not provide medical advice. This explanation is for understanding only."
});
