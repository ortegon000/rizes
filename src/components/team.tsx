import Image from "next/image";
import TeamImage from "@images/team.webp";
import Team2Image from "@images/team-2.webp";

export default function Team() {
    return (

        <>
            <section id="team">
                <figure id="team-image" className="relative aspect-[16/9] h-auto w-full max-w-1/2">
                    <Image
                        alt=""
                        src={TeamImage}
                        fill
                        className="w-full h-auto object-cover"
                        priority
                        sizes="(max-width: 2240px) 100vw, 50vw"
                    />
                </figure>

                <div id="team-description" className="relative mt-[30dvh] grid grid-cols-2 gap-8">
                    <div>
                        <p className="w-full max-w-lg mr-0 ml-auto text-4xl text-white font-black tracking-wide">
                            Si estás pensando en alguna experiencia que no encuentres aquí, escríbenos ahora mismo y nuestros asesores te podrán ayudar.
                        </p>

                        <p className="text-4xl font-black max-w-lg mr-0 ml-auto mt-20 bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent tracking-wide leading-14">
                            contacto@rizes.com.mx
                        </p>
                    </div>

                    <Image
                        alt=""
                        src={Team2Image}
                        width={500}
                        height={500}
                        className="w-full max-w-screen-md mr-0 ml-auto object-cover border border-transparent hover:border-white hover:border-8 transition-all"
                    />
                </div>
            </section>
        </>
    );
}