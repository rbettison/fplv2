import User from "@/server/db/entities/User";
import { userLeagues } from "@/server/service/userService"
import { NextResponse } from "next/server";

export async function GET(req: Request, {params}: {params: {email: String}}) {
    const email = params.email;
    try {
        let leagues = await userLeagues(email);
        return NextResponse.json(leagues);
    } catch (err) {
        console.log(err);
    }
}

export async function DELETE(req: Request, {params}: {params: {email: String}}) {
    const email = params.email;

    const {leagueId} = await req.json();

    try {
        let leagues = await userLeagues(email);
        
        let leagueExists = false;
        leagues['leagues'].forEach((league: {leagueId: string, leagueName: string}) => {
            if(league.leagueId === leagueId) {
                console.log("League matches current league in list, not addding")
                leagueExists = true;
            }
        })
        if(!leagueExists) return NextResponse.json({message: "League is not in dashboard already."}, {status: 400})

        let newLeagues = leagues['leagues'].filter((league: {leagueId: string, leagueName: string}) => league.leagueId!=leagueId)
        let newUser = await User.updateOne({email, leagues: newLeagues})

        return NextResponse.json({message: "League successfully removed."}, {status: 200});
    } catch (err) {
        console.log(err);
        return NextResponse.json({message: "Error ocurred while removing league from dashboard."}, {status: 500})
    }
}

export async function POST(req: Request, {params}: {params: {email: String}}) {
    const email = params.email;

    const {leagueId, leagueName} = await req.json();

    try {
        let leagues = await userLeagues(email);
        
        let leagueExists = false;
        leagues['leagues'].forEach((league: {leagueId: string, leagueName: string}) => {
            if(league.leagueId === leagueId) {
                console.log("League matches current league in list, not addding")
                leagueExists = true;
            }
        })
        if(leagueExists) return NextResponse.json({message: "League has already been added to the dash."}, {status: 400})

        let newLeagues = [...leagues['leagues'], {leagueName: leagueName, leagueId: leagueId}];
        let newUser = await User.updateOne({email, leagues: newLeagues})

        return NextResponse.json({message: "League successfully added."}, {status: 200});
    } catch (err) {
        console.log(err);
        return NextResponse.json({message: "Error ocurred while adding league to dashboard."}, {status: 500})
    }
}