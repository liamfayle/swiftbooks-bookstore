import { createTheme } from "@mantine/core";

import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const playFairDisplay = Playfair_Display({ subsets: ["latin"], display: "swap" });

export const theme = createTheme({
  primaryColor: "teal",
  primaryShade: 7,
  fontFamily: inter.style.fontFamily,
  headings: { fontFamily: playFairDisplay.style.fontFamily },
});
