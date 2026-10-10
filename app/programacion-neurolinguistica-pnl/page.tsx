import type { Metadata } from "next";
import { ServiceDetail } from "@/components/ServiceDetail";
import { serviceDetails } from "@/content/services";

export const metadata: Metadata = { title: "Programación Neurolingüística (PNL)" };
export default function Page() { return <ServiceDetail detail={serviceDetails["programacion-neurolinguistica-pnl"]} />; }
