import { JwtDecoder } from '@/components/tools/developer/JwtDecoder';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'JWT Decoder | Debug JSON Web Tokens Online',
    description: 'Decode and inspect JSON Web Tokens (JWT) instantly. View header, payload, and signature claims. Secure client-side decoding, no server uploads.',
    keywords: ['jwt decoder', 'jwt debugger', 'decode jwt online', 'json web token', 'jwt viewer'],
    alternates: {
        canonical: '/jwt-decoder',
    },
};

const faqItems = [
    {
        question: "Is it safe to paste my JWTs here?",
        answer: "Absolutely. All decoding happens directly in your browser using JavaScript. Your tokens are never sent to our servers or any third party."
    },
    {
        question: "What is a JWT?",
        answer: "JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object."
    },
    {
        question: "Can I edit the JWT?",
        answer: "This tool is for decoding and inspection only. Modifying a signed JWT invalidates the signature unless you have the secret key to re-sign it."
    }
];

const howToSteps: Step[] = [
    {
        title: "Paste Token",
        description: "Copy your JWT string and paste it into the input box on the left."
    },
    {
        title: "Inspect Claims",
        description: "The decoder automatically splits the token. Use the tabs to switch between the Header (algorithm info) and Payload (user data)."
    },
    {
        title: "Check Expiry",
        description: "See exactly when the token expires and whether it is currently valid based on the 'exp' claim."
    }
];

export default function JwtDecoderPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        JWT Decoder
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Inspect and debug JSON Web Tokens instantly.
                    </p>
                </div>

                <JwtDecoder />
            </div>

            <HowToSection title="Using the JWT Decoder" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
