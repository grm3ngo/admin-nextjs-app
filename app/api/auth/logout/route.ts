import { NextRequest,NextResponse } from "next/server";
import { deleteSession } from "@/app/services";
import { ApiResponse } from "@/app/types";

export async function POST(request: NextRequest) {
    try {
    const authentication = request.headers.get("Authorization");
    const token = authentication?.replace("Bearer ", "");

    if (!token) {
        return NextResponse.json<ApiResponse<null>>({
            success: false,
            error: "Unauthorized",
            message: "No token provided"
        }, { status: 401 });
    }

    await deleteSession(token);

    return NextResponse.json<ApiResponse<null>>({
        success: true,
        message: "Logged out successfully"
    }); 
    } catch (error) {
        return NextResponse.json<ApiResponse<null>>({
            success: false,
            error: "Internal Server Error",
            message: "An error occurred while processing your request"
        }, { status: 500 });
    }
}
