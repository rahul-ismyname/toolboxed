import { LucideIcon, PenTool, Activity, Calculator, FileText, Image, Code, Palette, Grid, Box, Zap, Lock, Wand2 } from 'lucide-react';

export type ToolCategory = 'design' | 'developer' | 'business' | 'utility' | 'health' | 'math' | 'security';

export interface ToolDefinition {
    id: string;
    name: string;
    description: string;
    icon: LucideIcon;
    category: ToolCategory;
    path: string;
    keywords?: string[];
    isBeta?: boolean;
}

export const tools: ToolDefinition[] = [
    // Design
    {
        id: 'paint-app',
        name: 'Paint Studio',
        description: 'Digital canvas for drawing and sketching with layers.',
        icon: Palette,
        category: 'design',
        path: '/paint-app',
        keywords: ['draw', 'sketch', 'canvas', 'art']
    },
    {
        id: 'physics-sim',
        name: 'Physics Playground',
        description: 'Interactive 2D physics simulation sandbox.',
        icon: Box,
        category: 'utility',
        path: '/physics-sim', // Verify this path
        keywords: ['sim', 'gravity', 'matter', 'engine']
    },
    {
        id: 'invoice-builder',
        name: 'Invoice Studio',
        description: 'Professional invoice generator with PDF export.',
        icon: FileText,
        category: 'business',
        path: '/invoice-builder',
        keywords: ['bill', 'receipt', 'payment']
    },
    // Add more tools as we migrate them...
];

export const getAllTools = () => tools;

export const getToolsByCategory = (category: ToolCategory) => tools.filter(t => t.category === category);

export const getToolById = (id: string) => tools.find(t => t.id === id);
