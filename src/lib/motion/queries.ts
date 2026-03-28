import { GSAP_MEDIA } from "@/lib/gsapDiscipline";

export const MOTION_QUERIES = {
  desktop: "(min-width: 1024px)",
  mobile: "(max-width: 1023px)",
  reducedMotion: GSAP_MEDIA.motionReduce,
  motionOk: GSAP_MEDIA.motionOk,
  desktopMotionOk: `(min-width: 1024px) and ${GSAP_MEDIA.motionOk}`,
  mobileMotionOk: `(max-width: 1023px) and ${GSAP_MEDIA.motionOk}`,
} as const;
