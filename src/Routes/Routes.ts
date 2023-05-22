import { Route, Routes, BrowserRouter } from 'react-router-dom'
// @ts-expect-error TS(6142): Module '../components/Login/Login' was resolved to... Remove this comment to see the full error message
import Login from '../components/Login/Login'
// @ts-expect-error TS(6142): Module '../components/Signin/Signin' was resolved ... Remove this comment to see the full error message
import Signin from '../components/Signin/Signin'
// @ts-expect-error TS(6142): Module '../components/Admin/Admin' was resolved to... Remove this comment to see the full error message
import Admin from '../components/Admin/Admin'
import Home from '../components/Home/Home'

const AppRoutes = () => {

    return (
        // @ts-expect-error TS(2749): 'BrowserRouter' refers to a value, but is being us... Remove this comment to see the full error message
        <BrowserRouter>
            // @ts-expect-error TS(2749): 'Routes' refers to a value, but is being used as a... Remove this comment to see the full error message
            <Routes>
                // @ts-expect-error TS(2749): 'Route' refers to a value, but is being used as a ... Remove this comment to see the full error message
                <Route path='/' element={<Home />} />
                // @ts-expect-error TS(2304): Cannot find name 'path'.
                <Route path='/admin/home' element={<Admin />} />
                // @ts-expect-error TS(2304): Cannot find name 'path'.
                <Route path='/signin' element={<Signin />} />
                // @ts-expect-error TS(2304): Cannot find name 'path'.
                <Route path='/login' element={<Login />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes
