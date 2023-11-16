import SimpleSidebar from "../components/sidebar";
import PropertyMap from "../components/property_map";
import Router, { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import React, { useState, useEffect } from 'react';
import { decrypt } from '../utils/utils.js';
import { BiXCircle } from 'react-icons/bi'; 

import {
    Box,
    Grid,
    FormControl,
    Input,
    Button,
    FormLabel,
    VStack,
    HStack,
    Stack,
    ButtonGroup,
    IconButton,
    NumberInput,
    NumberInputField,
    NumberIncrementStepper,
    NumberInputStepper,
    NumberDecrementStepper
} from '@chakra-ui/react';

const selectedProperties = [];

/**
 * @desc Main export for the schedule page
 */
const Schedule = () => {
    const router = useRouter();
    const [data, setData] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [selectButtons, setSelectButtons] = useState([]);
    const [selectedDay, setSelectedDay] = useState(new Date().getDay());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isGenerated, setIsGenerated] = useState(false);
    
    useEffect(() => {
        const token = getCookie("token");
        if (token == undefined) {
            Router.push("/login")
        } else {
            setLoading(true);
            const token = decrypt(getCookie("token"));

            const endpoint = "http://127.0.0.1:5000/get_coordinates?token=" + token;
            const options = {
                method: "GET",
            };

            fetch(endpoint, options)
                .then((res) => res.json())
                .then((data) => {
                    setData(data);
                    setLoading(false);
                });
        }
    }, [])

    if (isLoading) return <p></p>;
    if (!data) return <p></p>;

    /**
    * @desc Data receiver from the property_map child component
    */
    const childToParent = (marker) => {
        setIsGenerated(true)
        if (!(selectedProperties.includes(marker['address']))) {
            selectedProperties.push(marker['address']);
            setSelectButtons([...selectButtons, marker]);
        }
    }

    /**
    * @desc Handler for the OnClick Route button
    */
    const handleRoute = (event) => {
        event.preventDefault()
        if (duration.value === '' || date.value === '' || time.value === ''){
            alert('There are some required fields missing');
        } else if (selectedDate < new Date()) {
            alert('Unable to create a schedule for a date in the past');
        } else if (selectedProperties.length > 0) {
            selectButtons[0]['duration'] = time.value;
            router.push({
                pathname: '/itinerary',
                query: { 
                    selectedMarkers: JSON.stringify(selectButtons), 
                    selectedDuration: JSON.stringify(duration.value),
                    selectedDate: (date.value),
                    selectedTime: (time.value)
                }
            },'/itinerary')
        } else {
            alert('Try selecting some properties from the map first');
        }
    }

    /**
    * @desc Handler for the date change / selection 
    */
    const handleDate = (event) => {
        event.preventDefault();
        const temp = new Date(date.value);
        setSelectedDate(temp);
        setIsGenerated(false);
        setSelectedDay(temp.getDay());
    }

    /**
    * @desc Handler for the OnClick close button to remove a selected address
    */
    function removeAddress(address) {
        selectedProperties = selectedProperties.filter(e => e !== address);
        setSelectButtons((selectButtons) => selectButtons.filter((button) => button.address !== address));
    }

    return (
        <Grid templateColumns='repeat(3, 1fr)' gap={6}>
            <Box>
                <SimpleSidebar></SimpleSidebar>
            </Box>
            <Box p={10} verticalAlign>
                <FormControl isRequired>
                    <HStack>
                        <FormLabel>Date</FormLabel>
                        <Input id='date' placeholder='Select Date' size = 'sm' type='date' width={'min'} onChange={handleDate}/>
                    </HStack>
                    <Box p={2}/>
                    <HStack>
                        <FormLabel>Start Time</FormLabel>
                        <Input id='time' placeholder='Select Start Time' size = 'md' type='time' width={'200px'}/>
                    </HStack>
                    <Box p={2}/>
                    <HStack>
                        <FormLabel>Duration (Hrs)</FormLabel>
                        <NumberInput id='duration' max={12} min={1}>
                            <NumberInputField/>
                            <NumberInputStepper>
                                <NumberIncrementStepper/>
                                <NumberDecrementStepper/>
                            </NumberInputStepper>
                        </NumberInput>
                    </HStack>
                </FormControl>
                <Box p={3}/>
                <HStack>
                    <Box>
                        Start selecting properties below to begin your planning
                        <PropertyMap addressData={data} childToParent={childToParent} selectedMarkers={selectButtons} selectedDay={selectedDay} isGenerated={isGenerated}></PropertyMap>
                    </Box>
                    <VStack>
                        <Stack maxH="400px" overflow="scroll">
                            {selectButtons.map(({address, id}) => {
                                return (
                                    <ButtonGroup size='sm' isAttached variant='outline' key={id}>
                                        <Button _hover={{}} _active={{}}>{address}</Button>
                                        <IconButton onClick={() => removeAddress(address)} icon={<BiXCircle/>} _hover={{ bg: "red.400" }}/>
                                    </ButtonGroup>
                                );
                            })}
                        </Stack>
                    </VStack>
                </HStack> 
                <Button mt={4} colorScheme='teal' onClick={handleRoute}>
                    Route
                </Button>
            </Box>
        </Grid>
    )
} 

export default Schedule;