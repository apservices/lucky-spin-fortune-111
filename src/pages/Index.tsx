import { Premium3DSlotMachine } from "@/components/Premium3DSlotMachine";
import { SpriteSystem } from "@/components/SpriteSystem";

export default function Index() {
  return (
    <SpriteSystem>
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
        <Premium3DSlotMachine />
      </div>
    </SpriteSystem>
  );
}