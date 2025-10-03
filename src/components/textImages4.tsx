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
    poster?: string;
    loop?: boolean;
    sources?: Array<{ src: string; type?: string; media?: string }>;
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
        poster,
        loop = true,
        sources,
    }, ref) => {

        return (
            <>
                <div id={`${id}-in`}></div>

                <section id={id} className="relative min-h-dvh w-full grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">

                    <div id={`${id}-left`} className="">

                        <Image
                            alt=""
                            src={image1}
                            width={500}
                            height={500}
                            className="w-full mt-12 md:mt-[200px] max-w-xl mx-auto lg:mr-0 lg:ml-auto object-cover border border-transparent hover:border-white hover:border-8 transition-all"
                        />

                        <div className="relative z-10 mt-12 h-[50dvh] md:h-dvh w-full">
                            <video
                                id={`${id}-video`}
                                ref={ref}
                                {...(!(sources && sources.length) ? { src: video } : {})}
                                className="w-full h-full object-cover pinned"
                                preload="metadata"
                                poster={poster || "/images/video-placeholder.svg"}
                                playsInline
                                muted
                                loop={loop}
                            >
                                {sources?.map((source) => (
                                    <source
                                        key={`${id}-${source.src}`}
                                        src={source.src}
                                        type={source.type}
                                        media={source.media}
                                    />
                                ))}
                                {sources?.length ? <source src={video} type="video/mp4" /> : null}
                            </video>
                        </div>

                        <Image
                            alt=""
                            src={image2}
                            width={500}
                            height={500}
                            className="w-full relative z-20 mt-[15dvh] md:mt-[110dvh] max-w-lg mx-auto lg:mr-0 lg:ml-auto object-cover border border-transparent hover:border-white hover:border-8 transition-all"
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
                                className="w-full max-w-md mt-12 md:mt-[100px] h-[400px] object-cover border border-transparent hover:border-white hover:border-8 transition-all mx-auto"
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