const todo_list=document.getElementById('todo_list');
var i=0;

function addTask() {  // This function is called when Add button in todo list is clicked
    
    //Create a container div to contain controls for i-th task
    //The controls will be created dynamically here
    const newTask=document.createElement('div');
    newTask.setAttribute('id','Task'+String(i));

    //To that container, add textbox showing name of task
    const taskName=document.createElement('input');
    taskName.setAttribute('type','text');
    taskName.setAttribute('placeholder','Enter TaskName');
    taskName.setAttribute('id','taskName'+String(i));

    taskName.id = "textName";

    //Add checkbox to container and call doneTask() when selected
    const doneCheck=document.createElement('input');
    doneCheck.setAttribute('type','checkbox');
    doneCheck.setAttribute('id','doneCheck'+String(i));
    doneCheck.addEventListener('change',function () {
        if(doneCheck.checked){
            doneTask(taskName);
        }
        else {
            reviveTask(taskName);
        }
    });

    doneCheck.id = "checkButton";
    
    //Create a delete button and call deleteTask() when clicked
    const deleteButton=document.createElement('input');
    deleteButton.setAttribute('type','button');
    deleteButton.setAttribute('value','X');
    deleteButton.setAttribute('id','deleteButton'+String(i));
    deleteButton.addEventListener('click',function () {
        deleteTask(newTask);
    });
    deleteButton.id = "deleteButton";

    newTask.appendChild(doneCheck);
    newTask.appendChild(taskName);
    newTask.appendChild(deleteButton);

    todo_list.appendChild(newTask);
    i++;
}

function doneTask(elementTask) {
    // Strike through the task name and disable its controls
    if(elementTask.value){
        elementTask.style.textDecoration = "line-through";
        elementTask.readOnly = "true";
    }
}

function reviveTask(elementTask) {
    elementTask.style.textDecoration = "none";
    elementTask.removeAttribute("readonly");
}

function deleteTask(elementTask) {
    //Removes element from its parent
    const task = document.getElementById(elementTask.id);
    todo_list.removeChild(task);
}