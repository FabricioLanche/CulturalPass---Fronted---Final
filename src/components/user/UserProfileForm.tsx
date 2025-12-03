"use client";
import { useState } from "react";
import { UserResponse } from "@src/interfaces/user/user";
//this is a basic implementation due to, the user will be able to edit his profile in future updates
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useForm, SubmitHandler } from "react-hook-form"

export const ProfileForm = ({ data }: { data: UserResponse }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isEditing, setIsEditing] = useState(false);
    
    return (
        <form className="w-10/12 mx-auto p-5 bg-background-tertiary/80 rounded-2xl m-5 ">
            <h1 className="text-center my-2 font-bold text-xl">Perfil de Usuario</h1>
            <div className="flex flex-row p-3 gap-4">
                <label htmlFor="">Nombres: </label>
                <input type="text" defaultValue={data.firstName}  disabled={!isEditing}/>
            </div>
            <div className="flex flex-row p-3 gap-4">
                <label htmlFor="">Apellidos: </label>
                <input type="text" defaultValue={data.lastName} disabled={!isEditing} />
            </div>
            <div className="flex flex-row p-3 gap-4">
                <label htmlFor="">Correo: </label>
                <input type="email" defaultValue={data.email} disabled={!isEditing} />
            </div>
            <div className="flex flex-row p-3 gap-4">
                <label htmlFor="">Teléfono: </label>
                <input type="text" defaultValue={data.cellphone || ''} disabled={!isEditing} />
            </div>

{/*         {
            isEditing ? 
            <div className="flex justify-center mt-4">
                <button 
                    type="button"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    onClick={() => setIsEditing(false)}
                >
                    Guardar
                </button>
                <button
                    type="button"
                    className="ml-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    onClick={() => setIsEditing(false)}
                >
                    Cancelar
                </button>
            </div>
            :
            <div className="flex justify-center mt-4">
                <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    onClick={() => setIsEditing(true)}
                >
                    Editar Perfil
                </button>
            </div>
        } */}

        </form>
    );
}