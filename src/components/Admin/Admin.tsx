import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import ListHeader from '../ListHeader/ListHeader'

const Admin = () => {
    const [cookies, ,] = useCookies<any>(undefined)
    const userEmail = cookies.Email
    const [, setTasks] = useState<any>(null)
    const [userName, setUserName] = useState<string>('')

    const getData: () => Promise<void> = async () => {

        try {

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/todos/${userEmail}`)
            const data = await response.json()

            setTasks(data)

        } catch (error) {
            console.error(error)
        }
    }

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

        getData()
        getUserInfo()

    }, [cookies])

    return <>
        <ListHeader listName={'Despesas pessoais'} getData={getData} />
        <h2 className='welcome-message'>Bem-vindo de volta, <strong>{userName}</strong></h2>
    </>;
}

export default Admin;