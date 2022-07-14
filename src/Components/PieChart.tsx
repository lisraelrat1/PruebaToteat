import { PieChart, Pie, Legend, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import Card from 'react-bootstrap/Card';

type PieChartProps = {
    title: string;
    data: Array<any>;
}

type PercentageLabel = {
    cx: number; 
    cy: number;
    midAngle: number; 
    innerRadius: number; 
    outerRadius: number;
    percent : number;
    index : number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: PercentageLabel) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


export default function PieChartApi({title, data}: PieChartProps){
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
        <ResponsiveContainer width="100%" aspect={1}>
        <PieChart >
          <Pie
            data={data}
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            innerRadius={30}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend/>
          <Tooltip/>
        </PieChart>
      </ResponsiveContainer>
      </Card>
    );
}