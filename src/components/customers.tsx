import Image from "next/image";
import Customer1Image from "@images/customers/1.png";

export default function Customers() {
    return (
        <>
            <section id="customers" className="fixed inset-0 h-dvh w-full bg-black opacity-0 p-4 md:p-12 flex items-center justify-center flex-col">
                <div className="w-full">

                    <p id="customers-title" className="text-2xl md:text-4xl text-center font-black max-w-screen-md mx-auto text-white tracking-wide leading-tight md:leading-14">
                        Ellos ya son testigos de nuestra magia...
                    </p>

                    <div id="customers-icons" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-16 max-w-screen-lg mx-auto mt-12 md:mt-20">
                        <Image
                            alt=""
                            src={Customer1Image}
                            width={200}
                            height={100}
                            className="w-auto h-10 md:h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer1Image}
                            width={200}
                            height={100}
                            className="w-auto h-10 md:h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer1Image}
                            width={200}
                            height={100}
                            className="w-auto h-10 md:h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer1Image}
                            width={200}
                            height={100}
                            className="w-auto h-10 md:h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer1Image}
                            width={200}
                            height={100}
                            className="w-auto h-10 md:h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer1Image}
                            width={200}
                            height={100}
                            className="w-auto h-10 md:h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer1Image}
                            width={200}
                            height={100}
                            className="w-auto h-10 md:h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer1Image}
                            width={200}
                            height={100}
                            className="w-auto h-10 md:h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer1Image}
                            width={200}
                            height={100}
                            className="w-auto h-10 md:h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer1Image}
                            width={200}
                            height={100}
                            className="w-auto h-10 md:h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer1Image}
                            width={200}
                            height={100}
                            className="w-auto h-10 md:h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer1Image}
                            width={200}
                            height={100}
                            className="w-auto h-10 md:h-12 m-auto object-contain"
                        />
                    </div>
                </div>


            </section>
        </>
    )
}