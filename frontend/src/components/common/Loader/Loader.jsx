import './Loader.css';

function Loader({ size = 'md', color = 'primary', fullScreen = false, text = '' }) {
    const sizeClass = `loader--${size}`;
    const colorClass = `loader--${color}`;

    if (fullScreen) {
        return (
            <div className="loader-fullscreen">
                <div className={`loader ${sizeClass} ${colorClass}`}>
                    <div className="loader__spinner" />
                    {text && <p className="loader__text">{text}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className={`loader ${sizeClass} ${colorClass}`}>
            <div className="loader__spinner" />
            {text && <p className="loader__text">{text}</p>}
        </div>
    );
}

export default Loader;
