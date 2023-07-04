import './styles.scss'
import AdminHeader from '../../../components/Admin/AdminHeader/AdminHeader';
import AdminNavigationHeader from '../../../components/Admin/AdminNavigationHeader/AdminNavigationHeader';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import CurrencyInput from 'react-currency-input-field';

interface showIncomesInterface {
    map(arg0: (option: any) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode;
    income_type: string,
    income_amount: string,
    income_category: string,
    income_date: Date,
    income_year: string,
    income_month: string
    id: string,
    user_email: string,
    created_at: string,
    updated_at: string
}

interface incomeInterface {
    income_type: string,
    income_amount: string,
    income_date: string,
    income_year: string,
    income_month: string,
    id: string,
    updated_at: string
}

type incomeType = incomeInterface[]

interface incomeCategoryType {
    income_category: string,
    id: string
}
interface incomeTypesInterface {
    income_category: string,
    income_type: string,
    id: string
}

const ModifyIncome = () => {
    const [incomeData, setincomeData] = useState<incomeType>([{
        income_type: '',
        income_amount: '',
        income_date: '',
        income_year: '',
        income_month: '',
        id: '',
        updated_at: ''
    }])
    const [cookies, ,] = useCookies<any>(undefined)
    const [showincomes, setShowIncomes] = useState<showIncomesInterface>()
    const [showModal, setShowModal] = useState<boolean>(false)
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
    const [id, setId] = useState<string>('')
    const [incomeTypes, setIncomeTypes] = useState<incomeTypesInterface[]>()
    const [incomeTypeName, setIncomeTypeName] = useState<string>('')
    const [incomeAmount, setIncomeAmount] = useState<string>('')
    const [incomeDate, setIncomeDate] = useState<string>('')
    const [incomeMonth, setIncomeMonth] = useState<string>('')
    const [incomeYear, setIncomeYear] = useState<string>('')
    const [error, setError] = useState<string>('')
    const userEmail = cookies.Email
    const authToken = cookies.AuthToken
    const moneyRegex = /\d(?=(\d{3})+,)/g;

    const getIncomes = async () => {
        try {

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/incomes/${userEmail}`, {
                headers: {
                    Authorization: authToken,
                }
            })

            const data = await response.json()
            setShowIncomes(data)

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getIncomes()
    }, [])

    const getIncomeInfo = async (incomeId: string) => {

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/income/${userEmail}/${incomeId}`, {
                headers: {
                    Authorization: authToken,
                }
            })
            const data = await response.json()

            getincomeTypes()
            setincomeData(data)
            setId(incomeId)
            setIncomeAmount(data[0].income_amount)
            const dateYear = data[0].income_date.substring(0, 4)
            const dateMonth = data[0].income_date.substring(5, 7)
            const dateDay = data[0].income_date.substring(8, 10)
            const incomeDate = `${dateYear}-${dateMonth}-${dateDay}`
            setIncomeDate(incomeDate)
            setIncomeMonth(dateMonth)
            setIncomeYear(dateYear)
            
        } catch (error) {
            console.log(error)
        }
    }

    const showEditModal = (expenseId: string) => {
        getIncomeInfo(expenseId)
        setShowModal(true)
    }

    const showOrCloseEditModal = () => {
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


    const getincomeTypes = async () => {

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/income-types`, {
                headers: {
                    Authorization: authToken,
                }
            })
            const data = await response.json()
            setIncomeTypes(data)

        } catch (error) {
            console.error(error)
        }
    }

    const handleNewincomeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputDate = e.target.value
        const date = inputDate.split('-')
        const year = date[0]
        const month = date[1]
        setIncomeDate(inputDate)
        setIncomeMonth(month)
        setIncomeYear(year)
    }

    const updateincome = async (e: any) => {
        e.preventDefault()
        const formattedAmount = incomeAmount.replace(',', '.').replace(moneyRegex, '$&.')
        console.log(formattedAmount)
        const incomeDataDate = incomeData[0].income_date.slice(0, 10)

        if (incomeTypeName === '' || formattedAmount === '' || incomeDate === '') {
            setError('Por favor, preencha todas as informações.')
            return
        }

        if (incomeTypeName === incomeData[0].income_type &&
            incomeAmount === incomeData[0].income_amount &&
            incomeDate === incomeDataDate) {
            setError('Não houve modificação em pelo menos um campo.')
            return
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/income/${userEmail}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    incomeTypeName,
                    incomeAmount: formattedAmount,
                    incomeDate,
                    incomeYear,
                    incomeMonth,
                    userEmail,
                    id
                })
            })
            if (response.status === 200) {
                toast.success("Receita excluída! 😎");
                setShowModal(false)
                getIncomes()
                setError('')
            }

            if (response.status !== 200) {
                toast.error("Houve um erro, tente novamente. 😐");
            }

        } catch (error) {
            console.error(error)
        }
    }

    const getIncomeId = (incomeId: string) => {
        showOrCloseDeleteModal()
        setId(incomeId)
        getIncomeInfo(incomeId)
    }

    const showOrCloseDeleteModal = () => {
        if (!showDeleteModal) {
            setShowDeleteModal(true)
            document.body.classList.add('no-scroll');
            window.scrollTo(0, 0);
        }

        if (showDeleteModal) {
            setId('')
            setShowDeleteModal(false)
            document.body.classList.remove('no-scroll');
        }
    }

    const deleteIncome = async () => {

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/income/${userEmail}/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            })
            if (response.status === 200) {
                toast.success("Receita excluída! 😎");
                setShowDeleteModal(false)
                getIncomes()
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
            <div className='modify-income-container'>
                <AdminNavigationHeader />
                <div className='modify-income-table-container'>
                    <h2>Abaixo estão listadas as 10 últimas despesas lançadas</h2>
                    <table className='incomes-list-table'>
                        <thead>
                            <tr>
                                <th>Tipo</th>
                                <th>Valor</th>
                                <th>Data</th>
                                <th>Editar</th>
                                <th>Deletar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showincomes ? showincomes.map((income: any) => (

                                <tr className='incomes-list'
                                    key={income.id}
                                >
                                    <td>{income.income_type}</td>
                                    <td>R${' '} {income.income_amount
                                        .replace('.', ',')
                                        .replace(moneyRegex, '$&.')}</td>
                                    <td>{income.income_date}</td>
                                    <td onClick={() => showEditModal(income.id)} className='edit-button'>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                                            <path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" />
                                        </svg>
                                    </td>
                                    <td className='delete-button' onClick={() => getIncomeId(income.id)}>
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
                <div id="income-edit">
                    <div className="income-edit-modal-container">
                        <div className="close-button-container">
                            <button onClick={showOrCloseEditModal}>
                                X
                            </button>
                        </div>
                        <div className='income-form-container'>
                            <form className='income-form'>
                                <h2>Preencha os dados abaixo para modificar a despesa</h2>
                                <div className='choice-container'>
                                    <h3>Tipo de despesa atual: <strong>{incomeData[0].income_type}</strong></h3>
                                    <label>Escolha o tipo de despesa:</label>
                                    <select
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setIncomeTypeName(e.target.value)}
                                    >
                                        <option value="">Selecione...</option>
                                        {incomeTypes ? incomeTypes.map((option: any) => (
                                            <option
                                                key={option.id}
                                                value={option.income_type}
                                            >
                                                {option.income_type}
                                            </option>
                                        )) : ''}
                                    </select >
                                </div>
                                <div className='choice-container'>
                                    <label>Informe o valor da despesa:</label>
                                    <CurrencyInput
                                        value={incomeAmount}
                                        onValueChange={(value) =>
                                            setIncomeAmount(value!)
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
                                        min="1997-01-01" max="2030-12-31" value={incomeDate}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNewincomeDate(e)}
                                    />
                                </div>
                                {error !== '' ? <p className='error-message'>{error}</p> : ''}
                                <div className='submit-button-container'>
                                    <input
                                        className='submit-income'
                                        type='submit'
                                        value='Enviar'
                                        onClick={updateincome}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            }
            {showDeleteModal &&
                <div id='expense-edit-delete'>
                    <div className='expense-delete-modal-container'>
                        <div className='close-button-container'>
                            <button onClick={showOrCloseDeleteModal}>
                                X
                            </button>
                        </div>
                        <h2>Você deseja excluir esta despesa?</h2>
                        <p>Despesa: <strong>{incomeData[0].income_type}</strong></p>
                        <p>Valor: <strong>R${' '}{incomeData[0].income_amount.replace('.', ',')
                            .replace(moneyRegex, '$&.')}</strong></p>
                        <div className='delete-button-container'>
                            <button onClick={deleteIncome}>Sim</button>
                            <button onClick={showOrCloseDeleteModal}>Não</button>
                        </div>
                    </div>
                </div>
            }
        </>
    );

}

export default ModifyIncome