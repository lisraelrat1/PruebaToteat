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

function getAllSales(arr: any[]){
    const sales = arr.reduce((total, next) => total + next.total, 0);
    return ~~(sales)
}

function reduceArray(arr: any[], name: string, value: string){
    const result = Array.from(arr.reduce(
        (m, item) => m.set(item[name], (m.get(item[name]) || 0) + item[value]), new Map
      ), ([name, value]) => ({name, value}));

    return result;
}

function reduceArrayMultiply(arr: any[], name: string, value: string, value2: string){
    const result = Array.from(arr.reduce(
        (m, item) => m.set(item[name], (m.get(item[name]) || 0) + (item[value]*item[value2])), new Map
      ), ([name, sales]) => ({name, sales}));

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
    const units = reduceArray(products, 'name','quantity');
    const bestSellersArray = result.map(t1 => ({...t1, ...units.find(t2 => t2.name === t1.name)}));

    console.log(result, units, bestSellersArray);

    bestSellersArray.sort((a, b) => {
        return b.sales - a.sales;
    });

    const bestSellers = bestSellersArray.slice(0, 5);
    
    return bestSellers;

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
    const [bestSellers, setBestSellers] = useState<any[]>([]);

    const [averageServiceTime, setAverageServiceTime] = useState<number>(0);
    const [averageSpent, setAverageSpent] = useState<number>(0);
    const [allSales, setAllSales] = useState<number>(0);

    sortArrayByDate(data);    

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

        const bestSellersProducts = getBestSellers(data);
        setBestSellers(bestSellersProducts);

        const sales = getAllSales(data);
        setAllSales(sales);

    }

    useEffect(() => {
        setdataValues()
    },[]);

    return (
        <>
        <Navbar bg="light" variant="light">
            <Container>
            <Navbar.Brand href="#home">
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
                    <AnalyticsCard measure="Ventas Totales del Periodo" value={allSales} unit={'CLP'}></AnalyticsCard>
                </Col>
            </Row>
            <Row className='mt-2'>
                <Col sm={8}>
                    <BarChartApi title="Venta por Meseros" data={salesByWaiters}/>
                </Col>
                <Col sm={4}>
                    <BestSellers title="Best Sellers (por ventas en CLP)" data={bestSellers}/>
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