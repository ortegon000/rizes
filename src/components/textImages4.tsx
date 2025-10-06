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
    canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}

const TextImages4 = ({
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
    canvasRef,
}: TextImagesProps) => {

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

                        <div id={`${id}-canvas-container`} className="relative z-10 mt-12 h-[50dvh] md:h-dvh w-full">
                            {/* Canvas para frames de video */}
                            {canvasRef && (
                                <canvas
                                    ref={canvasRef}
                                    id={`${id}-canvas`}
                                    className="w-full h-full object-cover pinned"
                                />
                            )}
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
}

export default TextImages4;