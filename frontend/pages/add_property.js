import Router from 'next/router';
import { getCookie } from 'cookies-next';
import { useEffect } from "react";
import SimpleSidebar from '../components/sidebar';
import { usePlacesWidget } from 'react-google-autocomplete';
import { decrypt } from '../utils/utils.js';
import React, { useState } from 'react';
import { VisuallyHiddenInput } from '@chakra-ui/react';
import { Input,
    Box,
    FormControl,
    Button,
    Heading,
    Stack, 
    VStack,
    Select,
    Grid,
    Checkbox,
    CheckboxGroup,
    Divider,
} from '@chakra-ui/react';

var address = '';
var place_id = '';


/**
 * @desc Main export for the add_property page
 */
const AddProperty = () => {

    useEffect(() => {
        const token = getCookie("token");
        if (token == undefined) {
        Router.push("/login")
        }
    }, [])

    const { ref: auto } = usePlacesWidget({
        apiKey: 'AIzaSyDkjfCcoLsAdEns2kx16F8tYeuelENSTCc',
        onPlaceSelected: (place) => {
            address = place['formatted_address'];
            place_id = place['place_id'];
        },
        options: {
            types:[],
            componentRestrictions: {country: "au"},
        }
    });
    
    const [mon, setMon] = useState(false);
    const toggleMon = () => {setMon(!mon)}
    const [tue, setTue] = useState(false);
    const toggleTue = () => {setTue(!tue)}
    const [wed, setWed] = useState(false);
    const toggleWed = () => {setWed(!wed)}
    const [thu, setThu] = useState(false);
    const toggleThu = () => {setThu(!thu)}
    const [fri, setFri] = useState(false);
    const toggleFri = () => {setFri(!fri)}
    const [sat, setSat] = useState(false);
    const toggleSat = () => {setSat(!sat)}
    const [sun, setSun] = useState(false);
    const toggleSun = () => {setSun(!sun)}

    return (
        <Grid templateColumns='4fr 4fr 3fr' gap={6}>
            <Box>
                <SimpleSidebar></SimpleSidebar>
            </Box>
            <form onSubmit={addPropertyClick}>
                <VStack width="full" spacing="50px" paddingBottom="20px">   
                    <Box>
                        <Heading paddingTop="20px" >Add New Property</Heading>
                    </Box>
                    <VStack width="full">
                        <label htmlFor="image">Property Details</label>
                        <Divider orientation='horizontal' />
                        <FormControl>
                            <Input padding="5px 5px" id="image" type="file" accept=".jpeg" />
                        </FormControl>
                        <FormControl>    
                            <Input ref={auto} id="add1" placeholder="Enter Address" isRequired/>
                        </FormControl>
                        <Select id="frequency" placeholder="Inspection Frequency">
                            <option value='3'>3 Months</option>
                            <option value='6'>6 Months</option>
                            <option value='12'>12 Months</option>
                        </Select>
                    </VStack>
                    <VStack width="full">
                        <label htmlFor="image">Tenant Details</label>
                        <Divider orientation='horizontal' />
                        <FormControl paddingBottom="20px">    
                            <VStack spacing='1'>
                                <Input textAlign="center" id="tenName" placeholder="Tenant Name" isRequired/>
                                <Input textAlign="center"  id="tenNum" placeholder="Tenant Number" />
                                <Input textAlign="center"  id="tenEmail" type='email' placeholder="Tenant Email" isRequired/>
                            </VStack>
                        </FormControl>
                    </VStack>
                    <VStack width="full">
                        <label htmlFor="image">Inspection Preferences</label>
                        <Divider orientation='horizontal' />
                        <CheckboxGroup colorScheme='teal' justifyContent='center'>
                            <Stack>
                                <Checkbox mt={3} id='mon' onChange={toggleMon}>Monday</Checkbox>
                                <Checkbox mt={2} id='tue' onChange={toggleTue}>Tuesday</Checkbox>
                                <Checkbox mt={2} id='wed' onChange={toggleWed}>Wednesday</Checkbox>
                                <Checkbox mt={2} id='thu' onChange={toggleThu}>Thursday</Checkbox>
                                <Checkbox mt={2} id='fri' onChange={toggleFri}>Friday</Checkbox>
                                <Checkbox mt={2} id='sat' onChange={toggleSat}>Saturday</Checkbox>
                                <Checkbox mt={2} id='sun' onChange={toggleSun}>Sunday</Checkbox>
                                <VisuallyHiddenInput readOnly id='pref' value={String(+sun).concat(String(+mon), String(+tue), String(+wed), String(+thu), String(+fri), String(+sat))}></VisuallyHiddenInput>
                            </Stack>
                        </CheckboxGroup>
                    </VStack>
                    <VStack width="full">
                        <label htmlFor="image">Owner Details</label>
                        <Divider orientation='horizontal' />
                            <FormControl>    
                                <VStack spacing='1'>
                                    <Input textAlign="center" id="ownName" placeholder="Owner Name"/>
                                    <Input textAlign="center" id="ownNum" placeholder="Owner Number" />
                                    <Input textAlign="center" id="ownEmail" type='email' placeholder="Owner Email"/>
                                </VStack>
                            </FormControl>
                    </VStack>
                    <Button width="full" type="submit" colorScheme='teal'>
                        Add Property
                    </Button>
                </VStack>
            </form>
        </Grid>
    )
}

/**
 * @desc OnClick handler after the form is submitted
 */
const addPropertyClick = async (event) => {

    const token = decrypt(getCookie("token"));
    const Swal = require('sweetalert2');

    event.preventDefault()

    Swal.fire({
        icon: 'info',
        title: 'Adding property',
        text: 'The property is being added to our system.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false
    })

    const add1 = address;
    const place = place_id;
    const frequency = event.target.frequency.value;
    const tenName = event.target.tenName.value;
    const tenNum = event.target.tenNum.value;
    const tenEmail = event.target.tenEmail.value;
    const pref = event.target.pref.value;
    const ownName = event.target.ownName.value;
    const ownNum = event.target.ownNum.value;
    const ownEmail = event.target.ownEmail.value;

    const endpoint = "http://localhost:5000/add_property";
    
    let location;

    const geoResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${add1}&key=AIzaSyDkjfCcoLsAdEns2kx16F8tYeuelENSTCc`);
    const geoData = await geoResponse.json();

    location = 
        geoData.status === 'ZERO_RESULTS'
            ? undefined
            : geoData.results[0]?.formatted_address;
    
    if (location === undefined || location.includes('undefined')) {
        alert ('Please enter a correct address');
    }

    const lat = geoData.results[0]?.geometry.location.lat ?? 0;
    const lng = geoData.results[0]?.geometry.location.lng ?? 0;

    const data = {
        manager:token,
        add1: add1, 
        place_id: place,
        lat: lat,
        lng: lng,
        frequency: frequency, 
        tenName: tenName, 
        tenNumber:tenNum, 
        tenEmail: tenEmail, 
        pref: pref,
        ownName: ownName, 
        ownNum: ownNum, 
        ownEmail: ownEmail
    };

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };

    const response = await fetch(endpoint, options);
    const result = await response.text();

    if (result == "FAILURE") {
        Swal.fire({
            icon: 'error',
            title: 'Error Adding Property',
            text: 'The property could not be added. Please try again.',
            confirmButtonColor: 'teal'
        })
    } else {
        const image = document.getElementById('image').files[0];
        if (image != undefined) {
            const newNameImage = new File([image], result + "." + image.type.substring(6), {type: image.type});

            let formData = new FormData();
            formData.append("image", newNameImage);
            const res = await fetch("http://127.0.0.1:5000/upload_image", {method: "POST", body: formData});
        }

        Swal.fire({
            icon: 'success',
            title: 'Property Added',
            text: 'The property was added successfully.',
            confirmButtonColor: 'teal'
        })
        Router.push("/property_list")
    }    
}

export default AddProperty;