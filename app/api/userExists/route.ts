import { userExists } from "@/server/service/userService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    try {
        const {email} = await req.json();
        const user = await userExists(email);
        console.log('user: ' + user);
        return NextResponse.json(user, {status: 201})
    } catch (err) {
        return NextResponse.json({message: "Error occurred while registering the user"}, {status: 500})
    }

}

