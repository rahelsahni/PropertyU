import Router, { useRouter } from 'next/router'
import { Input,
    Flex,
    Box,
    FormControl,
    Button,
    Heading,
} from '@chakra-ui/react'

/**
 * @desc Main export for the forgot password page
 */
const Forgot = () => {
    
    const router = useRouter();

    return (
        <Flex align="center" justifyContent="center" width="100%">
            <Box p={300} verticalAlign>
                <Box textAlign="center">
                    <Heading>Forgot Password</Heading>
                </Box>
                    <Box my={4} textAlign="left" minWidth="500px">
                        <form onSubmit={forgotClick}>
                            <FormControl>  
                                <Input id="email" type="email" placeholder="Email" />
                            </FormControl>
                            <Button width="full" mt={4} type="submit" colorScheme='teal'>
                                Submit
                            </Button>
                            <Button width="full" mt={4} onClick={() => router.push('/login')}>
                                Back
                            </Button>
                        </form>
                    </Box>
            </Box>
        </Flex>
    )
}

const forgotClick = async (event) => {

    event.preventDefault();
    const email = event.target.email.value;
    const Swal = require('sweetalert2');

    const endpoint = "http://localhost:5000/forgot?email=" + email;

    const options = {
        method: "GET",
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
    } else {
        Swal.fire({
            icon: 'success',
            title: 'Reset link sent!',
            text: 'A password reset link has been emailed to you.',
            confirmButtonColor: 'teal'
        })
        Router.push('/login');
    }
}

export default Forgot;