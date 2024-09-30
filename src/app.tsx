import { Dialog } from './components/ui/dialog'
import { CreateGoal } from './components/create-goal'
import { EmptyGoals } from './components/empty-goals'
import { useQuery } from '@tanstack/react-query'
import { getSummary } from './http/get-summary'
import { WeeklySummary } from './components/weekly-summary'
import { Loader2 } from 'lucide-react'
import { getPendingGoals } from './http/get-pending-goals'

export function App() {
  const { data, isLoading } = useQuery({
    queryKey: ['pending-goals'],
    queryFn: getPendingGoals,
  })

  if (isLoading || !data) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="text-zinc-500 animate-spin size-10" />
      </div>
    )
  }

  return (
    <Dialog>
      {data.pendingGoals.length > 0 ? <WeeklySummary /> : <EmptyGoals />}

      <CreateGoal />
    </Dialog>
  )
}
