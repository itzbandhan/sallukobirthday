import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { twMerge } from 'tailwind-merge';
import { Hand } from 'lucide-react';

interface EnvelopeProps {
    onOpen: () => void;
    isOpen: boolean;
    buttonText?: string;
}

export const Envelope = ({ onOpen, isOpen }: EnvelopeProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const envelopeRef = useRef<HTMLDivElement>(null);
    const handRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Idle Levitation of Envelope
        const levitation = gsap.to(envelopeRef.current, {
            y: -15,
            rotation: 1,
            duration: 2.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // Hand pointing animation
        gsap.to(handRef.current, {
            y: 10,
            x: 5,
            scale: 0.9,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });

        if (isOpen) {
            levitation.pause();
            gsap.killTweensOf(handRef.current);
        }

    }, { scope: containerRef, dependencies: [isOpen] });

    const handleClick = () => {
        if (isOpen) return;

        // Trigger Open Immediately
        onOpen();

        // Hand fade out (Parallel)
        if (handRef.current) {
            gsap.to(handRef.current, {
                opacity: 0,
                scale: 1.5,
                duration: 0.2,
                overwrite: true
            });
        }
    };

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 flex flex-col items-center justify-center p-4 z-40 cursor-pointer touch-manipulation"
            onClick={handleClick}
        >

            {/* Envelope Container */}
            <div
                ref={envelopeRef}
                className={twMerge(
                    "relative w-full max-w-xs aspect-[4/3] bg-brand-pink shadow-xl rounded-lg transition-transform",
                    "flex items-center justify-center border-4 border-white/50"
                )}
            >
                {/* Envelope Flap */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-brand-dark/20 clip-path-polygon-[0_0,50%_100%,100%_0]"></div>

                {/* Center Content */}
                <div className="text-white font-serif text-4xl opacity-50 relative">
                    ✉️
                </div>

                {/* Hand Indicator */}
                {!isOpen && (
                    <div ref={handRef} className="absolute bottom-1/3 text-white drop-shadow-lg z-50 pointer-events-none">
                        <Hand size={48} className="transform rotate-12 fill-white text-brand-dark" />
                    </div>
                )}
            </div>

            <div className="absolute bottom-20 text-brand-text/50 text-sm animate-pulse pointer-events-none">
                (Tap anywhere to open)
            </div>

        </div>
    );
};
