import localFont from "next/font/local";

const satoshi = localFont({
  src: [
    { path: "../assets/fonts/Satoshi/Satoshi-Regular.woff2", weight: "400" },
    { path: "../assets/fonts/Satoshi/Satoshi-Medium.woff2", weight: "500" },
    { path: "../assets/fonts/Satoshi/Satoshi-Bold.woff2", weight: "700" },
    { path: "../assets/fonts/Satoshi/Satoshi-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-sans",
  display: "swap",
});

const cabinet = localFont({
  src: [
    { path: "../assets/fonts/Grotesk/CabinetGrotesk-Regular.woff2", weight: "400" },
    { path: "../assets/fonts/Grotesk/CabinetGrotesk-Medium.woff2", weight: "500" },
    { path: "../assets/fonts/Grotesk/CabinetGrotesk-Bold.woff2", weight: "700" },
  ],
  variable: "--font-serif",
  display: "swap",
});

export { satoshi, cabinet };
