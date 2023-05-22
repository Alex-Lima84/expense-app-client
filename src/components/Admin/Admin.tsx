import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
// @ts-expect-error TS(6142): Module '../ListHeader/ListHeader' was resolved to ... Remove this comment to see the full error message
import ListHeader from '../ListHeader/ListHeader'
// @ts-expect-error TS(6142): Module '../Listitem/ListItem' was resolved to '/mn... Remove this comment to see the full error message
import ListItem from '../Listitem/ListItem'

const Admin = () => {
    // @ts-expect-error TS(2345): Argument of type 'null' is not assignable to param... Remove this comment to see the full error message
    const [cookies, ,] = useCookies(null)
    const userEmail = cookies.Email
    const [tasks, setTasks] = useState(null)
    const [userName, setUserName] = useState(null)

    const getData = async () => {

        try {

            // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/todos/${userEmail}`)
            const data = await response.json()

            setTasks(data)

        } catch (error) {
            console.error(error)
        }
    }

    const getUserInfo = async () => {

        try {

            // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
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

    // @ts-expect-error TS(2339): Property 'sort' does not exist on type 'never'.
    const sortedTasks = tasks?.sort((a: any, b: any) => new Date(a.date) - new Date(b.date))

    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    return <>
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <ListHeader listName={'Holiday Tick List'} getData={getData} />
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <h2 className='welcome-message'>Welcome back, <strong>{userName}</strong></h2>
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        {sortedTasks?.map((task: any) => <ListItem key={task.id} task={task} getData={getData} />)}
    </>;
}

export default Admin;