import { About } from "@/components/sections/about";
import { Approach } from "@/components/sections/approach";
import { Capabilities } from "@/components/sections/capabilities";
import { Contact } from "@/components/sections/contact";
import { Engineering } from "@/components/sections/engineering";
import { FeaturedWork } from "@/components/sections/featured-work";
import { Hero } from "@/components/sections/hero";
import { Tech } from "@/components/sections/tech";
import { Marquee } from "@/components/ui/marquee";
import { marqueeItems } from "@/data/site";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedWork />
      <Marquee items={marqueeItems} />
      <Approach />
      <Capabilities />
      <About />
      <Tech />
      <Engineering />
      <Contact />
    </>
  );
}
