"use client";

import dynamic from "next/dynamic";
import type { Project } from "@/content/projects";

const WorkShowcase3D = dynamic(
  () => import("@/components/work/WorkShowcase3D").then((m) => m.default),
  { ssr: false }
);

type Props = { projects: Project[]; embeddedFeatured?: boolean };

export default function WorkShowcase3DLoader({ projects, embeddedFeatured }: Props) {
  return <WorkShowcase3D projects={projects} embeddedFeatured={embeddedFeatured} />;
}
