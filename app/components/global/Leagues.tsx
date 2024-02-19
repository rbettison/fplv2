'use client'
import { useContext } from "react"
import { LeagueContext, LeagueContextType } from "@/app/contexts/LeaguesProvider"
import Link from "next/link";

export default function Leagues() {

    const {leagues, selectedLeague, setSelectedLeagueFn} = useContext(LeagueContext) as LeagueContextType;
    console.log('leagues: ' + leagues);
    console.log('selectedLeague: ' + selectedLeague);

    return (
        <>
        <div className="flex flex-row justify-between p-4 items-center">
        <div>
        <label className="font-bold text-xl">Current league: </label>
        <select onChange={(event) => {
            console.log('event.target.value: ' + event.target.value);
            console.log('event.currentTarget.name: ' + event.currentTarget)
            setSelectedLeagueFn({leagueId: event.target.value, leagueName: leagues.filter((league) => league.leagueId === event.target.value)[0].leagueName })
        }} value={selectedLeague.leagueId}>
            {
                leagues.map((league) => {
                return (
                <option value={league.leagueId} key={league.leagueName}>
                    {league.leagueName}
                </option>);
                })
            }
        </select>
        </div>
        <Link href="/dash/addLeague" className="flex flex-row gap-2 bg-slate-200 p-4 rounded-xl hover:bg-slate-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <p className="">
                Add League
            </p>
        </Link>
        </div>
        
        </>

    )
}