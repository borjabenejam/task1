/**
 * Created by Borja on 23/10/2015.
 */
function testName() {
    alert(this.value);
    var b = (document.getElementById("fullName").value.length);
    if(b < 7 | b > 50){
        alert("Wrong Format for Name");
    }
}
function testarea(){
    console.log(this);
}