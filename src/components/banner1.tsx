import Image, { type StaticImageData } from "next/image";

type banner1Props = {
  id: string;
  image: StaticImageData;
  text?: string;
  zIndex?: number;
}

export default function banner1({ id, image, text, zIndex = 1000 }: banner1Props) {
  return (
    <>
      <div className="h-dvh"></div>
      <section id={id} className="absolute inset-0 w-full h-dvh translate-y-[220dvh]" style={{ zIndex: 1100 }}>
        <Image src={image} alt="Rizes Banner" fill className="object-cover object-center" />

        <div className="absolute bottom-32 right-8 p-8 font-black text-4xl text-white max-w-md w-full">
          {text}
        </div>
      </section>
    </>
  )
}