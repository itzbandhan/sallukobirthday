import { twMerge } from 'tailwind-merge';
import { Wine } from 'lucide-react';

interface InvitationCardProps {
    title: string;
    date: string;
    venue: string;
    recipientName?: string | null;
    message?: string | null; // For special logic or extra note
    subtitle?: string | null;
}

export const InvitationCard = ({
    title,
    date,
    venue,
    recipientName,
    message,
    subtitle
}: InvitationCardProps) => {
    return (
        <div className={twMerge(
            "relative w-full max-w-sm mx-auto bg-white rounded-3xl p-8 shadow-2xl",
            "border-[6px] border-double border-brand-pink/50",
            "flex flex-col items-center text-center space-y-6"
        )}>
            {/* Decorative Corner Elements */}
            <div className="absolute top-4 left-4 text-brand-pink/40 animate-pulse">✨</div>
            <div className="absolute bottom-4 right-4 text-brand-pink/40 animate-pulse delay-700">✨</div>

            {/* Recipient Greeting */}
            {recipientName && (
                <div className="text-brand-text font-medium text-lg italic">
                    Dear {recipientName},
                </div>
            )}

            {/* Main Title */}
            <h1 className="text-3xl font-serif text-brand-text leading-tight">
                {title}
            </h1>

            {/* Decorative Wine Glass */}
            <div className="text-red-800 drop-shadow-sm animate-bounce duration-[2000ms]">
                <Wine size={32} fill="#722F37" strokeWidth={1.5} />
            </div>

            {/* Subtitle */}
            {subtitle && (
                <p className="text-sm text-brand-text/80 uppercase tracking-widest font-semibold">
                    {subtitle}
                </p>
            )}

            <div className="w-full h-px bg-brand-pink/30 my-2"></div>

            {/* Details */}
            <div className="space-y-4 text-brand-text">
                <div className="flex flex-col">
                    <span className="text-xs uppercase text-brand-dark font-bold tracking-wider">When</span>
                    <span className="font-serif text-lg">{date}</span>
                </div>

                <div className="flex flex-col">
                    <span className="text-xs uppercase text-brand-dark font-bold tracking-wider">Where</span>
                    <span className="font-serif text-lg">{venue}</span>
                </div>

                {/* Theme Section */}
                <div className="flex flex-col">
                    <span className="text-xs uppercase text-brand-dark font-bold tracking-wider">Theme</span>
                    <span className="font-serif text-lg italic text-pink-600">Red Dress</span>
                </div>
            </div>

            {/* Custom Message (Special Invite) */}
            {message && (
                <div className="bg-brand-pink/10 p-4 rounded-xl text-sm text-brand-text italic leading-relaxed">
                    "{message}"
                </div>
            )}

            {/* Footer decoration */}
            <div className="pt-2 opacity-50">
                💕
            </div>
        </div>
    );
};
