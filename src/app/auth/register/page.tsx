"use client";
import dynamic from 'next/dynamic';
import { RegisterSkeleton } from '@src/components/skeletons/Auth';

const RegisterForm = dynamic(() => import('@src/components/auth/RegisterForm'), {
    ssr: false,
    loading: () => <RegisterSkeleton />,
});

export default function RegisterPage() {
    return (
        <div className="w-full flex flex-col items-center justify-center min-h-screen p-6">
            <div className="w-full max-w-4xl p-6 rounded-xl bg-background-secondary">
                <RegisterForm />
            </div>
        </div>
    );
}