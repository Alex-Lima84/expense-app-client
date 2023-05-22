import { useState } from 'react'
import { useCookies } from 'react-cookie'
import './styles.scss'

const Modal = ({
    mode,
    setShowModal,
    getData,
    task
}: any) => {
    const [cookies, ,] = useCookies<any>(undefined)
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
        <div className='overlay'>
            <div className='modal'>
                <div className='form-title-container'>
                    <h3>Let's {mode} your task</h3>
                    <button onClick={() => setShowModal(false)}>X</button>
                </div>
                <form className='modal-form'>
                    <input
                        required
                        maxLength={30}
                        placeholder=' Your task goes here'
                        name='title'
                        value={data.title}
                        onChange={handleChange}
                    />
                    <br />
                    <label htmlFor='range'>Drag to select your current progress</label>
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