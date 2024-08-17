const inputBox=document.getElementById("input-box")
const listContainer=document.getElementById("list-container")
const addButton=document.getElementById("add-button")

addButton.addEventListener('click',addTask)

listContainer.innerHTML=localStorage.getItem("tasks")

function addTask(){
    if(inputBox.value==""){
        document.getElementsByClassName("alert")[0].style.display="block"

    }
    else{
        document.getElementsByClassName("alert")[0].style.display="none"
        let li =document.createElement("li")
        li.innerHTML=inputBox.value
        listContainer.appendChild(li)
        let span =document.createElement("span")
        span.innerHTML="\u00d7"
        li.appendChild(span)
        inputBox.value=""
        
    }
    saveData()
}

listContainer.addEventListener('click',function(e){
    if(e.target.tagName==="LI"){
        e.target.classList.toggle("checked")
        saveData()
    }
    else if(e.target.tagName==="SPAN"){
        e.target.parentElement.remove()
        saveData()
    }
},false)

function saveData(){
    localStorage.setItem("tasks",listContainer.innerHTML)
}
