export async function undoGoalCompletion(goalId: string) {
  try {
    const response = await fetch(
      `http://localhost:3333/completions/${goalId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    const response_data = await response.json()

    if (!response.ok || response_data.status === 'Error') {
      throw new Error('Failed to undo goal completion')
    }
  } catch (error) {
    console.error('Failed to undo goal completion:', error)
  }
}
