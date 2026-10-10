import type { Metadata } from "next";
import { ServiceDetail } from "@/components/ServiceDetail";
import { serviceDetails } from "@/content/services";

export const metadata: Metadata = { title: "Cursos, talleres y conferencias" };
export default function Page() { return <ServiceDetail detail={serviceDetails["cursos-talleres-conferencias"]} />; }
