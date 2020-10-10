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
  $('.nav-op[href^="/' + location.pathname.split("/")[1] + '"]').addClass('active-sidebar');
});

$(function() {
  $('.dropdown-container ul li .child-dropdown[href^="/' + location.pathname.split("/")[1] + '"]').addClass('active-child-dropdown');
});

//todo: Removing overlay message effect
try {
  const close = document.getElementById('close-1');
  close.addEventListener('click', () => {
      document.getElementById("overlay").remove();
  })
} catch (e) {
  
}

//todo: Setting time and date to input from Generar-Cuenta
const date_input = document.querySelector('#date');

date_input.addEventListener('DOMContentLoaded',clock);

function clock(){
  var date = new Date();
  var day = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();
  var hour = date.getHours();
  var min = date.getMinutes();
  var sec = date.getSeconds();
  
  //*Validations date (conditional - ternary operator)
  var sec = (sec<10) ? `0${sec}` : sec;
  var min = (min<10) ? `0${min}` : min;
  var hour = (hour<10) ? `0${hour}`: hour;
  //var month = (month<=10) ? `0${month+1}` : `${month+1}`; (Not working!!) 
  var month = (month.length===1) ? `0${month+1}` : `${month+1}`;
  const time = document.getElementById('date').placeholder = `${day}/${month}/${year} ${hour}:${min}:${sec}`
  return time;
}

function popup_add_producto(){
  document.querySelector('.mantener-productos .popup-add-producto').style.display = 'flex';
}
function popup_close_producto(){
  document.querySelector('.mantener-productos .popup-add-producto').style.display = 'none';
}
const button_add_mantener_producto = document.getElementById('add-mantener-producto-btn')
button_add_mantener_producto.addEventListener('click',popup_add_producto);

const button_close_add_mantener_producto = document.getElementsByClassName('close-popup-mantener-producto')
button_close_add_mantener_producto.addEventListener('click',popup_close_producto)


function openSidebar() {
  document.querySelector(".sidebar").style.display = "flex";
  document.querySelector(".sidebar").classList.add('animate__fadeInLeft')
  document.getElementById('btn-opensidebar').style.display = 'none';
}

function closeSidebar() {
  document.querySelector(".sidebar").style.display = "none";
  document.getElementById('btn-opensidebar').style.display = 'flex';
}
document.getElementById('btn-opensidebar').addEventListener('click', openSidenav);
document.getElementById('btn-closesidebar').addEventListener('click', closeSidebar);