import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Login from '../components/Login/Login'
import Signin from '../components/Signin/Signin'
import Admin from '../components/Admin/Admin'
import Home from '../components/Home/Home'
import History from '../Services/History'

const AppRoutes = () => {
    const storagedToken = localStorage.getItem('@Expense:token');

    if (!storagedToken) {
        History.push('/')
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/admin/home' element={<Admin />} />
                <Route path='/signin' element={<Signin />} />
                <Route path='/login' element={<Login />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes