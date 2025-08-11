import {Outlet, useLocation} from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import { AuthProvider } from './context/AuthContext'
import Loading from './components/Loading'
import Footer from './components/Footer'

function App() {
  const location = useLocation();
  
  // Hide navbar and footer for dashboard routes
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  return (
    <>
    
    <AuthProvider>

    {!isDashboardRoute && <Navbar></Navbar>}
    <main className={isDashboardRoute ? '' : 'min-h-screen max-w-screen-2xl mx-auto px-4 py-6 font-primary'}>
    <Outlet></Outlet>
    </main>
    {!isDashboardRoute && <Footer></Footer>}
    
    </AuthProvider>
    
    </>
  )
}

export default App
