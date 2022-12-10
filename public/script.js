var  customUrl = document.querySelector("#customUrl");
var  TimeDeletion = document.querySelector("#TimeDeletion");
var  customUrlCon = document.querySelector(".customUrlCon");
var  passwordValCon = document.querySelector(".passwordValCon");
var  custom = document.querySelector("#custom");
var  password = document.querySelector("#password");
var  submitBTN = document.querySelector("#submitBTN");
var  iRead = document.querySelector("#iRead");
var form = document.getElementById("myForm"); 
var mainConLinks = document.querySelector(".mainConLinks");

// var  hereShort = document.querySelector("#hereShort");

{
    var tempDate = new Date(new Date().getTime() + 1000*60*60*24);
    var year = tempDate.getFullYear();
    var month = tempDate.getMonth() +1;
    var day = tempDate.getDate();
    if(month<10)
    month = "0"+month
    if(day<10)
    day = "0"+day
    TimeDeletion.max = `${year+5}-${month}-${day}`
    TimeDeletion.min = `${year}-${month}-${day}`
    TimeDeletion.value = `${year}-${month}-${day}`
}
iRead.addEventListener('click',()=>{
    if(iRead.checked)
    submitBTN.disabled = false;
    else
    submitBTN.disabled = true;
})

function handleForm(event) {     event.preventDefault(); } 

submitBTN.addEventListener('clcik',()=>{
    document.querySelector("#url").value="";
    iRead.checked = false;
    console.log("done0");
})
custom.addEventListener('change',()=>{
    if(custom.value === 'false')
    customUrlCon.classList.add('hidden');
    else
    customUrlCon.classList.remove('hidden');
})

password.addEventListener('change',()=>{
    if(password.value === 'false')
    { passwordValCon.classList.add('hidden');}
    else
    passwordValCon.classList.remove('hidden');
})


customUrl.addEventListener('input',()=>{
    var temp = customUrl.value;
    var newTemp = "";
    for(let i=0;i<temp.length;i++)
    {
      if((temp[i]<='9'&&temp[i]>='0') || (temp[i]<='z'&&temp[i]>='a') || (temp[i]<='Z'&&temp[i]>='A') || temp[i] ==='@' || temp[i] ==='#' || temp[i] ==='+' || temp[i] ==='-' || temp[i] ==='/' || temp[i] ==='_' || temp[i] ==='?' || temp[i] ==='&' || temp[i] ==='~')
      newTemp+= temp[i]
    }
    customUrl.value = newTemp;
})

var linkArr = JSON.parse(localStorage.getItem('Mylinks'));
if(localStorage.getItem('Mylinks') === null)
{
    mainConLinks.innerHTML = `<div style="color: cyan; font-size:14px;">Links not found, Create now</div>`;
}
else{
    var i=0;
    var tempHtml=``
    linkArr.forEach((link) => {
        if(new Date(link.TimeDeletion).getTime() > (new Date).getTime() )
        {
        tempHtml = `
            <div class="row d-flex p-2 px-3 justify-content-center" style="overflow: hidden; color:#bbbbbb;">
            <div class="col-12 py-2 col-md-6 col-lg-5 relative" style="background-color:#323437;">
                <input class="p-2" type="text" value="${link.long_url}"readonly style="width: 100%; outline: none;background-color:#323437;">
            </div>
            <div class="col-12 py-2 col-md-6 col-lg-5 relative d-flex" style="background-color:#323437;">
                <div class="col-8">
                <input class="p-2 col-8" type="text" value="${link.short_url}"readonly style="width: 100%; outline: none; background-color:#323437;">
                </div>
                    <div class="col-4 relative p-2" style="background-color:#323437;">
                    <form action="/details" autocomplete="off" method="post">
                    <input type="text" class="hidden" name="short_Id" value="${link.short_Id}"> 
                    <input type="text" class="hidden" name="short_Id" value="${link.passwordValue}"> 
                    <input type="submit" class="submit-dark" style="width: 100px;" value="Get Details">
                    </form></div>
            </div>
            </div>
        ` + tempHtml;
        }
    });
    if(tempHtml)
    mainConLinks.innerHTML = tempHtml;
    else{
    mainConLinks.innerHTML = `<div style="color: cyan; font-size:14px;">Links not found, Create now</div>`;
    }
}