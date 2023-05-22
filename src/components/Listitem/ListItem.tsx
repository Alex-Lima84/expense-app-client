import { useState } from 'react';
// @ts-expect-error TS(6142): Module '../Modal/Modal' was resolved to '/mnt/e/pr... Remove this comment to see the full error message
import Modal from '../Modal/Modal';
import TickIcon from '../TickIcon/TickIcon'
import ProgressBar from '../ProgressBar/ProgressBar';

import './styles.scss'

const ListItem = ({
    task,
    getData
}: any) => {
    const [showModal, setShowModal] = useState(false)

    const deleteData = async (e: any) => {
        e.preventDefault()

        try {
            // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
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
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <li className='list-item'>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className='info-container'>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <TickIcon />
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <p className='task-title'>{task.title}</p>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <ProgressBar progress={task.progress} />
            </div>

            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className='button-container'>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <button className='edit' onClick={() => setShowModal(true)}>EDIT</button>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <button className='delete' onClick={deleteData}>DELETE</button>
            </div>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            {showModal && <Modal mode={'edit'} setShowModal={setShowModal} getData={getData} task={task} />}
        </li>
    );
}

export default ListItem;