import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
    try {
        
        let purchases;
        try {
            const body = await req.json();
            purchases = body.purchases;
            
            if (!purchases || !Array.isArray(purchases) || purchases.length === 0) {
                return new Response(JSON.stringify({
                    success: false,
                    error: 'No valid purchase data provided'
                }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        } catch (parseError) {
            console.error('Error parsing request body:', parseError);
            return new Response(JSON.stringify({
                success: false,
                error: 'Invalid request format'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        
        const sortedPurchases = purchases.sort((a, b) => {
            try {
                let dateA, dateB;
                
                // Handle Firestore timestamp objects
                if (a.timestamp?.seconds) {
                    dateA = new Date(a.timestamp.seconds * 1000);
                } 
                // Handle ISO string timestamps
                else if (typeof a.timestamp === 'string') {
                    dateA = new Date(a.timestamp);
                } 
                // Handle timestamp as number
                else if (typeof a.timestamp === 'number') {
                    dateA = new Date(a.timestamp);
                } else {
                    dateA = new Date(0); // Default to epoch if invalid
                }
                
                if (b.timestamp?.seconds) {
                    dateB = new Date(b.timestamp.seconds * 1000);
                } else if (typeof b.timestamp === 'string') {
                    dateB = new Date(b.timestamp);
                } else if (typeof b.timestamp === 'number') {
                    dateB = new Date(b.timestamp);
                } else {
                    dateB = new Date(0);
                }
                
                return dateA - dateB;
            } catch (err) {
                console.error('Error sorting timestamps:', err);
                return 0; // Keep original order if comparison fails
            }
        });

        // Safely prepare chart data
        const chartData = {
            labels: [],
            values: []
        };
        
        try {
            chartData.labels = sortedPurchases.map(p => {
                try {
                    let date;
                    if (p.timestamp?.seconds) {
                        date = new Date(p.timestamp.seconds * 1000);
                    } else if (typeof p.timestamp === 'string') {
                        date = new Date(p.timestamp);
                    } else if (typeof p.timestamp === 'number') {
                        date = new Date(p.timestamp);
                    } else {
                        return 'Unknown Date';
                    }
                    
                    return date.toLocaleString("en-IN", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        timeZone: 'Asia/Kolkata'
                    });
                } catch (err) {
                    console.error('Error formatting date for chart label:', err);
                    return 'Invalid Date';
                }
            });
            
            chartData.values = sortedPurchases.map(p => {
                // Ensure totalAmount is a valid number
                const amount = parseFloat(p.totalAmount);
                return isNaN(amount) ? 0 : amount;
            });
        } catch (chartError) {
            console.error('Error preparing chart data:', chartError);
            // Continue with analysis even if chart data fails
        }

        // Safely prepare purchase summary
        let purchasesSummary = '';
        try {
            purchasesSummary = purchases.map(p => {
                try {
                    let dateStr = 'Unknown Date';
                    
                    if (p.timestamp) {
                        let date;
                        if (p.timestamp.seconds) {
                            date = new Date(p.timestamp.seconds * 1000);
                        } else if (typeof p.timestamp === 'string') {
                            date = new Date(p.timestamp);
                        } else if (typeof p.timestamp === 'number') {
                            date = new Date(p.timestamp);
                        }
                        
                        if (date && !isNaN(date.getTime())) {
                            dateStr = date.toLocaleString("en-IN", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                                timeZone: 'Asia/Kolkata'
                            });
                        }
                    }
                    
                    const price = parseFloat(p.price) || 0;
                    const quantity = parseInt(p.quantity) || 0;
                    const totalAmount = parseFloat(p.totalAmount) || 0;
                    
                    return `Stock: ${p.stockName || 'Unknown Stock'}
Price: ₹${price.toFixed(2)}
Quantity: ${quantity}
Total: ₹${totalAmount.toFixed(2)}
Date: ${dateStr}`;
                } catch (err) {
                    console.error('Error formatting purchase summary item:', err);
                    return 'Error processing purchase data';
                }
            }).join('\n\n');
        } catch (summaryError) {
            console.error('Error preparing purchase summary:', summaryError);
            purchasesSummary = 'Error processing purchase data for summary';
        }

        // Prepare prompt for Gemini API
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

        // Check if API key is available
        if (!process.env.GEMINI_API_KEY) {
            console.error('Missing Gemini API key');
            return new Response(JSON.stringify({
                success: false,
                error: 'API configuration error'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Call Gemini API with proper error handling
        let summary = '';
        try {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            summary = response.text();
            
            if (!summary || summary.trim() === '') {
                throw new Error('Empty response from Gemini API');
            }
        } catch (aiError) {
            console.error('Gemini API error:', aiError);
            
            // Provide a fallback summary if AI fails
            summary = `## 📊 Transaction Overview
- Total number of transactions: ${purchases.length}
- Total value traded: ₹${purchases.reduce((sum, p) => sum + (parseFloat(p.totalAmount) || 0), 0).toFixed(2)}
- Average transaction value: ₹${(purchases.reduce((sum, p) => sum + (parseFloat(p.totalAmount) || 0), 0) / purchases.length).toFixed(2)}

## 🔍 Stock Analysis
- Analysis could not be generated at this time.

## 💡 Trading Patterns
- Analysis could not be generated at this time.

## 🚀 Recommendations
- Consider reviewing your purchase history manually.
- Contact support if you need detailed analysis.`;
        }

        return new Response(JSON.stringify({
            success: true,
            summary,
            chartData
        }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Analysis error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Failed to analyze purchases. Please try again later.'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
