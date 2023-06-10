import { useCookies } from 'react-cookie'
import { Link } from "react-router-dom"
import './styles.scss'

const Home = () => {
    const [cookies, , removeCookie] = useCookies<any>(undefined)
    const userEmail = cookies.Email
    const authToken = cookies.AuthToken

    if (userEmail && authToken) {
        removeCookie('Email')
        removeCookie('AuthToken')
    }

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