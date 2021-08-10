const todos = document.querySelectorAll(".task");
const all_status = document.querySelectorAll(".drag");
const newdivloc=document.querySelector('.not-started');
const inProgressSection=document.querySelector('#InProgress');
const completedSection=document.querySelector('#completedTask');
const alltask=document.querySelectorAll('.tasks');
const editable=document.querySelectorAll('.task-text');
const addbtn=document.querySelector('.add');
const textbox=document.querySelector('.text');
const editBtn=document.getElementById('editBtn');

let draggableTodo = null;

let closebtn=document.querySelectorAll('.close');
console.log(editable);
let ID = ()=> {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_'+ Math.random().toString(36).substr(2, 9);
};
let closeID = ()=> {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return 'CL' +Math.random().toString(36).substr(2, 9);
};
let li;

li=JSON.parse(localStorage.getItem('storage'))||{};

let eachdiv={};

for(const myitems in li){
    let myolderdiv=createolderDiv(li[myitems].id,li[myitems].closeID,li[myitems].text,li[myitems].status);
    
    if(li[myitems]["status"]=="notStarted")
        newdivloc.appendChild(myolderdiv);
    else if(li[myitems]["status"]=="inProgress")
        inProgressSection.appendChild(myolderdiv);
    else if(li[myitems].status=="completed"){
        myolderdiv.querySelector('.checkbox').checked=true;
        myolderdiv.querySelector('#editBtn').style.visibility="hidden";
        completedSection.appendChild(myolderdiv)
    }
}
todos.forEach((todo) => {
    
    todo.addEventListener("dragstart", dragStart);
    todo.addEventListener("dragend", dragEnd);
});

function dragStart() {
    draggableTodo = this;
    setTimeout(() => {
        this.style.display = "none";
    }, 0);
    
}

function dragEnd(event) {
    
    if (event.target.parentElement.className.split(' ')[0]== "completed" ) {
        this.querySelector('.checkbox').checked=true;
        correctloc(event.target,"completed");
        this.querySelector('#editBtn').style.visibility="hidden";

    }
    else{
        this.querySelector('.checkbox').checked=false;
        if(event.target.parentElement.className.split(' ')[0]== "in-progress"){
            this.querySelector('#editBtn').style.visibility="visible";
            correctloc(event.target,"inProgress");
        }
        else{
            this.querySelector('#editBtn').style.visibility="visible";
            correctloc(event.target,"notStarted");
        }
    
    }

    
    draggableTodo = null;
    
    setTimeout(() => {
        this.style.display = "flex";
        // updatestorage(li);
    }, 0);
//   console.log("dragEnd");
}



all_status.forEach((status) => {
  status.addEventListener("dragover", dragOver);
  status.addEventListener("dragenter", dragEnter);
  status.addEventListener("dragleave", dragLeave);
  status.addEventListener("drop", dragDrop);
});

function dragOver(e) {
  e.preventDefault();
  //   console.log("dragOver");
}

function dragEnter() {
    
  this.style.border = "1px dashed #ccc";
  
}

function dragLeave() {
  this.style.border = "none";
  
}

function dragDrop() {

    this.style.border = "none";
    this.appendChild(draggableTodo);
  

}
// update status of location by this
function correctloc(target,text){
    li[target.id].status=text;
   
}

function createDiv(text){
    let id=ID();
    let closeid=closeID();
    eachdiv={};
    let outer=document.createElement("DIV");
    let inner3=document.createElement("SPAN");
    let inner4=document.createElement('INPUT');
    let inner5=document.createElement('BUTTON');
    let inner6=document.createElement("BUTTON");

    outer.classList.add('task');
    outer.setAttribute("Id",id);
    eachdiv['id']=id;
    eachdiv['text']=text;
    eachdiv['status']='notStarted';
    eachdiv['closeID']=closeid;
    li[id]=eachdiv;
    
    console.log(li);

    outer.setAttribute("draggable",true );
    let inner1=document.createElement("DIV");
    inner1.classList.add('drag-circle');
    let inner2=document.createElement("INPUT");
    inner2.classList.add('checkbox');
    inner2.setAttribute("type","checkbox");
    // inner2.setAttribute("checked",false);
    inner2.addEventListener('click', ()=> {
        let flag=inner2.checked;
        if (flag==true) {
                let newtask=inner2.parentElement;
                // newtask=newtask.querySelector('.all-tasks');  
                let target=newtask
                console.log(target);
            correctloc(target,"completed");
            inner6.style.visibility="hidden";
            // btn.style.visibility="hidden";
            completedSection.appendChild(newtask);
                console.log("checked");
            } else {
            inner6.style.visibility="visible";
                console.log("unchecked");
                let newtask=inner2.parentElement;
                let target=newtask
                correctloc(target,"inProgress");
                // newtask=newtask.querySelector('.all-tasks');    
                inProgressSection.appendChild(newtask);
                
            }
    });
    
    inner3.classList.add('task-text');
    inner3.setAttribute("id","mainText");
    inner3.innerText=text;
    inner4.setAttribute("type","text");
    inner4.classList.add('text');
    inner4.setAttribute("id","text")
    inner4.classList.add('hidden');
    // <button class="edit" id="editBtn">&#9998;</button>
    inner6.classList.add('edit');
    inner6.setAttribute("id","editBtn");
    inner6.innerText="\u270E";
    inner5.classList.add('close');
    inner5.setAttribute('id',closeid);
    inner5.addEventListener('click',()=>{
        console.log("woeks");
        let newid=inner5.getAttribute("id");
        delete li[id];
        console.log(li);
        inner5.parentElement.style.display="none";
    });

// editBtn=inner6 text=inner4 maintext=inner3

    inner5.innerText="\u2716"
    inner6.addEventListener('click',(e)=>{
        let newtext=inner3.innerText;
        inner6.classList.add("hidden");
        inner3.classList.add('hidden');
        inner4.value=newtext;
      
        
        inner4.style.position="relative";
        inner4.style.right="20px";
        inner4.classList.remove('hidden');
        // editBtn.style.display="flex";  
    })
    inner4.addEventListener('keyup',(e)=>{
        if(e.keyCode==13){
            inner4.classList.add('hidden');
            inner4.style.position="none";
            inner4.style.left="0";
            let mytext=inner4.value;
            inner6.classList.remove('hidden');
            let myid=e.target.parentElement.getAttribute("id");
            li[myid]['text']=mytext;
            // mainText.style.display="flex";
            inner3.innerText=mytext;
            inner3.classList.remove("hidden");
        }
    } )
    outer.appendChild(inner1);
    outer.appendChild(inner2);
    outer.appendChild(inner3);
    outer.appendChild(inner4);
    outer.appendChild(inner6);
    outer.appendChild(inner5);
    outer.addEventListener("dragstart", dragStart);
    outer.addEventListener("dragend", dragEnd);
    update(li);
    return outer;
}

let myCheckbox=document.querySelector('.checkbox');
let newtodo=document.getElementById('newTodo');
let newtodobtn=document.getElementById('buttonAdd');
let notStarted=document.querySelector('#notStarted');
let closeBtn=document.querySelector('.close');
newtodobtn.addEventListener('click',()=>{
    if(newtodo.value==""){
        alert("Can't enter empty todo");
    }
    else{
        let newtask=createDiv(newtodo.value);
        notStarted.appendChild(newtask);
        newtodo.value="";
    }
});
newtodo.addEventListener('keydown',function (event) {
    if (event.which == 13 || event.keyCode == 13) {
        //code to execute here
        if(newtodo.value==""){
            alert("Can't enter empty todo");
        }
        else{
            let newtask=createDiv(newtodo.value);
            notStarted.appendChild(newtask);
            newtodo.value="";
        }
        return false;
    }
    return true;
});
let clear=document.querySelector('.clear-all');
clear.addEventListener('click',()=>{
    let listid=[];
for(const id in li){
    if(li[id]['status']=="completed"){
        let newid="#"+id;
        let complete= document.querySelector(newid);
        console.log(complete);
        complete.style.display="none";
        listid.push(id);
    }
}
listid.forEach((id)=>{
    delete li[id];
});
});

let Tabs=document.querySelectorAll('.tabBtn');
Tabs.forEach((tab)=>{
tab.addEventListener('click',(e)=>{
    console.log("working");
    removeActive();
    remove();
    removeStyle();
    let newtask=document.querySelectorAll('.disable'); 
    let text=e.target.getAttribute("id");
    let nst=document.querySelector('#one');
    let cnp=document.querySelector('#three')
    let inp=document.querySelector('#two')

    if(text=="allTaskTab"){
        e.target.parentNode.classList.add('active');
        
            inp.classList.remove('hidden');
            cnp.classList.remove('hidden');
            nst.classList.remove('hidden');

    }
    else if(text=="notStartTab"){
        e.target.parentNode.classList.add('active');
        nst.classList.remove('hidden');
        nst.style.height="80%";
    }
    else if(text=="inProgressTab"){
        e.target.parentNode.classList.add('active');
        inp.classList.remove('hidden');
        inp.style.height="80%";

    }
    else{
        e.target.parentNode.classList.add('active');
        cnp.style.height="80%";
        cnp.classList.remove('hidden');
    }

})
})
function remove(){
    let newtask=document.querySelectorAll('.disable'); 
    newtask.forEach((task)=>{
        task.classList.add('hidden');
    })
}
function removeStyle(){
    let tabs=document.querySelectorAll('.disable');
    tabs.forEach((t)=>{
        t.style.height="22%";
    })
}
function removeActive(){
    let tabs=document.querySelectorAll('.tabs');
    tabs.forEach((t)=>{
        t.classList.remove('active');
    })
}

function update(li){
    let mylocalData=JSON.stringify(li);
    localStorage.setItem('storage',mylocalData);
    

}


function createolderDiv(id,closeid,text,status){

    let outer=document.createElement("DIV");
    let inner3=document.createElement("SPAN");
    let inner4=document.createElement('INPUT');
    let inner5=document.createElement('BUTTON');
    let inner6=document.createElement("BUTTON");

    outer.classList.add('task');
    outer.setAttribute("Id",id);
    li[id].status=status;
    
    console.log(li);
    outer.setAttribute("draggable",true );
    let inner1=document.createElement("DIV");
    inner1.classList.add('drag-circle');
    let inner2=document.createElement("INPUT");
    inner2.classList.add('checkbox');
    inner2.setAttribute("type","checkbox");
    // inner2.setAttribute("checked",false);
    inner2.addEventListener('click', ()=> {
        let flag=inner2.checked;
        if (flag==true) {
                let newtask=inner2.parentElement;
                // newtask=newtask.querySelector('.all-tasks');  
                let target=newtask
                console.log(target);
            correctloc(target,"completed");
            inner6.style.visibility="hidden";
            // btn.style.visibility="hidden";
            completedSection.appendChild(newtask);
                console.log("checked");
            } else {
            inner6.style.visibility="visible";
                console.log("unchecked");
                let newtask=inner2.parentElement;
                let target=newtask
                correctloc(target,"inProgress");
                // newtask=newtask.querySelector('.all-tasks');    
                inProgressSection.appendChild(newtask);
                
            }
    });
    
    inner3.classList.add('task-text');
    inner3.setAttribute("id","mainText");
    inner3.innerText=text;
    inner4.setAttribute("type","text");
    inner4.classList.add('text');
    inner4.setAttribute("id","text")
    inner4.classList.add('hidden');
    // <button class="edit" id="editBtn">&#9998;</button>
    inner6.classList.add('edit');
    inner6.setAttribute("id","editBtn");
    inner6.innerText="\u270E";
    inner5.classList.add('close');
    inner5.setAttribute('id',closeid);
    inner5.addEventListener('click',()=>{
        
        let newid=inner5.getAttribute("id");
        delete li[id];
        console.log(li);
        inner5.parentElement.style.display="none";
    });

// editBtn=inner6 text=inner4 maintext=inner3

    inner5.innerText="\u2716"
    inner6.addEventListener('click',(e)=>{
        let newtext=inner3.innerText;
        inner6.classList.add("hidden");
        inner3.classList.add('hidden');
        inner4.value=newtext;
        console.log();
        
        inner4.style.position="relative";
        inner4.style.right="20px";
        inner4.classList.remove('hidden');
        // editBtn.style.display="flex";  
    })
    inner4.addEventListener('keyup',(e)=>{
        if(e.keyCode==13){
            inner4.classList.add('hidden');
            inner4.style.position="none";
            inner4.style.left="0";
            let mytext=inner4.value;
            inner6.classList.remove('hidden');
            let myid=e.target.parentElement.getAttribute("id");
            li[myid]['text']=mytext;
            // mainText.style.display="flex";
            inner3.innerText=mytext;
            inner3.classList.remove("hidden");
        }
    } )
    outer.appendChild(inner1);
    outer.appendChild(inner2);
    outer.appendChild(inner3);
    outer.appendChild(inner4);
    outer.appendChild(inner6);
    outer.appendChild(inner5);
    outer.addEventListener("dragstart", dragStart);
    outer.addEventListener("dragend", dragEnd);
    
    return outer;
}
setInterval(()=>{
    update(li);
},1000)