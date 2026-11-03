import Image from "next/image";
import Head from "next/head";
import HeroKeyBackground from "@images/hero-key-background.webp";

type HeroProps = {
  zIndex?: number;
};

export default function Hero({ zIndex = 20 }: HeroProps) {
  return (
    <>
      <Head>
        {/* Preload mask so first paint does not flash unmasked */}
        <link rel="preload" as="image" href="/images/logo-mask.svg" type="image/svg+xml" />
      </Head>
      <section
        id="hero-key-container"
        className="fixed inset-0 md:h-dvh w-full"
        style={{ zIndex }}
      >
        <div
          id="hero-key-logo-mask"
          className="w-full h-full bg-[#1d1b22] overflow-hidden"
        >
          <picture
            id="hero-key"
            className="relative h-full w-full block scale-150 sm:scale-125 overflow-hidden"
          >
            <Image
              alt=""
              id="hero-key-background"
              src={HeroKeyBackground.src}
              fill
              className="object-cover"
              priority
            />
          </picture>
        </div>
      </section>
    </>
  );
}