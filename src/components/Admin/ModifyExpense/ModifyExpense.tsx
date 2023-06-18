import './styles.scss'
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminNavigationHeader from '../AdminNavigationHeader/AdminNavigationHeader';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import CurrencyInput from 'react-currency-input-field';

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

interface expenseInterface {
    expense_type: string,
    expense_amount: string,
    expense_category: string,
    expense_date: string,
    expense_year: string,
    expense_month: string,
    id: string,
    updated_at: string
}

type expenseType = expenseInterface[]

interface expenseCategoryType {
    expense_category: string,
    id: string
}
interface expenseTypesInterface {
    expense_category: string,
    expense_type: string,
    id: string
}

const ModifyExpense = () => {
    const [expenseData, setExpenseData] = useState<expenseType>([{
        expense_type: '',
        expense_amount: '',
        expense_category: '',
        expense_date: '',
        expense_year: '',
        expense_month: '',
        id: '',
        updated_at: ''
    }])
    const [cookies, ,] = useCookies<any>(undefined)
    const [showExpenses, setShowExpenses] = useState<showExpensesInterface>()
    const [showModal, setShowModal] = useState<boolean>(false)
    const [id, setId] = useState<string>('')
    const [expenseTypes, setExpenseTypes] = useState<expenseTypesInterface[]>()
    const [expenseCategories, setExpenseCategories] = useState<expenseCategoryType[]>()
    const [expenseCategoryName, setExpenseCategoryName] = useState<string>('')
    const [expenseTypeName, setExpenseTypeName] = useState<string>('')
    const [expenseAmount, setExpenseAmount] = useState<string>('')
    const [expenseDate, setExpenseDate] = useState<string>('')
    const [expenseMonth, setExpenseMonth] = useState<string>('')
    const [expenseYear, setExpenseYear] = useState<string>('')
    const [error, setError] = useState<string>('')
    const userEmail = cookies.Email
    const authToken = cookies.AuthToken
    const moneyRegex = /\d(?=(\d{3})+,)/g;

    const getExpenses = async () => {
        const expenseQuantity = 10
        try {

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/expenses/${userEmail}/${expenseQuantity}`, {
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

    const getExpenseInfo = async (expenseId: string) => {
        showExpenseCategory()

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/expense/${userEmail}/${expenseId}`, {
                headers: {
                    Authorization: authToken,
                }
            })
            const data = await response.json()
            setExpenseData(data)
            setId(expenseId)
            setExpenseAmount(data[0].expense_amount)
            const dateYear = data[0].expense_date.substring(0, 4)
            const dateMonth = data[0].expense_date.substring(5, 7)
            const dateDay = data[0].expense_date.substring(8, 10)
            const expenseDate = `${dateYear}-${dateMonth}-${dateDay}`
            setExpenseDate(expenseDate)
            setExpenseMonth(dateMonth)
            setExpenseYear(dateYear)
            setShowModal(true)
        } catch (error) {
            console.log(error)
        }
    }

    const showOrHideModal = () => {
        if (!showModal) {
            setShowModal(true)
            document.body.classList.add('no-scroll');
            window.scrollTo(0, 0);
        }

        if (showModal) {
            setShowModal(false)
            document.body.classList.remove('no-scroll');
        }
    };

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

    const handleNewExpenseDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputDate = e.target.value
        const date = inputDate.split('-')
        const year = date[0]
        const month = date[1]
        setExpenseDate(inputDate)
        setExpenseMonth(month)
        setExpenseYear(year)
    }

    const updateExpense = async (e: any) => {
        e.preventDefault()
        const formattedAmount = expenseAmount.replace(',', '.').replace(moneyRegex, '$&.')
        const expenseDataDate = expenseData[0].expense_date.slice(0, 10)

        if (expenseTypeName === '' || formattedAmount === '' || expenseCategoryName === '' || expenseDate === '') {
            setError('Por favor, preencha todas as informações.')
            return
        }
        console.log(expenseDate)

        if (expenseTypeName === expenseData[0].expense_type &&
            expenseAmount === expenseData[0].expense_amount &&
            expenseCategoryName === expenseData[0].expense_category &&
            expenseDate === expenseDataDate) {
            setError('Não houve modificação em pelo menos um campo.')
            return
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/expense/${userEmail}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    expenseTypeName,
                    expenseAmount: formattedAmount,
                    expenseCategoryName,
                    expenseDate,
                    expenseYear,
                    expenseMonth,
                    userEmail,
                    id
                })
            })
            if (response.status === 200) {
                toast.success("Despesa modificada! 😎");
                setShowModal(false)
                getExpenses()
                setError('')
            }

            if (response.status !== 200) {
                toast.error("Houve um erro, tente novamente. 😐");
            }

        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <AdminHeader />
            <div className='modify-expense-container'>
                <AdminNavigationHeader />
                <div className='modify-expense-table-container'>
                    <h2>Abaixo estão listadas as 10 últimas despesas lançadas</h2>
                    <table className='expenses-list-container'>
                        <thead>
                            <tr>
                                <th>Tipo</th>
                                <th>Categoria</th>
                                <th>Valor</th>
                                <th>Data</th>
                                <th>Editar</th>
                                <th>Deletar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showExpenses ? showExpenses.map((expense: any) => (
                                <tr className='expenses-list'
                                    key={expense.id}
                                >
                                    <td>{expense.expense_type}</td>
                                    <td>{expense.expense_category}</td>
                                    <td>R${' '} {expense.expense_amount
                                        .replace('.', ',')
                                        .replace(moneyRegex, '$&.')}</td>
                                    <td>{expense.expense_date}</td>
                                    <td onClick={() => getExpenseInfo(expense.id)} className='edit-button'>
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
                        </tbody>
                    </table>
                </div>
            </div>
            {showModal &&
                <div id="expense-edit">
                    <div className="expense-edit-modal-container">
                        <div className="close-button-container">
                            <button onClick={showOrHideModal}>
                                X
                            </button>
                        </div>
                        <div className='expense-form-container'>
                            <form className='expense-form'>
                                <h2>Preencha os dados abaixo para modificar a despesa</h2>
                                <div className='choice-container'>
                                    <h3>Categoria atual: <strong>{expenseData[0].expense_category}</strong></h3>
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
                                    <h3>Tipo de despesa atual: <strong>{expenseData[0].expense_type}</strong></h3>
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
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNewExpenseDate(e)}
                                    />
                                </div>
                                {error !== '' ? <p className='error-message'>{error}</p> : ''}
                                <div className='submit-button-container'>
                                    <input
                                        className='submit-expense'
                                        type='submit'
                                        value='Enviar'
                                        onClick={updateExpense}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>}
        </>
    );

}

export default ModifyExpense