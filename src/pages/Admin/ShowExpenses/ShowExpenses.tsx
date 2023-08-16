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

interface ExpenseInterface {
    expense_type: string;
    expense_category: string;
    expense_amount: string;
}

const ShowExpenses = () => {
    const [cookies, ,] = useCookies<any>(undefined)
    const [listOfExpenseYear, setListOfExpenseYear] = useState<showExpensesInterface>()
    const [expenseMonths, setExpenseMonths] = useState<any>([])
    const [expenseYears, setExpenseYears] = useState<string[]>([])
    const [currentExpenseYear, setCurrentExpenseYear] = useState<string>('')
    const [expensesByMonth, setExpensesByMonth] = useState<any>()
    const [formattedExpenses, setFormattedExpenses] = useState<any>()
    const [expensesSum, setExpensesSum] = useState<string[]>([])
    const [allExpensesSum, setAllExpensesSum] = useState<string>('')
    const [homeExpenses, setHomeExpenses] = useState<ExpenseInterface[]>([]);
    const [transportationExpenses, setTransportationExpenses] = useState<ExpenseInterface[]>([]);
    const [vehicleExpenses, setVehicleExpenses] = useState<ExpenseInterface[]>([]);
    const [healthExpenses, setHealthExpenses] = useState<ExpenseInterface[]>([]);
    const [personalExpenses, setPersonalExpenses] = useState<ExpenseInterface[]>([]);
    const [leisureExpenses, setLeisureExpenses] = useState<ExpenseInterface[]>([]);
    const [educationExpenses, setEducationExpenses] = useState<ExpenseInterface[]>([]);
    const [dependentsExpenses, setDependentsExpenses] = useState<ExpenseInterface[]>([]);
    const userEmail = cookies.Email
    const authToken = cookies.AuthToken
    const moneyRegex = /\d(?=(\d{3})+,)/g;

    const setAllEmpty = () => {
        setHomeExpenses([]);
        setTransportationExpenses([]);
        setVehicleExpenses([]);
        setHealthExpenses([]);
        setPersonalExpenses([]);
        setLeisureExpenses([]);
        setDependentsExpenses([]);
        setDependentsExpenses([]);
        setExpensesSum([])
        setAllExpensesSum('')
    }

    const getListOfExpenseYears = async () => {

        try {

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/expenses/expenses-years/${userEmail}`, {
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
        getListOfExpenseYears()
    }, [])

    const transformListofExpenseYear = () => {
        if (!listOfExpenseYear) {
            return
        }

        let expenseYearArray: string[] = []
        listOfExpenseYear.forEach((expense: any) => {
            expenseYearArray.push(expense.expense_year)
        });
        expenseYearArray = Array.from(new Set(expenseYearArray));
        expenseYearArray.sort((a, b) => a.localeCompare(b));

        setExpenseYears(expenseYearArray)
    }

    useEffect(() => {
        transformListofExpenseYear()
    }, [listOfExpenseYear])

    const getExpenseMonths = async (expenseYear: string) => {
        setCurrentExpenseYear(expenseYear)
        setExpenseMonths([])

        try {

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/expenses/expenses-month/${expenseYear}/${userEmail}`, {
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

    const getExpensesByMonth = async (expenseMonth: string) => {

        try {

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/expenses/expenses-month/${expenseMonth}/${currentExpenseYear}/${userEmail}`, {
                headers: {
                    Authorization: authToken,
                }
            })
            const data = await response.json()
            setExpensesByMonth(data)

        } catch (error) {
            console.error(error)
        }
    }

    const checkExpensesByMonth = () => {
        if (!expensesByMonth) {
            return
        }

        setAllEmpty()

        const organizedExpenses = expensesByMonth.reduce((acc: { expense_category: string; expenses: ExpenseInterface[]; }[], expense: ExpenseInterface) => {
            const { expense_category } = expense;

            const existingCategory = acc.find((item: { expense_category: any; }) => item.expense_category === expense_category);

            if (existingCategory) {
                existingCategory.expenses.push(expense);
            } else {
                acc.push({ expense_category, expenses: [expense] });
            }

            return acc;
        }, []);

        const summedExpenses = organizedExpenses.map((category: { expenses: ExpenseInterface[]; expense_category: string; }) => {
            const expenseMap = new Map<string, number>();

            category.expenses.forEach((expense: { expense_amount: string; expense_type: string; }) => {
                const amount = parseFloat(expense.expense_amount);
                if (expenseMap.has(expense.expense_type)) {
                    expenseMap.set(expense.expense_type, expenseMap.get(expense.expense_type)! + amount);
                } else {
                    expenseMap.set(expense.expense_type, amount);
                }
            });

            const summedExpenses = Array.from(expenseMap).map(([expenseType, amount]) => ({
                expense_type: expenseType,
                expense_amount: amount.toFixed(2),
                expense_category: category.expense_category,
            }));

            return {
                expense_category: category.expense_category,
                expenses: summedExpenses,
            };
        });

        setFormattedExpenses(summedExpenses);
    }

    useEffect(() => {
        checkExpensesByMonth()
    }, [expensesByMonth])

    const checkFormattedExpenses = () => {
        if (!formattedExpenses) {
            return;
        }

        formattedExpenses.forEach((item: { expense_category?: string; expenses?: ExpenseInterface[] }) => {
            const { expenses } = item;

            if (expenses && expenses.length > 0 && expenses[0].expense_amount) {
                expensesSum.push(expenses[0].expense_amount);
            }

            switch (item.expense_category) {
                case "Habitação":
                    setHomeExpenses(expenses || []);
                    break;
                case "Transporte":
                    setTransportationExpenses(expenses || []);
                    break;
                case "Automóvel":
                    setVehicleExpenses(expenses || []);
                    break;
                case "Saúde":
                    setHealthExpenses(expenses || []);
                    break;
                case "Despesas pessoais":
                    setPersonalExpenses(expenses || []);
                    break;
                case "Lazer":
                    setLeisureExpenses(expenses || []);
                    break;
                case "Educação":
                    setDependentsExpenses(expenses || []);
                    break;
                case "Dependentes":
                    setDependentsExpenses(expenses || []);
                    break;
            }
        });

        const totalSum = expensesSum.reduce((sum, amount) => sum + parseFloat(amount), 0).toFixed(2);
        setAllExpensesSum(totalSum);
    }

    useEffect(() => {
        checkFormattedExpenses()
    }, [formattedExpenses]);

    return (
        <>
            <AdminHeader />
            <div className='show-all-expenses-container'>
                <AdminNavigationHeader />
                <div className="outter-container">
                    <div className="choices-container">
                        <div className='choice-container'>
                            <h1>Visualizar despesas</h1>
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
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { getExpensesByMonth(e.target.value) }}
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
                    <div className="tables-container">
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
                    </div>
                    {allExpensesSum ?
                        <div className="total-value">
                            <h3>Valor total:</h3>
                            <p>R${' '} {allExpensesSum
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

export default ShowExpenses
