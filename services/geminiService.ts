import { GoogleGenAI } from "@google/genai";
import { TcpParams, NetworkInput } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTcpInsights = async (
  input: NetworkInput,
  params: TcpParams
): Promise<string> => {
  try {
    const prompt = `
      As a senior Linux Kernel performance engineer, analyze the following TCP tuning calculation:
      
      Scenario:
      - Bandwidth: ${input.bandwidth} Mbps
      - RTT (Latency): ${input.rtt} ms
      - Calculated BDP: ${params.bdpBytes} bytes
      
      Suggested sysctl values:
      net.core.rmem_max=${params.rmemMax}
      net.core.wmem_max=${params.wmemMax}
      net.ipv4.tcp_rmem=${params.tcpRmem.join(' ')}
      net.ipv4.tcp_wmem=${params.tcpWmem.join(' ')}
      
      Please provide a brief, professional technical explanation (max 300 words).
      1. Explain why these values are calculated this way (mention BDP).
      2. Are there any risks with these values (e.g., memory consumption on high concurrency)?
      3. Suggest 1-2 additional related sysctl parameters relevant for this specific bandwidth/latency profile (e.g., congestion control, backlog).
      
      Format the response in Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error communicating with AI service. Please check your API key.";
  }
};
