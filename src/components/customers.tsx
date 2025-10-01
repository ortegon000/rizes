import Image from "next/image";
import Customer1Image from "@images/customers/1.png";

export default function Customers() {
    return (
        <>
            <section id="customers" className="fixed inset-0 h-dvh w-full bg-black opacity-0 py-12 flex items-center justify-center flex-col">
                <div>

                    <p id="customers-title" className="text-4xl text-center font-black m-auto text-white tracking-wide leading-14">
                        Ellos ya son testigos de nuestra magia...
                    </p>

                    <div id="customers-icons" className="grid grid-cols-4 gap-20 max-w-screen-lg mx-auto mt-20">
                        <Image
                            alt=""
                            src={Customer1Image}
                            width={200}
                            height={100}
                            className="w-auto h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer1Image}
                            width={200}
                            height={100}
                            className="w-auto h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer1Image}
                            width={200}
                            height={100}
                            className="w-auto h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer1Image}
                            width={200}
                            height={100}
                            className="w-auto h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer1Image}
                            width={200}
                            height={100}
                            className="w-auto h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer1Image}
                            width={200}
                            height={100}
                            className="w-auto h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer1Image}
                            width={200}
                            height={100}
                            className="w-auto h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer1Image}
                            width={200}
                            height={100}
                            className="w-auto h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer1Image}
                            width={200}
                            height={100}
                            className="w-auto h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer1Image}
                            width={200}
                            height={100}
                            className="w-auto h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer1Image}
                            width={200}
                            height={100}
                            className="w-auto h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer1Image}
                            width={200}
                            height={100}
                            className="w-auto h-12 m-auto object-contain"
                        />
                    </div>
                </div>


            </section>
        </>
    )
}