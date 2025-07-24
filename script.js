const container = document.querySelector(".container");
const taskList = document.querySelector("#tasks");
const taskInput = document.querySelector("#taskInput");
const button = document.querySelector("#addTask");

const sound = new Audio('sound.mp3');

// Load tasks on startup
window.addEventListener("DOMContentLoaded", () => {
    const tasks = getTasksFromStorage();
    tasks.forEach(task => renderTask(task));
});

// Add task via button or Enter
button.addEventListener("click", addTask);
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
});

// Handle click events on task list
taskList.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
        const item = e.target;
        const id = item.dataset.id;

        item.classList.toggle("done");

        let tasks = getTasksFromStorage();
        tasks = tasks.map(task => {
            if(task.id === id){
                task.status = !task.status;
                if(task.status){sound.play()}
            }
            return task;
        });
        saveTaskToStorage(tasks);
    } 

    else if (e.target.classList.contains("deleteBtn")) {
        const item = e.target.parentElement;
        const id = item.dataset.id;

        let tasks = getTasksFromStorage();
        tasks = tasks.filter(task => task.id !== id);
        saveTaskToStorage(tasks);

        item.remove();
    }
});

function tooltip(text) {
    const tooltip = document.getElementById("tooltip");
    tooltip.textContent = text;
    tooltip.style.display = "block";
    tooltip.style.transform = "translateX(-50%) translateY(0px)";
    tooltip.style.opacity = "1";

    setTimeout(() => {
        tooltip.style.transform = "translateX(-50%) translateY(-40px)";
        tooltip.style.opacity = 0;
    }, 2000);
}

function getTasksFromStorage() {
    return JSON.parse(localStorage.getItem("tasks") || "[]");
}

function saveTaskToStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function generateID() {
    return Date.now().toString();
}

function renderTask(task) {
    const item = document.createElement("li");
    item.textContent = task.text;
    item.dataset.id = task.id;

    if(task.status){
        item.classList.add("done");
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "deleteBtn";
    deleteBtn.textContent = "❌";

    item.appendChild(deleteBtn);
    taskList.appendChild(item);
}

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText !== "") {
        const newTask = {
            id: generateID(),
            text: taskText,
            status: false
        };

        const tasks = getTasksFromStorage();
        tasks.push(newTask);
        saveTaskToStorage(tasks);

        renderTask(newTask);
        taskInput.value = "";
    } else {
        tooltip("Task cannot be empty");
    }
}
