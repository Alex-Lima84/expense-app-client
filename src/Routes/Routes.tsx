import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import Login from '../components/Login/Login';
import Signin from '../components/Signin/Signin';
import AdminHome from '../components/Admin/Home/AdminHome';
import Home from '../components/Home/Home';
import ModifyExpense from '../components/Admin/ModifyExpense/ModifyExpense';
import ModifyIncome from '../components/Admin/ModifyIncome/ModifyIncome';
import ExpenseEntry from '../components/Admin/ExpenseEntry/ExpenseEntry';
import IncomeEntry from '../components/Admin/IncomeEntry/IncomeEntry';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/userSlice';

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
          </>
        ) : (
          <Route path="/admin/*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

