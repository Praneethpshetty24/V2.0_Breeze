import { GoogleGenerativeAI } from '@google/generative-ai';

// Fallback API key - will be used if environment variable is not available
const FALLBACK_API_KEY = 'AIzaSyBZWB44vgirC9_eX4fH8W6upgOMR2Env9E';

// Maximum number of retries for API calls
const MAX_RETRIES = 3;
// Delay between retries (in milliseconds)
const RETRY_DELAY = 1000;

// Helper function to delay execution
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to get API key with fallback
const getApiKey = () => {
    const envApiKey = process.env.GEMINI_API_KEY;
    if (envApiKey && envApiKey.trim() !== '') {
        return envApiKey;
    }
    console.warn('GEMINI_API_KEY environment variable not found or empty, using fallback API key');
    return FALLBACK_API_KEY;
};

// Helper function to make API calls with retry logic
async function callGeminiWithRetry(prompt, retryCount = 0) {
    try {
        const apiKey = getApiKey();
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error(`Gemini API call failed (attempt ${retryCount + 1}/${MAX_RETRIES}):`, error.message);
        
        // Check if we should retry
        if (retryCount < MAX_RETRIES - 1) {
            console.log(`Retrying in ${RETRY_DELAY}ms...`);
            await sleep(RETRY_DELAY);
            return callGeminiWithRetry(prompt, retryCount + 1);
        }
        
        // If we've exhausted all retries, throw the error
        throw new Error(`Failed to call Gemini API after ${MAX_RETRIES} attempts: ${error.message}`);
    }
}

export async function POST(req) {
    try {
        // Check if request body exists
        if (!req) {
            throw new Error('Request body is missing');
        }

        // Parse request body and validate purchases data
        const body = await req.json();
        if (!body || !body.purchases || !Array.isArray(body.purchases)) {
            throw new Error('Invalid or missing purchases data');
        }

        const { purchases } = body;

        // Validate purchases array is not empty
        if (purchases.length === 0) {
            throw new Error('Purchases array is empty');
        }

        // Validate purchase objects have required fields
        purchases.forEach((purchase, index) => {
            if (!purchase.timestamp || !purchase.stockName || !purchase.price || !purchase.quantity || !purchase.totalAmount) {
                throw new Error(`Purchase at index ${index} is missing required fields`);
            }
        });

        // Format timestamps properly from Firestore
        const sortedPurchases = purchases.sort((a, b) => {
            const dateA = new Date(a.timestamp.seconds * 1000);
            const dateB = new Date(b.timestamp.seconds * 1000);
            return dateA - dateB;
        });

        // Prepare chart data with properly formatted dates
        const chartData = {
            labels: sortedPurchases.map(p => {
                return new Date(p.timestamp.seconds * 1000).toLocaleString("en-IN", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: 'Asia/Kolkata'
                });
            }),
            values: sortedPurchases.map(p => p.totalAmount)
        };

        // Enhanced purchase summary format with proper date formatting
        const purchasesSummary = purchases.map(p => {
            const date = new Date(p.timestamp.seconds * 1000).toLocaleString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                timeZone: 'Asia/Kolkata'
            });
            return `Stock: ${p.stockName}
Price: ₹${p.price.toFixed(2)}
Quantity: ${p.quantity}
Total: ₹${p.totalAmount.toFixed(2)}
Date: ${date}`;
        }).join('\n\n');

        const prompt = `Analyze these stock purchase records and provide a detailed summary in the following format:

         📊 Transaction Overview
        - Total number of transactions
        - Total value traded
        - Average transaction value

         🔍 Stock Analysis
        - Most frequently traded stocks
        - Highest value transactions
        - Price range analysis

        💡 Trading Patterns
        - Time-based patterns
        - Volume patterns
        - Notable insights

         🚀 Recommendations
        - Trading strategy suggestions
        - Risk management tips
        - Safety tips

        Here are the purchases:
        ${purchasesSummary}`;

        // Call Gemini API with retry logic
        console.log('Calling Gemini API for analysis...');
        const summary = await callGeminiWithRetry(prompt);
        console.log('Successfully received analysis from Gemini API');

        return new Response(JSON.stringify({
            success: true,
            summary,
            chartData
        }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Analysis error:', error.message);
        return new Response(JSON.stringify({
            success: false,
            error: error.message || 'Failed to analyze purchases'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
