// File: pages/api/generate-plan.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { NextApiRequest, NextApiResponse } from 'next';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

interface GeneratePlanRequest {
  initialAmount: string;
  goalAmount: string;
  goalName: string;
  timePeriod: string;
  riskTolerance: number;
  diversificationPreference?: string;
  monthlyContribution?: string;
}

interface GeneratePlanResponse {
  allocation: Array<{
    name: string;
    percentage: number;
  }>;
  explanation: string;
}

function extractJSONFromText(text: string): any {
  // Try to find JSON content between curly braces
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in response');
  }
  
  try {
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    throw new Error('Failed to parse JSON from response');
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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
      monthlyContribution
    } = req.body as GeneratePlanRequest;

    // Construct prompt for Gemini API
    const prompt = `Act as a financial advisor and generate an investment portfolio allocation plan. 
    Return ONLY a JSON object (no other text) with the following structure:
    {
      "allocation": [
        {"name": "Asset Class Name", "percentage": numeric_value}
      ],
      "explanation": "Brief explanation of the allocation strategy"
    }

    Consider these parameters:
    - Initial Investment: $${initialAmount}
    - Target Goal: $${goalAmount}
    - Goal Name: ${goalName}
    - Time Period: ${timePeriod} years
    - Risk Tolerance: ${riskTolerance}% (0 = Conservative, 100 = Aggressive)
    ${monthlyContribution ? `- Monthly Contribution: $${monthlyContribution}` : ''}
    ${diversificationPreference ? `- Special Requirements: ${diversificationPreference}` : ''}

    Important:
    1. Return ONLY the JSON object, no markdown formatting or backticks
    2. Ensure percentages sum to 100
    3. Use real asset class names (e.g., "US Large Cap Stocks", "Government Bonds")
    4. This response should be for Indian customers/market
    5, I also want specific Assets names like sensex or tat mutual funds instead of vague terms like Mid cap, Large cap etc.
    5. Percentages should be numbers, not strings`;

    // Call Gemini API
    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();
    
    // Extract and parse JSON from response
    let parsedResponse = extractJSONFromText(responseText);

    // Validate the response structure
    if (!parsedResponse.allocation || !Array.isArray(parsedResponse.allocation)) {
      throw new Error('Invalid response format from AI model');
    }

    // Ensure percentages sum to 100%
    const total = parsedResponse.allocation.reduce(
      (sum: number, item: { percentage: number }) => sum + item.percentage, 
      0
    );
    
    if (Math.abs(total - 100) > 0.1) { // Allow for small floating-point differences
      parsedResponse.allocation = parsedResponse.allocation.map(
        (item: { name: string; percentage: number }) => ({
          ...item,
          percentage: (item.percentage / total) * 100
        })
      );
    }

    // Round percentages to 1 decimal place
    parsedResponse.allocation = parsedResponse.allocation.map(
      (item: { name: string; percentage: number }) => ({
        ...item,
        percentage: Math.round(item.percentage * 10) / 10
      })
    );

    return res.status(200).json(parsedResponse);

  } catch (error) {
    console.error('Error generating investment plan:', error);
    return res.status(500).json({
      error: 'Failed to generate investment plan',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
}