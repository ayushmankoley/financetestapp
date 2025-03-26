import { GoogleGenerativeAI } from '@google/generative-ai';
import type { NextApiRequest, NextApiResponse } from 'next';

const genAI = new GoogleGenerativeAI(process.env.NEXT_GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

interface GeneratePlanRequest {
  initialAmount: string;
  goalAmount: string;
  goalName: string;
  timePeriod: string;
  riskTolerance: string;
  diversificationPreference?: string;
  monthlyContribution?: string;
  rebalancingFrequency?: string;
  investmentStyle?: string;
  taxOptimization?: string;
  cryptoPreference?: string;
}

interface AIResponse {
  allocation: Array<{
    name: string;
    percentage: number;
  }>;
  explanation: string;
}

function extractJSONFromText(text: string): AIResponse {
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AIResponse | { error: string; details?: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      initialAmount,
      goalAmount,
      goalName,
      timePeriod,
      riskTolerance,
      diversificationPreference,
      monthlyContribution,
      rebalancingFrequency,  
      investmentStyle,       
      taxOptimization,       
      cryptoPreference          
    } = req.body as GeneratePlanRequest;
    

    const prompt = `Act as an expert Indian financial advisor and generate a detailed investment portfolio allocation plan. 
Return ONLY a JSON object (no other text) with the following structure:
{
  "allocation": [
    {"name": "Asset Name", "percentage": numeric_value}
  ],
  "explanation": "Detailed explanation of the allocation strategy with proper reasoning"
}

Consider these parameters:
- Initial Investment: ₹${initialAmount}
- Target Goal: ₹${goalAmount}
- Goal Name: ${goalName}
- Time Period: ${timePeriod} years
- Risk Tolerance: ${riskTolerance.charAt(0).toUpperCase() + riskTolerance.slice(1)} (Low/Medium/High)
${monthlyContribution ? `- Monthly Contribution: ₹${monthlyContribution}` : ''}
${diversificationPreference ? `- Investment Preferences: ${diversificationPreference}` : ''}
${rebalancingFrequency ? `- Rebalancing Frequency: ${rebalancingFrequency}` : ''}
${investmentStyle ? `- Investment Fund Style: ${investmentStyle}` : ''}
${taxOptimization ? `- Tax Optimization: ${taxOptimization}` : ''}
${cryptoPreference ? `- Crypto Preference: ${cryptoPreference}` : ''}

Requirements:
1. Return ONLY valid JSON, no additional text or formatting
2. Total allocation must sum to exactly 100%
3. Use SPECIFIC Indian mutual funds and ETFs, for example:
   - "Equity Shares - Tata Mutual Fund - Large Cap"
   - "Debt Funds - HDFC Corporate Bond Fund"
   - "Gold - Sovereign Gold Bond"
4. Include a mix of:
   - Equity mutual funds (large, mid, small cap)
   - Debt instruments
   - Gold or commodity funds
   - one Crypto coin if selected YES in form (eg: BTC for low risk, SOL/ETH for medium risk, SUI/HYPE/APT/POL/JUP etc for high risk) 
5. Consider current Indian market conditions
6. Generate a max of 5 asset classes with a minimum of 4
7. Explanation should include rationale for allocation point wise based on time horizon and risk profile and not have any * and instead - and dont try bold the text with ** and add paragraphs if necesary be as much detailed as possible
8. If the user asks for unrealistic return expectations, provide a warning in the explanation
8. All percentages should be numbers (not strings) rounded to one decimal place`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();
    
    const parsedResponse = extractJSONFromText(responseText);

    if (!parsedResponse.allocation || !Array.isArray(parsedResponse.allocation)) {
      throw new Error('Invalid response format from AI model');
    }

    const total = parsedResponse.allocation.reduce(
      (sum: number, item: { percentage: number }) => sum + item.percentage, 
      0
    );
    
    if (Math.abs(total - 100) > 0.1) { 
      parsedResponse.allocation = parsedResponse.allocation.map(
        (item: { name: string; percentage: number }) => ({
          ...item,
          percentage: (item.percentage / total) * 100
        })
      );
    }

    parsedResponse.allocation = parsedResponse.allocation.map(
      (item: { name: string; percentage: number }) => ({
        ...item,
        percentage: Math.round(item.percentage * 10) / 10
      })
    );

    return res.status(200).json(parsedResponse);

  } catch (error) {
    console.error('Error generating investment plan, Please Try Again!', error);
    return res.status(500).json({
      error: 'Failed to generate investment plan, Please Try Again!',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
}
