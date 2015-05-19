function div_change(){
	$('#entry').fadeOut("speed");
	$("#board").fadeIn("speed");
	$("#scene").animate({"left": -($("#page_two").position().left)}, 1);
	document.getElementById("city").innerHTML = sehir.toUpperCase();
}

function div_change_back(){
	$('#board').hide();
	$("#entry").show();
	window.localStorage.setItem("key",null);
	location_start();
	$('#girisyap').removeClass('btn');
	$("#girisyap").addClass('btn disabled');
}

function entry_show(){
	$("#entry").show();
}

function select_city_show(){
	$("#select_city").show();
}

function goto(id, page){
    $("#scene").animate({"left": -($(id).position().left)}, 300);
    $('li').removeClass('active');
    $(page).addClass('active');
}