import Navigation from "@/app/_components/layouts/Navigation"
import CircuitBackground from "@/app/_components/common/CircuitBackground"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <CircuitBackground />
      <Navigation />
      {children}
    </>
  )
}
