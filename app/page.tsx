import { LandingPage } from '@/components/home/LandingPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Toolboxed | All-in-One Professional Online Utility Tools',
  description: 'Fast, secure, and free online tools for developers, creators, and professionals. From calculators to converters, all in one place. 100% private.',
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return <LandingPage />;
}
