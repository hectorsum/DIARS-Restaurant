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

$(document).ready(function() {
  $('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
  } );
  $('table.table').DataTable( {
      "language":{
        "url":"/json/dataTable-es.json"
      },
      scrollY:        200,
      scrollCollapse: true,
      paging:         true,
      responsive: {
        breakpoints: [
          {name: 'bigdesktop', width: Infinity},
          {name: 'meddesktop', width: 1480},
          {name: 'smalldesktop', width: 1280},
          {name: 'medium', width: 1188},
          {name: 'tabletl', width: 1024},
          {name: 'btwtabllandp', width: 848},
          {name: 'tabletp', width: 768},
          {name: 'mobilel', width: 480},
          {name: 'mobilep', width: 320}
        ]
      }
  } );

  // Apply a search to the second table for the demo
  //$('#myTable2').DataTable().search( 'A' ).draw();
} );

$(document).ready( function () {
  $('#myTable').DataTable({
    "language":{
      "url":"/json/dataTable-es.json"
    },
    "scrollY": "200px",
    "scrollCollapse": true,
    "paging": true,
    responsive: {
      breakpoints: [
        {name: 'bigdesktop', width: Infinity},
        {name: 'meddesktop', width: 1480},
        {name: 'smalldesktop', width: 1280},
        {name: 'medium', width: 1188},
        {name: 'tabletl', width: 1024},
        {name: 'btwtabllandp', width: 848},
        {name: 'tabletp', width: 768},
        {name: 'mobilel', width: 480},
        {name: 'mobilep', width: 320}
      ]
    }
  });
});


//Set worker-add user
try {
  //Looking for button check
    $(".popup-add-producto button").click(function () {
        console.log('clicked')
        var row = $(this).closest("tr");
        document.getElementById('empleado').value = row.find("td:eq(1)").text();
        document.getElementById('dni').value = row.find("td:eq(2)").text();
        document.getElementById('rol').value = row.find("td:eq(3)").text();
        
        document.getElementById('usuario').removeAttribute('readonly');
        document.getElementById('usuario').setAttribute('required',true);
        document.getElementById('password').removeAttribute('readonly');
        document.getElementById('password').setAttribute('required',true);
        
        document.getElementById('btnAgregarUsuario').removeAttribute('disabled');

        document.querySelector(".mantener-productos .popup-add-producto").style.display = "none";
    });
} catch (error) {
}


try {
  //Looking for button check
    $("#search_comanda button").click(function () {
        console.log('clicked')
        var row = $(this).closest("tr");
        document.getElementById('empleado').value = row.find("td:eq(1)").text();
        document.getElementById('dni').value = row.find("td:eq(2)").text();
        document.getElementById('rol').value = row.find("td:eq(3)").text();
        
        document.getElementById('usuario').removeAttribute('readonly');
        document.getElementById('usuario').setAttribute('required',true);
        document.getElementById('password').removeAttribute('readonly');
        document.getElementById('password').setAttribute('required',true);
        
        document.getElementById('btnAgregarUsuario').removeAttribute('disabled');

        document.querySelector(".mantener-productos .popup-add-producto").style.display = "none";
    });
} catch (error) {
}