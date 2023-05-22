import { useState } from 'react'
// @ts-expect-error TS(6142): Module '../Modal/Modal' was resolved to '/mnt/e/pr... Remove this comment to see the full error message
import Modal from '../Modal/Modal'
import { useCookies } from 'react-cookie'
import History from '../../Services/History'

import './styles.scss'

const ListHeader = ({
    listName,
    getData
}: any) => {
    // @ts-expect-error TS(2345): Argument of type 'null' is not assignable to param... Remove this comment to see the full error message
    const [, , removeCookie] = useCookies(null)
    const [showModal, setShowModal] = useState(false)

    const signOut = () => {
        removeCookie('Email')
        removeCookie('AuthToken')
        History.push('/')
        window.location.reload()
    }

    return (
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div className='list-header'>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <h1>{listName}</h1>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className='button-container'>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <button className='create' onClick={() => setShowModal(true)}> ADD NEW</button>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <button className='signout' onClick={signOut}>SIGN OUT</button>
            </div>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            {showModal && <Modal mode={'create'} setShowModal={setShowModal} getData={getData} />}
        </div>
    );
}

export default ListHeader;