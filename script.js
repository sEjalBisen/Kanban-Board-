// Drag and Drop
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  const dragged = document.getElementById(data);
  const targetContainer = ev.target.closest(".column").querySelector(".task-container");
  targetContainer.appendChild(dragged);
  saveTasks();
}

// Add task
function addTask(columnId) {
  const column = document.getElementById(columnId);
  const input = column.querySelector(".task-input");
  const taskText = input.value.trim();
  if (taskText === "") return;

  const task = createTaskElement(taskText);
  column.querySelector(".task-container").appendChild(task);
  input.value = "";
  saveTasks();
}

// Create task element with edit & delete
function createTaskElement(text) {
  const task = document.createElement("div");
  task.className = "task";
  task.textContent = text;
  task.setAttribute("draggable", "true");
  task.id = "task-" + Math.floor(Math.random() * 10000);
  task.ondragstart = drag;

  const actions = document.createElement("span");
  actions.innerHTML = `
    <button onclick="editTask(this)">✏</button>
    <button onclick="deleteTask(this)">❌</button>
  `;
  task.appendChild(actions);
  return task;
}

// Delete task
function deleteTask(btn) {
  const task = btn.parentElement.parentElement;
  task.remove();
  saveTasks();
}

// Edit task
function editTask(btn) {
  const task = btn.parentElement.parentElement;
  const newText = prompt("Edit Task", task.firstChild.textContent.trim());
  if (newText !== null) {
    task.firstChild.textContent = newText;
    saveTasks();
  }
}

// Save tasks to localStorage
function saveTasks() {
  const columns = document.querySelectorAll(".column");
  const data = {};
  columns.forEach(col => {
    const id = col.id;
    const tasks = Array.from(col.querySelectorAll(".task")).map(task =>
      task.firstChild.textContent.trim()
    );
    data[id] = tasks;
  });
  localStorage.setItem("kanbanTasks", JSON.stringify(data));
}

// Load tasks
function loadTasks() {
  const data = JSON.parse(localStorage.getItem("kanbanTasks")) || {};
  for (let columnId in data) {
    const column = document.getElementById(columnId);
    const container = column.querySelector(".task-container");
    data[columnId].forEach(text => {
      const task = createTaskElement(text);
      container.appendChild(task);
    });
  }
}

// Load when page starts
window.onload = loadTasks;