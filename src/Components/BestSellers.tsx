import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';

type BestSellersProps = {
    title: string;
    data: Array<any>;
}

export default function BestSellers({title, data}: BestSellersProps){
  const customCard = {
    color: "white",
    backgroundColor: "#212121",
    padding: "30px",
    borderRadius: "1rem",
    display: "flex",
    justifyContent: "space-evenly",
  };

    return (
      <Card style={customCard}>
        <h3 className="mb-3"> {title} </h3>
        <Table responsive style={{fontSize:"15px", color:"white"}}>
        <thead>
          <tr>
            <th></th>
            <th>Producto</th>
            <th>Unidades Vendidas</th>
            <th>Ventas en CLP</th>
          </tr>
        </thead>
        <tbody>
            {data.map(function(d, idx){
                return (
                    <tr>
                    <td>{idx + 1}.</td>
                    <td>{d.name}</td>
                    <td>{d.value.toLocaleString( 'de-DE' )}</td>
                    <td>${d.sales.toLocaleString( 'de-DE' )}</td>
                </tr>
                )
            })}

        </tbody>
      </Table>
      </Card>
    );
}