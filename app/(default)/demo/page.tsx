import { TokyoReveal } from "@/components/tokyo-reveal/TokyoReveal";
import { ParallaxWing } from "@/components/parallax-wing/ParallaxWing";
import { SolarEclipse } from "@/components/solar-eclipse/SolarEclipse";
import { VisaCard } from "@/components/visa-card/VisaCard";
import { LoginSide } from "@/components/login-effect/LoginSide";

const components: {
  name: string;
  variant?: "default" | "centered";
  component: React.ReactNode;
}[] = [
  { name: "Parallax Wing", variant: "centered", component: <ParallaxWing /> },
  { name: "Visa Card", variant: "centered", component: <VisaCard /> },
  { name: "Login Side", variant: "centered", component: <LoginSide /> },
  { name: "Solar Eclipse", variant: "centered", component: <SolarEclipse /> },
  { name: "Tokyo Reveal", variant: "default", component: <TokyoReveal /> },
];

const Section = ({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "centered";
}) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#161618",
        ...(variant === "centered" && {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }),
      }}
    >
      {children}
    </div>
  );
};

export default function DemoPage() {
  return (
    <>
      {components.map((component, index) => (
        <Section key={index} variant={component.variant}>
          {component.component}
        </Section>
      ))}
    </>
  );
}
