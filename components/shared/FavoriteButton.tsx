'use client';

import { Star } from 'lucide-react';
import { useUserPersistence } from '@/hooks/use-user-persistence';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
    toolId: string;
    className?: string;
    showLabel?: boolean;
}

export function FavoriteButton({ toolId, className, showLabel }: FavoriteButtonProps) {
    const { isFavorite, toggleFavorite } = useUserPersistence();
    const favorite = isFavorite(toolId);

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(toolId);
            }}
            className={cn(
                "group flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200",
                favorite
                    ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 hover:border-amber-200 dark:hover:border-amber-500/30 hover:text-amber-500",
                className
            )}
            title={favorite ? "Remove from favorites" : "Add to favorites"}
        >
            <Star
                className={cn(
                    "w-4 h-4 transition-transform group-hover:scale-110",
                    favorite ? "fill-current" : "fill-none"
                )}
            />
            {showLabel && (
                <span className="text-sm font-medium">
                    {favorite ? 'Favorited' : 'Favorite'}
                </span>
            )}
        </button>
    );
}
