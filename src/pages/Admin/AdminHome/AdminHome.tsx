import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import AdminHeader from '../../../components/Admin/AdminHeader/AdminHeader'
import AdminNavigationHeader from '../../../components/Admin/AdminNavigationHeader/AdminNavigationHeader'
import './styles.scss'

const AdminHome = () => {
    const [cookies, ,] = useCookies<any>(undefined)
    const userEmail = cookies.Email
    const authToken = cookies.AuthToken 
    const [userName, setUserName] = useState<string>('')

    const getUserInfo = async () => {

        try {

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/users/${userEmail}`, {
                headers: {
                    Authorization: authToken,
                }
            })
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
            <div className='admin-home-container'>
                <AdminNavigationHeader />
                <h2 className='welcome-message'>Bem-vindo, <strong>{userName}</strong></h2>
            </div>
        </>
    );
}

export default AdminHome;