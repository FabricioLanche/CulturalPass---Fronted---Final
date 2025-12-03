"use server";

import { UserResponse } from "@src/interfaces/user/user";
import { getTokenServerAction } from "@src/utils/jwt";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";


export const getUserProfile = async (token: string) => {
    const res = await fetch(`${API_URL}/api/user/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch user profile");
    }

    return res.json() as Promise<UserResponse>;
};

export const getProfile = async () => {
    const token = await getTokenServerAction();

    const data = await getUserProfile(token);
    return data;
}
