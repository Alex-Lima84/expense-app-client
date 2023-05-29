import { Link } from "react-router-dom"
import './styles.scss'
import AdminHome from "../Home/AdminHome"

const ModifyExpense = () => {

    return (
        <div className="modify-expense-container">
            <AdminHome />
            <h2>Abaixo estão listados as 10 últimas receitas lançadas:</h2>
        </div>
    )
}

export default ModifyExpense