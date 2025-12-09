<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Todo {
  id: number
  title: string
  isCompleted: boolean
  isDeleted?: boolean
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
      <button @click="addTodo" class="add-btn">Add</button>
    </div>

    <ul class="todo-list">
      <li v-for="todo in todos" :key="todo.id" :class="{ completed: todo.isCompleted }">
        <div class="todo-item-content">
          <input 
            type="checkbox" 
            :checked="todo.isCompleted" 
            @change="toggleTodo(todo)"
            class="todo-checkbox"
          />
          <span @click="toggleTodo(todo)">{{ todo.title }}</span>
        </div>
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
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #8f76d6;
  text-align: center;
  margin-bottom: 1.5rem;
}

.add-todo {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input {
  flex: 1;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #eee;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #ab8cff;
}

.add-btn {
  background-color: #8f76d6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.add-btn:hover {
  background-color: #ab8cff;
}

.todo-list {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

li:last-child {
  border-bottom: none;
}

li:hover {
  background-color: #fcfcfc;
}

.todo-item-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.todo-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #8f76d6;
}

li span {
  cursor: pointer;
  flex: 1;
  font-size: 1.1rem;
  transition: color 0.2s;
}

li.completed span {
  text-decoration: line-through;
  color: #aaa;
}

.delete-btn {
  background-color: transparent;
  color: #ff4444;
  border: 1px solid #ff4444;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.delete-btn:hover {
  background-color: #ff4444;
  color: white;
}
</style>
