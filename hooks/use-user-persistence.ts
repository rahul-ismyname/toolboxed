'use client';

import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'toolboxed_favorites';
const RECENT_KEY = 'toolboxed_recent';
const MAX_RECENT = 6;

export function useUserPersistence() {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [recentTools, setRecentTools] = useState<string[]>([]);

    // Initialize from localStorage
    useEffect(() => {
        const storedFavorites = localStorage.getItem(FAVORITES_KEY);
        if (storedFavorites) {
            try {
                setFavorites(JSON.parse(storedFavorites));
            } catch (e) {
                console.error('Failed to parse favorites', e);
            }
        }

        const storedRecent = localStorage.getItem(RECENT_KEY);
        if (storedRecent) {
            try {
                setRecentTools(JSON.parse(storedRecent));
            } catch (e) {
                console.error('Failed to parse recent tools', e);
            }
        }
    }, []);

    const toggleFavorite = useCallback((toolId: string) => {
        setFavorites(prev => {
            const newFavorites = prev.includes(toolId)
                ? prev.filter(id => id !== toolId)
                : [...prev, toolId];
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
            return newFavorites;
        });
    }, []);

    const addRecent = useCallback((toolId: string) => {
        setRecentTools(prev => {
            const newRecent = [toolId, ...prev.filter(id => id !== toolId)].slice(0, MAX_RECENT);
            localStorage.setItem(RECENT_KEY, JSON.stringify(newRecent));
            return newRecent;
        });
    }, []);

    const isFavorite = (toolId: string) => favorites.includes(toolId);

    return {
        favorites,
        recentTools,
        toggleFavorite,
        addRecent,
        isFavorite,
    };
}
