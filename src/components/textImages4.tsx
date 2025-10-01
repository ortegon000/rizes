import { forwardRef } from 'react';
import Image, { type StaticImageData } from "next/image";
import { type ReactNode } from "react";

type TextImagesProps = {
    id: string;
    title: ReactNode;
    subtitle: ReactNode;
    description: ReactNode;
    text1: ReactNode;
    text2: ReactNode;
    image1: StaticImageData;
    image2: StaticImageData;
    image3: StaticImageData;
    image4: StaticImageData;
    video?: string;
}

const TextImages4 = forwardRef<HTMLVideoElement, TextImagesProps>(
    ({
        id,
        title,
        subtitle,
        description,
        text1,
        text2,
        image1,
        image2,
        image3,
        image4,
        video,
    }, ref) => {

        return (
            <>
                <div id={`${id}-in`}></div>

                <section id={id} className="relative min-h-dvh w-full grid grid-cols-2 gap-8">

                    <div id={`${id}-left`} className="">

                        <Image
                            alt=""
                            src={image1}
                            width={500}
                            height={500}
                            className="w-full mt-[200px] max-w-xl mr-0 ml-auto object-cover border border-transparent hover:border-white hover:border-8 transition-all"
                        />

                        <div className="mt-12 aspect-square w-full">
                            <video
                                id={`${id}-video`}
                                ref={ref}
                                src={video}
                                className="w-full h-full object-cover pinned"
                                preload="auto"
                                playsInline
                                muted
                                loop
                            />
                        </div>

                        <Image
                            alt=""
                            src={image2}
                            width={500}
                            height={500}
                            className="w-full mt-12 max-w-lg mr-0 ml-auto object-cover border border-transparent hover:border-white hover:border-8 transition-all"
                        />

                        {description}
                    </div>

                    <div className="" id={`${id}-right`}>

                        <Image
                            alt=""
                            src={image3}
                            width={500}
                            height={500}
                            className="w-full object-cover border border-transparent hover:border-white hover:border-8 transition-all"
                        />

                        {subtitle}

                        {title}

                        {image4 && (
                            <Image
                                alt=""
                                src={image4}
                                width={500}
                                height={500}
                                className="w-full max-w-md mt-12 h-[400px] object-cover border border-transparent hover:border-white hover:border-8 transition-all"
                            />
                        )}

                        {text1}

                        {text2}
                    </div>

                </section>

                <div id={`${id}-out`}></div>
            </>
        )

    })

TextImages4.displayName = 'TextImages4';

export default TextImages4;