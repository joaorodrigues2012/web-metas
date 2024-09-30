import { CheckCircle2, Loader2, Plus } from 'lucide-react'
import { Button } from './ui/button'
import { DialogTrigger } from './ui/dialog'
import { InOrbitIcon } from './in-orbit-icon'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-BR'
import { Progress, ProgressIndicator } from './ui/progress-bar'
import { Separator } from './ui/separator'
import { PendingGoals } from './pending-goals'
import { getSummary } from '../http/get-summary'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { UndoButton } from './undo-button'

dayjs.locale(ptBR)

export function WeeklySummary() {
  const { data, isLoading } = useQuery({
    queryKey: ['summary'],
    queryFn: getSummary,
  })

  if (isLoading || !data) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="text-zinc-500 animate-spin size-10" />
      </div>
    )
  }

  const summary = data.summary
  const queryClient = useQueryClient()
  const fromDate = dayjs().startOf('week').format('D[ de ]MMMM')
  const toDate = dayjs().endOf('week').format('D[ de ]MMMM')

  let completedPercentage: number

  if (!summary.total) {
    summary.total = 0
    completedPercentage = 0
  } else {
    completedPercentage = Math.round((summary.completed * 100) / summary.total)
  }

  return (
    <main className="py-10 max-w-[540px] px-5 mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <InOrbitIcon />
          <span className="text-lg font-semibold">
            {fromDate} - {toDate}
          </span>
        </div>
        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="size-4" />
            Cadastrar meta
          </Button>
        </DialogTrigger>
      </div>

      <div className="flex flex-col gap-3">
        <Progress max={summary.total} value={summary.completed}>
          <ProgressIndicator style={{ width: `${completedPercentage}%` }} />
        </Progress>

        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            Você completou{' '}
            <span className="text-zinc-100">{summary.completed}</span> de{' '}
            <span className="text-zinc-100">{summary.total}</span> metas nessa
            semana.
          </span>
          <span>{completedPercentage}%</span>
        </div>
      </div>

      <Separator />

      <PendingGoals />

      <div className="space-y-6">
        <h2 className="text-xl font-medium">Sua semana</h2>
        {!summary.goalsPerDay ||
        Object.keys(summary.goalsPerDay).length === 0 ? (
          <p className="text-zinc-400 text-sm leading-relaxed">
            Você ainda não completou nenhuma meta essa semana.
          </p>
        ) : (
          Object.entries(summary.goalsPerDay).map(([date, goals]) => {
            const weekDay = dayjs(date).format('dddd')
            const parsedDate = dayjs(date).format('D[ de ]MMMM')

            return (
              <div className="space-y-4" key={date}>
                <h3 className="font-medium">
                  <span className="capitalize">{weekDay}</span>{' '}
                  <span className="text-zinc-400 text-xs">({parsedDate})</span>
                </h3>

                <ul className="space-y-3">
                  {goals.map(goal => {
                    const parsedTime = dayjs(goal.createdAt).format('HH:mm[h]')

                    return (
                      <li className="flex items-center gap-2" key={goal.id}>
                        <CheckCircle2 className="size-4 text-pink-500" />
                        <span className="text-sm text-zinc-400">
                          Você completou "
                          <span className="text-zinc-100">{goal.title}</span>"
                          às <span className="text-zinc-100">{parsedTime}</span>
                        </span>
                        <UndoButton
                          goalId={goal.id}
                          onUndoSuccess={() => {
                            queryClient.invalidateQueries({
                              queryKey: ['summary'],
                            })
                            queryClient.invalidateQueries({
                              queryKey: ['pending-goals'],
                            })
                          }}
                        />
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })
        )}
      </div>
    </main>
  )
}
