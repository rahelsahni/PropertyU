import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import React, { useState } from 'react';
import { useEffect } from "react";
import { decrypt } from '../utils/utils.js';
import { Input,
    Flex,
    Box,
    FormControl,
    Button,
    Heading,
    Text,
} from '@chakra-ui/react';

/**
 * @desc Main export for the request inspection page
 */
const Request = ({ hex }) => {

    const id = decrypt(hex);
    setCookie('propID', id)
    
    const [data, setData] = useState(null);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
    
        const endpoint = "http://localhost:5000/get_property?id=" + id;
        
        const options = {
            method: "GET",
        };
    
        fetch(endpoint, options)
            .then((res) => res.json())
            .then((data) => {
                setData(data)
                setLoading(false)
            })
    }, [])
    
    if (isLoading) return <p></p>
    if (!data) return <p></p>

    return (
        <Flex align="center" justifyContent="center" width="100%">
            <Box p={300} verticalAlign>
                <Box textAlign="center">
                    <Heading>Request an inspection</Heading>
                    <Text mt={4}>You are requesting an inspection for: {data.addr1} </Text>
                </Box>
                    <Box my={4} textAlign="left" minWidth="500px">
                        <form onSubmit={requestClick}>
                            <FormControl>   
                                <Input id="email" type="email" placeholder="Confirm your email" />
                            </FormControl> 
                            <Button width="full" mt={4} type="submit" colorScheme='teal'>
                                Submit inspection request
                            </Button>
                            <Button width="full" mt={4} onClick={() => close()}>
                                Close window
                            </Button>
                        </form>
                    </Box>
            </Box>
        </Flex>
    )
}

/**
 * @desc OnClick handler for the request button after form submit
 */
const requestClick = async (event) => {

    event.preventDefault()
    const Swal = require('sweetalert2');
    const email = event.target.email.value;
    const prop_id = getCookie('propID');

    let endpoint = "http://localhost:5000/get_property?id=" + prop_id;

    let options = {
        method: "GET",
    };
    let response = await fetch(endpoint, options);
    let result = await response.text();
    let res = JSON.parse(result);

    if (email != res.email) {
        Swal.fire({
            icon: 'error',
            title: 'Incorrect email.',
            text: 'The email address provided is not linked to this property.',
            confirmButtonColor: 'teal'
        })
    } else {
        let data = {
            prop_id: prop_id
        };
        endpoint = "http://localhost:5000/i_request";
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
        response = await fetch(endpoint, options);
        result = await response.text();
        deleteCookie('prop_id')
        Swal.fire({
            icon: 'success',
            title: 'Request submitted.',
            text: 'The request for this property was successfully submitted.',
            confirmButtonColor: 'teal'
        })
        .then(() => {
            close()
        })
    }
}

export default Request;

export async function getServerSideProps({ query }) {
    const hex = query.id;
    return { props: { hex } };
}