import { useCookies } from 'react-cookie'
import History from '../../Services/History'

import './styles.scss'

const ListHeader = () => {
    const [, , removeCookie] = useCookies();

    const signOut = () => {
        History.push('/')
        window.location.reload()
        removeCookie('Email')
        removeCookie('AuthToken')
        localStorage.removeItem('@Expense:token');
    }

    return (
        <div className='list-header'>
            <h1>Despesas Pessoais</h1>
            <div className='button-container'>
                <button className='signout' onClick={signOut}>Sair</button>
            </div>
        </div>
    );
}

export default ListHeader;