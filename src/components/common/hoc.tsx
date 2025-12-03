"use client";
import { UserRoles } from "@src/interfaces/auth/tokenClaims";
import { useSession } from "next-auth/react";
import { ButtonHTMLAttributes } from "react";
interface ProtectedComponentProps {
    requiredRoles: string[];
    children: React.ReactNode;
    ableForPublic?: boolean;
}

export const ProtectedComponent = ({ requiredRoles, children, ableForPublic = false }: ProtectedComponentProps) => {
    const { data: session } = useSession();

    if (!session) {
        return ableForPublic ? <>{children}</> : null;
    }

    if (!requiredRoles.includes(session.user.role)) {
        return null;
    }

    return (
        <>
            {children}
        </>
    );
}



type RoleMap = {
    [role in UserRoles]: (idEvent?: string) => void;
};

interface WithRoleActionOptions {
    actions: RoleMap;
}

export function withRoleActionButton(
    Component: React.ComponentType<ButtonHTMLAttributes<HTMLButtonElement>>,
    options: WithRoleActionOptions
) {
    return function RoleActionWrapper({  idEvent, children }: { idEvent: string, children: React.ReactNode }) {
        const { data: session, status } = useSession();

        if (status === "loading") {
            return <Component disabled onClick={() => { }} >{children}</Component>;
        }

        const userRole = session?.user?.role || "guest";
        const action = options.actions[userRole] || (() => { });

        return <Component onClick={() => action(idEvent)}>{children}</Component>;
    };
}