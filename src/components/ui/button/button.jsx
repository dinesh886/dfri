import React from 'react';
import './button.css';

const Button = React.forwardRef(({
    className = '',
    variant = 'default',
    size = 'default',
    children,
    ...props
}, ref) => {
    return (
        <button
            ref={ref}
            className={`btn ${variant} ${size} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export { Button };