import { useEffect } from "react"
import React, { useState } from 'react'
import { getCookie } from 'cookies-next'
import { decrypt } from "../utils/utils.js"

const Home = () => {

    const [data, setData] = useState(null);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        const token = decrypt(getCookie("token"))

        const endpoint = "http://127.0.0.1:5000/get_user?token=" + token
        const options = {
            method: "GET",
        }

        fetch(endpoint, options)
            .then((res) => res.json())
            .then((data) => {
                setData(data)
                setLoading(false)
            })
    },[])

    if (isLoading) return <p>Loading...</p>
    if (!data) return <p>No profile data</p>

    return (
        <div>
            <h1>{data.fname}</h1>
            <h1>{data.lname}</h1>
            <h1>{data.email}</h1>
        </div>
    )
}

export default Home;