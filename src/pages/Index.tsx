import { FullscreenSlotMachine } from "@/components/FullscreenSlotMachine";
import { SpriteSystem } from "@/components/SpriteSystem";
import { ParticleBackground } from "@/components/ParticleBackground";

export default function Index() {
  return (
    <SpriteSystem>
      <ParticleBackground>
        <FullscreenSlotMachine />
      </ParticleBackground>
    </SpriteSystem>
  );
}