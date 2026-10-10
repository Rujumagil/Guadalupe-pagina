import type { Metadata } from "next";
import { ServiceDetail } from "@/components/ServiceDetail";
import { serviceDetails } from "@/content/services";

export const metadata: Metadata = { title: "Liderazgo y desarrollo profesional" };
export default function Page() { return <ServiceDetail detail={serviceDetails["liderazgo-desarrollo-profesional"]} />; }
