import {
    XAxis,
    YAxis,
    Tooltip,
    Label,
    AreaChart, 
    Area,
    ResponsiveContainer
  } from "recharts";
import Card from 'react-bootstrap/Card';


type AreaChartProps = {
    title: string;
    data: Array<any>;
}

// label={{ value: 'pv of page', angle: -90, position: 'insideLeft' }}

export default function AreaChartApi({title, data}: AreaChartProps){
    const customCard = {
      color: "white",
      backgroundColor: "#212121",
      padding: "25px",
      borderRadius: "1rem",
      display: "flex",
      justifyContent: "space-evenly",
    };

    return (
    <Card style = {customCard}>
      <h3 className="mb-5"> {title} </h3>
      <ResponsiveContainer width="100%" aspect={2.2}>
         <AreaChart
         width={400}
         height={400}
         data={data}
         margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
       >
         <Tooltip/>
         <Area
           type="monotone"
           dataKey="total"
           stroke="#ffc107"
           fill="#8068233e"
           strokeWidth={4}
         />
          <XAxis dataKey="date_opened" />
          <YAxis tickFormatter={(value: any) => new Intl.NumberFormat('en').format(value)}/>
          <Tooltip  formatter={(value: any) => new Intl.NumberFormat('en').format(value)}/>
       </AreaChart>
      </ResponsiveContainer>
    </Card> 
    );

}