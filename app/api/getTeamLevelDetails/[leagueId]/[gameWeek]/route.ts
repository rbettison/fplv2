import { NextResponse } from "next/server";
import { FPLTeam, getEmptyFPLTeam } from "../../../util/type";

export async function GET(req: Request, {params}: {params: {leagueId: String, gameWeek: String}}) {
    let url = "https://fantasy.premierleague.com/api/leagues-classic/" + params.leagueId + "/standings";
    let resp = await fetch(url);
    let respJson = await resp.json();
    console.log("gameWeek/leagueId" + params.gameWeek + "/" + params.leagueId)

    try {
        let teamLevelDetails = {
            "mostMoney": getEmptyFPLTeam(),
            "mostBenched": getEmptyFPLTeam()
        }
        const teamDetails: FPLTeam[] = respJson.standings.results.map(async (team: FPLTeam) => {
    
            let resp = await fetch("https://fantasy.premierleague.com/api/entry/" + team.entry + "/event/"+params.gameWeek+"/picks/")
            let teamDetail = await resp.json();

            team.entry_history = teamDetail.entry_history;
            return team;
            
        })

        let isFirst = true;
        return Promise.all(teamDetails).then((teamDetails: FPLTeam[]) => {

            teamDetails.forEach((teamDetail: FPLTeam) => {
                if(isFirst) {
                    teamLevelDetails.mostMoney = teamDetail;
                    teamLevelDetails.mostBenched = teamDetail;
                    isFirst = false;
                    return;
                }
                console.log('teamDetail: ' + JSON.stringify(teamDetail))
    
                if(teamDetail.entry_history.bank + teamDetail.entry_history.value > teamLevelDetails.mostMoney.entry_history.bank + teamLevelDetails.mostMoney.entry_history.value) {
                    teamLevelDetails.mostMoney = teamDetail
                }
                if(teamDetail.entry_history.points_on_bench > teamLevelDetails.mostBenched.entry_history.points_on_bench) {
                    teamLevelDetails.mostBenched = teamDetail
                }
            })
            console.log('teamLevelDetails: ' + JSON.stringify(teamLevelDetails))
            return NextResponse.json({message: teamLevelDetails}, {status: 200});
            
        })
    
    } catch (err) {
        console.log(err);
        return NextResponse.json({message: err}, {status: 500})
    }
    

    
}