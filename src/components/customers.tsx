import Image from "next/image";
import Customer1Image from "@images/customers/1.png";
import Customer2Image from "@images/customers/2.png";
import Customer3Image from "@images/customers/3.png";
import Customer4Image from "@images/customers/4.png";
import Customer5Image from "@images/customers/5.png";
import Customer6Image from "@images/customers/6.png";
import Customer7Image from "@images/customers/7.png";
import Customer8Image from "@images/customers/8.png";
import Customer9Image from "@images/customers/9.png";
import Customer10Image from "@images/customers/10.png";
import Customer11Image from "@images/customers/11.png";
import Customer12Image from "@images/customers/12.png";
import Customer13Image from "@images/customers/13.png";
import Customer14Image from "@images/customers/14.png";
import Customer15Image from "@images/customers/15.png";
import Customer16Image from "@images/customers/16.png";
import Customer17Image from "@images/customers/17.png";
import Customer18Image from "@images/customers/18.png";
import Customer19Image from "@images/customers/19.png";


export default function Customers() {
    return (
        <>
            <section id="customers" className="fixed inset-0 h-dvh w-full bg-black opacity-0 p-4 md:p-12 flex items-center justify-center flex-col z-[800]">
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
                            src={Customer2Image}
                            width={200}
                            height={100}
                            className="w-auto h-10 md:h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer3Image}
                            width={200}
                            height={100}
                            className="w-auto h-10 md:h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer4Image}
                            width={200}
                            height={100}
                            className="w-auto h-10 md:h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer5Image}
                            width={200}
                            height={100}
                            className="w-auto h-10 md:h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer6Image}
                            width={200}
                            height={100}
                            className="w-auto h-10 md:h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer7Image}
                            width={200}
                            height={100}
                            className="w-auto h-10 md:h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer8Image}
                            width={200}
                            height={100}
                            className="w-auto h-10 md:h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer9Image}
                            width={200}
                            height={100}
                            className="w-auto h-10 md:h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer10Image}
                            width={200}
                            height={100}
                            className="w-auto h-10 md:h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer11Image}
                            width={200}
                            height={100}
                            className="w-auto h-10 md:h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer12Image}
                            width={200}
                            height={100}
                            className="w-auto h-10 md:h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer13Image}
                            width={200}
                            height={100}
                            className="w-auto h-10 md:h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer14Image}
                            width={200}
                            height={100}
                            className="w-auto h-10 md:h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer15Image}
                            width={200}
                            height={100}
                            className="w-auto h-10 md:h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer16Image}
                            width={200}
                            height={100}
                            className="w-auto h-10 md:h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer17Image}
                            width={200}
                            height={100}
                            className="w-auto h-10 md:h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer18Image}
                            width={200}
                            height={100}
                            className="w-auto h-10 md:h-12 m-auto object-contain"
                        />

                        <Image
                            alt=""
                            src={Customer19Image}
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