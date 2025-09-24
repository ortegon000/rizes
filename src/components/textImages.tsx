import Image from "next/image";

type TextImagesProps = {
    zIndex?: number;
}

export default function TextImages({ zIndex = 20 }: TextImagesProps) {
    return (
        <section id="text-images-1" className="absolute inset-0 h-dvh w-full translate-y-[110dvh] grid grid-cols-2 gap-8" style={{ zIndex }}>
            <div className="">
                <p className="text-5xl max-w-md mr-0 ml-auto bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent tracking-wide leading-14">
                    <strong>Somos una empresa 100% mexicana</strong> que combina <strong>precisión, pasión y visión estratégica.</strong>
                </p>
                <p className="mt-12 text-5xl max-w-md mr-0 ml-auto bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent tracking-wide leading-14">
                    Ejecución impecable, <strong>control presupuestal inteligente</strong> y atención a cada detalle.
                </p>
                <Image
                    alt=""
                    src="/images/text-image-1/1.webp"
                    width={500}
                    height={500}
                    className="mt-12 max-w-md mr-0 ml-auto h-[400px] object-cover"
                />
            </div>

            <div className="" id="text-images-1-right">
                <Image
                    alt=""
                    src="/images/text-image-1/2.webp"
                    width={500}
                    height={500}
                    className="w-full ml-0 mt-[200px] mr-auto h-[600px] object-cover"
                />

                <Image
                    alt=""
                    src="/images/text-image-1/3.webp"
                    width={500}
                    height={500}
                    className="mt-8 max-w-md h-[400px] object-cover"
                />
            </div>

        </section>
    );
}