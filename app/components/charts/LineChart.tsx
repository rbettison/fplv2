import { AxisBottom, AxisLeft, AxisScale } from "@visx/axis"
import { curveNatural } from "@visx/curve";
import { Group } from "@visx/group"
import { MarkerArrow, MarkerCircle } from "@visx/marker"
import { LinePath } from "@visx/shape"
import { DataPoint } from "../dash/SeasonBrushChart";
import zIndex from "@mui/material/styles/zIndex";

export default function LineChart({
    data,
    gradientColor,
    width,
    yMax,
    margin,
    xScale,
    yScale,
    hideBottomAxis = false,
    hideLeftAxis = false,
    top,
    left,
    children,
  }: {
    data: DataPoint[][] | undefined;
    gradientColor: string;
    xScale: AxisScale<number>;
    yScale: AxisScale<number>;
    width: number;
    yMax: number;
    margin: { top: number; right: number; bottom: number; left: number };
    hideBottomAxis?: boolean;
    hideLeftAxis?: boolean;
    top?: number;
    left?: number;
    children?: React.ReactNode;
  }) {

    const axisColor = '#fff'

    // data.forEach((point) => {
    //     console.log('Logging scale outputs X:')
    //     console.log(xScale(point.week))
    //     console.log('Logging scale outputs Y:')
    //     console.log(yScale(point.points));
    // })
    return (
        <Group left={left || margin.left} top={top || margin.top}>
                    <MarkerArrow id="marker-arrow" fill="#333" refX={2} size={3}/>
                    <MarkerCircle id="marker-circle" fill="#000" style={{zIndex: 100}} size={4} refX={2} />

                { !hideLeftAxis && 
                    <AxisLeft 
                      tickLabelProps={{
                        fill: axisColor,
                        fontSize: 15,
                        fontStyle: "bold"
                      }}
                      tickStroke={axisColor} stroke={axisColor} scale={yScale} numTicks={5} /> }
                { !hideBottomAxis && 
                    <AxisBottom
                      tickLabelProps={{
                        fill: axisColor,
                        fontSize: 20,
                        textAnchor: 'middle',
                      }}
                      tickStroke={axisColor} stroke={axisColor} top={yMax} scale={xScale} numTicks={width > 520 ? 10 : 5} /> }
                {
                    data?.map((d: DataPoint[], index) => {
                        return <LinePath<DataPoint>
                            key={index}
                            style={{
                              zIndex: 100
                            }}
                            curve={curveNatural}
                            data={d}
                            x={(d) => xScale(d.week) ?? 0}
                            y={(d) => yScale(d.points) ?? 0}
                            stroke={"#000"}
                            strokeWidth={1}
                            strokeOpacity={1}
                            shapeRendering="geometricPrecision"
                            markerMid="url(#marker-circle)"
                            markerEnd={"url(#marker-arrow)"}
                            
                            />
                    })
                }
                {children}
                </Group>
    )
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}