import Router, { useRouter } from 'next/router';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import { Input,
    Flex,
    Box,
    FormControl,
    Button,
    Heading,
} from '@chakra-ui/react';

/**
 * @desc Main export for the reset password page
 */
const Reset = () => {

    const router = useRouter();
    const params = router.query['code'];
    setCookie('params', params)

    return (
        <Flex align="center" justifyContent="center" width="100%">
            <Box p={300} verticalAlign>
                <Box textAlign="center">
                    <Heading>Reset your password</Heading>
                </Box>
                    <Box my={4} textAlign="left" minWidth="500px">
                        <form onSubmit={resetClick}>
                            <FormControl>        
                                <Input id="password" type="password" placeholder="New password" />
                            </FormControl>
                            <FormControl mt={4}>                     
                                <Input id="password2" type="password" placeholder="Confirm password" />
                            </FormControl>                  
                            <Button width="full" mt={4} type="submit" colorScheme='teal'>
                                Reset
                            </Button>
                            <Button width="full" mt={4} onClick={() => router.push('/login')}>
                                Back to login
                            </Button>
                        </form>
                    </Box>
            </Box>
        </Flex>
    );
}

/**
 * @desc OnClick handler for the reset password button after form submit
 */
const resetClick = async (event) => {

    event.preventDefault()
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
        const params = getCookie('params');
        deleteCookie('params')

        const email = window.atob(params);

        const endpoint = "http://localhost:5000/reset";

        const data = {
            email: email,
            password: password
        };
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };

        const response = await fetch(endpoint, options);
        const result = await response.text();

        Swal.fire({
            icon: 'success',
            title: 'Password changed!',
            text: 'Your password was successfully changed.',
            confirmButtonColor: 'teal'
        })

        Router.push('/login')
    }
}

export default Reset;