"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Edit3, Save, X, Plus } from "lucide-react"

interface Todo {
  id: number
  text: string
  completed: boolean
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState("")

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      const newTask: Todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
      }
      setTodos([...todos, newTask])
      setNewTodo("")
    }
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const toggleComplete = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const startEditing = (id: number, text: string) => {
    setEditingId(id)
    setEditText(text)
  }

  const saveEdit = (id: number) => {
    if (editText.trim() !== "") {
      setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text: editText.trim() } : todo)))
    }
    setEditingId(null)
    setEditText("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText("")
  }

  const completedCount = todos.filter((todo) => todo.completed).length
  const totalCount = todos.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-900">My Todo List</h1>
            <p className="text-blue-600 mt-2">Stay organized and get things done</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Task
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter a new task..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addTodo()
                  }
                }}
                className="flex-1"
              />
              <Button onClick={addTodo} disabled={!newTodo.trim()}>
                Add Task
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        {totalCount > 0 && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center text-sm text-blue-600">
                <span>Total Tasks: {totalCount}</span>
                <span>Completed: {completedCount}</span>
                <span>Remaining: {totalCount - completedCount}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : "0%" }}
                ></div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Todo List */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {todos.length === 0 ? (
              <div className="text-center py-8 text-blue-500">
                <p className="text-lg">No tasks yet!</p>
                <p className="text-sm">Add your first task above to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      todo.completed ? "bg-green-50 border-green-200" : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Checkbox
                      id={`todo-${todo.id}`}
                      checked={todo.completed}
                      onCheckedChange={() => toggleComplete(todo.id)}
                    />

                    <div className="flex-1">
                      {editingId === todo.id ? (
                        <Input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              saveEdit(todo.id)
                            } else if (e.key === "Escape") {
                              cancelEdit()
                            }
                          }}
                          className="w-full"
                          autoFocus
                        />
                      ) : (
                        <label
                          htmlFor={`todo-${todo.id}`}
                          className={`cursor-pointer ${
                            todo.completed ? "line-through text-blue-500" : "text-blue-900"
                          }`}
                        >
                          {todo.text}
                        </label>
                      )}
                    </div>

                    <div className="flex gap-1">
                      {editingId === todo.id ? (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => saveEdit(todo.id)}
                            disabled={!editText.trim()}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={cancelEdit}>
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => startEditing(todo.id, todo.text)}>
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteTodo(todo.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center text-blue-600">
            <p className="text-sm">Built with React and Tailwind CSS • Stay productive and organized</p>
            <p className="text-xs mt-1">© 2024 Todo App. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
