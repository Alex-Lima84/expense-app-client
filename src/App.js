import { useEffect, useState } from 'react'
import ListHeader from './components/ListHeader/ListHeader'
import ListItem from './components/Listitem/ListItem'
import Auth from './components/Auth/Auth'

const App = () => {

  const userEmail = 'alexandre.cerutti@live.com'
  const [tasks, setTasks] = useState(null)

  const authToken = false

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
          {sortedTasks?.map((task) => <ListItem key={task.id} task={task} getData={getData} />)}
        </>
      }
    </div>
  );
}

export default App;
