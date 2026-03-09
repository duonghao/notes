import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import Notes from '../components/notes'

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => {
    return 1
  },
})

function Home() {
  const router = useRouter()
  const initialCount = Route.useLoaderData()
  const [counter, setCounter] = useState(initialCount)

  return <Notes />
}
