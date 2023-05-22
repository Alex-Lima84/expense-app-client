import { useState } from 'react'
import Modal from '../Modal/Modal'
import { useCookies } from 'react-cookie'
import History from '../../Services/History'

import './styles.scss'

const ListHeader = ({ listName, getData }) => {
    const [, , removeCookie] = useCookies(null)
    const [showModal, setShowModal] = useState(false)

    const signOut = () => {
        removeCookie('Email')
        removeCookie('AuthToken')
        History.push('/')
        window.location.reload()
    }

    return (
        <div className='list-header'>
            <h1>{listName}</h1>
            <div className='button-container'>
                <button className='create' onClick={() => setShowModal(true)}> ADD NEW</button>
                <button className='signout' onClick={signOut}>SIGN OUT</button>
            </div>
            {showModal && <Modal mode={'create'} setShowModal={setShowModal} getData={getData} />}
        </div>
    );
}

export default ListHeader;