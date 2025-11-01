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
            <section id={id} className="relative min-h-dvh w-full grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 md:px-8">

                <div id={`${id}-left`} className="lg:pt-[200px]">

                    <Image
                        alt=""
                        src={image1}
                        width={1200}
                        height={1600}
                        className="w-full mx-auto lg:ml-0 lg:mr-auto object-cover h-[400px] md:h-auto border border-transparent hover:border-white hover:border-8 transition-all"
                    />

                    <Image
                        alt=""
                        src={image2}
                        width={800}
                        height={600}
                        className="w-full mt-8 mx-auto lg:ml-auto lg:mr-0 max-w-md h-[400px] object-cover border border-transparent hover:border-white hover:border-8 transition-all"
                    />
                </div>

                <div className="flex flex-col justify-center" id={`${id}-right`}>
                    {title}

                    {subtitle}

                    <Image
                        alt=""
                        src={image3}
                        width={800}
                        height={600}
                        className="w-full max-w-md mt-12 mx-auto lg:mx-0 h-[400px] object-cover border border-transparent hover:border-white hover:border-8 transition-all"
                    />

                    {description}
                </div>

            </section>
        </>
    );
}