import { NextResponse } from "next/server";

export async function GET(req: Request, {params}: {params: {leagueId: String}}) {
    const leagueId = params.leagueId;
    try {
        let leagueResp = await fetch("https://fantasy.premierleague.com/api/leagues-classic/" + leagueId + "/standings/")

        if(leagueResp.ok) {
            let leagueRespJson = await leagueResp.json();
            console.log(JSON.stringify(leagueRespJson));
            return NextResponse.json({message: leagueRespJson}, {status: 200});
        } else {
            return NextResponse.json({message: "League not found"}, {status: 404})
        }
    } catch (err) {
        console.log(err);
    }
}