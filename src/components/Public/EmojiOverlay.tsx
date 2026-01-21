import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface EmojiOverlayProps {
    emoji: string;
    show: boolean;
    onComplete: () => void;
}

export const EmojiOverlay = ({ emoji, show, onComplete }: EmojiOverlayProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const emojiRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (show) {
            // Animate emoji Entrance -> Float -> Exit
            const tl = gsap.timeline({
                onComplete: onComplete
            });

            tl.fromTo(emojiRef.current,
                { scale: 0, opacity: 0, y: 100 },
                { scale: 1.5, opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }
            )
                .to(emojiRef.current, {
                    y: -50,
                    duration: 1.5,
                    ease: "sine.inOut" // Float up slightly
                })
                .to(emojiRef.current, {
                    opacity: 0,
                    scale: 2,
                    duration: 0.5,
                    ease: "power2.in"
                }, "-=0.5"); // Fade out overlap
        }
    }, { scope: containerRef, dependencies: [show] });

    if (!show) return null;

    return (
        <div ref={containerRef} className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <div ref={emojiRef} className="text-8xl filter drop-shadow-2xl">
                {emoji}
            </div>
        </div>
    );
};
