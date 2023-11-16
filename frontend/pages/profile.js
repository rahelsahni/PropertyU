import SimpleSidebar from '../components/sidebar';
import React, { useState } from 'react';
import { getCookie } from 'cookies-next';
import { useEffect } from "react";
import Router from 'next/router';
import { decrypt } from '../utils/utils.js';
import {
  Box,
  Heading,
  FormControl,
  Input,
  Button,
  Grid
} from '@chakra-ui/react';

/**
 * @desc Main export for the profile page
 */
const Profile = () => {

  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const token = getCookie("token");
    if (token == undefined) {
      Router.push("/login");
    } else {
        setLoading(true)
        const token = decrypt(getCookie("token"));

        const endpoint = "http://localhost:5000/get_user?token=" + token;
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

  if (isLoading) return <p></p>
  if (!data) return <p></p>

  return (
    <Grid templateColumns='4fr 4fr 3fr' gap={6}>
        <Box>
            <SimpleSidebar></SimpleSidebar>
        </Box>
        <Box textAlign="center">
                <Box padding="20px 0px">
                    <Heading>Profile</Heading>
                </Box>
                    <Box my={4} textAlign="center" >
                          <form onSubmit={updateClick}>
                            <FormControl mt={4}>
                              <Input textAlign="center" id="fname" placeholder={data.fname} />
                            </FormControl>
                            <FormControl mt={4}>
                              <Input textAlign="center" id="lname" placeholder={data.lname} />
                            </FormControl>
                            <FormControl mt={4}>
                              <Input textAlign="center" id="email" type="email" placeholder={data.email} />
                            </FormControl>
                            <Button width="full" mt={4} type="submit" colorScheme='teal'>
                                Update Details
                            </Button>
                          </form>
                    </Box>
            </Box>
    </Grid>
  )
}

/**
 * @desc OnClick handler for the update button after form submit
 */
const updateClick = async (event) => {

  event.preventDefault();

  const Swal = require('sweetalert2');

  const fname = event.target.fname.value;
  if (fname == "") {fname = event.target.fname.placeholder} 
  const lname = event.target.lname.value;
  if (lname == "") {lname = event.target.lname.placeholder}
  const email = event.target.email.value;
  if (email == "") {email = event.target.email.placeholder}
  const token = decrypt(getCookie("token"));

  const endpoint = "http://localhost:5000/edit_user?token=" + token;

  const data = { 
      email: email, 
      fname: fname,
      lname: lname,
  };

  const options = {
      //mode: 'no-cors',
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
  };

  const response = await fetch(endpoint, options);
  const result = await response.text();

  if (result == "FUSER") {
    Swal.fire({
      icon: 'error',
      title: 'This email is in use.',
      text: 'The email address provided is already linked to an account.',
      confirmButtonColor: 'teal'
    })
  } else {
    Router.reload();
  }
}

export default Profile;