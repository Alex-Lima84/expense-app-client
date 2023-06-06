import { ToastContainer } from "react-toastify";
import AppRoutes from './Routes/Routes'
import "react-toastify/dist/ReactToastify.css";

const App = () => {

  return (

    <div className='app'>
      <ToastContainer autoClose={1000} />
      <AppRoutes />
    </div>
  );
}

export default App;
