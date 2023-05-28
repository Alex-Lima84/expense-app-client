import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Login from '../components/Login/Login'
import Signin from '../components/Signin/Signin'
import Admin from '../components/Admin/Home/Home'
import Home from '../components/Home/Home'
import History from '../Services/History'
import ModifyExpense from '../components/Admin/ModifyExpense/ModifyExpense'
import ModifyIncome from '../components/Admin/ModifyIncome/ModifyIncome'
import ExpenseEntry from '../components/Admin/ExpenseEntry/ExpenseEntry'

const AppRoutes = () => {
    const storagedToken = localStorage.getItem('@Expense:token');
    const firstSignin = localStorage.getItem('@First-signin');

    if (!storagedToken && !firstSignin) {
        History.push('/')
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/signin' element={<Signin />} />
                <Route path='/login' element={<Login />} />
                <Route path='/admin/home' element={<Admin />} />
                <Route path='/admin/expense-entry' element={<ExpenseEntry />} />
                <Route path='/admin/modify-expense' element={<ModifyExpense />} />
                <Route path='/admin/modify-income' element={<ModifyIncome />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes