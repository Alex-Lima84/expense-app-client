import './styles.scss'

const ProgressBar = ({ progress }) => {

    return (
        <div className="outer-bar">
            <div
                className="inner-bar"
                style={{ width: `${progress}%`, backgroundColor: '#0000F6' }}
            >
            </div>
        </div>
    );
}

export default ProgressBar;