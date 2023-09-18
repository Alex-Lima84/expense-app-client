import { useState } from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { login } from '../../redux/userSlice'
import { useDispatch } from 'react-redux'
import './styles.scss'

const Login = () => {
    const [cookies, setCookie,] = useCookies<string>(undefined)
    const [email, setEmail] = useState<string>('daniel.alves@gmail.com')
    const [password, setPassword] = useState<string>('Danialves!')
    const [errors, setErrors] = useState<string[]>([])
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const handleSubmit = async (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault()

        if (!email || !password) {
            setErrors(['Please fill all the required info'])
            return
        }

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/login`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

        const data = await response.json()

        if (data.error) {
            setErrors(data.message)
            return
        }

        if (data.detail) {
            setErrors(data.detail)
            return
        }

        dispatch(
            login(true)
        )
        setCookie('Email', data.email)
        setCookie('AuthToken', data.token)
        navigate('/admin/home');
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
                    {errors.length > 0 && (
                        <div className='error-container'>
                            {errors.map((error: string, index: number) => (
                                <p key={index} className='error-message'>{error}</p>
                            ))}
                        </div>
                    )}
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

// {errors.length > 0 && (
//     <div>
//         {errors.map((error, index) => (
//             <p key={index} className='error-message'>{error}</p>
//         ))}
//     </div>
// )}