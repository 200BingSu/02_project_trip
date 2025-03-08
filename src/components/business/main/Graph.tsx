import { ResponsiveLine } from "@nivo/line";
import { IGraphData } from "../../../pages/business/BusinessIndex";

interface GraphProps {
  data: {
    id: string;
    data: Array<IGraphData>;
  }[];
}

const Graph = ({ data }: GraphProps) => {
  return (
    <div style={{ width: "100%", height: "500px" }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
        xScale={{
          type: "point",
        }}
        yScale={{
          type: "linear",
          min: 0,
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        enableGridX={true}
        enableGridY={true}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "매출 기간 (월 단위)",
          legendOffset: 40,
          legendPosition: "middle",
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "매출 금액 (단위: 10,000원)",
          legendOffset: -50,
          legendPosition: "middle",
          truncateTickAt: 0,
          format: value =>
            value > 0 ? `${(value / 10000).toLocaleString()}만` : 0,
        }}
        pointSize={4}
        pointColor={{ from: "color", modifiers: [] }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor", modifiers: [] }}
        pointLabel="data.yFormatted"
        pointLabelYOffset={-12}
        enableTouchCrosshair={true}
        useMesh={true}
        colors={["#0DD1FD"]}
        legends={[]}
        tooltip={({ point }) => {
          return (
            <div className="bg-white p-2 rounded-md border border-slate-200">
              <div style={{ color: point.serieColor }}>
                <strong>{point.serieId}</strong>
              </div>
              <div className="text-sm text-slate-600">
                <span className="font-medium">기간:</span>{" "}
                {String(point.data.x)}
              </div>
              <div className="text-sm text-slate-600">
                <span className="font-medium">매출:</span>{" "}
                {Number(point.data.y).toLocaleString()}만원
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

export default Graph;
