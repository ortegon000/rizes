import { forwardRef } from 'react';

type ScrollVideoProps = {
    src: string;
    id: string;
    zIndex?: number;
};

const ScrollVideo = forwardRef<HTMLVideoElement, ScrollVideoProps>(({ src, id, zIndex = 10 }, ref) => {

    return (
        <section
            id={id}
            className="absolute inset-0 h-dvh w-full blur-xl opacity-0"
            style={{ zIndex }}
        >
            <video
                ref={ref}
                src={src}
                className="w-full h-full object-cover"
                preload="auto"
                playsInline
                muted
                loop
            />
        </section>
    );
});

ScrollVideo.displayName = 'ScrollVideo';

export default ScrollVideo;