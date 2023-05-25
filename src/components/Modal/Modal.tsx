import { useState, useEffect, FormEvent } from 'react'
import { useCookies } from 'react-cookie'
import './styles.scss'
interface dataType {
    user_email: string,
    title: string,
    progress: number,
    date: Date
}

const Modal = ({
    mode,
    setShowModal,
    getData,
    task
}: any) => {
    const [cookies, ,] = useCookies<string>(undefined)
    const editMode = mode === 'edit' ? true : false
    const [data, setData] = useState<dataType>({
        user_email: editMode ? task.user_email : cookies.Email,
        title: editMode ? task.title : null,
        progress: editMode ? task.progress : 50,
        date: editMode ? task.date : new Date()
    })
    const [expenseCategories, setExpenseCategories] = useState<any>('')
    const [expenseCategoryName, setExpenseCategoryName] = useState<string>('')
    const [expenseTypes, setExpenseTypes] = useState<any>('')
    const [expenseTypeName, setExpenseTypeName] = useState<string>('')

    const showExpenseCategory = async () => {
        try {

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/expense-categories`)
            const data = await response.json()
            setExpenseCategories(data)

        } catch (error) {
            console.error(error)
        }
    }

    const getExpenseTypes = async (categoryId: string) => {

        addCategoryName(categoryId)

        try {

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/expense-types/${categoryId}`)
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

    // const postData = async (e: any) => {
    //     e.preventDefault()
    //     try {
    //         const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/todos`, {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify(data)
    //         })
    //         if (response.status === 200) {
    //             console.log('new todo created')
    //             setShowModal(false)
    //             getData()
    //         }
    //     } catch (error) {
    //         console.error(error)
    //     }
    // }

    // const editData = async (e: any) => {
    //     e.preventDefault()

    //     try {
    //         const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/todos/${task.id}`, {
    //             method: 'PUT',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify(data)
    //         })
    //         if (response.status === 200) {
    //             console.log('The todo was updated')
    //             setShowModal(false)
    //             getData()
    //         }
    //     } catch (error) {
    //         console.error(error)
    //     }
    // }     

    const handleChange = (e: any) => {

        const { name, value } = e.target
        setData(data => ({
            ...data,
            [name]: value
        }))
    }

    useEffect(() => {
        showExpenseCategory()
    }, [])

    console.log(expenseCategoryName)
    console.log(expenseTypeName)

    return (
        <div className='overlay'>
            <div className='modal'>
                <div className='form-title-container'>
                    <h3>Let's {mode} your task</h3>
                    <button onClick={() => setShowModal(false)}>X</button>
                </div>
                <form className='modal-form'>
                    <input
                        required
                        maxLength={30}
                        placeholder=' Your task goes here'
                        name='title'
                        value={data.title}
                        onChange={handleChange}
                    />
                    <div className='category-choice'>
                        <label>Escolha a categoria da despesa</label>
                        <select
                            onChange={(e: any) => { getExpenseTypes(e.target.value) }}
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
                    <div className='type-choice'>
                        <label>Escolha o tipo de despesa</label>
                        <select
                            onChange={(e: any) => setExpenseTypeName(e.target.value)}
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
                    <input
                        className={mode}
                        type='submit'
                    // onClick={editMode ? editData : postData}
                    />
                </form>
            </div>
        </div>
    );
}

export default Modal;