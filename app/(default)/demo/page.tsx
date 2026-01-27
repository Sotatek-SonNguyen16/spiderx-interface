import { SolarEclipse } from "@/components/solar-eclipse/SolarEclipse";
import { LoginSide } from "@/components/login-effect/LoginSide";
import { VisaCard } from "@/components/visa-card/VisaCard";
import { ParallaxWing } from "@/components/parallax-wing/ParallaxWing";
import { GlowMobile } from "@/components/glow-mobile/GlowMobile";

const components = [
  { name: "Solar Eclipse", component: <SolarEclipse /> },
  { name: "Login Side", component: <LoginSide /> },
  { name: "Visa Card", component: <VisaCard /> },
  { name: "Parallax Wing", component: <ParallaxWing /> },
  // { name: "Glow Mobile", component: <GlowMobile /> },
];

const Section = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#161618",
        overflow: "hidden",
        gap: "40px",
        flexWrap: "wrap",
        padding: "40px",
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
        <Section key={index}>{component.component}</Section>
      ))}
    </>
  );
}
