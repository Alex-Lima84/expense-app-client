import AppRoutes from './Routes/Routes'

const App = () => {

  return (
    // @ts-expect-error TS(2304): Cannot find name 'div'.
    <div className='app'>
      // @ts-expect-error TS(2749): 'AppRoutes' refers to a value, but is being used a... Remove this comment to see the full error message
      <AppRoutes />
    </div>
  );
}

export default App;
