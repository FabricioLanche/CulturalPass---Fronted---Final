import { Bebas_Neue, Inter } from "next/font/google";

export const interFont = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const bebasFont = Bebas_Neue({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-bebas",
});