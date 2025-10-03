import { Logo } from "@assets/svg/Logo";

export default function LastLogo() {
    return (
        <>
            <section id="lastLogo" className="fixed inset-0 min-h-dvh w-full opacity-0 px-4">

                <div className="w-full h-dvh flex items-center justify-center">
                    <Logo id="lastLogoImage" className="w-[200px] md:w-[300px] h-auto scale-150 text-white" />
                </div>
            </section>
        </>
    )
}