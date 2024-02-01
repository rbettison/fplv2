'server'
import NextAuth, { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import CredentialsProvider from 'next-auth/providers/credentials';
import clientPromise from "@/server/db/mongoAdapterConn";
import connectToDatabase from "@/server/db/mongoConn";
import User from "@/server/db/entities/User";
import bcrypt from "bcryptjs";

const OPTIONS: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise, {
        collections: {
            Users: 'users'
        },
        databaseName: 'fpl'
    }),
    debug: true,
    pages: {
        signIn: "/login"
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: {
                    label: "Username:",
                    type: "text",
                    placeholder: "enter username"
                },
                password: {
                    label: "Password",
                    type: "text", 
                    placeholder: "enter password"
                }
            },
            async authorize(credentials) {
                // const {email, password} = credentials;

                const email = credentials?.email;
                const password = credentials?.password

                try {
                    await connectToDatabase();
                    const user = await User.findOne({email});

                    if(!user) {
                        return null
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if(!passwordsMatch) {
                        return null;
                    }

                    return user;

                } catch(err) {
                    console.log(err);
                }

            }
        })
    ],
    session: {
        strategy: "jwt"            
    },
    secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(OPTIONS);
export {handler as GET, handler as POST}