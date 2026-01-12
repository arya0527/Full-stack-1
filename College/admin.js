const button = document.getElementById('theme-toggle');
const body = document.body;

button.addEventListener('click',
    function(){
if(body.classList.contains("light")){
    body.classList.remove("light");
    body.classList.add("dark");
}else{
    body.classList.remove("dark");
    body.classList.add("light");
}
});
