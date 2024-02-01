import DashComponent from "../components/dash/DashComponent";
import Leagues from "../components/global/Leagues";

export default function Dash() {
    return (
        <div className="h-screen mx-4">
            <Leagues />
            <DashComponent />
        </div>
    )
}