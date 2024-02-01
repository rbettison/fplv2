'use client'

import { LeagueContext, LeagueContextType } from "@/app/contexts/LeaguesProvider"
import { useSession } from "next-auth/react";
import { useContext } from "react"

export default function MyLeagues() {

    const {leagues, removeLocalLeague} = useContext(LeagueContext) as LeagueContextType;
    const {data:session} = useSession();

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        let leagueId = event.currentTarget.value;

        try {
            let resp = await fetch('/api/userLeague/' + session?.user?.email, {
                method: 'DELETE',
                body: JSON.stringify({
                    leagueId: leagueId
                })
            })
            if(resp.ok) {
                removeLocalLeague(leagueId);
                console.log('User league deleted successfully')
            } else {
                console.log('There was a problem deleting the league');
            }
        } catch (err) {
            console.log(err);
        }
        console.log('leagueId: ' + leagueId)
    }

    return (

        <div className="bg-slate-300 p-4 w-1/2 m-auto flex flex-col items-center gap-2">
            <h1 className="font-bold">View and manage current selected leagues. Maximum of 5 leagues can be watched.</h1>
            {leagues.map((league: {leagueId: string, leagueName: string}) => {
                return (
                <div key={league.leagueId} className="flex flex-row items-center gap-4">
                    {league.leagueName}
                    <button onClick={handleClick} value={league.leagueId} className="flex flex-row items-center p-2 bg-red-500 hover:bg-red-600 rounded-lg">
                        Remove
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                    </button>
                </div>
                )
            })}
        </div>
    )

}