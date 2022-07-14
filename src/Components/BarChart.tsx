import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import Card from 'react-bootstrap/Card';

type BarChartProps = {
    title: string;
    data: Array<any>;
}


export default function BarChartApi({title, data}: BarChartProps){
  const customCard = {
    color: "white",
    backgroundColor: "#212121",
    padding: "30px",
    borderRadius: "1rem",
    display: "flex",
    justifyContent: "space-evenly",
  };

  return (
    <Card style = {customCard}>
    <h3 className="mb-5"> {title} </h3>
    <ResponsiveContainer width="100%" aspect={3}>
      <BarChart
      data={data}
      margin={{
        top: 5,
        right: 10,
        left: 20,
        bottom: 5
      }}
     >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />

        <Bar dataKey="value" fill="#00C49F">
        </Bar>

    </BarChart>
    </ResponsiveContainer>
    </Card>
    );

}