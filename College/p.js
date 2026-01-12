function cube(num){
    return num*num*num;
}
function showCube() {
    var num = document.getElementById('num').parseFloat();
    var result = cube(num);
    document.getElementById('resultb').innerText = "Cube: " + result;
}