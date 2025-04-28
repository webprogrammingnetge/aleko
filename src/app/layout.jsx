import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { GameProvider } from "../context/GameContext";
import DetectIncognito from "../components/DetectIncognito";
import Header from "../components/Layout/Header";

export const metadata = {
  title: "ბურთების თამაში",
  description: "მულტიფლეიერი ვებში თამაში",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ka">
      <body>
        <AuthProvider>
          <GameProvider>
            <DetectIncognito />
            <Header />  {/* საიტის თავში მენიუ */}
            {children}
          </GameProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
