import { useState } from 'react'
import BookTable from './components/BookTable'
import InsertBookForm from './components/InsertBookForm'

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleBookAdded = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <>
      <div className="text-4xl font-bold text-center p-4 bg-blue-500/30 backdrop-blur-md text-white shadow-lg border border-white/20 rounded-lg">BookApp</div>
      <BookTable refreshTrigger={refreshTrigger} />
      <InsertBookForm onBookAdded={handleBookAdded} />
    </>
  )
}
export default App
