import {Outlet} from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import { AuthProvide } from './context/AuthContext'
import Loading from './components/Loading'
import Footer from './components/Footer'
function App() {
  

  return (
    <>
    
    <AuthProvide>

    <Navbar></Navbar>
    <main className='min-h-screen max-w-screen-2xl mx-auto px-4 py-6 font-primary'>
    <Outlet></Outlet>
    </main>
    
    <Footer></Footer>

    </AuthProvide>
    
    </>
  )
}

export default App
