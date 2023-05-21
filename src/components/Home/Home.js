import { Link } from "react-router-dom"
import './styles.scss'

const Home = () => {

    return (
        <div className="home-container">
            <h2>Welcome to my website</h2>
            <div className="links-container">
                <Link to='/login'>Log in</Link>
                <Link to='/signin'>Sign in</Link>
            </div>
        </div>
    )
}

export default Home