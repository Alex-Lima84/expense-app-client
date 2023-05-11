import ListHeader from './components/ListHeader/ListHeader'
import ListItem from './components/Listitem/ListItem'
import { useEffect, useState } from 'react'

const App = () => {

  const userEmail = 'alexandre.cerutti@live.com'
  const [tasks, setTasks] = useState(null)

  const getData = async () => {

    try {

      const response = await fetch(`http://localhost:8000/todos/${userEmail}`)
      const data = await response.json()
    
      setTasks(data)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const sortedTasks = tasks?.sort((a,b) => new Date(a.date) - new Date (b.date))

  return (
    <div className='app'>
      <ListHeader listName={'Holiday Tick List'} />
      {sortedTasks?.map((task) => <ListItem key={task.id} task={task}/>)}
    </div>
  );
}

export default App;
