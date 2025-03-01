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

        console.log('Received purchases data:', JSON.stringify(purchases));

        // Process purchases without strict validation
        // Just ensure each purchase has at least some data we can work with
        const processedPurchases = purchases.map((purchase, index) => {
            // Create a sanitized version of the purchase with default values
            return {
                stockName: purchase.stockName || `Stock ${index + 1}`,
                price: typeof purchase.price === 'number' ? purchase.price : 0,
                quantity: typeof purchase.quantity === 'number' ? purchase.quantity : 0,
                totalAmount: typeof purchase.totalAmount === 'number' ? purchase.totalAmount : 0,
                // Create a default timestamp if missing
                timestamp: purchase.timestamp || new Date()
            };
        });

        // Sort purchases by timestamp (with flexible handling)
        const sortedPurchases = processedPurchases.sort((a, b) => {
            let dateA, dateB;
            
            try {
                if (a.timestamp && a.timestamp.seconds) {
                    dateA = new Date(a.timestamp.seconds * 1000);
                } else if (a.timestamp && a.timestamp.toDate) {
                    dateA = a.timestamp.toDate();
                } else if (a.timestamp instanceof Date) {
                    dateA = a.timestamp;
                } else {
                    dateA = new Date();
                }
            } catch (e) {
                console.log('Error parsing timestamp A:', e);
                dateA = new Date();
            }
            
            try {
                if (b.timestamp && b.timestamp.seconds) {
                    dateB = new Date(b.timestamp.seconds * 1000);
                } else if (b.timestamp && b.timestamp.toDate) {
                    dateB = b.timestamp.toDate();
                } else if (b.timestamp instanceof Date) {
                    dateB = b.timestamp;
                } else {
                    dateB = new Date();
                }
            } catch (e) {
                console.log('Error parsing timestamp B:', e);
                dateB = new Date();
            }
            
            return dateA - dateB;
        });

        // Prepare chart data with safely formatted dates
        const chartData = {
            labels: sortedPurchases.map((p, index) => {
                let dateStr;
                try {
                    let date;
                    if (p.timestamp && p.timestamp.seconds) {
                        date = new Date(p.timestamp.seconds * 1000);
                    } else if (p.timestamp && p.timestamp.toDate) {
                        date = p.timestamp.toDate();
                    } else if (p.timestamp instanceof Date) {
                        date = p.timestamp;
                    } else {
                        date = new Date();
                    }
                    
                    dateStr = date.toLocaleString("en-IN", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        timeZone: 'Asia/Kolkata'
                    });
                } catch (e) {
                    console.log(`Error formatting chart label for index ${index}:`, e);
                    dateStr = `Purchase ${index + 1}`;
                }
                return dateStr;
            }),
            values: sortedPurchases.map(p => p.totalAmount)
        };

        // Enhanced purchase summary format with safely formatted dates
        const purchasesSummary = sortedPurchases.map((p, index) => {
            let formattedDate;
            try {
                let date;
                if (p.timestamp && p.timestamp.seconds) {
                    date = new Date(p.timestamp.seconds * 1000);
                } else if (p.timestamp && p.timestamp.toDate) {
                    date = p.timestamp.toDate();
                } else if (p.timestamp instanceof Date) {
                    date = p.timestamp;
                } else {
                    date = new Date();
                }
                
                formattedDate = date.toLocaleString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: 'Asia/Kolkata'
                });
            } catch (e) {
                console.log(`Error formatting summary date for index ${index}:`, e);
                formattedDate = "Unknown date";
            }
            
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
