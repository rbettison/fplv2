'use client'

import Link from "next/link";
import { useState } from "react"
import { useRouter } from "next/navigation";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("")

    const router = useRouter();

    const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(!name || !email || !password) {
            setError("All fields are necessary!");
            return;
        } 
        try {

        const resUserExists = await fetch("/api/userExists", {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email: email
            })
        })
        const user = await resUserExists.json();
        console.log(user);
        if(user != null) {
            console.log(user);
            setError("User with this email already exists!")
            return;
        }
        
        const res = await fetch("/api/register", {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                  name: name,
                  email: email,
                  password: password  
                })
            });
            if (res.ok) {
                console.log("User created successfully!")
                let form = event.target as HTMLFormElement;
                form.reset();
                router.push("/login");
            } else {
                console.log("User registration failed.")
                setError("User registration failed, please try again.")
            }
            
        } catch (err) {
            console.log("Error during user registration: " + err)
        }

    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input type="text" placeholder="name" onChange={e => setName(e.target.value)}></input>
            <input type="text" placeholder="email" onChange={e => setEmail(e.target.value)}></input>
            <input type="password" placeholder="password" onChange={e => setPassword(e.target.value)}></input>
            <button>register</button>

            {  
            error && <p>{error}</p>
            }
            <p>Already have an account? <Link href="login" className="underline">Log in</Link></p>
        </form>
    )
}