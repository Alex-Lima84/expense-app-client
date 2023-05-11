import TickIcon from '../TickIcon/TickIcon'
import ProgressBar from '../ProgressBar/ProgressBar';

import './styles.scss'

const ListItem = ({ task }) => {
    return (
        <li className='list-item'>
            <div className='info-container'>
                <TickIcon />
                <p>{task.title}</p>
                <ProgressBar />
            </div>

            <div className='button-container'>
                <button className='edit'>EDIT</button>
                <button className='delete'>DELETE</button>
            </div>

        </li>
    );
}

export default ListItem;