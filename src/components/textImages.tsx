import Image, { type StaticImageData } from "next/image";
import { type ReactNode } from "react";

type TextImagesProps = {
    id: string;
    title: ReactNode;
    subtitle: ReactNode;
    image1: StaticImageData;
    image2: StaticImageData;
    image3: StaticImageData;
}

export default function TextImages({ id, title, subtitle, image1, image2, image3 }: TextImagesProps) {
    return (
        <>
            {/* <div className="h-[100dvh]"></div> */}
            <section id={id} className="relative min-h-dvh w-full grid grid-cols-2 gap-8">

                <div className="">

                    {title}

                    {subtitle}

                    <Image
                        alt=""
                        src={image1}
                        width={500}
                        height={500}
                        className="w-full max-w-md mt-12 mr-0 ml-auto h-[400px] object-cover border border-transparent hover:border-white hover:border-8 transition-all"
                    />
                </div>

                <div className="" id={`${id}-right`}>

                    <Image
                        alt=""
                        src={image2}
                        width={500}
                        height={500}
                        className="w-full ml-0 mt-[200px] mr-auto h-[600px] object-cover border border-transparent hover:border-white hover:border-8 transition-all"
                    />
                    <Image
                        alt=""
                        src={image3}
                        width={500}
                        height={500}
                        className="w-full mt-8 max-w-md h-[400px] object-cover border border-transparent hover:border-white hover:border-8 transition-all"
                    />

                </div>

            </section>
        </>
    );
}