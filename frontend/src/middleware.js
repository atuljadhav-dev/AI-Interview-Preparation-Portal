import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
// Middleware to protect routes based on JWT authentication
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
// Verify JWT and return payload if valid
async function verifyJWT(token) {
    try {
        const { payload } = await jwtVerify(token, SECRET);
        return payload;
    } catch (e) {
        return null;
    }
}

export async function middleware(request) {
    const token = request.cookies.get("authToken")?.value;
    const verified = token ? await verifyJWT(token) : null;
    // Redirect authenticated users away from auth pages
    if (
        verified?.userId &&
        ["/", "/sign-up", "/sign-in"].includes(request.nextUrl.pathname)
    ) {
        return NextResponse.redirect(new URL("/home", request.url));
    }
    // Redirect unauthenticated users to sign-in for protected routes
    if (
        !verified &&
        ["/interview", "/dashboard", "/home", "/userdata", "/feedback"].some(
            (path) => request.nextUrl.pathname.startsWith(path)
        )
    ) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
}

export const config = {
    // Define paths to apply the middleware
    matcher: [
        "/",
        "/sign-up",
        "/sign-in",
        "/interview/:path*",
        "/dashboard",
        "/home",
        "/userdata",
        "/feedback/:path*",
    ],
};
