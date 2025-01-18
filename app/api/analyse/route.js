import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
    try {
        const { purchases } = await req.json();

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

        ### 📊 Transaction Overview
        - Total number of transactions
        - Total value traded
        - Average transaction value

        ### 🔍 Stock Analysis
        - Most frequently traded stocks
        - Highest value transactions
        - Price range analysis

        ### 💡 Trading Patterns
        - Time-based patterns
        - Volume patterns
        - Notable insights

        ### 🚀 Recommendations
        - Trading strategy suggestions
        - Risk management tips
        - System improvements

        Here are the purchases:
        ${purchasesSummary}`;

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();

        return NextResponse.json({
            success: true,
            summary,
            chartData
        });
    } catch (error) {
        console.error('Analysis error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to analyze purchases'
        }, { status: 500 });
    }
}
