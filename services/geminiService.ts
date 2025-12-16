import { LeadStatus, Source, PartialLead } from '../types';
import { sendMessageToProsperaAI, Message } from './prosperaAiService';

const extractJson = (text: string): any[] => {
    const jsonMatch = text.match(/```(json)?\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[2] : text;

    try {
        const parsed = JSON.parse(jsonString);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.error("Failed to parse JSON from Gemini response:", e);
        console.error("Raw text was:", text);
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
): Promise<PartialLead[]> => {

    const mobileConstraint = onlyMobile ? "O telefone deve ser um número de celular." : "";
    const exclusionConstraint = existingNames.length > 0 ? `Não inclua as seguintes empresas que já foram encontradas: ${existingNames.join(', ')}.` : '';

    // Constructing the core instructions for the AI
    const systemInstruction = `Você é um assistente especializado em encontrar leads B2B. Sua tarefa é buscar empresas reais.`;

    const taskPrompt = `Encontre até 5 empresas reais do segmento de '${segmento}' localizadas em ou perto de ${bairro}, ${cidade}. Para cada empresa, forneça o nome, telefone, website, endereço, a nota do Google (GMB), a quantidade de avaliações no Google e o perfil do Instagram (se disponível). ${mobileConstraint} ${exclusionConstraint} Formate a resposta estritamente como um array JSON com os campos: "name", "phone", "website", "address", "gmbRating", "gmbReviewCount", "instagramProfile". Se não encontrar um dado específico, retorne uma string vazia ou null para esse campo.`;

    try {
        // We pass empty history as this is a single-shot request
        const responseText = await sendMessageToProsperaAI(taskPrompt, [], systemInstruction);

        const businesses = extractJson(responseText);
        if (businesses.length === 0 && responseText) {
            console.warn("Prospera AI returned a non-JSON or empty response.");
        }

        // Note: The new proxy does not return grounding metadata (sources), so we return an empty array.
        const sources: Source[] = [];

        return businesses.map((biz: any) => ({
            id: `place_${Date.now()}_${Math.random()}`,
            name: biz.name,
            phone: biz.phone,
            website: biz.website || '',
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
        console.error("Error fetching businesses from Prospera API:", error);
        throw new Error("Falha ao buscar empresas. A API pode estar indisponível.");
    }
};

export const findInstagramProfile = async (companyName: string, companyWebsite?: string): Promise<string> => {
    const websiteInfo = companyWebsite ? `cujo site é '${companyWebsite}'` : '';
    const systemInstruction = "Você é um assistente especializado em encontrar informações de contato de empresas.";
    const taskPrompt = `Encontre a URL do perfil oficial do Instagram para a empresa chamada '${companyName}' ${websiteInfo}. Retorne apenas a URL completa (ex: https://www.instagram.com/nomedoperfil) e nada mais. Se não encontrar um perfil oficial com certeza, retorne 'N/A'.`;

    try {
        const responseText = await sendMessageToProsperaAI(taskPrompt, [], systemInstruction);
        const text = responseText.trim();

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
