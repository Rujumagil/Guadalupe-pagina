import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Podcast ETERNI" };
export default function PodcastPage() {
  return <ComingSoon title="Podcast ETERNI" description="Estamos organizando este espacio para que puedas encontrar de forma clara las conversaciones, reflexiones y próximas publicaciones de Guadalupe." />;
}
