import { useState } from 'react'
import { useCookies } from 'react-cookie'
import History from '../../Services/History'
import './styles.scss'
import { Link } from 'react-router-dom'

const Login = () => {
    const [, setCookie,] = useCookies(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()


        if (email === null || password === null) {
            setError('Please fill all the required info')
            return
        }

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/login`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

        const data = await response.json()

        if (data.detail) {
            setError(data.detail)
            return
        }

        setCookie('Email', data.email)
        setCookie('AuthToken', data.token)
        History.push('/admin/home');
        window.location.reload()

    }

    return (
        <div className="auth-container">
            <div className="auth-container-box">
                <form>
                    <h2>Please log in</h2>
                    <input
                        type='email'
                        placeholder='Email'
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type='password'
                        placeholder='Password'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type='submit'
                        className='create'
                        onClick={(e) => handleSubmit(e)}
                    />
                    {error && <p className='error-message'>{error}</p>}
                </form>
                <div className='auth-options'>
                    <Link to='/signin'>Sign in</Link>
                    <Link to='/'>Home</Link>
                </div>
            </div>

        </div>
    );
}

export default Login;