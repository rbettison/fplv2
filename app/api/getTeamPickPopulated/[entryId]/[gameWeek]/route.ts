import { NextResponse } from "next/server";

export async function GET(req: Request, {params}: {params: {entryId: String, gameWeek: String}}) {
    
    try {
        let resp = await fetch("https://fantasy.premierleague.com/api/entry/" + params.entryId + "/event/" + params.gameWeek + "/picks/");
        let respJson = await resp.json();
        let picks = respJson.picks;

        let resp2 = await fetch("https://fantasy.premierleague.com/api/bootstrap-static/", {
            cache: 'no-store'
        });
        let resp2Json = await resp2.json();
        let elements = resp2Json.elements;
        let teams = resp2Json.teams;

        // console.log('respJson2.elements: ' + JSON.stringify(elements));
        // console.log('respJson.picks: ' + JSON.stringify(picks));

        let formation = {
            defenders: 0,
            midfielders: 0,
            attackers: 0
        }

        let playerPicks = picks.map((pick: any) => {
            let index = elements.findIndex((el: any) => el.id === pick.element);

            let playerPick = elements[index];

            if(pick.multiplier != 0) {
                if(playerPick.element_type === 2) formation.defenders = formation.defenders + 1;
                else if(playerPick.element_type === 3) formation.midfielders = formation.midfielders + 1;
                else if(playerPick.element_type === 4) formation.attackers = formation.attackers + 1;
            }
            
            playerPick.captain = pick.is_captain;
            playerPick.viceCaptain = pick.is_vice_captain;
            playerPick.multiplier = pick.multiplier; 

            let teamIndex = teams.findIndex((el: any) => el.id === playerPick.team);
            playerPick.team = teams[teamIndex];

            return playerPick;
        })


        return NextResponse.json({message: {picks: playerPicks, formation: formation}}, {status: 200});

    } catch(err) { 
        return NextResponse.json({message: "Error finding entry " + params.entryId + " for gameWeek " + params.gameWeek});
    }

    
}