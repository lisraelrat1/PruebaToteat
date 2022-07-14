import React from "react";
// import axios from "axios";
import data from  './data/VentasToteat.json';
import moment from 'moment-timezone';
import { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';

import AnalyticsCard from "./AnalyticsCard";
import PieChartApi from "./PieChart";
import AreaChartApi from "./AreaChart";
import BarChartApi from "./BarChart";
import BestSellers from "./BestSellers";

// const baseURL = "https://storage.googleapis.com/backupdatadev/ejercicio/ventas.json";

type Product = {
    category: string;
    name: string;
    price: number;
    quantity: number
}

type Payment = {
    amount: number;
    type: string;
}

type Sale = {
    date_closed: string;
    zone: string;
    waiter: string;
    cashier: string;
    products: Array<Product[]>;
    diners: number;
    date_opened: string;
    table: number;
    total: number;
    id: string; 
    payments: Array<Payment[]>
};

function sortArrayByDate(arr: any[]) {
    arr.sort(function compare(a, b) {
        var dateA: Date = new Date(a.date_opened);
        var dateB: Date = new Date(b.date_opened);
        return dateA.getTime() - dateB.getTime();;
    });
}

function getAverageServiceTime(arr: any[]){
    const average = arr.reduce((total, next) => total + (moment(next.date_closed).diff(moment(next.date_opened), 'minutes')), 0) / arr.length;
    return ~~average
}

function getAverageSpent(arr: any[]){
    const customers = arr.reduce((total, next) => total + next.diners, 0);
    const spent = arr.reduce((total, next) => total + next.total, 0);
    return ~~(spent/customers)
}

function reduceArray(arr: any[], name: string, value: string){
    const result = Array.from(arr.reduce(
        (m, item) => m.set(item[name], (m.get(item[name]) || 0) + item[value]), new Map
      ), ([name, value]) => ({name, value}));

    return result;
}

function reduceArrayMultiply(arr: any[], name: string, value: string, value2: string){
    const result = arr.reduce((n, item) => n + item[value]*item[value2], 0)

    // const result = arr.reduce(
    //     (m, item) => m.set(item[name], (m.get(item[name]) || 0) + (item[value]*item[value2])), new Map
    // )

    // const result = Array.from(arr.reduce(
    //     (m, item) => m.set(item[name], (m.get(item[name]) || 0) + (item[value]*item[value2])), new Map
    //   ), ([name, value]) => ({name, value}));

    return result;
}

function monthlySalesFunc(arr: any[]) {
    const result = Array.from(arr.reduce(
        (m, {date_opened, total}) => m.set(moment(date_opened).format('DD-MM-YYYY'), (m.get(date_opened) || 0) + total), new Map
      ), ([date_opened, total]) => ({date_opened, total}));

    return result;
}

function getBestSellers(arr: any[]){
    const products: any[] = []
    arr.forEach(function (sale: Sale) {
        products.push(...sale.products)
    });

    const result = reduceArrayMultiply(products, 'name', 'price', 'quantity');
    const result2 = reduceArray(products, 'name', 'price')
    const result3 = reduceArray(products, 'name', 'quantity')
    console.log(result, result2, result3);

    // const result2 = reduceArray(products, 'category', 'price')
    // console.log(result2)
}

function getPaymentTypes(arr: any[]){
    const payments: any[] = []
    arr.forEach(function (sale: Sale) {
        payments.push(...sale.payments)
    });

    const result = reduceArray(payments, 'type', 'amount');
    return result
}

export default function Dashboard(){
    const [monthlySales, setMonthlySales] = useState<any[]>([]);
    const [salesByPayType, setSalesByPayType] = useState<any[]>([]);
    const [salesByWaiters, setSalesByWaiters] = useState<any[]>([]);
    const [averageServiceTime, setAverageServiceTime] = useState<number>(0);
    const [averageSpent, setAverageSpent] = useState<number>(0);

    sortArrayByDate(data);
    getBestSellers(data);
    // reduceArrayMultiply(data, 'name', 'quantity', 'price');
    

    const setdataValues = async () => {
        const monthlySalesData = monthlySalesFunc(data);
        setMonthlySales(monthlySalesData);

        const salesByWaitersData = reduceArray(data, 'waiter', 'total');
        setSalesByWaiters(salesByWaitersData);

        const averageTime = getAverageServiceTime(data);
        setAverageServiceTime(averageTime);

        const averageSpent = getAverageSpent(data);
        setAverageSpent(averageSpent);

        const payments = getPaymentTypes(data);
        setSalesByPayType(payments);


    }

    useEffect(() => {
        setdataValues()
    },[]);

    return (
        <>
        <Navbar bg="light" variant="light">
            <Container>
            <Navbar.Brand href="#home">
                <img
                alt=""
                src="/toteat.png"
                width="30"
                height="30"
                className="d-inline-block align-top mx-2"
                />{' '}
                Prueba Técnica Toteat
            </Navbar.Brand>
            </Container>
        </Navbar>

        <Container>
            <Row className='mt-5'>
                <Col sm={4}>
                    <AnalyticsCard measure="Tiempo Promedio de Atención" value={averageServiceTime} unit={'minutos'} ></AnalyticsCard>
                </Col>
                <Col sm={4}>
                    <AnalyticsCard measure="Promedio de Compra por Comensal" value={averageSpent} unit={'CLP'}></AnalyticsCard>
                </Col>
                <Col sm={4}>
                    <AnalyticsCard measure="Ventas Totales" value={400} unit={'$'}></AnalyticsCard>
                </Col>
            </Row>
            <Row className='mt-2'>
                <Col sm={8}>
                    <BarChartApi title="Venta por Meseros" data={salesByWaiters}/>
                </Col>
                <Col sm={4}>
                    <BestSellers title="Best Sellers" data={[
                                                                { name: 'Coca-cola', units: 400 , sales: 23823},
                                                             
                    ]}/>
                </Col>             
            </Row>
             <Row className='mt-3'>
                <Col sm={4}>
                    <PieChartApi title="Ventas por tipo de pago" data={salesByPayType}/>
                </Col>  
                <Col sm={8}>
                    <AreaChartApi title="Ventas diarias" data={monthlySales}/>
                </Col>
            </Row>
        </Container>
        </>
    );

}