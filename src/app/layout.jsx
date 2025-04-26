import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { GameProvider } from "../context/GameContext";

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
            {children}
          </GameProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
