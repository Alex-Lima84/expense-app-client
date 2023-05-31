import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { Link } from 'react-router-dom'
import './styles.scss'

const AdminNavigationHeader = () => {
    const [cookies, ,] = useCookies<any>(undefined)
    const userEmail = cookies.Email
    const [, setUserName] = useState<string>('')

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
        <div className='admin-navigation-container'>
            <div className='options-container'>
                {/* <button className='create' onClick={() => setExpenseShowModal(true)}> Adicionar despesa</button> */}
                <Link to='/admin/home'>Home</Link>
                <Link to='/admin/expense-entry'>Adicionar despesa</Link>
                <Link to='/admin/modify-expense'>Modificar despesa</Link>
                <Link to='/admin/income-entry'>Adicionar receita</Link>
                <Link to='/admin/modify-income'>Modificar receita</Link>
                <Link to='/admin/expense-view'>Visualizar despesas</Link>
                <Link to='/admin/income-view'>Visualizar receitas</Link>
            </div>
            <div></div>
        </div>
    );
}

export default AdminNavigationHeader;