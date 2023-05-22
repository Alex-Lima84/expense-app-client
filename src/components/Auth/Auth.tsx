import { useState } from 'react'
import { useCookies } from 'react-cookie'
import History from '../../Services/History'
import './styles.scss'

const Auth = () => {
    const [cookies, setCookie, removeCookie] = useCookies(null)
    const [email, setEmail] = useState(null)
    const [firstName, setFirstName] = useState(null)
    const [lastName, setLastName] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const [isLogIn, setIsLogIn] = useState(true)
    const [error, setError] = useState(null)

    const viewLogin = (status) => {
        setError(null)
        setIsLogIn(status)
    }

    const handleSubmit = async (e, endpoint) => {
        e.preventDefault()

        if (isLogIn) {
            if (email === null || password === null) {
                setError('Please fill all the required info')
                return
            }
        }

        if (!isLogIn) {
            if (email === null || firstName === null || lastName === null || password === null) {
                setError('Please fill all the required info')
                return
            }

            if (!isLogIn && (password !== confirmPassword)) {
                setError('Passwords are not equal')
                return
            }
        }

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ email, firstName, lastName, password })
        })

        const data = await response.json()

        if (data.detail) {
            if (data.detail.includes('already exists.')) {
                setError("This email is already taken")
            } else {
                setError(data.detail)
            }
        }

        if (!data.detail) {
            setCookie('Email', data.email)
            setCookie('AuthToken', data.token)           
            // window.location.reload()
            History.push('/admin/home');
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-container-box">
                <form>
                    <h2>{isLogIn ? 'Please log in' : 'Please sign up'}</h2>
                    <input
                        type='email'
                        placeholder='Email'
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {!isLogIn &&
                        <>
                            <input
                                type='text'
                                placeholder='First name'
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <input
                                type='text'
                                placeholder='Last name'
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </>
                    }
                    <input
                        type='password'
                        placeholder='Password'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {!isLogIn &&
                        <input
                            type='Password'
                            placeholder='confirm password'
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    }
                    <input
                        type='submit'
                        className='create'
                        onClick={(e) => handleSubmit(e, isLogIn ? 'login' : 'signup')}
                    />
                    {error && <p className='error-message'>{error}</p>}
                </form>
                <div className='auth-options'>
                    <button
                        onClick={() => viewLogin(false)}
                        style={{ backgroundColor: !isLogIn ? '#fff' : '#bcbcbc' }}>
                        Sign up
                    </button>
                    <button
                        onClick={() => viewLogin(true)}
                        style={{ backgroundColor: isLogIn ? '#fff' : '#bcbcbc' }}>
                        Login
                    </button>
                </div>
            </div>

        </div>
    );
}

export default Auth;