import { Link } from "react-router-dom"
import './styles.scss'
import Admin from "../Home/Home"

const ModifyExpense = () => {

    return (
        <div className="modify-expense-container">
            <Admin />
            <h2>Abaixo estão listados as últimos 10 recebimentos lançados:</h2>
        </div>
    )
}

export default ModifyExpense