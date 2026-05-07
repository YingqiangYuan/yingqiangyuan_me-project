import Navigation from "@/app/_components/layouts/Navigation";
import CircuitBackground from "@/app/_components/common/CircuitBackground";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen text-foam">
      <CircuitBackground />
      <Navigation />
      <div className="pt-16">{children}</div>
    </div>
  );
}
