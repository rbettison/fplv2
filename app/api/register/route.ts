import { NextResponse } from "next/server";
import {createUser} from "@/server/service/userService";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {

    try {
        const {name, email, password} = await req.json();
        const hashedPassword = await bcrypt.hash(password, 10);
        await createUser({name, email, password: hashedPassword})


        return NextResponse.json({message: "User registered."}, {status: 201})
    } catch (err) {
        return NextResponse.json({message: "Error occurred while registering the user"}, {status: 500})

    }
}