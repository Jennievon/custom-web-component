import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getFirestore,
  addDoc,
  getDocs,
  collection,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

// this is a sample firebase config for demo purposes
const firebaseConfig = {
  apiKey: "AIzaSyBQHYXl8qzDRZtVAnDsZq-a-H8TVI-cNF0",
  authDomain: "custom-web-components.firebaseapp.com",
  projectId: "custom-web-components",
  storageBucket: "custom-web-components.appspot.com",
  messagingSenderId: "205835229602",
  appId: "1:205835229602:web:bb6b738a36f11b84b17afb",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
class TaskScheduler extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    this.render();
    this.addTaskButton = this.shadowRoot.getElementById("addTaskBtn");
    this.taskListElement = this.shadowRoot.getElementById("taskList");
    this.addTaskButton.addEventListener("click", () => this.handleAddTask());
  }

  connectedCallback() {
    console.log("Task Scheduler connected to the DOM!");
    this.fetchAndDisplayTasks();
  }

  disconnectedCallback() {
    console.log("Task Scheduler disconnected from the DOM!");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "title") {
      this.shadowRoot.querySelector("h2").textContent = newValue;
    }
  }

  static get observedAttributes() {
    return ["title"];
  }

  render() {
    this.shadowRoot.innerHTML = `
    <style>
      :host {
        display: block;
        font-family: Arial, sans-serif;
      }
      h2 {
        text-align: center;
        margin-bottom: 20px;
        color: #333;
      }
      div {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }
      input,
      textarea,
      button {
        margin: 5px;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
      input[type="datetime-local"] {
        width: 230px;
      }
      button {
        background-color: #007bff;
        color: #fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      ul {
        list-style: none;
        padding: 0;
        max-width: 400px;
        margin: 0 auto;
      }
      li {
        background-color: #f9f9f9;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 10px;
        margin: 10px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      li .delete-btn {
        background-color: #dc3545;
        color: #fff;
        border: none;
        padding: 4px 8px;
        cursor: pointer;
      }
      li .delete-btn:hover {
        background-color: #c82333;
      }
    </style>
    <h2>Task Scheduler</h2>
    <div>
      <input type="text" placeholder="Task Name" id="taskName" />
      <textarea placeholder="Task Details" id="taskDetails"></textarea>
      <input type="datetime-local" id="taskDateTime" />
      <button id="addTaskBtn" class="material-icons">add</button>
    </div>
    <ul id="taskList"></ul>
    `;
  }

  async fetchAndDisplayTasks() {
    try {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      querySnapshot.forEach((doc) => {
        const taskData = doc.data();
        this.displayTask(taskData);
      });
    } catch (error) {
      console.error("Error fetching tasks: ", error);
      alert("Error fetching tasks!");
    }
  }

  displayTask(taskData) {
    const taskElement = document.createElement("li");
    taskElement.innerHTML = `
      <strong>${taskData.taskName}</strong> - ${taskData.taskDetails} (${taskData.taskDateTime})
      <button class="delete-btn">Delete</button>
    `;
    const deleteButton = taskElement.querySelector(".delete-btn");
    deleteButton.addEventListener("click", () => this.deleteTask(taskElement));
    this.taskListElement.appendChild(taskElement);
  }

  getInputValue(id) {
    return this.shadowRoot.getElementById(id).value;
  }

  async handleAddTask() {
    const taskName = this.getInputValue("taskName").trim();
    const taskDetails = this.getInputValue("taskDetails").trim();
    const taskDateTime = this.getInputValue("taskDateTime");

    if (taskName && taskDateTime) {
      const addTaskEvent = new CustomEvent("addTask", {
        bubbles: true,
        composed: true,
        detail: {
          taskName,
          taskDetails,
          taskDateTime,
        },
      });

      this.dispatchEvent(addTaskEvent);

      const taskElement = document.createElement("li");
      taskElement.innerHTML = `
        <strong>${taskName}</strong> - ${taskDetails} (${taskDateTime})
        <button class="delete-btn">Delete</button>
      `;
      const deleteButton = taskElement.querySelector(".delete-btn");
      deleteButton.addEventListener("click", () =>
        this.deleteTask(taskElement)
      );
      this.taskListElement.appendChild(taskElement);

      try {
        await addDoc(collection(db, "tasks"), {
          taskName,
          taskDetails,
          taskDateTime,
        });
        this.clearInputFields();
        console.log("Task added to Firestore!");
      } catch (error) {
        console.error("Error adding task: ", error);
        alert("Error adding task!");
      }
    }
  }

  clearInputFields() {
    this.shadowRoot.getElementById("taskName").value = "";
    this.shadowRoot.getElementById("taskDetails").value = "";
    this.shadowRoot.getElementById("taskDateTime").value = "";
  }

  deleteTask(taskElement) {
    this.taskListElement.removeChild(taskElement);
  }
}

customElements.define("task-scheduler", TaskScheduler);
