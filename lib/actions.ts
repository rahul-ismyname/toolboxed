'use server';

import { turso, generateId } from './turso';

export type InvoiceData = any;

export interface InvoiceMetadata {
    title?: string;
    description?: string;
    isPublic?: boolean;
}

export async function saveInvoice(data: InvoiceData, meta?: InvoiceMetadata) {
    const id = generateId();
    const payload = {
        id,
        data: JSON.stringify(data),
        title: meta?.title || null,
        description: meta?.description || null,
        is_public: meta?.isPublic ? 1 : 0,
    };

    try {
        await turso.execute({
            sql: "INSERT INTO invoices (id, data, title, description, is_public) VALUES (?, ?, ?, ?, ?)",
            args: [payload.id, payload.data, payload.title, payload.description, payload.is_public]
        });

        return { ...payload, data };
    } catch (error) {
        console.error('Turso saveInvoice error:', error);
        throw error;
    }
}

export async function getInvoice(id: string) {
    try {
        await turso.execute({
            sql: "UPDATE invoices SET views = views + 1 WHERE id = ?",
            args: [id]
        });

        const rs = await turso.execute({
            sql: "SELECT * FROM invoices WHERE id = ?",
            args: [id]
        });

        if (rs.rows.length === 0) return null;

        const row = rs.rows[0];
        return {
            ...row,
            data: JSON.parse(row.data as string),
            is_public: !!row.is_public
        };
    } catch (error) {
        console.error('Turso getInvoice error:', error);
        return null;
    }
}

export async function createShortLink(originalUrl: string, customCode?: string) {
    const id = generateId();
    const shortCode = customCode || Math.random().toString(36).substring(2, 8);

    try {
        await turso.execute({
            sql: "INSERT INTO short_links (id, original_url, short_code) VALUES (?, ?, ?)",
            args: [id, originalUrl, shortCode]
        });

        return { id, original_url: originalUrl, short_code: shortCode };
    } catch (error) {
        console.error('Turso createShortLink error:', error);
        throw error;
    }
}

export async function getOriginalUrl(code: string) {
    try {
        await turso.execute({
            sql: "UPDATE short_links SET clicks = clicks + 1 WHERE short_code = ?",
            args: [code]
        });

        const rs = await turso.execute({
            sql: "SELECT original_url FROM short_links WHERE short_code = ?",
            args: [code]
        });

        if (rs.rows.length === 0) return null;
        return rs.rows[0].original_url as string;
    } catch (error) {
        console.error('Turso getOriginalUrl error:', error);
        return null;
    }
}

export async function getPublicTemplates() {
    try {
        const rs = await turso.execute("SELECT * FROM invoices WHERE is_public = 1 ORDER BY created_at DESC LIMIT 20");
        return rs.rows.map(row => ({
            ...row,
            data: JSON.parse(row.data as string),
            is_public: true
        }));
    } catch (error) {
        console.error('Turso getPublicTemplates error:', error);
        return [];
    }
}
