import Router from 'next/router';
import { getCookie } from 'cookies-next';
import SimpleSidebar from '../components/sidebar';
import { useEffect } from "react";
import React, { useState } from 'react';
import { decrypt } from '../utils/utils.js';
import { 
    Box,
    Button,
    Heading,
    VStack,
    Grid,
    GridItem,
    Text,
    Image,
    Show
} from '@chakra-ui/react';

/**
 * @desc Main export for the property_list page
 */
const PropertyList = () => {

    const [data, setData] = useState(null);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const token = getCookie("token");
        if (token == undefined) {
            Router.push("/login");
        } else {
            setLoading(true)
            const token = decrypt(getCookie("token"));

            const endpoint = "http://localhost:5000/get_properties?token=" + token;
            const options = {
                method: "GET",
            };

            fetch(endpoint, options)
                .then((res) => res.json())
                .then((data) => {
                setData(data)
                setLoading(false)
            })
        }
    }, [])

    const Boxes = () => {

        const arr = [];
        
        for (let i = 0; i < data.length; i++) {

            var status = "";
            var color = "";
            
            if (data[i].to_be_inspected == "Due") {
                status = "Due";
                color = "orange";
            }
            else if (data[i].to_be_inspected == "Urgent") {
                status = "Urgent";
                color = "red";
            }
            else if (data[i].to_be_inspected == "Scheduled") {
                status = "Scheduled";
                color = "blue";
            }
            else {
                status = "Not Due";
                color = "green";
            }

            const srcJPEG = '/pictures/' + data[i].id + ".jpeg";
             
            const bx =  <Box key={i} width="full" p="3" bg="gray.200" >
                            <Grid templateColumns="10fr 1fr 25fr" width="full"> 
                                <GridItem>
                                    <Image border="2px"
                                        src={srcJPEG}
                                        boxSize='150'
                                        fallbackSrc= "/pictures/default.jpeg"
                                    />
                                </GridItem>
                                <GridItem></GridItem>
                                <GridItem padding="10px">
                                    <Box rounded="2xl" border="2px" borderColor={color}>
                                        <Text color={color} opacity="100%">
                                            {status}
                                        </Text>
                                    </Box>
                                    <Text paddingTop="10px" fontWeight="bold">
                                        {data[i].address1}
                                    </Text>
                                    <Button width="full" padding="5px 5px" mt={8} colorScheme='blue' onClick={() => Router.push('/edit_property?id=' + data[i].id)}>
                                        Info
                                    </Button>
                                </GridItem>
                                <GridItem>       
                                </GridItem>
                            </Grid>
                        </Box>
            arr.push(bx);
        }

        return (
            arr
        );
    }

    if (isLoading) return <p></p>
    if (!data) return <p></p>

    return (

        <Grid templateColumns='4fr 5fr 2fr' gap={10}>
            <Box>
                <SimpleSidebar></SimpleSidebar>
            </Box>
            <VStack width="full">
                <Box textAlign="center" padding="20px 0px">
                    <Heading>Managed Properties</Heading>
                </Box>
                <Button width="full" mt={4} colorScheme='teal' onClick={() => {Router.push('/add_property');}}>
                    Add Property
                </Button>
                <Box width="full" textAlign="center">
                    <VStack width="full" spacing="10px">
                        <Boxes></Boxes>
                    </VStack>
                </Box>
                <Show below='1000px'>
                    <Box>Expand screen to access sidebar navigation.</Box>
                </Show> 
            </VStack> 
        </Grid>
    )
}

export default PropertyList;