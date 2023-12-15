
const taskInput = document.querySelector("#input");
const buttonAdd = document.querySelector("#buttonAdd");
const buttonClearAll = document.querySelector("#buttonClearAll");
const buttonClearDone = document.querySelector("#buttonClearDone");
const taskList = document.querySelector("#tasks");
const completed = document.querySelector("#completed");
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

/*Создание новых задач*/
class Task {
    constructor(taskText, done = false) {
        this.taskText = taskText;
        this.done = done;
        this.printTask();
    }


    printTask() {
        const newTaskItem = document.createElement("label");
        newTaskItem.classList.add("task");
        const taskTemplate = `<p>${this.taskText}</p>
		<input type="checkbox" name="task-checkbox"  ${this.done ? "checked" : ""} class="checkbox"/>`;
        newTaskItem.insertAdjacentHTML('beforeend', taskTemplate);
        const checkbox = newTaskItem.querySelector(".checkbox");
        checkbox.addEventListener("change", () => {
            this.done = checkbox.checked;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            enableButtonClearDone();
        });
        taskList.appendChild(newTaskItem);
        taskInput.value = "";
    }

}


/*Вывод задач*/
const getTasks = function() {
	for (let task of tasks) {
		const newTask = new Task(task.taskText, task.done);
		const newTaskItem = taskList.lastChild;
	}
	applyCheckboxes();
	enableButtonClearAll();
	enableButtonClearDone();
};

/*Активирование\дезактивирование кнопки*/
const enableButtonClearAll = function() {
	if (tasks.length !== 0) {
		buttonClearAll.disabled = false;
		completed.style.display = "none";
	} else {
		buttonClearAll.disabled = true;
		completed.style.display = "block";
	}
};

/*Удаление всего*/
const clearAll = function() {
	let tasksOnPage = taskList.querySelectorAll(".task");
	tasksOnPage.forEach(task => task.remove());
	tasks.length = 0;
	window.localStorage.removeItem("tasks")
	enableButtonClearAll();
}

/*удаление задач*/
buttonClearAll.addEventListener("click", clearAll);

/* проверяет ввод и добавляет новую задачу */
const addTask = function() {
	let taskText = taskInput.value.trim();
	if (taskText === "") {
		taskInput.classList.add("error");
		return;
	} else {
		taskText = taskInput.value.trim();
		let newTask = new Task(taskText);
		tasks.push(newTask);
		localStorage.setItem("tasks", JSON.stringify(tasks));
		enableButtonClearAll();
	}
};


buttonAdd.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(event) {
	if (event.key === "Enter") {
    buttonAdd.click();
	}
});



/* включение и выключение кнопки */
function enableButtonClearDone() {
	const checkboxes = document.querySelectorAll(".checkbox");
	for (const checkbox of checkboxes) {
	if (checkbox.checked) {
		buttonClearDone.disabled = false;
		return;
	} else {buttonClearDone.disabled = true;}
	}
	if (tasks.length == 0) {buttonClearDone.disabled = true;}
}

/* удаляет выполненные задачи */
function clearDoneTasks() {
	const checkboxes = document.querySelectorAll(".checkbox");
	for (const checkbox of checkboxes) {
	if (checkbox.checked) {
		const taskItem = checkbox.closest(".task");
		const index = tasks.findIndex(task => task.taskText === taskItem.textContent.trim());
		if (index !== -1) {
		tasks.splice(index, 1);
		taskItem.remove();
		}
	}
	}
	localStorage.setItem("tasks", JSON.stringify(tasks));
	enableButtonClearAll();
	enableButtonClearDone();
}


buttonClearDone.addEventListener("click", clearDoneTasks);

/* проверка, есть ли сохраненные задачи и выводит имеющиеся либо очищает все*/
window.onload = function() {
    if (tasks.length !== 0) {
		getTasks()
	} else {
		clearAll()
	}
}

function applyCheckboxes() {
const checkboxes = document.querySelectorAll(".checkbox");
	for (const checkbox of checkboxes) {
		checkbox.addEventListener("change", () => {
			const taskItem = checkbox.closest(".task");
			const index = tasks.findIndex(task => task.taskText === taskItem.textContent.trim());
			tasks[index].done = checkbox.checked;
			localStorage.setItem("tasks", JSON.stringify(tasks));
			enableButtonClearDone();
		});
	}
}