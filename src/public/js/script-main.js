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