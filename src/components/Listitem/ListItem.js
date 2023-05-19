import { useState } from 'react';
import Modal from '../Modal/Modal';
import TickIcon from '../TickIcon/TickIcon'
import ProgressBar from '../ProgressBar/ProgressBar';

import './styles.scss'

const ListItem = ({ task, getData }) => {
    const [showModal, setShowModal] = useState(false)

    const deleteData = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/todos/${task.id}`, {
                method: 'DELETE',
            })
            if (response.status === 200) {
                console.log('The todo was deleted')
                setShowModal(false)
                getData()
            }
        } catch (error) {
            console.error(error)
        }
    }


    return (
        <li className='list-item'>
            <div className='info-container'>
                <TickIcon />
                <p className='task-title'>{task.title}</p>
                <ProgressBar progress={task.progress} />
            </div>

            <div className='button-container'>
                <button className='edit' onClick={() => setShowModal(true)}>EDIT</button>
                <button className='delete' onClick={deleteData}>DELETE</button>
            </div>
            {showModal && <Modal mode={'edit'} setShowModal={setShowModal} getData={getData} task={task} />}
        </li>
    );
}

export default ListItem;