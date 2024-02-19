'use client'
import { Dispatch, SetStateAction, createContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { DataPoint } from "../components/dash/SeasonBrushChart";

export type LeagueContextType = {
    selectedLeague: LeagueType,
    leagues: LeagueType[],
    removeLocalLeague: (leagueId: string) => void,
    addLocalLeague: (league: LeagueType) => void,
    setSelectedLeagueFn: (league: LeagueType) => void;
    awards: Award[];
    gameWeek: number;
    handleSelectTeam: (team: Team) => void;
    selectedTeam: SelectedTeam | null;
    pointsHistory: PointsHistory[] | null;
}

export const LeagueContext = createContext<LeagueContextType | null>(null);

export type LeagueType = {leagueId: string, leagueName: string, standings?: Team[]};
export type Team = {
    id: number,
    event_total: number,
    player_name: string,
    rank: number,
    last_rank: number, 
    rank_sort: number,
    total: number,
    entry: number,
    entry_name: string,
    risen: number,
    fallen: number,
    mostPoints: number,
    leastPoints: number,
    selected: boolean
}

export type PLPlayer = {
    element_type: number,
    event_points: number,
    first_name: string,
    id: number,
    form: number,
    web_name: string,
    team: PLTeam,
    captain: boolean,
    viceCaptain: boolean,
    multiplier: number,
    in_dreamteam: boolean
}

export type PLTeam = {
    id: number,
    name: string,
    short_name: string,
    strength: number
}

export type SelectedTeam = {
    picks: PLPlayer[],
    formation: {
        attackers: number,
        midfielders: number,
        defenders: number
    },
    teamDetails: Team
}

type Manager = {
    name: string,
    team: number
}
export type Award = {
    id: string,
    manager: Manager,
    value: number,
    title: string,
    description: string,
    svg: React.ReactNode,
    loading: boolean
}
type GameweekAwards = [
    mostPoints: Award,
    leastPoints: Award,
    mostBenched: Award,
    mostClimbed: Award,
    mostFallen: Award,
    mostMoney: Award
]
export type PointsHistory = 
{    player: PLPlayer,
    pointsHistory: DataPoint[] }


const getEmptyAward = (id: string, title: string, description: string, svg: React.ReactNode) => {
    return {
        id: id,
        manager: {name: "", team: 0},
        value: 0,
        title: title, 
        description: description, 
        svg: svg,
        loading: true
    }
}

export default function LeagueProvider({children} : {
    children: React.ReactNode
}) {

    const [awards, setAwards] = useState<Award[]>([
        getEmptyAward("mostPoints", "What a manager, by the way!", "The manager with the biggest haul",
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
            </svg>),
        getEmptyAward("leastPoints", "Bit of a Bogey Week", "The manager that got the least points on the board",
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
            </svg>),
        getEmptyAward("mostBenched", "Losing the Dressing Room", "The manager who benched the wrong players", 
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>),
        getEmptyAward("mostClimbed", "Got that in the Locker", "This team climbed the most spots this week",
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
            </svg>),
       getEmptyAward("mostFallen", "We Need a Reaction!", "The manager who fell the most spots this week",
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
            </svg>),
        getEmptyAward("mostMoney", "Overseas Investment?", "The manager with the deepest coffers.", 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 7.629A3 3 0 0 0 9.017 9.43c-.023.212-.002.425.028.636l.506 3.541a4.5 4.5 0 0 1-.43 2.65L9 16.5l1.539-.513a2.25 2.25 0 0 1 1.422 0l.655.218a2.25 2.25 0 0 0 1.718-.122L15 15.75M8.25 12H12m9 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>)
    ])
    const [leagues, setLeagues] = useState<LeagueType[]>([]);
    const [selectedLeague, setSelectedLeague] = useState<LeagueType>({leagueId: "", leagueName: "", standings: []});
    const [gameWeek, setGameWeek] = useState(0);
    const [selectedTeam, setSelectedTeam] = useState<SelectedTeam | null>(null);
    const [pointsHistory, setPointsHistory] = useState<PointsHistory[] | null>(null);
    const {data: session} = useSession();

    useEffect(() => {
        
        let selectedLeagueStorage  =localStorage.getItem('selectedLeague') 
        if(selectedLeagueStorage != null) {
            const selectedLeagueStoreJson : {leagueName: string, leagueId: string} = JSON.parse(selectedLeagueStorage);
            setSelectedLeagueFn({leagueId: selectedLeagueStoreJson.leagueId, 
                leagueName: selectedLeagueStoreJson.leagueName, standings: []})
        } else {
            setSelectedLeagueFn(leagues[0])
        }
    }, [])

    useEffect(() => {
        if(session?.user) {
            fetch("/api/userLeague/" + session?.user?.email, {
                method: "GET",
                headers: {'Content-Type': 'application/json'}
            }).then(async (resp) => {
                let fetchedLeaguesJson = await resp.json();
                console.log('fetchedLeaguesJson: ' + JSON.stringify(fetchedLeaguesJson));
                setLeagues(fetchedLeaguesJson['leagues']);
                let selectedLeageStorage  =localStorage.getItem('selectedLeague') 
                if(selectedLeageStorage != null && JSON.parse(selectedLeageStorage).leagueId != "") {
                    setSelectedLeagueFn(JSON.parse(selectedLeageStorage));
                } else {
                    setSelectedLeagueFn(fetchedLeaguesJson['leagues'][0]);
                }
            })
        }
    }, [session])

    const addLocalLeague = (leagueToAdd: LeagueType) => {
        const newLeagues : LeagueType[] = [...leagues, leagueToAdd];
        setLeagues(newLeagues);
    }

    const removeLocalLeague = (leagueIdToRemove: string) => {
        const newLeagues : LeagueType[] = leagues.filter(league => league.leagueId != leagueIdToRemove)
        setLeagues(newLeagues);
    }

    const handleSelectTeam = async (team: Team) => {
        console.log('handling select team')

        const newStandings = selectedLeague.standings?.map((currentTeam) => {
            if(currentTeam.id === team.id) {
                currentTeam.selected = true
            }
            else currentTeam.selected = false
            return currentTeam
        })
        console.log('newStandings: ' + JSON.stringify(newStandings));
        setSelectedLeague(prevState => ({
            ...prevState,
            standings: newStandings
        }));

        let resp = await fetch("/api/getTeamPickPopulated/" + team.entry + "/" + gameWeek)
        let respJson = await resp.json();
        console.log('respJson: ' + JSON.stringify(respJson));
        setSelectedTeam({picks: respJson.message.picks, formation: respJson.message.formation, teamDetails: team});

    }

    const setSelectedLeagueFn = async (league: LeagueType) => {
        console.log('setting selected League: ' + JSON.stringify(league));
        awards.forEach((award) => award.loading = true);
        try {

            let resp = await fetch("/api/getGameWeek");
            let respJson = await resp.json();
            let newCurrentGameWeek = respJson.currentGameWeek;
            await setGameWeek(newCurrentGameWeek);

            fetch("/api/getPointsHistory/" + league.leagueId + "/" + newCurrentGameWeek).then(async (resp) => {
                console.log(resp);
                let jsonResp = await resp.json();
                console.log('points history: ' + JSON.stringify(jsonResp));
                setPointsHistory(jsonResp.message);
            })
            
            fetch("/api/getLeagueDetails/" + league.leagueId, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            }).then(async (resp) => {
                let respJson = await resp.json();

                let newAwards = awards.map((award) => {
                    if(respJson.message.summary[award.id] != null) {
                        award.manager = {name: respJson.message.summary[award.id].player_name, 
                            team: respJson.message.summary[award.id].entry}
                        award.loading = false
                    }
                    return award;
                })
                await setAwards(newAwards);
                await localStorage.setItem('selectedLeague', JSON.stringify(league))
                league.standings = respJson.message.standings.results;
                await setSelectedLeague(league);

                fetch("/api/getTeamLevelDetails/" + league.leagueId + "/" + newCurrentGameWeek, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
                }).then(async (resp) => {
                    if(resp.ok) {
                        let respJson = await resp.json();
                        console.log('award json: ' + JSON.stringify(respJson))
    
                        newAwards = newAwards.map((award) => {
                            if(respJson.message[award.id] != null) {
                                console.log('award.id: ' + award.id);
                                console.log('respJson.message[award.id].player_name: ' + respJson.message[award.id].player_name)
                                award.manager = {name: respJson.message[award.id].player_name, team: respJson.message[award.id].entry}
                                award.loading = false
                            }
                            return award;
                        })
                            
                        await setAwards(newAwards);
                    }
                })
            })
        } catch (err) {
            console.log(err);
        }
        
    }

    return (
        <LeagueContext.Provider value = {{
                                            selectedLeague, 
                                            leagues, 
                                            setSelectedLeagueFn,
                                            addLocalLeague,
                                            removeLocalLeague,
                                            awards,
                                            gameWeek,
                                            handleSelectTeam,
                                            selectedTeam,
                                            pointsHistory
                                        }}>
            {children}
        </LeagueContext.Provider>
    )
}