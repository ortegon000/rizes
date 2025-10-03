import Image, { type StaticImageData } from "next/image";

type banner1Props = {
  id: string;
  image: StaticImageData;
  text?: string;
}

export default function banner1({ id, image, text }: banner1Props) {
  return (
    <>
      <section id={id} className="relative w-full min-h-dvh">
        <Image id={`${id}-image`} src={image} alt="Rizes Banner" fill className="object-cover object-center" priority />

        <div className="absolute bottom-12 md:bottom-32 right-0 md:right-8 p-8 font-black text-2xl md:text-4xl text-white max-w-md w-full">
          {text}
        </div>
      </section>
    </>
  )
}