import { LeagueContext, LeagueContextType, PLPlayer, SelectedTeam, Team } from "@/app/contexts/LeaguesProvider";
import CopyrightIcon from '@mui/icons-material/Copyright';
import Man4Icon from '@mui/icons-material/Man4';
import { motion, useAnimate, useDragControls } from "framer-motion";
import { MutableRefObject, PointerEvent, useContext, useEffect } from "react";

export default function PlayerIcon({pick, dragConstraint}:{pick: PLPlayer, dragConstraint: MutableRefObject<null>}) {

    const {selectedTeam} = useContext(LeagueContext) as LeagueContextType;
    const colours : { [key: string]: string; } = {
        'ARS': '#EF0107',
        'AVL': '#670E36',
        'BOU': '#DA291C',
        'BHA': '#DA291C',
        'BUR': '#6C1D45',
        'CHE': '#034694',
        'CRY': '#1B458F',
        'EVE': '#003399',
        'LEI': '#003090',
        'LIV': '#C8102E',
        'MCI': '#6CABDD',
        'MNU': '#DA291C',
        'NEW': '#241F20',
        'NCH': '#FFF200',
        'SHU': '#FFF200',
        'SOU': '#D71920',
        'TOT': '#132257',
        'WAT': '#132257',
        'WHU': '#7A263A',
        'WOL': '#FDB913'
    }

    const controls = useDragControls();
    const scope = useMenuAnimation(selectedTeam);


    function startDrag(event: PointerEvent<HTMLDivElement>) {
        controls.start(event)
    }

    return (
        <div ref={scope}>
        <motion.div 
            drag
            onPointerDown={startDrag}
            dragConstraints={dragConstraint}
            dragControls={controls}
            className="player cursor-move flex flex-col justify-center items-center relative">
            <div className="font-bold text-lg">{pick.web_name}</div>
            <div>{pick.team.short_name}</div>
            <div>{pick.event_points}</div>
            {pick.captain && <CopyrightIcon htmlColor="#ffffff" className="absolute -top-5 -right-5"/>}
            {pick.in_dreamteam && 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#d2d900" className="absolute -top-5 -left-5 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
            </svg>
            }
            <div>
                <Man4Icon htmlColor={colours[pick.team.short_name]} />
            </div>

        </motion.div>
        </div>
    )
}

function useMenuAnimation(selectedTeam: SelectedTeam | null) {
    const [scope, animate] = useAnimate();
  

        useEffect(() => {
            animate(".player", 
                {x: 0, y: 0}, 
                {type: "spring", bounce: 0.2, bounceDamping: 0.9, duration: 0})
        }, [selectedTeam, animate])


    return scope;   
};

