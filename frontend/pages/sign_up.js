import Router from 'next/router';

import { Input,
    Flex,
    Box,
    FormControl,
    Button,
    Heading,
} from '@chakra-ui/react';

/**
* @desc Main export for the sign_up page
*/
const SignUp = () => {
    return (
        <Flex align="center" justifyContent="center" width="100%">
            <Box p={300} verticalAlign>
                <Box textAlign="center">
                    <Heading>Sign Up</Heading>
                </Box>
                <Box my={4} textAlign="left" minWidth="500px">
                    <form onSubmit={signupClick}>
                        <FormControl isRequired>                      
                            <Input id="first" placeholder="First name" />
                        </FormControl>
                        <FormControl mt={4} isRequired>                             
                            <Input id="last" placeholder="Last name" />
                        </FormControl>
                        <FormControl mt={4} isRequired>                           
                            <Input id="email" type="email" placeholder="Email" />
                        </FormControl>
                        <FormControl mt={4} isRequired>                            
                            <Input id="password" type="password" placeholder="Password" />
                        </FormControl>
                        <FormControl mt={4} isRequired>                            
                            <Input id="password2" type="password" placeholder="Confirm password" />                        
                        </FormControl>
                        <Button width="full" mt={4} type="submit" colorScheme='teal'>                        
                            Sign Up
                        </Button>
                        <Button width="full" mt={4} onClick={() => Router.push('/login')}>                        
                            I already have an account
                        </Button>
                    </form>
                </Box>
            </Box>         
        </Flex>
    );
}

/**
* @desc Handler for the OnClick Sign-Up button
*/
const signupClick = async (event) => {

    event.preventDefault()

    const fname = event.target.first.value;
    const lname = event.target.last.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const password2 = event.target.password2.value;
    const Swal = require('sweetalert2');

    if (password != password2) {
        Swal.fire({
            icon: 'error',
            title: 'Passwords do not match.',
            text: 'The provided passwords do not match.',
            confirmButtonColor: 'teal'
        })
    } else {
        const endpoint = "http://localhost:5000/add_user";
        const data = {
            fname: fname, 
            lname: lname, 
            email: email, 
            password: password
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

        if (result == "FUSER") {
            Swal.fire({
                icon: 'error',
                title: 'This email is in use.',
                text: 'The email address provided is already linked to an account.',
                confirmButtonColor: 'teal'
            })
        } else {
            Router.push('/login')
        }
    }
}

export default SignUp;