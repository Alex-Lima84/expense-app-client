import './styles.scss'
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminNavigationHeader from '../AdminNavigationHeader/AdminNavigationHeader';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

interface showExpensesType {
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

const ModifyIncome = () => {
    const [cookies, ,] = useCookies<any>(undefined)
    const [showExpenses, setShowExpenses] = useState<showExpensesType>()
    const userEmail = cookies.Email
    const authToken = cookies.AuthToken
    const regexMoney = /\d(?=(\d{3})+,)/g;

    const getExpenses = async () => {
        try {

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/expenses/${userEmail}`, {
                headers: {
                    Authorization: authToken,
                }
            })
            const data = await response.json()
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
                <div className='expenses-list-container'>
                    <h2>Abaixo estão listadas as 10 últimas receitas lançadas</h2>
                    <thead>
                        <tr>
                            <th>Tipo</th>
                            <th>Categoria</th>
                            <th>Valor</th>
                            <th>Ano</th>
                            <th>Mês</th>
                            <th>Editar</th>
                            <th>Deletar</th>
                        </tr>
                    </thead>
                    {showExpenses ? showExpenses.map((expense: any) => (
                        <tr className='expenses-list'
                            key={expense.id}
                        >
                            <td>{expense.expense_type}</td>
                            <td>{expense.expense_category}</td>
                            <td>R${' '} {expense.expense_amount
                                .replace('.', ',')
                                .replace(regexMoney, '$&.')}</td>
                            <td>{expense.expense_year}</td>
                            <td>{expense.expense_month}</td>
                            <td className='edit-button'>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                                    <path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" />
                                </svg>
                            </td>
                            <td className='delete-button'>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                    <path d="M163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3C140.6 6.8 151.7 0 163.8 0zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm192 64c-6.4 0-12.5 2.5-17 7l-80 80c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V408c0 13.3 10.7 24 24 24s24-10.7 24-24V273.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-4.5-4.5-10.6-7-17-7z" />
                                </svg>
                            </td>
                        </tr>
                    )) : ''}
                </div>
            </div>
        </>
    );

}

export default ModifyIncome