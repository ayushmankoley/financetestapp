import { GoogleGenerativeAI } from '@google/generative-ai';
import type { NextApiRequest, NextApiResponse } from 'next';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });


interface GetDetails {
    optName: { name: string; percentage: number }[];
}
interface AllocationItem {
    name: string;
    percentage: number;
  }
  
  interface RequestBody {
    allocation: AllocationItem[];
  }

  function extractJSONFromText(text: string) {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      throw new Error(`Failed to parse JSON from response: ${(error as Error).message}`);
    }
  }


  const detailedOptions = async(allocation : any) => {
    const prompt = `Act as an expert Indian financial advisor and generate a detailed investment portfolio allocation plan. 
Return ONLY a JSON object (no other text) with the following structure: 
    
    where names(i.e. equity shares) are as given in ${allocation} array, 
    take each name from this array and only return as given format, keep 5-6 options for each name and corresponding weightages
    return the fixed format, with {name_in_allocation_array : [{name: Name,weight:Weight},{name: Name,weight:Weight},{name: Name,weight:Weight}]}`
    const result = await model.generateContent(prompt);
    console.log(result);
    const response = result.response;
    const responseText = response.text();
    
    const parsedResponse = extractJSONFromText(responseText);
    return parsedResponse;

  }


export default async function DetShow(req: NextApiRequest,
    res: NextApiResponse<GetDetails | { error: string; details?: string }>
){
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }
    try {
        const { allocation } = req.body as RequestBody;
        console.log(allocation);
        
        const response = await detailedOptions(allocation);
        return res.status(200).json(response);
    } catch (error: any) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
    
}