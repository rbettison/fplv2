'use client'
import { LeagueContext, LeagueContextType, Team } from "@/app/contexts/LeaguesProvider";
import { useContext } from "react";

export default function TableEntry({team} : {team: Team}) {

    const {handleSelectTeam} = useContext(LeagueContext) as LeagueContextType;

    const handleSelect = () => {
        handleSelectTeam(team);
    }

    return (
        <div key={team.entry} className={`${team.selected && "bg-slate-100 rounded-lg"} p-2 border-blue-100 border-b-2 flex flex-row justify-between hover:bg-slate-200 cursor-pointer`} onClick={handleSelect}>
            <div>{team.rank} <span className={`${team.selected && "font-bold"} text-xl`}>{team.player_name + ', ' + team.entry_name}</span></div> 
             
            <div className="font-bold flex flex-row gap-1">
                {team.total}
                {team.fallen 
                 &&
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#f54242" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>}
                {team.risen &&
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#42f554" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                    </svg>}
                {!team.fallen && !team.risen &&
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
                    </svg>}
            </div> 

            
        </div>
    )
}