const todo_list=document.getElementById('todo_list');
var i=0;

if(loadedTimer === null || records[loadedTimer] === undefined){ // New timer i.e. not a loaded from saved ones or record cannot be found
}
else{ // Loaded timer from saved ones
    for(let todo of records[loadedTimer].todos){
        let taskObject = addTask(todo.name);
        console.log(taskObject);
        if(todo.completed){
            doneTask(taskObject.name)
            taskObject.checkbox.setAttribute("checked",true)
        }
    }
}

function addTask(value="") {  // This function is called when Add button in todo list is clicked
    
    //Create a container div to contain controls for i-th task
    //The controls will be created dynamically here
    const newTask=document.createElement('div');
    newTask.setAttribute('id','Task'+String(i));

    //To that container, add textbox showing name of task
    const taskName=document.createElement('input');
    taskName.setAttribute('type','text');
    taskName.setAttribute('placeholder','Enter TaskName');
    taskName.setAttribute('class','taskName');
    taskName.setAttribute('id','taskName'+String(i));
    taskName.value = value;

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
    
    //Create a delete button and call deleteTask() when clicked
    const deleteButton=document.createElement('input');
    deleteButton.setAttribute('type','button');
    deleteButton.setAttribute('value','X');
    deleteButton.setAttribute('id','deleteButton'+String(i));
    deleteButton.addEventListener('click',function () {
        deleteTask(newTask);
    });

    newTask.appendChild(doneCheck);
    newTask.appendChild(taskName);
    newTask.appendChild(deleteButton);

    todo_list.appendChild(newTask);
    i++;
    let returnObject = {task:newTask,name:taskName,delButton:deleteButton,checkbox:doneCheck};
    return(returnObject);
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