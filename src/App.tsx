import { useEffect, useReducer, useState } from 'react'

type Todo = { id: string; text: string; completed: boolean }
type Filter = 'all' | 'active' | 'completed'
type Action =
  | { type: 'ADD_TODO'; text: string }
  | { type: 'TOGGLE_TODO'; id: string }
  | { type: 'DELETE_TODO'; id: string }
  | { type: 'SET_FILTER'; filter: Filter }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'LOAD_TODOS'; todos: Todo[] }

const initialState = { todos: [] as Todo[], filter: 'all' as Filter }

function reducer(state: typeof initialState, action: Action) {
  switch (action.type) {
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, { id: Date.now().toString(), text: action.text, completed: false }] }
    case 'TOGGLE_TODO':
      return { ...state, todos: state.todos.map(t => t.id === action.id ? { ...t, completed: !t.completed } : t) }
    case 'DELETE_TODO':
      return { ...state, todos: state.todos.filter(t => t.id !== action.id) }
    case 'SET_FILTER':
      return { ...state, filter: action.filter }
    case 'CLEAR_COMPLETED':
      return { ...state, todos: state.todos.filter(t => !t.completed) }
    case 'LOAD_TODOS':
      return { ...state, todos: action.todos }
    default: return state
  }
}

const todoStyle: React.CSSProperties = { cursor: 'pointer', margin: '8px 0', display: 'flex', alignItems: 'center' }
const completedStyle: React.CSSProperties = { textDecoration: 'line-through', color: '#888' }
const btnStyle: React.CSSProperties = { margin: '0 4px', padding: '4px 12px', cursor: 'pointer', border: '1px solid #ccc', background: '#f0f0f0' }
const activeBtnStyle: React.CSSProperties = { ...btnStyle, fontWeight: 'bold', textDecoration: 'underline', background: '#e0e0e0' }

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [input, setInput] = useState('')

  useEffect(() => {
    try {
      const stored = localStorage.getItem('todos')
      const todos = stored ? JSON.parse(stored) : []
      if (Array.isArray(todos)) dispatch({ type: 'LOAD_TODOS', todos })
    } catch {}
  }, [])

  useEffect(() => { localStorage.setItem('todos', JSON.stringify(state.todos)) }, [state.todos])

  const addTodo = () => {
    const text = input.trim()
    if (!text) return
    dispatch({ type: 'ADD_TODO', text })
    setInput('')
  }

  const handleTodoKey = (todo: Todo) => (e: React.KeyboardEvent) => {
    if (e.key === ' ') { e.preventDefault(); dispatch({ type: 'TOGGLE_TODO', id: todo.id }) }
    if (e.key === 'Delete' || e.key === 'Backspace') dispatch({ type: 'DELETE_TODO', id: todo.id })
  }

  const filtered = state.todos.filter(t => state.filter === 'active' ? !t.completed : state.filter === 'completed' ? t.completed : true)
  const hasCompleted = state.todos.some(t => t.completed)

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1>Single File Todo</h1>
      <div>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTodo()} placeholder="Add a todo..." style={{ padding: 8, marginRight: 8 }} />
        <button onClick={addTodo} style={btnStyle}>Add</button>
      </div>
      <div style={{ margin: '16px 0' }}>
        {(['all', 'active', 'completed'] as Filter[]).map(f => (
          <button key={f} onClick={() => dispatch({ type: 'SET_FILTER', filter: f })} style={state.filter === f ? activeBtnStyle : btnStyle}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      {hasCompleted && <button onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })} style={{ ...btnStyle, marginBottom: 16 }}>Clear Completed</button>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filtered.map(t => (
          <li key={t.id} style={todoStyle} tabIndex={0} onKeyDown={handleTodoKey(t)}>
            <span onClick={() => dispatch({ type: 'TOGGLE_TODO', id: t.id })} style={t.completed ? completedStyle : {}}>{t.text}</span>
            <span style={{ marginLeft: 8, cursor: 'pointer', ...btnStyle }} onClick={() => dispatch({ type: 'DELETE_TODO', id: t.id })} tabIndex={0}>×</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
