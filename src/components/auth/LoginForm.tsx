"use client";
import { LoginRequest } from "@src/interfaces/auth/LoginRequest";
import { useForm, SubmitHandler } from "react-hook-form"
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import Logo from "@src/assets/logo.png"
import Image from 'next/image';

export default function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginRequest>()

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const error = searchParams.get("error");

    const onSubmit: SubmitHandler<LoginRequest> = (credentials) => {
        signIn("credentials", {
            ...credentials,
            redirect: true,
            callbackUrl
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-5 flex items-center justify-center">
                    <Image className="w-9/12  h-auto" src={Logo} alt="Logo" priority />
                </div>

                <div className="md:col-span-7">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <label htmlFor="email" className="text-white pl-2 pb-1">Correo</label>
                            <input id="email" className="rounded-2xl bg-background-tertiary px-3 py-2 w-full" type="email" placeholder="Email" {...register("email", { required: true })} />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="password" className="text-white pl-2 pb-1">Contraseña</label>
                            <input id="password" className="rounded-2xl bg-background-tertiary px-3 py-2 w-full" type="password" placeholder="Password" {...register("password", { required: true })} />
                        </div>

                        <div className="text-sm text-red-500">
                            {errors.email && <div>El correo es obligatorio</div>}
                            {errors.password && <div>La contraseña es obligatoria</div>}
                            {error && <div className="text-red-500">Credenciales inválidas</div>}
                        </div>

                        <div className="text-white">
                            No tienes cuenta? <Link href={`/auth/register${callbackUrl ? `?callbackUrl=${callbackUrl}` : ''}`}>Regístrate</Link>
                        </div>

                        <div className="flex justify-center">
                            <button type="submit" className="w-10/12 md:w-6/12 bg-background p-2 rounded-2xl">Iniciar Sesión</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );

}