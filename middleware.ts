import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Currently we use Next.js App Router for handling tools,
    // so this middleware is a placeholder for future advanced routing
    // like redirects or handling subdomain tenants.

    return NextResponse.next();
}

export const config = {
    matcher: '/:path*',
};
