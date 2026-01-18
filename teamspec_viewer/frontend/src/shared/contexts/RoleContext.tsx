import { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'BA' | 'FA' | 'DEV' | 'SA' | 'QA' | null;

interface RoleContextType {
    role: Role;
    setRole: (role: Role) => void;
    clearRole: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
    const [role, setRoleState] = useState<Role>(null);

    const setRole = (newRole: Role) => {
        setRoleState(newRole);
    };

    const clearRole = () => {
        setRoleState(null);
    };

    return (
        <RoleContext.Provider value={{ role, setRole, clearRole }}>
            {children}
        </RoleContext.Provider>
    );
}

export function useRole() {
    const context = useContext(RoleContext);
    if (context === undefined) {
        throw new Error('useRole must be used within a RoleProvider');
    }
    return context;
}
