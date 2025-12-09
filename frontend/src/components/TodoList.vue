<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface Todo {
  id: number
  title: string
  isCompleted: boolean
  isDeleted?: boolean
}

const todos = ref<Todo[]>([])
const newTodoTitle = ref('')
const activeTab = ref<'incomplete' | 'completed' | 'deleted'>('incomplete')
const API_URL = 'http://localhost:5000/todos' // Adjust port if necessary

const filteredTodos = computed(() => {
  if (activeTab.value === 'incomplete') {
    return todos.value.filter(t => !t.isCompleted && !t.isDeleted)
  } else if (activeTab.value === 'completed') {
    return todos.value.filter(t => t.isCompleted && !t.isDeleted)
  } else {
    return todos.value.filter(t => t.isDeleted)
  }
})

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
      const todo = todos.value.find(t => t.id === id)
      if (todo) {
        todo.isDeleted = true
      }
    }
  } catch (error) {
    console.error('Failed to delete todo:', error)
  }
}

const restoreTodo = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/${id}/restore`, {
      method: 'POST'
    })

    if (response.ok) {
      const todo = todos.value.find(t => t.id === id)
      if (todo) {
        todo.isDeleted = false
      }
    }
  } catch (error) {
    console.error('Failed to restore todo:', error)
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

    <div class="tabs">
      <button 
        :class="['tab-btn', { active: activeTab === 'incomplete' }]"
        @click="activeTab = 'incomplete'"
      >
        Incomplete
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'completed' }]"
        @click="activeTab = 'completed'"
      >
        Completed
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'deleted' }]"
        @click="activeTab = 'deleted'"
      >
        Deleted
      </button>
    </div>

    <ul class="todo-list">
      <li v-for="todo in filteredTodos" :key="todo.id" :class="{ completed: todo.isCompleted }">
        <div class="todo-item-content">
          <input 
            v-if="!todo.isDeleted"
            type="checkbox" 
            :checked="todo.isCompleted" 
            @change="toggleTodo(todo)"
            class="todo-checkbox"
          />
          <span @click="!todo.isDeleted && toggleTodo(todo)">{{ todo.title }}</span>
        </div>
        <button v-if="!todo.isDeleted" @click="deleteTodo(todo.id)" class="delete-btn">Delete</button>
        <button v-else @click="restoreTodo(todo.id)" class="restore-btn">Restore</button>
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

.restore-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.restore-btn:hover {
  background-color: #66bb6a;
}

.tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 2px solid #eee;
}

.tab-btn {
  flex: 1;
  padding: 12px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  border-radius: 0;
  cursor: pointer;
  font-size: 1rem;
  color: #666;
  transition: all 0.3s;
}

.tab-btn:hover {
  color: #8f76d6;
  background-color: rgba(143, 118, 214, 0.05);
}

.tab-btn.active {
  color: #8f76d6;
  border-bottom-color: #8f76d6;
  font-weight: bold;
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
  gap: 8px; /* Added gap back */
  justify-content: flex-start; /* Ensure content starts from left */
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
  text-align: left; /* Explicitly align text to left */
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
