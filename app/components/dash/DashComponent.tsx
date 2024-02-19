'use client';
import { useContext } from "react";
import { LeagueContext, LeagueContextType } from "@/app/contexts/LeaguesProvider";
import Awards from "./Awards";
import AsItStands from "./AsItStands";
import SeasonTracker from "./SeasonTracker";

export default function DashComponent() {
    const {selectedLeague, gameWeek, pointsHistory, leagues} = useContext(LeagueContext) as LeagueContextType;


    return (
        <div className="min-h-full w-full bg-slate-200 rounded-lg p-5 shadow-md flex flex-col justify-center items-center">
            {leagues.length > 0 ? <><div className="font-bold text-4xl mb-4">{selectedLeague.leagueName}</div>
            <div className="font-semibold text-2xl border-b-2 border-current mb-2">Gameweek {gameWeek} report</div>
            <Awards />
            <AsItStands />
            {
                pointsHistory != null && <SeasonTracker />


            }</> : <div>Add a league to your dashboard to get started.</div>
        }
        </div>
    )
}