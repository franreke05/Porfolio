import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { HeroCopy, ShowroomSections } from "@/components/showroom/semantic";
import { ShowroomExperience } from "@/components/showroom/showroom-experience";
import { buildMetadata, homeJsonLd } from "@/lib/seo";

const HOME_TITLE = "ORYKAI SOFTWARE | Productos digitales que dejan huella";
const HOME_DESCRIPTION =
  "ORYKAI SOFTWARE diseña y desarrolla software real para personas y empresas: posicionamiento y creación de páginas webs, automatizaciones con IA y apps personalizadas.";

export const metadata: Metadata = buildMetadata({
  title: HOME_TITLE,
  absoluteTitle: true,
  description: HOME_DESCRIPTION,
  path: "/",
});

/**
 * The home is one place: the ORYKAI showroom. The copy below is rendered on
 * the server as ordinary HTML; the 3D scene is a client island that stages it.
 */
export default function Home() {
  return (
    <>
      <JsonLd schemas={homeJsonLd} />
      <ShowroomExperience hero={<HeroCopy />} sections={<ShowroomSections />} />
    </>
  );
}
