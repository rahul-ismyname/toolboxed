'use client';

import { useEffect, useState } from 'react';

interface TypewriterTextProps {
    text: string;
    delay?: number;
    className?: string;
}

export function TypewriterText({ text, delay = 0, className = '' }: TypewriterTextProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setStarted(true);
        }, delay * 1000);

        return () => clearTimeout(timeout);
    }, [delay]);

    useEffect(() => {
        if (!started) return;

        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex <= text.length) {
                setDisplayedText(text.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 50); // Speed of typing

        return () => clearInterval(interval);
    }, [started, text]);

    return (
        <span className={className}>
            {displayedText}
            <span className="animate-pulse border-r-2 border-emerald-500 ml-1">&nbsp;</span>
        </span>
    );
}
