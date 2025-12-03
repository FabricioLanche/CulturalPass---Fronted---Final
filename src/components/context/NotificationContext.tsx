"use client";
import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface NotificationData {
    message: string;
    type?: "success" | "error" | "info";
    duration?: number; 
}

interface NotificationContextProps {
    showNotification: (data: NotificationData) => void;
    hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const useNotification = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error("useNotification debe usarse dentro de NotificationProvider");
    return ctx;
};

import Notification from "../common/Notification";

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notification, setNotification] = useState<NotificationData & { visible: boolean }>({ message: "", type: "info", visible: false });
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const hideNotification = useCallback(() => {
        setNotification((n) => ({ ...n, visible: false }));
        if (timeoutId) clearTimeout(timeoutId);
    }, [timeoutId]);

    const showNotification = useCallback((data: NotificationData) => {
        setNotification({ ...data, visible: true });
        if (timeoutId) clearTimeout(timeoutId);
        if (data.duration && data.duration > 0) {
            const id = setTimeout(() => setNotification((n) => ({ ...n, visible: false })), data.duration);
            setTimeoutId(id);
        }
    }, [timeoutId]);

    return (
        <NotificationContext.Provider value={{ showNotification, hideNotification }}>
            {children}
            <Notification
                message={notification.message}
                visible={notification.visible}
                onClose={hideNotification}
                status={notification.type || "info"}
            />
        </NotificationContext.Provider>
    );
};