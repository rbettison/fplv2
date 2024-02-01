'use client';

import { LeagueContext, LeagueContextType } from "@/app/contexts/LeaguesProvider";
import { useSession } from "next-auth/react";
import { useContext, useState } from "react";

export default function SearchLeague() {
    const {addLocalLeague} = useContext(LeagueContext) as LeagueContextType;
    const [leagueFound, setLeagueFound] = useState("");
    const [leagueFoundId, setLeagueFoundId] = useState("");
    const [leagueIdSearch, setLeagueIdSearch] = useState("");
    const [leagueAddError, setLeagueAddError] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const {data: session} = useSession();

    const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            let leagueResp = await fetch("/api/findLeague/" + leagueIdSearch, {
                method: 'GET'
            })
    
            if(leagueResp.status === 200) {
                let leagueJson = await leagueResp.json();
                console.log('leagueJson: ' + JSON.stringify(leagueJson));
                setLeagueFound(leagueJson.message.league.name);
                setLeagueFoundId(leagueIdSearch);
                setError("");
            } else {
                setError("League not found. Try again.")
                setLeagueFound("");
                setLeagueFoundId("");
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleClick = async () => {
        try {
            let resp = await fetch("/api/userLeague/" + session?.user?.email, 
            {
                method: "POST",
                body: JSON.stringify({
                    leagueId: leagueFoundId,
                    leagueName: leagueFound
                })
            })
            let respJson = await resp.json()
            if(resp.ok) {
                console.log('leagueAdded!')
                setMessage(respJson.message);
                setLeagueAddError("")
                addLocalLeague({leagueId: leagueFoundId, leagueName: leagueFound})
            } else {
                setMessage("");
                setLeagueAddError(respJson.message);
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
        <div className="flex flex-col m-auto text-center w-1/2 bg-slate-100 rounded-lg p-4">
            <h1 className="text-2xl">Search for a league to add it to your dashboard.</h1>

                <form onSubmit={handleSubmit} className="flex flex-col p-4 gap-8 jutify-center items-center">
                    <div className="justify-center flex flex-row gap-4">
                    <label className="font-bold text-l">League ID: </label>
                    <input type="text" placeholder="League ID" onChange={(event) => setLeagueIdSearch(event.target.value)}></input>
                    </div>
                    <button className="flex flex-row justify-center gap-2 p-2 bg-slate-200 hover:bg-slate-100 rounded-lg w-1/4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        Search
                    </button>
                </form>
                
            {
                error && 
                <div className="font-bold text-red-600">
                    {error}
                </div>
            }
            {
                leagueFound && 
                <>
                <div className="flex flex-row gap-2 justify-center items-center">
                    <div className="text-xl font-bold">{leagueFound}</div>
                    <button onClick={handleClick} className="flex flex-row justify-center gap-4 p-2 bg-slate-300 rounded-lg hover:bg-slate-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add to Dash
                    </button>
                    
                    
                </div>
                {leagueAddError && 
                    <div className="font-bold text-red-600">
                        {leagueAddError}
                    </div>
                    }
                {message && 
                    <div className="font-bold text-green-600">
                        {message}
                    </div>
                    }
                    </>
            }

        </div>
        
        </>
    )
}