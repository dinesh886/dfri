import React from 'react';
import './table.css';

const Table = React.forwardRef(({ className, children, ...props }, ref) => {
    return (
        <table
            ref={ref}
            className={`table ${className}`}
            {...props}
        >
            {children}
        </table>
    );
});

Table.displayName = 'Table';

export { Table };