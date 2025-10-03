import { forwardRef } from 'react';

type VideoSource = {
    src: string;
    type?: string;
    media?: string;
};

type ScrollVideoProps = {
    src: string;
    id: string;
    poster?: string;
    loop?: boolean;
    sources?: VideoSource[];
};

const ScrollVideo = forwardRef<HTMLVideoElement, ScrollVideoProps>(({ src, id, poster = "/images/video-placeholder.svg", loop = false, sources }, ref) => {

    return (

        <>
            <section
                id={id}
                className="fixed inset-0 md:h-dvh w-full opacity-0"
            >
                <div data-role="video-overlay" className='absolute inset-0 h-full w-full bg-black/60 transition-opacity duration-500 ease-out'></div>
                <video
                    ref={ref}
                    {...(!(sources && sources.length) ? { src } : {})}
                    className="w-full h-full object-cover"
                    preload="metadata"
                    poster={poster}
                    playsInline
                    muted
                    loop={loop}
                >
                    {sources?.map((source) => (
                        <source
                            key={`${id}-${source.src}`}
                            src={source.src}
                            type={source.type}
                            media={source.media}
                        />
                    ))}
                    {/* Fallback directo para navegadores que ignoran <source> */}
                    {sources?.length ? <source src={src} type="video/mp4" /> : null}
                </video>
            </section>
        </>
    );
});

ScrollVideo.displayName = 'ScrollVideo';

export default ScrollVideo;