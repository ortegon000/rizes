import Image, { type StaticImageData } from "next/image";
import { type ReactNode } from "react";

type TextImagesProps = {
    id: string;
    title: ReactNode;
    subtitle: ReactNode;
    description: ReactNode;
    image1: StaticImageData;
    image2: StaticImageData;
    image3?: StaticImageData;
}

export default function TextImages3({ id, title, subtitle, description, image1, image2, image3 }: TextImagesProps) {
    return (
        <>

            <section id={id} className="relative min-h-dvh w-full grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 md:px-8">
                <div className="col-span-1 lg:col-span-2" id={`${id}-title`}>
                    {title}
                </div>

                <div id={`${id}-left`} className="flex flex-col justify-center order-2 lg:order-1">

                    {subtitle}

                    <Image
                        alt=""
                        src={image1}
                        width={500}
                        height={500}
                        className="w-full ml-0 mt-8 md:mt-12 mr-auto object-cover border border-transparent hover:border-white hover:border-8 transition-all"
                    />
                </div>

                <div className="lg:pt-[200px] order-1 lg:order-2" id={`${id}-right`}>

                    <Image
                        alt=""
                        src={image2}
                        width={500}
                        height={500}
                        className="w-full ml-0 mr-auto object-cover border border-transparent hover:border-white hover:border-8 transition-all"
                    />

                    {image3 && (
                        <Image
                            alt=""
                            src={image3}
                            width={500}
                            height={500}
                            className="w-full mt-8 max-w-md h-[400px] object-cover border border-transparent hover:border-white hover:border-8 transition-all"
                        />
                    )}

                    <div className="mt-8 md:mt-12">
                        {description}
                    </div>
                </div>

            </section>
        </>
    );
}