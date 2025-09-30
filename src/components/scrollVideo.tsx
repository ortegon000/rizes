import { forwardRef } from 'react';

type ScrollVideoProps = {
    src: string;
    id: string;
};

const ScrollVideo = forwardRef<HTMLVideoElement, ScrollVideoProps>(({ src, id }, ref) => {

    return (

        <>
            <section
                id={id}
                className="fixed inset-0 h-dvh w-full blur-xl opacity-0"
            >
                <div className='absolute inset-0 h-full w-full bg-black/50'></div>
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
        </>
    );
});

ScrollVideo.displayName = 'ScrollVideo';

export default ScrollVideo;