import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Sender from './components/sender'
import Receiver from './components/receiver'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/sender' element = {<Sender/>}></Route>
        <Route path='/receiver' element = {<Receiver/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
