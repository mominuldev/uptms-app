import { Nunito, Nunito_Sans, Source_Serif_4 } from "next/font/google";

/*
 * The three Figma families (Version C), self-hosted by next/font so the
 * browser never contacts Google. Variables are mapped to Tailwind font
 * utilities in globals.css: font-serif, font-display, font-sans.
 */
export const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  style: ["normal", "italic"],
  // Optical sizing: display sizes get the finer, narrower cut Figma renders.
  axes: ["opsz"],
  variable: "--font-source-serif",
  display: "swap",
});

export const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  display: "swap",
});

export const fontVariables = `${sourceSerif.variable} ${nunito.variable} ${nunitoSans.variable}`;
