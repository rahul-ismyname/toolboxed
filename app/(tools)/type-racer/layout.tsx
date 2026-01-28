
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Type Racer Game | Toolboxed',
    description: 'Test your typing speed in a race against bots. Improve your WPM with programming quotes.',
};

export default function TypeRacerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
