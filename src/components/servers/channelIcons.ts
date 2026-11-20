import { Clapperboard, Hash, Megaphone, Mic, Star, type LucideIcon } from "lucide-react";
import type { Channel } from "@/lib/mock-data";

/** One line icon per channel type, shared by the server view and the landing preview. */
export const CHANNEL_ICONS: Record<Channel["type"], LucideIcon> = {
  announcement: Megaphone,
  featured: Star,
  text: Hash,
  voice: Mic,
  clips: Clapperboard,
};
