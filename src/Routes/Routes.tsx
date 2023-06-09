import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Login from '../components/Login/Login'
import Signin from '../components/Signin/Signin'
import AdminHome from '../components/Admin/Home/AdminHome'
import Home from '../components/Home/Home'
import History from '../services/History'
import ModifyExpense from '../components/Admin/ModifyExpense/ModifyExpense'
import ModifyIncome from '../components/Admin/ModifyIncome/ModifyIncome'
import ExpenseEntry from '../components/Admin/ExpenseEntry/ExpenseEntry'
import IncomeEntry from '../components/Admin/IncomeEntry/IncomeEntry'

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
                <Route path='/admin/home' element={<AdminHome />} />
                <Route path='/admin/expense-entry' element={<ExpenseEntry />} />
                <Route path='/admin/income-entry' element={<IncomeEntry />} />
                <Route path='/admin/modify-expense' element={<ModifyExpense />} />
                <Route path='/admin/modify-income' element={<ModifyIncome />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes