import { useState } from 'react';
import Modal from '../Modal/Modal';
import TickIcon from '../TickIcon/TickIcon'
import ProgressBar from '../ProgressBar/ProgressBar';

import './styles.scss'

const ListItem = ({ task }) => {
    const [showModal, setShowModal] = useState(false)

    return (
        <li className='list-item'>
            <div className='info-container'>
                <TickIcon />
                <p>{task.title}</p>
                <ProgressBar />
            </div>

            <div className='button-container'>
                <button className='edit' onClick={() => setShowModal(true)}>EDIT</button>
                <button className='delete'>DELETE</button>
            </div>
            {showModal && <Modal mode={'edit'} setShowModal={setShowModal} task={task}/>}
        </li>
    );
}

export default ListItem;