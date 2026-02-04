import './Card.css';

function Card({
    children,
    variant = 'default',
    hover = true,
    padding = 'md',
    className = '',
    onClick,
    ...props
}) {
    const classNames = [
        'card-component',
        `card-component--${variant}`,
        hover && 'card-component--hover',
        `card-component--padding-${padding}`,
        onClick && 'card-component--clickable',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={classNames} onClick={onClick} {...props}>
            {children}
        </div>
    );
}

function CardHeader({ children, className = '' }) {
    return <div className={`card-component__header ${className}`}>{children}</div>;
}

function CardBody({ children, className = '' }) {
    return <div className={`card-component__body ${className}`}>{children}</div>;
}

function CardFooter({ children, className = '' }) {
    return <div className={`card-component__footer ${className}`}>{children}</div>;
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
