'use client'
import Link from "next/link";
import { useState } from "react"
import {signIn} from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import UserInfo from "../global/UserInfo";

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const {data: session} = useSession();

    const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false
            });

            if(res?.error) {
                setError("Invalid Credentials");
                return;
            }

            router.replace("/dash");
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
        {
            session != null ? 
            <UserInfo />
            :
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <input type="text" placeholder="email" onChange={e => setEmail(e.target.value)}></input>
                <input type="password" placeholder="password" onChange={e => setPassword(e.target.value)}></input>
                <button>Log in</button>

                {  
                error && <p>{error}</p>
                }
                <p>Don&apos;t have an account? <Link href="/register" className="underline">Register</Link></p>
            </form>
        }
        </>
    )
}