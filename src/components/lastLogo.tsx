import { Logo } from "@assets/svg/Logo";

export default function LastLogo() {
    return (
        <>
            <section id="last-logo" className="fixed inset-0 min-h-dvh w-full opacity-0 px-4 z-[810]">

                <div className="w-full h-dvh flex items-center justify-center">
                    <Logo id="lastLogoImage" className="w-[100px] md:w-[250px] md:mt-0 h-auto scale-150 text-white" />
                </div>
            </section>
        </>
    )
}