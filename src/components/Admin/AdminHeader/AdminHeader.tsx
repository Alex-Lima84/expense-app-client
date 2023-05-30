import { useCookies } from 'react-cookie'
import History from '../../../Services/History'
import './styles.scss'

const AdminHeader = () => {
    const [, , removeCookie] = useCookies();

    const signOut = () => {
        History.push('/')
        window.location.reload()
        removeCookie('Email')
        removeCookie('AuthToken')
        localStorage.removeItem('@Expense:token');
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