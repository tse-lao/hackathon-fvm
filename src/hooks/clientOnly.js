import { useEffect, useState } from 'react';

// Page
// ========================================================
export default function ClientOnly({ children }) {
    // State / Props
    const [hasMounted, setHasMounted] = useState(false);

    // Hooks
    useEffect(() => {
        setHasMounted(true);
    }, [])

    // Render
    if (!hasMounted) return null;

    return (
        <div>
            {children}
        </div>
    );
};