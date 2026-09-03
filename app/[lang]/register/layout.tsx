import Scanner from "@/components/Scanner";
import type { Metadata } from "next";
import Image from "next/image";
import RegistrationContainer from "./_features/RegistartionConatiner";

export const metadata: Metadata = {
  title: "Registration",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex w-full h-screen overflow-hidden bg-gradient-registration justify-center lg:justify-end">
      <div className="absolute left-0 bottom-0 top-0 z-0 lg:w-1/2 hidden lg:block">
        <Scanner
          color1="#678dce"
          color2="#6094e9"
          color3="#FFFFFF"
          speed={0.35}
          sweepSpeed={0.25}
          sweepWidth={1.6}
          sweepFalloff={6}
          scale={1.5}
          frequency={2}
          ripple={0.32}
          bandDensity={11}
          lineSharpness={5.5}
          glow={0.22}
          scanDirection="horizontal"
          colorSpread={0.2}
          brightness={0.9}
          contrast={1.15}
          softness={1.4}
          vignette={0.45}
          scanline
          grain
          grainIntensity={0.05}
          opacity={1}
          mouseInteraction
          mouseRadius={0.5}
          mouseStrength={0.5}
        />
      </div>
      <a
        href="https://oguzforum.com"
        target="_blank"
        className="absolute left-10 top-10 z-40 hidden flex-col gap-3 text-white lg:flex"
      >
        <Image
          src="/logoOguz.svg"
          alt="logo"
          width={220}
          height={80}
          style={{ width: "auto", height: "auto" }}
          className="brightness-0 invert object-contain"
          priority
        />
      </a>

      <RegistrationContainer>{children}</RegistrationContainer>
    </main>
  );
}
