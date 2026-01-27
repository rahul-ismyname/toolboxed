import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export type InvoiceData = any; // Using 'any' for flexibility with the existing invoice structure

export interface InvoiceMetadata {
    title?: string;
    description?: string;
    isPublic?: boolean;
}

export async function saveInvoice(data: InvoiceData, meta?: InvoiceMetadata) {
    if (!supabase) throw new Error('Supabase not configured');

    // Prepare payload
    const payload: any = { data };
    if (meta) {
        if (meta.title) payload.title = meta.title;
        if (meta.description) payload.description = meta.description;
        if (meta.isPublic !== undefined) payload.is_public = meta.isPublic;
    }

    const { data: result, error } = await supabase
        .from('invoices')
        .insert([payload])
        .select()
        .single();

    if (error) throw error;
    return result;
}

export async function getInvoice(id: string) {
    if (!supabase) return null;

    // Increment view count (fire and forget)
    await supabase.rpc('increment_invoice_views', { row_id: id });

    const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return null;
    return data;
}

// --- LINK SHORTENER ---

export async function createShortLink(originalUrl: string, customCode?: string) {
    if (!supabase) throw new Error('Supabase not configured');

    // Generate a random 6-char code if custom one not provided
    const shortCode = customCode || Math.random().toString(36).substring(2, 8);

    const { data, error } = await supabase
        .from('short_links')
        .insert([{
            original_url: originalUrl,
            short_code: shortCode
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getOriginalUrl(code: string) {
    if (!supabase) return null;

    // Increment clicks (fire and forget)
    await supabase.rpc('increment_link_clicks', { code_param: code });

    const { data, error } = await supabase
        .from('short_links')
        .select('original_url')
        .eq('short_code', code)
        .maybeSingle();

    if (error) {
        console.error('Link Shortener Error:', error);
        return null;
    }
    return data?.original_url;
}

export async function getPublicTemplates() {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) {
        console.error('Error fetching templates:', error);
        return [];
    }
    return data;
}
