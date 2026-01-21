import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { Envelope } from '../components/Public/Envelope';
import { InvitationCard } from '../components/Public/InvitationCard';
import { EmojiOverlay } from '../components/Public/EmojiOverlay';
import { useInvitation } from '../hooks/useInvitation';

export default function Home() {
    const { slug } = useParams();
    const { settings, recipient, loading } = useInvitation(slug);
    const [isOpen, setIsOpen] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    // Prepare content based on data
    const title = settings?.title || "You're Invited!";
    const date = settings?.date_text || "Date TBD";
    const venue = settings?.venue_text || "Venue TBD";

    // Recipient Name Logic
    let recipientName = null;
    if (recipient) {
        if (recipient.invite_type === 'couple') {
            recipientName = `${recipient.name_partner1} & ${recipient.name_partner2}`;
        } else {
            recipientName = recipient.name_single;
        }
    }

    // Special Message Logic
    let message = recipient?.custom_message || settings?.generic_message;
    let subtitle = settings?.subtitle;

    // Special Surprise Override
    if (recipient?.invite_type === 'special') {
        // Special logic if needed, or just rely on DB content
        // For now, we assume DB has the custom copy in 'custom_message'
    }

    useGSAP(() => {
        if (isOpen && cardRef.current) {
            const tl = gsap.timeline();

            // 1. Card slides out
            tl.to(cardRef.current, {
                y: -50, // Move up
                opacity: 1,
                scale: 1,
                duration: 1.5,
                ease: "power3.out",
                delay: 0.5 // Wait for flap roughly
            });
        }
    }, { scope: containerRef, dependencies: [isOpen] });

    const handleOpen = () => {
        setIsOpen(true);

        // Confetti
        if (settings?.confetti_enabled !== false) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ffb7b2', '#ff9aa2', '#ffffff']
            });
        }

        // Emoji
        if (settings?.emoji_overlay_enabled !== false) {
            setShowEmoji(true);
        }
    };

    if (loading && !settings) {
        // Simple loading state
        return (
            <div className="min-h-screen bg-pink-50 flex items-center justify-center text-brand-text">
                Loading...
            </div>
        );
    }

    return (
        <div ref={containerRef} className="min-h-screen bg-pink-50 flex flex-col items-center justify-center overflow-hidden relative">

            {/* Background Decorations (Optional) */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
                {/* Can add abstract blobs here */}
            </div>

            {/* Envelope Layer */}
            <div className="z-20 relative">
                <Envelope
                    onOpen={handleOpen}
                    isOpen={isOpen}
                    buttonText={settings?.open_button_text || "Tap to Open"}
                />
            </div>

            {/* Card Layer - Initially hidden behind/inside */}
            <div
                ref={cardRef}
                className={`absolute z-30 opacity-0 scale-90 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-20 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
                style={{ width: '90%', maxWidth: '24rem' }}
            >
                <InvitationCard
                    title={title}
                    date={date}
                    venue={venue}
                    recipientName={recipientName}
                    message={message}
                    subtitle={subtitle}
                />
            </div>

            {/* Overlays */}
            <EmojiOverlay
                emoji={settings?.emoji === "🥳" ? "🩷" : (settings?.emoji || "🩷")}
                show={showEmoji}
                onComplete={() => setShowEmoji(false)}
            />

        </div>
    );
}
