var coll = document.getElementsByClassName("collapsible-button");
var i;

console.log(coll);
for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
      console.log("none");
    } else {
      content.style.display = "block";
      console.log("block");
    }
  });
}