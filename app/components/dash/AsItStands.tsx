import Table from "./Table";
import TeamInfo from "./TeamInfo";


export default function AsItStands() {


    return (
        <>
        <div className="w-full">
            <div className="font-bold place-self-left text-xl my-8">As It Stands</div>
            <div className="grid grid-cols-2 grid-rows-1 bg-slate-300 rounded-lg w-full">
                <Table />
                <TeamInfo />
            </div>
            </div>
        </>
    )
}