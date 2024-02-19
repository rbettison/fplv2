'use client';
import { useContext, useEffect } from "react";

import { LeagueContext, LeagueContextType, LeagueType, Team } from "@/app/contexts/LeaguesProvider";
import { motion, stagger, useAnimate } from "framer-motion";


export default function Awards() {

    const {awards, selectedLeague, handleSelectTeam} = useContext(LeagueContext) as LeagueContextType;
    const scope = useMenuAnimation(selectedLeague);

    const handleAwardClick = (entry: number) => {
        let teamIndex = selectedLeague.standings?.findIndex((team: Team) => {
            return team.entry === entry;
        })
        if(teamIndex != -1 && teamIndex!=undefined && selectedLeague.standings) {
            handleSelectTeam(selectedLeague.standings[teamIndex]);
        }
    }

    return (

        <div ref={scope} className="w-full">
        <div className="font-bold text-xl my-8">Awards</div>
        <motion.div 
            className="flex flex-row flex-wrap p-4 justify-evenly mt-4">
                {
                    awards.map((tile, index) => 
                    <motion.div 
                        whileHover={{scale: 1.2}}
                        initial={{scale: 1}}
                        key={index}
                        id="tile"
                        onClick={() => handleAwardClick(tile.manager.team)}
                        className="cursor-pointer awardTile w-64 h-48 bg-slate-200 
                            hover:bg-slate-100 
                            shadow-sm p-2 flex flex-col justify-center 
                            items-center text-center gap-2 rounded-lg
                        border-2 border-current">
                        
                        <div className="font-bold text-2xl">
                            {tile.loading ? 
                            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3"/><g><circle cx="4" cy="12" r="3"/><circle cx="20" cy="12" r="3"/><animateTransform attributeName="transform" type="rotate" calcMode="spline" dur="1s" keySplines=".36,.6,.31,1;.36,.6,.31,1" values="0 12 12;180 12 12;360 12 12" repeatCount="indefinite"/></g></svg>
                            : tile.manager.name}
                        </div>
                        <div className="font-bold text-lg">
                            {tile.title}
                        </div>
                        <div>
                            {tile.svg}
                        </div>
                        <div className="text-sm">
                            {tile.description}
                        </div>
                    </motion.div>)
                }
        </motion.div>
        </div>
    )
}

function useMenuAnimation(selectedLeague: LeagueType) {
    const [scope, animate] = useAnimate();
    const staggerAwardTiles = stagger(0.1, { startDelay: 0 });
  
    useEffect(() => {
        animate(".awardTile", 
            {opacity: [0, 1], scale: [0, 1]}, 
            {type: "spring", bounce: 0.2, bounceDamping: 0.9, duration: 1, delay: staggerAwardTiles})
    }, [selectedLeague.leagueId])

    return scope;   
};