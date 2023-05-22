import { useState } from 'react'
import { useCookies } from 'react-cookie'
import History from '../../Services/History'
import './styles.scss'
import { Link } from 'react-router-dom'

const Login = () => {
    // @ts-expect-error TS(2345): Argument of type 'null' is not assignable to param... Remove this comment to see the full error message
    const [, setCookie,] = useCookies(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [error, setError] = useState(null)

    const handleSubmit = async (e: any) => {
        e.preventDefault()


        if (email === null || password === null) {
            // @ts-expect-error TS(2345): Argument of type '"Please fill all the required in... Remove this comment to see the full error message
            setError('Please fill all the required info')
            return
        }

        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
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
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div className="auth-container">
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className="auth-container-box">
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <form>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <h2>Please log in</h2>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <input
                        type='email'
                        placeholder='Email'
                        // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <input
                        type='password'
                        placeholder='Password'
                        // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <input
                        type='submit'
                        className='create'
                        onClick={(e) => handleSubmit(e)}
                    />
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    {error && <p className='error-message'>{error}</p>}
                </form>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className='auth-options'>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <Link to='/signin'>Sign in</Link>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <Link to='/'>Home</Link>
                </div>
            </div>

        </div>
    );
}

export default Login;