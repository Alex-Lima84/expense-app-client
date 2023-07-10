import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/userSlice';
import Login from '../components/Login/Login';
import Signin from '../components/Signin/Signin';
import AdminHome from '../pages/Admin/AdminHome/AdminHome';
import Home from '../pages/Home/Home';
import ModifyExpense from '../pages/Admin/ModifyExpense/ModifyExpense';
import ModifyIncome from '../pages/Admin/ModifyIncome/ModifyIncome';
import ExpenseEntry from '../pages/Admin/ExpenseEntry/ExpenseEntry';
import IncomeEntry from '../pages/Admin/IncomeEntry/IncomeEntry';
import ShowExpenses from '../pages/Admin/ShowExpenses/ShowExpenses';
import ShowIncomes from '../pages/Admin/ShowIncomes/ShowIncomes';

const AppRoutes = () => {
  const isLoggedIn = useSelector(selectUser);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/login" element={<Login />} />
        {isLoggedIn ? (
          <>
            <Route path="/admin/home" element={<AdminHome />} />
            <Route path="/admin/expense-entry" element={<ExpenseEntry />} />
            <Route path="/admin/income-entry" element={<IncomeEntry />} />
            <Route path="/admin/modify-expense" element={<ModifyExpense />} />
            <Route path="/admin/modify-income" element={<ModifyIncome />} />
            <Route path="/admin/show-expenses" element={<ShowExpenses />} />
            <Route path="/admin/show-incomes" element={<ShowIncomes />} />
          </>
        ) : (
          <Route path="/admin/*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

