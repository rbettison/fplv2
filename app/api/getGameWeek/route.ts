import { NextResponse } from "next/server";

export async function GET(req: Request) {
    let url = "https://fantasy.premierleague.com/api/bootstrap-static/";
    
    try {
        let resp = await fetch(url, {
            cache: 'no-store'
        });
        let respJson = await resp.json();


        let currentEvent = respJson.events.findIndex((event : {average_entry_score: number}, index: number) => event.average_entry_score === 0)

        console.log('respJson: ' + JSON.stringify(respJson.events.length))

        return NextResponse.json({currentGameWeek: currentEvent}, {status: 200})
    } catch (err) {
        console.log('here at the error')
        console.log(err);
        return NextResponse.json({message: "Error fetching current gameweek."}, {status: 500})
    }
    
}