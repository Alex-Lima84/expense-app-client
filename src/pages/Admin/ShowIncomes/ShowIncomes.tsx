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

interface Income {
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

        if (listOfIncomeYear) {
            let incomeYearArray: string[] = []
            listOfIncomeYear.forEach((expense: any) => {
                incomeYearArray.push(expense.income_year)
            });
            incomeYearArray = Array.from(new Set(incomeYearArray));
            incomeYearArray.sort((a, b) => a.localeCompare(b));

            setIncomeYears(incomeYearArray)
        }

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

        if (incomesByMonth) {

            setAllEmpty()

            const organizedIncomes = incomesByMonth.reduce((acc: { income_type: string; income_amount: string; }[], income: { income_type: string; income_amount: string; }) => {
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
      
    console.log(formattedIncomes)
    console.log(irIncomes)
    console.log(allIncomesSum)

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
                    {/* <div className="tables-container">
                        <table>
                            {homeExpenses.length ?
                                <thead>
                                    <h2>Habitação</h2>
                                    <tr>
                                        <th>Tipo</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                : ''
                            }
                            {homeExpenses ? homeExpenses.map((expense: any, index) => (
                                <tbody>
                                    <tr>
                                        <td key={index}>{expense.expense_type}</td>
                                        <td>R${' '} {expense.expense_amount
                                            .replace('.', ',')
                                            .replace(moneyRegex, '$&.')}
                                        </td>
                                    </tr>
                                </tbody>
                            )) : ''}
                        </table>
                        <table>
                            {healthExpenses.length ?
                                <thead>
                                    <h2>Saúde</h2>
                                    <tr>
                                        <th>Tipo</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                : ''
                            }
                            {healthExpenses ? healthExpenses.map((expense: any, index) => (
                                <tbody>
                                    <tr>
                                        <td key={index}>{expense.expense_type}</td>
                                        <td>R${' '} {expense.expense_amount
                                            .replace('.', ',')
                                            .replace(moneyRegex, '$&.')}
                                        </td>
                                    </tr>
                                </tbody>
                            )) : ''}
                        </table>
                        <table>
                            {transportationExpenses.length ?
                                <thead>
                                    <h2>Transporte</h2>
                                    <tr>
                                        <th>Tipo</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                : ''
                            }
                            {transportationExpenses ? transportationExpenses.map((expense: any, index) => (
                                <tbody>
                                    <tr>
                                        <td key={index}>{expense.expense_type}</td>
                                        <td>R${' '} {expense.expense_amount
                                            .replace('.', ',')
                                            .replace(moneyRegex, '$&.')}
                                        </td>
                                    </tr>
                                </tbody>
                            )) : ''}
                        </table>
                        <table>
                            {vehicleExpenses.length ?
                                <thead>
                                    <h2>Automóvel</h2>
                                    <tr>
                                        <th>Tipo</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                : ''
                            }
                            {vehicleExpenses ? vehicleExpenses.map((expense: any, index) => (
                                <tbody>
                                    <tr>
                                        <td key={index}>{expense.expense_type}</td>
                                        <td>R${' '} {expense.expense_amount
                                            .replace('.', ',')
                                            .replace(moneyRegex, '$&.')}
                                        </td>
                                    </tr>
                                </tbody>
                            )) : ''}
                        </table>
                        <table>
                            {personalExpenses.length ?
                                <thead>
                                    <h2>Despesas pessoais</h2>
                                    <tr>
                                        <th>Tipo</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                : ''
                            }
                            {personalExpenses ? personalExpenses.map((expense: any, index) => (
                                <tbody>
                                    <tr>
                                        <td key={index}>{expense.expense_type}</td>
                                        <td>R${' '} {expense.expense_amount
                                            .replace('.', ',')
                                            .replace(moneyRegex, '$&.')}
                                        </td>
                                    </tr>
                                </tbody>
                            )) : ''}
                        </table>
                        <table>
                            {leisureExpenses.length ?
                                <thead>
                                    <h2>Lazer</h2>
                                    <tr>
                                        <th>Tipo</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                : ''
                            }
                            {leisureExpenses ? leisureExpenses.map((expense: any, index) => (
                                <tbody>
                                    <tr>
                                        <td key={index}>{expense.expense_type}</td>
                                        <td>R${' '} {expense.expense_amount
                                            .replace('.', ',')
                                            .replace(moneyRegex, '$&.')}
                                        </td>
                                    </tr>
                                </tbody>
                            )) : ''}
                        </table>
                        <table>
                            {educationExpenses.length ?
                                <thead>
                                    <h2>Educação</h2>
                                    <tr>
                                        <th>Tipo</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                : ''
                            }
                            {educationExpenses ? educationExpenses.map((expense: any, index) => (
                                <tbody>
                                    <tr>
                                        <td key={index}>{expense.expense_type}</td>
                                        <td>R${' '} {expense.expense_amount
                                            .replace('.', ',')
                                            .replace(moneyRegex, '$&.')}
                                        </td>
                                    </tr>
                                </tbody>
                            )) : ''}
                        </table>
                        <table>
                            {dependentsExpenses.length ?
                                <thead>
                                    <h2>Dependentes</h2>
                                    <tr>
                                        <th>Tipo</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                : ''
                            }
                            {dependentsExpenses ? dependentsExpenses.map((expense: any, index) => (
                                <tbody>
                                    <tr>
                                        <td key={index}>{expense.expense_type}</td>
                                        <td>R${' '} {expense.expense_amount
                                            .replace('.', ',')
                                            .replace(moneyRegex, '$&.')}
                                        </td>
                                    </tr>
                                </tbody>
                            )) : ''}
                        </table>
                    </div> */}
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
