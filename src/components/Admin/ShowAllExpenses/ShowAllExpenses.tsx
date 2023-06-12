import { useEffect, useState } from "react";
import { useCookies } from "react-cookie"
import AdminHeader from "../AdminHeader/AdminHeader";
import AdminNavigationHeader from "../AdminNavigationHeader/AdminNavigationHeader";

interface showExpensesInterface {
    forEach(arg0: (expense: any) => void): unknown;
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
    const [listOfExpenseYear, setListOfExpenseYear] = useState<showExpensesInterface>()
    const [expenseMonths, setExpenseMonths] = useState<any>([])
    const [expenseMonthsValues, setExpenseMonthsValues] = useState<string[]>([])
    const [expenseYears, setExpenseYears] = useState<string[]>([])
    const userEmail = cookies.Email
    const authToken = cookies.AuthToken

    const getListOfYears = async () => {

        try {

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/expenses/${userEmail}/${null}`, {
                headers: {
                    Authorization: authToken,
                }
            })

            const data = await response.json()
            setListOfExpenseYear(data)

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (listOfExpenseYear) {
            let expenseYearArray: string[] = []
            listOfExpenseYear.forEach((expense) => {
                expenseYearArray.push(expense.expense_year)
            });
            expenseYearArray = Array.from(new Set(expenseYearArray));
            expenseYearArray.sort((a, b) => a.localeCompare(b));

            setExpenseYears(expenseYearArray)
        }       

    }, [listOfExpenseYear])


    useEffect(() => {
        getListOfYears()
    }, [])

    const getExpenseMonths = async (expenseYear: any) => {

        try {

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/expenses/${expenseYear}`, {
                headers: {
                    Authorization: authToken,
                }
            })
            const data = await response.json()
            setExpenseMonths(data)

        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <AdminHeader />
            <div className='modify-expense-container'>
                <AdminNavigationHeader />
                <div className='choice-container'>
                    <label>Escolha o ano:</label>
                    <select
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { getExpenseMonths(e.target.value) }}
                    >
                        <option value="">Selecione...</option>
                        {expenseYears ? expenseYears.map((option: any) => (
                            <option
                                key={option}
                                value={option}
                            >
                                {option}
                            </option>
                        )) : ''}
                    </select >
                </div>
                <div className='choice-container'>
                    <label>Escolha o mês:</label>
                    <select
                    // onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { getExpenseMonths(e.target.value) }}
                    >
                        <option value="">Selecione...</option>
                        {expenseMonths ? expenseMonths.map((option: any, index: any) => (
                            <option
                                key={index}
                                value={option.expense_month}
                            >
                                {option.expense_month}
                            </option>
                        )) : ''}
                    </select >
                </div>
            </div>
        </>
    )

}

export default ShowAllExpenses