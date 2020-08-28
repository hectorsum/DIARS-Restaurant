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
  $('.dropdown-container ul li a[href^="/' + location.pathname.split("/")[1] + '"]').addClass('active-child-dropdown');
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
const date_input = document.getElementById('date');

date_input.addEventListener('load',setInterval(clock,1000));

function clock(){
  var date = new Date();
  var day = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();
  var hour = date.getHours();
  var min = date.getMinutes();
  var sec = date.getSeconds();
  
  //*Validations date
  var sec = (sec<10) ? `0${sec}` : sec;
  var min = (min<10) ? `0${min}` : min;
  var hour = (hour<10) ? `0${hour}`: hour;
  var month = (month<10) ? `0${month+1}` : month+1;

  const time = document.getElementById('date').placeholder = `${day}/${month}/${year} ${hour}:${min}:${sec}`
  return time;
}

function changedSegundo(){
  const nombre_segundo = document.getElementById('nombre_segundo');
  //* Getting integer value from selected tag
  const opc_nombre_segundo = nombre_segundo.options[nombre_segundo.selectedIndex].value;
  const cant_segundo = document.getElementById('cant_segundo');

  switch(opc_nombre_segundo){
    case '0':
      cant_segundo.setAttribute('readonly',true);
      cant_segundo.setAttribute('value','0');
      break;
    default:
      cant_segundo.removeAttribute('readonly');
      cant_segundo.setAttribute('value','1');
      break;
  }
}

function changedEntrada(){
  const nombre_entrada = document.getElementById('nombre_entrada');
  //* Getting integer value from selected tag
  const opc_nombre_entrada = nombre_entrada.options[nombre_entrada.selectedIndex].value;
  const cant_entrada = document.getElementById('cant_entrada');

  switch(opc_nombre_entrada){
    case '0':
      cant_entrada.setAttribute('readonly',true);
      cant_entrada.setAttribute('value','0');
      break;
    default:
      cant_entrada.removeAttribute('readonly');
      cant_entrada.setAttribute('value','1');
      break;
  }
}

function changedProducto(){
  const nombre_producto = document.getElementById('nombre_producto');
  //* Getting integer value from selected tag
  const opc_nombre_producto = nombre_producto.options[nombre_producto.selectedIndex].value;
  const cant_producto = document.getElementById('cant_producto');

  switch(opc_nombre_producto){
    case '0':
      cant_producto.setAttribute('readonly',true);
      cant_producto.setAttribute('value','0');
      break;
    default:
      cant_producto.removeAttribute('readonly');
      cant_producto.setAttribute('value','1');
      break;
  }
}

window.addEventListener('change',changedSegundo);
window.addEventListener('change',changedEntrada);
window.addEventListener('change',changedProducto);

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