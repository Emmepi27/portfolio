"use client";

import dynamic from "next/dynamic";
import type { Project } from "@/content/projects";

const WorkShowcase3D = dynamic(
  () => import("@/components/work/WorkShowcase3D").then((m) => m.default),
  { ssr: false }
);

type Props = { projects: Project[] };

export default function WorkShowcase3DLoader({ projects }: Props) {
  return <WorkShowcase3D projects={projects} />;
}
