import SimpleSidebar from "../components/sidebar";
import ItineraryMap from "../components/directions_map";
import Router, { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import React, { useState, useEffect } from 'react';
import { decrypt } from '../utils/utils.js';
import { isBrowser } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import {
    Box,
    Grid,
    FormControl,
    Button,
    FormLabel,
    VStack,
    Heading,
    Text,
    HStack,
} from '@chakra-ui/react';

/**
 * @desc Main export for the itinerary page
 */
const Itinerary = () => {
    const router = useRouter();
    const [selectedMarkers, setSelectedMarkers] = useState(null);
    const [dragMarkers, setDragMarkers] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [optimalActive, setOptimalActive] = useState(1);
    const [isGenerated, setIsGenerated] = useState(false);
    const [legs, setLegs] = useState(null);

    const [scheduleButton, setScheduleButton] = useState(false);

    const Swal = require('sweetalert2');

    useEffect(() => {
        const token = getCookie("token");
        if (token == undefined) {
            Router.push("/login");
        } else if (router.query.selectedMarkers == undefined) {
            Router.push("/schedule");
        } else {
            setSelectedMarkers(JSON.parse(router.query.selectedMarkers));
            setDragMarkers(JSON.parse(router.query.selectedMarkers));
            setSelectedDuration(parseInt(JSON.parse(router.query.selectedDuration)));
            setSelectedTime(router.query.selectedTime);
            setSelectedDate(router.query.selectedDate);
        }
    }, [])

    if (!selectedMarkers) return <p></p>;
    if (!selectedDuration) return <p></p>;
    
    /**
    * @desc Data receiver from the directions_map child component
    */
    const childToParent = (duration, reSelectedMarkers, legs) => {
        setIsGenerated(true);
        setLegs(legs);
        var start_time;
        var leg_duration;

        if (optimalActive == 1) {
            start_time = selectedTime;
            reSelectedMarkers[0]['duration'] = start_time;
            for (let i = 0; i < (legs.length); i++) {
                leg_duration = parseInt(legs[i]['duration']['text']);
                start_time = addMinutes(start_time, (leg_duration + 30));
                reSelectedMarkers[i+1]['duration'] = start_time;
            }
            setDragMarkers(reSelectedMarkers);
        } else {
            start_time = selectedTime;
            dragMarkers[0]['duration'] = start_time;
            for (let i = 0; i < (legs.length); i++) {
                leg_duration = parseInt(legs[i]['duration']['text']);
                start_time = addMinutes(start_time, (leg_duration + 30));
                dragMarkers[i+1]['duration'] = start_time;
            }
            setDragMarkers(dragMarkers); 
        }

        if (duration > (selectedDuration * 60 * 60)) {
            Router.push("/schedule");
            router.reload(window.location.pathname);
            alert('Selected properties cannot be inspected inside the given duration');
        }
    }

    /**
    * @desc Handles the drag and drop functionality and re-orders the respective marker arrays before calling a hook
    */
    function handleOnDragEnd(result) {
        if (!result.destination) return;

        const items = Array.from(dragMarkers);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setDragMarkers(items);
        setScheduleButton(true);

        Swal.fire({
            icon: 'info',
            title: 'Route Changed',
            text: 'Please click "Re-Calculate" for your new journey',
            confirmButtonColor: 'teal'
        }) 
    }

    /**
    * @desc Handler for the OnClick Re-Calculate button
    */
    const handleRecalculate = (event) => {
        event.preventDefault();
        setOptimalActive(0);
        setIsGenerated(false);
        setSelectedMarkers(dragMarkers);
        setScheduleButton(false);
    }

    /**
    * @desc Handler for the OnClick Schedule button
    */
    const handleSchedule = async (event) => {
        event.preventDefault();

        const Swal = require('sweetalert2');
        Swal.fire({
            icon: 'info',
            title: 'Generating itinerary',
            text: 'Your itinerary is being generated and added to the calendar. This should only take a few minutes.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showConfirmButton: false
        })

        const endpoint = 'http://127.0.0.1:5000/add_itinerary_stop';
        const token = decrypt(getCookie('token'));
        var data;
        var options;
        var response;
        var result;
        var leg_duration;
        var start_time = selectedTime;

        data = {
            manager: token,
            location: selectedMarkers[0]['property_id'],
            date: selectedDate,
            start_time: start_time,
        }

        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
    
        response = await fetch(endpoint, options);
        result = await response.text();
    
        if (result == 'FAILURE') {
            alert('Error Adding Itinerary Stop');
        }

        for (let i = 0; i < (selectedMarkers.length - 1); i++) {
            leg_duration = parseInt(legs[i]['duration']['text']);
            start_time = addMinutes(start_time, (leg_duration + 30));

            data = {
                manager: token,
                location: dragMarkers[i+1]['property_id'],
                date: selectedDate,
                start_time: start_time,
            }

            options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
        
            response = await fetch(endpoint, options);
            result = await response.text();
        
            if (result == 'FAILURE') {
                alert('Error Adding Itinerary Stop');
            }
        }

        Swal.fire({
            icon: 'success',
            title: 'Itinerary Generated',
            text: 'The itinerary was added to your calendar.',
            confirmButtonColor: 'teal'
        })
        Router.push("/profile");
    }

    return (
        <Grid templateColumns='repeat(3, 1fr)' gap={6}>
            <Box>
                <SimpleSidebar></SimpleSidebar>
            </Box>
            <Box p={10}>
                <FormControl>
                    <HStack>
                        <FormLabel>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</FormLabel>
                        <Button id='date' size = 'md' _hover={{}} _active={{}} width='200px' colorScheme='teal' variant='outline'>
                            {selectedDate}
                        </Button>
                    </HStack>
                    <Box p={2}/>
                    <HStack>
                        <FormLabel>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Start Time&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</FormLabel>
                        <Button id='date' size = 'md' _hover={{}} _active={{}} width='200px' colorScheme='teal' variant='outline'>
                            {selectedTime}
                        </Button>
                    </HStack>
                    <Box p={2}/>
                    <HStack>
                        <FormLabel>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Duration (Hrs)</FormLabel>
                        <Button id='date' size = 'md' _hover={{}} _active={{}} width='200px' colorScheme='teal' variant='outline'>
                            {selectedDuration}
                        </Button>
                    </HStack>
                </FormControl>
                <HStack>
                    <Box p={10} verticalAlign>
                        <ItineraryMap selectedMarkers={selectedMarkers} childToParent={childToParent} optimalActive={optimalActive} isGenerated={isGenerated}></ItineraryMap>
                    </Box>
                    <Box maxH="400px" overflow="scroll">
                        <DragDropContext onDragEnd={handleOnDragEnd}>
                            
                            {isBrowser ? (

                                <VStack>
                                    <Droppable droppableId="dragMarkers">
                                        {(provided) =>
                                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                                <VStack spacing={4}>
                                                    {dragMarkers.map(({address, id, duration}, index) => (
                                                        <Draggable key={String(id)} draggableId={String(id)} index={index}>
                                                            {(provided) => (
                                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                    <Box minW='sm' bg='white' p={5} shadow='base' borderWidth='1px'>
                                                                        <Heading fontSize='sm'>{address}</Heading>
                                                                        <Text fontSize='sm'>{duration}</Text>
                                                                    </Box>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                </VStack>
                                                {provided.placeholder}
                                            </div>
                                        }
                                    </Droppable>
                                </VStack>

                            ) : null}

                        </DragDropContext>
                    </Box>
                </HStack>
                <HStack spacing={10}>
                    <Box>&nbsp;</Box>
                    <Button colorScheme='gray' onClick={handleRecalculate}>
                        Re-Calculate
                    </Button>
                    <Box>&nbsp;&nbsp;</Box>
                    <Button colorScheme='teal' onClick={handleSchedule} isDisabled={scheduleButton}>
                        Schedule
                    </Button>
                </HStack>
            </Box>
        </Grid>
    )
}

/**
* @desc Helper function to convert time string and add a specified amount of minutes
*       ref: https://stackoverflow.com/questions/17446466/add-15-minutes-to-string-in-javascript
*/
function addMinutes(time, minsToAdd) {
    function D(J){ return (J<10? '0':'') + J;};
    var piece = time.split(':');
    var mins = piece[0]*60 + +piece[1] + +minsToAdd;
  
    return D(mins%(24*60)/60 | 0) + ':' + D(mins%60);  
}  

export default Itinerary;