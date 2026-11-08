import { DM_Sans, Inter, Noto_Sans_Armenian } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm-sans",
  display: "swap",
});

const notoSansArmenian = Noto_Sans_Armenian({
  subsets: ["armenian"],
  variable: "--font-noto-sans-armenian",
  display: "swap",
});

const inter = Inter({
  subsets: ["cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const fontVariables = [
  dmSans.variable,
  notoSansArmenian.variable,
  inter.variable,
].join(" ");
