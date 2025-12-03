// src/services/auth/login.ts
"use server";
import { AuthResponse } from "@src/interfaces/auth/AuthResponse";
import { LoginRequest } from "@src/interfaces/auth/LoginRequest";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

export const login = async (credentials: LoginRequest) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json() as Promise<AuthResponse>;
};
