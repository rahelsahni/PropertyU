import Router from 'next/router';
import { getCookie } from 'cookies-next';
import { useEffect } from "react";
import SimpleSidebar from '../components/sidebar';
import React, { useState } from 'react';
import { usePlacesWidget } from 'react-google-autocomplete';
import { Input,
    Box,
    FormControl,
    Button,
    Heading,
    Stack, 
    VStack,
    Select,
    Grid,
    GridItem,
    Image,
    CheckboxGroup,
    Checkbox,
    Text,
    Divider,
} from '@chakra-ui/react';

var status = '';
var freq = 3;
var address = '';
var place_id = '';
var sunState;
var monState;
var tueState; 
var wedState; 
var thuState; 
var friState;
var satState;

/**
 * @desc Main export for the edit_property page
 */
const EditProperty = () => {
    const [data, setData] = useState(null);
    const [isLoading, setLoading] = useState(false);
    var id;

    useEffect(() => {
        const token = getCookie("token")
        if (token == undefined) {
            Router.push("/login")
        } else {
            setLoading(true)
            const token = getCookie("token");
            id = Router.query.id;

            if (id == undefined) {
                Router.push("/property_list");
            } else {
                const endpoint = "http://localhost:5000/request_edit?token=" + token + "&id=" + id
                const options = {
                    method: "GET",
                }
    
                fetch(endpoint, options)
                    .then((res) => res.json())
                    .then((data) => {
                    setData(data)
                    setLoading(false)
                }) 
            }
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
    })

    const [mon, setMon] = useState(null);
    const [tue, setTue] = useState(null);
    const [wed, setWed] = useState(null);
    const [thu, setThu] = useState(null);
    const [fri, setFri] = useState(null);
    const [sat, setSat] = useState(null);
    const [sun, setSun] = useState(null);

    // Handlers to deal with each check box click

    var toggleMon = () => {
        setMon(!mon)
        monState = !mon
    }

    var toggleTue = () => {
        setTue(!tue)
        tueState = !tue
    }

    var toggleWed = () => {
        setWed(!wed)
        wedState = !wed
    }

    var toggleThu = () => {
        setThu(!thu)
        thuState = !thu
    }
    var toggleFri = () => {
        setFri(!fri)
        friState = !fri
    }

    var toggleSat = () => {
        setSat(!sat)
        satState = !sat
    }

    var toggleSun = () => {
        setSun(!sun)
        sunState = !sun
    }

    if (isLoading) return <p></p>
    if (!data) return <p></p>

    if (data.address1 == ""){
        data.address1 = "Address Line 1";
    }
    if (data.tenName == ""){
        data.tenName = "Tenant Name";
    }
    if (data.tenNum == ""){
        data.tenNum = "Tenant Number";
    }
    if (data.tenEmail == ""){
        data.tenEmail = "Tenant Email";
    }
    if (data.ownName == ""){
        data.ownName = "Owner Name";
    }
    if (data.ownNum == ""){
        data.ownNum = "Owner Number";
    }
    if (data.ownEmail == ""){
        data.ownEmail = "Owner Email";
    }

    const freqPlaceholder = "Current Inspection Frequency: " + String(data.frequency) + " Months";
    freq = data.frequency;
    id = Router.query.id;;


    var srcJPEG = "/pictures/" + id + ".jpeg"

    if (sun == null) {
        if (data.preferences[0] == "1") {
            setSun(true)
            sunState = true
        } else {
            setSun(false)
            sunState = false
        }

        if (data.preferences[1] == "1") {
            setMon(true)
            monState = true
        } else {
            setMon(false)
            monState = false
        }

        if (data.preferences[2] == "1") {
            setTue(true)
            tueState = true
        } else {
            setTue(false)
            tueState = false
        }

        if (data.preferences[3] == "1") {
            setWed(true)
            wedState = true
        } else {
            setWed(false)
            wedState = false
        }

        if (data.preferences[4] == "1") {
            setThu(true)
            thuState = true
        } else {
            setThu(false)
            thuState = false
        }

        if (data.preferences[5] == "1") {
            setFri(true)
            friState = true
        } else {
            setFri(false)
            friState = false
        }

        if (data.preferences[6] == "1") {
            setSat(true)
            satState = true
        } else {
            setSat(false)
            satState = false
        }
    }

    status = data.to_be_inspected;

    return (
        <Grid templateColumns='4fr 5fr 2fr' gap={10}>
            <Box>
                <SimpleSidebar></SimpleSidebar>
            </Box>
            <form onSubmit={editPropertyClick}>
                <VStack spacing="40px">   
                    <Box textAlign="center">
                        <Heading as='h1' paddingTop="20px">Property Profile</Heading>
                        <Heading as='h2' size='sm'>{data.address1}</Heading>
                    </Box>
                    <VStack width="full">
                        <label htmlFor="image">Property Details</label>
                        <Divider orientation='horizontal' />
                        <Grid width="full">
                            <GridItem textAlign="right" colStart={2} colEnd={3}>
                                <Image border="2px"
                                    src={srcJPEG}
                                    boxSize='160px'
                                />
                            </GridItem>
                            <GridItem textAlign="left" colStart={4} colEnd={8} minwidth="full">
                                <Box padding="10px 10px">
                                    <FormControl minwidth="full" alignContent="center" padding="2px 2px">
                                        <Input padding='10px 10px' h='50px' id="image" type="file" accept=".jpeg" />
                                    </FormControl>
                                    <FormControl padding="2px 2px">
                                        <Input width="full" ref={auto} id="add1" placeholder={data.address1} />
                                    </FormControl>
                                    <Select minwidth="full" id="frequency" placeholder={freqPlaceholder} padding="2px 2px">
                                        <option value='3'>3 Months</option>
                                        <option value='6'>6 Months</option>
                                        <option value='12'>12 Months</option>
                                    </Select>
                                </Box>
                            </GridItem>
                        </Grid>
                    </VStack>
                    <VStack width="full">
                        <Box>  
                            Tenant Details
                        </Box>
                        <Divider orientation='horizontal' />
                        <FormControl textAlign="center">    
                            <VStack spacing='1'>
                                <Input textAlign="center"  padding="2px 2px" id="tenName" placeholder={data.tenName} />
                                <Input textAlign="center"  padding="2px 2px"  id="tenNum" placeholder={data.tenNum} />
                                <Input textAlign="center"  padding="2px 2px"  id="tenEmail" placeholder={data.tenEmail} />
                            </VStack>
                        </FormControl>
                    </VStack>
                    <VStack width="full">
                        <Text mt={4}>Inspection Preferences</Text>
                        <Divider orientation='horizontal' />
                        <CheckboxGroup colorScheme='teal' justifyContent='center'>
                            <Stack>
                                <Checkbox mt={4} id='mon' isChecked={mon} onChange={toggleMon}>Monday</Checkbox>
                                <Checkbox mt={2} id='tue' isChecked={tue} onChange={toggleTue}>Tuesday</Checkbox>
                                <Checkbox mt={2} id='wed' isChecked={wed} onChange={toggleWed}>Wednesday</Checkbox>
                                <Checkbox mt={2} id='thu' isChecked={thu} onChange={toggleThu}>Thursday</Checkbox>
                                <Checkbox mt={2} id='fri' isChecked={fri} onChange={toggleFri}>Friday</Checkbox>
                                <Checkbox mt={2} id='sat' isChecked={sat} onChange={toggleSat}>Saturday</Checkbox>
                                <Checkbox mt={2} id='sun' isChecked={sun} onChange={toggleSun}>Sunday</Checkbox>
                            </Stack>
                        </CheckboxGroup>
                    </VStack>
                    <VStack width="full">
                        <Box>  
                            Owner Details
                        </Box>
                        <Divider orientation='horizontal' />
                        <FormControl minwidth="full">    
                            <VStack spacing='1'>
                                <Input textAlign="center"  width="full" id="ownName" placeholder={data.ownName}/>
                                <Input textAlign="center"  width="full" id="ownNum" placeholder={data.ownNum}/>
                                <Input textAlign="center"  width="full" id="ownEmail" placeholder={data.ownEmail} />
                            </VStack>
                        </FormControl>
                    </VStack>
                    <VStack paddingBottom="20px" spacing="10px" minWidth="full">
                        <Button width="full" mt={4} colorScheme='blue' onClick={inspectionPoolClick}>
                            Add To Inspection Pool
                        </Button>
                        <Button width="full" mt={4} type="submit" colorScheme='teal'>
                            Confirm Changes
                        </Button>
                    </VStack>
                </VStack>
            </form>
        </Grid>
    )
}

/**
 * @desc OnClick handler after edit changes are confirmed 
 */
const editPropertyClick = async (event) => {

    const token = getCookie("token");

    event.preventDefault();

    const add1 = address;
    if (add1 == "") {add1 = event.target.add1.placeholder}

    const frequency = event.target.frequency.value;
    if (frequency == "") {frequency = freq}

    const tenName = event.target.tenName.value;
    if (tenName == "") {tenName = event.target.tenName.placeholder}

    const tenNum = event.target.tenNum.value;
    if (tenNum == "") {tenNum = event.target.tenNum.placeholder}

    const tenEmail = event.target.tenEmail.value;
    if (tenEmail == "") {tenEmail = event.target.tenEmail.placeholder}

    const ownName = event.target.ownName.value;
    if (ownName == "") {ownName = event.target.ownName.placeholder}

    const ownNum = event.target.ownNum.value;
    if (ownNum == "") {ownNum = event.target.ownNum.placeholder}

    const ownEmail = event.target.ownEmail.value;
    if (ownEmail == "") {ownEmail = event.target.ownEmail.placeholder}

    const pref = String(+sunState).concat(String(+monState), String(+tueState), String(+wedState), String(+thuState), String(+friState), String(+satState));

    const id = Router.query.id;

    const endpoint = "http://localhost:5000/edit_property";

    const data_ = {
        manager:token,
        id: id,
        add1: add1, 
        frequency: frequency, 
        tenName: tenName, 
        tenNum:tenNum, 
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
        body: JSON.stringify(data_)
    };

    const response = await fetch(endpoint, options);
    const result = await response.text();

    const image = document.getElementById('image').files[0];
    if (image != undefined) {
        
        const newNameImage = new File([image], id + "." + image.type.substring(6), {type: image.type});
        let formData = new FormData();
        formData.append("image", newNameImage);
        const res = await fetch("http://127.0.0.1:5000/upload_image", {method: "POST", body: formData});
    }
    Router.push("/property_list")
}

/**
 * @desc OnClick handler for the 'add to inspection pool' button
 */
const inspectionPoolClick = async (event) => {

    const Swal = require('sweetalert2');

    const id = Router.query.id;

    if (status == "Not Due") {

        const endpoint = "http://localhost:5000/add_to_inspection_pool";
        
        const data_ = {
            id: id
        };

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data_)
        };
    
        const response = await fetch(endpoint, options);
        const result = await response.text();

        if (result == "Success") {
            status = "Due";
            Swal.fire({
                icon: 'success',
                title: 'Successfully Added to Inspection Pool.',
                text: 'The property is now in the inspection pool.',
                confirmButtonColor: 'teal'
            })
        }

    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Already in Inspection Pool.',
            text: 'The property is already in the inspection pool.',
            confirmButtonColor: 'teal'
        })
    }
}

export default EditProperty;