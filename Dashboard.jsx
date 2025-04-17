import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [showApp, setShowApp] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [darkMode, setDarkMode] = useState(false);
  const [sortOption, setSortOption] = useState("date");

  // Load tasks from local storage
  useEffect(() => {
    if (user) {
      const storedTasks = JSON.parse(localStorage.getItem(`tasks_${user.uid}`)) || [];
      setTasks(storedTasks);
    }
  }, [user]);

  // Save tasks to local storage whenever tasks update
  useEffect(() => {
    if (user) {
      localStorage.setItem(`tasks_${user.uid}`, JSON.stringify(tasks));
    }
  }, [tasks, user]);

  // Due Date Reminder Notifications
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; 
    tasks.forEach((task) => {
      if (task.dueDate === today) {
        alert(`🔔 Reminder: Task "${task.text}" is due today!`);
      }
    });
  }, [tasks]);

  // Add New Task
  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim() || !newCategory.trim() || !newDueDate.trim()) return;
    const task = {
      id: Date.now(),
      text: newTask,
      category: newCategory,
      dueDate: newDueDate,
      priority,
      completed: false,
    };
    setTasks([...tasks, task]);
    setNewTask("");
    setNewCategory("");
    setNewDueDate("");
    setPriority("Medium");
  };

  // Toggle Task Completion
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Edit Task
  const editTask = (id) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    if (!taskToEdit) return;

    const updatedText = prompt("Edit task:", taskToEdit.text);
    const updatedCategory = prompt("Edit category (Work, Personal, etc.):", taskToEdit.category);
    const updatedDueDate = prompt("Edit due date (YYYY-MM-DD):", taskToEdit.dueDate);
    const updatedPriority = prompt("Set priority (Low, Medium, High):", taskToEdit.priority);

    if (updatedText && updatedCategory && updatedDueDate && updatedPriority) {
      setTasks(
        tasks.map((task) =>
          task.id === id
            ? { ...task, text: updatedText, category: updatedCategory, dueDate: updatedDueDate, priority: updatedPriority }
            : task
        )
      );
    }
  };

  // Delete Task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Sort Tasks by Due Date or Priority
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortOption === "date") {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortOption === "priority") {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return 0;
  });

  return (
    <div className={`dashboard-container ${darkMode ? "dark-mode" : ""}`}>
      {!showApp ? (
        // Welcome Screen with Continue Button
        <div>
          <h1>👋 Welcome, {user?.username || "Guest"}</h1>
          <p>Ready to manage your tasks? Click continue below.</p>
          <button className="continue-btn" onClick={() => setShowApp(true)}>
            Continue
          </button>
        </div>
      ) : (
        <div className="todo-app">
          <header className="todo-header">
            <h1>{user?.username}'s To-Do List</h1>
            <button className="secondary-btn" onClick={logout}>
              Logout
            </button>
            <button className="toggle-mode" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
            </button>
          </header>

          <form onSubmit={addTask} className="task-form">
            <input type="text" placeholder="Enter a new task..." value={newTask} onChange={(e) => setNewTask(e.target.value)} />
            <input type="text" placeholder="Enter category (Work, Personal, etc.)" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
            <input type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} />
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="Low">Low 🔵</option>
              <option value="Medium">Medium 🟡</option>
              <option value="High">High 🔥</option>
            </select>
            <button className="primary-btn" type="submit">Add Task</button>
          </form>

          {/* Sort Tasks */}
          <div className="sort-options">
            <label>Sort By:</label>
            <button onClick={() => setSortOption("date")}>📅 Due Date</button>
            <button onClick={() => setSortOption("priority")}>🔥 Priority</button>
          </div>

          {/* Task List */}
          <ul className="task-list">
            {sortedTasks.length === 0 ? (
              <p className="no-task">No tasks yet. Start adding some!</p>
            ) : (
              sortedTasks.map((task) => (
                <li key={task.id} className={`task-item ${task.completed ? "completed" : ""} priority-${task.priority.toLowerCase()}`}>
                  <div onClick={() => toggleTask(task.id)} className="task-info">
                    <h3>{task.text}</h3>
                    <p>
                      📌 {task.category} | 📅 Due: {task.dueDate} | ⚡ {task.priority}
                    </p>
                  </div>
                  <button className="delete-btn" onClick={() => deleteTask(task.id)}>❌</button>
                  <button onClick={() => editTask(task.id)}>✏️ Edit</button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
