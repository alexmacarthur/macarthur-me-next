import { NextResponse } from 'next/server'

export default async function middleware(request) {
    const imageId = request.url.match(/proxy\/(.+)$/)?.[1];

    return NextResponse.rewrite(`https://image-proxy.amacarthur.workers.dev/proxy/${imageId}`);
}

export const config = {
  matcher: '/proxy/:path*',
};
