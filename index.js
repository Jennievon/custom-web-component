class TaskScheduler extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = `
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
      <button id="addTaskBtn">Add Task</button>
    </div>
    <ul id="taskList"></ul>
  `;

    this.taskListElement = shadowRoot.getElementById("taskList");
    this.addTaskButton = shadowRoot.getElementById("addTaskBtn");

    this.addTaskButton.addEventListener("click", () => this.addTask());
  }

  connectedCallback() {
    console.log("Task Scheduler connected to the DOM!");
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

  addTask() {
    const taskNameInput = this.shadowRoot.getElementById("taskName");
    const taskDetailsInput = this.shadowRoot.getElementById("taskDetails");
    const taskDateTimeInput = this.shadowRoot.getElementById("taskDateTime");

    const taskName = taskNameInput.value.trim();
    const taskDetails = taskDetailsInput.value.trim();
    const taskDateTime = taskDateTimeInput.value;

    if (taskName && taskDateTime) {
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

      taskNameInput.value = "";
      taskDetailsInput.value = "";
      taskDateTimeInput.value = "";
    }
  }

  deleteTask(taskElement) {
    this.taskListElement.removeChild(taskElement);
  }
}

customElements.define("task-scheduler", TaskScheduler);
