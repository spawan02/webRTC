import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Sender from './components/Sender'
import Receiver from './components/Receiver'
import Liveapp from './components/Livekit'
import SignupForm from './components/Signup'
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/sender' element = {<Sender/>}></Route>
        <Route path='/receiver' element = {<Receiver/>}></Route>
        <Route path='/live' element = {<Liveapp/>}></Route>
        <Route path='/' element = {<SignupForm/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
