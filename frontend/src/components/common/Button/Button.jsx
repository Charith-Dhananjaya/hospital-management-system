import './Button.css';

function Button({
    children,
    variant = 'primary',
    size = 'md',
    type = 'button',
    disabled = false,
    loading = false,
    fullWidth = false,
    icon,
    iconPosition = 'left',
    className = '',
    onClick,
    ...props
}) {
    const classNames = [
        'btn',
        `btn-${variant}`,
        size !== 'md' && `btn-${size}`,
        fullWidth && 'btn-full',
        loading && 'btn-loading',
        className,
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={classNames}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading ? (
                <span className="btn__spinner" />
            ) : (
                <>
                    {icon && iconPosition === 'left' && <span className="btn__icon">{icon}</span>}
                    {children}
                    {icon && iconPosition === 'right' && <span className="btn__icon">{icon}</span>}
                </>
            )}
        </button>
    );
}

export default Button;
