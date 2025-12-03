import type { Metadata } from "next";
import "@src/styles/globals.css";
import AuthProvider from '@src/components/context/AuthProvider';
import Header from '@src/components/common/Header';
import { NotificationProvider } from "@src/components/context/NotificationContext";
import SessionWatcher from '../components/context/SessionWatcher';

export const metadata: Metadata = {
    title: "Cultural Pass",
    description: "Plataforma de gestión de eventos culturales",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body
                className="bg-background "
            >

                <NotificationProvider>
                    <AuthProvider>
                        <SessionWatcher />
                        <Header />
                        {children}
                    </AuthProvider>
                </NotificationProvider>
                
            </body>
        </html>
    );
}
