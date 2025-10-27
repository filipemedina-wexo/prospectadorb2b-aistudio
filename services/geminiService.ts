import { GoogleGenAI } from "@google/genai";
import { LeadStatus, Source, PartialLead } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// Helper to extract JSON from Gemini's response text
const extractJson = (text: string): any[] => {
    const jsonMatch = text.match(/```(json)?\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[2] : text;

    try {
        const parsed = JSON.parse(jsonString);
        // Ensure it's an array
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.error("Failed to parse JSON from Gemini response:", e);
        console.error("Raw text was:", text);
        // Fallback to returning an empty array if parsing fails
        return [];
    }
};


export const findBusinesses = async (
    segmento: string, 
    cidade: string, 
    bairro: string,
    location: { lat: number, lon: number } | null,
    onlyMobile: boolean,
    existingNames: string[] = [],
// FIX: Replaced `Partial<Lead>[]` with `PartialLead[]` to use the imported type and resolve the error.
): Promise<PartialLead[]> => {

  const mobileConstraint = onlyMobile ? "O telefone deve ser um número de celular." : "";
  const exclusionConstraint = existingNames.length > 0 ? `Não inclua as seguintes empresas que já foram encontradas: ${existingNames.join(', ')}.` : '';
  const prompt = `Encontre até 5 empresas reais do segmento de '${segmento}' localizadas em ou perto de ${bairro}, ${cidade}. Para cada empresa, forneça o nome, telefone, website, endereço, a nota do Google (GMB), a quantidade de avaliações no Google e o perfil do Instagram (se disponível). ${mobileConstraint} ${exclusionConstraint} Formate a resposta estritamente como um array JSON com os campos: "name", "phone", "website", "address", "gmbRating", "gmbReviewCount", "instagramProfile". Se não encontrar um dado específico, retorne uma string vazia ou null para esse campo.`;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }, { googleMaps: {} }],
            toolConfig: location ? {
                retrievalConfig: {
                    latLng: {
                        latitude: location.lat,
                        longitude: location.lon
                    }
                }
            } : undefined,
        },
    });

    const businesses = extractJson(response.text);
    if (businesses.length === 0 && response.text) {
        // This indicates a parsing failure or empty response from the model
        console.warn("Gemini returned a non-JSON or empty response.");
    }

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const sources: Source[] = groundingChunks.flatMap(chunk => {
        const sourceList: Source[] = [];
        if (chunk.web?.uri) {
            sourceList.push({ uri: chunk.web.uri, title: chunk.web.title || 'Fonte da Web' });
        }
        if (chunk.maps?.uri) {
            sourceList.push({ uri: chunk.maps.uri, title: chunk.maps.title || 'Fonte do Maps' });
        }
        return sourceList;
    }).filter(s => s.uri); // Ensure we only have sources with URIs

    return businesses.map((biz: any) => ({
      id: `place_${Date.now()}_${Math.random()}`,
      name: biz.name,
      phone: biz.phone,
      website: biz.website,
      address: biz.address,
      status: LeadStatus.AContatar,
      city: cidade,
      neighborhood: bairro,
      tags: [],
      listIds: [],
      observations: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sources: sources,
      gmb_rating: typeof biz.gmbRating === 'number' ? biz.gmbRating : 0,
      gmb_review_count: typeof biz.gmbReviewCount === 'number' ? biz.gmbReviewCount : 0,
      instagram_profile: typeof biz.instagramProfile === 'string' ? biz.instagramProfile : '',
    }));
  } catch (error) {
    console.error("Error fetching businesses from Gemini API:", error);
    throw new Error("Falha ao buscar empresas. A API pode estar indisponível.");
  }
};

export const findInstagramProfile = async (companyName: string, companyWebsite?: string): Promise<string> => {
    const websiteInfo = companyWebsite ? `cujo site é '${companyWebsite}'` : '';
    const prompt = `Encontre a URL do perfil oficial do Instagram para a empresa chamada '${companyName}' ${websiteInfo}. Retorne apenas a URL completa (ex: https://www.instagram.com/nomedoperfil) e nada mais. Se não encontrar um perfil oficial com certeza, retorne 'N/A'.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                temperature: 0,
            },
        });

        const text = response.text.trim();

        // Use regex to find an Instagram URL in the response
        const urlRegex = /(https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.-]+)/;
        const match = text.match(urlRegex);

        if (match && match[0]) {
            return match[0];
        }

        return 'N/A';
    } catch (error) {
        console.error(`Error finding Instagram for ${companyName}:`, error);
        return 'N/A';
    }
};