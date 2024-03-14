const state = {
  taskList: [],
};

const taskContents = document.querySelector(".t_c");
const taskModal = document.querySelector(".t_m_b");

const htmltc = ({ id, title, description, type, url }) => `
    <div class="col-md-6 col-lg-4 mt-3" id=${id} key=${id}>
        <div class="card shadow-sm task__card">
            <div class="card-header d-flex justify-content-end task__card__header">
                <button type="button" class="btn btn-outline-info mr-2" name=${id} onclick='eT.apply(this, arguments)'>
                    <i class="fas fa-pencil-alt" name=${id}></i>
                </button>
                  <button type="button" class="btn btn-outline-danger mr-2" name=${id} onclick='dT.apply(this, arguments)'>
                    <i class="fas fa-trash-alt" name=${id}></i>
                </button>
            </div>
            <div class="card-body">
            ${
               url ? `<img width="100%" src=${url} alt="card image cap" class="img-fluid md-3 rounded-lg"/>` :
                `<img width="100%" src="https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg"/>`
            }
            <h4 class="card-title">${title}</h4>
            <p class="card-title trim-3-lines text-muted">${description}</p>
            <div class="tags text-white d-flex flex-wrap">
                <span class="badge bg-primary m-1">
                    ${type}
                </span>
            </div>
            </div>
            <div class="card-footer">
                <button type="button" class="btn btn-outline-primary float-right" data-bs-toggle="modal" data-bs-target="#showTask" id=${id} onclick='ot.apply(this, arguments)'>
                    Open Task
                </button>
            </div>
        </div>
    </div>
`;
const htmlMc = ({ id, title, description, url }) => {
  const date = new Date(parseInt(id));
  return `
    <div id=${id}>
     ${
        url ? `<img width="100%" src=${url} alt="card image cap" class="img-fluid md-3 rounded-lg"/>` :
                `<img width="100%" src="https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg"/>`
     }
            <strong class="text-sm text-muted">Created on ${date.toDateString()}</strong>
            <h2 class="my-3">${title}</h2>
            <p class="lead">${description}</p>
    </div>
    `;
};
const updateLs = () => {
  localStorage.setItem(
    "task",
    JSON.stringify({
      tasks: state.taskList,
    })
  );
};
const loadid = () => {
  const localStorageCopy = JSON.parse(localStorage.task);
  if (localStorageCopy) state.taskList = localStorageCopy.tasks;
  state.taskList.map((cardDate) => {
    taskContents.insertAdjacentHTML("beforeend", htmltc(cardDate));
  });
};

const hs = () => {
  const id = `${Date.now()}`;
  const input = {
    url: document.getElementById("iUrl").value,
    title: document.getElementById("tT").value,
    description: document.getElementById("tD").value,
    type: document.getElementById("tags").value,
  };
  taskContents.insertAdjacentHTML(
    "beforeend",
    htmlMc({
      ...input,
      id,
    })
  );
  state.taskList.push({ ...input, id });
  updateLs();
};
 
const ot = (e) => {
  if (!e) e = window.event;
  const getTask = state.taskList.find(({ id }) => id == e.target.id);
    taskModal.innerHTML = htmlMc(getTask);
    
};

const dT = (e) => {
  if (!e) e = window.event;
  const targetId = e.target.getAttribute("name");
  const type = e.target.tagName;
  const removeTask = state.taskList.filter(({ id }) => id !== targetId);
  state.taskList = removeTask;
  

 updateLs();

  if (type === "BUTTON") {
    console.log(e.target.parentNode.parentNode.parentNode);
    return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode.parentNode
    );
  }
  return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
    e.target.parentNode.parentNode.parentNode.parentNode
  );
};


const eT = (e) => {
  if (!e) e = window.event;
  const targetId = e.target.id;
  const type = e.target.tagName;
  let parentNode;
  let taskTitle;
  let taskDescription;
  let tags;
  let submitButton;
  if (type === "BUTTON") {
    parentNode = e.target.parentNode.parentNode;
  } else {
    parentNode = e.target.parentNode.parentNode.parentNode;
  }
  taskTitle = parentNode.childNodes[3].childNodes[3];
  taskDescription = parentNode.childNodes[3].childNodes[5];
  tags = parentNode.childNodes[3].childNodes[7].childNodes[1];
  submitButton = parentNode.childNodes[5].childNodes[1];
  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
    tags.setAttribute("contenteditable", "true");
    
  submitButton.setAttribute("onclick", "sE.apply(this, arguments)");
  submitButton.removeAttribute("data-bs-toggle");
  submitButton.removeAttribute("data-bs-target");
  submitButton.innerHTML = "Save Changes";
};
 
const sE = (e) => {
  if (!e) e = window.event;

    const targetId = e.target.id;
    const parentNode = e.target.parentNode.parentNode
    const taskTitle = parentNode.childNodes[3].childNodes[3];
    const taskDescription = parentNode.childNodes[3].childNodes[5];
    const tags = parentNode.childNodes[3].childNodes[7].childNodes[1];
    const submitButton = parentNode.childNodes[5].childNodes[1];
    const uD = {
        taskTitle: taskTitle.innerHTML,
        taskDescription: taskDescription.innerHTML,
        tags:tags.innerHTML

    }
    let sCopy = state.taskList
    sCopy = sCopy.map((task) =>
      task.id === targetId
        ? {
             id: task.id,
             title: uD.taskTitle,
             description: uD.taskDescription,
                tags: uD.tags,
             url:task.url
          }
        : task
    );
    state.taskList = sCopy;
    updateLs()
 taskTitle.setAttribute("contenteditable", "false");
 taskDescription.setAttribute("contenteditable", "false");
    tags.setAttribute("contenteditable", "false");

    submitButton.setAttribute("onclick", "ot.apply(this, arguments)");
    submitButton.setAttribute("data-bs-toggle","modal");
    submitButton.setAttribute("data-bs-target", "#showTask");
    submitButton.innerHTML = "Open Task";
    
};

const searchTask = (e) => {
    if (!e) e = window.event;
    while (taskContents.firstChild) {
        taskContents.removeChild(taskContents.firstChild)
    }

    const resultData = state.taskList.filter(({ title }) =>
         title.includes(e.target.value)
    );
    console.log(resultData);
    resultData.map((cardDate) => {
        taskContents.insertAdjacentHTML("beforeend", htmltc(cardDate));
    })
}