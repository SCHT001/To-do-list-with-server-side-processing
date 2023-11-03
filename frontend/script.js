
const confirmDeleteModel=document.getElementById('deleteConfirmModel');
const confirmDeleteBtn=document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn=document.getElementById('cancelDeleteBtn');
const state = {
    tasks: [],
    weekDay: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']
}
var addBtn = document.getElementById('addBtn');
var taskList = document.getElementById('taskLists');
var inputContainer = document.getElementById("inputContainer");
addBtn.addEventListener('click', () => {
    inputContainer.style.display = "flex";
    inputContainer.style.top = "0vh";
});
document.getElementById('cancelBtn').addEventListener('click', () => {
    inputContainer.style.top = '-100vh';
    clearInput();
})
document.getElementById('createBtn').addEventListener('click', addTask);
function clearInput() {
    var title = document.getElementById('titleText');
    var des = document.getElementById('desText');
    title.value = '';
    des.value = '';
}

function addTask() {
    var currdate = new Date;
    var mins = currdate.getMinutes();
    var hrs = currdate.getHours();
    var week = currdate.getDay();
    var title = document.getElementById('titleText').value;
    var des = document.getElementById('desText').value;

    const addPromise = new Promise((resolve, reject) => {
        if (title != '' || des != '') {
            resolve();
        }
        else {
            reject();
        }
    });

    addPromise.then(() => {
        var newObj =
        {
            id: (Date.now()%10000),
            hours: hrs,
            minutes: mins,
            head: title,
            description: des,
            weekDay: week,
            status: 0
        }
        newTaskToServer(newObj);
        state.tasks.push(newObj);
        inputContainer.style.top = '-100vh';
        localStorage.setItem('task', JSON.stringify(state.tasks));
        // getFromLocalStorage();
        displayTask();
        clearInput();
        notify("Task Added");
    },
        () => {
            notify("Fill in all the boxes");
        });


}
function clearInput() {
    document.getElementById('titleText').value = '';
    document.getElementById('desText').value = '';
}
function deleteItem(id) {
    const index = state.tasks.findIndex((item) => {
        return item.id === id;
    });
    state.tasks.splice(index, 1);
    localStorage.setItem('task', JSON.stringify(state.tasks));
    getFromLocalStorage();
    displayTask();
    confirmDeleteModel.style.top='-100vh';
    notify("Task Deleted");
}
function completeTask(id) {

    const index = state.tasks.findIndex((item) => {
        return item.id === id;
    });
    state.tasks[index].status = 1;
    localStorage.setItem('task', JSON.stringify(state.tasks));
    getFromLocalStorage();
    displayTask();

}
function getFromLocalStorage() {
    const tasks = localStorage.getItem('task');
    state.tasks = tasks ? JSON.parse(tasks) : [];

}
function displayTask() {
    const container = document.getElementById('taskLists');
    container.innerHTML = '';
    if (state.tasks.length > 0) {
        state.tasks.forEach((task) => {
            const div = document.createElement('div');
            div.classList.add('divS');
            div.innerHTML = (`<div class="listItem" style="background-color: transparent;" >
            <div class='sideDate'>
            <span class='weekDay'>${state.weekDay[task.week]}</span>
            <span class='time'>${task.hours}:${task.minutes}</span> </div>
            <div class='mainSide'>
            <span class='titleSpan'>${task.title}</span>
            <span class='desSpan'>${task.description}</span>
            </div>
            <div class="sideBtn">
            <button class='roundedBtn completedBtn' onclick="completeTask(${task.id}, this)">Completed</button>
            <button class='roundedBtn deleteBtn' onclick="confirmDelete(${task.id})" >Delete</button>
            <button class='roundedBtn editBtn' onclick="editItem(${task.id})">Edit</button>
            </div>
            </div>`)
            if (task.status == 1) {
                div.style.backgroundColor = "rgba(69,255,0,0.2)";
            }
            else {
                div.style.backgroundColor = "rgba(255,81,0,0.2)"
            }
            container.appendChild(div);

        })
    }
    else {
        container.innerHTML = ``;
        container.innerHTML = `<div style="font-size: 2em; text-align: center; margin-top:2em " > No tasks...</div>`
    }
}

//completed List display
document.getElementById('completedList').addEventListener('click', displayCompleted);
function displayCompleted() {

    taskList.innerHTML = ``;
    getFromLocalStorage();
    const task = state.tasks;
    const completedTasks = task.filter((item) => {
        return item.status == 1;
    })
    if (completeTask) {
        state.tasks = completedTasks;
    }
    else {
        state.tasks = [];
    }
    displayTask();
}

//All list display
document.getElementById('allList').addEventListener('click', () => {
    getFromLocalStorage();
    displayTask();
})

//Pending Display
document.getElementById('pendingList').addEventListener('click', () => {
    taskList.innerHTML = ``;
    getFromLocalStorage();
    const task = state.tasks;
    const pendingTasks = task.filter((item) => {
        return item.status == 0;
    })
    if (completeTask) {
        state.tasks = pendingTasks;
    }
    else {
        state.tasks = [];
    }
    displayTask();
})

//Edit button
const editCalcelBtn = document.getElementById('editCancelBtn');
const editEditBtn = document.getElementById('editEditBtn');
const editModel = document.getElementById('editModel');
const editTitle = document.getElementById('editTitleText');
const editDes = document.getElementById('editDesText');
function editItem(id) {
    editModel.style.top = '0vh';
    const index = state.tasks.findIndex((item) => {
        return item.id === id;
    });
    editTitle.value = state.tasks[index].title;
    editDes.value = state.tasks[index].description;

    editCalcelBtn.addEventListener('click', () => {
        editModel.style.top = '-100vh';
    })
    editEditBtn.addEventListener('click', () => {
        state.tasks[index].title = editTitle.value;
        state.tasks[index].description = editDes.value;
        localStorage.setItem('task', JSON.stringify(state.tasks));
        editModel.style.top = '-100vh';
        getFromLocalStorage();
        displayTask();
        notify("Task Edited");
    })
}
const notifyModel = document.getElementById('notifyModel');
const notifyText = document.getElementById('notifyText');
function notify(text) {
    notifyText.innerHTML = text;
    notifyModel.style.top = "0vh";
    
    setTimeout(() => {
        notifyModel.style.top = "-30vh";
    }, 2000)
}
getFromLocalStorage();
displayTask();
getFromLocalStorage();

const taskListBtns = document.querySelectorAll('.taskListBtn');
taskListBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        taskListBtns.forEach(btn => {
            if (btn.classList.contains('btn-primary')) {
                 btn.classList.remove('btn-primary');
                 btn.classList.add('btn-outline-primary');
            }
        })
        e.target.classList.remove('btn-outline-primary');
        e.target.classList.add('btn-primary');
    })
})

function confirmDelete(id){
    confirmDeleteModel.style.top="0vh";
    confirmDeleteBtn.addEventListener('click',clicker =()=>{
        deleteItem(id);
        confirmDeleteBtn.removeEventListener('click',clicker);
    }) 
    
    cancelDeleteBtn.addEventListener('click',()=>{
        confirmDeleteModel.style.top='-90vh';
    })
}

async function getFromServer(){
    await fetch('http://localhost:3000/getTasks',{
        method:'GET',
    })
    .then(response=>{
        if(!response.ok){
            throw ('Response error');
        }
        return response.json();
    })
    .then(data =>{
        // console.log(data);
       
        data.forEach((item)=>{
            state.tasks.push(item);
        })
        displayTask();
    })
    .catch((error)=>{
        console.log(error);
    })
}
getFromServer();

async function newTaskToServer(obj){
    const requestBody={
        "id":obj.id,
        "head":obj.head,
        "description":obj.description,
        "creation_date":{hrs:obj.hours,mins:obj.mins,weekDay:obj.weekDay},
        "status":obj.status
    };
    await fetch('http://localhost:3000/addTask',{
        method:'POST',
        body:JSON.stringify(requestBody),
    })
    .then(response=>{
        if(!response.ok){
            console.log('Response error');
        }
    })
    .then(data=>{
        // console.log(data);
    })
}