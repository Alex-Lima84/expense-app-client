import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import AdminHeader from '../AdminHeader/AdminHeader'
import ExpenseEntry from '../ExpenseEntry/ExpenseEntry'
import { Link } from 'react-router-dom'

const Admin = () => {
    const [cookies, ,] = useCookies<any>(undefined)
    const userEmail = cookies.Email
    const [userName, setUserName] = useState<string>('')
    const [showExpenseModal, setExpenseShowModal] = useState(false)

    const getUserInfo = async () => {

        try {

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/users/${userEmail}`)
            const data = await response.json()

            setUserName(data[0].first_name)

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getUserInfo()
    }, [cookies])

    return (
        <>
            <AdminHeader />
            <h2 className='welcome-message'>Bem-vindo de volta, <strong>{userName}</strong></h2>
            <div className='options-container'>
                {/* <button className='create' onClick={() => setExpenseShowModal(true)}> Adicionar despesa</button> */}
                <Link to='/admin/expense-entry'>Adicionar despesa</Link>
                <Link to='/admin/modify-expense'>Modificar despesa</Link>               
                <button className='create' onClick={() => ('')}> Adicionar receita</button>
                <Link to='/admin/modify-income'>Modificar receita</Link>      
            </div>
            {showExpenseModal && <ExpenseEntry setShowModal={setExpenseShowModal} />}
        </>
    );
}

export default Admin;