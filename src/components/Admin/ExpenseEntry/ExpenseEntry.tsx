import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { toast } from "react-toastify";
import './styles.scss'
import AdminHeader from '../AdminHeader/AdminHeader'
import AdminNavigationHeader from '../AdminNavigationHeader/AdminNavigationHeader'
import CurrencyInput from 'react-currency-input-field';
interface emailInterface {
    user_email: string,
}
interface expenseCategoryInterface {
    expense_category: string,
    id: string
}
interface expenseTypesInterface {
    expense_category: string,
    expense_type: string,
    id: string
}

const ExpenseEntry = () => {
    const [cookies, ,] = useCookies<string>(undefined)
    const [userEmail,] = useState<emailInterface>(cookies.Email)
    const [expenseCategories, setExpenseCategories] = useState<expenseCategoryInterface[]>()
    const [expenseCategoryName, setExpenseCategoryName] = useState<string>('')
    const [expenseTypes, setExpenseTypes] = useState<expenseTypesInterface[]>()
    const [expenseTypeName, setExpenseTypeName] = useState<string>('')
    const [expenseAmount, setExpenseAmount] = useState<string>('')
    const [expenseDate, setExpenseDate] = useState<string>('')
    const [formattedDate, setFormattedDate] = useState<string>('')
    const [expenseMonth, setExpenseMonth] = useState<string>('')
    const [expenseYear, setExpenseYear] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [displayMessage, setDisplayMessage] = useState<string>('')
    const moneyRegex = /\d(?=(\d{3})+,)/g;
    const authToken = cookies.AuthToken

    const showExpenseCategory = async () => {
        try {

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/expense-categories`, {
                headers: {
                    Authorization: authToken,
                }
            })
            const data = await response.json()
            setExpenseCategories(data)

        } catch (error) {
            console.error(error)
        }
    }

    const getExpenseTypes = async (categoryId: string) => {
        addCategoryName(categoryId)

        try {

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/expense-types/${categoryId}`, {
                headers: {
                    Authorization: authToken,
                }
            })
            const data = await response.json()
            setExpenseTypes(data)

        } catch (error) {
            console.error(error)
        }
    }

    const addCategoryName = (categoryId: string) => {
        setExpenseCategoryName('')
        setExpenseTypeName('')

        switch (categoryId) {
            case '581921fe-c8e9-4989-9a52-b6c5e5f368b4': {
                setExpenseCategoryName('Habitação');
                break;
            }
            case '18b03713-2dec-4ca2-9eea-7f5766289e4f': {
                setExpenseCategoryName('Saúde');
                break;
            }
            case '61a3ed30-224b-4945-9687-c22cb578e15f': {
                setExpenseCategoryName('Transporte');
                break;
            }
            case '4eb2deb6-7706-455f-a62f-b505b19a2fc3': {
                setExpenseCategoryName('Automóvel');
                break;
            }
            case 'd85451bd-b2d1-4ad2-bbde-50e62ce96218': {
                setExpenseCategoryName('Despesas pessoais');
                break;
            }
            case '50218ddf-dbdc-4483-a0ba-5c1f1f06c1ce': {
                setExpenseCategoryName('Lazer');
                break;
            }
            case '52f51e00-f5a3-4a83-b44a-e81bfd63f64d': {
                setExpenseCategoryName('Educação');
                break;
            }
        }
    }

    const handleExpenseDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputDate = e.target.value
        const date = inputDate.split('-')
        const year = date[0]
        const month = date[1]
        const day = date[2]
        const formattedDate = `${day}/${month}/${year}`
        setExpenseDate(inputDate)
        setFormattedDate(formattedDate)
        setExpenseMonth(month)
        setExpenseYear(year)
    }

    const postExpense = async (e: any) => {

        e.preventDefault()

        const formattedAmount = expenseAmount.replace(',', '.').replace(moneyRegex, '$&.')

        if (expenseTypeName === '' || formattedAmount === '' || expenseCategoryName === '' || expenseDate === '') {
            setError('Por favor, preencha todas as informações.')
            return
        } else {
            setError('')
        }

        setDisplayMessage('Salvando dados...')
        try {

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/expense-entry`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    expenseTypeName,
                    expenseAmount: formattedAmount,
                    expenseCategoryName,
                    expenseDate: formattedDate,
                    expenseYear,
                    expenseMonth,
                    userEmail
                })
            })
            if (response.status === 200) {
                setDisplayMessage('')
                setExpenseAmount('')
                setExpenseDate('')
                setExpenseCategories([{
                    expense_category: '',
                    id: ''
                }])
                setExpenseTypes([{
                    expense_category: '',
                    expense_type: '',
                    id: ''
                }])
                showExpenseCategory()
                toast.success("Despesa lançada! 😎");
            }

            if (response.status !== 200) {
                toast.error("Houve um erro, tente novamente. 😐");
            }

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        showExpenseCategory()
    }, [])

    return (
        <>
            <AdminHeader />
            <div className='expense-entry-container'>
                <AdminNavigationHeader />
                <div className='expense-form-container'>
                    <form className='expense-form'>
                        <h2>Adicionar despesa</h2>
                        <div className='choice-container'>
                            <label>Escolha a categoria da despesa:</label>
                            <select
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { getExpenseTypes(e.target.value) }}
                            >
                                <option value="">Selecione...</option>
                                {expenseCategories ? expenseCategories.map((option: any) => (
                                    <option
                                        key={option.id}
                                        value={option.id}
                                    >
                                        {option.expense_category}
                                    </option>
                                )) : ''}
                            </select >
                        </div>
                        <div className='choice-container'>
                            <label>Escolha o tipo de despesa:</label>
                            <select
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setExpenseTypeName(e.target.value)}
                            >
                                <option value="">Selecione...</option>
                                {expenseTypes ? expenseTypes.map((option: any) => (
                                    <option
                                        key={option.id}
                                        value={option.expense_type}
                                    >
                                        {option.expense_type}
                                    </option>
                                )) : ''}
                            </select >
                        </div>
                        <div className='choice-container'>
                            <label>Informe o valor da despesa:</label>
                            <CurrencyInput
                                value={expenseAmount}
                                onValueChange={(value) =>
                                    setExpenseAmount(value!)
                                }
                                prefix={'R$ '}
                                decimalsLimit={2}
                                decimalSeparator={','}
                                groupSeparator={'.'}
                            />
                        </div>
                        <div className='choice-container'>
                            <label>Informe a data da despesa:</label>
                            <input
                                type="date"
                                min="1997-01-01" max="2030-12-31" value={expenseDate}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleExpenseDate(e)}
                            />
                        </div>
                        {error !== '' ? <p className='error-message'>{error}</p> : ''}
                        <div className='submit-button-container'>
                            <input
                                className='submit-expense'
                                type='submit'
                                value='Enviar'
                                onClick={postExpense}
                            />
                        </div>
                        {displayMessage !== '' ? <p className='display-message'>{displayMessage}</p> : ''}
                    </form>
                </div>
            </div>
        </>
    );
}

export default ExpenseEntry;