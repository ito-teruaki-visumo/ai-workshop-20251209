<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Todo {
  id: number
  title: string
  isCompleted: boolean
}

const todos = ref<Todo[]>([])
const newTodoTitle = ref('')
const API_URL = 'http://localhost:5000/todos' // Adjust port if necessary

const fetchTodos = async () => {
  try {
    const response = await fetch(API_URL)
    if (response.ok) {
      todos.value = await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch todos:', error)
  }
}

const addTodo = async () => {
  if (!newTodoTitle.value.trim()) return

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: newTodoTitle.value, isCompleted: false })
    })

    if (response.ok) {
      const todo = await response.json()
      todos.value.push(todo)
      newTodoTitle.value = ''
    }
  } catch (error) {
    console.error('Failed to add todo:', error)
  }
}

const toggleTodo = async (todo: Todo) => {
  try {
    const response = await fetch(`${API_URL}/${todo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...todo, isCompleted: !todo.isCompleted })
    })

    if (response.ok) {
      todo.isCompleted = !todo.isCompleted
    }
  } catch (error) {
    console.error('Failed to update todo:', error)
  }
}

const deleteTodo = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      todos.value = todos.value.filter(t => t.id !== id)
    }
  } catch (error) {
    console.error('Failed to delete todo:', error)
  }
}

onMounted(fetchTodos)
</script>

<template>
  <div class="todo-container">
    <h1>Todo List</h1>
    
    <div class="add-todo">
      <input 
        v-model="newTodoTitle" 
        @keyup.enter="addTodo"
        placeholder="Add a new task..."
      />
      <button @click="addTodo">Add</button>
    </div>

    <ul class="todo-list">
      <li v-for="todo in todos" :key="todo.id" :class="{ completed: todo.isCompleted }">
        <span @click="toggleTodo(todo)">{{ todo.title }}</span>
        <button @click="deleteTodo(todo.id)" class="delete-btn">Delete</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.todo-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.add-todo {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input {
  flex: 1;
  padding: 8px;
  font-size: 16px;
}

.todo-list {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

li span {
  cursor: pointer;
  flex: 1;
}

li.completed span {
  text-decoration: line-through;
  color: #888;
}

.delete-btn {
  background-color: #ff4444;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #cc0000;
}
</style>
