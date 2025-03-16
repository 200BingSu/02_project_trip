import { ResponsiveBar } from "@nivo/bar";
import { ISales } from "../../../atoms/salesAtom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
interface GraphProps {
  data: ISales[];
}

const Graph = ({ data }: GraphProps) => {
  const formattedData = data.map(item => ({
    month: dayjs(item.month).format("YY-MM"),
    totalSales: item.totalSales,
  }));
  return (
    <div className="w-full h-[80vw] max-h-[450px] relative">
      <ResponsiveBar
        data={formattedData}
        keys={["totalSales"]}
        indexBy="month"
        margin={{ top: 20, right: 30, bottom: 50, left: 50 }}
        padding={0.35}
        minValue={0}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        borderColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: "middle",
          legendOffset: 32,
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: "middle",
          legendOffset: -40,
          truncateTickAt: 0,
        }}
        enableGridX={true}
        enableLabel={false}
        totalsOffset={14}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        legends={[]}
        role="application"
        ariaLabel="Nivo bar chart demo"
        colors="#0DD1FD"
        tooltip={({ value, indexValue }) => (
          <div className="bg-white p-3 shadow-lg rounded-lg border border-slate-100">
            <div className="text-lg font-medium text-slate-700">
              {dayjs(indexValue, "YY-MM").format("YYYY년 MM월")}
            </div>
            <div className="flex items-center gap-1 text-slate-600">
              <span>매출액</span>
              <span className="font-semibold text-primary">
                {value.toLocaleString()}만원
              </span>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default Graph;
