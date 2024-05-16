export { default } from 'next-auth/middleware';

export const config = {
    matcher: [
        "/home",
        "/category/:path*",
        "/post/:path*",
        "/user/:path*",
        "/search",
        "/notifications",
        "/comment/:path*",
    ]
};
