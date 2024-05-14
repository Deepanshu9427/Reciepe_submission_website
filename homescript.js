var hoverElement = document.getElementById('home');
      
hoverElement.addEventListener('mouseover', function() {
  var ele= document.getElementById('home2');
  ele.textContent='Home';
});

hoverElement.addEventListener('mouseout', function() {
    var ele= document.getElementById('home2');
    ele.textContent="";
});

hoverElement = document.getElementById('login');
      
hoverElement.addEventListener('mouseover', function() {
  var ele= document.getElementById('login2');
  ele.textContent='Login';
});

hoverElement.addEventListener('mouseout', function() {
    var ele= document.getElementById('login2');
    ele.textContent="";
});

hoverElement = document.getElementById('register');
      
hoverElement.addEventListener('mouseover', function() {
  var ele= document.getElementById('register2');
  ele.textContent='Register';
});

hoverElement.addEventListener('mouseout', function() {
    var ele= document.getElementById('register2');
    ele.textContent="";
});

hoverElement = document.getElementById('contact');
      
hoverElement.addEventListener('mouseover', function() {
  var ele= document.getElementById('contact2');
  ele.textContent='Contact';
});

hoverElement.addEventListener('mouseout', function() {
    var ele= document.getElementById('contact2');
    ele.textContent="";
});

hoverElement = document.getElementById('aboutus');
      
hoverElement.addEventListener('mouseover', function() {
  var ele= document.getElementById('aboutus2');
  ele.textContent='About Us';
});

hoverElement.addEventListener('mouseout', function() {
    var ele= document.getElementById('aboutus2');
    ele.textContent="";
});