// import { NextResponse } from "next/server";
// import { jwtVerify } from "jose";

// const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// async function verifyJWT(token) {
//     try {
//         const { payload } = await jwtVerify(token, SECRET);
//         return payload;
//     } catch (e) {
//         console.log("JWT verification failed:", e);
//         return null;
//     }
// }

// export async function middleware(request) {
//     const token = request.cookies.get("authToken")?.value;
//     const verified = token ? await verifyJWT(token) : null;
//     if (
//         verified?.userId &&
//         ["/", "/sign-up", "/sign-in"].includes(request.nextUrl.pathname)
//     ) {
//         return NextResponse.redirect(new URL("/home", request.url));
//     }

//     if (
//         !verified &&
//         ["/interview", "/dashboard", "/home", "/userdata", "/feedback"].some(
//             (path) => request.nextUrl.pathname.startsWith(path)
//         )
//     ) {
//         return NextResponse.redirect(new URL("/sign-in", request.url));
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: [
//         "/",
//         "/sign-up",
//         "/sign-in",
//         "/interview/:path*",
//         "/dashboard",
//         "/home",
//         "/userdata",
//         "/feedback/:path*",
//     ],
// };
