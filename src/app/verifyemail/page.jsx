'use client'

import axios from "axios"
import Link from "next/link"
import React, {useState, useEffect} from "react"
import { toast } from "react-toastify";

const VerifyEmail = () => {

    const [token, setToken] = useState("")
    const [verified, setVerified] = useState(false)
    const [error, setError] = useState(false)

    const verifyUserEmail = async () => {

        try {
            
            await axios.post('/api/users/verifyemail', {token})
            setVerified(true)

        } catch (error) {
            setError(true)
            toast.error(error.response.data.message, { theme: "dark" })
        }

    }

    useEffect(() => {

        const urlToken = window.location.search.split('=')[1]
        setToken(urlToken || "")

    },[])

    useEffect(() => {

        if(token.length > 0) {
            verifyUserEmail()
        }

    },[token])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            
            <h1 className="text-4xl">Verify Email</h1>

            {verified && (
                
                <div>
                    
                    <h2 className="p-2 bg-orange-500 text-black">Email Verified</h2>
                    <Link href='/login'>Back To Login Page</Link>
                </div>

            )}
            {error && (
                
                <div>
                    <h2 className="text-2xl">Error</h2>
                </div>

            )}

        </div>
    )

}

export default VerifyEmail