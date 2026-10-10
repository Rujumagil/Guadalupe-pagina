import type { Metadata } from "next";
import { ServiceDetail } from "@/components/ServiceDetail";
import { serviceDetails } from "@/content/services";

export const metadata: Metadata = { title: "Coaching personal" };
export default function Page() { return <ServiceDetail detail={serviceDetails["coaching-personal"]} />; }
