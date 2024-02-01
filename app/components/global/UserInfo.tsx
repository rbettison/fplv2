'use client'
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function UserInfo() {

    const {data: session} = useSession();

    return (
        <>
        <div className="text-2xl text-center mb-8">
            <div>
                <span className="font-bold">Name:</span> <span>{session?.user?.name}</span>
            </div>
            <div>
             <span className="font-bold">Email:</span> <span>{session?.user?.email}</span>
            </div>
            </div>

            <button className="p-2 bg-red-400 font-bold rounded-xl" onClick={() => signOut()}>
                Sign out
            </button>
        </>
    );
}