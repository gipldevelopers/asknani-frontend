import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

// Import Poppins
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // pick what you need
});

export const metadata = {
  title: "Day Care Marketplace",
  description: "A marketplace for daycare services",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <Toaster />
        <main>{children}</main>
      </body>
    </html>
  );
}
