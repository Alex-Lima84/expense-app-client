import './styles.scss'

const ProgressBar = ({
    progress
}: any) => {

    return (
        // @ts-expect-error TS(2304): Cannot find name 'div'.
        <div className="outer-bar">
            // @ts-expect-error TS(2304): Cannot find name 'div'.
            <div
                // @ts-expect-error TS(2304): Cannot find name 'className'.
                className="inner-bar"
                // @ts-expect-error TS(2304): Cannot find name 'style'.
                style={{ width: `${progress}%`, backgroundColor: '#0000F6' }}
            // @ts-expect-error TS(2365): Operator '<' cannot be applied to types 'boolean' ... Remove this comment to see the full error message
            >
            </div>
        </div>
    );
}

export default ProgressBar;