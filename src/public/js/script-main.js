//todo: SideBar Animation
const div_tag = document.querySelectorAll('.nav-main ul li a .nav-op')
const current = location.href;

for(let i = 0; i < div_tag.length; i++){
  div_tag[i].addEventListener('click',function(){
    var active = document.getElementsByClassName('active-sidebar');
    
    
    active[0].className = active[0].className.replace(' active-sidebar','');
    console.log(this.className)
    

    //* Adding active-sidebar class
    this.className += ' active-sidebar';
  });
}

//todo: Keep in active in sidebar by changing url hash
$(function() {
  $('.nav-main ul li a[href^="/' + location.pathname.split("/")[1] + '"] div').addClass('active-sidebar');
});

//todo: Removing overlay message effect
try {
  const close = document.getElementById('close-1');
  close.addEventListener('click', () => {
      document.getElementById("overlay").remove();
  })
} catch (e) {
  
}

//todo: Setting time and date
// window.onload() = setInterval(clock,1000);
window.addEventListener('load',setInterval(clock,1000));
function clock(){
  var date = new Date();
  var day = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();
  var hour = date.getHours();
  var min = date.getMinutes();
  var sec = date.getSeconds();
  document.getElementById('date').placeholder = `${day}/${month+1}/${year} ${hour}:${min}:${sec}`
}