import { useState } from 'react'
import { useCookies } from 'react-cookie'
import History from '../../Services/History'
import './styles.scss'

const Auth = () => {
    // @ts-expect-error TS(2345): Argument of type 'null' is not assignable to param... Remove this comment to see the full error message
    const [cookies, setCookie, removeCookie] = useCookies(null)
    const [email, setEmail] = useState(null)
    const [firstName, setFirstName] = useState(null)
    const [lastName, setLastName] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const [isLogIn, setIsLogIn] = useState(true)
    const [error, setError] = useState(null)

    const viewLogin = (status: any) => {
        setError(null)
        setIsLogIn(status)
    }

    const handleSubmit = async (e: any, endpoint: any) => {
        e.preventDefault()

        if (isLogIn) {
            if (email === null || password === null) {
                // @ts-expect-error TS(2345): Argument of type '"Please fill all the required in... Remove this comment to see the full error message
                setError('Please fill all the required info')
                return
            }
        }

        if (!isLogIn) {
            if (email === null || firstName === null || lastName === null || password === null) {
                // @ts-expect-error TS(2345): Argument of type '"Please fill all the required in... Remove this comment to see the full error message
                setError('Please fill all the required info')
                return
            }

            if (!isLogIn && (password !== confirmPassword)) {
                // @ts-expect-error TS(2345): Argument of type '"Passwords are not equal"' is no... Remove this comment to see the full error message
                setError('Passwords are not equal')
                return
            }
        }

        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ email, firstName, lastName, password })
        })

        const data = await response.json()

        if (data.detail) {
            if (data.detail.includes('already exists.')) {
                // @ts-expect-error TS(2345): Argument of type '"This email is already taken"' i... Remove this comment to see the full error message
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
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div className="auth-container">
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className="auth-container-box">
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <form>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <h2>{isLogIn ? 'Please log in' : 'Please sign up'}</h2>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <input
                        type='email'
                        placeholder='Email'
                        // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {!isLogIn &&
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <input
                                type='text'
                                placeholder='First name'
                                // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <input
                                type='text'
                                placeholder='Last name'
                                // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </>
                    }
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <input
                        type='password'
                        placeholder='Password'
                        // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {!isLogIn &&
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <input
                            type='Password'
                            placeholder='confirm password'
                            // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    }
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <input
                        type='submit'
                        className='create'
                        onClick={(e) => handleSubmit(e, isLogIn ? 'login' : 'signup')}
                    />
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    {error && <p className='error-message'>{error}</p>}
                </form>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className='auth-options'>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <button
                        onClick={() => viewLogin(false)}
                        style={{ backgroundColor: !isLogIn ? '#fff' : '#bcbcbc' }}>
                        Sign up
                    </button>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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