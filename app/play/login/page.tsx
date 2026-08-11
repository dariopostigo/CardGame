import type { Metadata } from "next";
import LoginForm from "@/components/game/login/LoginForm";

export const metadata: Metadata = {
  title: "CardGame",
};

export default function LoginPage() {
  return (
    <div className="game-screen">
      <LoginForm />
    </div>
  );
}
