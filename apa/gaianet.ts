import ky from "ky";
import Groq from "groq-sdk";
import { GoogleGenerativeAI,  HarmCategory,
  HarmBlockThreshold } from "@google/generative-ai";

  export async function askGemini(content:string,systemMessage:string){
    const API_KEY = process.env.GOOGLE_API_KEY as string;
    const genAI = new GoogleGenerativeAI(API_KEY);
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ];
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b-exp-0924",
    systemInstruction: systemMessage
  }
    , { apiVersion: 'v1beta' });
    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [
       
      ],
    });
  
    
    const result = await chatSession.sendMessage(content);
    
    

    const text = result.response.text();
    return text
  }
export async function askGroq(content: string, systemMessage: string) {
  const API_KEY = process.env.GROQ_API_KEY;
  const groq = new Groq({
    apiKey: API_KEY,
  });
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:systemMessage,
      },
      {
        role: "user",
        content,
      },
    ],
    model: "mixtral-8x7b-32768",
  });
  // const text = completion.choices[0]?.message?.content;
  return completion;
}

async function randomToolNode() {
  const response = await ky.get("https://api.gaianet.ai/api/v1/network/nodes/");
  const data = await response.json();

  const objectArray = (data as any).data.objects.filter(
    (obj: any) => obj.status === "ONLINE" && obj.model_name && obj.node_id.toLowerCase().includes("tool"),
  );
  const random = objectArray[Math.floor(Math.random() * objectArray.length)];
  return random;
}
export async function randomNode() {
  const response = await ky.get("https://api.gaianet.ai/api/v1/network/nodes/");
  const data = await response.json();

  const objectArray = (data as any).data.objects.filter(
    (obj: any) => obj.status === "ONLINE" && (obj.model_name.toLowerCase().includes("llama") || obj.model_name.toLowerCase().includes("phi") || obj.model_name.toLowerCase().includes("gemma")),
  );
  const random = objectArray[Math.floor(Math.random() * objectArray.length)];
  return random;
}
export async function ask(content: string, systemMessage: string,node:any) {

  

  const response = await ky.post(`https://${node.subdomain}/v1/chat/completions`, {
    json: {
      messages: [
        {
          role: "system",
          content: systemMessage
        },
        {
          role: "user",
          content
        },
      ],
      model: node.model_name
    },
    retry: {
      limit: 3,
      methods: ["post"],
      statusCodes: [408, 504],
      backoffLimit: 3000,
    },
    timeout: 50000,
  });
  return response;
}
export async function askTool(content: string, tools: any) {

  const random = await randomToolNode();

  const response = await ky.post(`https://${random.subdomain}/v1/chat/completions`, {
    json: {
      messages: [
        {
          role: "system",
          content: "you're a chatbot that can pick what command to use based on natural language"
        },
        {
          role: "user",
          content
        },
      ],
      model: random.model_name,
      tools
    },
    retry: {
      limit: 3,
      methods: ["post"],
      statusCodes: [408, 504],
      backoffLimit: 3000,
    },
    timeout: 50000,
  });
  return {response,random};
}
