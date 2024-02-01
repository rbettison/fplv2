'use client'
import { Dispatch, SetStateAction, createContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export type LeagueContextType = {
    selectedLeague: LeagueType,
    leagues: LeagueType[],
    removeLocalLeague: (leagueId: string) => void,
    addLocalLeague: (league: LeagueType) => void,
    setSelectedLeague: Dispatch<SetStateAction<LeagueType>>;
}

export const LeagueContext = createContext<LeagueContextType | null>(null);

type LeagueType = {leagueId: string, leagueName: string};

export default function LeagueProvider({children} : {
    children: React.ReactNode
}) {

    const [leagues, setLeagues] = useState<LeagueType[]>([]);
    const [selectedLeague, setSelectedLeague] = useState<LeagueType>({leagueId: "", leagueName: ""});
    const {data: session} = useSession();

    useEffect(() => {

        if(session?.user) {

            fetch("/api/userLeague/" + session?.user?.email, {
                method: "GET",
                headers: {'Content-Type': 'application/json'}
            }).then(async (resp) => {
                let fetchedLeaguesJson = await resp.json();
                console.log('fetchedLeaguesJson: ' + JSON.stringify(fetchedLeaguesJson));
                setLeagues(fetchedLeaguesJson['leagues']);
                setSelectedLeague(fetchedLeaguesJson['leagues'][0]);
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

    return (
        <LeagueContext.Provider value = {{
                                            selectedLeague, 
                                            leagues, 
                                            setSelectedLeague,
                                            addLocalLeague,
                                            removeLocalLeague
                                        }}>
            {children}
        </LeagueContext.Provider>
    )
}