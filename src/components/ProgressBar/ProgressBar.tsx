import './styles.scss'

const ProgressBar = ({
    progress
}: any) => {

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