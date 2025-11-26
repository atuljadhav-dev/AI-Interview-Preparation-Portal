import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyJWT(token) {
    try {
        const { payload } = await jwtVerify(token, SECRET);
        console.log(payload);
        return payload;
    } catch (e) {
        return null;
    }
}

export async function middleware(request) {
    const token = request.cookies.get("authToken")?.value;
    const verified = token ? await verifyJWT(token) : null;
    console.log("Verified:", verified);
    if (
        verified?.userId &&
        ["/", "/sign-up", "/sign-in"].includes(request.nextUrl.pathname)
    ) {
        console.log("Redirecting to /home");
        return NextResponse.redirect(new URL("/home", request.url));
    }

    if (
        !verified &&
        ["/interview", "/dashboard", "/home", "/userdata", "/feedback"].some(
            (path) => request.nextUrl.pathname.startsWith(path)
        )
    ) {
        console.log("Redirecting to /sign-in");
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
}

export const config = {
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
