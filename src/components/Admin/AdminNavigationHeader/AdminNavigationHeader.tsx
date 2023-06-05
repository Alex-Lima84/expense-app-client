import { Link } from 'react-router-dom'
import './styles.scss'

const AdminNavigationHeader = () => {

    return (
        <div className='admin-navigation-container'>
            <div className='options-container'>
                <Link to='/admin/home'>Home</Link>
                <Link to='/admin/expense-entry'>Adicionar despesa</Link>
                <Link to='/admin/modify-expense'>Modificar despesa</Link>
                <Link to='/admin/income-entry'>Adicionar receita</Link>
                <Link to='/admin/modify-income'>Modificar receita</Link>
                <Link to='/admin/expense-view'>Visualizar despesas</Link>
                <Link to='/admin/income-view'>Visualizar receitas</Link>
            </div>
            <div></div>
        </div>
    );
}

export default AdminNavigationHeader;