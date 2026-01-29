import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const host = request.headers.get('host');

    // Redirect www to non-www
    // Note: Commented out because it conflicts with Vercel's domain settings, causing a redirect loop.
    /*
    if (host && host.startsWith('www.')) {
        url.host = host.replace('www.', '');
        return NextResponse.redirect(url, 301);
    }
    */

    const response = NextResponse.next();

    // Required for SharedArrayBuffer (ffmpeg.wasm)
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');

    return response;
}

export const config = {
    matcher: '/:path*',
};
