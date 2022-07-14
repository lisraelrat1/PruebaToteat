import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList
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
    <ResponsiveContainer width="100%" aspect={2}>
      <BarChart
      data={data}
      margin={{
        top: 30,
        right: 10,
        left: 50,
        bottom: 5
      }}
     >
        <XAxis tick={false}/>
        <YAxis tickFormatter={(value: any) => new Intl.NumberFormat('en').format(value)} />
        <Tooltip formatter={(value: any) => new Intl.NumberFormat('en').format(value)} />

        <Bar dataKey="value" fill="#00C49F">
          <LabelList
            dataKey="name"
            position="top"
            angle={0}
            offset={10}
            fill="white"
          />
        </Bar>

    </BarChart>
    </ResponsiveContainer>
    </Card>
    );

}