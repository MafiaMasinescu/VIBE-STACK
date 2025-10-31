import { useState } from 'react'
import Login from './pages/Login'
import LoginForm from './pages/LoginForm'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
  {/* keep original Login component for now; render interactive LoginForm */}
  <LoginForm />
    </div>
  )
}

export default App
