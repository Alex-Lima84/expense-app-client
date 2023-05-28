import { Link } from "react-router-dom"
import './styles.scss'
import Admin from "../Home/Home"

const ModifyExpense = () => {

    return (
        <div className="modify-expense-container">
            <Admin />
            <h2>Abaixo estão listadas as últimas 10 despesas lançadas:</h2>
        </div>
    )
}

export default ModifyExpense