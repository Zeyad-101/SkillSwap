import NavBar from './components/NavBar.jsx'
import AppRoutes from './router.jsx'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />
      <main className="flex-1">
        <AppRoutes />
      </main>
    </div>
  )
}
