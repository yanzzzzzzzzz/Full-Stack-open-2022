import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import {getAnecdotes, updateAnecdote, createAnecdote} from './components/request'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useReducer } from 'react'


const NotificationReducer = (state, action) => {
  switch (action.type){
    case "AddNotification":
      return action.content
    case "RemoveNotification":
      return ''
  }
}

const App = () => {
  const [notification, notificationDispatcher] = useReducer(NotificationReducer, '')
  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries('anecdote')
    },
    onError:(error)=>{
      newNotification(error.response.data.error)
    }
  })
  const addAnecdote = (content) => {
    newAnecdoteMutation.mutate({content, votes:0})
  }

  const updateAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries('anecdote')
    }
  })
  const newNotification = (content) =>{
    notificationDispatcher({type:'AddNotification', content:content})
    setTimeout(()=>{
      notificationDispatcher({type:'RemoveNotification'})
    }, 5000)
  }
  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes+1})
    newNotification(`${anecdote.content} voted`)
  }
  const result = useQuery('anecdote', getAnecdotes, {
    refetchOnWindowFocus: false
  })
  if (result.isLoading) {
    return <div>loading data...</div>
  }
  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification content={notification}/>
      <AnecdoteForm createAnecdote={addAnecdote}/>
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
