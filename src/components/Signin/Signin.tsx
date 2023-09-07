import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import './styles.scss'

interface RequirementsInterface {
    length: boolean;
    capitalLetter: boolean;
    specialCharacter: boolean;
}

const Signin = () => {

    const [email, setEmail] = useState<string>('')
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [requirements, setRequirements] = useState<RequirementsInterface>({
        length: false,
        capitalLetter: false,
        specialCharacter: false,
    });
    const [showRequirements, setShowRequirements] = useState(false);
    const [errors, setErrors] = useState<string[]>([])
    const navigate = useNavigate();


    const handlePasswordChange = (e: { target: { value: string; }; }) => {
        const newPassword = e.target.value;
        setPassword(newPassword);

        const meetsLengthRequirement = newPassword.length >= 8;
        const meetsCapitalLetterRequirement = /[A-Z]/.test(newPassword);
        const meetsSpecialCharacterRequirement = /[!@#$%^&*]/.test(newPassword);

        setRequirements({
            length: meetsLengthRequirement,
            capitalLetter: meetsCapitalLetterRequirement,
            specialCharacter: meetsSpecialCharacterRequirement,
        });

        const isEmpty = e.target.value.trim() === '';
        setShowRequirements(!isEmpty);
    };

    const validateInputFields = () => {
        const errors = [];

        if (!email || !firstName || !lastName || !password || !confirmPassword) {
            errors.push('Please fill all the required info');
        }

        if (!requirements.capitalLetter || !requirements.length || !requirements.specialCharacter) {
            errors.push('Password requirements were not satisfied');
        }

        if (password !== confirmPassword) {
            errors.push('Passwords are not equal');
        }

        return errors;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault()

        const validationErrors = validateInputFields();

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/signin`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ email, firstName, lastName, password })
        })

        const data = await response.json()


        if (data.error) {
            if (
                data.message.some((message: string) =>
                    message.includes('firstName') || message.includes('lastName')
                )
            ) {
                setErrors(["First name or last name cannot be a number."]);
                return;
            }
        }


        if (data.detail) {
            if (data.detail.includes('already exists.')) {
                setErrors(["This email is already registered"])
                return
            } else {
                setErrors(data.detail)
                return
            }
        }

        navigate('/login');
    }

    return (
        <div className="auth-container">
            <div className="auth-container-box">
                <form>
                    <h2>Please sign in</h2>
                    <input
                        type='email'
                        placeholder='Email'
                        onChange={(e) => setEmail(e.target.value)}
                    />
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
                    <input
                        type='password'
                        placeholder='Password'
                        onChange={(e) => handlePasswordChange(e)}
                    />
                    {showRequirements &&
                        <ul className='requirements-list'>
                            {showRequirements && !requirements.length && (
                                <li className='requirements-list-item'>
                                    Password must be at least 8 characters long.
                                </li>
                            )}
                            {showRequirements && !requirements.capitalLetter && (
                                <li className='requirements-list-item'>
                                    Password must contain at least one capital letter.
                                </li>
                            )}
                            {showRequirements && !requirements.specialCharacter && (
                                <li className='requirements-list-item'>
                                    Password must contain at least one special character.
                                </li>
                            )}
                        </ul>
                    }
                    <input
                        type='Password'
                        placeholder='confirm password'
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                    <Link to='/login'>Log in</Link>
                    <Link to='/'>Home</Link>
                </div>
            </div>

        </div>
    );
}

export default Signin;