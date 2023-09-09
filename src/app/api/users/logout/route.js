import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {

    try {
        
        const response = NextResponse.json({
            message: "Logout successful",
            success: true
        })

        // response.cookies.set("token", '', {
        //     httpOnly:false, expires: new Date(0)
        // })

        cookies().delete('token')

        return response

    } catch (error) {
        return NextResponse.json({error: "error.message"} , {status: 500})
    }

}