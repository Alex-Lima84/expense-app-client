import { useState } from 'react'
import { useCookies } from 'react-cookie'

import './styles.scss'

const Modal = ({
    mode,
    setShowModal,
    getData,
    task
}: any) => {
    // @ts-expect-error TS(2345): Argument of type 'null' is not assignable to param... Remove this comment to see the full error message
    const [cookies, setCookie, removeCookie] = useCookies(null)
    const editMode = mode === 'edit' ? true : false
    const [data, setData] = useState({
        user_email: editMode ? task.user_email : cookies.Email,
        title: editMode ? task.title : null,
        progress: editMode ? task.progress : 50,
        date: editMode ? task.date : new Date()
    })

    const postData = async (e: any) => {
        e.preventDefault()
        try {
            // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/todos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            if (response.status === 200) {
                console.log('new todo created')
                setShowModal(false)
                getData()
            }
        } catch (error) {
            console.error(error)
        }
    }

    const editData = async (e: any) => {
        e.preventDefault()

        try {
            // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/todos/${task.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            if (response.status === 200) {
                console.log('The todo was updated')
                setShowModal(false)
                getData()
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleChange = (e: any) => {

        const { name, value } = e.target
        setData(data => ({
            ...data,
            [name]: value
        }))
    }

    return (
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div className='overlay'>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className='modal'>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className='form-title-container'>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <h3>Let's {mode} your task</h3>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <button onClick={() => setShowModal(false)}>X</button>
                </div>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <form className='modal-form'>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <input
                        required
                        maxLength={30}
                        placeholder=' Your task goes here'
                        name='title'
                        value={data.title}
                        onChange={handleChange}
                    />
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <br />
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <label for='range'>Drag to select your current progress</label>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <input
                        required
                        type='range'
                        id='range'
                        min='0'
                        max='100'
                        name='progress'
                        value={data.progress}
                        onChange={handleChange}
                    />
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <input
                        className={mode}
                        type='submit'
                        onClick={editMode ? editData : postData}
                    />
                </form>
            </div>
        </div>
    );
}

export default Modal;