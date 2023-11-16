import Router from 'next/router';
import { getCookie } from 'cookies-next';
import SimpleSidebar from '../components/sidebar';
import Calendar from '../components/calendar';
import { useEffect } from "react";
import React, { useState } from 'react';
import { decrypt } from '../utils/utils.js' ;
import {
    Heading,
    Grid,
    GridItem,
} from '@chakra-ui/react';

const Calendar_view = () => {

    useEffect(() => {
        const token = getCookie("token");
        if (token == undefined) {
            Router.push("/login")
        } else {
            setLoading(true)
            const token = decrypt(getCookie("token"));

            const endpoint = "http://localhost:5000/get_events?token=" + token;

            const options = {
                method: "GET",
            };

            fetch(endpoint, options)
                .then((res) => res.json())
                .then((data) => {
                    setData(data)
                    setManagerID(token)
                    setLoading(false)
                })
        }
    }, [])

    const [data, setData] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [managerID, setManagerID] = useState(null);

    if (isLoading) return <p></p>

    return (
        <Grid templateColumns='3fr 7fr 1fr' gap={6}>
            <GridItem>
                <SimpleSidebar/>
            </GridItem>
            <GridItem paddingBottom="20px" textAlign='center'>
                <Heading padding="20px 0px">Calendar</Heading>
                <Calendar events={JSON.stringify(data)} manager={managerID}/>
            </GridItem>
        </Grid>
    )
}

export default Calendar_view;