import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { logout } from '../../../redux/userSlice';
import './styles.scss'

const AdminHeader = () => {
    const [, , removeCookie] = useCookies();
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const signOut = () => {
        removeCookie('Email')
        removeCookie('AuthToken')
        dispatch(
            logout(false)
        )
        navigate('/');
    }

    return (
        <div className='admin-header'>
            <div className='button-container'>
                <button className='signout' onClick={signOut}>Sair</button>
            </div>
        </div>
    );
}

export default AdminHeader;