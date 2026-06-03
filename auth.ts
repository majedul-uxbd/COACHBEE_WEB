import axios from 'axios';
import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

declare module 'next-auth' {
    interface User {
        user_id: number;
        fullName: string;
        email: string;
        role: string;
        profile_img: string | null;
    }
    interface Session {
        user: User & { id: string };
    }
}

const credentialsConfig = CredentialsProvider({
    name: 'Credentials',
    credentials: {
        email: { label: 'Email' },
        password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
                {
                    lg: 'en',
                    email: credentials.email,
                    password: credentials.password,
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    httpsAgent: new (require('https').Agent)({
                        rejectUnauthorized: false,
                    }),
                },
            );
            const { status, data } = response;
            if (data.status === 'success') {
                // console.log('data 1', data);
                // console.log("status", status)
                return {
                    id: data?.data?.token,
                    user_id: data?.data?.id,
                    fullName: data?.data?.fullName,
                    email: data?.data?.email,
                    role: data?.data?.role,
                    profile_img: data?.data?.image_url,
                };
            }
            return null;
        } catch (error) {
            // console.error("Login error:", error)
            return null;
        }
    },
});

const config = {
    providers: [credentialsConfig],
    callbacks: {
        async session({ session, token }) {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/get-user`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token.sub}`,
                        'Content-Type': 'application/json', // Ensures the server knows you're sending JSON
                    },
                },
            );

            if (response.ok) {
                const responseData = await response.json();

                if (session.user) {
                    session.user.user_id = responseData?.data?.id;
                    session.user.fullName = responseData?.data.full_name;
                    session.user.email = responseData?.data.email;
                    session.user.role = responseData?.data.role;
                    session.user.profile_img = responseData?.data.image_url;
                    session.user.id = token.sub!;
                }
            }

            // //console.log("Session:", session)
            return session;
        },
        async jwt({ token }) {
            // //console.log("Token:", token)
            return token;
        },
    },
    session: { strategy: 'jwt' },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
