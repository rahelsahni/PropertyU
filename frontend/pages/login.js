import Router from 'next/router';
import { setCookie, getCookie } from 'cookies-next';
import { Input,
    Flex,
    Box,
    FormControl,
    Button,
    Heading,
} from '@chakra-ui/react';

/**
 * @desc Main export for the login page
 */
const Login = () => {
    return (
        <Flex align="center" justifyContent="center" width="100%">
            <Box p={200} verticalAlign>
                <Box>
                    <Heading size='4xl'>Welcome to PropertyU</Heading>
                </Box>
                <Box mt={20} textAlign="center">
                    <Heading>Login</Heading> 
                </Box>
                <Box my={4} textAlign="left" minWidth="500px">
                    <form onSubmit={loginClick}>
                        <FormControl>             
                            <Input id="email" type="email" placeholder="Email" required />
                        </FormControl>
                        <FormControl mt={4}>                            
                            <Input id="password" type="password" placeholder="Password" required />
                        </FormControl>
                        <Button width="full" mt={4} type="submit" colorScheme='teal'>
                            Sign In
                        </Button>
                        <Button width="full" mt={4} onClick={() => Router.push('/sign_up')}>
                            Sign Up
                        </Button>
                        <Button width="full" mt={4} onClick={() => Router.push('/forgot')} variant='link' size='xs'>                      
                            Forgot Password
                        </Button>
                    </form>
                </Box>
            </Box>
        </Flex>
    )
}

/**
 * @desc OnClick handler for the login button after form submit
 */
const loginClick = async (event) => {

    event.preventDefault();

    const Swal = require('sweetalert2');

    const email = event.target.email.value;
    const password = event.target.password.value;

    const endpoint = "http://localhost:5000/check_user";

    const data = { 
        email: email, 
        password: password
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }

    const response = await fetch(endpoint, options);
    const result = await response.text();
        
    if (result == "NUSER") {

        Swal.fire({
            icon: 'error',
            title: 'This user does not exist.',
            text: 'The email address provided is not linked to an account.',
            confirmButtonColor: 'teal'
        })
    }
    else if (result == "NPASS") {
        Swal.fire({
            icon: 'error',
            title: 'Incorrect password',
            text: 'The password provided is incorrect.',
            confirmButtonColor: 'teal'
        })
    }
    else {
        setCookie('token', result);
        const token = getCookie('token');
        Router.push('/profile');
    }
}

export default Login;
