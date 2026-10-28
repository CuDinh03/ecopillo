import { BrowserRouter, Routes } from 'react-router-dom'
import { appRoutes } from './routes'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>{appRoutes}</Routes>
    </BrowserRouter>
  )
}
