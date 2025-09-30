import Image, { type StaticImageData } from "next/image";
import { type ReactNode } from "react";

type TextImagesProps = {
    id: string;
    title: ReactNode;
    subtitle: ReactNode;
    description: ReactNode;
    image1: StaticImageData;
    image2: StaticImageData;
    image3: StaticImageData;
}

export default function TextImages2({ id, title, subtitle, description, image1, image2, image3 }: TextImagesProps) {
    return (
        <>
            <section id={id} className="relative min-h-dvh w-full grid grid-cols-2 gap-8">

                <div id={`${id}-left`} className="">

                    <Image
                        alt=""
                        src={image1}
                        width={500}
                        height={500}
                        className="w-full ml-0 mt-[200px] mr-auto object-cover border border-transparent hover:border-white hover:border-8 transition-all"
                    />

                    <Image
                        alt=""
                        src={image2}
                        width={500}
                        height={500}
                        className="w-full mt-8 ml-auto mr-0 max-w-md h-[400px] object-cover border border-transparent hover:border-white hover:border-8 transition-all"
                    />
                </div>

                <div className="" id={`${id}-right`}>
                    {title}

                    {subtitle}

                    <Image
                        alt=""
                        src={image3}
                        width={500}
                        height={500}
                        className="w-full max-w-md mt-12 h-[400px] object-cover border border-transparent hover:border-white hover:border-8 transition-all"
                    />

                    {description}
                </div>

            </section>
        </>
    );
}