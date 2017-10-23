// JavaScript Document
function searchGoogle() {
    var searchString = document.getElementById('searchString').value;
    document.getElementById('googles').action = "https://www.google.com/?gws_rd=ssl#q=" + searchString; //Will set it
  }
