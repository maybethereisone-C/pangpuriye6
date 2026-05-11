export const revalidate = 3600;

import { getSiteData } from "@/lib/api";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Members } from "@/components/sections/Members";
import { RedWall } from "@/components/sections/RedWall";
import { Gallery } from "@/components/sections/Gallery";
import { Recognition } from "@/components/sections/Recognition";
import { Clips } from "@/components/sections/Clips";
import { Others } from "@/components/sections/Others";
import { Footer } from "@/components/blocks/Footer";
import { MenuOverlay } from "@/components/blocks/MenuOverlay";
import { ProgressBar } from "@/components/motion/ProgressBar";
import { TopBar } from "@/components/blocks/TopBar";
import { Cursor } from "@/components/motion/Cursor";

export default async function Page() {
  const data = await getSiteData();

  return (
    <>
      <Cursor />
      <ProgressBar />
      <TopBar />
      <MenuOverlay footer={data.footer} />

      <Hero data={data.hero} />
      <About data={data.about} />
      <Members members={data.members} />
      <RedWall data={data.red_wall} />
      <Gallery items={data.gallery} />
      <Recognition data={data.recognition} />
      <Clips data={data.clips} />
      {data.others.enabled && <Others items={data.others.items} />}

      <Footer data={data.footer} />
    </>
  );
}
