import SeasonBrushChart from "./SeasonBrushChart";
import ParentSize from '@visx/responsive/lib/components/ParentSize';

export default function SeasonTracker() {

    return (

        <div className="w-full h-screen mt-8">
            <div className="font-bold text-xl">
                Season Tracker
            </div>
            <div className="p-12 h-5/6">
                <ParentSize>
                        {({width, height}) => 
                            <SeasonBrushChart width={width} height={height}/>
                        }
                </ParentSize>
            </div>
        </div>
    )
}