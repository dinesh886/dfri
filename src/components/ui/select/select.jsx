import React from 'react';
import './select.css';

const Select = React.forwardRef(({ children, className, ...props }, ref) => {
    return (
        <select
            ref={ref}
            className={`select ${className}`}
            {...props}
        >
            {children}
        </select>
    );
});

Select.displayName = 'Select';

export { Select };