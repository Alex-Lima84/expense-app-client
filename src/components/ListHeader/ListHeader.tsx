import { useState } from 'react'
import Modal from '../Modal/Modal'
import { useCookies } from 'react-cookie'
import History from '../../Services/History'

import './styles.scss'

const ListHeader = ({
    listName,
    getData,

}: any) => {
    const [, , removeCookie] = useCookies();
    const [showModal, setShowModal] = useState(false)

    const signOut = () => {
        History.push('/')
        window.location.reload()
        removeCookie('Email')
        removeCookie('AuthToken')
        localStorage.removeItem('@Expense:token');
    }

    return (
        <div className='list-header'>
            <h1>{listName}</h1>
            <div className='button-container'>
                <button className='create' onClick={() => setShowModal(true)}> Adicionar</button>
                <button className='signout' onClick={signOut}>Sair</button>
            </div>
            {showModal && <Modal mode={'create'} setShowModal={setShowModal} getData={getData} />}
        </div>
    );
}

export default ListHeader;