// components/ScrollVideo.tsx
type ScrollVideoProps = {
    src: string;
    id: string;
    zIndex: number;
};

export default function ScrollVideo({ src, id, zIndex }: ScrollVideoProps) {
    return (
        <section id={id} className="fixed inset-0 w-full h-screen opacity-0 blur-2xl" style={{ zIndex }}>
            <video
                src={src}
                className="w-full h-full object-cover"
                preload="auto"
                playsInline
                muted
                loop
            />
        </section>
    );
}