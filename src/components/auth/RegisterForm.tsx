"use client";
import { RegisterRequest } from "@src/interfaces/auth/RegisterRequest";
import { useForm, SubmitHandler } from "react-hook-form"
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import Logo from "@src/assets/logo.png"
import Image from 'next/image';
import { register as registerService } from '@src/services/auth/register';

export default function RegisterForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterRequest>();

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const error = searchParams.get("error");

    const onSubmit: SubmitHandler<RegisterRequest> = async (dataForRegister) => {
        await registerService(dataForRegister);

        signIn(
            "credentials",
            {
                ...{
                    email: dataForRegister.email,
                    password: dataForRegister.password,
                },
                redirect: true,
                callbackUrl,
            },
            // fallback
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-5 flex items-center justify-center flex-col h-full">
                    <Image className="w-9/12 h-auto" src={Logo} alt="Logo" priority />
                </div>

                <div className="md:col-span-7">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label htmlFor="email" className="text-white pl-2 pb-1">Correo</label>
                            <input
                                id="email"
                                className="rounded-2xl bg-background-tertiary px-3 py-2 w-full"
                                type="email"
                                placeholder="Email"
                                {...register("email", { required: true })}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="password" className="text-white pl-2 pb-1">Contraseña</label>
                            <input
                                id="password"
                                className="rounded-2xl bg-background-tertiary px-3 py-2 w-full"
                                type="password"
                                placeholder="Password"
                                {...register("password", { required: true })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                        <div className="flex flex-col">
                            <label htmlFor="firstName" className="text-white pl-2 pb-1">Nombres</label>
                            <input
                                id="firstName"
                                className="rounded-2xl bg-background-tertiary px-3 py-2 w-full"
                                type="text"
                                placeholder="Nombres"
                                {...register("firstName", { required: true })}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="lastName" className="text-white pl-2 pb-1">Apellidos</label>
                            <input
                                id="lastName"
                                className="rounded-2xl bg-background-tertiary px-3 py-2 w-full"
                                type="text"
                                placeholder="Apellidos"
                                {...register("lastName", { required: true })}
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="cellphone" className="text-white pl-2 pb-1">Número de celular</label>
                        <input
                            id="cellphone"
                            className="rounded-2xl bg-background-tertiary px-3 py-2 w-full max-w-sm"
                            type="text"
                            placeholder="Número de celular"
                            {...register("cellphone", { required: true })}
                        />
                    </div>

                    <div className="mt-3 text-sm text-red-500">
                        {errors.email && <div>El correo es obligatorio</div>}
                        {errors.password && <div>La contraseña es obligatoria</div>}
                        {error && <div className="text-red-500">Credenciales inválidas</div>}
                    </div>

                    <div className="mt-4 text-white text-center">
                        Ya tienes cuenta? <Link href={`/auth/login${callbackUrl ? `?callbackUrl=${callbackUrl}` : ''}`}>Inicia Sesión</Link>
                    </div>

                    <div className="mt-4 flex justify-center">
                        <button type="submit" className="w-10/12 md:w-6/12 bg-background p-2 rounded-2xl">Registrarse</button>
                    </div>
                </div>
            </div>
        </form>
    );
}