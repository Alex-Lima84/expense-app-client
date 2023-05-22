import { Link } from "react-router-dom"
import './styles.scss'

const Home = () => {

    return (
        // @ts-expect-error TS(2304): Cannot find name 'div'.
        <div className="home-container">
            // @ts-expect-error TS(2304): Cannot find name 'h2'.
            <h2>Welcome to my website</h2>
            // @ts-expect-error TS(2304): Cannot find name 'div'.
            <div className="links-container">
                // @ts-expect-error TS(2749): 'Link' refers to a value, but is being used as a t... Remove this comment to see the full error message
                <Link to='/login'>Log in</Link>
                // @ts-expect-error TS(2304): Cannot find name 'to'.
                <Link to='/signin'>Sign in</Link>
            </div>
        </div>
    )
}

export default Home