import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Breeze stock-funding App",
  description: "Stock funding made secure and easy with AI analytics ",
  icons: {
    icon: "https://webstockreview.net/images/air-clipart-air-movement-2.png",
  },
};

export default function RootLayout({ children }) {
  const isAuthPage = children.props?.childPropSegment === 'auth';

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://webstockreview.net/images/air-clipart-air-movement-2.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
