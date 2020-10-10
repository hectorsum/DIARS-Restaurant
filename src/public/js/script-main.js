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
function popup_add_producto(){
  document.querySelector('.mantener-productos .popup-add-producto').style.display = 'flex';
}
function popup_close_producto(){
  document.querySelector('.mantener-productos .popup-add-producto').style.display = 'none';
}
//todo: Making sure "button_add_mantener_producto" isn't NULL for not getting console error and same thing with "button_close_add_mantener_producto" --- both "const" should be included in same file that they're being used
const button_add_mantener_producto = document.getElementById('add-mantener-producto-btn')
if (button_add_mantener_producto){
  button_add_mantener_producto.addEventListener('click',popup_add_producto,false);
}
const button_close_add_mantener_producto = document.getElementById('close-popup-mantener-producto')
if (button_close_add_mantener_producto){
  button_close_add_mantener_producto.addEventListener('click',popup_close_producto,false);
}
function openSidebar() {
  document.querySelector(".sidebar").style.display = "flex";
  document.querySelector(".sidebar").classList.add('animate__fadeInLeft')
  document.getElementById('btn-opensidebar').style.display = 'none';
}
function closeSidebar() {
  document.querySelector(".sidebar").style.display = "none";
  document.getElementById('btn-opensidebar').style.display = 'flex';
  document.querySelector(".sidebar").classList.add('animate__bounceInLeft')
}
document.getElementById('btn-opensidebar').addEventListener('click', openSidebar);
document.getElementById('btn-closesidebar').addEventListener('click', closeSidebar);