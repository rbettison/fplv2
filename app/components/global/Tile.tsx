'use client'

import { LeagueContext, LeagueContextType } from "@/app/contexts/LeaguesProvider"
import { animate, motion } from "framer-motion"
import { useContext, useEffect } from "react"

export default function Tile({props}: 
            {props: {
                    title: string, 
                    description: string, 
                    svg: React.ReactNode,
                    indexDelay: number
                    }
            }) {

    const {selectedLeague} = useContext(LeagueContext) as LeagueContextType;

    // useEffect(() => {
    //     const tile : HTMLElement | null = document.getElementById("tile");
    //     console.log('tile: ' + tile)
    //     if(tile!=null) {
    //         animate(tile, {scale: [0.4, 1], rotate: [360, 0]}, {duration: 0.2, bounce: 100})
    //     }
    // }, [selectedLeague])

    const variant = {
        reload: {
          opacity: [0,1],
          rotate: [0, 360]
        },
    }


    return(
        <motion.div 
        variants={variant}
        initial="hidden"
        animate="reload"
            id="tile"
            className="w-64 h-48 bg-slate-200 hover:bg-slate-100 shadow-sm p-2 flex flex-col justify-center items-center text-center gap-2 rounded-lg
            border-2 border-current">
            <div className="font-bold text-lg">
                {props.title}
            </div>
            <div>
                {props.svg}
            </div>
            <div className="text-sm">
                {props.description}
            </div>
        </motion.div>
    )
}