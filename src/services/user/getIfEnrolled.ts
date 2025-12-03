"use server";
import { BackendError } from "@src/interfaces/common/BackendError";
import { ServerActionResponse } from "@src/interfaces/common/ServerActionResponse";
import { getTokenServerAction } from "@src/utils/jwt";
import loaderEnv from "@src/utils/loaderEnv";

const API_URL = loaderEnv("BACKEND_URL")+ "/api/user";

export async function getIfEnrolled(idEvent: string): Promise<ServerActionResponse<boolean>> {
    let token = "";
    try {
        token = await getTokenServerAction();
    } catch (_error) {
        // No token available — devolver estado no autenticado.
        console.warn("getIfEnrolled: user not authenticated or token retrieval failed", _error);
        return {
            success: true,
            type: "warning",
            message: "User is not authenticated.",
            data: false
        }
    }
    const response = await fetch(`${API_URL}/me/enrolled/${idEvent}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
    });

    const data = await response.json();


    if (response.ok) {
        return {
            success: true,
            type: "success",
            message: "Successfully retrieved enrollment status.",
            data: data
        };
    } 

    const responseError: BackendError = data;

    return {
        success: false,
        type: "error",
        message: responseError.message || "Failed to retrieve enrollment status.",
        data: false
    };
    
}