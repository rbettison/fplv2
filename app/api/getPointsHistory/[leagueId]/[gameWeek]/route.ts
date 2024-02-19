import { NextResponse } from "next/server";

export async function GET(req: Request, {params}: {params: {leagueId: String, gameWeek: number}}) {


    console.log('leagueId: ' + params.leagueId + ", gameWeek: " + params.gameWeek);
    let url = "https://fantasy.premierleague.com/api/leagues-classic/" + params.leagueId + "/standings";
    let resp = await fetch(url);
    let standings = await resp.json();

    try {
        let results = await addTeamsPointHistory(standings.standings.results, params.gameWeek);
        return NextResponse.json({message: results}, {status: 200})
    } catch (err) {
        console.log(err);
        return NextResponse.json({message: "There was an error in getting the team history"}, {status: 500})
    }

}


async function addTeamsPointHistory(teams: [{entry: number, pointsHistory: {week: number, points: number}[]}], currentEvent: number) {    
    console.log('currentEvent: ' + currentEvent);
    
    let events = Array.from({length: currentEvent}, (v, i) => i + 1);

    console.log('events: ' + events);
    let teamsPromiseArray = teams.map(async (team) => {
        let pointsHistory = [];


        let previousPoints = 0;
        for await (const i of events) {
            // console.log('team.entry:' + team.entry);
            // console.log('i: '+ i);
            if(i==0) pointsHistory.push({week: i, points: 0})
            else {
                let resp = await rateLimitReq(team.entry, i, 0); 
                // try {
                    let json = await resp.json().catch((err) => console.log(err + resp.status + JSON.stringify(resp.headers)));
                    let eventPoints : number = previousPoints + json.entry_history.points;
                    previousPoints = eventPoints;
                    pointsHistory.push({week: i, points: eventPoints});
                // } catch (err) {
                //     console.log(err);
                // }
                
            }
            
        }
        
        team['pointsHistory'] = pointsHistory;
        return team;
    })

    let array =  await Promise.all(teamsPromiseArray).catch((err) => {
        console.log(err);
    });

    console.log('promise array: ' + array);
    return array;

}

async function rateLimitReq(teamEntry: number, i: number, retries: number) {
    console.log('req: (teamEntry: ' + teamEntry + ', i: ' + i + ', retries: ' + retries + ')')
    let resp = await fetch("https://fantasy.premierleague.com/api/entry/" + teamEntry + "/event/" + i + "/picks/");
    if (resp.status === 429) {
        return rateLimitReq(teamEntry, i, retries + 1);
    }
    return resp;
}