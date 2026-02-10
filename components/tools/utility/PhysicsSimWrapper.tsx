'use client';

import dynamic from 'next/dynamic';

const PhysicsSim = dynamic(() => import('./physics-sim/PhysicsSim'), { ssr: false });

export function PhysicsSimWrapper({ variant = 'simulation' }: { variant?: 'simulation' | 'creator' }) {
    return <PhysicsSim variant={variant} />;
}
