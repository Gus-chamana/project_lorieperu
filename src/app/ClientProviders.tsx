"use client";

import { useEffect, useState } from 'react';
import PromoBanner from '../components/feature/PromoBanner';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            {mounted && <PromoBanner />}
            {children}
        </>
    );
}

