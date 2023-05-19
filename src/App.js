import { useEffect, useState } from 'react'
import ListHeader from './components/ListHeader/ListHeader'
import ListItem from './components/Listitem/ListItem'
import Auth from './components/Auth/Auth'
import { useCookies } from 'react-cookie'

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const userEmail = cookies.Email
  const authToken = cookies.AuthToken
  const [tasks, setTasks] = useState(null)

  const getData = async () => {

    try {

      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/todos/${userEmail}`)
      const data = await response.json()

      setTasks(data)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (authToken) {
      getData()
    }
  }, [])

  const sortedTasks = tasks?.sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div className='app'>
      {!authToken &&
        <Auth />
      }
      {authToken &&
        <>
          <ListHeader listName={'Holiday Tick List'} getData={getData} />
          <h2 className='welcome-message'>Welcome back, <strong>{userEmail}</strong></h2>
          {sortedTasks?.map((task) => <ListItem key={task.id} task={task} getData={getData} />)}
        </>
      }
    </div>
  );
}

export default App;
