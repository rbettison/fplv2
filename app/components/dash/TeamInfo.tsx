'use client'

import { LeagueContext, LeagueContextType, SelectedTeam, Team } from "@/app/contexts/LeaguesProvider"
import { useContext, useEffect, useRef } from "react"
import PlayerIcon from "./PlayerIcon";
import { useAnimate } from "framer-motion";

const positions = [1,2,3,4];

export default function TeamInfo() {
    const {selectedTeam} = useContext(LeagueContext) as LeagueContextType;
    const scope = useMenuAnimation(selectedTeam);

    const constraintsRef = useRef(null);

    return (
        <>

            <div ref={scope}>
                <div className="info p-4 flex flex-col">
                    <div className="text-3xl text-center underline">
                    {selectedTeam?.teamDetails.entry_name + ' managed by ' + selectedTeam?.teamDetails.player_name}
                    </div>
                    <div className="text-center">
                        <div>{'Gameweek total: ' + selectedTeam?.teamDetails.event_total}</div>
                        <div>{'Overall total: ' + selectedTeam?.teamDetails.total}</div>
                    </div>
                </div>
                <div ref={constraintsRef} className="w-full pitch flex flex-col justify-evenly gap-4 bg-pitch bg-contain bg-no-repeat bg-center">
                    {
                        positions.map((position) => {
                            return (
                                <div className="flex flex-row justify-evenly" key={position}>
                                {selectedTeam?.picks.map((pick) => {
                                if(pick.element_type === position && pick.multiplier != 0) {
                                    return (
                                        <PlayerIcon key={pick.id} pick={pick} dragConstraint={constraintsRef}/>
                                    )
                                }
                                return;})}
                                </div>
                            )
                    })}

                    <div className="mt-2 ml-8">
                        <div className="font-bold mb-4">Substitutes</div>
                        <div className="flex flex-row gap-4">
                        {selectedTeam?.picks.map((pick) => {
                            if(pick.multiplier === 0) {
                                return (
                                    <PlayerIcon key={pick.id} pick={pick} dragConstraint={constraintsRef}/>
                                )
                            }
                            return;
                        })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function useMenuAnimation(selectedTeam: SelectedTeam | null) {
    const [scope, animate] = useAnimate();
  

        useEffect(() => {
            animate(".info", 
                {opacity: [0, 1]}, 
                {type: "spring", bounce: 0.2, bounceDamping: 0.9, duration: 2})
        }, [selectedTeam])
    
    return scope;   
};