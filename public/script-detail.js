var passwordValueLocal = document.querySelector("#passwordValueLocal");
var short_Id = document.querySelector("#short_Id");

console.log(short_Id.innerHTML.trim());
var myLinkArr = JSON.parse(localStorage.getItem("Mylinks"));
myLinkArr.forEach(link => {
    if(link.short_Id == short_Id.innerHTML.trim())
    {
        passwordValueLocal.innerHTML = link.passwordValue;
    }
});