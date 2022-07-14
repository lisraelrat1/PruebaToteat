import React from "react";
import Card from 'react-bootstrap/Card';
import { useEffect } from "react";

type CardProps = {
    measure: string,
    value: number,
    unit: string
}

export default function AnalyticsCard({measure, value, unit}: CardProps){

    const customCard = {
        color: "white",
        backgroundColor: "#212121",
        padding: "10px",
        borderRadius: "1rem",
        display: "flex",
        justifyContent: "space-evenly",
      };
    
    useEffect(() => {
    }, [measure, value]);

    return (
        <>
            <Card
                className="mb-2"
                style = {customCard}
                // bg="dark"
            >
                <Card.Body>
                    <Card.Text> {measure} </Card.Text>
                    <Card.Title> {value.toLocaleString( 'de-DE' )} {unit} </Card.Title>
                </Card.Body>
            </Card>
        </>
    );
}

