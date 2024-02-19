'use client'

import { LeagueContext, LeagueContextType, LeagueType } from "@/app/contexts/LeaguesProvider"
import { useContext, useEffect } from "react"
import TableEntry from "./TableEntry";
import { delay, motion, stagger, useAnimate } from "framer-motion";

export default function Table() {

    const {selectedLeague} = useContext(LeagueContext) as LeagueContextType;
    const scope = useMenuAnimation(selectedLeague);

    return (
        <div ref={scope} className="overflow-y-scroll max-h-[800px]">
        <motion.div 
            // initial={{x:-1000, opacity: 0}}
            animate={{x: 0, opacity: 1}}
            transition={{duration: 2}}
            className="m-4 p-4 rounded-lg border-slate-200 border-2">
                        {selectedLeague.standings != null && selectedLeague.standings.map((team) => {
                            return (
                                <motion.div key={team.entry} className="tableEntry">
                                    <TableEntry team={team}/> 
                                </motion.div>
                            )
                        })}
        </motion.div>
        </div>

    )
}

function useMenuAnimation(selectedLeague: LeagueType) {
    const [scope, animate] = useAnimate();
    const staggerAwardTiles = stagger(0.05, { startDelay: 0 });
  
    useEffect(() => {
        console.log('document.getElementsByClassName("tableEntry")' + document.getElementsByClassName("tableEntry").length)
        if(document.getElementsByClassName("tableEntry").length > 0) {
            console.log('document.getElementsByClassName("tableEntry")' + document.getElementsByClassName("tableEntry"))
            animate(".tableEntry", 
            {opacity: [0, 1]}, 
            {type: "spring", bounce: 0.2, bounceDamping: 0.9, duration: 1, delay: staggerAwardTiles})
        }
    }, [selectedLeague.leagueId])

    return scope;   
};