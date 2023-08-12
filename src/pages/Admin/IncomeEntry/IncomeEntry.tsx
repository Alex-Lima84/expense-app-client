import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import AdminHeader from '../../../components/Admin/AdminHeader/AdminHeader'
import AdminNavigationHeader from '../../../components/Admin/AdminNavigationHeader/AdminNavigationHeader'
import { toast } from 'react-toastify'
import './styles.scss'
import CurrencyInput from 'react-currency-input-field'
interface emailType {
    user_email: string,
}
interface incomeTypesInterface {
    income_type: string,
    id: string
}

const IncomeEntry = () => {
    const [cookies, ,] = useCookies<string>(undefined)
    const [userEmail,] = useState<emailType>(cookies.Email)
    const [incomeTypes, setIncomeTypes] = useState<incomeTypesInterface[]>()
    const [incomeTypeName, setIncomeTypeName] = useState<string>('')
    const [incomeAmount, setIncomeAmount] = useState<string>('')
    const [incomeDate, setIncomeDate] = useState<string>('')
    const [formattedDate, setFormattedDate] = useState<string>('')
    const [incomeMonth, setIncomeMonth] = useState<string>('')
    const [incomeYear, setIncomeYear] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [displayMessage, setDisplayMessage] = useState<string>('')
    const moneyRegex = /\d(?=(\d{3})+,)/g;
    const authToken = cookies.AuthToken

    const getIncomeTypes = async () => {

        try {

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/incomes/income-types/${userEmail}`, {
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

    useEffect(() => {
        getIncomeTypes()
    }, [])


    const handleIncomeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputDate = e.target.value
        const date = inputDate.split('-')
        const year = date[0]
        const month = date[1]
        const day = date[2]
        const formattedDate = `${day}/${month}/${year}`
        setIncomeDate(inputDate)
        setFormattedDate(formattedDate)
        setIncomeMonth(month)
        setIncomeYear(year)
    }

    const postIncome = async (e: any) => {

        e.preventDefault()

        const formattedAmount = incomeAmount.replace(',', '.').replace(moneyRegex, '$&.')

        if (incomeTypeName === '' || formattedAmount === '' || incomeDate === '') {
            setError('Por favor, preencha todas as informações.')
            return
        } else {
            setError('')
        }

        setDisplayMessage('Salvando dados...')
        try {

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/incomes/income-entry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${authToken}`,
                },
                body: JSON.stringify({
                    incomeTypeName,
                    incomeAmount,
                    incomeDate: formattedDate,
                    incomeYear,
                    incomeMonth,
                    userEmail
                })
            })

            if (response.ok === false) {
                toast.error("Houve um erro, tente novamente. 😐");
                return
            }

            setDisplayMessage('')
            setIncomeAmount('')
            setIncomeDate('')
            setIncomeTypes([{
                income_type: '',
                id: ''
            }])
            getIncomeTypes()
            toast.success("Receita lançada! 😎");

        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <AdminHeader />
            <div className='income-entry-container'>
                <AdminNavigationHeader />
                <div className='income-form-container'>
                    <form className='income-form'>
                        <h2>Adicionar receita</h2>
                        <div className='choice-container'>
                            <label>Escolha o tipo de receita:</label>
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
                            <label>Informe o valor da receita:</label>
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
                            <label>Informe a data da receita:</label>
                            <input
                                type="date"
                                min="1997-01-01" max="2030-12-31" value={incomeDate}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleIncomeDate(e)}
                            />
                        </div>
                        {error !== '' ? <p className='error-message'>{error}</p> : ''}
                        <div className='submit-button-container'>
                            <input
                                className='submit-expense'
                                type='submit'
                                value='Enviar'
                                onClick={postIncome}
                            />
                        </div>
                        {displayMessage !== '' ? <p className='display-message'>{displayMessage}</p> : ''}
                    </form>
                </div>
            </div>
        </>
    );
}

export default IncomeEntry;