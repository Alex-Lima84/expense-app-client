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
    const [expenseYears, setExpenseYears] = useState<string[]>([])
    const [currentExpenseYear, setCurrentExpenseYear] = useState<string>('')
    const [expensesByMonth, setExpensesByMonth] = useState<any>()
    const [formattedExpenses, setFormattedExpenses] = useState<any>()
    const [homeExpenses, setHomeExpenses] = useState<string[]>([]);
    const [transportationExpenses, setTransportationExpenses] = useState<string[]>([]);
    const [vehicleExpenses, setVehicleExpenses] = useState<string[]>([]);
    const [healthExpenses, setHealthExpenses] = useState<string[]>([]);
    const [personalExpenses, setPersonalExpenses] = useState<string[]>([]);
    const [leisureExpenses, setLeisureExpenses] = useState<string[]>([]);
    const [educationExpenses, setEducationExpenses] = useState<string[]>([]);
    const [dependentsExpenses, setDependentsExpenses] = useState<string[]>([]);
    const userEmail = cookies.Email
    const authToken = cookies.AuthToken
    const moneyRegex = /\d(?=(\d{3})+,)/g;

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
        getListOfYears()
    }, [])


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

    const getExpenseMonths = async (expenseYear: string) => {
        setCurrentExpenseYear(expenseYear)
        setExpenseMonths([])

        try {

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/expenses-month/${expenseYear}/${userEmail}`, {
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

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/expenses-month/${expenseMonth}/${currentExpenseYear}/${userEmail}`, {
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

    useEffect(() => {

        if (expensesByMonth) {

            const classifiedExpenses = expensesByMonth.reduce((acc: { expense_category: any; expenses: any[]; }[], expense: { expense_category: any; }) => {
                const { expense_category } = expense;

                const existingCategory = acc.find((item: { expense_category: any; }) => item.expense_category === expense_category);

                if (existingCategory) {
                    existingCategory.expenses.push(expense);
                } else {
                    acc.push({ expense_category, expenses: [expense] });
                }

                return acc;
            }, []);

            const summedExpenses = classifiedExpenses.map((category: { expenses: any[]; expense_category: any; }) => {
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

    }, [expensesByMonth])

    useEffect(() => {
        if (formattedExpenses) {
            formattedExpenses.forEach((item: { expense_category: string; expenses: []; }) => {

                const { expense_category, expenses } = item;

                switch (expense_category) {
                    case "Habitação":
                        setHomeExpenses(expenses);
                        break;
                    case "Transporte":
                        setTransportationExpenses(expenses);
                        break;
                    case "Automóvel":
                        setVehicleExpenses(expenses);
                        break;
                    case "Saúde":
                        setHealthExpenses(expenses);
                        break;
                    case "Despesas pessoais":
                        setPersonalExpenses(expenses);
                        break;
                    case "Lazer":
                        setLeisureExpenses(expenses);
                        break;
                    case "Educação":
                        setDependentsExpenses(expenses);
                        break;
                    case "Dependentes":
                        setDependentsExpenses(expenses);
                        break;
                }
            });
        }
    }, [formattedExpenses])

    return (
        <>
            <AdminHeader />
            <div className='show-all-expenses-container'>
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
                <div>
                    {homeExpenses.length ?
                        <>
                            <h2>Habitação</h2>
                            <thead>
                                <tr>
                                    <th>Tipo</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                        </>
                        : ''
                    }
                    {homeExpenses ? homeExpenses.map((expense: any, index) => (
                        <tr>
                            <td key={index}>{expense.expense_type}</td>
                            <td>R${' '} {expense.expense_amount
                                .replace('.', ',')
                                .replace(moneyRegex, '$&.')}
                            </td>
                        </tr>
                    )) : ''}
                </div>
                <div>
                    {healthExpenses.length ?
                        <>
                            <h2>Saúde</h2>
                            <thead>
                                <tr>
                                    <th>Tipo</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                        </>
                        : ''
                    }
                    {healthExpenses ? healthExpenses.map((expense: any, index) => (
                        <tr>
                            <td key={index}>{expense.expense_type}</td>
                            <td>R${' '} {expense.expense_amount
                                .replace('.', ',')
                                .replace(moneyRegex, '$&.')}
                            </td>
                        </tr>
                    )) : ''}
                </div>
                <div>
                    {transportationExpenses.length ?
                        <>
                            <h2>Transporte</h2>
                            <thead>
                                <tr>
                                    <th>Tipo</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                        </>
                        : ''
                    }
                    {transportationExpenses ? transportationExpenses.map((expense: any, index) => (
                        <tr>
                            <td key={index}>{expense.expense_type}</td>
                            <td>R${' '} {expense.expense_amount
                                .replace('.', ',')
                                .replace(moneyRegex, '$&.')}
                            </td>
                        </tr>
                    )) : ''}
                </div>
                <div>
                    {vehicleExpenses.length ?
                        <>
                            <h2>Automóvel</h2>
                            <thead>
                                <tr>
                                    <th>Tipo</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                        </>
                        : ''
                    }
                    {vehicleExpenses ? vehicleExpenses.map((expense: any, index) => (
                        <tr>
                            <td key={index}>{expense.expense_type}</td>
                            <td>R${' '} {expense.expense_amount
                                .replace('.', ',')
                                .replace(moneyRegex, '$&.')}
                            </td>
                        </tr>
                    )) : ''}
                </div>
                <div>
                    {personalExpenses.length ?
                        <>
                            <h2>Despesas pessoais</h2>
                            <thead>
                                <tr>
                                    <th>Tipo</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                        </>
                        : ''
                    }
                    {personalExpenses ? personalExpenses.map((expense: any, index) => (
                        <tr>
                            <td key={index}>{expense.expense_type}</td>
                            <td>R${' '} {expense.expense_amount
                                .replace('.', ',')
                                .replace(moneyRegex, '$&.')}
                            </td>
                        </tr>
                    )) : ''}
                </div>
                <div>
                    {leisureExpenses.length ?
                        <>
                            <h2>Lazer</h2>
                            <thead>
                                <tr>
                                    <th>Tipo</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                        </>
                        : ''
                    }
                    {leisureExpenses ? leisureExpenses.map((expense: any, index) => (
                        <tr>
                            <td key={index}>{expense.expense_type}</td>
                            <td>R${' '} {expense.expense_amount
                                .replace('.', ',')
                                .replace(moneyRegex, '$&.')}
                            </td>
                        </tr>
                    )) : ''}
                </div>
                <div>
                    {educationExpenses.length ?
                        <>
                            <h2>Educação</h2>
                            <thead>
                                <tr>
                                    <th>Tipo</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                        </>
                        : ''
                    }
                    {educationExpenses ? educationExpenses.map((expense: any, index) => (
                        <tr>
                            <td key={index}>{expense.expense_type}</td>
                            <td>R${' '} {expense.expense_amount
                                .replace('.', ',')
                                .replace(moneyRegex, '$&.')}
                            </td>
                        </tr>
                    )) : ''}
                </div>
                <div>
                    {dependentsExpenses.length ?
                        <>
                            <h2>Dependentes</h2>
                            <thead>
                                <tr>
                                    <th>Tipo</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                        </>
                        : ''
                    }
                    {dependentsExpenses ? dependentsExpenses.map((expense: any, index) => (
                        <tr>
                            <td key={index}>{expense.expense_type}</td>
                            <td>R${' '} {expense.expense_amount
                                .replace('.', ',')
                                .replace(moneyRegex, '$&.')}
                            </td>
                        </tr>
                    )) : ''}
                </div>
            </div>
        </>
    )
}

export default ShowAllExpenses
