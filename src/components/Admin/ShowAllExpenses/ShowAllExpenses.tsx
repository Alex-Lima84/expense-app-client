import { useEffect, useState } from "react";
import { useCookies } from "react-cookie"
import AdminHeader from "../AdminHeader/AdminHeader";
import AdminNavigationHeader from "../AdminNavigationHeader/AdminNavigationHeader";

interface showExpensesInterface {
    map(arg0: (option: any) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode;
    expense_type: string,
    expense_amount: string,
    expense_category: string,
    expense_date: Date,
    expense_year: string,
    expense_month: string
    id: string,
    user_email: string,
    created_at: string,
    updated_at: string
}

const ShowAllExpenses = () => {
    const [cookies, ,] = useCookies<any>(undefined)
    const [showExpenses, setShowExpenses] = useState<showExpensesInterface>()
    const userEmail = cookies.Email
    const authToken = cookies.AuthToken

    const getExpenses = async () => {

        try {

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/expenses/${userEmail}/${null}`, {
                headers: {
                    Authorization: authToken,
                }
            })

            const data = await response.json()
            console.log(data)
            setShowExpenses(data)

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getExpenses()
    }, [])

    return (
        <>
            <AdminHeader />
            <div className='modify-expense-container'>
                <AdminNavigationHeader />
            </div>
        </>
    )

}

export default ShowAllExpenses