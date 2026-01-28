
import { type LucideIcon, Code2, Database, Key, Binary, FileJson, Terminal, Search } from 'lucide-react';

export interface PersonaTool {
    slug: string;
    name: string;
    description: string;
    icon?: LucideIcon;
}

export interface PersonaPageData {
    id: string;
    slug: string;
    title: string;
    description: string;
    heroTitle: string;
    heroSubtitle: string;
    tools: PersonaTool[];
    workflow: { title: string; steps: string[] }[];
}

export const personaData: PersonaPageData[] = [
    {
        id: 'full-stack-dev',
        slug: 'full-stack-developer-kit',
        title: 'The Ultimate Full-Stack Developer Toolkit | Toolboxed',
        description: 'A curated collection of essential tools for full-stack developers. Debug APIs, format queries, and manage data instantly.',
        heroTitle: 'Your new development command center.',
        heroSubtitle: 'Stop Googling for "json formatter" every day. Here is everything you need in one place, running locally.',
        tools: [
            {
                slug: 'json-formatter', // Directory: json-formatter
                name: 'JSON Formatter',
                description: 'Validate, minify, and formatted JSON responses from your API.',
                icon: FileJson
            },
            {
                slug: 'sql-formatter', // Directory: sql-formatter
                name: 'SQL Formatter',
                description: 'Beautify complex SQL queries for better readability.',
                icon: Database
            },
            {
                slug: 'jwt-decoder', // Directory: jwt-decoder
                name: 'JWT Decoder',
                description: 'Debug authentication tokens without sending them to a server.',
                icon: Key
            },
            {
                slug: 'regex-tester', // Directory: regex-tester
                name: 'Regex Tester',
                description: 'Test and debug regular expressions in real-time.',
                icon: Search
            },
            {
                slug: 'base64', // Directory: base64
                name: 'Base64 Tool',
                description: 'Encode and decode Base64 strings for data transfer.',
                icon: Binary
            },
            {
                slug: 'uuid-generator', // Directory: uuid-generator
                name: 'UUID Generator',
                description: 'Generate random UUIDs for database keys or testing.',
                icon: Terminal
            }
        ],
        workflow: [
            {
                title: 'Debugging an API Endpoint',
                steps: [
                    'Use **JWT Decoder** to verify your bearer token claims.',
                    'Copy the response body into **JSON Formatter** to inspect the data structure.',
                    'If you see a Base64 encoded string, pipe it into **Base64 Tool** to reveal the content.'
                ]
            },
            {
                title: 'Optimizing Database Queries',
                steps: [
                    'Paste your raw log query into **SQL Formatter**.',
                    'Use **Regex Tester** to ensure your validation patterns match the data schema.',
                    'Generate test data IDs with **UUID Generator**.'
                ]
            }
        ]
    }
];
