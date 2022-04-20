"use strict";
const inputEl = document.querySelector(".task-name");
// variable
let datas = [];
let tabselected = "";
// Drag Effect
function onDragStart(event) {
  event.dataTransfer.setData("text/plain", event.currentTarget.id);
  event.currentTarget.style.opacity = "0.6";
}
function onDragEnd(event) {
  event.currentTarget.style.opacity = "1";
}
function onDragOver(event) {
  event.preventDefault();
}
function onDrop(event) {
  const id = event.dataTransfer.getData("text");
  const draggableElement = document.getElementById(id);
  const container = event.currentTarget;
  const newstatus = container.getAttribute("id");
  //   updating status of element droped
  updatestatus(newstatus, id);
  if (newstatus !== "completed") {
    draggableElement.querySelector("input").checked = false;
  } else {
    draggableElement.querySelector("input").checked = true;
  }
  const alltask = container.querySelectorAll(".task");
  //   drag individual list sorting
  const dropELementY = event.y;
  if (alltask.length >= 1) {
    for (let i = 0; i < alltask.length; i++) {
      const alltaskY1 =
        alltask[i].getBoundingClientRect().y +
        alltask[i].getBoundingClientRect().height / 2;
      const alltaskY2 =
        alltask[i].getBoundingClientRect().y +
        alltask[i].getBoundingClientRect().height;
      // check if dropELement Y is smaller then alltaskY1 (insert above)
      if (dropELementY <= alltaskY1) {
        alltask[i].parentNode.insertBefore(draggableElement, alltask[i]);
        break;
      }
      // check if dropElementY is smaller then alltaskY1(insert bellow)
      if (dropELementY <= alltaskY2) {
        alltask[i].parentNode.insertBefore(
          draggableElement,
          alltask[i].nextSibling
        );
        break;
      }
      container.appendChild(draggableElement);
    }
  } else {
    // no table yet
    container.appendChild(draggableElement);
  }
  displayNumberTask();
}
// create auto uid function
function newuid() {
  return `_${Math.trunc(Math.random() * 10000000)}`;
}

init();

// create a task
function createTaskEl(data) {
  {
    /* <div class="task" id="e_6" draggable="true" ondragstart="onDragStart(event);"
    ondragend="onDragEnd(event);">
    <div class="drag"></div>
    <input type="checkbox" name="" id="">
    <p contenteditable="true">TODO NOTES 1</p>
    <button class="close">
    close
    </button>
                        </div> */
  }
  let taskcontainer = document.createElement("div");
  taskcontainer.setAttribute("id", data.id);
  taskcontainer.className = "task";
  taskcontainer.setAttribute("draggable", "true");
  taskcontainer.setAttribute("ondragstart", "onDragStart(event);");
  taskcontainer.setAttribute("ondragEnd", "onDragEnd(event);");

  //   drag icon div
  let dragdiv = document.createElement("div");
  dragdiv.className = "drag";

  // input element  checkbox
  let inputEl = document.createElement("input");
  inputEl.type = "checkbox";
  inputEl.setAttribute("onclick", "onClick(event);");
  //   create p tag
  let pEl = document.createElement("p");
  pEl.textContent = data.task;
  pEl.setAttribute("contenteditable", "true");
  pEl.setAttribute("onkeydown", "onEditHandler(event);");
  //close btn
  let closeBtn = document.createElement("button");
  closeBtn.className = "close";
  closeBtn.textContent = "delete";
  closeBtn.setAttribute("onClick", "onDeleteHandler(event);");
  //   appending all
  taskcontainer.appendChild(dragdiv);
  taskcontainer.appendChild(inputEl);
  taskcontainer.appendChild(pEl);
  taskcontainer.appendChild(closeBtn);
  return taskcontainer;
}
function displayAll(tempdatas) {
  if (tempdatas.length !== 0) {
    tempdatas.forEach((tempdata) => {
      const el = createTaskEl(tempdata);
      if (tempdata.taskstatus === "completed") {
        el.querySelector("input").checked = true;
      }
      const id = tempdata.taskstatus;
      document.getElementById(id).appendChild(el);
    });
  }
}
function init() {
  const value = JSON.parse(localStorage.getItem("todo"));
  datas = value !== null ? value : [];
  const tabvalue = JSON.parse(localStorage.getItem("tab"));
  tabselected = tabvalue === null ? "all" : tabvalue;
  tabSetter(tabselected);
  displayAll(datas);
  displayNumberTask();
}

// number to display
function displayNumberTask() {
  const containers = document.querySelectorAll(".row");
  containers.forEach((container) => {
    const totalTask = container.querySelectorAll(".tasks .task").length;
    const taskstatus = container.querySelector(".task-status");
    taskstatus.textContent = `${totalTask} task`;
  });
}
// on click Event in checkbox
function onClick(event) {
  let temptaskstatus = "";
  if (event.currentTarget.checked) {
    const completedEl = document.getElementById("completed");
    temptaskstatus = "completed";
    completedEl.appendChild(event.currentTarget.parentElement);
  } else {
    const pendingEL = document.getElementById("pending");
    temptaskstatus = "pending";
    pendingEL.appendChild(event.currentTarget.parentElement);
  }
  displayNumberTask();
  const id = event.currentTarget.parentElement.getAttribute("id");
  //   updating local storage and present data status
  updatestatus(temptaskstatus, id);
}
// status and of current data
function updatestatus(taskstatus, id) {
  datas.forEach((data) => {
    if (data.id === id) {
      data.taskstatus = taskstatus;
    }
  });
  localStorage.removeItem("todo");

  localStorage.setItem("todo", JSON.stringify(datas));
}
// delete task
function onDeleteHandler(event) {
  const id = event.currentTarget.parentElement.getAttribute("id");
  const parent = event.currentTarget.parentElement.parentElement;
  parent.removeChild(event.currentTarget.parentElement);
  datas.forEach((data, index) => {
    if (data.id === id) {
      datas.splice(index, 1);
    }
  });
  displayNumberTask();
  localStorage.removeItem("todo");
  localStorage.setItem("todo", JSON.stringify(datas));
}
// edit handler
function onEditHandler(event) {
  if (event.currentTarget.textContent.length < 45) {
    let newtask = event.currentTarget.textContent;
    if (event.key === "Enter") {
      const id = event.currentTarget.parentElement.getAttribute("id");
      event.currentTarget.blur();
      // updating text
      datas.forEach((data) => {
        if (data.id === id) {
          data.task = newtask;
        }
      });
    }
  } else {
    event.currentTarget.blur();
  }
  localStorage.removeItem("todo");
  localStorage.setItem("todo", JSON.stringify(datas));
}

// on Submit
function onSubmitHandler(event) {
  event.preventDefault();
  const input = event.currentTarget.querySelector(".task-name");
  if (input.value.trim() !== "") {
    let newtaskdata = {
      id: newuid(),
      task: inputEl.value,
      taskstatus: "notstarted",
    };

    const el = createTaskEl(newtaskdata);
    const parent = document.getElementById("notstarted");
    parent.appendChild(el);
    datas.push(newtaskdata);
    localStorage.removeItem("todo");
    localStorage.setItem("todo", datas);
    input.value = "";
    input.blur();
    displayNumberTask();
  } else {
    alert("cannot enter empty task");
    input.value = "";
  }
}

function onTabHandler(event) {
  const tabs = document.querySelectorAll(".tab");
  //   removing selected
  tabs.forEach((tab) => {
    tab.classList.remove("selected");
    event.currentTarget.classList.add("selected");
  });
  const id = event.currentTarget.dataset.id;
  tabselected = id;
  localStorage.setItem("tab", JSON.stringify(tabselected));
  const taskscontainer = document.querySelectorAll(".row");
  const MainContainer = document.querySelector(".container");
  //   reset
  MainContainer.classList.add("grid-1");
  taskscontainer.forEach((tasks) => {
    tasks.classList.remove("hidden");
    tasks.querySelector(".tasks").style.height = "15rem";
  });
  if (tabselected !== "all") {
    taskscontainer.forEach((tasks) => {
      let taskid = tasks.classList.contains(tabselected);
      if (!taskid) {
        tasks.classList.add("hidden");
      } else {
        MainContainer.classList.add("grid-1");
        tasks.querySelector(".tasks").style.height = "95%";
      }
    });
  }
}
function tabSetter() {
  const tabs = document.querySelectorAll(".tab");
  const selectedtab = document.querySelector(`button[data-id=${tabselected}`);
  //   removing selected
  tabs.forEach((tab) => {
    tab.classList.remove("selected");
    selectedtab.classList.add("selected");
  });
  const taskscontainer = document.querySelectorAll(".row");
  const MainContainer = document.querySelector(".container");
  //   reset
  MainContainer.classList.add("grid-1");
  taskscontainer.forEach((tasks) => {
    tasks.classList.remove("hidden");
    tasks.querySelector(".tasks").style.height = "15rem";
  });
  if (tabselected !== "all") {
    taskscontainer.forEach((tasks) => {
      let taskid = tasks.classList.contains(tabselected);
      if (!taskid) {
        tasks.classList.add("hidden");
      } else {
        MainContainer.classList.add("grid-1");
        tasks.querySelector(".tasks").style.height = "95%";
      }
    });
  }
}
