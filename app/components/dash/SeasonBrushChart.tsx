'use client'
import { Brush } from "@visx/brush";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { max, min } from '@visx/vendor/d3-array';
import BaseBrush from "@visx/brush/lib/BaseBrush";
import { BrushHandleRenderProps } from "@visx/brush/lib/BrushHandle";
import { Bounds } from '@visx/brush/lib/types';
import LineChart from "../charts/LineChart";
import { GridRows, GridColumns } from '@visx/grid';
import { LinearGradient } from '@visx/gradient';
import { GradientTealBlue } from '@visx/gradient';
import { motion } from "framer-motion";
import { LeagueContext, LeagueContextType } from "@/app/contexts/LeaguesProvider";

const brushMargin = { top: 10, bottom: 15, left: 50, right: 20 };
const chartSeparation = 60;
const PATTERN_ID = 'brush_pattern';
const GRADIENT_ID = 'brush_gradient';
export const accentColor = '#00023f';
export const background = '#cdd5e0';
export const background2 = '#af8baf';
const selectedBrushStyle = {
  fill: `url(#${PATTERN_ID})`,
  stroke: 'white',
};

export type DataPoint = {week: number, points: number}

export type BrushProps = {
    width: number;
    height: number;
    margin?: { top: number; right: number; bottom: number; left: number };
    compact?: boolean;
  };

export default function SeasonTracker({compact = false,
    width,
    height,
    margin = {
      top: 20,
      left: 50,
      bottom: 20,
      right: 20,
    }}: BrushProps) {

    const {pointsHistory} = useContext(LeagueContext) as LeagueContextType;

    const [data, setData] = useState<DataPoint[][] | undefined>(pointsHistory?.map((p) => p.pointsHistory));

    
    // const data : DataPoint[][] = [[{week: 0, points: 0}, {week: 1, points: 56},{week: 2, points: 143}, {week: 3, points: 145}, {week: 4, points: 151}, {week: 5, points: 155},{week: 6, points: 230},{week: 7, points: 401},
    //     {week: 8, points: 460},{week: 9, points: 490},{week: 10, points: 520},{week: 11, points: 550},{week: 12, points: 560},
    //     {week: 13, points: 630},{week: 14, points: 701},{week: 15, points: 750},{week: 16, points: 770},{week: 17, points: 790}], 
    //     [{week: 0, points: 0},{week: 1, points: 34},{week: 2, points: 90},{week: 3, points: 145}, {week: 4, points: 151},{week: 5, points: 210},{week: 6, points: 355},{week: 7, points: 430},
    //         {week: 8, points: 455},{week: 9, points: 510},{week: 10, points: 540},{week: 11, points: 570},{week: 12, points: 620},
    //         {week: 13, points: 630},{week: 14, points: 680},{week: 15, points: 740},{week: 16, points: 770},{week: 17, points: 800}],
    //         [{week: 0, points: 0},{week: 1, points: 12},{week: 2, points: 50},{week: 3, points: 145}, {week: 4, points: 151},{week: 5, points: 60},{week: 6, points: 200},{week: 7, points: 250},
    //             {week: 8, points: 390},{week: 9, points: 490},{week: 10, points: 505},{week: 11, points: 650},{week: 12, points: 660},
    //             {week: 13, points: 661},{week: 14, points: 790},{week: 15, points: 795},{week: 16, points: 900},{week: 17, points: 910}]]

    const [filteredTeamData, setFilteredTeamData] = useState(data)

    useEffect(() => {
      setData(pointsHistory?.map((p) => p.pointsHistory));
      setFilteredTeamData(pointsHistory?.map((p) => p.pointsHistory))
    }, [pointsHistory])


    const innerHeight = height - margin.top - margin.bottom;
    const topChartBottomMargin = compact ? chartSeparation / 2 : chartSeparation + 10;
    const topChartHeight = 0.8 * innerHeight - topChartBottomMargin;
    const bottomChartHeight = innerHeight - topChartHeight - chartSeparation;
    const brushMargin = { top: 10, bottom: 15, left: 50, right: 20 };

    // bounds
    const xMax = Math.max(width - margin.left - margin.right, 0);
    const yMax = Math.max(topChartHeight, 0);
    const xBrushMax = Math.max(width - brushMargin.left - brushMargin.right, 0);
    const yBrushMax = Math.max(bottomChartHeight - brushMargin.top - brushMargin.bottom, 0);



    const brushRef = useRef<BaseBrush | null>(null);

    const getWeek = (d: DataPoint) => d.week;
    const getPointsValue = (d: DataPoint) => d.points;


    const brushWeekScale = useMemo(
        () =>
          scaleLinear<number>({
            range: [0, xBrushMax],
            domain: [0, data!=undefined ? max(data[0], getWeek) || 0 : 0],
            nice: true
          }),
        [xBrushMax, data],
      );

      const brushPointsScale = useMemo(
        () =>
          scaleLinear({
            range: [yBrushMax, 0],
            domain: [0, data!=undefined? max(data[0], getPointsValue) || 0 : 0],
            nice: true,
          }),
        [yBrushMax, data],
      );

    const weekScale = useMemo(() => 
        scaleLinear<number>({
            range: [0, xMax],
            domain: [filteredTeamData!=undefined ? min(filteredTeamData[0], getWeek) || 0 : 0, filteredTeamData!=undefined ? max(filteredTeamData[0], getWeek) || 0 : 0],
            nice: true
        }), [xMax, filteredTeamData])

        const getPointsDomain = () => {
          let min = 0;
          let max = 0;
          let first = true;
          filteredTeamData?.forEach((teamData : DataPoint[]) => {
            let teamMin = teamData[0] || 0;
            let teamMax = teamData[teamData.length -1 ] || 0 ;
            if(first) {
              max = teamMax.points;
              min = teamMin.points;
              first = false;
            } else {
              if(teamMin.points < min) {
                min = teamMin.points;
              }
              if(teamMax.points > max) {
                max = teamMax.points;
              }
            }
            console.log("min: " + min);
            console.log("max: " + max);
          });
          return [min, max];
        }

    const pointScale = useMemo(() => 
        scaleLinear<number>({
            range: [yMax, 0],
            domain: getPointsDomain(),
            nice: true
        }), [yMax, filteredTeamData, getPointsDomain])

    const initialBrushPosition = useMemo(
        () => ({
          start: { x: brushWeekScale(4) },
          end: { x: brushWeekScale(10) },
        }),
        [brushWeekScale],
      );

      const PATTERN_ID = 'brush_pattern';


      const selectedBrushStyle = {
        fill: `url(#${PATTERN_ID})`,
        stroke: 'white',
      };

      const onBrushChange = (domain: Bounds | null) => {
        if (!domain) return;
        const { x0, x1, y0, y1 } = domain;
        
        const dataCopy : DataPoint[][] | undefined = data?.map((entry: DataPoint[]) => {
            return entry.filter((s) => {
                const x = getWeek(s);
                const y = getPointsValue(s);
                return x > x0 && x < x1 && y > y0 && y < y1;
              })
        })



        // const dataCopy = data[0].filter((s) => {
        //   const x = getWeek(s);
        //   const y = getPointsValue(s);
        //   return x > x0 && x < x1 && y > y0 && y < y1;
        // });
        setFilteredTeamData(dataCopy);
      };

      // We need to manually offset the handles for them to be rendered at the right position
        function BrushHandle({ x, height, isBrushActive }: BrushHandleRenderProps) {
            const pathWidth = 8;
            const pathHeight = 15;
            if (!isBrushActive) {
            return null;
            }
            return (
                <Group left={x + pathWidth / 2} top={(height - pathHeight) / 2}>
                    <path
                        fill="#f2f2f2"
                        d="M -4.5 0.5 L 3.5 0.5 L 3.5 15.5 L -4.5 15.5 L -4.5 0.5 M -1.5 4 L -1.5 12 M 0.5 4 L 0.5 12"
                        stroke="#999999"
                        strokeWidth="1"
                        style={{ cursor: 'ew-resize' }}
                    />
                </Group>
            );
        }


    return (
        
            
            <motion.svg 
              initial={{opacity: 0, scaleX: 0.2}}
              whileInView={{opacity: 1, scaleX: 1}}
              transition={{duration:0.5}}
              viewport={{ once: true , amount: 0.2}}
              width={width} height={height}>
              <GradientTealBlue id="teal"/>
            <LinearGradient id={GRADIENT_ID} from={background} to={background2} rotate={45} />
            <rect x={0} y={0} width={width} height={height} fill={`url(#teal)`} rx={14} />

            <LineChart
                data={filteredTeamData}
                width={width}
                yMax={yMax}
                xScale={weekScale}
                yScale={pointScale}
                margin={{ ...margin, bottom: topChartBottomMargin }}
                gradientColor={background2}
                >
                  <GridRows scale={pointScale} width={xMax} height={yMax} style={{zIndex: -100}} stroke="#e0e0e0"/>
                  <GridColumns scale={weekScale} width={xMax} height={yMax} style={{zIndex: -100}} stroke="#e0e0e0" />

                  </LineChart>
                <LineChart
                hideBottomAxis
                hideLeftAxis
                data={data}
                width={width}
                yMax={yBrushMax}
                xScale={brushWeekScale}
                yScale={brushPointsScale}
                margin={brushMargin}
                top={topChartHeight + topChartBottomMargin + margin.top}
                gradientColor={background2}
                >
                    <Brush
                        xScale={brushWeekScale}
                        yScale={brushPointsScale}
                        width={xBrushMax}
                        height={yBrushMax}
                        margin={brushMargin}
                        handleSize={8}
                        innerRef={brushRef}
                        resizeTriggerAreas={['left', 'right']}
                        brushDirection="horizontal"
                        initialBrushPosition={initialBrushPosition}
                        onChange={onBrushChange}
                        onClick={() => setFilteredTeamData(data)}
                        selectedBoxStyle={selectedBrushStyle}
                        useWindowMoveEvents
                        renderBrushHandle={(props) => <BrushHandle {...props} />}   
                    />
            </LineChart>
            </motion.svg>

           
    )
}