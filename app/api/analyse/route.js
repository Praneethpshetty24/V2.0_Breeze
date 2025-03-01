import { GoogleGenerativeAI } from '@google/generative-ai';

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

        // Validate and sanitize purchase objects
        const validPurchases = purchases.filter(purchase => {
            // Check if purchase has all required fields
            return purchase && 
                   purchase.stockName && 
                   typeof purchase.price === 'number' && 
                   typeof purchase.quantity === 'number' && 
                   typeof purchase.totalAmount === 'number' &&
                   purchase.timestamp; // Just check if timestamp exists
        });

        if (validPurchases.length === 0) {
            throw new Error('No valid purchases found after filtering');
        }

        // Format timestamps properly from Firestore
        const sortedPurchases = validPurchases.sort((a, b) => {
            // Handle different timestamp formats
            const getTimestamp = (timestamp) => {
                if (timestamp.seconds) {
                    return new Date(timestamp.seconds * 1000);
                } else if (timestamp.toDate) {
                    return timestamp.toDate();
                } else if (timestamp instanceof Date) {
                    return timestamp;
                } else {
                    return new Date(timestamp);
                }
            };
            
            const dateA = getTimestamp(a.timestamp);
            const dateB = getTimestamp(b.timestamp);
            return dateA - dateB;
        });

        // Prepare chart data with properly formatted dates
        const chartData = {
            labels: sortedPurchases.map(p => {
                // Handle different timestamp formats
                let date;
                if (p.timestamp.seconds) {
                    date = new Date(p.timestamp.seconds * 1000);
                } else if (p.timestamp.toDate) {
                    date = p.timestamp.toDate();
                } else if (p.timestamp instanceof Date) {
                    date = p.timestamp;
                } else {
                    date = new Date(p.timestamp);
                }
                
                return date.toLocaleString("en-IN", {
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
        const purchasesSummary = sortedPurchases.map(p => {
            // Handle different timestamp formats
            let date;
            if (p.timestamp.seconds) {
                date = new Date(p.timestamp.seconds * 1000);
            } else if (p.timestamp.toDate) {
                date = p.timestamp.toDate();
            } else if (p.timestamp instanceof Date) {
                date = p.timestamp;
            } else {
                date = new Date(p.timestamp);
            }
            
            const formattedDate = date.toLocaleString("en-IN", {
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
Date: ${formattedDate}`;
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

        // Validate API key exists
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not configured');
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro"  });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();

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
