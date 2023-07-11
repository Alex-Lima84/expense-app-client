import { useEffect, useState } from "react";
import { useCookies } from "react-cookie"
import AdminHeader from "../../../components/Admin/AdminHeader/AdminHeader";
import AdminNavigationHeader from "../../../components/Admin/AdminNavigationHeader/AdminNavigationHeader";
import './styles.scss'

interface showExpensesInterface {
    forEach(arg0: (expense: string[]) => void): unknown;
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
interface IncomeInterface {
    income_type: string;
    income_amount: string;
}

const ShowIncomes = () => {
    const [cookies, ,] = useCookies<any>(undefined)
    const [listOfIncomeYear, setListOfIncomeYear] = useState<showExpensesInterface>()
    const [incomeMonths, setIncomeMonths] = useState<any>([])
    const [incomeYears, setIncomeYears] = useState<string[]>([])
    const [currentIncomeYear, setCurrentIncomeYear] = useState<string>('')
    const [incomesByMonth, setIncomesByMonth] = useState<any>()
    const [formattedIncomes, setFormattedIncomes] = useState<any>()
    const [incomesSum, setIncomesSum] = useState<string[]>([])
    const [allIncomesSum, setAllIncomesSum] = useState<string>('')
    const [thirteenthSalaryIncomes, setThirteenthSalaryIncomes] = useState<string[]>([]);
    const [vacationIncomes, setVacationIncomes] = useState<string[]>([]);
    const [investmentsIncomes, setInvestmentsIncomes] = useState<string[]>([]);
    const [othersIncomes, setOthersIncomes] = useState<string[]>([]);
    const [savingsIncomes, setSavingsIncomes] = useState<string[]>([]);
    const [irIncomes, setIrIncomes] = useState<string[]>([]);
    const [salaryIncomes, setSalaryIncomes] = useState<string[]>([]);
    const [lastMonthProfit, setLastMonthProfit] = useState<string[]>([]);
    const userEmail = cookies.Email
    const authToken = cookies.AuthToken
    const moneyRegex = /\d(?=(\d{3})+,)/g;

    const setAllEmpty = () => {
        setThirteenthSalaryIncomes([])
        setVacationIncomes([])
        setInvestmentsIncomes([])
        setOthersIncomes([])
        setSavingsIncomes([])
        setIrIncomes([])
        setSalaryIncomes([])
        setLastMonthProfit([])
        setIncomesSum([])
        setAllIncomesSum('')
    }

    const getListOfIncomesYears = async () => {

        try {

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/incomes/${userEmail}`, {
                headers: {
                    Authorization: authToken,
                }
            })

            const data = await response.json()
            setListOfIncomeYear(data)

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getListOfIncomesYears()
    }, [])


    useEffect(() => {

        if (!listOfIncomeYear) {
            return
        }

        let incomeYearArray: string[] = []
        listOfIncomeYear.forEach((expense: any) => {
            incomeYearArray.push(expense.income_year)
        });
        incomeYearArray = Array.from(new Set(incomeYearArray));
        incomeYearArray.sort((a, b) => a.localeCompare(b));

        setIncomeYears(incomeYearArray)


    }, [listOfIncomeYear])

    const getIncomeMonths = async (incomeYear: string) => {
        setCurrentIncomeYear(incomeYear)
        setIncomeMonths([])

        try {

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/incomes-month/${incomeYear}/${userEmail}`, {
                headers: {
                    Authorization: authToken,
                }
            })
            const data = await response.json()
            setIncomeMonths(data)

        } catch (error) {
            console.error(error)
        }
    }

    const getIncomesByMonth = async (incomeMonth: string) => {

        try {

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/incomes-month/${incomeMonth}/${currentIncomeYear}/${userEmail}`, {
                headers: {
                    Authorization: authToken,
                }
            })
            const data = await response.json()
            setIncomesByMonth(data)

        } catch (error) {
            console.error(error)
        }
    }

    const checkIncomesByMonth = () => {
        if (!incomesByMonth) {
            return
        }

        setAllEmpty()

        const organizedIncomes = incomesByMonth.reduce((acc: IncomeInterface[], income: IncomeInterface) => {
            const { income_type, income_amount } = income;

            const existingCategory = acc.find((item: { income_type: string; }) => item.income_type === income_type);

            if (existingCategory) {
                existingCategory.income_amount = (parseFloat(existingCategory.income_amount) + parseFloat(income_amount)).toFixed(2);
            } else {
                acc.push({ income_type, income_amount });
            }

            return acc;
        }, []);

        setFormattedIncomes(organizedIncomes);


    }

    useEffect(() => {
        checkIncomesByMonth()
    }, [incomesByMonth])

    const checkFormattedIncomes = () => {
        if (!formattedIncomes) {
            return;
        }

        formattedIncomes.forEach((item: { income_type?: string; income_amount?: string }) => {
            const { income_amount, income_type } = item;

            if (income_amount) {
                incomesSum.push(income_amount);
            }

            switch (income_type) {
                case "13° salário":
                    setThirteenthSalaryIncomes((prevIncomes) => [...prevIncomes, income_amount ?? '']);
                    break;
                case "Férias":
                    setVacationIncomes((prevIncomes) => [...prevIncomes, income_amount ?? '']);
                    break;
                case "Investimentos":
                    setInvestmentsIncomes((prevIncomes) => [...prevIncomes, income_amount ?? '']);
                    break;
                case "Outros":
                    setOthersIncomes((prevIncomes) => [...prevIncomes, income_amount ?? '']);
                    break;
                case "Poupança":
                    setSavingsIncomes((prevIncomes) => [...prevIncomes, income_amount ?? '']);
                    break;
                case "Restituição IR":
                    setIrIncomes((prevIncomes) => [...prevIncomes, income_amount ?? '']);
                    break;
                case "Salário":
                    setSalaryIncomes((prevIncomes) => [...prevIncomes, income_amount ?? '']);
                    break;
                case "Sobras / Mês passado":
                    setLastMonthProfit((prevIncomes) => [...prevIncomes, income_amount ?? '']);
                    break;
            }
        });

        const totalSum = incomesSum.reduce((sum, amount) => sum + parseFloat(amount.replace(',', '.')), 0).toFixed(2);
        setAllIncomesSum(totalSum);
    };

    useEffect(() => {
        checkFormattedIncomes()
    }, [formattedIncomes]);

    return (
        <>
            <AdminHeader />
            <div className='show-all-expenses-container'>
                <AdminNavigationHeader />
                <div className="outter-container">
                    <div className="choices-container">
                        <div className='choice-container'>
                            <h1>Visualizar receitas</h1>
                            <label>Escolha o ano:</label>
                            <select
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { getIncomeMonths(e.target.value) }}
                            >
                                <option value="">Selecione...</option>
                                {incomeYears ? incomeYears.map((option: any) => (
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
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { getIncomesByMonth(e.target.value) }}
                            >
                                <option value="">Selecione...</option>
                                {incomeMonths ? incomeMonths.map((option: any, index: any) => (
                                    <option
                                        key={index}
                                        value={option.income_month}
                                    >
                                        {option.income_month}
                                    </option>
                                )) : ''}
                            </select >
                        </div>
                    </div>
                    <div className="tables-container">
                        <table>
                            {salaryIncomes.length ?
                                <thead>
                                    <h2>Salário</h2>
                                    <tr>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                : ''
                            }
                            {salaryIncomes.length ?
                                <tbody>
                                    <tr>
                                        <td >{salaryIncomes[0]
                                            .replace('.', ',')
                                            .replace(moneyRegex, '$&.')}
                                        </td>
                                    </tr>
                                </tbody>
                                : ''}
                        </table>
                        <table>
                            {thirteenthSalaryIncomes.length ?
                                <thead>
                                    <h2>13° Salário</h2>
                                    <tr>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                : ''
                            }
                            {thirteenthSalaryIncomes.length ?
                                <tbody>
                                    <tr>
                                        <td>{thirteenthSalaryIncomes[0]
                                            .replace('.', ',')
                                            .replace(moneyRegex, '$&.')}
                                        </td>
                                    </tr>
                                </tbody>
                                : ''}
                        </table>
                        <table>
                            {vacationIncomes.length ?
                                <thead>
                                    <h2>Férias</h2>
                                    <tr>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                : ''
                            }
                            {vacationIncomes.length ?
                                <tbody>
                                    <tr>
                                        <td>{vacationIncomes[0]
                                            .replace('.', ',')
                                            .replace(moneyRegex, '$&.')}
                                        </td>
                                    </tr>
                                </tbody>
                                : ''}
                        </table>
                        <table>
                            {investmentsIncomes.length ?
                                <thead>
                                    <h2>Investimentos</h2>
                                    <tr>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                : ''
                            }
                            {investmentsIncomes.length ?
                                <tbody>
                                    <tr>
                                        <td>{investmentsIncomes[0]
                                            .replace('.', ',')
                                            .replace(moneyRegex, '$&.')}
                                        </td>
                                    </tr>
                                </tbody>
                                : ''}
                        </table>
                        <table>
                            {savingsIncomes.length ?
                                <thead>
                                    <h2>Poupança</h2>
                                    <tr>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                : ''
                            }
                            {savingsIncomes.length ?
                                <tbody>
                                    <tr>
                                        <td>{savingsIncomes[0]
                                            .replace('.', ',')
                                            .replace(moneyRegex, '$&.')}
                                        </td>
                                    </tr>
                                </tbody>
                                : ''}
                        </table>
                        <table>
                            {irIncomes.length ?
                                <thead>
                                    <h2>Restituição IR</h2>
                                    <tr>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                : ''
                            }
                            {irIncomes.length ?
                                <tbody>
                                    <tr>
                                        <td>{irIncomes[0]
                                            .replace('.', ',')
                                            .replace(moneyRegex, '$&.')}
                                        </td>
                                    </tr>
                                </tbody>
                                : ''}
                        </table>
                        <table>
                            {lastMonthProfit.length ?
                                <thead>
                                    <h2>Lucro / Mês passado</h2>
                                    <tr>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                : ''
                            }
                            {lastMonthProfit.length ?
                                <tbody>
                                    <tr>
                                        <td>{lastMonthProfit[0]
                                            .replace('.', ',')
                                            .replace(moneyRegex, '$&.')}
                                        </td>
                                    </tr>
                                </tbody>
                                : ''}
                        </table>
                        <table>
                            {othersIncomes.length ?
                                <thead>
                                    <h2>Outros</h2>
                                    <tr>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                : ''
                            }
                            {othersIncomes.length ?
                                <tbody>
                                    <tr>
                                        <td>{othersIncomes[0]
                                            .replace('.', ',')
                                            .replace(moneyRegex, '$&.')}
                                        </td>
                                    </tr>
                                </tbody>
                                : ''}
                        </table>
                    </div>
                    {allIncomesSum ?
                        <div className="total-value">
                            <h3>Valor total:</h3>
                            <p>R${' '} {allIncomesSum
                                .replace('.', ',')
                                .replace(moneyRegex, '$&.')}
                            </p>
                        </div>
                        : ''}
                </div>
            </div>
        </>
    )
}

export default ShowIncomes
