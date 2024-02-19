import { NextResponse } from "next/server";
import { FPLTeam, getEmptyFPLTeam } from "../../util/type";

export async function GET(req: Request, {params}: {params: {leagueId: String}}) {
    let url = "https://fantasy.premierleague.com/api/leagues-classic/" + params.leagueId + "/standings";
    let resp = await fetch(url);
    let standings = await resp.json();
    standings['summary'] = addSummaryStats(standings);


    try {
        resp = await fetch("https://fantasy.premierleague.com/api/event-status/");
        // let json = await resp.json();
        // let event = json.status[0].event;
    
        // await addTeamsPointHistory(standings.standings.results, event);
        // standings.standings.results = await addTeamsPointHistory(standings.standings.results, event);
    
        return NextResponse.json({message: standings}, {status: 200})
    } catch (err) {
        console.log(err);
        return NextResponse.json({message: "Error fetching league stats from FPL."}, {status: 500})
    }
    
}

// async function addTeamsPointHistory(teams, currentEvent) {    
//     let events = Array.from({length: currentEvent + 1}, (v, i) => i);
//     console.log('events: ' + events);
//     let teamsPromiseArray = await teams.map(async (team) => {
//         let pointsHistory = [];


//         let previousPoints = 0;
//         for await (const i of events) {
//             console.log('team.entry:' + team.entry);
//             console.log('i: '+ i);
//             if(i==0) pointsHistory.push({gameweek: i, points: 0})
//             else {
//                 let resp = await rateLimitReq(team.entry, i, 0); 

//                 let json = await resp.json().catch((err) => console.log(err + resp.status + JSON.stringify(resp.headers)));
//                 let eventPoints = previousPoints + json.entry_history.points;
//                 previousPoints = eventPoints;
//                 pointsHistory.push({gameweek: i, points: eventPoints});
//             }
            
//         }
        
//         team['pointsHistory'] = pointsHistory;
//         return team;
//     })

//     return await Promise.all(teamsPromiseArray).catch((err) => {
//         console.log(err);
//     });

// }

// async function rateLimitReq(teamEntry, i, retries) {
//     console.log('req: (teamEntry: ' + teamEntry + ', i: ' + i + ', retries: ' + retries + ')')
//     let resp = await fetch("https://fantasy.premierleague.com/api/entry/" + teamEntry + "/event/" + i + "/picks/");
//     if (resp.status === 429) {
//         return rateLimitReq(teamEntry, i, retries + 1);
//     }
//     return resp;
    
// }

function addSummaryStats(standings: {standings: {results: [team: FPLTeam]}}) {
    let teams = standings.standings.results;
    let highestRiser : FPLTeam = getEmptyFPLTeam();
    let lowestFaller : FPLTeam = getEmptyFPLTeam();
    let biggestPoints : FPLTeam = getEmptyFPLTeam();
    let lowestPoints : FPLTeam = getEmptyFPLTeam();
    let first = true;
    teams.forEach((team) => {
        if(first) {
            team.risen = team.last_rank - team.rank_sort;
            team.fallen = team.rank_sort - team.last_rank;
            team.mostPoints = team.event_total;
            team.leastPoints = team.event_total;
            highestRiser  = team;
            lowestFaller = team;
            biggestPoints = team;
            lowestPoints = team;
            first = false;
        } else {
            if(team.last_rank - team.rank_sort > highestRiser.risen) {
                team.risen = team.last_rank - team.rank_sort;
                highestRiser = team;
            }
            if(team.rank_sort - team.last_rank > lowestFaller.fallen) {
                team.fallen = team.rank_sort - team.last_rank;
                lowestFaller = team;
            }
            if(team.event_total > biggestPoints.mostPoints) {
                team.mostPoints = team.event_total;
                biggestPoints = team;
            }
            if(team.event_total < lowestPoints.leastPoints) {
                team.leastPoints = team.event_total;
                lowestPoints = team;
            }
        }
    });

    console.log('awards: ' + JSON.stringify({
        "mostClimbed": highestRiser,
        "mostFallen": lowestFaller,
        "mostPoints": biggestPoints,
        "leastPoints": lowestPoints
    }));
    return {
        "mostClimbed": highestRiser,
        "mostFallen": lowestFaller,
        "mostPoints": biggestPoints,
        "leastPoints": lowestPoints
    };


};