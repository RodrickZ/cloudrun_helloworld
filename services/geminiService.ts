import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface DeploymentGuide {
  dockerfile: string;
  deployScript: string;
  explanation: string;
}

export const generateDeploymentDocs = async (): Promise<string> => {
  try {
    const modelId = "gemini-2.5-flash"; // Optimized for coding tasks
    
    const prompt = `
      You are a Google Cloud Platform and DevOps expert. 
      I have a simple static React "Hello World" application.
      
      The user is encountering this Cloud Run error: "The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable".
      
      Please generate a comprehensive, fix-oriented guide to deploy this app to Google Cloud Run.
      
      Include the following in Markdown format:
      1. A production-ready 'Dockerfile' that uses 'nginx:alpine'.
         - **CRITICAL**: Cloud Run sends traffic to port 8080. Nginx defaults to 80. 
         - **REQUIRED**: In the Dockerfile, use 'sed' to update the Nginx config to listen on port 8080. 
         - Example: RUN sed -i 's/listen       80;/listen       8080;/g' /etc/nginx/conf.d/default.conf
         - Expose port 8080.
      2. A 'deploy.sh' bash script that:
         - Builds the Docker image.
         - Submits it to Google Cloud Build (or pushes to Artifact Registry).
         - Deploys the container to Cloud Run with '--allow-unauthenticated' and '--port 8080'.
         - Uses placeholders like PROJECT_ID="your-project-id" and SERVICE_NAME="hello-world-v2".
      3. A very brief checklist of prerequisites (gcloud init, billing enabled).
      
      Format the response with clear headers and code blocks using markdown backticks.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: "You are a senior DevOps engineer. You provide working, production-ready configurations that handle Cloud Run specific requirements like PORT 8080.",
      }
    });

    return response.text || "Failed to generate documentation.";
  } catch (error) {
    console.error("Error generating deployment docs:", error);
    return `Error: Unable to generate deployment instructions. \n\nDetails: ${(error as Error).message}`;
  }
};