var currentSlug = {
  "long_url": document.querySelector("#long_url").innerText,
  "short_url": document.querySelector("#short_url").innerText,
  "short_Id": document.querySelector("#short_Id").innerText,
  "custom_link": document.querySelector("#custom_link").innerText,
  "password": document.querySelector("#password").innerText,
  "passwordValue": document.querySelector("#passwordValue").innerText,
  "creationTime": document.querySelector("#creationTime").innerText,
  "TimeDeletion": document.querySelector("#TimeDeletion").innerText
}

var myLinkArr = [];
var password = [];
if(localStorage.getItem("Mylinks")===null)
{
    myLinkArr.push(currentSlug);
}
else{
  myLinkArr = JSON.parse(localStorage.getItem("Mylinks"));
  if(myLinkArr.find(o => o.short_Id === currentSlug.short_Id))
  {
    console.log("Aready Exist");
  }
  else{
  myLinkArr.push(currentSlug);
  }
}
localStorage.setItem("Mylinks",JSON.stringify(myLinkArr));

const myTimeout = setTimeout(()=>{
  window.open(`/`,"_parent");
}, 10000);

var ti = 10;
setInterval(function () {document.querySelector("#timer").innerHTML = `${ti--}`}, 1000);

document.querySelector("#clone").addEventListener('click',()=>{
   navigator.clipboard.writeText(document.querySelector("#hereShort").value.trim());
   document.querySelector("#clone").classList.add('hidden');
   document.querySelector("#okDone").classList.remove('hidden');
   const timeOUT = setTimeout(()=>{
    document.querySelector("#clone").classList.remove('hidden');
    document.querySelector("#okDone").classList.add('hidden');
    }, 2000);
});
