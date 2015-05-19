var now_time=new Date(); 
var	saniye=now_time.getSeconds(); 
var	dakika=now_time.getMinutes(); 
var	saat=now_time.getHours(); 
var	date=now_time.getDate(); 
var	ay=now_time.getMonth()+1; 
var yil=now_time.getFullYear();
var tarih =(ay + "/" + date + "/" + yil);
var sehir="";
var imsak="";
var iftar="";
var bi_sonraki_imsak;
var imsak_aksam;
var gunun_sozu_bir;
var gunun_sozu_iki;
var ekran_sozu;
var ramazan_baslama_tarihi= new Date("7/9/2013" +" "+"00:00:00");
var ramazan_bitis_tarihi= new Date("9/7/2013" +" "+"00:00:00");
var sayac_ne_sayiyor;
var gelen_sehir;	
var gun_1; var gun_2; var gun_3; var gun_4; var gun_5; var gun_6; var gun_7; var gun_8; var gun_9; var gun_10;
var gun_11; var gun_12; var gun_13; var gun_14; var gun_15; var gun_16; var gun_17; var gun_18; var gun_19; var gun_20;
var gun_21; var gun_22; var gun_23; var gun_24; var gun_25; var gun_26; var gun_27; var gun_28; var gun_29; var gun_30;
var enlem,boylam,baglanti;
var onceki = null;
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	location_start();
}

function location_start(){
	if ((window.localStorage.getItem("key") == null) || (window.localStorage.getItem("key") == "null")){
		entry_show();
		checkConnection();
	} else {
		changeFunc(window.localStorage.getItem("key"));	
	}
}

function checkConnection() {
	var networkState = navigator.network.connection.type;
    
	var states = {};

	states[Connection.UNKNOWN]  = 'Unknown connection';
	states[Connection.ETHERNET] = 'Ethernet connection';
	states[Connection.WIFI]     = 'WiFi connection';
	states[Connection.CELL_2G]  = 'Cell 2G connection';
	states[Connection.CELL_3G]  = 'Cell 3G connection';
	states[Connection.CELL_4G]  = 'Cell 4G connection';
	states[Connection.NONE]     = 'No network connection';
	    
	if (typeof states[networkState] == 'undefined'){
		baglanti=false;
		document.getElementById("bilgi").innerHTML = "Otomatik seçim başarısız";
		entry_show();
	} else {
		baglanti=true;
		document.getElementById("bilgi").innerHTML = "Konum Tespit Ediliyor..";
		checkGeolocation();
	}
}

function checkGeolocation() {
	if (baglanti==true){
		navigator.geolocation.getCurrentPosition(geo_onSuccess, geo_onError);
	}
}

function geo_onSuccess(position) {
    enlem = position.coords.latitude;
    boylam = position.coords.longitude;
	get_sehir();
}

function geo_onError(error) {
	document.getElementById("bilgi").innerHTML = "Otomatik seçim başarısız";
	entry_show();
}

$.ajaxSetup	({
	type: 'GET',
	dataType: 'jsonp',
	timeout: 10000,
	cache: false,
	complete: function(xhr, textStatus) {

	},
});

var get_sehir= function() {
	var result = "http://www.poolbox.biz/pool_base/pool.php?";	
	result = result + "enlem=" + enlem + "&boylam=" + boylam;
	result = result + "&method=get_sehir&jsoncallback=?";
	ajax_get_sehir(result);
}

var ajax_get_sehir = function(ajax_url) {
    $.ajax({
        url: ajax_url,
        success: function(data, textStatus, xhr) {
        	adres=data[0].sehir[0];
			if (adres==null){
				document.getElementById("bilgi").innerHTML = "Otomatik seçim başarısız";
				entry_show();
			} else {
				document.getElementById("bilgi").innerHTML = "Şehrin "+adres+ " Giriş yapılsın mı?";
				gelen_sehir= adres.toLowerCase();
				$('#girisyap').removeClass('btn disabled');
				$("#girisyap").addClass('btn');
        	}   	
		},

        error: function(xhr, textStatus, errorThrown) { 
			document.getElementById("bilgi").innerHTML = "Şehir Bulunamadı, kendin seç";
        }
});}

function giris_yap(){		//3g sehir bulduktan sonra giris butonuyla giris yapar
	window.localStorage.setItem("key",gelen_sehir);	
	changeFunc(window.localStorage.getItem("key"));
}

function select_box(){
	var selectedValue = selectbox.options[selectbox.selectedIndex].value;
	window.localStorage.setItem("key",selectedValue);
	changeFunc(selectedValue);
}

function changeFunc(gelen) {
	sehir = gelen;
	
	div_change();
	city();
	gerisayim();
}

function gerisayim(){
	idate();
	var kaldi;
	var show_flag=0;
	var sayac_durumu="";
	now_time=new Date(); 
	saniye=now_time.getSeconds(); 
	dakika=now_time.getMinutes(); 
	saat=now_time.getHours(); 
	date=now_time.getDate(); 
	ay=now_time.getMonth()+1; 
	yil=now_time.getFullYear();
	tarih = (ay + "/" + date + "/" + yil);
	var	gecis_vakit = new Date(tarih + " " + "00:00:01");
	var gun_sonu = new Date(tarih + " " + "23:59:58");
	var imsak_vakit = new Date(tarih + " " + imsak);
	var iftar_vakit = new Date(tarih + " " + iftar);
	var degisken_imsak_vakti=imsak_vakit;
	var bi_sonraki_imsak_date = new Date(bi_sonraki_imsak);
	if(now_time >ramazan_baslama_tarihi && now_time < ramazan_bitis_tarihi ){	//Ramazan Başlayıp Başlamadığını Karar Veriyoruz Bu ifle
		 
		if( now_time > iftar_vakit && now_time < gun_sonu  ||  now_time > gecis_vakit && now_time < imsak_vakit  ){			//İftar_İmsak
			console.log("iftar imsak arası tebrikler");
			ekran_sozu = gunun_sozu_bir;
			show_flag=1;
			if(now_time > iftar_vakit && now_time < gun_sonu){
				sayac_durumu ="İmsak";
				sayac_ne_sayiyor= imsak_aksam;
				var kalan_one = gun_sonu.getTime() - now_time.getTime();
				var kalan_two = bi_sonraki_imsak_date.getTime() - gun_sonu.getTime();
				var kaldi = kalan_one + kalan_two;
				if (kaldi <= 0) {
					clearTimeout(timer);
					gerisayim();
				}
			}
			if(now_time > gecis_vakit && now_time < imsak_vakit){
				sayac_durumu ="İmsak";
				sayac_ne_sayiyor= imsak;
				var kalan_one = imsak_vakit.getTime() - now_time;
				var kalan_two = 0;
				var kaldi = kalan_one + kalan_two;
				if (kaldi <= 0) {
					clearTimeout(timer);
					gerisayim();
				}
			}
			
			
		}
		
		if(now_time > imsak_vakit && now_time < iftar_vakit){			//İmsak-İftar Arası
			ekran_sozu = gunun_sozu_iki;
			console.log("imsak-iftar arası");
			sayac_durumu ="İftar";
			sayac_ne_sayiyor= iftar;
			show_flag=1;
			var kaldi = iftar_vakit.getTime() - now_time.getTime();
			if (kaldi <= 0) {
				clearTimeout(timer);
				gerisayim();
			}
		}
		
	}else{																	//Ramazan Daha Başlamadı

		if(now_time > ramazan_bitis_tarihi){                                        //Ramazan Bitti
			show_flag=0;
			
		}	
		ekran_sozu = gunun_sozu[0];
		if(now_time<ramazan_baslama_tarihi){										//Ramazana Ne Kadar kaldıgını buluyoruz
			console.log("ramazan Daha Başlamadı");		
			show_flag=1;
			sayac_durumu ="Ramazan";
			sayac_ne_sayiyor= "09.07.2013";
			var kaldi = ramazan_baslama_tarihi.getTime()-now_time.getTime();
			if (kaldi <= 0) {
				clearTimeout(timer);
				gerisayim();
			}
		}
	}
	
	
	
		var seconds = Math.floor(kaldi / 1000);								//İşleyen Sabit Sayac
		var minutes = Math.floor(seconds / 60);
		var hours = Math.floor(minutes / 60);
		var days = Math.floor(hours / 24);
		hours %= 24;
		minutes %= 60;
		seconds %= 60;
		if(show_flag==1){
			document.getElementById("sayac_durumu").innerHTML =sayac_durumu;
			document.getElementById("sayac_durumu_second").innerHTML =sayac_durumu;
			document.getElementById("saat").innerHTML = hours ;
			document.getElementById("dakika").innerHTML = minutes ;
			document.getElementById("saniye").innerHTML = seconds ;
			document.getElementById("sayilan_vakit").innerHTML = sayac_ne_sayiyor ;
			document.getElementById("hadis").innerHTML = ekran_sozu ;
		}else{
			document.getElementById("sayac_durumu").innerHTML ="";
			document.getElementById("sayac_durumu_second").innerHTML ="";
			document.getElementById("sayilan_vakit").innerHTML ="" ;
			document.getElementById("saat").innerHTML = "";
			document.getElementById("dakika").innerHTML ="";
			document.getElementById("saniye").innerHTML ="";
			document.getElementById("hadis").innerHTML = "" ;
		}
	var timer = setTimeout('gerisayim()',1000);
}
	
function idate(){
	
	switch (tarih){
	case "7/9/2013":
		document.getElementById('title_imsak').innerHTML = gun_1[1];
		document.getElementById('title_ogle').innerHTML  = gun_1[3];
		document.getElementById('title_ikindi').innerHTML= gun_1[4];
		document.getElementById('title_aksam').innerHTML = gun_1[5];
		document.getElementById('title_yatsi').innerHTML = gun_1[6];
		imsak=gun_1[1];
		iftar=gun_1[5];
		bi_sonraki_imsak="7/10/2013" +" "+ gun_2[1];
		imsak_aksam=gun_2[1];
		gunun_sozu_bir=gunun_sozu[1];
		gunun_sozu_iki=gunun_sozu[2];
	break;
	case "7/10/2013":  
		document.getElementById('title_imsak').innerHTML = gun_2[1];
		document.getElementById('title_ogle').innerHTML  = gun_2[3];
		document.getElementById('title_ikindi').innerHTML= gun_2[4];
		document.getElementById('title_aksam').innerHTML = gun_2[5];
		document.getElementById('title_yatsi').innerHTML = gun_2[6];
		imsak=gun_2[1];
		iftar=gun_2[5];
		bi_sonraki_imsak="7/11/2013" + " " + gun_3[1];
		imsak_aksam=gun_3[1];
		gunun_sozu_bir=gunun_sozu[3];
		gunun_sozu_iki=gunun_sozu[4];
	break;
	case "7/11/2013":  
		document.getElementById('title_imsak').innerHTML = gun_3[1];
		document.getElementById('title_ogle').innerHTML  = gun_3[3];
		document.getElementById('title_ikindi').innerHTML= gun_3[4];
		document.getElementById('title_aksam').innerHTML = gun_3[5];
		document.getElementById('title_yatsi').innerHTML = gun_3[6];
		imsak=gun_3[1];
		iftar=gun_3[5];
		bi_sonraki_imsak="7/12/2013" + " " + gun_4[1];
		imsak_aksam=gun_4[1];
		gunun_sozu_bir=gunun_sozu[5];
		gunun_sozu_iki=gunun_sozu[6];
	break;
	case "7/12/2013":  
		document.getElementById('title_imsak').innerHTML = gun_4[1];
		document.getElementById('title_ogle').innerHTML  = gun_4[3];
		document.getElementById('title_ikindi').innerHTML= gun_4[4];
		document.getElementById('title_aksam').innerHTML = gun_4[5];
		document.getElementById('title_yatsi').innerHTML = gun_4[6];
		imsak=gun_4[1];
		iftar=gun_4[5];
		bi_sonraki_imsak="7/13/2013" + " " + gun_5[1];
		imsak_aksam=gun_5[1];
		gunun_sozu_bir=gunun_sozu[7];
		gunun_sozu_iki=gunun_sozu[8];
	break;
	case "7/13/2013":  
		document.getElementById('title_imsak').innerHTML = gun_5[1];
		document.getElementById('title_ogle').innerHTML  = gun_5[3];
		document.getElementById('title_ikindi').innerHTML= gun_5[4];
		document.getElementById('title_aksam').innerHTML = gun_5[5];
		document.getElementById('title_yatsi').innerHTML = gun_5[6];	
		imsak=gun_5[1];
		iftar=gun_5[5];
		bi_sonraki_imsak="7/14/2013" + " " + gun_6[1];
		imsak_aksam=gun_6[1];
		gunun_sozu_bir=gunun_sozu[9];
		gunun_sozu_iki=gunun_sozu[10];
	case "7/14/2013":  
		document.getElementById('title_imsak').innerHTML = gun_6[1];
		document.getElementById('title_ogle').innerHTML  = gun_6[3];
		document.getElementById('title_ikindi').innerHTML= gun_6[4];
		document.getElementById('title_aksam').innerHTML = gun_6[5];
		document.getElementById('title_yatsi').innerHTML = gun_6[6];
		imsak=gun_6[1];
		iftar=gun_6[5];
		bi_sonraki_imsak="7/15/2013" + " " + gun_7[1];
		imsak_aksam=gun_7[1];
		gunun_sozu_bir=gunun_sozu[11];
		gunun_sozu_iki=gunun_sozu[12];
	break;
	case "7/15/2013": 
		document.getElementById('title_imsak').innerHTML = gun_7[1];
		document.getElementById('title_ogle').innerHTML  = gun_7[3];
		document.getElementById('title_ikindi').innerHTML= gun_7[4];
		document.getElementById('title_aksam').innerHTML = gun_7[5];
		document.getElementById('title_yatsi').innerHTML = gun_7[6];
		imsak=gun_7[1];
		iftar=gun_7[5];
		bi_sonraki_imsak="7/16/2013" + " " + gun_8[1];
		imsak_aksam=gun_8[1];
		gunun_sozu_bir=gunun_sozu[13];
		gunun_sozu_iki=gunun_sozu[14];
	break;
	case "7/16/2013": 
		document.getElementById('title_imsak').innerHTML = gun_8[1];
		document.getElementById('title_ogle').innerHTML  = gun_8[3];
		document.getElementById('title_ikindi').innerHTML= gun_8[4];
		document.getElementById('title_aksam').innerHTML = gun_8[5];
		document.getElementById('title_yatsi').innerHTML = gun_8[6];
		imsak=gun_8[1];
		iftar=gun_8[5];
		bi_sonraki_imsak="7/17/2013" + " " + gun_9[1];
		imsak_aksam=gun_9[1];
		gunun_sozu_bir=gunun_sozu[15];
		gunun_sozu_iki=gunun_sozu[16];
	break;
	case "7/17/2013":  
		document.getElementById('title_imsak').innerHTML = gun_9[1];
		document.getElementById('title_ogle').innerHTML  = gun_9[3];
		document.getElementById('title_ikindi').innerHTML= gun_9[4];
		document.getElementById('title_aksam').innerHTML = gun_9[5];
		document.getElementById('title_yatsi').innerHTML = gun_9[6];
		imsak=gun_9[1];
		iftar=gun_9[5];
		bi_sonraki_imsak="7/18/2013" + " " +gun_10[1];
		imsak_aksam=gun_10[1];
		gunun_sozu_bir=gunun_sozu[17];
		gunun_sozu_iki=gunun_sozu[18];
	break;
	case "7/18/2013":  
		document.getElementById('title_imsak').innerHTML = gun_10[1];
		document.getElementById('title_ogle').innerHTML  = gun_10[3];
		document.getElementById('title_ikindi').innerHTML= gun_10[4];
		document.getElementById('title_aksam').innerHTML = gun_10[5];
		document.getElementById('title_yatsi').innerHTML = gun_10[6];
		imsak=gun_10[1];
		iftar=gun_10[5];
		bi_sonraki_imsak="7/19/2013" + " " + gun_11[1];
		imsak_aksam=gun_11[1];
		gunun_sozu_bir=gunun_sozu[19];
		gunun_sozu_iki=gunun_sozu[20];
	break;
	case "7/19/2013": 
		document.getElementById('title_imsak').innerHTML = gun_11[1];
		document.getElementById('title_ogle').innerHTML  = gun_11[3];
		document.getElementById('title_ikindi').innerHTML= gun_11[4];
		document.getElementById('title_aksam').innerHTML = gun_11[5];
		document.getElementById('title_yatsi').innerHTML = gun_11[6];
		imsak=gun_11[1];
		iftar=gun_11[5];
		bi_sonraki_imsak="7/20/2013" + " " + gun_12[1];
		imsak_aksam=gun_12[1];
		gunun_sozu_bir=gunun_sozu[21];
		gunun_sozu_iki=gunun_sozu[22];
	break;
	case "7/20/2013":
		document.getElementById('title_imsak').innerHTML = gun_12[1];
		document.getElementById('title_ogle').innerHTML  = gun_12[3];
		document.getElementById('title_ikindi').innerHTML= gun_12[4];
		document.getElementById('title_aksam').innerHTML = gun_12[5];
		document.getElementById('title_yatsi').innerHTML = gun_12[6];
		imsak=gun_12[1];
		iftar=gun_12[5];
		bi_sonraki_imsak="7/21/2013" + " " + gun_13[1];
		imsak_aksam=gun_13[1];
		gunun_sozu_bir=gunun_sozu[23];
		gunun_sozu_iki=gunun_sozu[24];
	break;
	case "7/21/2013": 
		document.getElementById('title_imsak').innerHTML = gun_13[1];
		document.getElementById('title_ogle').innerHTML  = gun_13[3];
		document.getElementById('title_ikindi').innerHTML= gun_13[4];
		document.getElementById('title_aksam').innerHTML = gun_13[5];
		document.getElementById('title_yatsi').innerHTML = gun_13[6];
		imsak=gun_13[1];
		iftar=gun_13[5];
		bi_sonraki_imsak="7/22/2013" + " " + gun_14[1];
		imsak_aksam=gun_14[1];
		gunun_sozu_bir=gunun_sozu[25];
		gunun_sozu_iki=gunun_sozu[26];
	break;
	case "7/22/2013": 
		document.getElementById('title_imsak').innerHTML = gun_14[1];
		document.getElementById('title_ogle').innerHTML  = gun_14[3];
		document.getElementById('title_ikindi').innerHTML= gun_14[4];
		document.getElementById('title_aksam').innerHTML = gun_14[5];
		document.getElementById('title_yatsi').innerHTML = gun_14[6];
		imsak=gun_14[1];
		iftar=gun_14[5];
		bi_sonraki_imsak="7/23/2013" + " " + gun_15[1];
		imsak_aksam=gun_15[1];
		gunun_sozu_bir=gunun_sozu[27];
		gunun_sozu_iki=gunun_sozu[28];
	break;
	case "7/23/2013": 
		document.getElementById('title_imsak').innerHTML = gun_15[1];
		document.getElementById('title_ogle').innerHTML  = gun_15[3];
		document.getElementById('title_ikindi').innerHTML= gun_15[4];
		document.getElementById('title_aksam').innerHTML = gun_15[5];
		document.getElementById('title_yatsi').innerHTML = gun_15[6];
		imsak=gun_15[1];
		iftar=gun_15[5];
		bi_sonraki_imsak="7/24/2013" + " " + gun_16[1];
		imsak_aksam= gun_16[1];
		gunun_sozu_bir=gunun_sozu[29];
		gunun_sozu_iki=gunun_sozu[30];
	break;
	case "7/24/2013": 
		document.getElementById('title_imsak').innerHTML = gun_16[1];
		document.getElementById('title_ogle').innerHTML  = gun_16[3];
		document.getElementById('title_ikindi').innerHTML= gun_16[4];
		document.getElementById('title_aksam').innerHTML = gun_16[5];
		document.getElementById('title_yatsi').innerHTML = gun_16[6];
		imsak=gun_16[1];
		iftar=gun_16[5];
		bi_sonraki_imsak="7/25/2013" + " " + gun_17[1];
		imsak_aksam=gun_17[1];
		gunun_sozu_bir=gunun_sozu[31];
		gunun_sozu_iki=gunun_sozu[32];
	break;
	case "7/25/2013": 
		document.getElementById('title_imsak').innerHTML = gun_17[1];
		document.getElementById('title_ogle').innerHTML  = gun_17[3];
		document.getElementById('title_ikindi').innerHTML= gun_17[4];
		document.getElementById('title_aksam').innerHTML = gun_17[5];
		document.getElementById('title_yatsi').innerHTML = gun_17[6];
		imsak=gun_17[1];
		iftar=gun_17[5];
		bi_sonraki_imsak="7/26/2013" + " " + gun_18[1];
		imsak_aksam=gun_18[1];
		gunun_sozu_bir=gunun_sozu[33];
		gunun_sozu_iki=gunun_sozu[34];
	break;
	case "7/26/2013": 
		document.getElementById('title_imsak').innerHTML = gun_18[1];
		document.getElementById('title_ogle').innerHTML  = gun_18[3];
		document.getElementById('title_ikindi').innerHTML= gun_18[4];
		document.getElementById('title_aksam').innerHTML = gun_18[5];
		document.getElementById('title_yatsi').innerHTML = gun_18[6];	
		imsak=gun_18[1];
		iftar=gun_18[5];
		bi_sonraki_imsak="7/27/2013" + " " + gun_19[1];
		imsak_aksam=gun_19[1];
		gunun_sozu_bir=gunun_sozu[35];
		gunun_sozu_iki=gunun_sozu[36];
	break;
	case "7/27/2013":
		document.getElementById('title_imsak').innerHTML = gun_19[1];
		document.getElementById('title_ogle').innerHTML  = gun_19[3];
		document.getElementById('title_ikindi').innerHTML= gun_19[4];
		document.getElementById('title_aksam').innerHTML = gun_19[5];
		document.getElementById('title_yatsi').innerHTML = gun_19[6];
		imsak=gun_19[1];
		iftar=gun_19[5];
		bi_sonraki_imsak="7/28/2013" + " " + gun_20[1];
		imsak_aksam=gun_20[1];
		gunun_sozu_bir=gunun_sozu[37];
		gunun_sozu_iki=gunun_sozu[38];
	break;
	case "7/28/2013": 
		document.getElementById('title_imsak').innerHTML = gun_20[1];
		document.getElementById('title_ogle').innerHTML  = gun_20[3];
		document.getElementById('title_ikindi').innerHTML= gun_20[4];
		document.getElementById('title_aksam').innerHTML = gun_20[5];
		document.getElementById('title_yatsi').innerHTML = gun_20[6];
		imsak=gun_20[1];
		iftar=gun_20[5];
		bi_sonraki_imsak="7/29/2013" + " " + gun_21[1];
		imsak_aksam=gun_21[1];
		gunun_sozu_bir=gunun_sozu[39];
		gunun_sozu_iki=gunun_sozu[40];
	break;
	case "7/29/2013": 
		document.getElementById('title_imsak').innerHTML = gun_21[1];
		document.getElementById('title_ogle').innerHTML  = gun_21[3];
		document.getElementById('title_ikindi').innerHTML= gun_21[4];
		document.getElementById('title_aksam').innerHTML = gun_21[5];
		document.getElementById('title_yatsi').innerHTML = gun_21[6];	
		imsak=gun_21[1];
		iftar=gun_21[5];
		bi_sonraki_imsak="7/30/2013" + " " + gun_22[1];
		imsak_aksam=gun_22[1];
		gunun_sozu_bir=gunun_sozu[41];
		gunun_sozu_iki=gunun_sozu[42];
	break;
	case "7/30/2013":  
		document.getElementById('title_imsak').innerHTML = gun_22[1];
		document.getElementById('title_ogle').innerHTML  = gun_22[3];
		document.getElementById('title_ikindi').innerHTML= gun_22[4];
		document.getElementById('title_aksam').innerHTML = gun_22[5];
		document.getElementById('title_yatsi').innerHTML = gun_22[6];
		imsak=gun_22[1];
		iftar=gun_22[5];
		bi_sonraki_imsak="7/31/2013" + " " + gun_23[1];
		imsak_aksam=gun_23[1];
		gunun_sozu_bir=gunun_sozu[43];
		gunun_sozu_iki=gunun_sozu[44];
	break;
	case "7/31/2013": 
		document.getElementById('title_imsak').innerHTML = gun_23[1];
		document.getElementById('title_ogle').innerHTML  = gun_23[3];
		document.getElementById('title_ikindi').innerHTML= gun_23[4];
		document.getElementById('title_aksam').innerHTML = gun_23[5];
		document.getElementById('title_yatsi').innerHTML = gun_23[6];
		imsak=gun_23[1];
		iftar=gun_23[5];
		bi_sonraki_imsak="8/1/2013" + " " + gun_24[1];
		imsak_aksam=gun_24[1];
		gunun_sozu_bir=gunun_sozu[45];
		gunun_sozu_iki=gunun_sozu[46];
	break;
	case "8/1/2013":  
		document.getElementById('title_imsak').innerHTML = gun_24[1];
		document.getElementById('title_ogle').innerHTML  = gun_24[3];
		document.getElementById('title_ikindi').innerHTML= gun_24[4];
		document.getElementById('title_aksam').innerHTML = gun_24[5];
		document.getElementById('title_yatsi').innerHTML = gun_24[6];
		imsak=gun_24[1];
		iftar=gun_24[5];
		bi_sonraki_imsak="8/2/2013" + " " + gun_25[1];
		imsak_aksam=gun_25[1];
		gunun_sozu_bir=gunun_sozu[47];
		gunun_sozu_iki=gunun_sozu[48];
	break;
	case "8/2/2013":  
		document.getElementById('title_imsak').innerHTML = gun_25[1];
		document.getElementById('title_ogle').innerHTML  = gun_25[3];
		document.getElementById('title_ikindi').innerHTML= gun_25[4];
		document.getElementById('title_aksam').innerHTML = gun_25[5];
		document.getElementById('title_yatsi').innerHTML = gun_25[6];
		imsak=gun_25[1];
		iftar=gun_25[5];
		bi_sonraki_imsak="8/3/2013" + " " + gun_26[1];
		imsak_aksam= gun_26[1];
		gunun_sozu_bir=gunun_sozu[49];
		gunun_sozu_iki=gunun_sozu[50];
	break;
	case "8/3/2013": 
		document.getElementById('title_imsak').innerHTML = gun_26[1];
		document.getElementById('title_ogle').innerHTML  = gun_26[3];
		document.getElementById('title_ikindi').innerHTML= gun_26[4];
		document.getElementById('title_aksam').innerHTML = gun_26[5];
		document.getElementById('title_yatsi').innerHTML = gun_26[6];
		imsak=gun_26[1];
		iftar=gun_26[5];
		bi_sonraki_imsak="8/4/2013" + " " + gun_27[1];
		imsak_aksam=gun_27[1];
		gunun_sozu_bir=gunun_sozu[51];
		gunun_sozu_iki=gunun_sozu[52];
	break;
	case "8/4/2013": 
		document.getElementById('title_imsak').innerHTML = gun_27[1];
		document.getElementById('title_ogle').innerHTML  = gun_27[3];
		document.getElementById('title_ikindi').innerHTML= gun_27[4];
		document.getElementById('title_aksam').innerHTML = gun_27[5];
		document.getElementById('title_yatsi').innerHTML = gun_27[6];
		imsak=gun_27[1];
		iftar=gun_27[5];
		bi_sonraki_imsak="8/5/2013" + " " + gun_28[1];
		imsak_aksam=gun_28[1];
		gunun_sozu_bir=gunun_sozu[53];
		gunun_sozu_iki=gunun_sozu[54];
	break;
	case "8/5/2013": 
		document.getElementById('title_imsak').innerHTML = gun_28[1];
		document.getElementById('title_ogle').innerHTML  = gun_28[3];
		document.getElementById('title_ikindi').innerHTML= gun_28[4];
		document.getElementById('title_aksam').innerHTML = gun_28[5];
		document.getElementById('title_yatsi').innerHTML = gun_28[6];
		imsak=gun_28[1];
		iftar=gun_28[5];
		bi_sonraki_imsak="8/6/2013" + " " + gun_29[1];
		imsak_aksam=gun_29[1];
		gunun_sozu_bir=gunun_sozu[55];
		gunun_sozu_iki=gunun_sozu[56];
	break;
	case "8/6/2013": 
		document.getElementById('title_imsak').innerHTML = gun_29[1];
		document.getElementById('title_ogle').innerHTML  = gun_29[3];
		document.getElementById('title_ikindi').innerHTML= gun_29[4];
		document.getElementById('title_aksam').innerHTML = gun_29[5];
		document.getElementById('title_yatsi').innerHTML = gun_29[6];
		imsak=gun_29[1];
		iftar=gun_29[5];
		bi_sonraki_imsak="8/7/2013" + " " + gun_30[1];
		imsak_aksam=gun_30[1];
		gunun_sozu_bir=gunun_sozu[57];
		gunun_sozu_iki=gunun_sozu[58];
	break;
	case "8/7/2013": 
		document.getElementById('title_imsak').innerHTML = gun_30[1];
		document.getElementById('title_ogle').innerHTML  = gun_30[3];
		document.getElementById('title_ikindi').innerHTML= gun_30[4];
		document.getElementById('title_aksam').innerHTML = gun_30[5];
		document.getElementById('title_yatsi').innerHTML = gun_30[6];
		imsak=gun_30[1];
		iftar=gun_30[5];
		bi_sonraki_imsak="8/7/2013" + " " + "23:00:00";
		imsak_aksam="23:00:00";
		gunun_sozu_bir=gunun_sozu[59];
		gunun_sozu_iki=gunun_sozu[60];
	break;
	}
}	
    
function city(){
	switch (sehir){
	
	case "adana":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("7/9/2013","03:35","05:20","12:51","16:40","20:10","21:45");
		gun_2      = 	new Array("7/10/2013","03:36","05:21","12:51","16:40","20:09","21:45");
		gun_3      =    new Array("7/11/2013","03:37","05:21","12:51","16:40","20:09","21:44");
		gun_4      =	new Array("7/12/2013","03:38","05:22","12:51","16:40","20:09","21:43");
		gun_5      =	new Array("7/13/2013","03:39","05:23","12:51","16:40","20:08","21:43");
		gun_6      =	new Array("7/14/2013","03:40","05:23","12:52","16:40","20:08","21:42");
		gun_7      = 	new Array("7/15/2013","03:41","05:24","12:52","16:40","20:07","21:41");
		gun_8      =	new Array("7/16/2013","03:42","05:25","12:52","16:40","20:07","21:40");
		gun_9      = 	new Array("7/17/2013","03:43","05:25","12:52","16:40","20:06","21:39");
		gun_10     = 	new Array("7/18/2013","03:44","05:26","12:52","16:40","20:06","21:38");
		gun_11     = 	new Array("7/19/2013","03:46","05:27","12:52","16:40","20:05","21:38");
		gun_12     = 	new Array("7/20/2013","03:47","05:28","12:52","16:40","20:04","21:37");
		gun_13     = 	new Array("7/21/2013","03:48","05:28","12:52","16:40","20:04","21:36");
		gun_14     = 	new Array("7/22/2013","03:49","05:29","12:52","16:40","20:03","21:35");
		gun_15     = 	new Array("7/23/2013","03:50","05:30","12:52","16:40","20:02","21:33");
		gun_16     = 	new Array("7/24/2013","03:51","05:31","12:52","16:40","20:02","21:32");
		gun_17     = 	new Array("7/25/2013","03:52","05:31","12:52","16:40","20:01","21:31");
		gun_18     = 	new Array("7/26/2013","03:54","05:32","12:52","16:39","20:00","21:30");
		gun_19     = 	new Array("7/27/2013","03:55","05:33","12:52","16:39","19:59","21:29");
		gun_20     = 	new Array("7/28/2013","03:56","05:34","12:52","16:39","19:59","21:28");
		gun_21     = 	new Array("7/29/2013","03:57","05:35","12:52","16:39","19:58","21:27");
		gun_22     = 	new Array("7/30/2013","03:58","05:35","12:52","16:39","19:57","21:25");
		gun_23     = 	new Array("7/31/2013","04:00","05:36","12:52","16:38","19:56","21:24");
		gun_24     = 	new Array("8/1/2013","04:01","05:37","12:52","16:38","19:55","21:23");
		gun_25     = 	new Array("8/2/2013","04:02","05:38","12:52","16:38","19:54","21:21");
		gun_26     = 	new Array("8/3/2013","04:02","05:38","12:52","16:38","19:54","21:21");
		gun_27     =	new Array("8/4/2013","04:03","05:39","12:52","16:38","19:53","21:20");
		gun_28     =	new Array("8/5/2013","04:03","05:39","12:52","16:38","19:53","21:20");
		gun_29     =	new Array("8/6/2013","04:04","05:39","12:52","16:37","19:52","21:19");
		gun_30     =	new Array("8/7/2013","04:04","05:39","12:52","16:37","19:52","21:19");

		
	break;
	case "adiyaman":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADIYAMAN+
        gun_1      =    new Array("7/9/2013","03:19","05:06","12:39","16:30","20:00","21:37");
        gun_2      =    new Array("7/10/2013","03:20","05:07","12:39","16:30","20:00","21:37");
        gun_3      =    new Array("7/11/2013","03:21","05:07","12:39","16:30","19:59","21:36");
        gun_4      =    new Array("7/12/2013","03:22","05:08","12:40","16:30","19:59","21:35");
        gun_5      =    new Array("7/13/2013","03:23","05:09","12:40","16:30","19:58","21:35");
        gun_6      =    new Array("7/14/2013","03:24","05:09","12:40","16:30","19:58","21:34");
        gun_7      =    new Array("7/15/2013","03:25","05:10","12:40","16:30","19:58","21:33");
        gun_8      =    new Array("7/16/2013","03:26","05:11","12:40","16:30","19:57","21:32");
        gun_9      =    new Array("7/17/2013","03:27","05:12","12:40","16:30","19:56","21:31");
        gun_10     =    new Array("7/18/2013","03:29","05:12","12:40","16:30","19:56","21:30");
        gun_11     =    new Array("7/19/2013","03:30","05:13","12:40","16:30","19:55","21:30");
        gun_12     =    new Array("7/20/2013","03:31","05:14","12:40","16:30","19:55","21:29");
        gun_13     =    new Array("7/21/2013","03:32","05:15","12:40","16:30","19:54","21:27");
        gun_14     =    new Array("7/22/2013","03:33","05:15","12:40","16:30","19:53","21:26");
        gun_15     =    new Array("7/23/2013","03:34","05:16","12:40","16:29","19:53","21:25");
        gun_16     =    new Array("7/24/2013","03:36","05:17","12:40","16:29","19:52","21:24");
        gun_17     =    new Array("7/25/2013","03:37","05:18","12:40","16:29","19:51","21:23");
        gun_18     =    new Array("7/26/2013","03:38","05:19","12:40","16:29","19:50","21:22");
        gun_19     =    new Array("7/27/2013","03:39","05:19","12:40","16:29","19:49","21:21");
        gun_20     =    new Array("7/28/2013","03:41","05:20","12:40","16:29","19:49","21:19");
        gun_21     =    new Array("7/29/2013","03:42","05:21","12:40","16:28","19:48","21:18");
        gun_22     =    new Array("7/30/2013","03:43","05:22","12:40","16:28","19:47","21:17");
        gun_23     =    new Array("7/31/2013","03:44","05:23","12:40","16:28","19:46","21:16");
        gun_24     =    new Array("8/1/2013","03:46","05:23","12:40","16:28","19:45","21:14");
        gun_25     =    new Array("8/2/2013","03:47","05:24","12:40","16:27","19:44","21:13");
        gun_26     =    new Array("8/3/2013","03:48","05:25","12:40","16:27","19:43","21:11");
        gun_27     =    new Array("8/4/2013","03:49","05:26","12:40","16:27","19:42","21:10");
        gun_28     =    new Array("8/5/2013","03:51","05:27","12:40","16:26","19:41","21:09");
        gun_29     =    new Array("8/6/2013","03:52","05:28","12:40","16:26","19:40","21:07");
        gun_30     =    new Array("8/7/2013","03:53","05:29","12:40","16:26","19:39","21:06");

	break;
	case "afyon":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  AFYON+
        gun_1      =    new Array("7/9/2013","03:44","05:34","13:10","17:03","20:34","22:14");
        gun_2      =    new Array("7/10/2013","03:45","05:35","13:10","17:03","20:33","22:13");
        gun_3      =    new Array("7/11/2013","03:46","05:35","13:10","17:03","20:33","22:13");
        gun_4      =    new Array("7/12/2013","03:47","05:36","13:11","17:03","20:33","22:12");
        gun_5      =    new Array("7/13/2013","03:48","05:37","13:11","17:03","20:32","22:11");
        gun_6      =    new Array("7/14/2013","03:49","05:38","13:11","17:03","20:32","22:10");
        gun_7      =    new Array("7/15/2013","03:51","05:38","13:11","17:03","20:31","22:09");
        gun_8      =    new Array("7/16/2013","03:52","05:39","13:11","17:03","20:31","22:09");
        gun_9      =    new Array("7/17/2013","03:53","05:40","13:11","17:03","20:30","22:08");
        gun_10     =    new Array("7/18/2013","03:54","05:41","13:11","17:03","20:29","22:07");
        gun_11     =    new Array("7/19/2013","03:55","05:41","13:11","17:03","20:29","22:06");
        gun_12     =    new Array("7/20/2013","03:56","05:42","13:11","17:02","20:28","22:05");
        gun_13     =    new Array("7/21/2013","03:58","05:43","13:11","17:02","20:27","22:03");
        gun_14     =    new Array("7/22/2013","03:59","05:44","13:11","17:02","20:27","22:02");
        gun_15     =    new Array("7/23/2013","04:00","05:45","13:11","17:02","20:26","22:01");
        gun_16     =    new Array("7/24/2013","04:01","05:45","13:11","17:02","20:25","22:00");
        gun_17     =    new Array("7/25/2013","04:03","05:46","13:11","17:02","20:24","21:59");
        gun_18     =    new Array("7/26/2013","04:04","05:47","13:11","17:02","20:24","21:58");
        gun_19     =    new Array("7/27/2013","04:05","05:48","13:11","17:01","20:23","21:56");
        gun_20     =    new Array("7/28/2013","04:07","05:49","13:11","17:01","20:22","21:55");
        gun_21     =    new Array("7/29/2013","04:08","05:50","13:11","17:01","20:21","21:54");
        gun_22     =    new Array("7/30/2013","04:09","05:50","13:11","17:01","20:20","21:52");
        gun_23     =    new Array("7/31/2013","04:11","05:51","13:11","17:00","20:19","21:51");
        gun_24     =    new Array("8/1/2013","04:12","05:52","13:11","17:00","20:18","21:49");
        gun_25     =    new Array("8/2/2013","04:13","05:53","13:11","17:00","20:17","21:48");
        gun_26     =    new Array("8/3/2013","04:15","05:54","13:11","17:00","20:16","21:47");
        gun_27     =    new Array("8/4/2013","04:16","05:55","13:11","16:59","20:15","21:45");
        gun_28     =    new Array("8/5/2013","04:17","05:56","13:11","16:59","20:14","21:44");
        gun_29     =    new Array("8/6/2013","04:19","05:57","13:11","16:58","20:13","21:42");
        gun_30     =    new Array("8/7/2013","04:20","05:58","13:11","16:58","20:12","21:41");

	break;
	case "agri":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  AGRI+
        gun_1      =    new Array("7/9/2013","02:48","04:41","12:20","16:15","19:47","21:30");
        gun_2      =    new Array("7/10/2013","02:49","04:42","12:20","16:15","19:46","21:29");
        gun_3      =    new Array("7/11/2013","02:50","04:43","12:20","16:15","19:46","21:29");
        gun_4      =    new Array("7/12/2013","02:51","04:43","12:21","16:15","19:45","21:28");
        gun_5      =    new Array("7/13/2013","02:52","04:44","12:21","16:15","19:45","21:27");
        gun_6      =    new Array("7/14/2013","02:53","04:45","12:21","16:15","19:44","21:26");
        gun_7      =    new Array("7/15/2013","02:55","04:46","12:21","16:15","19:44","21:25");
        gun_8      =    new Array("7/16/2013","02:56","04:46","12:21","16:15","19:43","21:24");
        gun_9      =    new Array("7/17/2013","02:57","04:47","12:21","16:15","19:43","21:23");
        gun_10     =    new Array("7/18/2013","02:58","04:48","12:21","16:14","19:42","21:22");
        gun_11     =    new Array("7/19/2013","03:00","04:49","12:21","16:14","19:41","21:21");
        gun_12     =    new Array("7/20/2013","03:01","04:49","12:21","16:14","19:41","21:20");
        gun_13     =    new Array("7/21/2013","03:02","04:50","12:21","16:14","19:40","21:19");
        gun_14     =    new Array("7/22/2013","03:04","04:51","12:21","16:14","19:39","21:17");
        gun_15     =    new Array("7/23/2013","03:05","04:52","12:21","16:14","19:39","21:16");
        gun_16     =    new Array("7/24/2013","03:06","04:53","12:21","16:14","19:38","21:15");
        gun_17     =    new Array("7/25/2013","03:08","04:54","12:21","16:13","19:37","21:14");
        gun_18     =    new Array("7/26/2013","03:09","04:55","12:21","16:13","19:36","21:12");
        gun_19     =    new Array("7/27/2013","03:10","04:55","12:21","16:13","19:35","21:11");
        gun_20     =    new Array("7/28/2013","03:12","04:56","12:21","16:13","19:34","21:10");
        gun_21     =    new Array("7/29/2013","03:13","04:57","12:21","16:13","19:33","21:08");
        gun_22     =    new Array("7/30/2013","03:15","04:58","12:21","16:12","19:32","21:07");
        gun_23     =    new Array("7/31/2013","03:16","04:59","12:21","16:12","19:31","21:05");
        gun_24     =    new Array("8/1/2013","03:17","05:00","12:21","16:12","19:30","21:04");
        gun_25     =    new Array("8/2/2013","03:19","05:01","12:21","16:11","19:29","21:02");
        gun_26     =    new Array("8/3/2013","03:20","05:02","12:21","16:11","19:28","21:01");
        gun_27     =    new Array("8/4/2013","03:22","05:03","12:21","16:11","19:27","20:59");
        gun_28     =    new Array("8/5/2013","03:23","05:04","12:21","16:10","19:26","20:58");
        gun_29     =    new Array("8/6/2013","03:24","05:05","12:21","16:10","19:25","20:56");
        gun_30     =    new Array("8/7/2013","03:26","05:05","12:21","16:09","19:24","20:55");
		
	break;
	case "aksaray":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  AKSARAY+
        gun_1      =    new Array("7/9/2013","03:33","05:21","12:56","16:48","20:19","21:58");
        gun_2      =    new Array("7/10/2013","03:34","05:22","12:56","16:48","20:18","21:57");
        gun_3      =    new Array("7/11/2013","03:35","05:23","12:56","16:48","20:18","21:57");
        gun_4      =    new Array("7/12/2013","03:36","05:23","12:57","16:48","20:18","21:56");
        gun_5      =    new Array("7/13/2013","03:37","05:24","12:57","16:48","20:17","21:55");
        gun_6      =    new Array("7/14/2013","03:38","05:25","12:57","16:48","20:17","21:54");
        gun_7      =    new Array("7/15/2013","03:39","05:25","12:57","16:48","20:16","21:53");
        gun_8      =    new Array("7/16/2013","03:40","05:26","12:57","16:48","20:16","21:53");
        gun_9      =    new Array("7/17/2013","03:41","05:27","12:57","16:48","20:15","21:52");
        gun_10     =    new Array("7/18/2013","03:42","05:28","12:57","16:48","20:14","21:51");
        gun_11     =    new Array("7/19/2013","03:43","05:28","12:57","16:48","20:14","21:50");
        gun_12     =    new Array("7/20/2013","03:45","05:29","12:57","16:48","20:13","21:49");
        gun_13     =    new Array("7/21/2013","03:46","05:30","12:57","16:48","20:12","21:48");
        gun_14     =    new Array("7/22/2013","03:47","05:31","12:57","16:48","20:12","21:46");
        gun_15     =    new Array("7/23/2013","03:48","05:32","12:57","16:47","20:11","21:45");
        gun_16     =    new Array("7/24/2013","03:50","05:32","12:57","16:47","20:10","21:44");
        gun_17     =    new Array("7/25/2013","03:51","05:33","12:57","16:47","20:09","21:43");
        gun_18     =    new Array("7/26/2013","03:52","05:34","12:57","16:47","20:09","21:42");
        gun_19     =    new Array("7/27/2013","03:53","05:35","12:57","16:47","20:08","21:40");
        gun_20     =    new Array("7/28/2013","03:55","05:36","12:57","16:47","20:07","21:39");
        gun_21     =    new Array("7/29/2013","03:56","05:37","12:57","16:46","20:06","21:38");
        gun_22     =    new Array("7/30/2013","03:57","05:37","12:57","16:46","20:05","21:37");
        gun_23     =    new Array("7/31/2013","03:59","05:38","12:57","16:46","20:04","21:35");
        gun_24     =    new Array("8/1/2013","04:00","05:39","12:57","16:46","20:03","21:34");
        gun_25     =    new Array("8/2/2013","04:01","05:40","12:57","16:45","20:02","21:32");
        gun_26     =    new Array("8/3/2013","04:03","05:41","12:57","16:45","20:01","21:31");
        gun_27     =    new Array("8/4/2013","04:04","05:42","12:57","16:45","20:00","21:30");
        gun_28     =    new Array("8/5/2013","04:05","05:43","12:57","16:44","19:59","21:28");
        gun_29     =    new Array("8/6/2013","04:06","05:43","12:57","16:44","19:58","21:27");
        gun_30     =    new Array("8/7/2013","04:08","05:44","12:57","16:44","19:57","21:25");
		
	break;
	case "amasya":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  AMASYA+
        gun_1      =    new Array("7/9/2013","03:10","05:07","12:49","16:45","20:18","22:05");
        gun_2      =    new Array("7/10/2013","03:11","05:08","12:49","16:45","20:18","22:04");
        gun_3      =    new Array("7/11/2013","03:13","05:09","12:49","16:45","20:18","22:03");
        gun_4      =    new Array("7/12/2013","03:14","05:09","12:49","16:45","20:17","22:02");
        gun_5      =    new Array("7/13/2013","03:15","05:10","12:49","16:45","20:17","22:02");
        gun_6      =    new Array("7/14/2013","03:16","05:11","12:50","16:45","20:16","22:01");
        gun_7      =    new Array("7/15/2013","03:17","05:12","12:50","16:45","20:16","22:00");
        gun_8      =    new Array("7/16/2013","03:19","05:12","12:50","16:45","20:15","21:59");
        gun_9      =    new Array("7/17/2013","03:20","05:13","12:50","16:45","20:14","21:58");
        gun_10     =    new Array("7/18/2013","03:21","05:14","12:50","16:45","20:14","21:56");
        gun_11     =    new Array("7/19/2013","03:23","05:15","12:50","16:45","20:13","21:55");
        gun_12     =    new Array("7/20/2013","03:24","05:16","12:50","16:45","20:12","21:54");
        gun_13     =    new Array("7/21/2013","03:25","05:17","12:50","16:45","20:12","21:53");
        gun_14     =    new Array("7/22/2013","03:27","05:17","12:50","16:45","20:11","21:52");
        gun_15     =    new Array("7/23/2013","03:28","05:18","12:50","16:44","20:10","21:50");
        gun_16     =    new Array("7/24/2013","03:30","05:19","12:50","16:44","20:09","21:49");
        gun_17     =    new Array("7/25/2013","03:31","05:20","12:50","16:44","20:08","21:48");
        gun_18     =    new Array("7/26/2013","03:33","05:21","12:50","16:44","20:07","21:46");
        gun_19     =    new Array("7/27/2013","03:34","05:22","12:50","16:43","20:06","21:45");
        gun_20     =    new Array("7/28/2013","03:35","05:23","12:50","16:43","20:05","21:43");
        gun_21     =    new Array("7/29/2013","03:37","05:24","12:50","16:43","20:04","21:42");
        gun_22     =    new Array("7/30/2013","03:38","05:25","12:50","16:43","20:03","21:40");
        gun_23     =    new Array("7/31/2013","03:40","05:26","12:50","16:42","20:02","21:39");
        gun_24     =    new Array("8/1/2013","03:41","05:27","12:50","16:42","20:01","21:37");
        gun_25     =    new Array("8/2/2013","03:43","05:28","12:50","16:42","20:00","21:36");
        gun_26     =    new Array("8/3/2013","03:44","05:28","12:50","16:41","19:59","21:34");
        gun_27     =    new Array("8/4/2013","03:46","05:29","12:50","16:41","19:58","21:33");
        gun_28     =    new Array("8/5/2013","03:47","05:30","12:50","16:40","19:57","21:31");
        gun_29     =    new Array("8/6/2013","03:49","05:31","12:50","16:40","19:56","21:29");
        gun_30     =    new Array("8/7/2013","03:50","05:32","12:50","16:39","19:54","21:28");
	
	break;
	case "ankara":	
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ANKARA+
        gun_1      =    new Array("7/9/2013","03:27","05:21","13:01","16:56","20:28","22:12");
        gun_2      =    new Array("7/10/2013","03:28","05:22","13:01","16:56","20:28","22:11");
        gun_3      =    new Array("7/11/2013","03:29","05:23","13:01","16:56","20:27","22:11");
        gun_4      =    new Array("7/12/2013","03:30","05:23","13:01","16:56","20:27","22:10");
        gun_5      =    new Array("7/13/2013","03:32","05:24","13:01","16:56","20:26","22:09");
        gun_6      =    new Array("7/14/2013","03:33","05:25","13:02","16:56","20:26","22:08");
        gun_7      =    new Array("7/15/2013","03:34","05:26","13:02","16:56","20:25","22:07");
        gun_8      =    new Array("7/16/2013","03:35","05:26","13:02","16:56","20:25","22:06");
        gun_9      =    new Array("7/17/2013","03:36","05:27","13:02","16:56","20:24","22:05");
        gun_10     =    new Array("7/18/2013","03:38","05:28","13:02","16:56","20:24","22:04");
        gun_11     =    new Array("7/19/2013","03:39","05:29","13:02","16:56","20:23","22:03");
        gun_12     =    new Array("7/20/2013","03:40","05:30","13:02","16:55","20:22","22:02");
        gun_13     =    new Array("7/21/2013","03:42","05:30","13:02","16:55","20:21","22:01");
        gun_14     =    new Array("7/22/2013","03:43","05:31","13:02","16:55","20:21","21:59");
        gun_15     =    new Array("7/23/2013","03:44","05:32","13:02","16:55","20:20","21:58");
        gun_16     =    new Array("7/24/2013","03:46","05:33","13:02","16:55","20:19","21:57");
        gun_17     =    new Array("7/25/2013","03:47","05:34","13:02","16:55","20:18","21:56");
        gun_18     =    new Array("7/26/2013","03:49","05:35","13:02","16:54","20:17","21:54");
        gun_19     =    new Array("7/27/2013","03:50","05:36","13:02","16:54","20:16","21:53");
        gun_20     =    new Array("7/28/2013","03:51","05:37","13:02","16:54","20:16","21:52");
        gun_21     =    new Array("7/29/2013","03:53","05:37","13:02","16:54","20:15","21:50");
        gun_22     =    new Array("7/30/2013","03:54","05:38","13:02","16:53","20:14","21:49");
        gun_23     =    new Array("7/31/2013","03:56","05:39","13:02","16:53","20:13","21:47");
        gun_24     =    new Array("8/1/2013","03:57","05:40","13:02","16:53","20:12","21:46");
        gun_25     =    new Array("8/2/2013","03:58","05:41","13:02","16:52","20:10","21:44");
        gun_26     =    new Array("8/3/2013","04:00","05:42","13:02","16:52","20:09","21:43");
        gun_27     =    new Array("8/4/2013","04:01","05:43","13:02","16:52","20:08","21:41");
        gun_28     =    new Array("8/5/2013","04:01","05:43","13:02","16:52","20:08","21:41");
        gun_29     =    new Array("8/6/2013","04:03","05:44","13:02","16:51","20:07","21:40");
        gun_30     =    new Array("8/7/2013","04:03","05:44","13:02","16:51","20:07","21:40");

	break;
	case "antalya":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ANTALYA+
        gun_1      =    new Array("7/9/2013","03:55","05:39","13:10","16:58","20:28","22:03");
        gun_2      =    new Array("7/10/2013","03:56","05:40","13:10","16:58","20:28","22:03");
        gun_3      =    new Array("7/11/2013","03:56","05:40","13:10","16:58","20:27","22:02");
        gun_4      =    new Array("7/12/2013","03:57","05:41","13:10","16:58","20:27","22:01");
        gun_5      =    new Array("7/13/2013","03:58","05:42","13:10","16:58","20:26","22:01");
        gun_6      =    new Array("7/14/2013","03:59","05:42","13:10","16:58","20:26","22:00");
        gun_7      =    new Array("7/15/2013","04:00","05:43","13:10","16:58","20:26","21:59");
        gun_8      =    new Array("7/16/2013","04:01","05:44","13:10","16:58","20:25","21:58");
        gun_9      =    new Array("7/17/2013","04:02","05:44","13:10","16:58","20:25","21:57");
        gun_10     =    new Array("7/18/2013","04:04","05:45","13:11","16:58","20:24","21:56");
        gun_11     =    new Array("7/19/2013","04:05","05:46","13:11","16:58","20:23","21:56");
        gun_12     =    new Array("7/20/2013","04:06","05:46","13:11","16:58","20:23","21:55");
        gun_13     =    new Array("7/21/2013","04:07","05:47","13:11","16:58","20:22","21:54");
        gun_14     =    new Array("7/22/2013","04:08","05:48","13:11","16:58","20:21","21:53");
        gun_15     =    new Array("7/23/2013","04:09","05:49","13:11","16:58","20:21","21:52");
        gun_16     =    new Array("7/24/2013","04:10","05:49","13:11","16:58","20:20","21:51");
        gun_17     =    new Array("7/25/2013","04:11","05:50","13:11","16:58","20:19","21:49");
        gun_18     =    new Array("7/26/2013","04:13","05:51","13:11","16:58","20:18","21:48");
        gun_19     =    new Array("7/27/2013","04:14","05:52","13:11","16:58","20:18","21:47");
        gun_20     =    new Array("7/28/2013","04:15","05:53","13:11","16:57","20:17","21:46");
        gun_21     =    new Array("7/29/2013","04:16","05:53","13:11","16:57","20:16","21:45");
        gun_22     =    new Array("7/30/2013","04:17","05:54","13:11","16:57","20:15","21:43");
        gun_23     =    new Array("7/31/2013","04:19","05:55","13:11","16:57","20:14","21:42");
        gun_24     =    new Array("8/1/2013","04:20","05:56","13:11","16:57","20:13","21:41");
        gun_25     =    new Array("8/2/2013","04:21","05:57","13:11","16:56","20:12","21:40");
        gun_26     =    new Array("8/3/2013","04:22","05:57","13:11","16:56","20:11","21:38");
        gun_27     =    new Array("8/4/2013","04:24","05:58","13:10","16:56","20:10","21:37");
        gun_28     =    new Array("8/5/2013","04:25","05:59","13:10","16:56","20:09","21:36");
        gun_29     =    new Array("8/6/2013","04:26","06:00","13:10","16:55","20:08","21:34");
        gun_30     =    new Array("8/7/2013","04:27","06:01","13:10","16:55","20:07","21:33");	
		
	break;
	case "ardahan":
		 // Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ARDAHAN+
        gun_1      =    new Array("7/9/2013","02:39","04:38","12:21","16:19","19:52","21:41");
        gun_2      =    new Array("7/10/2013","02:41","04:39","12:22","16:19","19:52","21:40");
        gun_3      =    new Array("7/11/2013","02:42","04:40","12:22","16:19","19:52","21:39");
        gun_4      =    new Array("7/12/2013","02:43","04:40","12:22","16:19","19:51","21:38");
        gun_5      =    new Array("7/13/2013","02:44","04:41","12:22","16:19","19:51","21:37");
        gun_6      =    new Array("7/14/2013","02:45","04:42","12:22","16:19","19:50","21:36");
        gun_7      =    new Array("7/15/2013","02:47","04:43","12:22","16:19","19:49","21:35");
        gun_8      =    new Array("7/16/2013","02:48","04:44","12:22","16:19","19:49","21:34");
        gun_9      =    new Array("7/17/2013","02:49","04:44","12:22","16:18","19:48","21:33");
        gun_10     =    new Array("7/18/2013","02:51","04:45","12:22","16:18","19:48","21:32");
        gun_11     =    new Array("7/19/2013","02:52","04:46","12:23","16:18","19:47","21:31");
        gun_12     =    new Array("7/20/2013","02:54","04:47","12:23","16:18","19:46","21:29");
        gun_13     =    new Array("7/21/2013","02:55","04:48","12:23","16:18","19:45","21:28");
        gun_14     =    new Array("7/22/2013","02:56","04:49","12:23","16:18","19:45","21:27");
        gun_15     =    new Array("7/23/2013","02:58","04:50","12:23","16:18","19:44","21:25");
        gun_16     =    new Array("7/24/2013","02:59","04:50","12:23","16:17","19:43","21:24");
        gun_17     =    new Array("7/25/2013","03:01","04:51","12:23","16:17","19:42","21:23");
        gun_18     =    new Array("7/26/2013","03:02","04:52","12:23","16:17","19:41","21:21");
        gun_19     =    new Array("7/27/2013","03:04","04:53","12:23","16:17","19:40","21:20");
        gun_20     =    new Array("7/28/2013","03:05","04:54","12:23","16:16","19:39","21:18");
        gun_21     =    new Array("7/29/2013","03:07","04:55","12:23","16:16","19:38","21:17");
        gun_22     =    new Array("7/30/2013","03:08","04:56","12:23","16:16","19:37","21:15");
        gun_23     =    new Array("7/31/2013","03:10","04:57","12:23","16:15","19:36","21:14");
        gun_24     =    new Array("8/1/2013","03:11","04:58","12:23","16:15","19:35","21:12");
        gun_25     =    new Array("8/2/2013","03:13","04:59","12:23","16:15","19:34","21:11");
        gun_26     =    new Array("8/3/2013","03:15","05:00","12:22","16:14","19:33","21:09");
        gun_27     =    new Array("8/4/2013","03:16","05:01","12:22","16:14","19:32","21:07");
        gun_28     =    new Array("8/5/2013","03:18","05:02","12:22","16:13","19:30","21:06");
        gun_29     =    new Array("8/6/2013","03:19","05:03","12:22","16:13","19:29","21:04");
        gun_30     =    new Array("8/7/2013","03:21","05:04","12:22","16:13","19:28","21:02");
		
	break;
	case "artvin":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ARTVİN+
        gun_1      =    new Array("7/9/2013","02:43","04:42","12:25","16:22","19:56","21:45");
        gun_2      =    new Array("7/10/2013","02:44","04:42","12:25","16:22","19:56","21:44");
        gun_3      =    new Array("7/11/2013","02:45","04:43","12:25","16:22","19:55","21:43");
        gun_4      =    new Array("7/12/2013","02:46","04:44","12:25","16:22","19:55","21:42");
        gun_5      =    new Array("7/13/2013","02:47","04:45","12:26","16:22","19:54","21:41");
        gun_6      =    new Array("7/14/2013","02:49","04:45","12:26","16:22","19:54","21:40");
        gun_7      =    new Array("7/15/2013","02:50","04:46","12:26","16:22","19:53","21:39");
        gun_8      =    new Array("7/16/2013","02:51","04:47","12:26","16:22","19:53","21:38");
        gun_9      =    new Array("7/17/2013","02:53","04:48","12:26","16:22","19:52","21:37");
        gun_10     =    new Array("7/18/2013","02:54","04:49","12:26","16:22","19:51","21:36");
        gun_11     =    new Array("7/19/2013","02:55","04:49","12:26","16:22","19:51","21:34");
        gun_12     =    new Array("7/20/2013","02:57","04:50","12:26","16:22","19:50","21:33");
        gun_13     =    new Array("7/21/2013","02:58","04:51","12:26","16:22","19:49","21:32");
        gun_14     =    new Array("7/22/2013","03:00","04:52","12:26","16:21","19:48","21:31");
        gun_15     =    new Array("7/23/2013","03:01","04:53","12:26","16:21","19:47","21:29");
        gun_16     =    new Array("7/24/2013","03:03","04:54","12:26","16:21","19:47","21:28");
        gun_17     =    new Array("7/25/2013","03:04","04:55","12:26","16:21","19:46","21:27");
        gun_18     =    new Array("7/26/2013","03:06","04:56","12:26","16:21","19:45","21:25");
        gun_19     =    new Array("7/27/2013","03:07","04:57","12:26","16:20","19:44","21:24");
        gun_20     =    new Array("7/28/2013","03:09","04:58","12:26","16:20","19:43","21:22");
        gun_21     =    new Array("7/29/2013","03:10","04:58","12:26","16:20","19:42","21:21");
        gun_22     =    new Array("7/30/2013","03:12","04:59","12:26","16:19","19:41","21:19");
        gun_23     =    new Array("7/31/2013","03:13","05:00","12:26","16:19","19:40","21:18");
        gun_24     =    new Array("8/1/2013","03:15","05:01","12:26","16:19","19:39","21:16");
        gun_25     =    new Array("8/2/2013","03:16","05:02","12:26","16:18","19:38","21:14");
        gun_26     =    new Array("8/3/2013","03:18","05:03","12:26","16:18","19:36","21:13");
        gun_27     =    new Array("8/4/2013","03:19","05:04","12:26","16:18","19:35","21:11");
        gun_28     =    new Array("8/5/2013","03:21","05:05","12:26","16:17","19:34","21:09");
        gun_29     =    new Array("8/6/2013","03:22","05:06","12:26","16:17","19:33","21:08");
        gun_30     =    new Array("8/7/2013","03:24","05:07","12:26","16:16","19:32","21:06");
			
	break;
	case "aydin":
	   // Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  AYDIN+
        gun_1      =    new Array("7/9/2013","04:00","05:48","13:21","17:12","20:42","22:20");
        gun_2      =    new Array("7/10/2013","04:01","05:48","13:21","17:12","20:42","22:19");
        gun_3      =    new Array("7/11/2013","04:02","05:49","13:21","17:12","20:41","22:18");
        gun_4      =    new Array("7/12/2013","04:03","05:50","13:21","17:12","20:41","22:18");
        gun_5      =    new Array("7/13/2013","04:04","05:50","13:21","17:12","20:40","22:17");
        gun_6      =    new Array("7/14/2013","04:05","05:51","13:22","17:12","20:40","22:16");
        gun_7      =    new Array("7/15/2013","04:06","05:52","13:22","17:12","20:39","22:15");
        gun_8      =    new Array("7/16/2013","04:08","05:52","13:22","17:12","20:39","22:15");
        gun_9      =    new Array("7/17/2013","04:09","05:53","13:22","17:12","20:38","22:14");
        gun_10     =    new Array("7/18/2013","04:10","05:54","13:22","17:12","20:38","22:13");
        gun_11     =    new Array("7/19/2013","04:11","05:55","13:22","17:12","20:37","22:12");
        gun_12     =    new Array("7/20/2013","04:12","05:55","13:22","17:12","20:37","22:11");
        gun_13     =    new Array("7/21/2013","04:13","05:56","13:22","17:12","20:36","22:10");
        gun_14     =    new Array("7/22/2013","04:14","05:57","13:22","17:11","20:35","22:09");
        gun_15     =    new Array("7/23/2013","04:16","05:58","13:22","17:11","20:35","22:08");
        gun_16     =    new Array("7/24/2013","04:17","05:58","13:22","17:11","20:34","22:06");
        gun_17     =    new Array("7/25/2013","04:18","05:59","13:22","17:11","20:33","22:05");
        gun_18     =    new Array("7/26/2013","04:19","06:00","13:22","17:11","20:32","22:04");
        gun_19     =    new Array("7/27/2013","04:21","06:01","13:22","17:11","20:31","22:03");
        gun_20     =    new Array("7/28/2013","04:22","06:02","13:22","17:10","20:30","22:02");
        gun_21     =    new Array("7/29/2013","04:23","06:02","13:22","17:10","20:30","22:00");
        gun_22     =    new Array("7/30/2013","04:24","06:03","13:22","17:10","20:29","21:59");
        gun_23     =    new Array("7/31/2013","04:26","06:04","13:22","17:10","20:28","21:58");
        gun_24     =    new Array("8/1/2013","04:27","06:05","13:22","17:10","20:27","21:56");
        gun_25     =    new Array("8/2/2013","04:28","06:06","13:22","17:09","20:26","21:55");
        gun_26     =    new Array("8/3/2013","04:30","06:07","13:22","17:09","20:25","21:54");
        gun_27     =    new Array("8/4/2013","04:31","06:08","13:22","17:09","20:24","21:52");
        gun_28     =    new Array("8/5/2013","04:32","06:08","13:22","17:08","20:23","21:51");
        gun_29     =    new Array("8/6/2013","04:33","06:09","13:22","17:08","20:22","21:49");
        gun_30     =    new Array("8/7/2013","04:35","06:10","13:21","17:08","20:21","21:48");	
			
	break;
	case "balikesir":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  BALIKESİR+
        gun_1      =    new Array("7/9/2013","03:49","05:42","13:21","17:15","20:47","22:30");
        gun_2      =    new Array("7/10/2013","03:50","05:43","13:21","17:15","20:47","22:29");
        gun_3      =    new Array("7/11/2013","03:51","05:44","13:21","17:15","20:46","22:29");
        gun_4      =    new Array("7/12/2013","03:52","05:44","13:21","17:15","20:46","22:28");
        gun_5      =    new Array("7/13/2013","03:53","05:45","13:21","17:15","20:45","22:27");
        gun_6      =    new Array("7/14/2013","03:55","05:46","13:21","17:15","20:45","22:26");
        gun_7      =    new Array("7/15/2013","03:56","05:46","13:22","17:15","20:44","22:25");
        gun_8      =    new Array("7/16/2013","03:57","05:47","13:22","17:15","20:44","22:24");
        gun_9      =    new Array("7/17/2013","03:58","05:48","13:22","17:15","20:43","22:23");
        gun_10     =    new Array("7/18/2013","03:59","05:49","13:22","17:15","20:43","22:22");
        gun_11     =    new Array("7/19/2013","04:01","05:50","13:22","17:15","20:42","22:21");
        gun_12     =    new Array("7/20/2013","04:02","05:50","13:22","17:15","20:41","22:20");
        gun_13     =    new Array("7/21/2013","04:03","05:51","13:22","17:15","20:41","22:19");
        gun_14     =    new Array("7/22/2013","04:05","05:52","13:22","17:15","20:40","22:18");
        gun_15     =    new Array("7/23/2013","04:06","05:53","13:22","17:14","20:39","22:16");
        gun_16     =    new Array("7/24/2013","04:07","05:54","13:22","17:14","20:38","22:15");
        gun_17     =    new Array("7/25/2013","04:09","05:55","13:22","17:14","20:37","22:14");
        gun_18     =    new Array("7/26/2013","04:10","05:55","13:22","17:14","20:36","22:13");
        gun_19     =    new Array("7/27/2013","04:11","05:56","13:22","17:14","20:36","22:11");
        gun_20     =    new Array("7/28/2013","04:13","05:57","13:22","17:13","20:35","22:10");
        gun_21     =    new Array("7/29/2013","04:14","05:58","13:22","17:13","20:34","22:09");
        gun_22     =    new Array("7/30/2013","04:16","05:59","13:22","17:13","20:33","22:07");
        gun_23     =    new Array("7/31/2013","04:17","06:00","13:22","17:12","20:32","22:06");
        gun_24     =    new Array("8/1/2013","04:18","06:01","13:22","17:12","20:31","22:04");
        gun_25     =    new Array("8/2/2013","04:20","06:02","13:22","17:12","20:30","22:03");
        gun_26     =    new Array("8/3/2013","04:21","06:03","13:22","17:11","20:29","22:01");
        gun_27     =    new Array("8/4/2013","04:23","06:04","13:22","17:11","20:28","22:00");
        gun_28     =    new Array("8/5/2013","04:24","06:04","13:22","17:11","20:26","21:58");
        gun_29     =    new Array("8/6/2013","04:25","06:05","13:21","17:10","20:25","21:57");
        gun_30     =    new Array("8/7/2013","04:27","06:06","13:21","17:10","20:24","21:55");
		
	break;
	case "bartin":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi BARTIN-
        gun_1      =    new Array("7/9/2013","03:17","05:18","13:03","17:01","20:36","22:26");
        gun_2      =    new Array("7/10/2013","03:18","05:19","13:03","17:01","20:35","22:25");
        gun_3      =    new Array("7/11/2013","03:19","05:20","13:03","17:01","20:35","22:24");
        gun_4      =    new Array("7/12/2013","03:21","05:20","13:03","17:01","20:34","22:23");
        gun_5      =    new Array("7/13/2013","03:22","05:21","13:03","17:01","20:34","22:22");
        gun_6      =    new Array("7/14/2013","03:23","05:22","13:04","17:01","20:33","22:21");
        gun_7      =    new Array("7/15/2013","03:25","05:23","13:04","17:01","20:33","22:20");
        gun_8      =    new Array("7/16/2013","03:26","05:23","13:04","17:01","20:32","22:19");
        gun_9      =    new Array("7/17/2013","03:27","05:24","13:04","17:01","20:31","22:18");
        gun_10     =    new Array("7/18/2013","03:29","05:25","13:04","17:01","20:31","22:17");
        gun_11     =    new Array("7/19/2013","03:30","05:26","13:04","17:01","20:30","22:15");
        gun_12     =    new Array("7/20/2013","03:32","05:27","13:04","17:01","20:29","22:14");
        gun_13     =    new Array("7/21/2013","03:33","05:28","13:04","17:00","20:28","22:13");
        gun_14     =    new Array("7/22/2013","03:35","05:29","13:04","17:00","20:28","22:11");
        gun_15     =    new Array("7/23/2013","03:36","05:30","13:04","17:00","20:27","22:10");
        gun_16     =    new Array("7/24/2013","03:38","05:30","13:04","17:00","20:26","22:09");
        gun_17     =    new Array("7/25/2013","03:39","05:31","13:04","17:00","20:25","22:07");
        gun_18     =    new Array("7/26/2013","03:41","05:32","13:04","16:59","20:24","22:06");
        gun_19     =    new Array("7/27/2013","03:42","05:33","13:04","16:59","20:23","22:04");
        gun_20     =    new Array("7/28/2013","03:44","05:34","13:04","16:59","20:22","22:03");
        gun_21     =    new Array("7/29/2013","03:45","05:35","13:04","16:58","20:21","22:01");
        gun_22     =    new Array("7/30/2013","03:47","05:36","13:04","16:58","20:20","22:00");
        gun_23     =    new Array("7/31/2013","03:49","05:37","13:04","16:58","20:19","21:58");
        gun_24     =    new Array("8/1/2013","03:50","05:38","13:04","16:57","20:18","21:56");
        gun_25     =    new Array("8/2/2013","03:52","05:39","13:04","16:57","20:17","21:55");
        gun_26     =    new Array("8/3/2013","03:53","05:40","13:04","16:57","20:15","21:53");
        gun_27     =    new Array("8/4/2013","03:55","05:41","13:04","16:56","20:14","21:51");
        gun_28     =    new Array("8/5/2013","03:56","05:42","13:04","16:56","20:13","21:50");
        gun_29     =    new Array("8/6/2013","03:58","05:43","13:04","16:55","20:12","21:48");
        gun_30     =    new Array("8/7/2013","04:00","05:44","13:04","16:55","20:11","21:46");		
		
	break;
	case "batman":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  BATMAN-
        gun_1      =    new Array("7/9/2013","03:07","04:54","12:28","16:19","19:49","21:27");
        gun_2      =    new Array("7/10/2013","03:08","04:55","12:28","16:19","19:49","21:26");
        gun_3      =    new Array("7/11/2013","03:09","04:56","12:28","16:19","19:48","21:26");
        gun_4      =    new Array("7/12/2013","03:10","04:56","12:28","16:19","19:48","21:25");
        gun_5      =    new Array("7/13/2013","03:11","04:57","12:28","16:19","19:47","21:24");
        gun_6      =    new Array("7/14/2013","03:12","04:58","12:29","16:19","19:47","21:23");
        gun_7      =    new Array("7/15/2013","03:13","04:58","12:29","16:19","19:47","21:22");
        gun_8      =    new Array("7/16/2013","03:14","04:59","12:29","16:19","19:46","21:22");
        gun_9      =    new Array("7/17/2013","03:15","05:00","12:29","16:19","19:45","21:21");
        gun_10     =    new Array("7/18/2013","03:17","05:01","12:29","16:19","19:45","21:20");
        gun_11     =    new Array("7/19/2013","03:18","05:01","12:29","16:19","19:44","21:19");
        gun_12     =    new Array("7/20/2013","03:19","05:02","12:29","16:19","19:44","21:18");
        gun_13     =    new Array("7/21/2013","03:20","05:03","12:29","16:19","19:43","21:17");
        gun_14     =    new Array("7/22/2013","03:21","05:04","12:29","16:18","19:42","21:16");
        gun_15     =    new Array("7/23/2013","03:23","05:05","12:29","16:18","19:42","21:15");
        gun_16     =    new Array("7/24/2013","03:24","05:05","12:29","16:18","19:41","21:13");
        gun_17     =    new Array("7/25/2013","03:25","05:06","12:29","16:18","19:40","21:12");
        gun_18     =    new Array("7/26/2013","03:26","05:07","12:29","16:18","19:39","21:11");
        gun_19     =    new Array("7/27/2013","03:27","05:08","12:29","16:18","19:38","21:10");
        gun_20     =    new Array("7/28/2013","03:29","05:09","12:29","16:17","19:37","21:09");
        gun_21     =    new Array("7/29/2013","03:30","05:09","12:29","16:17","19:37","21:07");
        gun_22     =    new Array("7/30/2013","03:31","05:10","12:29","16:17","19:36","21:06");
        gun_23     =    new Array("7/31/2013","03:33","05:11","12:29","16:17","19:35","21:05");
        gun_24     =    new Array("8/1/2013","03:34","05:12","12:29","16:17","19:34","21:03");
        gun_25     =    new Array("8/2/2013","03:35","05:13","12:29","16:16","19:33","21:02");
        gun_26     =    new Array("8/3/2013","03:36","05:14","12:29","16:16","19:32","21:01");
        gun_27     =    new Array("8/4/2013","03:38","05:14","12:29","16:16","19:31","20:59");
        gun_28     =    new Array("8/5/2013","03:39","05:15","12:29","16:15","19:30","20:58");
        gun_29     =    new Array("8/6/2013","03:40","05:16","12:29","16:15","19:29","20:56");
        gun_30     =    new Array("8/7/2013","03:42","05:17","12:28","16:15","19:28","20:55");	
			
	break;
	case "bayburt":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi BAYBURT-
        gun_1      =    new Array("7/9/2013","02:55","04:51","12:31","16:27","20:00","21:45");
        gun_2      =    new Array("7/10/2013","02:57","04:52","12:32","16:27","19:59","21:44");
        gun_3      =    new Array("7/11/2013","02:58","04:52","12:32","16:27","19:59","21:43");
        gun_4      =    new Array("7/12/2013","02:59","04:53","12:32","16:27","19:58","21:42");
        gun_5      =    new Array("7/13/2013","03:00","04:54","12:32","16:27","19:58","21:41");
        gun_6      =    new Array("7/14/2013","03:01","04:54","12:32","16:27","19:57","21:41");
        gun_7      =    new Array("7/15/2013","03:02","04:55","12:32","16:27","19:57","21:40");
        gun_8      =    new Array("7/16/2013","03:04","04:56","12:32","16:27","19:56","21:39");
        gun_9      =    new Array("7/17/2013","03:05","04:57","12:32","16:27","19:56","21:38");
        gun_10     =    new Array("7/18/2013","03:06","04:58","12:32","16:27","19:55","21:36");
        gun_11     =    new Array("7/19/2013","03:08","04:58","12:32","16:27","19:54","21:35");
        gun_12     =    new Array("7/20/2013","03:09","04:59","12:33","16:27","19:54","21:34");
        gun_13     =    new Array("7/21/2013","03:10","05:00","12:33","16:26","19:53","21:33");
        gun_14     =    new Array("7/22/2013","03:12","05:01","12:33","16:26","19:52","21:32");
        gun_15     =    new Array("7/23/2013","03:13","05:02","12:33","16:26","19:51","21:30");
        gun_16     =    new Array("7/24/2013","03:14","05:03","12:33","16:26","19:50","21:29");
        gun_17     =    new Array("7/25/2013","03:16","05:04","12:33","16:26","19:50","21:28");
        gun_18     =    new Array("7/26/2013","03:17","05:04","12:33","16:25","19:49","21:26");
        gun_19     =    new Array("7/27/2013","03:19","05:05","12:33","16:25","19:48","21:25");
        gun_20     =    new Array("7/28/2013","03:20","05:06","12:33","16:25","19:47","21:24");
        gun_21     =    new Array("7/29/2013","03:22","05:07","12:33","16:25","19:46","21:22");
        gun_22     =    new Array("7/30/2013","03:23","05:08","12:33","16:24","19:45","21:21");
        gun_23     =    new Array("7/31/2013","03:24","05:09","12:33","16:24","19:44","21:19");
        gun_24     =    new Array("8/1/2013","03:26","05:10","12:32","16:24","19:43","21:18");
        gun_25     =    new Array("8/2/2013","03:27","05:11","12:32","16:23","19:42","21:16");
        gun_26     =    new Array("8/3/2013","03:29","05:12","12:32","16:23","19:41","21:15");
        gun_27     =    new Array("8/4/2013","03:30","05:13","12:32","16:23","19:40","21:13");
        gun_28     =    new Array("8/5/2013","03:32","05:14","12:32","16:22","19:38","21:12");
        gun_29     =    new Array("8/6/2013","03:33","05:15","12:32","16:22","19:37","21:10");
        gun_30     =    new Array("8/7/2013","03:35","05:16","12:32","16:21","19:36","21:08");
			
	break;
	case "bilecik":
		 // Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  BILECIK-
        gun_1      =    new Array("7/9/2013","03:37","05:32","13:12","17:08","20:40","22:25");
        gun_2      =    new Array("7/10/2013","03:38","05:33","13:12","17:08","20:40","22:24");
        gun_3      =    new Array("7/11/2013","03:39","05:34","13:13","17:08","20:39","22:23");
        gun_4      =    new Array("7/12/2013","03:41","05:34","13:13","17:08","20:39","22:23");
        gun_5      =    new Array("7/13/2013","03:42","05:35","13:13","17:08","20:39","22:22");
        gun_6      =    new Array("7/14/2013","03:43","05:36","13:13","17:08","20:38","22:21");
        gun_7      =    new Array("7/15/2013","03:44","05:36","13:13","17:08","20:37","22:20");
        gun_8      =    new Array("7/16/2013","03:45","05:37","13:13","17:08","20:37","22:19");
        gun_9      =    new Array("7/17/2013","03:47","05:38","13:13","17:08","20:36","22:18");
        gun_10     =    new Array("7/18/2013","03:48","05:39","13:13","17:07","20:36","22:17");
        gun_11     =    new Array("7/19/2013","03:49","05:40","13:13","17:07","20:35","22:16");
        gun_12     =    new Array("7/20/2013","03:51","05:41","13:13","17:07","20:34","22:14");
        gun_13     =    new Array("7/21/2013","03:52","05:41","13:14","17:07","20:33","22:13");
        gun_14     =    new Array("7/22/2013","03:53","05:42","13:14","17:07","20:33","22:12");
        gun_15     =    new Array("7/23/2013","03:55","05:43","13:14","17:07","20:32","22:11");
        gun_16     =    new Array("7/24/2013","03:56","05:44","13:14","17:07","20:31","22:10");
        gun_17     =    new Array("7/25/2013","03:57","05:45","13:14","17:06","20:30","22:08");
        gun_18     =    new Array("7/26/2013","03:59","05:46","13:14","17:06","20:29","22:07");
        gun_19     =    new Array("7/27/2013","04:00","05:47","13:14","17:06","20:28","22:05");
        gun_20     =    new Array("7/28/2013","04:02","05:47","13:14","17:06","20:28","22:04");
        gun_21     =    new Array("7/29/2013","04:03","05:48","13:14","17:05","20:27","22:03");
        gun_22     =    new Array("7/30/2013","04:05","05:49","13:14","17:05","20:26","22:01");
        gun_23     =    new Array("7/31/2013","04:06","05:50","13:14","17:05","20:25","22:00");
        gun_24     =    new Array("8/1/2013","04:07","05:51","13:13","17:05","20:24","21:58");
        gun_25     =    new Array("8/2/2013","04:09","05:52","13:13","17:04","20:22","21:57");
        gun_26     =    new Array("8/3/2013","04:10","05:53","13:13","17:04","20:21","21:55");
        gun_27     =    new Array("8/4/2013","04:12","05:54","13:13","17:03","20:20","21:54");
        gun_28     =    new Array("8/5/2013","04:13","05:55","13:13","17:03","20:19","21:52");
        gun_29     =    new Array("8/6/2013","04:15","05:56","13:13","17:03","20:18","21:50");
        gun_30     =    new Array("8/7/2013","04:16","05:57","13:13","17:02","20:17","21:49");
		
	break;
	case "bingol":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi BINGOl-
        gun_1      =    new Array("7/9/2013","03:04","04:54","12:30","16:23","19:54","21:35");
        gun_2      =    new Array("7/10/2013","03:05","04:55","12:30","16:23","19:54","21:34");
        gun_3      =    new Array("7/11/2013","03:06","04:55","12:31","16:23","19:54","21:34");
        gun_4      =    new Array("7/12/2013","03:07","04:56","12:31","16:23","19:53","21:33");
        gun_5      =    new Array("7/13/2013","03:08","04:57","12:31","16:23","19:53","21:32");
        gun_6      =    new Array("7/14/2013","03:09","04:57","12:31","16:23","19:52","21:31");
        gun_7      =    new Array("7/15/2013","03:10","04:58","12:31","16:23","19:52","21:30");
        gun_8      =    new Array("7/16/2013","03:11","04:59","12:31","16:23","19:51","21:30");
        gun_9      =    new Array("7/17/2013","03:12","05:00","12:31","16:23","19:51","21:29");
        gun_10     =    new Array("7/18/2013","03:13","05:00","12:31","16:23","19:50","21:28");
        gun_11     =    new Array("7/19/2013","03:15","05:01","12:31","16:23","19:49","21:27");
        gun_12     =    new Array("7/20/2013","03:16","05:02","12:31","16:23","19:49","21:25");
        gun_13     =    new Array("7/21/2013","03:17","05:03","12:32","16:23","19:48","21:24");
        gun_14     =    new Array("7/22/2013","03:18","05:04","12:32","16:23","19:47","21:23");
        gun_15     =    new Array("7/23/2013","03:20","05:04","12:32","16:23","19:47","21:22");
        gun_16     =    new Array("7/24/2013","03:21","05:05","12:32","16:22","19:46","21:21");
        gun_17     =    new Array("7/25/2013","03:22","05:06","12:32","16:22","19:45","21:20");
        gun_18     =    new Array("7/26/2013","03:24","05:07","12:32","16:22","19:44","21:18");
        gun_19     =    new Array("7/27/2013","03:25","05:08","12:32","16:22","19:43","21:17");
        gun_20     =    new Array("7/28/2013","03:26","05:09","12:32","16:22","19:42","21:16");
        gun_21     =    new Array("7/29/2013","03:28","05:09","12:32","16:21","19:41","21:14");
        gun_22     =    new Array("7/30/2013","03:29","05:10","12:32","16:21","19:40","21:13");
        gun_23     =    new Array("7/31/2013","03:30","05:11","12:31","16:21","19:40","21:12");
        gun_24     =    new Array("8/1/2013","03:32","05:12","12:31","16:21","19:39","21:10");
        gun_25     =    new Array("8/2/2013","03:33","05:13","12:31","16:20","19:38","21:09");
        gun_26     =    new Array("8/3/2013","03:34","05:14","12:31","16:20","19:36","21:07");
        gun_27     =    new Array("8/4/2013","03:36","05:15","12:31","16:20","19:35","21:06");
        gun_28     =    new Array("8/5/2013","03:37","05:16","12:31","16:19","19:34","21:04");
        gun_29     =    new Array("8/6/2013","03:38","05:17","12:31","16:19","19:33","21:03");
        gun_30     =    new Array("8/7/2013","03:40","05:17","12:31","16:18","19:32","21:01");
	
	break;
	case "bitlis":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  BITLIS-
        gun_1      =    new Array("7/9/2013","03:00","04:49","12:24","16:16","19:47","21:26");
        gun_2      =    new Array("7/10/2013","03:01","04:50","12:24","16:16","19:46","21:25");
        gun_3      =    new Array("7/11/2013","03:02","04:50","12:24","16:16","19:46","21:24");
        gun_4      =    new Array("7/12/2013","03:03","04:51","12:24","16:16","19:45","21:24");
        gun_5      =    new Array("7/13/2013","03:04","04:52","12:24","16:16","19:45","21:23");
        gun_6      =    new Array("7/14/2013","03:05","04:52","12:25","16:16","19:44","21:22");
        gun_7      =    new Array("7/15/2013","03:06","04:53","12:25","16:16","19:44","21:21");
        gun_8      =    new Array("7/16/2013","03:07","04:54","12:25","16:16","19:43","21:20");
        gun_9      =    new Array("7/17/2013","03:09","04:54","12:25","16:16","19:43","21:19");
        gun_10     =    new Array("7/18/2013","03:10","04:55","12:25","16:16","19:42","21:18");
        gun_11     =    new Array("7/19/2013","03:11","04:56","12:25","16:16","19:42","21:17");
        gun_12     =    new Array("7/20/2013","03:12","04:57","12:25","16:16","19:41","21:16");
        gun_13     =    new Array("7/21/2013","03:13","04:58","12:25","16:15","19:40","21:15");
        gun_14     =    new Array("7/22/2013","03:15","04:58","12:25","16:15","19:40","21:14");
        gun_15     =    new Array("7/23/2013","03:16","04:59","12:25","16:15","19:39","21:13");
        gun_16     =    new Array("7/24/2013","03:17","05:00","12:25","16:15","19:38","21:12");
        gun_17     =    new Array("7/25/2013","03:18","05:01","12:25","16:15","19:37","21:11");
        gun_18     =    new Array("7/26/2013","03:20","05:02","12:25","16:15","19:36","21:10");
        gun_19     =    new Array("7/27/2013","03:21","05:02","12:25","16:15","19:36","21:08");
        gun_20     =    new Array("7/28/2013","03:22","05:03","12:25","16:14","19:35","21:07");
        gun_21     =    new Array("7/29/2013","03:24","05:04","12:25","16:14","19:34","21:06");
        gun_22     =    new Array("7/30/2013","03:25","05:05","12:25","16:14","19:33","21:04");
        gun_23     =    new Array("7/31/2013","03:26","05:06","12:25","16:14","19:32","21:03");
        gun_24     =    new Array("8/1/2013","03:27","05:07","12:25","16:13","19:31","21:02");
        gun_25     =    new Array("8/2/2013","03:29","05:08","12:25","16:13","19:30","21:00");
        gun_26     =    new Array("8/3/2013","03:30","05:08","12:25","16:13","19:29","20:59");
        gun_27     =    new Array("8/4/2013","03:31","05:09","12:25","16:12","19:28","20:57");
        gun_28     =    new Array("8/5/2013","03:33","05:10","12:25","16:12","19:27","20:56");
        gun_29     =    new Array("8/6/2013","03:34","05:11","12:25","16:12","19:26","20:54");
        gun_30     =    new Array("8/7/2013","03:35","05:12","12:24","16:11","19:25","20:53");	
		
	break;
	case "bolu":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  BOLU-
        gun_1      =    new Array("7/9/2013","03:27","05:24","13:06","17:02","20:36","22:22");
        gun_2      =    new Array("7/10/2013","03:28","05:25","13:06","17:02","20:35","22:22");
        gun_3      =    new Array("7/11/2013","03:29","05:25","13:06","17:02","20:35","22:21");
        gun_4      =    new Array("7/12/2013","03:30","05:26","13:06","17:02","20:34","22:20");
        gun_5      =    new Array("7/13/2013","03:31","05:27","13:06","17:02","20:34","22:19");
        gun_6      =    new Array("7/14/2013","03:33","05:28","13:07","17:02","20:33","22:18");
        gun_7      =    new Array("7/15/2013","03:34","05:28","13:07","17:02","20:33","22:17");
        gun_8      =    new Array("7/16/2013","03:35","05:29","13:07","17:02","20:32","22:16");
        gun_9      =    new Array("7/17/2013","03:36","05:30","13:07","17:02","20:32","22:15");
        gun_10     =    new Array("7/18/2013","03:38","05:31","13:07","17:02","20:31","22:14");
        gun_11     =    new Array("7/19/2013","03:39","05:32","13:07","17:02","20:30","22:13");
        gun_12     =    new Array("7/20/2013","03:40","05:32","13:07","17:02","20:29","22:11");
        gun_13     =    new Array("7/21/2013","03:42","05:33","13:07","17:02","20:29","22:10");
        gun_14     =    new Array("7/22/2013","03:43","05:34","13:07","17:02","20:28","22:09");
        gun_15     =    new Array("7/23/2013","03:45","05:35","13:07","17:01","20:27","22:08");
        gun_16     =    new Array("7/24/2013","03:46","05:36","13:07","17:01","20:26","22:06");
        gun_17     =    new Array("7/25/2013","03:48","05:37","13:07","17:01","20:25","22:05");
        gun_18     =    new Array("7/26/2013","03:49","05:38","13:07","17:01","20:24","22:04");
        gun_19     =    new Array("7/27/2013","03:51","05:39","13:07","17:01","20:24","22:02");
        gun_20     =    new Array("7/28/2013","03:52","05:40","13:07","17:00","20:23","22:01");
        gun_21     =    new Array("7/29/2013","03:53","05:40","13:07","17:00","20:22","21:59");
        gun_22     =    new Array("7/30/2013","03:55","05:41","13:07","17:00","20:21","21:58");
        gun_23     =    new Array("7/31/2013","03:56","05:42","13:07","16:59","20:20","21:56");
        gun_24     =    new Array("8/1/2013","03:58","05:43","13:07","16:59","20:18","21:55");
        gun_25     =    new Array("8/2/2013","03:59","05:44","13:07","16:59","20:17","21:53");
        gun_26     =    new Array("8/3/2013","04:01","05:45","13:07","16:58","20:16","21:51");
        gun_27     =    new Array("8/4/2013","04:02","05:46","13:07","16:58","20:15","21:50");
        gun_28     =    new Array("8/5/2013","04:04","05:47","13:07","16:57","20:14","21:48");
        gun_29     =    new Array("8/6/2013","04:05","05:48","13:07","16:57","20:13","21:47");
        gun_30     =    new Array("8/7/2013","04:07","05:49","13:06","16:56","20:12","21:45");
		
	break;
	case "burdur":
	   // Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  BURDUR-
        gun_1      =    new Array("7/9/2013","03:51","05:38","13:11","17:01","20:32","22:09");
        gun_2      =    new Array("7/10/2013","03:52","05:39","13:11","17:02","20:32","22:09");
        gun_3      =    new Array("7/11/2013","03:53","05:39","13:11","17:02","20:31","22:08");
        gun_4      =    new Array("7/12/2013","03:54","05:40","13:12","17:02","20:31","22:07");
        gun_5      =    new Array("7/13/2013","03:55","05:41","13:12","17:02","20:30","22:07");
        gun_6      =    new Array("7/14/2013","03:56","05:41","13:12","17:02","20:30","22:06");
        gun_7      =    new Array("7/15/2013","03:57","05:42","13:12","17:02","20:29","22:05");
        gun_8      =    new Array("7/16/2013","03:59","05:43","13:12","17:02","20:29","22:04");
        gun_9      =    new Array("7/17/2013","04:00","05:44","13:12","17:02","20:28","22:03");
        gun_10     =    new Array("7/18/2013","04:01","05:44","13:12","17:02","20:28","22:02");
        gun_11     =    new Array("7/19/2013","04:02","05:45","13:12","17:02","20:27","22:01");
        gun_12     =    new Array("7/20/2013","04:03","05:46","13:12","17:02","20:26","22:00");
        gun_13     =    new Array("7/21/2013","04:04","05:47","13:12","17:02","20:26","21:59");
        gun_14     =    new Array("7/22/2013","04:05","05:47","13:12","17:01","20:25","21:58");
        gun_15     =    new Array("7/23/2013","04:07","05:48","13:12","17:01","20:24","21:57");
        gun_16     =    new Array("7/24/2013","04:08","05:49","13:12","17:01","20:24","21:56");
        gun_17     =    new Array("7/25/2013","04:09","05:50","13:12","17:01","20:23","21:55");
        gun_18     =    new Array("7/26/2013","04:10","05:51","13:12","17:01","20:22","21:54");
        gun_19     =    new Array("7/27/2013","04:12","05:51","13:12","17:01","20:21","21:52");
        gun_20     =    new Array("7/28/2013","04:13","05:52","13:12","17:01","20:20","21:51");
        gun_21     =    new Array("7/29/2013","04:14","05:53","13:12","17:00","20:20","21:50");
        gun_22     =    new Array("7/30/2013","04:15","05:54","13:12","17:00","20:19","21:49");
        gun_23     =    new Array("7/31/2013","04:17","05:55","13:12","17:00","20:18","21:47");
        gun_24     =    new Array("8/1/2013","04:18","05:56","13:12","17:00","20:17","21:46");
        gun_25     =    new Array("8/2/2013","04:19","05:56","13:12","16:59","20:16","21:45");
        gun_26     =    new Array("8/3/2013","04:20","05:57","13:12","16:59","20:15","21:43");
        gun_27     =    new Array("8/4/2013","04:22","05:58","13:12","16:59","20:14","21:42");
        gun_28     =    new Array("8/5/2013","04:23","05:59","13:12","16:58","20:13","21:40");
        gun_29     =    new Array("8/6/2013","04:24","06:00","13:12","16:58","20:12","21:39");
        gun_30     =    new Array("8/7/2013","04:25","06:01","13:12","16:58","20:11","21:38");	
		
	break;
	case "bursa":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  BURSA-
        gun_1      =    new Array("7/9/2013","03:40","05:36","13:16","17:11","20:44","22:29");
        gun_2      =    new Array("7/10/2013","03:41","05:36","13:16","17:11","20:44","22:28");
        gun_3      =    new Array("7/11/2013","03:43","05:37","13:16","17:12","20:43","22:27");
        gun_4      =    new Array("7/12/2013","03:44","05:38","13:16","17:12","20:43","22:27");
        gun_5      =    new Array("7/13/2013","03:45","05:39","13:17","17:12","20:42","22:26");
        gun_6      =    new Array("7/14/2013","03:46","05:39","13:17","17:11","20:42","22:25");
        gun_7      =    new Array("7/15/2013","03:48","05:40","13:17","17:11","20:41","22:24");
        gun_8      =    new Array("7/16/2013","03:49","05:41","13:17","17:11","20:41","22:23");
        gun_9      =    new Array("7/17/2013","03:50","05:42","13:17","17:11","20:40","22:22");
        gun_10     =    new Array("7/18/2013","03:51","05:42","13:17","17:11","20:39","22:21");
        gun_11     =    new Array("7/19/2013","03:53","05:43","13:17","17:11","20:39","22:20");
        gun_12     =    new Array("7/20/2013","03:54","05:44","13:17","17:11","20:38","22:18");
        gun_13     =    new Array("7/21/2013","03:55","05:45","13:17","17:11","20:37","22:17");
        gun_14     =    new Array("7/22/2013","03:57","05:46","13:17","17:11","20:37","22:16");
        gun_15     =    new Array("7/23/2013","03:58","05:47","13:17","17:11","20:36","22:15");
        gun_16     =    new Array("7/24/2013","04:00","05:48","13:17","17:10","20:35","22:13");
        gun_17     =    new Array("7/25/2013","04:01","05:48","13:17","17:10","20:34","22:12");
        gun_18     =    new Array("7/26/2013","04:02","05:49","13:17","17:10","20:33","22:11");
        gun_19     =    new Array("7/27/2013","04:04","05:50","13:17","17:10","20:32","22:09");
        gun_20     =    new Array("7/28/2013","04:05","05:51","13:17","17:09","20:31","22:08");
        gun_21     =    new Array("7/29/2013","04:07","05:52","13:17","17:09","20:30","22:07");
        gun_22     =    new Array("7/30/2013","04:08","05:53","13:17","17:09","20:29","22:05");
        gun_23     =    new Array("7/31/2013","04:10","05:54","13:17","17:09","20:28","22:04");
        gun_24     =    new Array("8/1/2013","04:11","05:55","13:17","17:08","20:27","22:02");
        gun_25     =    new Array("8/2/2013","04:12","05:56","13:17","17:08","20:26","22:01");
        gun_26     =    new Array("8/3/2013","04:14","05:57","13:17","17:08","20:25","21:59");
        gun_27     =    new Array("8/4/2013","04:15","05:58","13:17","17:07","20:24","21:57");
        gun_28     =    new Array("8/5/2013","04:17","05:59","13:17","17:07","20:23","21:56");
        gun_29     =    new Array("8/6/2013","04:18","05:59","13:17","17:06","20:22","21:54");
        gun_30     =    new Array("8/7/2013","04:20","06:00","13:17","17:06","20:21","21:53");	
		
	break;
	case "canakkale":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi CANAKKALE-
        gun_1      =    new Array("7/9/2013","03:52","05:47","13:27","17:22","20:55","22:39");
        gun_2      =    new Array("7/10/2013","03:53","05:47","13:27","17:22","20:54","22:39");
        gun_3      =    new Array("7/11/2013","03:54","05:48","13:27","17:22","20:54","22:38");
        gun_4      =    new Array("7/12/2013","03:55","05:49","13:27","17:22","20:53","22:37");
        gun_5      =    new Array("7/13/2013","03:56","05:49","13:27","17:22","20:53","22:36");
        gun_6      =    new Array("7/14/2013","03:57","05:50","13:27","17:22","20:52","22:35");
        gun_7      =    new Array("7/15/2013","03:58","05:51","13:27","17:22","20:52","22:34");
        gun_8      =    new Array("7/16/2013","04:00","05:52","13:28","17:22","20:51","22:33");
        gun_9      =    new Array("7/17/2013","04:01","05:52","13:28","17:22","20:51","22:32");
        gun_10     =    new Array("7/18/2013","04:02","05:53","13:28","17:22","20:50","22:31");
        gun_11     =    new Array("7/19/2013","04:04","05:54","13:28","17:22","20:49","22:30");
        gun_12     =    new Array("7/20/2013","04:05","05:55","13:28","17:22","20:49","22:29");
        gun_13     =    new Array("7/21/2013","04:06","05:56","13:28","17:21","20:48","22:28");
        gun_14     =    new Array("7/22/2013","04:08","05:57","13:28","17:21","20:47","22:26");
        gun_15     =    new Array("7/23/2013","04:09","05:57","13:28","17:21","20:46","22:25");
        gun_16     =    new Array("7/24/2013","04:10","05:58","13:28","17:21","20:45","22:24");
        gun_17     =    new Array("7/25/2013","04:12","05:59","13:28","17:21","20:45","22:23");
        gun_18     =    new Array("7/26/2013","04:13","06:00","13:28","17:21","20:44","22:21");
        gun_19     =    new Array("7/27/2013","04:15","06:01","13:28","17:20","20:43","22:20");
        gun_20     =    new Array("7/28/2013","04:16","06:02","13:28","17:20","20:42","22:18");
        gun_21     =    new Array("7/29/2013","04:17","06:03","13:28","17:20","20:41","22:17");
        gun_22     =    new Array("7/30/2013","04:19","06:04","13:28","17:19","20:40","22:16");
        gun_23     =    new Array("7/31/2013","04:20","06:05","13:28","17:19","20:39","22:14");
        gun_24     =    new Array("8/1/2013","04:22","06:05","13:28","17:19","20:38","22:13");
        gun_25     =    new Array("8/2/2013","04:23","06:06","13:28","17:18","20:37","22:11");
        gun_26     =    new Array("8/3/2013","04:25","06:07","13:28","17:18","20:36","22:09");
        gun_27     =    new Array("8/4/2013","04:26","06:08","13:28","17:18","20:35","22:08");
        gun_28     =    new Array("8/5/2013","04:28","06:09","13:27","17:17","20:33","22:06");
        gun_29     =    new Array("8/6/2013","04:29","06:10","13:27","17:17","20:32","22:05");
        gun_30     =    new Array("8/7/2013","04:30","06:11","13:27","17:16","20:31","22:03");
		
	break;
	case "cankiri":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  CANKIRI-
        gun_1      =    new Array("7/9/2013","03:20","05:16","12:58","16:54","20:27","22:13");
        gun_2      =    new Array("7/10/2013","03:21","05:17","12:58","16:54","20:27","22:13");
        gun_3      =    new Array("7/11/2013","03:22","05:18","12:58","16:54","20:26","22:12");
        gun_4      =    new Array("7/12/2013","03:23","05:18","12:58","16:54","20:26","22:11");
        gun_5      =    new Array("7/13/2013","03:24","05:19","12:58","16:54","20:25","22:10");
        gun_6      =    new Array("7/14/2013","03:25","05:20","12:58","16:54","20:25","22:09");
        gun_7      =    new Array("7/15/2013","03:27","05:21","12:59","16:54","20:24","22:08");
        gun_8      =    new Array("7/16/2013","03:28","05:21","12:59","16:54","20:24","22:07");
        gun_9      =    new Array("7/17/2013","03:29","05:22","12:59","16:54","20:23","22:06");
        gun_10     =    new Array("7/18/2013","03:31","05:23","12:59","16:54","20:22","22:05");
        gun_11     =    new Array("7/19/2013","03:32","05:24","12:59","16:54","20:22","22:04");
        gun_12     =    new Array("7/20/2013","03:33","05:25","12:59","16:54","20:21","22:03");
        gun_13     =    new Array("7/21/2013","03:35","05:26","12:59","16:53","20:20","22:01");
        gun_14     =    new Array("7/22/2013","03:36","05:26","12:59","16:53","20:19","22:00");
        gun_15     =    new Array("7/23/2013","03:37","05:27","12:59","16:53","20:19","21:59");
        gun_16     =    new Array("7/24/2013","03:39","05:28","12:59","16:53","20:18","21:57");
        gun_17     =    new Array("7/25/2013","03:40","05:29","12:59","16:53","20:17","21:56");
        gun_18     =    new Array("7/26/2013","03:42","05:30","12:59","16:52","20:16","21:55");
        gun_19     =    new Array("7/27/2013","03:43","05:31","12:59","16:52","20:15","21:53");
        gun_20     =    new Array("7/28/2013","03:45","05:32","12:59","16:52","20:14","21:52");
        gun_21     =    new Array("7/29/2013","03:46","05:33","12:59","16:52","20:13","21:50");
        gun_22     =    new Array("7/30/2013","03:48","05:34","12:59","16:51","20:12","21:49");
        gun_23     =    new Array("7/31/2013","03:49","05:35","12:59","16:51","20:11","21:47");
        gun_24     =    new Array("8/1/2013","03:51","05:36","12:59","16:51","20:10","21:46");
        gun_25     =    new Array("8/2/2013","03:52","05:36","12:59","16:50","20:09","21:44");
        gun_26     =    new Array("8/3/2013","03:54","05:37","12:59","16:50","20:08","21:43");
        gun_27     =    new Array("8/4/2013","03:55","05:38","12:59","16:49","20:07","21:41");
        gun_28     =    new Array("8/5/2013","03:57","05:39","12:59","16:49","20:06","21:39");
        gun_29     =    new Array("8/6/2013","03:58","05:40","12:58","16:49","20:04","21:38");
        gun_30     =    new Array("8/7/2013","04:00","05:41","12:58","16:48","20:03","21:36");
		
	break;
	case "corum":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi CORUM+
        gun_1      =    new Array("7/9/2013","03:14","05:11","12:52","16:49","20:22","22:08");
        gun_2      =    new Array("7/10/2013","03:16","05:12","12:53","16:49","20:21","22:07");
        gun_3      =    new Array("7/11/2013","03:17","05:12","12:53","16:49","20:21","22:06");
        gun_4      =    new Array("7/12/2013","03:18","05:13","12:53","16:49","20:20","22:05");
        gun_5      =    new Array("7/13/2013","03:18","05:13","12:53","16:49","20:20","22:05");
        gun_6      =    new Array("7/14/2013","03:18","05:13","12:53","16:49","20:20","22:05");
        gun_7      =    new Array("7/15/2013","03:18","05:13","12:53","16:49","20:20","22:05");
        gun_8      =    new Array("7/16/2013","03:18","05:13","12:53","16:49","20:20","22:05");
        gun_9      =    new Array("7/17/2013","03:18","05:13","12:53","16:49","20:20","22:05");
        gun_10     =    new Array("7/18/2013","03:18","05:13","12:53","16:49","20:20","22:05");
        gun_11     =    new Array("7/19/2013","03:18","05:13","12:53","16:49","20:20","22:05");
        gun_12     =    new Array("7/20/2013","03:18","05:13","12:53","16:49","20:20","22:05");
        gun_13     =    new Array("7/21/2013","03:18","05:13","12:53","16:49","20:20","22:05");
        gun_14     =    new Array("7/22/2013","03:18","05:13","12:53","16:49","20:20","22:05");
        gun_15     =    new Array("7/23/2013","03:18","05:13","12:53","16:49","20:20","22:05");
        gun_16     =    new Array("7/24/2013","03:18","05:13","12:53","16:49","20:20","22:05");
        gun_17     =    new Array("7/25/2013","03:18","05:13","12:53","16:49","20:20","22:05");
        gun_18     =    new Array("7/26/2013","03:18","05:13","12:53","16:49","20:20","22:05");
        gun_19     =    new Array("7/27/2013","03:18","05:13","12:53","16:49","20:20","22:05");
        gun_20     =    new Array("7/28/2013","03:18","05:13","12:53","16:49","20:20","22:05");
        gun_21     =    new Array("7/29/2013","03:18","05:13","12:53","16:49","20:20","22:05");
        gun_22     =    new Array("7/30/2013","03:18","05:13","12:53","16:49","20:20","22:05");
        gun_23     =    new Array("7/31/2013","03:18","05:13","12:53","16:49","20:20","22:05");
        gun_24     =    new Array("8/1/2013","03:18","05:13","12:53","16:49","20:20","22:05");
        gun_25     =    new Array("8/2/2013","03:18","05:13","12:53","16:49","20:20","22:05");
        gun_26     =    new Array("8/3/2013","03:19","05:14","12:53","16:49","20:20","22:04");
        gun_27     =    new Array("8/4/2013","03:19","05:14","12:53","16:49","20:20","22:04");
        gun_28     =    new Array("8/5/2013","03:19","05:14","12:53","16:49","20:20","22:04");
        gun_29     =    new Array("8/6/2013","03:19","05:14","12:53","16:49","20:20","22:04");
        gun_30     =    new Array("8/7/2013","03:19","05:14","12:53","16:49","20:20","22:04");
		
	break;
	case "denizli":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  DENIZLI-
        gun_1      =    new Array("7/9/2013","03:56","05:43","13:16","17:06","20:37","22:14");
        gun_2      =    new Array("7/10/2013","03:57","05:43","13:16","17:06","20:36","22:14");
        gun_3      =    new Array("7/11/2013","03:58","05:44","13:16","17:07","20:36","22:13");
        gun_4      =    new Array("7/12/2013","03:59","05:45","13:16","17:07","20:36","22:12");
        gun_5      =    new Array("7/13/2013","04:00","05:45","13:16","17:07","20:35","22:12");
        gun_6      =    new Array("7/14/2013","04:01","05:46","13:17","17:07","20:35","22:11");
        gun_7      =    new Array("7/15/2013","04:02","05:47","13:17","17:07","20:34","22:10");
        gun_8      =    new Array("7/16/2013","04:03","05:48","13:17","17:07","20:34","22:09");
        gun_9      =    new Array("7/17/2013","04:04","05:48","13:17","17:07","20:33","22:08");
        gun_10     =    new Array("7/18/2013","04:05","05:49","13:17","17:07","20:33","22:07");
        gun_11     =    new Array("7/19/2013","04:06","05:50","13:17","17:07","20:32","22:06");
        gun_12     =    new Array("7/20/2013","04:08","05:51","13:17","17:06","20:31","22:05");
        gun_13     =    new Array("7/21/2013","04:09","05:51","13:17","17:06","20:31","22:04");
        gun_14     =    new Array("7/22/2013","04:10","05:52","13:17","17:06","20:30","22:03");
        gun_15     =    new Array("7/23/2013","04:11","05:53","13:17","17:06","20:29","22:02");
        gun_16     =    new Array("7/24/2013","04:12","05:54","13:17","17:06","20:29","22:01");
        gun_17     =    new Array("7/25/2013","04:14","05:54","13:17","17:06","20:28","22:00");
        gun_18     =    new Array("7/26/2013","04:15","05:55","13:17","17:06","20:27","21:59");
        gun_19     =    new Array("7/27/2013","04:16","05:56","13:17","17:06","20:26","21:58");
        gun_20     =    new Array("7/28/2013","04:17","05:57","13:17","17:05","20:25","21:56");
        gun_21     =    new Array("7/29/2013","04:19","05:58","13:17","17:05","20:24","21:55");
        gun_22     =    new Array("7/30/2013","04:20","05:59","13:17","17:05","20:24","21:54");
        gun_23     =    new Array("7/31/2013","04:21","05:59","13:17","17:05","20:23","21:52");
        gun_24     =    new Array("8/1/2013","04:22","06:00","13:17","17:04","20:22","21:51");
        gun_25     =    new Array("8/2/2013","04:24","06:01","13:17","17:04","20:21","21:50");
        gun_26     =    new Array("8/3/2013","04:25","06:02","13:17","17:04","20:20","21:48");
        gun_27     =    new Array("8/4/2013","04:26","06:03","13:17","17:04","20:19","21:47");
        gun_28     =    new Array("8/5/2013","04:27","06:04","13:17","17:03","20:18","21:45");
        gun_29     =    new Array("8/6/2013","04:29","06:04","13:17","17:03","20:17","21:44");
        gun_30     =    new Array("8/7/2013","04:30","06:05","13:17","17:02","20:15","21:43");
			
	break;
	case "diyarbakir":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  DIYARBAKIR-
        gun_1      =    new Array("7/9/2013","03:11","04:58","12:31","16:22","19:53","21:31");
        gun_2      =    new Array("7/10/2013","03:11","04:59","12:32","16:22","19:52","21:30");
        gun_3      =    new Array("7/11/2013","03:12","04:59","12:32","16:22","19:52","21:29");
        gun_4      =    new Array("7/12/2013","03:13","05:00","12:32","16:22","19:52","21:29");
        gun_5      =    new Array("7/13/2013","03:14","05:01","12:32","16:22","19:51","21:28");
        gun_6      =    new Array("7/14/2013","03:16","05:01","12:32","16:22","19:51","21:27");
        gun_7      =    new Array("7/15/2013","03:17","05:02","12:32","16:22","19:50","21:26");
        gun_8      =    new Array("7/16/2013","03:18","05:03","12:32","16:22","19:50","21:25");
        gun_9      =    new Array("7/17/2013","03:19","05:03","12:32","16:22","19:49","21:24");
        gun_10     =    new Array("7/18/2013","03:20","05:04","12:32","16:22","19:48","21:24");
        gun_11     =    new Array("7/19/2013","03:21","05:05","12:32","16:22","19:48","21:23");
        gun_12     =    new Array("7/20/2013","03:22","05:06","12:33","16:22","19:47","21:22");
        gun_13     =    new Array("7/21/2013","03:23","05:06","12:33","16:22","19:47","21:20");
        gun_14     =    new Array("7/22/2013","03:25","05:07","12:33","16:22","19:46","21:19");
        gun_15     =    new Array("7/23/2013","03:26","05:08","12:33","16:22","19:45","21:18");
        gun_16     =    new Array("7/24/2013","03:27","05:09","12:33","16:22","19:44","21:17");
        gun_17     =    new Array("7/25/2013","03:28","05:10","12:33","16:22","19:44","21:16");
        gun_18     =    new Array("7/26/2013","03:30","05:10","12:33","16:21","19:43","21:15");
        gun_19     =    new Array("7/27/2013","03:31","05:11","12:33","16:21","19:42","21:14");
        gun_20     =    new Array("7/28/2013","03:32","05:12","12:33","16:21","19:41","21:12");
        gun_21     =    new Array("7/29/2013","03:33","05:13","12:33","16:21","19:40","21:11");
        gun_22     =    new Array("7/30/2013","03:35","05:14","12:33","16:21","19:39","21:10");
        gun_23     =    new Array("7/31/2013","03:36","05:15","12:33","16:20","19:38","21:08");
        gun_24     =    new Array("8/1/2013","03:37","05:15","12:33","16:20","19:37","21:07");
        gun_25     =    new Array("8/2/2013","03:38","05:16","12:32","16:20","19:36","21:06");
        gun_26     =    new Array("8/3/2013","03:40","05:17","12:32","16:20","19:35","21:04");
        gun_27     =    new Array("8/4/2013","03:41","05:18","12:32","16:19","19:34","21:03");
        gun_28     =    new Array("8/5/2013","03:42","05:19","12:32","16:19","19:33","21:01");
        gun_29     =    new Array("8/6/2013","03:44","05:20","12:32","16:19","19:32","21:00");
        gun_30     =    new Array("8/7/2013","03:45","05:21","12:32","16:18","19:31","20:59");
		
	break;
	case "duzce":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi DUZCE-
        gun_1      =    new Array("7/9/2013","03:28","05:25","13:08","17:04","20:38","22:25");
        gun_2      =    new Array("7/10/2013","03:29","05:26","13:08","17:04","20:37","22:24");
        gun_3      =    new Array("7/11/2013","03:30","05:27","13:08","17:04","20:37","22:23");
        gun_4      =    new Array("7/12/2013","03:31","05:27","13:08","17:04","20:36","22:22");
        gun_5      =    new Array("7/13/2013","03:32","05:28","13:08","17:04","20:36","22:21");
        gun_6      =    new Array("7/14/2013","03:34","05:29","13:08","17:04","20:35","22:20");
        gun_7      =    new Array("7/15/2013","03:35","05:30","13:08","17:04","20:35","22:19");
        gun_8      =    new Array("7/16/2013","03:36","05:31","13:08","17:04","20:34","22:18");
        gun_9      =    new Array("7/17/2013","03:37","05:31","13:09","17:04","20:34","22:17");
        gun_10     =    new Array("7/18/2013","03:39","05:32","13:09","17:04","20:33","22:16");
        gun_11     =    new Array("7/19/2013","03:40","05:33","13:09","17:04","20:32","22:15");
        gun_12     =    new Array("7/20/2013","03:42","05:34","13:09","17:04","20:31","22:14");
        gun_13     =    new Array("7/21/2013","03:43","05:35","13:09","17:04","20:31","22:13");
        gun_14     =    new Array("7/22/2013","03:44","05:36","13:09","17:03","20:30","22:11");
        gun_15     =    new Array("7/23/2013","03:46","05:36","13:09","17:03","20:29","22:10");
        gun_16     =    new Array("7/24/2013","03:47","05:37","13:09","17:03","20:28","22:09");
        gun_17     =    new Array("7/25/2013","03:49","05:38","13:09","17:03","20:27","22:07");
        gun_18     =    new Array("7/26/2013","03:50","05:39","13:09","17:03","20:26","22:06");
        gun_19     =    new Array("7/27/2013","03:52","05:40","13:09","17:02","20:26","22:04");
        gun_20     =    new Array("7/28/2013","03:53","05:41","13:09","17:02","20:25","22:03");
        gun_21     =    new Array("7/29/2013","03:55","05:42","13:09","17:02","20:24","22:02");
        gun_22     =    new Array("7/30/2013","03:56","05:43","13:09","17:02","20:23","22:00");
        gun_23     =    new Array("7/31/2013","03:58","05:44","13:09","17:01","20:22","21:58");
        gun_24     =    new Array("8/1/2013","03:59","05:45","13:09","17:01","20:20","21:57");
        gun_25     =    new Array("8/2/2013","04:01","05:46","13:09","17:00","20:19","21:55");
        gun_26     =    new Array("8/3/2013","04:02","05:47","13:09","17:00","20:18","21:54");
        gun_27     =    new Array("8/4/2013","04:04","05:48","13:09","17:00","20:17","21:52");
        gun_28     =    new Array("8/5/2013","04:05","05:49","13:08","16:59","20:16","21:50");
        gun_29     =    new Array("8/6/2013","04:07","05:50","13:08","16:59","20:15","21:49");
        gun_30     =    new Array("8/7/2013","04:08","05:51","13:08","16:58","20:14","21:47");
		
	break;
	case "edirne":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  EDIRNE-
        gun_1      =    new Array("7/9/2013","03:40","05:41","13:26","17:24","20:59","22:49");
        gun_2      =    new Array("7/10/2013","03:41","05:42","13:26","17:25","20:58","22:48");
        gun_3      =    new Array("7/11/2013","03:42","05:43","13:26","17:25","20:58","22:47");
        gun_4      =    new Array("7/12/2013","03:43","05:43","13:27","17:24","20:58","22:47");
        gun_5      =    new Array("7/13/2013","03:43","05:43","13:27","17:24","20:58","22:47");
        gun_6      =    new Array("7/14/2013","03:45","05:44","13:27","17:24","20:57","22:46");
        gun_7      =    new Array("7/15/2013","03:45","05:44","13:27","17:24","20:57","22:46");
        gun_8      =    new Array("7/16/2013","03:46","05:45","13:27","17:24","20:56","22:45");
        gun_9      =    new Array("7/17/2013","03:46","05:45","13:27","17:24","20:56","22:45");
        gun_10     =    new Array("7/18/2013","03:47","05:46","13:27","17:24","20:56","22:43");
        gun_11     =    new Array("7/19/2013","03:49","05:46","13:27","17:24","20:55","22:42");
        gun_12     =    new Array("7/20/2013","03:50","05:47","13:27","17:24","20:55","22:41");
        gun_13     =    new Array("7/21/2013","03:52","05:48","13:27","17:24","20:54","22:40");
        gun_14     =    new Array("7/22/2013","03:53","05:49","13:27","17:24","20:53","22:39");
        gun_15     =    new Array("7/23/2013","03:54","05:50","13:27","17:24","20:52","22:37");
        gun_16     =    new Array("7/24/2013","03:56","05:51","13:27","17:24","20:52","22:36");
        gun_17     =    new Array("7/25/2013","03:57","05:52","13:27","17:23","20:51","22:35");
        gun_18     =    new Array("7/26/2013","03:59","05:53","13:27","17:23","20:50","22:33");
        gun_19     =    new Array("7/27/2013","04:00","05:53","13:27","17:23","20:49","22:32");
        gun_20     =    new Array("7/28/2013","04:02","05:54","13:27","17:23","20:48","22:31");
        gun_21     =    new Array("7/29/2013","04:04","05:55","13:27","17:23","20:47","22:29");
        gun_22     =    new Array("7/30/2013","04:05","05:56","13:27","17:22","20:46","22:28");
        gun_23     =    new Array("7/31/2013","04:07","05:57","13:27","17:22","20:45","22:26");
        gun_24     =    new Array("8/1/2013","04:08","05:58","13:27","17:22","20:44","22:25");
        gun_25     =    new Array("8/2/2013","04:10","05:59","13:27","17:21","20:43","22:23");
        gun_26     =    new Array("8/3/2013","04:11","06:00","13:27","17:21","20:42","22:21");
        gun_27     =    new Array("8/4/2013","04:13","06:01","13:27","17:21","20:41","22:20");
        gun_28     =    new Array("8/5/2013","04:15","06:02","13:27","17:20","20:40","22:18");
        gun_29     =    new Array("8/6/2013","04:16","06:03","13:27","17:20","20:39","22:16");
        gun_30     =    new Array("8/7/2013","04:18","06:04","13:27","17:19","20:38","22:15");
			
	break;
	case "elazig":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi ELAZIG-
        gun_1      =    new Array("7/9/2013","03:10","05:00","12:35","16:28","19:59","21:39");
        gun_2      =    new Array("7/10/2013","03:11","05:00","12:36","16:28","19:59","21:38");
        gun_3      =    new Array("7/11/2013","03:12","05:01","12:36","16:28","19:58","21:38");
        gun_4      =    new Array("7/12/2013","03:13","05:02","12:36","16:28","19:58","21:37");
        gun_5      =    new Array("7/13/2013","03:14","05:02","12:36","16:28","19:57","21:36");
        gun_6      =    new Array("7/14/2013","03:15","05:03","12:36","16:28","19:57","21:35");
        gun_7      =    new Array("7/15/2013","03:16","05:04","12:36","16:28","19:56","21:34");
        gun_8      =    new Array("7/16/2013","03:17","05:05","12:36","16:28","19:56","21:33");
        gun_9      =    new Array("7/17/2013","03:19","05:05","12:36","16:28","19:55","21:33");
        gun_10     =    new Array("7/18/2013","03:20","05:06","12:36","16:28","19:55","21:32");
        gun_11     =    new Array("7/19/2013","03:21","05:07","12:37","16:28","19:54","21:31");
        gun_12     =    new Array("7/20/2013","03:22","05:08","12:37","16:28","19:53","21:29");
        gun_13     =    new Array("7/21/2013","03:23","05:08","12:37","16:28","19:53","21:28");
        gun_14     =    new Array("7/22/2013","03:25","05:09","12:37","16:27","19:52","21:27");
        gun_15     =    new Array("7/23/2013","03:26","05:10","12:37","16:27","19:51","21:26");
        gun_16     =    new Array("7/24/2013","03:27","05:11","12:37","16:27","19:50","21:25");
        gun_17     =    new Array("7/25/2013","03:29","05:12","12:37","16:27","19:50","21:24");
        gun_18     =    new Array("7/26/2013","03:30","05:13","12:37","16:27","19:49","21:22");
        gun_19     =    new Array("7/27/2013","03:31","05:13","12:37","16:27","19:48","21:21");
        gun_20     =    new Array("7/28/2013","03:32","05:14","12:37","16:26","19:47","21:20");
        gun_21     =    new Array("7/29/2013","03:34","05:15","12:37","16:26","19:46","21:19");
        gun_22     =    new Array("7/30/2013","03:35","05:16","12:37","16:26","19:45","21:17");
        gun_23     =    new Array("7/31/2013","03:36","05:17","12:37","16:26","19:44","21:16");
        gun_24     =    new Array("8/1/2013","03:38","05:18","12:37","16:25","19:43","21:14");
        gun_25     =    new Array("8/2/2013","03:39","05:19","12:36","16:25","19:42","21:13");
        gun_26     =    new Array("8/3/2013","03:40","05:19","12:36","16:25","19:41","21:12");
        gun_27     =    new Array("8/4/2013","03:42","05:20","12:36","16:24","19:40","21:10");
        gun_28     =    new Array("8/5/2013","03:43","05:21","12:36","16:24","19:39","21:09");
        gun_29     =    new Array("8/6/2013","03:44","05:22","12:36","16:24","19:38","21:07");
        gun_30     =    new Array("8/7/2013","03:46","05:23","12:36","16:23","19:37","21:06");
		
	break;
	case "erzincan":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ERZINCAN-
        gun_1      =    new Array("7/9/2013","03:02","04:55","12:34","16:29","20:01","21:44");
        gun_2      =    new Array("7/10/2013","03:03","04:56","12:34","16:29","20:01","21:44");
        gun_3      =    new Array("7/11/2013","03:04","04:57","12:35","16:29","20:00","21:43");
        gun_4      =    new Array("7/12/2013","03:05","04:57","12:35","16:29","20:00","21:42");
        gun_5      =    new Array("7/13/2013","03:06","04:58","12:35","16:29","19:59","21:41");
        gun_6      =    new Array("7/14/2013","03:07","04:59","12:35","16:29","19:59","21:40");
        gun_7      =    new Array("7/15/2013","03:09","05:00","12:35","16:29","19:58","21:39");
        gun_8      =    new Array("7/16/2013","03:10","05:00","12:35","16:29","19:58","21:38");
        gun_9      =    new Array("7/17/2013","03:11","05:01","12:35","16:29","19:57","21:37");
        gun_10     =    new Array("7/18/2013","03:12","05:02","12:35","16:29","19:56","21:36");
        gun_11     =    new Array("7/19/2013","03:14","05:03","12:35","16:29","19:56","21:35");
        gun_12     =    new Array("7/20/2013","03:15","05:04","12:35","16:28","19:55","21:34");
        gun_13     =    new Array("7/21/2013","03:16","05:04","12:36","16:28","19:54","21:33");
        gun_14     =    new Array("7/22/2013","03:18","05:05","12:36","16:28","19:54","21:32");
        gun_15     =    new Array("7/23/2013","03:19","05:06","12:36","16:28","19:53","21:31");
        gun_16     =    new Array("7/24/2013","03:20","05:07","12:36","16:28","19:52","21:29");
        gun_17     =    new Array("7/25/2013","03:22","05:08","12:36","16:28","19:51","21:28");
        gun_18     =    new Array("7/26/2013","03:23","05:09","12:36","16:28","19:50","21:27");
        gun_19     =    new Array("7/27/2013","03:24","05:10","12:36","16:27","19:49","21:25");
        gun_20     =    new Array("7/28/2013","03:26","05:10","12:36","16:27","19:48","21:24");
        gun_21     =    new Array("7/29/2013","03:27","05:11","12:36","16:27","19:48","21:23");
        gun_22     =    new Array("7/30/2013","03:29","05:12","12:36","16:26","19:47","21:21");
        gun_23     =    new Array("7/31/2013","03:30","05:13","12:35","16:26","19:46","21:20");
        gun_24     =    new Array("8/1/2013","03:31","05:14","12:35","16:26","19:45","21:18");
        gun_25     =    new Array("8/2/2013","03:33","05:15","12:35","16:26","19:43","21:17");
        gun_26     =    new Array("8/3/2013","03:34","05:16","12:35","16:25","19:42","21:15");
        gun_27     =    new Array("8/4/2013","03:36","05:17","12:35","16:25","19:41","21:14");
        gun_28     =    new Array("8/5/2013","03:37","05:18","12:35","16:24","19:40","21:12");
        gun_29     =    new Array("8/6/2013","03:39","05:19","12:35","16:24","19:39","21:11");
        gun_30     =    new Array("8/7/2013","03:40","05:20","12:35","16:24","19:38","21:09");
		
	break;
	case "erzurum":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi ERZURUM-
        gun_1      =    new Array("7/9/2013","02:54","04:48","12:27","16:22","19:54","21:38");
        gun_2      =    new Array("7/10/2013","02:55","04:48","12:27","16:22","19:54","21:37");
        gun_3      =    new Array("7/11/2013","02:56","04:49","12:27","16:22","19:54","21:37");
        gun_4      =    new Array("7/12/2013","02:57","04:50","12:28","16:22","19:53","21:36");
        gun_5      =    new Array("7/13/2013","02:58","04:51","12:28","16:22","19:53","21:35");
        gun_6      =    new Array("7/14/2013","02:59","04:51","12:28","16:22","19:52","21:34");
        gun_7      =    new Array("7/15/2013","03:01","04:52","12:28","16:22","19:52","21:33");
        gun_8      =    new Array("7/16/2013","03:02","04:53","12:28","16:22","19:51","21:32");
        gun_9      =    new Array("7/17/2013","03:03","04:54","12:28","16:22","19:50","21:31");
        gun_10     =    new Array("7/18/2013","03:04","04:54","12:28","16:22","19:50","21:30");
        gun_11     =    new Array("7/19/2013","03:06","04:55","12:28","16:22","19:49","21:29");
        gun_12     =    new Array("7/20/2013","03:07","04:56","12:28","16:22","19:48","21:28");
        gun_13     =    new Array("7/21/2013","03:08","04:57","12:28","16:22","19:48","21:27");
        gun_14     =    new Array("7/22/2013","03:10","04:58","12:28","16:21","19:47","21:26");
        gun_15     =    new Array("7/23/2013","03:11","04:59","12:28","16:21","19:46","21:24");
        gun_16     =    new Array("7/24/2013","03:12","04:59","12:28","16:21","19:45","21:23");
        gun_17     =    new Array("7/25/2013","03:14","05:00","12:28","16:21","19:44","21:22");
        gun_18     =    new Array("7/26/2013","03:15","05:01","12:28","16:21","19:44","21:20");
        gun_19     =    new Array("7/27/2013","03:16","05:02","12:28","16:20","19:43","21:19");
        gun_20     =    new Array("7/28/2013","03:18","05:03","12:28","16:20","19:42","21:18");
        gun_21     =    new Array("7/29/2013","03:19","05:04","12:28","16:20","19:41","21:16");
        gun_22     =    new Array("7/30/2013","03:21","05:05","12:28","16:20","19:40","21:15");
        gun_23     =    new Array("7/31/2013","03:22","05:06","12:28","16:19","19:39","21:13");
        gun_24     =    new Array("8/1/2013","03:24","05:07","12:28","16:19","19:38","21:12");
        gun_25     =    new Array("8/2/2013","03:25","05:08","12:28","16:19","19:37","21:10");
        gun_26     =    new Array("8/3/2013","03:26","05:08","12:28","16:18","19:36","21:09");
        gun_27     =    new Array("8/4/2013","03:28","05:09","12:28","16:18","19:35","21:07");
        gun_28     =    new Array("8/5/2013","03:29","05:10","12:28","16:17","19:33","21:06");
        gun_29     =    new Array("8/6/2013","03:31","05:11","12:28","16:17","19:32","21:04");
        gun_30     =    new Array("8/7/2013","03:32","05:12","12:28","16:17","19:31","21:02");
		
	break;
	case "eskisehir":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ESKISEHIR-
        gun_1      =    new Array("7/9/2013","03:38","05:31","13:10","17:05","20:37","22:20");
        gun_2      =    new Array("7/10/2013","03:39","05:32","13:10","17:05","20:37","22:20");
        gun_3      =    new Array("7/11/2013","03:40","05:33","13:10","17:05","20:36","22:19");
        gun_4      =    new Array("7/12/2013","03:41","05:33","13:11","17:05","20:36","22:18");
        gun_5      =    new Array("7/13/2013","03:42","05:34","13:11","17:05","20:35","22:17");
        gun_6      =    new Array("7/14/2013","03:43","05:35","13:11","17:05","20:35","22:16");
        gun_7      =    new Array("7/15/2013","03:44","05:35","13:11","17:05","20:34","22:15");
        gun_8      =    new Array("7/16/2013","03:46","05:36","13:11","17:05","20:34","22:14");
        gun_9      =    new Array("7/17/2013","03:47","05:37","13:11","17:05","20:33","22:13");
        gun_10     =    new Array("7/18/2013","03:48","05:38","13:11","17:05","20:32","22:12");
        gun_11     =    new Array("7/19/2013","03:49","05:39","13:11","17:05","20:32","22:11");
        gun_12     =    new Array("7/20/2013","03:51","05:39","13:11","17:04","20:31","22:10");
        gun_13     =    new Array("7/21/2013","03:52","05:40","13:11","17:04","20:30","22:09");
        gun_14     =    new Array("7/22/2013","03:53","05:41","13:11","17:04","20:30","22:08");
        gun_15     =    new Array("7/23/2013","03:55","05:42","13:11","17:04","20:29","22:07");
        gun_16     =    new Array("7/24/2013","03:56","05:43","13:12","17:04","20:28","22:05");
        gun_17     =    new Array("7/25/2013","03:57","05:44","13:12","17:04","20:27","22:04");
        gun_18     =    new Array("7/26/2013","03:59","05:45","13:12","17:03","20:26","22:03");
        gun_19     =    new Array("7/27/2013","04:00","05:45","13:12","17:03","20:25","22:01");
        gun_20     =    new Array("7/28/2013","04:02","05:46","13:11","17:03","20:24","22:00");
        gun_21     =    new Array("7/29/2013","04:03","05:47","13:11","17:03","20:23","21:59");
        gun_22     =    new Array("7/30/2013","04:04","05:48","13:11","17:02","20:23","21:57");
        gun_23     =    new Array("7/31/2013","04:06","05:49","13:11","17:02","20:22","21:56");
        gun_24     =    new Array("8/1/2013","04:06","05:49","13:11","17:02","20:22","21:56");
        gun_25     =    new Array("8/2/2013","04:06","05:49","13:11","17:02","20:22","21:56");
        gun_26     =    new Array("8/3/2013","04:06","05:49","13:11","17:02","20:22","21:56");
        gun_27     =    new Array("8/4/2013","04:06","05:49","13:11","17:02","20:22","21:56");
        gun_28     =    new Array("8/5/2013","04:06","05:49","13:11","17:02","20:22","21:56");
        gun_29     =    new Array("8/6/2013","04:07","05:50","13:11","17:02","20:20","21:54");
        gun_30     =    new Array("8/7/2013","04:07","05:50","13:11","17:02","20:20","21:54");
		
	break;
	case "gaziantep":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi GAZIANTEP-
        gun_1      =    new Array("7/9/2013","03:27","05:12","12:43","16:32","20:02","21:37");
        gun_2      =    new Array("7/10/2013","03:28","05:12","12:43","16:32","20:01","21:37");
        gun_3      =    new Array("7/11/2013","03:29","05:13","12:43","16:32","20:01","21:36");
        gun_4      =    new Array("7/12/2013","03:30","05:14","12:43","16:32","20:01","21:35");
        gun_5      =    new Array("7/13/2013","03:31","05:14","12:43","16:32","20:00","21:35");
        gun_6      =    new Array("7/14/2013","03:32","05:15","12:43","16:32","20:00","21:34");
        gun_7      =    new Array("7/15/2013","03:33","05:16","12:44","16:32","19:59","21:33");
        gun_8      =    new Array("7/16/2013","03:34","05:16","12:44","16:32","19:59","21:32");
        gun_9      =    new Array("7/17/2013","03:35","05:17","12:44","16:32","19:58","21:32");
        gun_10     =    new Array("7/18/2013","03:36","05:18","12:44","16:32","19:58","21:31");
        gun_11     =    new Array("7/19/2013","03:37","05:18","12:44","16:32","19:57","21:30");
        gun_12     =    new Array("7/20/2013","03:38","05:19","12:44","16:32","19:56","21:29");
        gun_13     =    new Array("7/21/2013","03:39","05:20","12:44","16:32","19:56","21:28");
        gun_14     =    new Array("7/22/2013","03:40","05:21","12:44","16:32","19:55","21:27");
        gun_15     =    new Array("7/23/2013","03:42","05:21","12:44","16:32","19:54","21:26");
        gun_16     =    new Array("7/24/2013","03:43","05:22","12:44","16:32","19:54","21:25");
        gun_17     =    new Array("7/25/2013","03:44","05:23","12:44","16:32","19:53","21:23");
        gun_18     =    new Array("7/26/2013","03:45","05:24","12:44","16:31","19:52","21:22");
        gun_19     =    new Array("7/27/2013","03:46","05:25","12:44","16:31","19:51","21:21");
        gun_20     =    new Array("7/28/2013","03:47","05:25","12:44","16:31","19:51","21:20");
        gun_21     =    new Array("7/29/2013","03:49","05:26","12:44","16:31","19:50","21:19");
        gun_22     =    new Array("7/30/2013","03:50","05:27","12:44","16:31","19:49","21:17");
        gun_23     =    new Array("7/31/2013","03:51","05:28","12:44","16:30","19:48","21:16");
        gun_24     =    new Array("8/1/2013","03:52","05:29","12:44","16:30","19:47","21:15");
        gun_25     =    new Array("8/2/2013","03:54","05:29","12:44","16:30","19:46","21:14");
        gun_26     =    new Array("8/3/2013","03:55","05:30","12:44","16:30","19:45","21:12");
        gun_27     =    new Array("8/4/2013","03:56","05:31","12:44","16:29","19:44","21:11");
        gun_28     =    new Array("8/5/2013","03:57","05:32","12:44","16:29","19:43","21:09");
        gun_29     =    new Array("8/6/2013","03:58","05:33","12:43","16:29","19:42","21:08");
        gun_30     =    new Array("8/7/2013","04:00","05:34","12:43","16:28","19:41","21:07");
		
	break;
	case "giresun":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi GIRESUN-
        gun_1      =    new Array("7/9/2013","02:58","04:56","12:39","16:36","20:09","21:56");
        gun_2      =    new Array("7/10/2013","02:59","04:57","12:39","16:36","20:09","21:56");
        gun_3      =    new Array("7/11/2013","03:00","04:58","12:39","16:36","20:08","21:55");
        gun_4      =    new Array("7/12/2013","03:02","04:58","12:39","16:36","20:08","21:54");
        gun_5      =    new Array("7/13/2013","03:03","04:59","12:39","16:36","20:07","21:53");
        gun_6      =    new Array("7/14/2013","03:04","05:00","12:39","16:36","20:07","21:52");
        gun_7      =    new Array("7/15/2013","03:05","05:01","12:39","16:36","20:06","21:51");
        gun_8      =    new Array("7/16/2013","03:07","05:01","12:40","16:35","20:06","21:50");
        gun_9      =    new Array("7/17/2013","03:08","05:02","12:40","16:35","20:05","21:49");
        gun_10     =    new Array("7/18/2013","03:09","05:03","12:40","16:35","20:04","21:48");
        gun_11     =    new Array("7/19/2013","03:11","05:04","12:40","16:35","20:04","21:47");
        gun_12     =    new Array("7/20/2013","03:12","05:05","12:40","16:35","20:03","21:45");
        gun_13     =    new Array("7/21/2013","03:14","05:06","12:40","16:35","20:02","21:44");
        gun_14     =    new Array("7/22/2013","03:15","05:06","12:40","16:35","20:01","21:43");
        gun_15     =    new Array("7/23/2013","03:16","05:07","12:40","16:35","20:00","21:42");
        gun_16     =    new Array("7/24/2013","03:18","05:08","12:40","16:34","20:00","21:40");
        gun_17     =    new Array("7/25/2013","03:19","05:09","12:40","16:34","19:59","21:39");
        gun_18     =    new Array("7/26/2013","03:21","05:10","12:40","16:34","19:58","21:37");
        gun_19     =    new Array("7/27/2013","03:22","05:11","12:40","16:34","19:57","21:36");
        gun_20     =    new Array("7/28/2013","03:24","05:12","12:40","16:33","19:56","21:35");
        gun_21     =    new Array("7/29/2013","03:25","05:13","12:40","16:33","19:55","21:33");
        gun_22     =    new Array("7/30/2013","03:27","05:14","12:40","16:33","19:54","21:32");
        gun_23     =    new Array("7/31/2013","03:28","05:15","12:40","16:32","19:53","21:30");
        gun_24     =    new Array("8/1/2013","03:30","05:16","12:40","16:32","19:52","21:28");
        gun_25     =    new Array("8/2/2013","03:31","05:17","12:40","16:32","19:51","21:27");
        gun_26     =    new Array("8/3/2013","03:33","05:18","12:40","16:31","19:50","21:25");
        gun_27     =    new Array("8/4/2013","03:34","05:19","12:40","16:31","19:48","21:24");
        gun_28     =    new Array("8/5/2013","03:36","05:20","12:40","16:30","19:47","21:22");
        gun_29     =    new Array("8/6/2013","03:37","05:21","12:39","16:30","19:46","21:20");
        gun_30     =    new Array("8/7/2013","03:39","05:22","12:39","16:30","19:45","21:19");
		
	break;
	case "gumushane":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi GUMUSHANE-
        gun_1      =    new Array("7/9/2013","02:57","04:53","12:34","16:30","20:03","21:49");
        gun_2      =    new Array("7/10/2013","02:58","04:54","12:35","16:30","20:03","21:48");
        gun_3      =    new Array("7/11/2013","02:59","04:55","12:35","16:30","20:02","21:47");
        gun_4      =    new Array("7/12/2013","03:00","04:55","12:35","16:30","20:02","21:47");
        gun_5      =    new Array("7/13/2013","03:02","04:56","12:35","16:30","20:02","21:46");
        gun_6      =    new Array("7/14/2013","03:03","04:57","12:35","16:30","20:01","21:45");
        gun_7      =    new Array("7/15/2013","03:04","04:58","12:35","16:30","20:00","21:44");
        gun_8      =    new Array("7/16/2013","03:05","04:58","12:35","16:30","20:00","21:43");
        gun_9      =    new Array("7/17/2013","03:07","04:59","12:35","16:30","19:59","21:42");
        gun_10     =    new Array("7/18/2013","03:08","05:00","12:35","16:30","19:59","21:41");
        gun_11     =    new Array("7/19/2013","03:09","05:01","12:35","16:30","19:58","21:40");
        gun_12     =    new Array("7/20/2013","03:11","05:02","12:36","16:30","19:57","21:38");
        gun_13     =    new Array("7/21/2013","03:12","05:03","12:36","16:30","19:56","21:37");
        gun_14     =    new Array("7/22/2013","03:13","05:03","12:36","16:30","19:56","21:36");
        gun_15     =    new Array("7/23/2013","03:15","05:04","12:36","16:29","19:55","21:35");
        gun_16     =    new Array("7/24/2013","03:16","05:05","12:36","16:29","19:54","21:33");
        gun_17     =    new Array("7/25/2013","03:18","05:06","12:36","16:29","19:53","21:32");
        gun_18     =    new Array("7/26/2013","03:19","05:07","12:36","16:29","19:52","21:31");
        gun_19     =    new Array("7/27/2013","03:21","05:08","12:36","16:29","19:51","21:29");
        gun_20     =    new Array("7/28/2013","03:22","05:09","12:36","16:28","19:50","21:28");
        gun_21     =    new Array("7/29/2013","03:23","05:10","12:36","16:28","19:49","21:26");
        gun_22     =    new Array("7/30/2013","03:25","05:11","12:36","16:28","19:48","21:25");
        gun_23     =    new Array("7/31/2013","03:26","05:12","12:36","16:27","19:47","21:23");
        gun_24     =    new Array("8/1/2013","03:28","05:12","12:35","16:27","19:46","21:22");
        gun_25     =    new Array("8/2/2013","03:29","05:13","12:35","16:27","19:45","21:20");
        gun_26     =    new Array("8/3/2013","03:31","05:14","12:35","16:26","19:44","21:19");
        gun_27     =    new Array("8/4/2013","03:32","05:15","12:35","16:26","19:43","21:17");
        gun_28     =    new Array("8/5/2013","03:34","05:16","12:35","16:25","19:42","21:15");
        gun_29     =    new Array("8/6/2013","03:35","05:17","12:35","16:25","19:41","21:14");
        gun_30     =    new Array("8/7/2013","03:37","05:18","12:35","16:25","19:39","21:12");
		
	break;
	case "hakkari":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi HAKKARI-
        gun_1      =    new Array("7/9/2013","02:58","04:45","12:17","16:07","19:38","21:15");
        gun_2      =    new Array("7/10/2013","02:59","04:45","12:17","16:07","19:37","21:14");
        gun_3      =    new Array("7/11/2013","03:00","04:46","12:18","16:08","19:37","21:13");
        gun_4      =    new Array("7/12/2013","03:01","04:47","12:18","16:08","19:37","21:13");
        gun_5      =    new Array("7/13/2013","03:02","04:47","12:18","16:08","19:36","21:12");
        gun_6      =    new Array("7/14/2013","03:03","04:48","12:18","16:08","19:36","21:11");
        gun_7      =    new Array("7/15/2013","03:04","04:49","12:18","16:08","19:35","21:10");
        gun_8      =    new Array("7/16/2013","03:06","04:49","12:18","16:08","19:35","21:10");
        gun_9      =    new Array("7/17/2013","03:07","04:50","12:18","16:08","19:34","21:09");
        gun_10     =    new Array("7/18/2013","03:08","04:51","12:18","16:08","19:34","21:08");
        gun_11     =    new Array("7/19/2013","03:09","04:52","12:18","16:08","19:33","21:07");
        gun_12     =    new Array("7/20/2013","03:10","04:52","12:18","16:07","19:32","21:06");
        gun_13     =    new Array("7/21/2013","03:11","04:53","12:19","16:07","19:32","21:05");
        gun_14     =    new Array("7/22/2013","03:12","04:54","12:19","16:07","19:31","21:04");
        gun_15     =    new Array("7/23/2013","03:14","04:55","12:19","16:07","19:30","21:03");
        gun_16     =    new Array("7/24/2013","03:15","04:56","12:19","16:07","19:29","21:01");
        gun_17     =    new Array("7/25/2013","03:16","04:56","12:19","16:07","19:29","21:00");
        gun_18     =    new Array("7/26/2013","03:17","04:57","12:19","16:07","19:28","20:59");
        gun_19     =    new Array("7/27/2013","03:18","04:58","12:19","16:07","19:27","20:58");
        gun_20     =    new Array("7/28/2013","03:20","04:59","12:19","16:06","19:26","20:57");
        gun_21     =    new Array("7/29/2013","03:21","05:00","12:19","16:06","19:25","20:55");
        gun_22     =    new Array("7/30/2013","03:22","05:00","12:19","16:06","19:24","20:54");
        gun_23     =    new Array("7/31/2013","03:23","05:01","12:19","16:06","19:24","20:53");
        gun_24     =    new Array("8/1/2013","03:25","05:02","12:18","16:06","19:23","20:52");
        gun_25     =    new Array("8/2/2013","03:26","05:03","12:18","16:05","19:22","20:50");
        gun_26     =    new Array("8/3/2013","03:27","05:04","12:18","16:05","19:21","20:49");
        gun_27     =    new Array("8/4/2013","03:28","05:05","12:18","16:05","19:20","20:47");
        gun_28     =    new Array("8/5/2013","03:30","05:05","12:18","16:04","19:19","20:46");
        gun_29     =    new Array("8/6/2013","03:31","05:06","12:18","16:04","19:18","20:45");
        gun_30     =    new Array("8/7/2013","03:32","05:07","12:18","16:04","19:16","20:43");
		
	break;
	case "hatay":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi HATAY-
        gun_1      =    new Array("7/9/2013","03:36","05:19","12:48","16:35","20:04","21:38");
        gun_2      =    new Array("7/10/2013","03:37","05:20","12:48","16:35","20:04","21:37");
        gun_3      =    new Array("7/11/2013","03:38","05:20","12:48","16:35","20:03","21:37");
        gun_4      =    new Array("7/12/2013","03:39","05:21","12:48","16:35","20:03","21:36");
        gun_5      =    new Array("7/13/2013","03:40","05:21","12:48","16:35","20:03","21:35");
        gun_6      =    new Array("7/14/2013","03:41","05:22","12:48","16:35","20:02","21:35");
        gun_7      =    new Array("7/15/2013","03:42","05:23","12:48","16:35","20:02","21:34");
        gun_8      =    new Array("7/16/2013","03:43","05:23","12:49","16:35","20:01","21:33");
        gun_9      =    new Array("7/17/2013","03:44","05:24","12:49","16:35","20:01","21:32");
        gun_10     =    new Array("7/18/2013","03:45","05:25","12:49","16:35","20:00","21:31");
        gun_11     =    new Array("7/19/2013","03:46","05:25","12:49","16:35","20:00","21:30");
        gun_12     =    new Array("7/20/2013","03:47","05:26","12:49","16:35","19:59","21:30");
        gun_13     =    new Array("7/21/2013","03:48","05:27","12:49","16:35","19:59","21:29");
        gun_14     =    new Array("7/22/2013","03:49","05:28","12:49","16:35","19:58","21:28");
        gun_15     =    new Array("7/23/2013","03:50","05:28","12:49","16:35","19:57","21:27");
        gun_16     =    new Array("7/24/2013","03:52","05:29","12:49","16:35","19:56","21:26");
        gun_17     =    new Array("7/25/2013","03:53","05:30","12:49","16:35","19:56","21:25");
        gun_18     =    new Array("7/26/2013","03:54","05:31","12:49","16:35","19:55","21:23");
        gun_19     =    new Array("7/27/2013","03:55","05:31","12:49","16:35","19:54","21:22");
        gun_20     =    new Array("7/28/2013","03:56","05:32","12:49","16:34","19:53","21:21");
        gun_21     =    new Array("7/29/2013","03:57","05:33","12:49","16:34","19:53","21:20");
        gun_22     =    new Array("7/30/2013","03:58","05:34","12:49","16:34","19:52","21:19");
        gun_23     =    new Array("7/31/2013","04:00","05:35","12:49","16:34","19:51","21:18");
        gun_24     =    new Array("8/1/2013","04:01","05:35","12:49","16:34","19:50","21:16");
        gun_25     =    new Array("8/2/2013","04:02","05:36","12:49","16:33","19:49","21:15");
        gun_26     =    new Array("8/3/2013","04:03","05:37","12:49","16:33","19:48","21:14");
        gun_27     =    new Array("8/4/2013","04:04","05:38","12:49","16:33","19:47","21:12");
        gun_28     =    new Array("8/5/2013","04:06","05:39","12:48","16:33","19:46","21:11");
        gun_29     =    new Array("8/6/2013","04:07","05:39","12:48","16:32","19:45","21:10");
        gun_30     =    new Array("8/7/2013","04:08","05:40","12:48","16:32","19:44","21:08");
		
	break;
	case "igdir":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  IGDIR-
        gun_1      =    new Array("7/9/2013","02:43","04:37","12:16","16:11","19:43","21:27");
        gun_2      =    new Array("7/10/2013","02:44","04:37","12:16","16:11","19:43","21:27");
        gun_3      =    new Array("7/11/2013","02:45","04:38","12:16","16:11","19:43","21:26");
        gun_4      =    new Array("7/12/2013","02:46","04:39","12:17","16:11","19:42","21:25");
        gun_5      =    new Array("7/13/2013","02:47","04:39","12:17","16:11","19:42","21:24");
        gun_6      =    new Array("7/14/2013","02:48","04:40","12:17","16:11","19:41","21:23");
        gun_7      =    new Array("7/15/2013","02:49","04:41","12:17","16:11","19:41","21:22");
        gun_8      =    new Array("7/16/2013","02:51","04:42","12:17","16:11","19:40","21:21");
        gun_9      =    new Array("7/17/2013","02:52","04:42","12:17","16:11","19:39","21:20");
        gun_10     =    new Array("7/18/2013","02:53","04:43","12:17","16:11","19:39","21:19");
        gun_11     =    new Array("7/19/2013","02:54","04:44","12:17","16:11","19:38","21:18");
        gun_12     =    new Array("7/20/2013","02:56","04:45","12:17","16:11","19:37","21:17");
        gun_13     =    new Array("7/21/2013","02:57","04:46","12:17","16:10","19:37","21:16");
        gun_14     =    new Array("7/22/2013","02:58","04:47","12:17","16:10","19:36","21:15");
        gun_15     =    new Array("7/23/2013","03:00","04:47","12:17","16:10","19:35","21:13");
        gun_16     =    new Array("7/24/2013","03:01","04:48","12:17","16:10","19:34","21:12");
        gun_17     =    new Array("7/25/2013","03:02","04:49","12:17","16:10","19:33","21:11");
        gun_18     =    new Array("7/26/2013","03:04","04:50","12:17","16:10","19:33","21:09");
        gun_19     =    new Array("7/27/2013","03:05","04:51","12:17","16:09","19:32","21:08");
        gun_20     =    new Array("7/28/2013","03:07","04:52","12:17","16:09","19:31","21:07");
        gun_21     =    new Array("7/29/2013","03:08","04:53","12:17","16:09","19:30","21:05");
        gun_22     =    new Array("7/30/2013","03:10","04:54","12:17","16:09","19:29","21:04");
        gun_23     =    new Array("7/31/2013","03:11","04:55","12:17","16:08","19:28","21:02");
        gun_24     =    new Array("8/1/2013","03:12","04:55","12:17","16:08","19:27","21:01");
        gun_25     =    new Array("8/2/2013","03:14","04:56","12:17","16:08","19:26","20:59");
        gun_26     =    new Array("8/3/2013","03:15","04:57","12:17","16:07","19:25","20:58");
        gun_27     =    new Array("8/4/2013","03:17","04:58","12:17","16:07","19:23","20:56");
        gun_28     =    new Array("8/5/2013","03:18","04:59","12:17","16:06","19:22","20:55");
        gun_29     =    new Array("8/6/2013","03:20","05:00","12:17","16:06","19:21","20:53");
        gun_30     =    new Array("8/7/2013","03:21","05:01","12:17","16:06","19:20","20:51");
		
	break;
	case "isparta":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ISPARTA-
        gun_1      =    new Array("7/9/2013","03:50","05:37","13:10","17:00","20:31","22:08");
        gun_2      =    new Array("7/10/2013","03:51","05:38","13:10","17:01","20:31","22:08");
        gun_3      =    new Array("7/11/2013","03:52","05:38","13:10","17:01","20:30","22:07");
        gun_4      =    new Array("7/12/2013","03:53","05:39","13:10","17:01","20:30","22:06");
        gun_5      =    new Array("7/13/2013","03:54","05:40","13:11","17:01","20:29","22:06");
        gun_6      =    new Array("7/14/2013","03:55","05:40","13:11","17:01","20:29","22:05");
        gun_7      =    new Array("7/15/2013","03:56","05:41","13:11","17:01","20:28","22:04");
        gun_8      =    new Array("7/16/2013","03:57","05:42","13:11","17:01","20:28","22:03");
        gun_9      =    new Array("7/17/2013","03:58","05:42","13:11","17:01","20:27","22:02");
        gun_10     =    new Array("7/18/2013","03:59","05:43","13:11","17:01","20:27","22:01");
        gun_11     =    new Array("7/19/2013","04:01","05:44","13:11","17:01","20:26","22:00");
        gun_12     =    new Array("7/20/2013","04:02","05:45","13:11","17:01","20:26","21:59");
        gun_13     =    new Array("7/21/2013","04:03","05:45","13:11","17:01","20:25","21:58");
        gun_14     =    new Array("7/22/2013","04:04","05:46","13:11","17:00","20:24","21:57");
        gun_15     =    new Array("7/23/2013","04:05","05:47","13:11","17:00","20:23","21:56");
        gun_16     =    new Array("7/24/2013","04:07","05:48","13:11","17:00","20:23","21:55");
        gun_17     =    new Array("7/25/2013","04:08","05:49","13:11","17:00","20:22","21:54");
        gun_18     =    new Array("7/26/2013","04:09","05:49","13:11","17:00","20:21","21:53");
        gun_19     =    new Array("7/27/2013","04:10","05:50","13:11","17:00","20:20","21:52");
        gun_20     =    new Array("7/28/2013","04:12","05:51","13:11","17:00","20:19","21:50");
        gun_21     =    new Array("7/29/2013","04:13","05:52","13:11","16:59","20:19","21:49");
        gun_22     =    new Array("7/30/2013","04:14","05:53","13:11","16:59","20:18","21:48");
        gun_23     =    new Array("7/31/2013","04:15","05:54","13:11","16:59","20:17","21:46");
        gun_24     =    new Array("8/1/2013","04:17","05:54","13:11","16:59","20:16","21:45");
        gun_25     =    new Array("8/2/2013","04:18","05:55","13:11","16:58","20:15","21:44");
        gun_26     =    new Array("8/3/2013","04:19","05:56","13:11","16:58","20:14","21:42");
        gun_27     =    new Array("8/4/2013","04:20","05:57","13:11","16:58","20:13","21:41");
        gun_28     =    new Array("8/5/2013","04:22","05:58","13:11","16:57","20:12","21:40");
        gun_29     =    new Array("8/6/2013","04:23","05:59","13:11","16:57","20:11","21:38");
        gun_30     =    new Array("8/7/2013","04:24","05:59","13:11","16:57","20:10","21:37");
		
	break;
	case "istanbul":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi ISTANBUL-
        gun_1      =    new Array("7/9/2013","03:35","05:33","13:16","17:13","20:47","22:35");
        gun_2      =    new Array("7/10/2013","03:36","05:34","13:17","17:13","20:47","22:34");
        gun_3      =    new Array("7/11/2013","03:37","05:35","13:17","17:13","20:46","22:33");
        gun_4      =    new Array("7/12/2013","03:39","05:36","13:17","17:13","20:46","22:32");
        gun_5      =    new Array("7/13/2013","03:40","05:36","13:17","17:13","20:45","22:31");
        gun_6      =    new Array("7/14/2013","03:41","05:37","13:17","17:13","20:45","22:30");
        gun_7      =    new Array("7/15/2013","03:42","05:38","13:17","17:13","20:44","22:29");
        gun_8      =    new Array("7/16/2013","03:44","05:39","13:17","17:13","20:43","22:28");
        gun_9      =    new Array("7/17/2013","03:45","05:40","13:17","17:13","20:43","22:27");
        gun_10     =    new Array("7/18/2013","03:46","05:40","13:17","17:13","20:42","22:26");
        gun_11     =    new Array("7/19/2013","03:48","05:41","13:17","17:13","20:41","22:25");
        gun_12     =    new Array("7/20/2013","03:49","05:42","13:18","17:13","20:41","22:24");
        gun_13     =    new Array("7/21/2013","03:51","05:43","13:18","17:13","20:40","22:22");
        gun_14     =    new Array("7/22/2013","03:52","05:44","13:18","17:13","20:39","22:21");
        gun_15     =    new Array("7/23/2013","03:53","05:45","13:18","17:12","20:38","22:20");
        gun_16     =    new Array("7/24/2013","03:55","05:46","13:18","17:12","20:37","22:18");
        gun_17     =    new Array("7/25/2013","03:56","05:47","13:18","17:12","20:37","22:17");
        gun_18     =    new Array("7/26/2013","03:58","05:47","13:18","17:12","20:36","22:16");
        gun_19     =    new Array("7/27/2013","03:59","05:48","13:18","17:11","20:35","22:14");
        gun_20     =    new Array("7/28/2013","04:01","05:49","13:18","17:11","20:34","22:13");
        gun_21     =    new Array("7/29/2013","04:02","05:50","13:18","17:11","20:33","22:11");
        gun_22     =    new Array("7/30/2013","04:04","05:51","13:18","17:11","20:32","22:10");
        gun_23     =    new Array("7/31/2013","04:05","05:52","13:18","17:10","20:31","22:08");
        gun_24     =    new Array("8/1/2013","04:07","05:53","13:17","17:10","20:30","22:07");
        gun_25     =    new Array("8/2/2013","04:08","05:54","13:17","17:09","20:29","22:05");
        gun_26     =    new Array("8/3/2013","04:10","05:55","13:17","17:09","20:27","22:03");
        gun_27     =    new Array("8/4/2013","04:11","05:56","13:17","17:09","20:26","22:02");
        gun_28     =    new Array("8/5/2013","04:13","05:57","13:17","17:08","20:25","22:00");
        gun_29     =    new Array("8/6/2013","04:15","05:58","13:17","17:08","20:24","21:58");
        gun_30     =    new Array("8/7/2013","04:16","05:59","13:17","17:07","20:23","21:57");
		
	break;
	case "izmir":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  IZMIR-
        gun_1      =    new Array("7/9/2013","04:00","05:49","13:24","17:16","20:46","22:26");
        gun_2      =    new Array("7/10/2013","04:01","05:49","13:24","17:16","20:46","22:25");
        gun_3      =    new Array("7/11/2013","04:02","05:50","13:24","17:16","20:46","22:24");
        gun_4      =    new Array("7/12/2013","04:03","05:51","13:24","17:16","20:45","22:24");
        gun_5      =    new Array("7/13/2013","04:04","05:51","13:24","17:16","20:45","22:23");
        gun_6      =    new Array("7/14/2013","04:05","05:52","13:24","17:16","20:44","22:22");
        gun_7      =    new Array("7/15/2013","04:06","05:53","13:24","17:16","20:44","22:21");
        gun_8      =    new Array("7/16/2013","04:07","05:54","13:25","17:16","20:43","22:20");
        gun_9      =    new Array("7/17/2013","04:08","05:54","13:25","17:16","20:43","22:19");
        gun_10     =    new Array("7/18/2013","04:09","05:55","13:25","17:16","20:42","22:19");
        gun_11     =    new Array("7/19/2013","04:11","05:56","13:25","17:16","20:42","22:18");
        gun_12     =    new Array("7/20/2013","04:12","05:57","13:25","17:15","20:41","22:16");
        gun_13     =    new Array("7/21/2013","04:13","05:57","13:25","17:15","20:40","22:15");
        gun_14     =    new Array("7/22/2013","04:14","05:58","13:25","17:15","20:40","22:14");
        gun_15     =    new Array("7/23/2013","04:16","05:59","13:25","17:15","20:39","22:13");
        gun_16     =    new Array("7/24/2013","04:17","06:00","13:25","17:15","20:38","22:12");
        gun_17     =    new Array("7/25/2013","04:18","06:01","13:25","17:15","20:37","22:11");
        gun_18     =    new Array("7/26/2013","04:19","06:01","13:25","17:15","20:36","22:10");
        gun_19     =    new Array("7/27/2013","04:21","06:02","13:25","17:14","20:36","22:08");
        gun_20     =    new Array("7/28/2013","04:22","06:03","13:25","17:14","20:35","22:07");
        gun_21     =    new Array("7/29/2013","04:23","06:04","13:25","17:14","20:34","22:06");
        gun_22     =    new Array("7/30/2013","04:25","06:05","13:25","17:14","20:33","22:04");
        gun_23     =    new Array("7/31/2013","04:26","06:06","13:25","17:14","20:32","22:03");
        gun_24     =    new Array("8/1/2013","04:27","06:07","13:25","17:13","20:31","22:02");
        gun_25     =    new Array("8/2/2013","04:28","06:07","13:25","17:13","20:30","22:00");
        gun_26     =    new Array("8/3/2013","04:30","06:08","13:25","17:13","20:29","21:59");
        gun_27     =    new Array("8/4/2013","04:31","06:09","13:25","17:12","20:28","21:57");
        gun_28     =    new Array("8/5/2013","04:32","06:10","13:25","17:12","20:27","21:56");
        gun_29     =    new Array("8/6/2013","04:34","06:11","13:24","17:12","20:26","21:54");
        gun_30     =    new Array("8/7/2013","04:35","06:12","13:24","17:11","20:25","21:53");

	break;
	case "kahramanmaras":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  KAHRAMANMARAS-
        gun_1      =    new Array("7/9/2013","03:26","05:12","12:45","16:35","20:05","21:42");
        gun_2      =    new Array("7/10/2013","03:27","05:13","12:45","16:35","20:05","21:41");
        gun_3      =    new Array("7/11/2013","03:28","05:13","12:45","16:35","20:04","21:41");
        gun_4      =    new Array("7/12/2013","03:29","05:14","12:45","16:35","20:04","21:40");
        gun_5      =    new Array("7/13/2013","03:30","05:15","12:45","16:35","20:03","21:39");
        gun_6      =    new Array("7/14/2013","03:31","05:15","12:45","16:35","20:03","21:38");
        gun_7      =    new Array("7/15/2013","03:32","05:16","12:45","16:35","20:02","21:38");
        gun_8      =    new Array("7/16/2013","03:33","05:17","12:45","16:35","20:02","21:37");
        gun_9      =    new Array("7/17/2013","03:34","05:17","12:45","16:35","20:01","21:36");
        gun_10     =    new Array("7/18/2013","03:35","05:18","12:46","16:35","20:01","21:35");
        gun_11     =    new Array("7/19/2013","03:36","05:19","12:46","16:35","20:00","21:34");
        gun_12     =    new Array("7/20/2013","03:37","05:20","12:46","16:35","20:00","21:33");
        gun_13     =    new Array("7/21/2013","03:38","05:20","12:46","16:35","19:59","21:32");
        gun_14     =    new Array("7/22/2013","03:40","05:21","12:46","16:35","19:58","21:31");
        gun_15     =    new Array("7/23/2013","03:41","05:22","12:46","16:34","19:57","21:30");
        gun_16     =    new Array("7/24/2013","03:42","05:23","12:46","16:34","19:57","21:29");
        gun_17     =    new Array("7/25/2013","03:43","05:24","12:46","16:34","19:56","21:28");
        gun_18     =    new Array("7/26/2013","03:44","05:24","12:46","16:34","19:55","21:26");
        gun_19     =    new Array("7/27/2013","03:46","05:25","12:46","16:34","19:54","21:25");
        gun_20     =    new Array("7/28/2013","03:47","05:26","12:46","16:34","19:53","21:24");
        gun_21     =    new Array("7/29/2013","03:48","05:27","12:46","16:33","19:53","21:23");
        gun_22     =    new Array("7/30/2013","03:49","05:28","12:46","16:33","19:52","21:21");
        gun_23     =    new Array("7/31/2013","03:51","05:28","12:46","16:33","19:51","21:20");
        gun_24     =    new Array("8/1/2013","03:52","05:29","12:46","16:33","19:50","21:19");
        gun_25     =    new Array("8/2/2013","03:53","05:30","12:46","16:32","19:49","21:17");
        gun_26     =    new Array("8/3/2013","03:54","05:31","12:46","16:32","19:48","21:16");
        gun_27     =    new Array("8/4/2013","03:56","05:32","12:45","16:32","19:47","21:15");
        gun_28     =    new Array("8/5/2013","03:57","05:33","12:45","16:32","19:46","21:13");
        gun_29     =    new Array("8/6/2013","03:58","05:33","12:45","16:31","19:45","21:12");
        gun_30     =    new Array("8/7/2013","03:59","05:34","12:45","16:31","19:44","21:10");
		
	break;
	case "karabuk":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi KARABUK-
        gun_1      =    new Array("7/9/2013","03:19","05:18","13:02","16:59","20:33","22:21");
        gun_2      =    new Array("7/10/2013","03:20","05:19","13:02","16:59","20:33","22:21");
        gun_3      =    new Array("7/11/2013","03:22","05:20","13:02","16:59","20:32","22:20");
        gun_4      =    new Array("7/12/2013","03:23","05:21","13:02","16:59","20:32","22:19");
        gun_5      =    new Array("7/13/2013","03:23","05:21","13:02","16:59","20:32","22:19");
        gun_6      =    new Array("7/14/2013","03:23","05:21","13:02","16:59","20:32","22:19");
        gun_7      =    new Array("7/15/2013","03:23","05:21","13:02","16:59","20:32","22:19");
        gun_8      =    new Array("7/16/2013","03:23","05:21","13:02","16:59","20:32","22:19");
        gun_9      =    new Array("7/17/2013","03:23","05:21","13:02","16:59","20:32","22:19");
        gun_10     =    new Array("7/18/2013","03:23","05:21","13:02","16:59","20:32","22:19");
        gun_11     =    new Array("7/19/2013","03:23","05:21","13:02","16:59","20:32","22:19");
        gun_12     =    new Array("7/20/2013","03:24","05:21","13:02","16:59","20:31","22:18");
        gun_13     =    new Array("7/21/2013","03:24","05:21","13:02","16:59","20:31","22:18");
        gun_14     =    new Array("7/22/2013","03:24","05:21","13:02","16:59","20:31","22:18");
        gun_15     =    new Array("7/23/2013","03:24","05:21","13:02","16:59","20:31","22:18");
        gun_16     =    new Array("7/24/2013","03:24","05:21","13:02","16:59","20:31","22:18");
        gun_17     =    new Array("7/25/2013","03:24","05:21","13:02","16:59","20:31","22:18");
        gun_18     =    new Array("7/26/2013","03:24","05:21","13:02","16:59","20:31","22:18");
        gun_19     =    new Array("7/27/2013","03:24","05:21","13:02","16:59","20:31","22:18");
        gun_20     =    new Array("7/28/2013","03:25","05:22","13:02","16:59","20:31","22:17");
        gun_21     =    new Array("7/29/2013","03:25","05:22","13:02","16:59","20:31","22:17");
        gun_22     =    new Array("7/30/2013","03:25","05:22","13:02","16:59","20:31","22:17");
        gun_23     =    new Array("7/31/2013","03:25","05:22","13:02","16:59","20:31","22:17");
        gun_24     =    new Array("8/1/2013","03:25","05:22","13:02","16:59","20:31","22:17");
        gun_25     =    new Array("8/2/2013","03:25","05:22","13:02","16:59","20:31","22:17");
        gun_26     =    new Array("8/3/2013","03:25","05:22","13:02","16:59","20:31","22:17");
        gun_27     =    new Array("8/4/2013","03:25","05:22","13:02","16:59","20:31","22:17");
        gun_28     =    new Array("8/5/2013","03:27","05:23","13:03","16:59","20:30","22:16");
        gun_29     =    new Array("8/6/2013","03:28","05:24","13:03","16:59","20:29","22:15");
        gun_30     =    new Array("8/7/2013","03:29","05:24","13:03","16:59","20:29","22:14");
		
	break;
	case "karaman":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  KARAMAN-
        gun_1      =    new Array("7/9/2013","03:43","05:28","12:59","16:49","20:19","21:55");
        gun_2      =    new Array("7/10/2013","03:44","05:29","13:00","16:49","20:18","21:54");
        gun_3      =    new Array("7/11/2013","03:45","05:29","13:00","16:49","20:18","21:53");
        gun_4      =    new Array("7/12/2013","03:46","05:30","13:00","16:49","20:18","21:53");
        gun_5      =    new Array("7/13/2013","03:47","05:31","13:00","16:49","20:17","21:52");
        gun_6      =    new Array("7/14/2013","03:48","05:31","13:00","16:49","20:17","21:51");
        gun_7      =    new Array("7/15/2013","03:49","05:32","13:00","16:49","20:16","21:50");
        gun_8      =    new Array("7/16/2013","03:50","05:33","13:00","16:49","20:16","21:50");
        gun_9      =    new Array("7/17/2013","03:51","05:33","13:00","16:49","20:15","21:49");
        gun_10     =    new Array("7/18/2013","03:52","05:34","13:00","16:49","20:15","21:48");
        gun_11     =    new Array("7/19/2013","03:53","05:35","13:00","16:49","20:14","21:47");
        gun_12     =    new Array("7/20/2013","03:54","05:36","13:01","16:49","20:13","21:46");
        gun_13     =    new Array("7/21/2013","03:55","05:36","13:01","16:49","20:13","21:45");
        gun_14     =    new Array("7/22/2013","03:56","05:37","13:01","16:49","20:12","21:44");
        gun_15     =    new Array("7/23/2013","03:58","05:38","13:01","16:49","20:11","21:43");
        gun_16     =    new Array("7/24/2013","03:59","05:39","13:01","16:48","20:11","21:42");
        gun_17     =    new Array("7/25/2013","04:00","05:39","13:01","16:48","20:10","21:41");
        gun_18     =    new Array("7/26/2013","04:01","05:40","13:01","16:48","20:09","21:39");
        gun_19     =    new Array("7/27/2013","04:02","05:41","13:01","16:48","20:08","21:38");
        gun_20     =    new Array("7/28/2013","04:04","05:42","13:01","16:48","20:07","21:37");
        gun_21     =    new Array("7/29/2013","04:05","05:43","13:01","16:48","20:07","21:36");
        gun_22     =    new Array("7/30/2013","04:06","05:43","13:01","16:47","20:06","21:35");
        gun_23     =    new Array("7/31/2013","04:07","05:44","13:01","16:47","20:05","21:33");
        gun_24     =    new Array("8/1/2013","04:08","05:45","13:01","16:47","20:04","21:32");
        gun_25     =    new Array("8/2/2013","04:10","05:46","13:00","16:47","20:03","21:31");
        gun_26     =    new Array("8/3/2013","04:11","05:47","13:00","16:46","20:02","21:29");
        gun_27     =    new Array("8/4/2013","04:12","05:47","13:00","16:46","20:01","21:28");
        gun_28     =    new Array("8/5/2013","04:13","05:48","13:00","16:46","20:00","21:27");
        gun_29     =    new Array("8/6/2013","04:15","05:49","13:00","16:45","19:59","21:25");
        gun_30     =    new Array("8/7/2013","04:16","05:50","13:00","16:45","19:58","21:24");
		
	break;
	case "kars":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  KARS-
        gun_1      =    new Array("7/9/2013","02:42","04:38","12:20","16:16","19:49","21:36");
        gun_2      =    new Array("7/10/2013","02:43","04:39","12:20","16:16","19:49","21:35");
        gun_3      =    new Array("7/11/2013","02:44","04:40","12:20","16:16","19:48","21:34");
        gun_4      =    new Array("7/12/2013","02:45","04:40","12:20","16:16","19:48","21:33");
        gun_5      =    new Array("7/13/2013","02:46","04:41","12:20","16:16","19:47","21:32");
        gun_6      =    new Array("7/14/2013","02:47","04:42","12:21","16:16","19:47","21:31");
        gun_7      =    new Array("7/15/2013","02:49","04:43","12:21","16:16","19:46","21:30");
        gun_8      =    new Array("7/16/2013","02:50","04:44","12:21","16:16","19:46","21:29");
        gun_9      =    new Array("7/17/2013","02:51","04:44","12:21","16:16","19:45","21:28");
        gun_10     =    new Array("7/18/2013","02:53","04:45","12:21","16:16","19:45","21:27");
        gun_11     =    new Array("7/19/2013","02:54","04:46","12:21","16:16","19:44","21:26");
        gun_12     =    new Array("7/20/2013","02:55","04:47","12:21","16:16","19:43","21:25");
        gun_13     =    new Array("7/21/2013","02:57","04:48","12:21","16:16","19:42","21:23");
        gun_14     =    new Array("7/22/2013","02:58","04:49","12:21","16:15","19:42","21:22");
        gun_15     =    new Array("7/23/2013","03:00","04:49","12:21","16:15","19:41","21:21");
        gun_16     =    new Array("7/24/2013","03:01","04:50","12:21","16:15","19:40","21:20");
        gun_17     =    new Array("7/25/2013","03:02","04:51","12:21","16:15","19:39","21:18");
        gun_18     =    new Array("7/26/2013","03:04","04:52","12:21","16:15","19:38","21:17");
        gun_19     =    new Array("7/27/2013","03:05","04:53","12:21","16:14","19:37","21:15");
        gun_20     =    new Array("7/28/2013","03:07","04:54","12:21","16:14","19:36","21:14");
        gun_21     =    new Array("7/29/2013","03:08","04:55","12:21","16:14","19:35","21:13");
        gun_22     =    new Array("7/30/2013","03:10","04:56","12:21","16:13","19:34","21:11");
        gun_23     =    new Array("7/31/2013","03:11","04:57","12:21","16:13","19:33","21:10");
        gun_24     =    new Array("8/1/2013","03:13","04:58","12:21","16:13","19:32","21:08");
        gun_25     =    new Array("8/2/2013","03:14","04:59","12:21","16:12","19:31","21:06");
        gun_26     =    new Array("8/3/2013","03:16","05:00","12:21","16:12","19:30","21:05");
        gun_27     =    new Array("8/4/2013","03:17","05:01","12:21","16:12","19:29","21:03");
        gun_28     =    new Array("8/5/2013","03:19","05:01","12:21","16:11","19:28","21:02");
        gun_29     =    new Array("8/6/2013","03:20","05:02","12:21","16:11","19:27","21:00");
        gun_30     =    new Array("8/7/2013","03:22","05:03","12:20","16:10","19:25","20:58");
		
	break;
	case "kastamonu":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  KASTAMONU-
        gun_1      =    new Array("7/9/2013","03:13","05:13","12:57","16:55","20:29","22:18");
        gun_2      =    new Array("7/10/2013","03:14","05:14","12:57","16:55","20:29","22:17");
        gun_3      =    new Array("7/11/2013","03:15","05:15","12:57","16:55","20:28","22:16");
        gun_4      =    new Array("7/12/2013","03:17","05:15","12:58","16:55","20:28","22:16");
        gun_5      =    new Array("7/13/2013","03:18","05:16","12:58","16:55","20:27","22:15");
        gun_6      =    new Array("7/14/2013","03:19","05:17","12:58","16:55","20:27","22:14");
        gun_7      =    new Array("7/15/2013","03:21","05:18","12:58","16:55","20:26","22:13");
        gun_8      =    new Array("7/16/2013","03:22","05:18","12:58","16:55","20:25","22:11");
        gun_9      =    new Array("7/17/2013","03:23","05:19","12:58","16:55","20:25","22:10");
        gun_10     =    new Array("7/18/2013","03:25","05:20","12:58","16:55","20:24","22:09");
        gun_11     =    new Array("7/19/2013","03:26","05:21","12:58","16:54","20:23","22:08");
        gun_12     =    new Array("7/20/2013","03:28","05:22","12:58","16:54","20:23","22:07");
        gun_13     =    new Array("7/21/2013","03:29","05:23","12:58","16:54","20:22","22:05");
        gun_14     =    new Array("7/22/2013","03:30","05:24","12:58","16:54","20:21","22:04");
        gun_15     =    new Array("7/23/2013","03:32","05:24","12:58","16:54","20:20","22:03");
        gun_16     =    new Array("7/24/2013","03:33","05:25","12:58","16:54","20:19","22:01");
        gun_17     =    new Array("7/25/2013","03:35","05:26","12:58","16:53","20:18","22:00");
        gun_18     =    new Array("7/26/2013","03:36","05:27","12:58","16:53","20:17","21:58");
        gun_19     =    new Array("7/27/2013","03:38","05:28","12:58","16:53","20:17","21:57");
        gun_20     =    new Array("7/28/2013","03:40","05:29","12:58","16:53","20:16","21:55");
        gun_21     =    new Array("7/29/2013","03:41","05:30","12:58","16:52","20:15","21:54");
        gun_22     =    new Array("7/30/2013","03:43","05:31","12:58","16:52","20:13","21:52");
        gun_23     =    new Array("7/31/2013","03:44","05:32","12:58","16:52","20:12","21:51");
        gun_24     =    new Array("8/1/2013","03:46","05:33","12:58","16:51","20:11","21:49");
        gun_25     =    new Array("8/2/2013","03:47","05:34","12:58","16:51","20:10","21:48");
        gun_26     =    new Array("8/3/2013","03:47","05:34","12:58","16:51","20:10","21:48");
        gun_27     =    new Array("8/4/2013","03:49","05:35","12:58","16:50","20:09","21:46");
        gun_28     =    new Array("8/5/2013","03:50","05:36","12:58","16:50","20:08","21:44");
        gun_29     =    new Array("8/6/2013","03:50","05:36","12:58","16:50","20:08","21:44");
        gun_30     =    new Array("8/7/2013","03:52","05:37","12:58","16:49","20:07","21:43");
		
	break;
	case "kayseri":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  KAYSERI-
        gun_1      =    new Array("7/9/2013","03:25","05:14","12:50","16:43","20:14","21:54");
        gun_2      =    new Array("7/10/2013","03:26","05:15","12:50","16:43","20:14","21:53");
        gun_3      =    new Array("7/11/2013","03:27","05:16","12:51","16:43","20:13","21:53");
        gun_4      =    new Array("7/12/2013","03:28","05:16","12:51","16:43","20:13","21:52");
        gun_5      =    new Array("7/13/2013","03:29","05:17","12:51","16:43","20:12","21:51");
        gun_6      =    new Array("7/14/2013","03:30","05:18","12:51","16:43","20:12","21:50");
        gun_7      =    new Array("7/15/2013","03:31","05:19","12:51","16:43","20:11","21:50");
        gun_8      =    new Array("7/16/2013","03:32","05:19","12:51","16:43","20:11","21:49");
        gun_9      =    new Array("7/17/2013","03:33","05:20","12:51","16:43","20:10","21:48");
        gun_10     =    new Array("7/18/2013","03:34","05:21","12:51","16:43","20:10","21:47");
        gun_11     =    new Array("7/19/2013","03:36","05:22","12:51","16:43","20:09","21:46");
        gun_12     =    new Array("7/20/2013","03:37","05:22","12:51","16:43","20:08","21:45");
        gun_13     =    new Array("7/21/2013","03:38","05:23","12:52","16:43","20:08","21:44");
        gun_14     =    new Array("7/22/2013","03:39","05:24","12:52","16:42","20:07","21:42");
        gun_15     =    new Array("7/23/2013","03:41","05:25","12:52","16:42","20:06","21:41");
        gun_16     =    new Array("7/24/2013","03:42","05:26","12:52","16:42","20:05","21:40");
        gun_17     =    new Array("7/25/2013","03:43","05:26","12:52","16:42","20:05","21:39");
        gun_18     =    new Array("7/26/2013","03:44","05:27","12:52","16:42","20:04","21:38");
        gun_19     =    new Array("7/27/2013","03:46","05:28","12:52","16:42","20:03","21:36");
        gun_20     =    new Array("7/28/2013","03:47","05:29","12:52","16:41","20:02","21:35");
        gun_21     =    new Array("7/29/2013","03:48","05:30","12:52","16:41","20:01","21:34");
        gun_22     =    new Array("7/30/2013","03:50","05:31","12:52","16:41","20:00","21:32");
        gun_23     =    new Array("7/31/2013","03:51","05:32","12:51","16:41","19:59","21:31");
        gun_24     =    new Array("8/1/2013","03:52","05:32","12:51","16:40","19:58","21:30");
        gun_25     =    new Array("8/2/2013","03:54","05:33","12:51","16:40","19:57","21:28");
        gun_26     =    new Array("8/3/2013","03:55","05:34","12:51","16:40","19:56","21:27");
        gun_27     =    new Array("8/4/2013","03:56","05:35","12:51","16:39","19:55","21:25");
        gun_28     =    new Array("8/5/2013","03:58","05:36","12:51","16:39","19:54","21:24");
        gun_29     =    new Array("8/6/2013","03:59","05:37","12:51","16:39","19:53","21:22");
        gun_30     =    new Array("8/7/2013","04:00","05:38","12:51","16:38","19:52","21:21");
		
	break;
	case "kilis":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  KILIS-
        gun_1      =    new Array("7/9/2013","03:30","05:14","12:44","16:32","20:02","21:37");
        gun_2      =    new Array("7/10/2013","03:31","05:14","12:44","16:32","20:01","21:36");
        gun_3      =    new Array("7/11/2013","03:32","05:15","12:44","16:32","20:01","21:35");
        gun_4      =    new Array("7/12/2013","03:33","05:16","12:44","16:32","20:01","21:35");
        gun_5      =    new Array("7/13/2013","03:34","05:16","12:44","16:32","20:00","21:34");
        gun_6      =    new Array("7/14/2013","03:34","05:17","12:44","16:32","20:00","21:33");
        gun_7      =    new Array("7/15/2013","03:36","05:18","12:45","16:32","19:59","21:32");
        gun_8      =    new Array("7/16/2013","03:37","05:18","12:45","16:32","19:59","21:32");
        gun_9      =    new Array("7/17/2013","03:38","05:19","12:45","16:32","19:58","21:31");
        gun_10     =    new Array("7/18/2013","03:39","05:20","12:45","16:32","19:58","21:30");
        gun_11     =    new Array("7/19/2013","03:40","05:20","12:45","16:32","19:57","21:29");
        gun_12     =    new Array("7/20/2013","03:41","05:21","12:45","16:32","19:57","21:28");
        gun_13     =    new Array("7/21/2013","03:42","05:22","12:45","16:32","19:56","21:27");
        gun_14     =    new Array("7/22/2013","03:43","05:23","12:45","16:32","19:55","21:26");
        gun_15     =    new Array("7/23/2013","03:44","05:23","12:45","16:32","19:55","21:25");
        gun_16     =    new Array("7/24/2013","03:45","05:24","12:45","16:32","19:54","21:24");
        gun_17     =    new Array("7/25/2013","03:47","05:25","12:45","16:32","19:53","21:23");
        gun_18     =    new Array("7/26/2013","03:48","05:26","12:45","16:32","19:52","21:22");
        gun_19     =    new Array("7/27/2013","03:49","05:26","12:45","16:32","19:52","21:21");
        gun_20     =    new Array("7/28/2013","03:50","05:27","12:45","16:31","19:51","21:19");
        gun_21     =    new Array("7/29/2013","03:51","05:28","12:45","16:31","19:50","21:18");
        gun_22     =    new Array("7/30/2013","03:52","05:29","12:45","16:31","19:49","21:17");
        gun_23     =    new Array("7/31/2013","03:54","05:30","12:45","16:31","19:48","21:16");
        gun_24     =    new Array("8/1/2013","03:55","05:30","12:45","16:31","19:47","21:15");
        gun_25     =    new Array("8/2/2013","03:56","05:31","12:45","16:30","19:46","21:13");
        gun_26     =    new Array("8/3/2013","03:57","05:32","12:45","16:30","19:45","21:12");
        gun_27     =    new Array("8/4/2013","03:58","05:33","12:45","16:30","19:44","21:11");
        gun_28     =    new Array("8/5/2013","04:00","05:34","12:45","16:30","19:43","21:09");
        gun_29     =    new Array("8/6/2013","04:01","05:34","12:45","16:29","19:42","21:08");
        gun_30     =    new Array("8/7/2013","04:02","05:35","12:44","16:29","19:41","21:06");
		
	break;
	case "kirikkale":
		 // Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  KIRIKKALE-
        gun_1      =    new Array("7/9/2013","03:25","05:19","12:58","16:53","20:25","22:09");
        gun_2      =    new Array("7/10/2013","03:26","05:20","12:58","16:53","20:25","22:08");
        gun_3      =    new Array("7/11/2013","03:27","05:20","12:59","16:53","20:24","22:07");
        gun_4      =    new Array("7/12/2013","03:28","05:21","12:59","16:53","20:24","22:07");
        gun_5      =    new Array("7/13/2013","03:30","05:22","12:59","16:53","20:24","22:06");
        gun_6      =    new Array("7/14/2013","03:31","05:23","12:59","16:53","20:23","22:05");
        gun_7      =    new Array("7/15/2013","03:32","05:23","12:59","16:53","20:22","22:04");
        gun_8      =    new Array("7/16/2013","03:33","05:24","12:59","16:53","20:22","22:03");
        gun_9      =    new Array("7/17/2013","03:34","05:25","12:59","16:53","20:21","22:02");
        gun_10     =    new Array("7/18/2013","03:36","05:26","12:59","16:53","20:21","22:01");
        gun_11     =    new Array("7/19/2013","03:37","05:26","12:59","16:53","20:20","22:00");
        gun_12     =    new Array("7/20/2013","03:38","05:27","12:59","16:53","20:19","21:59");
        gun_13     =    new Array("7/21/2013","03:40","05:28","12:59","16:52","20:19","21:57");
        gun_14     =    new Array("7/22/2013","03:41","05:29","12:59","16:52","20:18","21:56");
        gun_15     =    new Array("7/23/2013","03:42","05:30","13:00","16:52","20:17","21:55");
        gun_16     =    new Array("7/24/2013","03:44","05:31","13:00","16:52","20:16","21:54");
        gun_17     =    new Array("7/25/2013","03:45","05:32","13:00","16:52","20:15","21:52");
        gun_18     =    new Array("7/26/2013","03:46","05:32","13:00","16:52","20:14","21:51");
        gun_19     =    new Array("7/27/2013","03:48","05:33","13:00","16:51","20:14","21:50");
        gun_20     =    new Array("7/28/2013","03:49","05:34","13:00","16:51","20:13","21:48");
        gun_21     =    new Array("7/29/2013","03:51","05:35","13:00","16:51","20:12","21:47");
        gun_22     =    new Array("7/30/2013","03:52","05:36","12:59","16:51","20:11","21:46");
        gun_23     =    new Array("7/31/2013","03:53","05:37","12:59","16:50","20:10","21:44");
        gun_24     =    new Array("8/1/2013","03:55","05:38","12:59","16:50","20:09","21:43");
        gun_25     =    new Array("8/2/2013","03:56","05:39","12:59","16:50","20:08","21:41");
        gun_26     =    new Array("8/3/2013","03:58","05:40","12:59","16:49","20:07","21:40");
        gun_27     =    new Array("8/4/2013","03:59","05:41","12:59","16:49","20:05","21:38");
        gun_28     =    new Array("8/5/2013","04:01","05:42","12:59","16:48","20:04","21:36");
        gun_29     =    new Array("8/6/2013","04:02","05:42","12:59","16:48","20:03","21:35");
        gun_30     =    new Array("8/7/2013","04:03","05:43","12:59","16:48","20:02","21:33");
		
	break;
	case "kirklareli":
		 // Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  KIRKLARELI-
        gun_1      =    new Array("7/9/2013","03:37","05:38","13:23","17:22","20:56","22:47");
        gun_2      =    new Array("7/10/2013","03:38","05:39","13:24","17:22","20:56","22:46");
        gun_3      =    new Array("7/11/2013","03:39","05:40","13:24","17:22","20:56","22:45");
        gun_4      =    new Array("7/12/2013","03:40","05:40","13:24","17:22","20:55","22:44");
        gun_5      =    new Array("7/13/2013","03:42","05:41","13:24","17:22","20:54","22:43");
        gun_6      =    new Array("7/14/2013","03:43","05:42","13:24","17:22","20:54","22:42");
        gun_7      =    new Array("7/15/2013","03:44","05:43","13:24","17:22","20:53","22:41");
        gun_8      =    new Array("7/16/2013","03:46","05:44","13:24","17:22","20:53","22:40");
        gun_9      =    new Array("7/17/2013","03:47","05:44","13:24","17:22","20:52","22:39");
        gun_10     =    new Array("7/18/2013","03:48","05:45","13:24","17:21","20:51","22:38");
        gun_11     =    new Array("7/19/2013","03:50","05:46","13:24","17:21","20:51","22:36");
        gun_12     =    new Array("7/20/2013","03:51","05:47","13:25","17:21","20:50","22:35");
        gun_13     =    new Array("7/21/2013","03:53","05:48","13:25","17:21","20:49","22:34");
        gun_14     =    new Array("7/22/2013","03:54","05:49","13:25","17:21","20:48","22:32");
        gun_15     =    new Array("7/23/2013","03:56","05:50","13:25","17:21","20:47","22:31");
        gun_16     =    new Array("7/24/2013","03:57","05:51","13:25","17:20","20:47","22:30");
        gun_17     =    new Array("7/25/2013","03:59","05:52","13:25","17:20","20:46","22:28");
        gun_18     =    new Array("7/26/2013","04:01","05:52","13:25","17:20","20:45","22:27");
        gun_19     =    new Array("7/27/2013","04:02","05:53","13:25","17:20","20:44","22:25");
        gun_20     =    new Array("7/28/2013","04:04","05:54","13:25","17:19","20:43","22:24");
        gun_21     =    new Array("7/29/2013","04:05","05:55","13:25","17:19","20:42","22:22");
        gun_22     =    new Array("7/30/2013","04:07","05:56","13:25","17:19","20:41","22:21");
        gun_23     =    new Array("7/31/2013","04:08","05:57","13:25","17:18","20:40","22:19");
        gun_24     =    new Array("8/1/2013","04:10","05:58","13:25","17:18","20:38","22:17");
        gun_25     =    new Array("8/2/2013","04:12","05:59","13:24","17:18","20:37","22:16");
        gun_26     =    new Array("8/3/2013","04:13","06:00","13:24","17:17","20:36","22:14");
        gun_27     =    new Array("8/4/2013","04:15","06:01","13:24","17:17","20:35","22:12");
        gun_28     =    new Array("8/5/2013","04:16","06:02","13:24","17:16","20:34","22:11");
        gun_29     =    new Array("8/6/2013","04:18","06:03","13:24","17:16","20:33","22:09");
        gun_30     =    new Array("8/7/2013","04:20","06:04","13:24","17:15","20:31","22:07");
		
	break;
	case "kocaeli":
		 // Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi KOCAELI-
        gun_1      =    new Array("7/9/2013","03:33","05:30","13:13","17:09","20:42","22:29");
        gun_2      =    new Array("7/10/2013","03:34","05:31","13:13","17:09","20:42","22:28");
        gun_3      =    new Array("7/11/2013","03:35","05:32","13:13","17:09","20:42","22:28");
        gun_4      =    new Array("7/12/2013","03:37","05:33","13:13","17:09","20:41","22:27");
        gun_5      =    new Array("7/13/2013","03:38","05:33","13:13","17:09","20:41","22:26");
        gun_6      =    new Array("7/14/2013","03:39","05:34","13:13","17:09","20:40","22:25");
        gun_7      =    new Array("7/15/2013","03:40","05:35","13:13","17:09","20:39","22:24");
        gun_8      =    new Array("7/16/2013","03:42","05:36","13:13","17:09","20:39","22:23");
        gun_9      =    new Array("7/17/2013","03:43","05:36","13:13","17:09","20:38","22:22");
        gun_10     =    new Array("7/18/2013","03:44","05:37","13:14","17:09","20:38","22:21");
        gun_11     =    new Array("7/19/2013","03:46","05:38","13:14","17:09","20:37","22:19");
        gun_12     =    new Array("7/20/2013","03:47","05:39","13:14","17:09","20:36","22:18");
        gun_13     =    new Array("7/21/2013","03:48","05:40","13:14","17:08","20:35","22:17");
        gun_14     =    new Array("7/22/2013","03:50","05:41","13:14","17:08","20:35","22:16");
        gun_15     =    new Array("7/23/2013","03:51","05:42","13:14","17:08","20:34","22:14");
        gun_16     =    new Array("7/24/2013","03:53","05:42","13:14","17:08","20:33","22:13");
        gun_17     =    new Array("7/25/2013","03:54","05:43","13:14","17:08","20:32","22:12");
        gun_18     =    new Array("7/26/2013","03:56","05:44","13:14","17:07","20:31","22:10");
        gun_19     =    new Array("7/27/2013","03:57","05:45","13:14","17:07","20:30","22:09");
        gun_20     =    new Array("7/28/2013","03:59","05:46","13:14","17:07","20:29","22:08");
        gun_21     =    new Array("7/29/2013","04:00","05:47","13:14","17:07","20:28","22:06");
        gun_22     =    new Array("7/30/2013","04:01","05:48","13:14","17:06","20:27","22:05");
        gun_23     =    new Array("7/31/2013","04:03","05:49","13:14","17:06","20:26","22:03");
        gun_24     =    new Array("8/1/2013","04:04","05:50","13:14","17:06","20:25","22:01");
        gun_25     =    new Array("8/2/2013","04:06","05:51","13:14","17:05","20:24","22:00");
        gun_26     =    new Array("8/3/2013","04:07","05:52","13:14","17:05","20:23","21:58");
        gun_27     =    new Array("8/4/2013","04:09","05:53","13:13","17:04","20:22","21:57");
        gun_28     =    new Array("8/5/2013","04:10","05:54","13:13","17:04","20:21","21:55");
        gun_29     =    new Array("8/6/2013","04:12","05:55","13:13","17:04","20:20","21:53");
        gun_30     =    new Array("8/7/2013","04:13","05:56","13:13","17:03","20:18","21:52");
		
	break;
	case "konya":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  KONYA-
        gun_1      =    new Array("7/9/2013","03:42","05:29","13:02","16:53","20:23","22:01");
        gun_2      =    new Array("7/10/2013","03:43","05:30","13:02","16:53","20:23","22:01");
        gun_3      =    new Array("7/11/2013","03:44","05:30","13:03","16:53","20:23","22:00");
        gun_4      =    new Array("7/12/2013","03:45","05:31","13:03","16:53","20:22","21:59");
        gun_5      =    new Array("7/13/2013","03:46","05:32","13:03","16:53","20:22","21:58");
        gun_6      =    new Array("7/14/2013","03:47","05:32","13:03","16:53","20:21","21:58");
        gun_7      =    new Array("7/15/2013","03:48","05:33","13:03","16:53","20:21","21:57");
        gun_8      =    new Array("7/16/2013","03:49","05:34","13:03","16:53","20:20","21:56");
        gun_9      =    new Array("7/17/2013","03:50","05:34","13:03","16:53","20:20","21:55");
        gun_10     =    new Array("7/18/2013","03:51","05:35","13:03","16:53","20:19","21:54");
        gun_11     =    new Array("7/19/2013","03:52","05:36","13:03","16:53","20:19","21:53");
        gun_12     =    new Array("7/20/2013","03:53","05:37","13:03","16:53","20:18","21:52");
        gun_13     =    new Array("7/21/2013","03:55","05:37","13:04","16:53","20:17","21:51");
        gun_14     =    new Array("7/22/2013","03:56","05:38","13:04","16:53","20:17","21:50");
        gun_15     =    new Array("7/23/2013","03:57","05:39","13:04","16:53","20:16","21:49");
        gun_16     =    new Array("7/24/2013","03:58","05:40","13:04","16:53","20:15","21:48");
        gun_17     =    new Array("7/25/2013","03:59","05:41","13:04","16:52","20:14","21:47");
        gun_18     =    new Array("7/26/2013","04:01","05:41","13:04","16:52","20:14","21:46");
        gun_19     =    new Array("7/27/2013","04:02","05:42","13:04","16:52","20:13","21:44");
        gun_20     =    new Array("7/28/2013","04:03","05:43","13:04","16:52","20:12","21:43");
        gun_21     =    new Array("7/29/2013","04:05","05:44","13:04","16:52","20:11","21:42");
        gun_22     =    new Array("7/30/2013","04:06","05:45","13:04","16:51","20:10","21:40");
        gun_23     =    new Array("7/31/2013","04:07","05:46","13:03","16:51","20:09","21:39");
        gun_24     =    new Array("8/1/2013","04:08","05:46","13:03","16:51","20:08","21:38");
        gun_25     =    new Array("8/2/2013","04:10","05:47","13:03","16:51","20:07","21:36");
        gun_26     =    new Array("8/3/2013","04:11","05:48","13:03","16:50","20:06","21:35");
        gun_27     =    new Array("8/4/2013","04:12","05:49","13:03","16:50","20:05","21:34");
        gun_28     =    new Array("8/5/2013","04:13","05:50","13:03","16:50","20:04","21:32");
        gun_29     =    new Array("8/6/2013","04:15","05:51","13:03","16:49","20:03","21:31");
        gun_30     =    new Array("8/7/2013","04:16","05:52","13:03","16:49","20:02","21:29");
		
	break;
	case "kutahya":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  KUTAHYA-
        gun_1      =    new Array("7/9/2013","03:42","05:34","13:12","17:06","20:38","22:20");
        gun_2      =    new Array("7/10/2013","03:43","05:35","13:13","17:06","20:38","22:20");
        gun_3      =    new Array("7/11/2013","03:44","05:36","13:13","17:06","20:37","22:19");
        gun_4      =    new Array("7/12/2013","03:45","05:36","13:13","17:06","20:37","22:18");
        gun_5      =    new Array("7/13/2013","03:46","05:37","13:13","17:06","20:36","22:17");
        gun_6      =    new Array("7/14/2013","03:48","05:38","13:13","17:06","20:36","22:16");
        gun_7      =    new Array("7/15/2013","03:49","05:39","13:13","17:06","20:35","22:16");
        gun_8      =    new Array("7/16/2013","03:50","05:39","13:13","17:06","20:35","22:15");
        gun_9      =    new Array("7/17/2013","03:51","05:40","13:13","17:06","20:34","22:14");
        gun_10     =    new Array("7/18/2013","03:52","05:41","13:13","17:06","20:34","22:13");
        gun_11     =    new Array("7/19/2013","03:54","05:42","13:13","17:06","20:33","22:12");
        gun_12     =    new Array("7/20/2013","03:55","05:43","13:14","17:06","20:32","22:10");
        gun_13     =    new Array("7/21/2013","03:56","05:43","13:14","17:06","20:32","22:09");
        gun_14     =    new Array("7/22/2013","03:58","05:44","13:14","17:06","20:31","22:08");
        gun_15     =    new Array("7/23/2013","03:59","05:45","13:14","17:06","20:30","22:07");
        gun_16     =    new Array("7/24/2013","04:00","05:46","13:14","17:05","20:29","22:06");
        gun_17     =    new Array("7/25/2013","04:02","05:47","13:14","17:05","20:28","22:04");
        gun_18     =    new Array("7/26/2013","04:03","05:48","13:14","17:05","20:28","22:03");
        gun_19     =    new Array("7/27/2013","04:04","05:48","13:14","17:05","20:27","22:02");
        gun_20     =    new Array("7/28/2013","04:06","05:49","13:14","17:05","20:26","22:00");
        gun_21     =    new Array("7/29/2013","04:07","05:50","13:14","17:04","20:25","21:59");
        gun_22     =    new Array("7/30/2013","04:08","05:51","13:14","17:04","20:24","21:58");
        gun_23     =    new Array("7/31/2013","04:10","05:52","13:14","17:04","20:23","21:56");
        gun_24     =    new Array("8/1/2013","04:11","05:53","13:13","17:03","20:22","21:55");
        gun_25     =    new Array("8/2/2013","04:13","05:54","13:13","17:03","20:21","21:53");
        gun_26     =    new Array("8/3/2013","04:14","05:55","13:13","17:03","20:20","21:52");
        gun_27     =    new Array("8/4/2013","04:15","05:56","13:13","17:02","20:19","21:50");
        gun_28     =    new Array("8/5/2013","04:17","05:57","13:13","17:02","20:18","21:49");
        gun_29     =    new Array("8/6/2013","04:18","05:57","13:13","17:02","20:16","21:47");
        gun_30     =    new Array("8/7/2013","04:19","05:58","13:13","17:01","20:15","21:46");
		
	break;
	case "kirsehir":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  KIRSEHIR-
        gun_1      =    new Array("7/9/2013" ,"03:27","05:18","12:56","16:49","20:21","22:02");
        gun_2      =    new Array("7/10/2013","03:28","05:19","12:56","16:49","20:20","22:01");
        gun_3      =    new Array("7/11/2013","03:29","05:20","12:56","16:49","20:20","22:01");
        gun_4      =    new Array("7/12/2013","03:30","05:20","12:56","16:49","20:19","22:00");
        gun_5      =    new Array("7/13/2013","03:31","05:21","12:56","16:49","20:19","21:59");
        gun_6      =    new Array("7/14/2013","03:32","05:22","12:56","16:49","20:18","21:58");
        gun_7      =    new Array("7/15/2013","03:33","05:23","12:56","16:49","20:18","21:57");
        gun_8      =    new Array("7/16/2013","03:35","05:23","12:56","16:49","20:17","21:57");
        gun_9      =    new Array("7/17/2013","03:36","05:24","12:57","16:49","20:17","21:56");
        gun_10     =    new Array("7/18/2013","03:37","05:25","12:57","16:49","20:16","21:55");
        gun_11     =    new Array("7/19/2013","03:38","05:26","12:57","16:49","20:16","21:54");
        gun_12     =    new Array("7/20/2013","03:39","05:26","12:57","16:49","20:15","21:52");
        gun_13     =    new Array("7/21/2013","03:41","05:27","12:57","16:49","20:14","21:51");
        gun_14     =    new Array("7/22/2013","03:42","05:28","12:57","16:49","20:13","21:50");
        gun_15     =    new Array("7/23/2013","03:43","05:29","12:57","16:48","20:13","21:49");
        gun_16     =    new Array("7/24/2013","03:45","05:30","12:57","16:48","20:12","21:48");
        gun_17     =    new Array("7/25/2013","03:46","05:31","12:57","16:48","20:11","21:47");
        gun_18     =    new Array("7/26/2013","03:47","05:31","12:57","16:48","20:10","21:45");
        gun_19     =    new Array("7/27/2013","03:49","05:32","12:57","16:48","20:09","21:44");
        gun_20     =    new Array("7/28/2013","03:50","05:33","12:57","16:47","20:09","21:43");
        gun_21     =    new Array("7/29/2013","03:51","05:34","12:57","16:47","20:08","21:41");
        gun_22     =    new Array("7/30/2013","03:53","05:35","12:57","16:47","20:07","21:40");
        gun_23     =    new Array("7/31/2013","03:54","05:36","12:57","16:47","20:06","21:39");
        gun_24     =    new Array("8/1/2013" ,"03:39","05:35","13:00","16:52","20:06","21:46");
        gun_25     =    new Array("8/2/2013" ,"03:40","05:36","13:00","16:52","20:05","21:44");
        gun_26     =    new Array("8/3/2013" ,"03:42","05:37","13:00","16:51","20:04","21:43");
        gun_27     =    new Array("8/4/2013" ,"03:43","05:38","13:00","16:51","20:03","21:41");
        gun_28     =    new Array("8/5/2013" ,"03:45","05:39","12:59","16:51","20:02","21:39");
        gun_29     =    new Array("8/6/2013" ,"03:46","05:40","12:59","16:50","20:00","21:38");
        gun_30     =    new Array("8/7/2013" ,"03:47","05:41","12:59","16:50","19:59","21:36");
		
	break;
	case "malatya":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi MALATYA-
        gun_1      =    new Array("7/9/2013","03:16","05:04","12:39","16:31","20:02","21:41");
        gun_2      =    new Array("7/10/2013","03:17","05:05","12:39","16:31","20:01","21:40");
        gun_3      =    new Array("7/11/2013","03:18","05:06","12:39","16:31","20:01","21:39");
        gun_4      =    new Array("7/12/2013","03:19","05:06","12:39","16:31","20:00","21:39");
        gun_5      =    new Array("7/13/2013","03:20","05:07","12:40","16:31","20:00","21:38");
        gun_6      =    new Array("7/14/2013","03:21","05:08","12:40","16:31","19:59","21:37");
        gun_7      =    new Array("7/15/2013","03:22","05:08","12:40","16:31","19:59","21:36");
        gun_8      =    new Array("7/16/2013","03:23","05:09","12:40","16:31","19:58","21:35");
        gun_9      =    new Array("7/17/2013","03:24","05:10","12:40","16:31","19:58","21:34");
        gun_10     =    new Array("7/18/2013","03:25","05:11","12:40","16:31","19:57","21:33");
        gun_11     =    new Array("7/19/2013","03:26","05:11","12:40","16:31","19:57","21:32");
        gun_12     =    new Array("7/20/2013","03:28","05:12","12:40","16:31","19:56","21:31");
        gun_13     =    new Array("7/21/2013","03:29","05:13","12:40","16:31","19:55","21:30");
        gun_14     =    new Array("7/22/2013","03:30","05:14","12:40","16:30","19:55","21:29");
        gun_15     =    new Array("7/23/2013","03:31","05:14","12:40","16:30","19:54","21:28");
        gun_16     =    new Array("7/24/2013","03:33","05:15","12:40","16:30","19:53","21:27");
        gun_17     =    new Array("7/25/2013","03:34","05:16","12:40","16:30","19:52","21:26");
        gun_18     =    new Array("7/26/2013","03:35","05:17","12:40","16:30","19:51","21:24");
        gun_19     =    new Array("7/27/2013","03:36","05:18","12:40","16:30","19:51","21:23");
        gun_20     =    new Array("7/28/2013","03:38","05:19","12:40","16:29","19:50","21:22");
        gun_21     =    new Array("7/29/2013","03:39","05:19","12:40","16:29","19:49","21:21");
        gun_22     =    new Array("7/30/2013","03:40","05:20","12:40","16:29","19:48","21:19");
        gun_23     =    new Array("7/31/2013","03:42","05:21","12:40","16:29","19:47","21:18");
        gun_24     =    new Array("8/1/2013","03:43","05:22","12:40","16:28","19:46","21:17");
        gun_25     =    new Array("8/2/2013","03:44","05:23","12:40","16:28","19:45","21:15");
        gun_26     =    new Array("8/3/2013","03:45","05:24","12:40","16:28","19:44","21:14");
        gun_27     =    new Array("8/4/2013","03:47","05:25","12:40","16:27","19:43","21:12");
        gun_28     =    new Array("8/5/2013","03:48","05:26","12:40","16:27","19:42","21:11");
        gun_29     =    new Array("8/6/2013","03:49","05:26","12:40","16:27","19:41","21:09");
        gun_30     =    new Array("8/7/2013","03:51","05:27","12:40","16:26","19:40","21:08");
		
	break;
	case "manisa":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  MANISA-
        gun_1      =    new Array("7/9/2013","03:57","05:47","13:23","17:15","20:46","22:26");
        gun_2      =    new Array("7/10/2013","03:58","05:48","13:23","17:15","20:46","22:25");
        gun_3      =    new Array("7/11/2013","03:59","05:48","13:23","17:15","20:45","22:24");
        gun_4      =    new Array("7/12/2013","04:00","05:49","13:23","17:15","20:45","22:24");
        gun_5      =    new Array("7/13/2013","04:02","05:50","13:23","17:15","20:44","22:23");
        gun_6      =    new Array("7/14/2013","04:03","05:50","13:23","17:15","20:44","22:22");
        gun_7      =    new Array("7/15/2013","04:04","05:51","13:23","17:15","20:43","22:21");
        gun_8      =    new Array("7/16/2013","04:05","05:52","13:23","17:15","20:43","22:20");
        gun_9      =    new Array("7/17/2013","04:06","05:53","13:24","17:15","20:42","22:19");
        gun_10     =    new Array("7/18/2013","04:07","05:53","13:24","17:15","20:42","22:18");
        gun_11     =    new Array("7/19/2013","04:08","05:54","13:24","17:15","20:41","22:17");
        gun_12     =    new Array("7/20/2013","04:10","05:55","13:24","17:15","20:40","22:16");
        gun_13     =    new Array("7/21/2013","04:11","05:56","13:24","17:15","20:40","22:15");
        gun_14     =    new Array("7/22/2013","04:12","05:57","13:24","17:14","20:39","22:14");
        gun_15     =    new Array("7/23/2013","04:13","05:57","13:24","17:14","20:38","22:13");
        gun_16     =    new Array("7/24/2013","04:15","05:58","13:24","17:14","20:37","22:12");
        gun_17     =    new Array("7/25/2013","04:16","05:59","13:24","17:14","20:37","22:11");
        gun_18     =    new Array("7/26/2013","04:17","06:00","13:24","17:14","20:36","22:09");
        gun_19     =    new Array("7/27/2013","04:19","06:01","13:24","17:14","20:35","22:08");
        gun_20     =    new Array("7/28/2013","04:20","06:02","13:24","17:13","20:34","22:07");
        gun_21     =    new Array("7/29/2013","04:21","06:02","13:24","17:13","20:33","22:05");
        gun_22     =    new Array("7/30/2013","04:22","06:03","13:24","17:13","20:32","22:04");
        gun_23     =    new Array("7/31/2013","04:24","06:04","13:24","17:13","20:31","22:03");
        gun_24     =    new Array("8/1/2013","04:25","06:05","13:24","17:12","20:30","22:01");
        gun_25     =    new Array("8/2/2013","04:26","06:06","13:24","17:12","20:29","22:00");
        gun_26     =    new Array("8/3/2013","04:28","06:07","13:24","17:12","20:28","21:58");
        gun_27     =    new Array("8/4/2013","04:29","06:08","13:23","17:11","20:27","21:57");
        gun_28     =    new Array("8/5/2013","04:30","06:08","13:23","17:11","20:26","21:56");
        gun_29     =    new Array("8/6/2013","04:32","06:09","13:23","17:11","20:25","21:54");
        gun_30     =    new Array("8/7/2013","04:33","06:10","13:23","17:10","20:24","21:52");
		
	break;
	case "mardin":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  MARDIN-
        gun_1      =    new Array("7/9/2013","03:12","04:58","12:29","16:19","19:49","21:25");
        gun_2      =    new Array("7/10/2013","03:13","04:58","12:29","16:19","19:49","21:25");
        gun_3      =    new Array("7/11/2013","03:14","04:59","12:30","16:19","19:48","21:24");
        gun_4      =    new Array("7/12/2013","03:15","04:59","12:30","16:19","19:48","21:23");
        gun_5      =    new Array("7/13/2013","03:16","05:00","12:30","16:19","19:47","21:23");
        gun_6      =    new Array("7/14/2013","03:17","05:01","12:30","16:19","19:47","21:22");
        gun_7      =    new Array("7/15/2013","03:18","05:01","12:30","16:19","19:46","21:21");
        gun_8      =    new Array("7/16/2013","03:19","05:02","12:30","16:19","19:46","21:20");
        gun_9      =    new Array("7/17/2013","03:20","05:03","12:30","16:19","19:45","21:19");
        gun_10     =    new Array("7/18/2013","03:21","05:04","12:30","16:19","19:45","21:18");
        gun_11     =    new Array("7/19/2013","03:22","05:04","12:30","16:19","19:44","21:17");
        gun_12     =    new Array("7/20/2013","03:23","05:05","12:30","16:19","19:44","21:16");
        gun_13     =    new Array("7/21/2013","03:24","05:06","12:31","16:19","19:43","21:15");
        gun_14     =    new Array("7/22/2013","03:26","05:07","12:31","16:19","19:42","21:14");
        gun_15     =    new Array("7/23/2013","03:27","05:07","12:31","16:19","19:42","21:13");
        gun_16     =    new Array("7/24/2013","03:28","05:08","12:31","16:19","19:41","21:12");
        gun_17     =    new Array("7/25/2013","03:29","05:09","12:31","16:18","19:40","21:11");
        gun_18     =    new Array("7/26/2013","03:30","05:10","12:31","16:18","19:39","21:10");
        gun_19     =    new Array("7/27/2013","03:32","05:11","12:31","16:18","19:38","21:09");
        gun_20     =    new Array("7/28/2013","03:33","05:11","12:31","16:18","19:38","21:08");
        gun_21     =    new Array("7/29/2013","03:34","05:12","12:31","16:18","19:37","21:0");
        gun_22     =    new Array("7/30/2013","03:35","05:13","12:31","16:18","19:36","21:05");
        gun_23     =    new Array("7/31/2013","03:37","05:14","12:30","16:17","19:35","21:04");
        gun_24     =    new Array("8/1/2013","03:38","05:15","12:30","16:17","19:34","21:02");
        gun_25     =    new Array("8/2/2013","03:39","05:15","12:30","16:17","19:33","21:01");
        gun_26     =    new Array("8/3/2013","03:40","05:16","12:30","16:17","19:32","21:00");
        gun_27     =    new Array("8/4/2013","03:42","05:17","12:30","16:16","19:31","20:58");
        gun_28     =    new Array("8/5/2013","03:43","05:18","12:30","16:16","19:30","20:57");
        gun_29     =    new Array("8/6/2013","03:44","05:19","12:30","16:16","19:29","20:56");
        gun_30     =    new Array("8/7/2013","03:45","05:20","12:30","16:15","19:28","20:54");
		
	break;
	case "mugla":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  MUGLA-
        gun_1      =    new Array("7/9/2013","04:02","05:47","13:19","17:08","20:38","22:14");
        gun_2      =    new Array("7/10/2013","04:03","05:48","13:19","17:08","20:38","22:14");
        gun_3      =    new Array("7/11/2013","04:04","05:49","13:19","17:08","20:37","22:13");
        gun_4      =    new Array("7/12/2013","04:05","05:49","13:19","17:08","20:37","22:12");
        gun_5      =    new Array("7/13/2013","04:06","05:50","13:19","17:08","20:37","22:12");
        gun_6      =    new Array("7/14/2013","04:07","05:51","13:20","17:08","20:36","22:11");
        gun_7      =    new Array("7/15/2013","04:08","05:51","13:20","17:08","20:36","22:10");
        gun_8      =    new Array("7/16/2013","04:09","05:52","13:20","17:08","20:35","22:09");
        gun_9      =    new Array("7/17/2013","04:10","05:53","13:20","17:08","20:35","22:08");
        gun_10     =    new Array("7/18/2013","04:11","05:53","13:20","17:08","20:34","22:07");
        gun_11     =    new Array("7/19/2013","04:12","05:54","13:20","17:08","20:34","22:06");
        gun_12     =    new Array("7/20/2013","04:13","05:55","13:20","17:08","20:33","22:06");
        gun_13     =    new Array("7/21/2013","04:15","05:56","13:20","17:08","20:32","22:05");
        gun_14     =    new Array("7/22/2013","04:16","05:56","13:20","17:08","20:32","22:03");
        gun_15     =    new Array("7/23/2013","04:17","05:57","13:20","17:08","20:31","22:02");
        gun_16     =    new Array("7/24/2013","04:18","05:58","13:20","17:08","20:30","22:01");
        gun_17     =    new Array("7/25/2013","04:19","05:59","13:20","17:08","20:29","22:00");
        gun_18     =    new Array("7/26/2013","04:20","06:00","13:20","17:08","20:29","21:59");
        gun_19     =    new Array("7/27/2013","04:22","06:00","13:20","17:08","20:28","21:58");
        gun_20     =    new Array("7/28/2013","04:23","06:01","13:20","17:07","20:27","21:57");
        gun_21     =    new Array("7/29/2013","04:24","06:02","13:20","17:07","20:26","21:55");
        gun_22     =    new Array("7/30/2013","04:25","06:03","13:20","17:07","20:25","21:54");
        gun_23     =    new Array("7/31/2013","04:27","06:04","13:20","17:07","20:24","21:53");
        gun_24     =    new Array("8/1/2013","04:28","06:04","13:20","17:06","20:23","21:52");
        gun_25     =    new Array("8/2/2013","04:29","06:05","13:20","17:06","20:22","21:50");
        gun_26     =    new Array("8/3/2013","04:30","06:06","13:20","17:06","20:21","21:49");
        gun_27     =    new Array("8/4/2013","04:31","06:07","13:20","17:06","20:20","21:48");
        gun_28     =    new Array("8/5/2013","04:33","06:08","13:20","17:05","20:19","21:46");
        gun_29     =    new Array("8/6/2013","04:34","06:09","13:20","17:05","20:18","21:45");
        gun_30     =    new Array("8/7/2013","04:35","06:09","13:19","17:05","20:17","21:43");
		
	break;
	case "mus":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  MUS-
        gun_1      =    new Array("7/9/2013","03:00","04:50","12:26","16:19","19:50","21:30");
        gun_2      =    new Array("7/10/2013","03:01","04:51","12:26","16:19","19:50","21:30");
        gun_3      =    new Array("7/11/2013","03:02","04:52","12:27","16:19","19:49","21:29");
        gun_4      =    new Array("7/12/2013","03:04","04:52","12:27","16:19","19:49","21:28");
        gun_5      =    new Array("7/13/2013","03:05","04:53","12:27","16:19","19:48","21:27");
        gun_6      =    new Array("7/14/2013","03:06","04:54","12:27","16:19","19:48","21:26");
        gun_7      =    new Array("7/15/2013","03:07","04:55","12:27","16:19","19:47","21:26");
        gun_8      =    new Array("7/16/2013","03:08","04:55","12:27","16:19","19:47","21:25");
        gun_9      =    new Array("7/17/2013","03:09","04:56","12:27","16:19","19:46","21:24");
        gun_10     =    new Array("7/18/2013","03:10","04:57","12:27","16:19","19:46","21:23");
        gun_11     =    new Array("7/19/2013","03:12","04:58","12:27","16:19","19:45","21:22");
        gun_12     =    new Array("7/20/2013","03:13","04:58","12:27","16:19","19:44","21:21");
        gun_13     =    new Array("7/21/2013","03:14","04:59","12:28","16:19","19:44","21:20");
        gun_14     =    new Array("7/22/2013","03:15","05:00","12:28","16:18","19:43","21:18");
        gun_15     =    new Array("7/23/2013","03:17","05:01","12:28","16:18","19:42","21:17");
        gun_16     =    new Array("7/24/2013","03:18","05:02","12:28","16:18","19:41","21:16");
        gun_17     =    new Array("7/25/2013","03:19","05:02","12:28","16:18","19:41","21:15");
        gun_18     =    new Array("7/26/2013","03:20","05:03","12:28","16:18","19:40","21:14");
        gun_19     =    new Array("7/27/2013","03:22","05:04","12:28","16:18","19:39","21:12");
        gun_20     =    new Array("7/28/2013","03:23","05:05","12:28","16:17","19:38","21:11");
        gun_21     =    new Array("7/29/2013","03:24","05:06","12:28","16:17","19:37","21:10");
        gun_22     =    new Array("7/30/2013","03:26","05:07","12:28","16:17","19:36","21:08");
        gun_23     =    new Array("7/31/2013","03:27","05:08","12:27","16:17","19:35","21:07");
        gun_24     =    new Array("8/1/2013","03:28","05:08","12:27","16:16","19:34","21:06");
        gun_25     =    new Array("8/2/2013","03:30","05:09","12:27","16:16","19:33","21:04");
        gun_26     =    new Array("8/3/2013","03:31","05:10","12:27","16:16","19:32","21:03");
        gun_27     =    new Array("8/4/2013","03:32","05:11","12:27","16:15","19:31","21:01");
        gun_28     =    new Array("8/5/2013","03:34","05:12","12:27","16:15","19:30","21:00");
        gun_29     =    new Array("8/6/2013","03:35","05:13","12:27","16:15","19:29","20:58");
        gun_30     =    new Array("8/7/2013","03:36","05:14","12:27","16:14","19:28","20:57");
		
	break;
	case "nevsehir":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  NEVSEHIR-
        gun_1      =    new Array("7/9/2013","03:28","05:18","12:53","16:46","20:17","21:57");
        gun_2      =    new Array("7/10/2013","03:29","05:19","12:54","16:46","20:16","21:56");
        gun_3      =    new Array("7/11/2013","03:30","05:19","12:54","16:46","20:16","21:55");
        gun_4      =    new Array("7/12/2013","03:31","05:20","12:54","16:46","20:16","21:55");
        gun_5      =    new Array("7/13/2013","03:32","05:21","12:54","16:46","20:15","21:54");
        gun_6      =    new Array("7/14/2013","03:33","05:21","12:54","16:46","20:15","21:53");
        gun_7      =    new Array("7/15/2013","03:35","05:22","12:54","16:46","20:14","21:52");
        gun_8      =    new Array("7/16/2013","03:36","05:23","12:54","16:46","20:14","21:51");
        gun_9      =    new Array("7/17/2013","03:37","05:23","12:54","16:46","20:13","21:50");
        gun_10     =    new Array("7/18/2013","03:38","05:24","12:54","16:46","20:12","21:49");
        gun_11     =    new Array("7/19/2013","03:39","05:25","12:55","16:46","20:12","21:48");
        gun_12     =    new Array("7/20/2013","03:40","05:26","12:55","16:46","20:11","21:47");
        gun_13     =    new Array("7/21/2013","03:42","05:27","12:55","16:45","20:10","21:46");
        gun_14     =    new Array("7/22/2013","03:43","05:27","12:55","16:45","20:10","21:45");
        gun_15     =    new Array("7/23/2013","03:44","05:28","12:55","16:45","20:09","21:44");
        gun_16     =    new Array("7/24/2013","03:45","05:29","12:55","16:45","20:08","21:43");
        gun_17     =    new Array("7/25/2013","03:47","05:30","12:55","16:45","20:07","21:41");
        gun_18     =    new Array("7/26/2013","03:48","05:31","12:55","16:45","20:07","21:40");
        gun_19     =    new Array("7/27/2013","03:49","05:32","12:55","16:45","20:06","21:39");
        gun_20     =    new Array("7/28/2013","03:51","05:32","12:55","16:44","20:05","21:38");
        gun_21     =    new Array("7/29/2013","03:52","05:33","12:55","16:44","20:04","21:36");
        gun_22     =    new Array("7/30/2013","03:53","05:34","12:55","16:44","20:03","21:35");
        gun_23     =    new Array("7/31/2013","03:55","05:35","12:55","16:44","20:02","21:34");
        gun_24     =    new Array("8/1/2013","03:56","05:36","12:55","16:43","20:01","21:32");
        gun_25     =    new Array("8/2/2013","03:57","05:37","12:54","16:43","20:00","21:31");
        gun_26     =    new Array("8/3/2013","03:59","05:38","12:54","16:43","19:59","21:29");
        gun_27     =    new Array("8/4/2013","04:00","05:38","12:54","16:42","19:58","21:28");
        gun_28     =    new Array("8/5/2013","04:01","05:39","12:54","16:42","19:57","21:26");
        gun_29     =    new Array("8/6/2013","04:03","05:40","12:54","16:42","19:56","21:25");
        gun_30     =    new Array("8/7/2013","04:04","05:41","12:54","16:41","19:55","21:23");
		
	break;
	case "nigde":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  NIGDE-
        gun_1      =    new Array("7/9/2013","03:32","05:20","12:54","16:44","20:15","21:53");
        gun_2      =    new Array("7/10/2013","03:33","05:21","12:54","16:44","20:15","21:52");
        gun_3      =    new Array("7/11/2013","03:34","05:21","12:54","16:45","20:14","21:52");
        gun_4      =    new Array("7/12/2013","03:35","05:22","12:54","16:45","20:14","21:51");
        gun_5      =    new Array("7/13/2013","03:36","05:23","12:54","16:45","20:13","21:50");
        gun_6      =    new Array("7/14/2013","03:37","05:23","12:54","16:45","20:13","21:49");
        gun_7      =    new Array("7/15/2013","03:39","05:24","12:54","16:45","20:12","21:49");
        gun_8      =    new Array("7/16/2013","03:40","05:25","12:54","16:45","20:12","21:48");
        gun_9      =    new Array("7/17/2013","03:41","05:25","12:55","16:45","20:11","21:47");
        gun_10     =    new Array("7/18/2013","03:42","05:26","12:55","16:45","20:11","21:46");
        gun_11     =    new Array("7/19/2013","03:43","05:27","12:55","16:45","20:10","21:45");
        gun_12     =    new Array("7/20/2013","03:44","05:28","12:55","16:44","20:10","21:44");
        gun_13     =    new Array("7/21/2013","03:45","05:28","12:55","16:44","20:09","21:43");
        gun_14     =    new Array("7/22/2013","03:47","05:29","12:55","16:44","20:08","21:42");
        gun_15     =    new Array("7/23/2013","03:48","05:30","12:55","16:44","20:07","21:41");
        gun_16     =    new Array("7/24/2013","03:49","05:31","12:55","16:44","20:07","21:40");
        gun_17     =    new Array("7/25/2013","03:50","05:32","12:55","16:44","20:06","21:38");
        gun_18     =    new Array("7/26/2013","03:52","05:32","12:55","16:44","20:05","21:37");
        gun_19     =    new Array("7/27/2013","03:53","05:33","12:55","16:44","20:04","21:36");
        gun_20     =    new Array("7/28/2013","03:54","05:34","12:55","16:43","20:03","21:35");
        gun_21     =    new Array("7/29/2013","03:55","05:35","12:55","16:43","20:03","21:33");
        gun_22     =    new Array("7/30/2013","03:57","05:36","12:55","16:43","20:02","21:32");
        gun_23     =    new Array("7/31/2013","03:58","05:37","12:55","16:43","20:01","21:31");
        gun_24     =    new Array("8/1/2013","03:59","05:37","12:55","16:42","20:00","21:29");
        gun_25     =    new Array("8/2/2013","04:00","05:38","12:55","16:42","19:59","21:28");
        gun_26     =    new Array("8/3/2013","04:02","05:39","12:55","16:42","19:58","21:27");
        gun_27     =    new Array("8/4/2013","04:03","05:40","12:54","16:41","19:57","21:25");
        gun_28     =    new Array("8/5/2013","04:04","05:41","12:54","16:41","19:56","21:24");
        gun_29     =    new Array("8/6/2013","04:06","05:42","12:54","16:41","19:55","21:22");
        gun_30     =    new Array("8/7/2013","04:07","05:43","12:54","16:40","19:53","21:21");
		
	break;
	case "ordu":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ORDU-
        gun_1      =    new Array("7/9/2013","03:00","04:58","12:41","16:38","20:11","21:59");
        gun_2      =    new Array("7/10/2013","03:01","04:59","12:41","16:38","20:11","21:58");
        gun_3      =    new Array("7/11/2013","03:02","04:59","12:41","16:38","20:10","21:57");
        gun_4      =    new Array("7/12/2013","03:03","05:00","12:41","16:38","20:10","21:56");
        gun_5      =    new Array("7/13/2013","03:04","05:01","12:41","16:38","20:09","21:56");
        gun_6      =    new Array("7/14/2013","03:06","05:02","12:41","16:38","20:09","21:55");
        gun_7      =    new Array("7/15/2013","03:07","05:02","12:42","16:38","20:08","21:54");
        gun_8      =    new Array("7/16/2013","03:08","05:03","12:42","16:38","20:08","21:52");
        gun_9      =    new Array("7/17/2013","03:10","05:04","12:42","16:38","20:07","21:51");
        gun_10     =    new Array("7/18/2013","03:11","05:05","12:42","16:37","20:06","21:50");
        gun_11     =    new Array("7/19/2013","03:12","05:06","12:42","16:37","20:06","21:49");
        gun_12     =    new Array("7/20/2013","03:14","05:07","12:42","16:37","20:05","21:48");
        gun_13     =    new Array("7/21/2013","03:15","05:07","12:42","16:37","20:04","21:47");
        gun_14     =    new Array("7/22/2013","03:17","05:08","12:42","16:37","20:03","21:45");
        gun_15     =    new Array("7/23/2013","03:18","05:09","12:42","16:37","20:03","21:44");
        gun_16     =    new Array("7/24/2013","03:20","05:10","12:42","16:37","20:02","21:43");
        gun_17     =    new Array("7/25/2013","03:21","05:11","12:42","16:36","20:01","21:41");
        gun_18     =    new Array("7/26/2013","03:22","05:12","12:42","16:36","20:00","21:40");
        gun_19     =    new Array("7/27/2013","03:24","05:13","12:42","16:36","19:59","21:38");
        gun_20     =    new Array("7/28/2013","03:25","05:14","12:42","16:36","19:58","21:37");
        gun_21     =    new Array("7/29/2013","03:27","05:15","12:42","16:35","19:57","21:35");
        gun_22     =    new Array("7/30/2013","03:28","05:16","12:42","16:35","19:56","21:34");
        gun_23     =    new Array("7/31/2013","03:30","05:17","12:42","16:35","19:55","21:32");
        gun_24     =    new Array("8/1/2013","03:32","05:18","12:42","16:34","19:54","21:31");
        gun_25     =    new Array("8/2/2013","03:33","05:19","12:42","16:34","19:53","21:29");
        gun_26     =    new Array("8/3/2013","03:35","05:20","12:42","16:33","19:52","21:28");
        gun_27     =    new Array("8/4/2013","03:36","05:20","12:42","16:33","19:51","21:26");
        gun_28     =    new Array("8/5/2013","03:38","05:21","12:42","16:33","19:49","21:24");
        gun_29     =    new Array("8/6/2013","03:39","05:22","12:41","16:32","19:48","21:23");
        gun_30     =    new Array("8/7/2013","03:41","05:23","12:41","16:32","19:47","21:21");
		
	break;
	case "osmaniye":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  OSMANIYE-
        gun_1      =    new Array("7/9/2013","03:31","05:16","12:47","16:36","20:06","21:42");
        gun_2      =    new Array("7/10/2013","03:32","05:17","12:47","16:36","20:06","21:41");
        gun_3      =    new Array("7/11/2013","03:33","05:17","12:48","16:36","20:05","21:41");
        gun_4      =    new Array("7/12/2013","03:34","05:18","12:48","16:36","20:05","21:40");
        gun_5      =    new Array("7/13/2013","03:35","05:19","12:48","16:37","20:05","21:39");
        gun_6      =    new Array("7/14/2013","03:36","05:19","12:48","16:37","20:04","21:39");
        gun_7      =    new Array("7/15/2013","03:37","05:20","12:48","16:37","20:04","21:38");
        gun_8      =    new Array("7/16/2013","03:38","05:21","12:48","16:37","20:03","21:37");
        gun_9      =    new Array("7/17/2013","03:39","05:21","12:48","16:37","20:03","21:36");
        gun_10     =    new Array("7/18/2013","03:40","05:22","12:48","16:37","20:02","21:35");
        gun_11     =    new Array("7/19/2013","03:41","05:23","12:48","16:37","20:02","21:34");
        gun_12     =    new Array("7/20/2013","03:43","05:24","12:48","16:36","20:01","21:33");
        gun_13     =    new Array("7/21/2013","03:44","05:24","12:48","16:36","20:00","21:32");
        gun_14     =    new Array("7/22/2013","03:45","05:25","12:49","16:36","20:00","21:31");
        gun_15     =    new Array("7/23/2013","03:46","05:26","12:49","16:36","19:59","21:30");
        gun_16     =    new Array("7/24/2013","03:47","05:27","12:49","16:36","19:58","21:29");
        gun_17     =    new Array("7/25/2013","03:48","05:27","12:49","16:36","19:57","21:28");
        gun_18     =    new Array("7/26/2013","03:50","05:28","12:49","16:36","19:57","21:27");
        gun_19     =    new Array("7/27/2013","03:51","05:29","12:49","16:36","19:56","21:26");
        gun_20     =    new Array("7/28/2013","03:52","05:30","12:49","16:36","19:55","21:24");
        gun_21     =    new Array("7/29/2013","03:53","05:31","12:49","16:35","19:54","21:23");
        gun_22     =    new Array("7/30/2013","03:54","05:31","12:49","16:35","19:53","21:22");
        gun_23     =    new Array("7/31/2013","03:56","05:32","12:48","16:35","19:52","21:21");
        gun_24     =    new Array("8/1/2013","03:57","05:33","12:48","16:35","19:51","21:19");
        gun_25     =    new Array("8/2/2013","03:58","05:34","12:48","16:34","19:50","21:18");
        gun_26     =    new Array("8/3/2013","03:59","05:35","12:48","16:34","19:50","21:17");
        gun_27     =    new Array("8/4/2013","04:00","05:36","12:48","16:34","19:49","21:15");
        gun_28     =    new Array("8/5/2013","04:02","05:36","12:48","16:34","19:47","21:14");
        gun_29     =    new Array("8/6/2013","04:03","05:37","12:48","16:33","19:46","21:13");
        gun_30     =    new Array("8/7/2013","04:04","05:38","12:48","16:33","19:45","21:11");
		
	break;
	case "rize":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  RIZE-
        gun_1      =    new Array("7/9/2013","02:49","04:47","12:30","16:27","20:01","21:49");
        gun_2      =    new Array("7/10/2013","02:50","04:48","12:30","16:27","20:00","21:48");
        gun_3      =    new Array("7/11/2013","02:51","04:49","12:31","16:27","20:00","21:47");
        gun_4      =    new Array("7/12/2013","02:52","04:49","12:31","16:27","20:00","21:46");
        gun_5      =    new Array("7/13/2013","02:54","04:50","12:31","16:27","19:59","21:45");
        gun_6      =    new Array("7/14/2013","02:55","04:51","12:31","16:27","19:59","21:44");
        gun_7      =    new Array("7/15/2013","02:56","04:52","12:31","16:27","19:58","21:43");
        gun_8      =    new Array("7/16/2013","02:57","04:53","12:31","16:27","19:57","21:42");
        gun_9      =    new Array("7/17/2013","02:59","04:53","12:31","16:27","19:57","21:41");
        gun_10     =    new Array("7/18/2013","03:00","04:54","12:31","16:27","19:56","21:40");
        gun_11     =    new Array("7/19/2013","03:02","04:55","12:31","16:27","19:55","21:39");
        gun_12     =    new Array("7/20/2013","03:03","04:56","12:31","16:27","19:55","21:38");
        gun_13     =    new Array("7/21/2013","03:04","04:57","12:31","16:27","19:54","21:36");
        gun_14     =    new Array("7/22/2013","03:06","04:58","12:31","16:26","19:53","21:35");
        gun_15     =    new Array("7/23/2013","03:07","04:59","12:31","16:26","19:52","21:34");
        gun_16     =    new Array("7/24/2013","03:09","04:59","12:32","16:26","19:51","21:32");
        gun_17     =    new Array("7/25/2013","03:10","05:00","12:32","16:26","19:50","21:31");
        gun_18     =    new Array("7/26/2013","03:12","05:01","12:32","16:26","19:50","21:30");
        gun_19     =    new Array("7/27/2013","03:13","05:02","12:32","16:25","19:49","21:28");
        gun_20     =    new Array("7/28/2013","03:15","05:03","12:32","16:25","19:48","21:27");
        gun_21     =    new Array("7/29/2013","03:16","05:04","12:31","16:25","19:47","21:25");
        gun_22     =    new Array("7/30/2013","03:18","05:05","12:31","16:24","19:46","21:24");
        gun_23     =    new Array("7/31/2013","03:19","05:06","12:31","16:24","19:45","21:22");
        gun_24     =    new Array("8/1/2013","03:21","05:07","12:31","16:24","19:44","21:20");
        gun_25     =    new Array("8/2/2013","03:22","05:08","12:31","16:23","19:42","21:19");
        gun_26     =    new Array("8/3/2013","03:24","05:09","12:31","16:23","19:41","21:17");
        gun_27     =    new Array("8/4/2013","03:25","05:10","12:31","16:23","19:40","21:16");
        gun_28     =    new Array("8/5/2013","03:27","05:11","12:31","16:22","19:39","21:14");
        gun_29     =    new Array("8/6/2013","03:28","05:12","12:31","16:22","19:38","21:12");
        gun_30     =    new Array("8/7/2013","03:30","05:13","12:31","16:21","19:37","21:11");
		
	break;
	case "sakarya":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi SAKARYA-
        gun_1      =    new Array("7/9/2013","03:31","05:28","13:11","17:07","20:40","22:27");
        gun_2      =    new Array("7/10/2013","03:32","05:29","13:11","17:07","20:40","22:27");
        gun_3      =    new Array("7/11/2013","03:33","05:30","13:11","17:07","20:40","22:26");
        gun_4      =    new Array("7/12/2013","03:34","05:31","13:11","17:07","20:39","22:25");
        gun_5      =    new Array("7/13/2013","03:36","05:31","13:11","17:07","20:39","22:24");
        gun_6      =    new Array("7/14/2013","03:37","05:32","13:11","17:07","20:38","22:23");
        gun_7      =    new Array("7/15/2013","03:38","05:33","13:11","17:07","20:38","22:22");
        gun_8      =    new Array("7/16/2013","03:39","05:34","13:11","17:07","20:37","22:21");
        gun_9      =    new Array("7/17/2013","03:41","05:34","13:12","17:07","20:36","22:20");
        gun_10     =    new Array("7/18/2013","03:42","05:35","13:12","17:07","20:36","22:19");
        gun_11     =    new Array("7/19/2013","03:44","05:36","13:12","17:07","20:35","22:18");
        gun_12     =    new Array("7/20/2013","03:45","05:37","13:12","17:07","20:34","22:16");
        gun_13     =    new Array("7/21/2013","03:46","05:38","13:12","17:07","20:34","22:15");
        gun_14     =    new Array("7/22/2013","03:48","05:39","13:12","17:06","20:33","22:14");
        gun_15     =    new Array("7/23/2013","03:49","05:40","13:12","17:06","20:32","22:13");
        gun_16     =    new Array("7/24/2013","03:51","05:40","13:12","17:06","20:31","22:11");
        gun_17     =    new Array("7/25/2013","03:52","05:41","13:12","17:06","20:30","22:10");
        gun_18     =    new Array("7/26/2013","03:53","05:42","13:12","17:06","20:29","22:09");
        gun_19     =    new Array("7/27/2013","03:55","05:43","13:12","17:05","20:28","22:07");
        gun_20     =    new Array("7/28/2013","03:56","05:44","13:12","17:05","20:27","22:06");
        gun_21     =    new Array("7/29/2013","03:58","05:45","13:12","17:05","20:26","22:04");
        gun_22     =    new Array("7/30/2013","03:59","05:46","13:12","17:04","20:25","22:03");
        gun_23     =    new Array("7/31/2013","04:01","05:47","13:12","17:04","20:24","22:01");
        gun_24     =    new Array("8/1/2013","04:02","05:48","13:12","17:04","20:23","22:00");
        gun_25     =    new Array("8/2/2013","04:04","05:49","13:12","17:03","20:22","21:58");
        gun_26     =    new Array("8/3/2013","04:05","05:50","13:12","17:03","20:21","21:56");
        gun_27     =    new Array("8/4/2013","04:07","05:51","13:11","17:03","20:20","21:55");
        gun_28     =    new Array("8/5/2013","04:08","05:52","13:11","17:02","20:19","21:53");
        gun_29     =    new Array("8/6/2013","04:10","05:53","13:11","17:02","20:18","21:51");
        gun_30     =    new Array("8/7/2013","04:11","05:54","13:11","17:01","20:16","21:50");
		
	break;
	case "samsun":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi SAMSUN-
        gun_1      =    new Array("7/9/2013","03:04","05:03","12:47","16:45","20:18","22:07");
        gun_2      =    new Array("7/10/2013","03:05","05:04","12:47","16:45","20:18","22:06");
        gun_3      =    new Array("7/11/2013","03:06","05:05","12:47","16:45","20:18","22:06");
        gun_4      =    new Array("7/12/2013","03:07","05:05","12:47","16:45","20:17","22:05");
        gun_5      =    new Array("7/13/2013","03:08","05:06","12:47","16:45","20:17","22:04");
        gun_6      =    new Array("7/14/2013","03:10","05:07","12:48","16:45","20:16","22:03");
        gun_7      =    new Array("7/15/2013","03:11","05:08","12:48","16:44","20:16","22:02");
        gun_8      =    new Array("7/16/2013","03:12","05:08","12:48","16:44","20:15","22:01");
        gun_9      =    new Array("7/17/2013","03:14","05:09","12:48","16:44","20:14","22:00");
        gun_10     =    new Array("7/18/2013","03:15","05:10","12:48","16:44","20:14","21:58");
        gun_11     =    new Array("7/19/2013","03:17","05:11","12:48","16:44","20:13","21:57");
        gun_12     =    new Array("7/20/2013","03:18","05:12","12:48","16:44","20:12","21:56");
        gun_13     =    new Array("7/21/2013","03:19","05:13","12:48","16:44","20:11","21:55");
        gun_14     =    new Array("7/22/2013","03:21","05:14","12:48","16:44","20:11","21:53");
        gun_15     =    new Array("7/23/2013","03:22","05:15","12:48","16:43","20:10","21:52");
        gun_16     =    new Array("7/24/2013","03:24","05:15","12:48","16:43","20:09","21:51");
        gun_17     =    new Array("7/25/2013","03:25","05:16","12:48","16:43","20:08","21:49");
        gun_18     =    new Array("7/26/2013","03:27","05:17","12:48","16:43","20:07","21:48");
        gun_19     =    new Array("7/27/2013","03:28","05:18","12:48","16:42","20:06","21:46");
        gun_20     =    new Array("7/28/2013","03:30","05:19","12:48","16:42","20:05","21:45");
        gun_21     =    new Array("7/29/2013","03:31","05:20","12:48","16:42","20:04","21:43");
        gun_22     =    new Array("7/30/2013","03:33","05:21","12:48","16:42","20:03","21:42");
        gun_23     =    new Array("7/31/2013","03:34","05:22","12:48","16:41","20:02","21:40");
        gun_24     =    new Array("8/1/2013","03:36","05:23","12:48","16:41","20:01","21:39");
        gun_25     =    new Array("8/2/2013","03:38","05:24","12:48","16:40","20:00","21:37");
        gun_26     =    new Array("8/3/2013","03:39","05:25","12:48","16:40","19:59","21:35");
        gun_27     =    new Array("8/4/2013","03:41","05:26","12:48","16:40","19:58","21:34");
        gun_28     =    new Array("8/5/2013","03:42","05:27","12:48","16:39","19:56","21:32");
        gun_29     =    new Array("8/6/2013","03:44","05:28","12:48","16:39","19:55","21:30");
        gun_30     =    new Array("8/7/2013","03:45","05:29","12:48","16:38","19:54","21:29");
		
	break;
	case "sanliurfa":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  SANLIURFA-
        gun_1      =    new Array("7/9/2013","03:21","05:06","12:37","16:26","19:56","21:32");
        gun_2      =    new Array("7/10/2013","03:22","05:06","12:37","16:26","19:56","21:32");
        gun_3      =    new Array("7/11/2013","03:22","05:07","12:37","16:26","19:56","21:31");
        gun_4      =    new Array("7/12/2013","03:23","05:08","12:38","16:26","19:55","21:30");
        gun_5      =    new Array("7/13/2013","03:24","05:08","12:38","16:27","19:55","21:30");
        gun_6      =    new Array("7/14/2013","03:25","05:09","12:38","16:27","19:54","21:29");
        gun_7      =    new Array("7/15/2013","03:26","05:10","12:38","16:27","19:54","21:28");
        gun_8      =    new Array("7/16/2013","03:28","05:10","12:38","16:27","19:53","21:27");
        gun_9      =    new Array("7/17/2013","03:29","05:11","12:38","16:27","19:53","21:26");
        gun_10     =    new Array("7/18/2013","03:30","05:12","12:38","16:27","19:52","21:25");
        gun_11     =    new Array("7/19/2013","03:31","05:13","12:38","16:27","19:52","21:24");
        gun_12     =    new Array("7/20/2013","03:32","05:13","12:38","16:26","19:51","21:24");
        gun_13     =    new Array("7/21/2013","03:33","05:14","12:38","16:26","19:50","21:23");
        gun_14     =    new Array("7/22/2013","03:34","05:15","12:38","16:26","19:50","21:21");
        gun_15     =    new Array("7/23/2013","03:35","05:16","12:38","16:26","19:49","21:20");
        gun_16     =    new Array("7/24/2013","03:37","05:16","12:38","16:26","19:48","21:19");
        gun_17     =    new Array("7/25/2013","03:38","05:17","12:38","16:26","19:47","21:18");
        gun_18     =    new Array("7/26/2013","03:39","05:18","12:38","16:26","19:47","21:17");
        gun_19     =    new Array("7/27/2013","03:40","05:19","12:38","16:26","19:46","21:16");
        gun_20     =    new Array("7/28/2013","03:41","05:20","12:38","16:26","19:45","21:15");
        gun_21     =    new Array("7/29/2013","03:43","05:20","12:38","16:25","19:44","21:13");
        gun_22     =    new Array("7/30/2013","03:44","05:21","12:38","16:25","19:43","21:12");
        gun_23     =    new Array("7/31/2013","03:45","05:22","12:38","16:25","19:42","21:11");
        gun_24     =    new Array("8/1/2013","03:46","05:23","12:38","16:25","19:41","21:10");
        gun_25     =    new Array("8/2/2013","03:48","05:24","12:38","16:24","19:41","21:08");
        gun_26     =    new Array("8/3/2013","03:49","05:24","12:38","16:24","19:40","21:07");
        gun_27     =    new Array("8/4/2013","03:50","05:25","12:38","16:24","19:39","21:06");
        gun_28     =    new Array("8/5/2013","03:51","05:26","12:38","16:23","19:37","21:04");
        gun_29     =    new Array("8/6/2013","03:52","05:27","12:38","16:23","19:36","21:03");
        gun_30     =    new Array("8/7/2013","03:54","05:28","12:38","16:23","19:35","21:01");
		
	break;
	case "siirt":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  SIIRT-
        gun_1      =    new Array("7/9/2013","03:04","04:51","12:25","16:15","19:46","21:24");
        gun_2      =    new Array("7/10/2013","03:05","04:52","12:25","16:15","19:45","21:23");
        gun_3      =    new Array("7/11/2013","03:05","04:52","12:25","16:15","19:45","21:22");
        gun_4      =    new Array("7/12/2013","03:06","04:53","12:25","16:15","19:45","21:22");
        gun_5      =    new Array("7/13/2013","03:08","04:54","12:25","16:16","19:44","21:21");
        gun_6      =    new Array("7/14/2013","03:09","04:54","12:25","16:16","19:44","21:20");
        gun_7      =    new Array("7/15/2013","03:10","04:55","12:25","16:16","19:43","21:19");
        gun_8      =    new Array("7/16/2013","03:11","04:56","12:25","16:16","19:43","21:19");
        gun_9      =    new Array("7/17/2013","03:12","04:56","12:25","16:16","19:42","21:18");
        gun_10     =    new Array("7/18/2013","03:13","04:57","12:26","16:15","19:42","21:17");
        gun_11     =    new Array("7/19/2013","03:14","04:58","12:26","16:15","19:41","21:16");
        gun_12     =    new Array("7/20/2013","03:15","04:59","12:26","16:15","19:40","21:15");
        gun_13     =    new Array("7/21/2013","03:17","04:59","12:26","16:15","19:40","21:14");
        gun_14     =    new Array("7/22/2013","03:18","05:00","12:26","16:15","19:39","21:13");
        gun_15     =    new Array("7/23/2013","03:19","05:01","12:26","16:15","19:38","21:12");
        gun_16     =    new Array("7/24/2013","03:20","05:02","12:26","16:15","19:38","21:10");
        gun_17     =    new Array("7/25/2013","03:21","05:03","12:26","16:15","19:37","21:09");
        gun_18     =    new Array("7/26/2013","03:23","05:03","12:26","16:15","19:36","21:08");
        gun_19     =    new Array("7/27/2013","03:24","05:04","12:26","16:14","19:35","21:07");
        gun_20     =    new Array("7/28/2013","03:25","05:05","12:26","16:14","19:34","21:06");
        gun_21     =    new Array("7/29/2013","03:26","05:06","12:26","16:14","19:33","21:04");
        gun_22     =    new Array("7/30/2013","03:28","05:07","12:26","16:14","19:32","21:03");
        gun_23     =    new Array("7/31/2013","03:29","05:08","12:26","16:14","19:32","21:02");
        gun_24     =    new Array("8/1/2013","03:30","05:08","12:26","16:13","19:31","21:00");
        gun_25     =    new Array("8/2/2013","03:32","05:09","12:26","16:13","19:30","20:59");
        gun_26     =    new Array("8/3/2013","03:33","05:10","12:25","16:13","19:29","20:57");
        gun_27     =    new Array("8/4/2013","03:34","05:11","12:25","16:12","19:28","20:56");
        gun_28     =    new Array("8/5/2013","03:35","05:12","12:25","16:12","19:26","20:55");
        gun_29     =    new Array("8/6/2013","03:37","05:13","12:25","16:12","19:25","20:53");
        gun_30     =    new Array("8/7/2013","03:38","05:14","12:25","16:11","19:24","20:52");
		
	break;
	case "sinop":
		 // Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  SINOP-
        gun_1      =    new Array("7/9/2013","03:03","05:05","12:52","16:51","20:26","22:17");
        gun_2      =    new Array("7/10/2013","03:04","05:06","12:52","16:51","20:25","22:16");
        gun_3      =    new Array("7/11/2013","03:05","05:07","12:52","16:51","20:25","22:16");
        gun_4      =    new Array("7/12/2013","03:06","05:08","12:52","16:51","20:24","22:15");
        gun_5      =    new Array("7/13/2013","03:08","05:08","12:52","16:51","20:24","22:14");
        gun_6      =    new Array("7/14/2013","03:09","05:09","12:52","16:51","20:23","22:13");
        gun_7      =    new Array("7/15/2013","03:10","05:10","12:52","16:51","20:23","22:11");
        gun_8      =    new Array("7/16/2013","03:12","05:11","12:53","16:50","20:22","22:10");
        gun_9      =    new Array("7/17/2013","03:13","05:12","12:53","16:50","20:21","22:09");
        gun_10     =    new Array("7/18/2013","03:15","05:13","12:53","16:50","20:21","22:08");
        gun_11     =    new Array("7/19/2013","03:16","05:13","12:53","16:50","20:20","22:07");
        gun_12     =    new Array("7/20/2013","03:18","05:14","12:53","16:50","20:19","22:05");
        gun_13     =    new Array("7/21/2013","03:19","05:15","12:53","16:50","20:18","22:04");
        gun_14     =    new Array("7/22/2013","03:21","05:16","12:53","16:50","20:17","22:03");
        gun_15     =    new Array("7/23/2013","03:22","05:17","12:53","16:49","20:17","22:01");
        gun_16     =    new Array("7/24/2013","03:24","05:18","12:53","16:49","20:16","22:00");
        gun_17     =    new Array("7/25/2013","03:25","05:19","12:53","16:49","20:15","21:58");
        gun_18     =    new Array("7/26/2013","03:27","05:20","12:53","16:49","20:14","21:57");
        gun_19     =    new Array("7/27/2013","03:29","05:21","12:53","16:48","20:13","21:55");
        gun_20     =    new Array("7/28/2013","03:30","05:22","12:53","16:48","20:12","21:54");
        gun_21     =    new Array("7/29/2013","03:32","05:23","12:53","16:48","20:11","21:52");
        gun_22     =    new Array("7/30/2013","03:33","05:24","12:53","16:47","20:10","21:50");
        gun_23     =    new Array("7/31/2013","03:35","05:25","12:53","16:47","20:09","21:49");
        gun_24     =    new Array("8/1/2013","03:37","05:26","12:53","16:47","20:07","21:47");
        gun_25     =    new Array("8/2/2013","03:38","05:27","12:53","16:46","20:06","21:45");
        gun_26     =    new Array("8/3/2013","03:40","05:28","12:53","16:46","20:05","21:44");
        gun_27     =    new Array("8/4/2013","03:41","05:29","12:53","16:45","20:04","21:42");
        gun_28     =    new Array("8/5/2013","03:43","05:30","12:52","16:45","20:03","21:40");
        gun_29     =    new Array("8/6/2013","03:45","05:31","12:52","16:44","20:02","21:39");
        gun_30     =    new Array("8/7/2013","03:46","05:32","12:52","16:44","20:00","21:37");
		
	break;
	case "sirnak":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  SIRNAK-
        gun_1      =    new Array("7/9/2013","03:04","04:50","12:22","16:12","19:43","21:19");
        gun_2      =    new Array("7/10/2013","03:05","04:51","12:23","16:12","19:42","21:19");
        gun_3      =    new Array("7/11/2013","03:06","04:51","12:23","16:12","19:42","21:18");
        gun_4      =    new Array("7/12/2013","03:07","04:52","12:23","16:13","19:41","21:17");
        gun_5      =    new Array("7/13/2013","03:08","04:53","12:23","16:13","19:41","21:17");
        gun_6      =    new Array("7/14/2013","03:09","04:53","12:23","16:13","19:41","21:16");
        gun_7      =    new Array("7/15/2013","03:10","04:54","12:23","16:13","19:40","21:15");
        gun_8      =    new Array("7/16/2013","03:11","04:55","12:23","16:13","19:40","21:14");
        gun_9      =    new Array("7/17/2013","03:12","04:55","12:23","16:13","19:39","21:13");
        gun_10     =    new Array("7/18/2013","03:13","04:56","12:23","16:13","19:38","21:13");
        gun_11     =    new Array("7/19/2013","03:14","04:57","12:24","16:13","19:38","21:12");
        gun_12     =    new Array("7/20/2013","03:15","04:58","12:24","16:12","19:37","21:11");
        gun_13     =    new Array("7/21/2013","03:17","04:58","12:24","16:12","19:37","21:10");
        gun_14     =    new Array("7/22/2013","03:18","04:59","12:24","16:12","19:36","21:09");
        gun_15     =    new Array("7/23/2013","03:19","05:00","12:24","16:12","19:35","21:07");
        gun_16     =    new Array("7/24/2013","03:20","05:01","12:24","16:12","19:34","21:06");
        gun_17     =    new Array("7/25/2013","03:21","05:02","12:24","16:12","19:34","21:05");
        gun_18     =    new Array("7/26/2013","03:23","05:02","12:24","16:12","19:33","21:04");
        gun_19     =    new Array("7/27/2013","03:24","05:03","12:24","16:12","19:32","21:03");
        gun_20     =    new Array("7/28/2013","03:25","05:04","12:24","16:11","19:31","21:02");
        gun_21     =    new Array("7/29/2013","03:26","05:05","12:24","16:11","19:30","21:00");
        gun_22     =    new Array("7/30/2013","03:28","05:06","12:24","16:11","19:29","20:59");
        gun_23     =    new Array("7/31/2013","03:29","05:06","12:24","16:11","19:29","20:58");
        gun_24     =    new Array("8/1/2013","03:30","05:07","12:24","16:11","19:28","20:56");
        gun_25     =    new Array("8/2/2013","03:31","05:08","12:23","16:10","19:27","20:55");
        gun_26     =    new Array("8/3/2013","03:33","05:09","12:23","16:10","19:26","20:54");
        gun_27     =    new Array("8/4/2013","03:34","05:10","12:23","16:10","19:25","20:52");
        gun_28     =    new Array("8/5/2013","03:35","05:11","12:23","16:09","19:24","20:51");
        gun_29     =    new Array("8/6/2013","03:36","05:12","12:23","16:09","19:23","20:49");
        gun_30     =    new Array("8/7/2013","03:38","05:12","12:23","16:09","19:21","20:48");
		
	break;
	case "sivas":
		 // Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi SIVAS-
        gun_1      =    new Array("7/9/2013","03:12","05:05","12:44","16:39","20:11","21:54");
        gun_2      =    new Array("7/10/2013","03:13","05:06","12:44","16:39","20:11","21:54");
        gun_3      =    new Array("7/11/2013","03:14","05:07","12:44","16:39","20:10","21:53");
        gun_4      =    new Array("7/12/2013","03:15","05:07","12:45","16:39","20:10","21:52");
        gun_5      =    new Array("7/13/2013","03:16","05:08","12:45","16:39","20:09","21:51");
        gun_6      =    new Array("7/14/2013","03:17","05:09","12:45","16:39","20:09","21:50");
        gun_7      =    new Array("7/15/2013","03:18","05:10","12:45","16:39","20:08","21:49");
        gun_8      =    new Array("7/16/2013","03:20","05:10","12:45","16:39","20:08","21:48");
        gun_9      =    new Array("7/17/2013","03:21","05:11","12:45","16:39","20:07","21:47");
        gun_10     =    new Array("7/18/2013","03:22","05:12","12:45","16:39","20:06","21:46");
        gun_11     =    new Array("7/19/2013","03:23","05:13","12:45","16:39","20:06","21:45");
        gun_12     =    new Array("7/20/2013","03:25","05:13","12:45","16:38","20:05","21:44");
        gun_13     =    new Array("7/21/2013","03:26","05:14","12:45","16:38","20:04","21:43");
        gun_14     =    new Array("7/22/2013","03:27","05:15","12:45","16:38","20:04","21:42");
        gun_15     =    new Array("7/23/2013","03:29","05:16","12:45","16:38","20:03","21:41");
        gun_16     =    new Array("7/24/2013","03:30","05:17","12:45","16:38","20:02","21:39");
        gun_17     =    new Array("7/25/2013","03:32","05:18","12:46","16:38","20:01","21:38");
        gun_18     =    new Array("7/26/2013","03:33","05:19","12:46","16:37","20:00","21:37");
        gun_19     =    new Array("7/27/2013","03:34","05:19","12:46","16:37","19:59","21:35");
        gun_20     =    new Array("7/28/2013","03:36","05:20","12:45","16:37","19:58","21:34");
        gun_21     =    new Array("7/29/2013","03:37","05:21","12:45","16:37","19:57","21:33");
        gun_22     =    new Array("7/30/2013","03:38","05:22","12:45","16:36","19:56","21:31");
        gun_23     =    new Array("7/31/2013","03:40","05:23","12:45","16:36","19:55","21:30");
        gun_24     =    new Array("8/1/2013","03:41","05:24","12:45","16:36","19:54","21:28");
        gun_25     =    new Array("8/2/2013","03:43","05:25","12:45","16:35","19:53","21:27");
        gun_26     =    new Array("8/3/2013","03:44","05:26","12:45","16:35","19:52","21:25");
        gun_27     =    new Array("8/4/2013","03:46","05:27","12:45","16:35","19:51","21:24");
        gun_28     =    new Array("8/5/2013","03:47","05:28","12:45","16:34","19:50","21:22");
        gun_29     =    new Array("8/6/2013","03:48","05:29","12:45","16:34","19:49","21:20");
        gun_30     =    new Array("8/7/2013","03:50","05:30","12:45","16:33","19:48","21:19");
		
	break;
	case "tekirdag":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  TEKIRDAG-
        gun_1      =    new Array("7/9/2013","03:41","05:39","13:22","17:19","20:53","22:4");
        gun_2      =    new Array("7/10/2013","03:42","05:40","13:22","17:19","20:52","22:40");
        gun_3      =    new Array("7/11/2013","03:43","05:41","13:23","17:19","20:52","22:39");
        gun_4      =    new Array("7/12/2013","03:45","05:42","13:23","17:19","20:51","22:38");
        gun_5      =    new Array("7/13/2013","03:46","05:42","13:23","17:19","20:51","22:37");
        gun_6      =    new Array("7/14/2013","03:47","05:43","13:23","17:19","20:50","22:36");
        gun_7      =    new Array("7/15/2013","03:48","05:44","13:23","17:19","20:50","22:35");
        gun_8      =    new Array("7/16/2013","03:50","05:45","13:23","17:19","20:49","22:34");
        gun_9      =    new Array("7/17/2013","03:51","05:46","13:23","17:19","20:49","22:33");
        gun_10     =    new Array("7/18/2013","03:52","05:46","13:23","17:19","20:48","22:32");
        gun_11     =    new Array("7/19/2013","03:54","05:47","13:23","17:19","20:47","22:30");
        gun_12     =    new Array("7/20/2013","03:55","05:48","13:23","17:19","20:46","22:29");
        gun_13     =    new Array("7/21/2013","03:57","05:49","13:23","17:18","20:46","22:28");
        gun_14     =    new Array("7/22/2013","03:58","05:50","13:23","17:18","20:45","22:27");
        gun_15     =    new Array("7/23/2013","04:00","05:51","13:23","17:18","20:44","22:25");
        gun_16     =    new Array("7/24/2013","04:01","05:52","13:24","17:18","20:43","22:24");
        gun_17     =    new Array("7/25/2013","04:02","05:52","13:24","17:18","20:42","22:23");
        gun_18     =    new Array("7/26/2013","04:04","05:53","13:24","17:17","20:41","22:21");
        gun_19     =    new Array("7/27/2013","04:05","05:54","13:24","17:17","20:41","22:20");
        gun_20     =    new Array("7/28/2013","04:07","05:55","13:24","17:17","20:40","22:18");
        gun_21     =    new Array("7/29/2013","04:08","05:56","13:23","17:17","20:39","22:17");
        gun_22     =    new Array("7/30/2013","04:10","05:57","13:23","17:16","20:38","22:15");
        gun_23     =    new Array("7/31/2013","04:11","05:58","13:23","17:16","20:36","22:14");
        gun_24     =    new Array("8/1/2013","04:13","05:59","13:23","17:16","20:35","22:12");
        gun_25     =    new Array("8/2/2013","04:15","06:00","13:23","17:15","20:34","22:11");
        gun_26     =    new Array("8/3/2013","04:16","06:01","13:23","17:15","20:33","22:09");
        gun_27     =    new Array("8/4/2013","04:18","06:02","13:23","17:14","20:32","22:07");
        gun_28     =    new Array("8/5/2013","04:19","06:03","13:23","17:14","20:31","22:06");
        gun_29     =    new Array("8/6/2013","04:21","06:04","13:23","17:14","20:30","22:04");
        gun_30     =    new Array("8/7/2013","04:22","06:05","13:23","17:13","20:28","22:02");
		
	break;
	case "tokat":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  TOKAT-
        gun_1      =    new Array("7/9/2013","03:10","05:05","12:46","16:42","20:14","22:00");
        gun_2      =    new Array("7/10/2013","03:11","05:06","12:46","16:42","20:14","21:59");
        gun_3      =    new Array("7/11/2013","03:12","05:07","12:46","16:42","20:14","21:58");
        gun_4      =    new Array("7/12/2013","03:13","05:07","12:46","16:42","20:13","21:57");
        gun_5      =    new Array("7/13/2013","03:14","05:08","12:47","16:42","20:13","21:56");
        gun_6      =    new Array("7/14/2013","03:16","05:09","12:47","16:42","20:12","21:56");
        gun_7      =    new Array("7/15/2013","03:17","05:10","12:47","16:42","20:12","21:55");
        gun_8      =    new Array("7/16/2013","03:18","05:11","12:47","16:42","20:11","21:54");
        gun_9      =    new Array("7/17/2013","03:19","05:11","12:47","16:42","20:10","21:53");
        gun_10     =    new Array("7/18/2013","03:21","05:12","12:47","16:42","20:10","21:51");
        gun_11     =    new Array("7/19/2013","03:22","05:13","12:47","16:41","20:09","21:50");
        gun_12     =    new Array("7/20/2013","03:23","05:14","12:47","16:41","20:08","21:49");
        gun_13     =    new Array("7/21/2013","03:25","05:15","12:47","16:41","20:08","21:48");
        gun_14     =    new Array("7/22/2013","03:26","05:15","12:47","16:41","20:07","21:47");
        gun_15     =    new Array("7/23/2013","03:27","05:16","12:47","16:41","20:06","21:45");
        gun_16     =    new Array("7/24/2013","03:29","05:17","12:47","16:41","20:05","21:44");
        gun_17     =    new Array("7/25/2013","03:30","05:18","12:47","16:40","20:04","21:43");
        gun_18     =    new Array("7/26/2013","03:32","05:19","12:47","16:40","20:04","21:41");
        gun_19     =    new Array("7/27/2013","03:33","05:20","12:47","16:40","20:03","21:40");
        gun_20     =    new Array("7/28/2013","03:35","05:21","12:47","16:40","20:02","21:39");
        gun_21     =    new Array("7/29/2013","03:36","05:22","12:47","16:39","20:01","21:37");
        gun_22     =    new Array("7/30/2013","03:37","05:23","12:47","16:39","20:00","21:36");
        gun_23     =    new Array("7/31/2013","03:39","05:24","12:47","16:39","19:59","21:34");
        gun_24     =    new Array("8/1/2013","03:40","05:24","12:47","16:38","19:58","21:33");
        gun_25     =    new Array("8/2/2013","03:42","05:25","12:47","16:38","19:57","21:31");
        gun_26     =    new Array("8/3/2013","03:43","05:26","12:47","16:38","19:55","21:30");
        gun_27     =    new Array("8/4/2013","03:45","05:27","12:47","16:37","19:54","21:28");
        gun_28     =    new Array("8/5/2013","03:46","05:28","12:47","16:37","19:53","21:26");
        gun_29     =    new Array("8/6/2013","03:48","05:29","12:47","16:36","19:52","21:25");
        gun_30     =    new Array("8/7/2013","03:49","05:30","12:47","16:36","19:51","21:23");
		
	break;
	case "trabzon":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  TRABZON-
        gun_1      =    new Array("7/9/2013","02:52","04:51","12:34","16:31","20:04","21:52");
        gun_2      =    new Array("7/10/2013","02:53","04:51","12:34","16:31","20:04","21:51");
        gun_3      =    new Array("7/11/2013","02:55","04:52","12:34","16:31","20:03","21:50");
        gun_4      =    new Array("7/12/2013","02:56","04:53","12:34","16:31","20:03","21:49");
        gun_5      =    new Array("7/13/2013","02:57","04:54","12:34","16:31","20:02","21:48");
        gun_6      =    new Array("7/14/2013","02:58","04:54","12:34","16:31","20:02","21:47");
        gun_7      =    new Array("7/15/2013","03:00","04:55","12:34","16:30","20:01","21:46");
        gun_8      =    new Array("7/16/2013","03:01","04:56","12:34","16:30","20:01","21:45");
        gun_9      =    new Array("7/17/2013","03:02","04:57","12:34","16:30","20:00","21:44");
        gun_10     =    new Array("7/18/2013","03:04","04:58","12:35","16:30","19:59","21:43");
        gun_11     =    new Array("7/19/2013","03:05","04:58","12:35","16:30","19:59","21:42");
        gun_12     =    new Array("7/20/2013","03:06","04:59","12:35","16:30","19:58","21:41");
        gun_13     =    new Array("7/21/2013","03:08","05:00","12:35","16:30","19:57","21:39");
        gun_14     =    new Array("7/22/2013","03:09","05:01","12:35","16:30","19:56","21:38");
        gun_15     =    new Array("7/23/2013","03:11","05:02","12:35","16:29","19:55","21:37");
        gun_16     =    new Array("7/24/2013","03:12","05:03","12:35","16:29","19:55","21:35");
        gun_17     =    new Array("7/25/2013","03:14","05:04","12:35","16:29","19:54","21:34");
        gun_18     =    new Array("7/26/2013","03:15","05:05","12:35","16:29","19:53","21:33");
        gun_19     =    new Array("7/27/2013","03:17","05:06","12:35","16:29","19:52","21:31");
        gun_20     =    new Array("7/28/2013","03:18","05:06","12:35","16:28","19:51","21:30");
        gun_21     =    new Array("7/29/2013","03:20","05:07","12:35","16:28","19:50","21:28");
        gun_22     =    new Array("7/30/2013","03:21","05:08","12:35","16:28","19:49","21:27");
        gun_23     =    new Array("7/31/2013","03:23","05:09","12:35","16:27","19:48","21:25");
        gun_24     =    new Array("8/1/2013","03:24","05:10","12:35","16:27","19:47","21:24");
        gun_25     =    new Array("8/2/2013","03:26","05:11","12:35","16:27","19:46","21:22");
        gun_26     =    new Array("8/3/2013","03:27","05:12","12:34","16:26","19:45","21:20");
        gun_27     =    new Array("8/4/2013","03:29","05:13","12:34","16:26","19:43","21:19");
        gun_28     =    new Array("8/5/2013","03:30","05:14","12:34","16:25","19:42","21:17");
        gun_29     =    new Array("8/6/2013","03:32","05:15","12:34","16:25","19:41","21:15");
        gun_30     =    new Array("8/7/2013","03:33","05:16","12:34","16:24","19:40","21:14");
		
	break;
	case "tunceli":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  TUNCELİ-
        gun_1      =    new Array("7/9/2013","03:06","04:57","12:34","16:27","19:59","21:40");
        gun_2      =    new Array("7/10/2013","03:07","04:58","12:34","16:27","19:58","21:39");
        gun_3      =    new Array("7/11/2013","03:08","04:58","12:34","16:27","19:58","21:39");
        gun_4      =    new Array("7/12/2013","03:09","04:59","12:35","16:27","19:58","21:38");
        gun_5      =    new Array("7/13/2013","03:10","05:00","12:35","16:27","19:57","21:37");
        gun_6      =    new Array("7/14/2013","03:11","05:01","12:35","16:27","19:57","21:36");
        gun_7      =    new Array("7/15/2013","03:12","05:01","12:35","16:27","19:56","21:35");
        gun_8      =    new Array("7/16/2013","03:14","05:02","12:35","16:27","19:56","21:35");
        gun_9      =    new Array("7/17/2013","03:15","05:03","12:35","16:27","19:55","21:34");
        gun_10     =    new Array("7/18/2013","03:16","05:04","12:35","16:27","19:54","21:33");
        gun_11     =    new Array("7/19/2013","03:17","05:04","12:35","16:27","19:54","21:31");
        gun_12     =    new Array("7/20/2013","03:18","05:05","12:35","16:27","19:53","21:30");
        gun_13     =    new Array("7/21/2013","03:20","05:06","12:35","16:27","19:52","21:29");
        gun_14     =    new Array("7/22/2013","03:21","05:07","12:35","16:27","19:52","21:28");
        gun_15     =    new Array("7/23/2013","03:22","05:08","12:35","16:27","19:51","21:27");
        gun_16     =    new Array("7/24/2013","03:24","05:08","12:35","16:27","19:50","21:26");
        gun_17     =    new Array("7/25/2013","03:25","05:09","12:35","16:26","19:49","21:25");
        gun_18     =    new Array("7/26/2013","03:26","05:10","12:35","16:26","19:48","21:23");
        gun_19     =    new Array("7/27/2013","03:28","05:11","12:35","16:26","19:48","21:22");
        gun_20     =    new Array("7/28/2013","03:29","05:12","12:35","16:26","19:47","21:21");
        gun_21     =    new Array("7/29/2013","03:30","05:13","12:35","16:26","19:46","21:19");
        gun_22     =    new Array("7/30/2013","03:32","05:14","12:35","16:25","19:45","21:18");
        gun_23     =    new Array("7/31/2013","03:33","05:14","12:35","16:25","19:44","21:16");
        gun_24     =    new Array("8/1/2013","03:34","05:15","12:35","16:25","19:43","21:15");
        gun_25     =    new Array("8/2/2013","03:36","05:16","12:35","16:24","19:42","21:14");
        gun_26     =    new Array("8/3/2013","03:37","05:17","12:35","16:24","19:41","21:12");
        gun_27     =    new Array("8/4/2013","03:38","05:18","12:35","16:24","19:40","21:11");
        gun_28     =    new Array("8/5/2013","03:40","05:19","12:35","16:23","19:39","21:09");
        gun_29     =    new Array("8/6/2013","03:41","05:20","12:35","16:23","19:37","21:08");
        gun_30     =    new Array("8/7/2013","03:43","05:21","12:35","16:22","19:36","21:06");
		
	break;
	case "usak":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  USAK-
        gun_1      =    new Array("7/9/2013","03:49","05:39","13:15","17:07","20:38","22:18");
        gun_2      =    new Array("7/10/2013","03:50","05:40","13:15","17:07","20:38","22:18");
        gun_3      =    new Array("7/11/2013","03:51","05:40","13:15","17:07","20:37","22:17");
        gun_4      =    new Array("7/12/2013","03:52","05:41","13:15","17:07","20:37","22:16");
        gun_5      =    new Array("7/13/2013","03:53","05:42","13:15","17:07","20:37","22:15");
        gun_6      =    new Array("7/14/2013","03:54","05:42","13:15","17:07","20:36","22:14");
        gun_7      =    new Array("7/15/2013","03:56","05:43","13:15","17:07","20:36","22:14");
        gun_8      =    new Array("7/16/2013","03:57","05:44","13:16","17:07","20:35","22:13");
        gun_9      =    new Array("7/17/2013","03:58","05:45","13:16","17:07","20:34","22:12");
        gun_10     =    new Array("7/18/2013","03:59","05:45","13:16","17:07","20:34","22:11");
        gun_11     =    new Array("7/19/2013","04:00","05:46","13:16","17:07","20:33","22:10");
        gun_12     =    new Array("7/20/2013","04:01","05:47","13:16","17:07","20:33","22:09");
        gun_13     =    new Array("7/21/2013","04:03","05:48","13:16","17:07","20:32","22:08");
        gun_14     =    new Array("7/22/2013","04:04","05:48","13:16","17:07","20:31","22:06");
        gun_15     =    new Array("7/23/2013","04:05","05:49","13:16","17:07","20:30","22:05");
        gun_16     =    new Array("7/24/2013","04:06","05:50","13:16","17:06","20:30","22:04");
        gun_17     =    new Array("7/25/2013","04:08","05:51","13:16","17:06","20:29","22:03");
        gun_18     =    new Array("7/26/2013","04:09","05:52","13:16","17:06","20:28","22:02");
        gun_19     =    new Array("7/27/2013","04:10","05:53","13:16","17:06","20:27","22:00");
        gun_20     =    new Array("7/28/2013","04:12","05:53","13:16","17:06","20:26","21:59");
        gun_21     =    new Array("7/29/2013","04:13","05:54","13:16","17:05","20:25","21:58");
        gun_22     =    new Array("7/30/2013","04:14","05:55","13:16","17:05","20:24","21:56");
        gun_23     =    new Array("7/31/2013","04:16","05:56","13:16","17:05","20:23","21:55");
        gun_24     =    new Array("8/1/2013","04:17","05:57","13:16","17:05","20:22","21:54");
        gun_25     =    new Array("8/2/2013","04:18","05:58","13:16","17:04","20:21","21:52");
        gun_26     =    new Array("8/3/2013","04:20","05:59","13:16","17:04","20:20","21:51");
        gun_27     =    new Array("8/4/2013","04:21","06:00","13:16","17:04","20:19","21:49");
        gun_28     =    new Array("8/5/2013","04:22","06:00","13:15","17:03","20:18","21:48");
        gun_29     =    new Array("8/6/2013","04:24","06:01","13:15","17:03","20:17","21:46");
        gun_30     =    new Array("8/7/2013","04:25","06:02","13:15","17:02","20:16","21:45");
		
	break;
	case "van":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  VAN-
        gun_1      =    new Array("7/9/2013","02:54","04:44","12:19","16:11","19:42","21:21");
        gun_2      =    new Array("7/10/2013","02:55","04:44","12:19","16:11","19:41","21:21");
        gun_3      =    new Array("7/11/2013","02:56","04:45","12:19","16:11","19:41","21:20");
        gun_4      =    new Array("7/12/2013","02:57","04:46","12:19","16:11","19:41","21:19");
        gun_5      =    new Array("7/13/2013","02:58","04:46","12:19","16:11","19:40","21:18");
        gun_6      =    new Array("7/14/2013","03:00","04:47","12:19","16:11","19:40","21:18");
        gun_7      =    new Array("7/15/2013","03:01","04:48","12:19","16:11","19:39","21:17");
        gun_8      =    new Array("7/16/2013","03:02","04:48","12:20","16:11","19:39","21:16");
        gun_9      =    new Array("7/17/2013","03:03","04:49","12:20","16:11","19:38","21:15");
        gun_10     =    new Array("7/18/2013","03:04","04:50","12:20","16:11","19:37","21:14");
        gun_11     =    new Array("7/19/2013","03:05","04:51","12:20","16:11","19:37","21:13");
        gun_12     =    new Array("7/20/2013","03:06","04:51","12:20","16:11","19:36","21:12");
        gun_13     =    new Array("7/21/2013","03:08","04:52","12:20","16:11","19:35","21:11");
        gun_14     =    new Array("7/22/2013","03:09","04:53","12:20","16:10","19:35","21:10");
        gun_15     =    new Array("7/23/2013","03:10","04:54","12:20","16:10","19:34","21:09");
        gun_16     =    new Array("7/24/2013","03:11","04:55","12:20","16:10","19:33","21:07");
        gun_17     =    new Array("7/25/2013","03:13","04:55","12:20","16:10","19:32","21:06");
        gun_18     =    new Array("7/26/2013","03:14","04:56","12:20","16:10","19:32","21:05");
        gun_19     =    new Array("7/27/2013","03:15","04:57","12:20","16:10","19:31","21:04");
        gun_20     =    new Array("7/28/2013","03:17","04:58","12:20","16:09","19:30","21:02");
        gun_21     =    new Array("7/29/2013","03:18","04:59","12:20","16:09","19:29","21:01");
        gun_22     =    new Array("7/30/2013","03:19","05:00","12:20","16:09","19:28","21:00");
        gun_23     =    new Array("7/31/2013","03:21","05:01","12:20","16:09","19:27","20:58");
        gun_24     =    new Array("8/1/2013","03:22","05:01","12:20","16:08","19:26","20:57");
        gun_25     =    new Array("8/2/2013","03:23","05:02","12:20","16:08","19:25","20:56");
        gun_26     =    new Array("8/3/2013","03:25","05:03","12:20","16:08","19:24","20:54");
        gun_27     =    new Array("8/4/2013","03:26","05:04","12:20","16:07","19:23","20:53");
        gun_28     =    new Array("8/5/2013","03:27","05:05","12:20","16:07","19:22","20:51");
        gun_29     =    new Array("8/6/2013","03:28","05:06","12:19","16:07","19:21","20:50");
        gun_30     =    new Array("8/7/2013","03:30","05:07","12:19","16:06","19:20","20:48");
		
	break;
	case "yalova":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  YALOVA-
        gun_1      =    new Array("7/9/2013","03:37","05:33","13:15","17:12","20:45","22:31");
        gun_2      =    new Array("7/10/2013","03:38","05:34","13:15","17:12","20:44","22:30");
        gun_3      =    new Array("7/11/2013","03:39","05:35","13:16","17:12","20:44","22:30");
        gun_4      =    new Array("7/12/2013","03:40","05:36","13:16","17:12","20:43","22:29");
        gun_5      =    new Array("7/13/2013","03:41","05:36","13:16","17:12","20:43","22:28");
        gun_6      =    new Array("7/14/2013","03:42","05:37","13:16","17:12","20:42","22:27");
        gun_7      =    new Array("7/15/2013","03:44","05:38","13:16","17:12","20:42","22:26");
        gun_8      =    new Array("7/16/2013","03:45","05:39","13:16","17:11","20:41","22:25");
        gun_9      =    new Array("7/17/2013","03:46","05:39","13:16","17:11","20:41","22:24");
        gun_10     =    new Array("7/18/2013","03:48","05:40","13:16","17:11","20:40","22:23");
        gun_11     =    new Array("7/19/2013","03:49","05:41","13:16","17:11","20:39","22:22");
        gun_12     =    new Array("7/20/2013","03:50","05:42","13:16","17:11","20:39","22:20");
        gun_13     =    new Array("7/21/2013","03:52","05:43","13:16","17:11","20:38","22:19");
        gun_14     =    new Array("7/22/2013","03:53","05:44","13:16","17:11","20:37","22:18");
        gun_15     =    new Array("7/23/2013","03:54","05:45","13:17","17:11","20:36","22:17");
        gun_16     =    new Array("7/24/2013","03:56","05:45","13:17","17:10","20:35","22:15");
        gun_17     =    new Array("7/25/2013","03:57","05:46","13:17","17:10","20:35","22:14");
        gun_18     =    new Array("7/26/2013","03:59","05:47","13:17","17:10","20:34","22:13");
        gun_19     =    new Array("7/27/2013","04:00","05:48","13:17","17:10","20:33","22:11");
        gun_20     =    new Array("7/28/2013","04:02","05:49","13:17","17:09","20:32","22:10");
        gun_21     =    new Array("7/29/2013","04:03","05:50","13:16","17:09","20:31","22:08");
        gun_22     =    new Array("7/30/2013","04:05","05:51","13:16","17:09","20:30","22:07");
        gun_23     =    new Array("7/31/2013","04:06","05:52","13:16","17:09","20:29","22:05");
        gun_24     =    new Array("8/1/2013","04:08","05:53","13:16","17:08","20:28","22:04");
        gun_25     =    new Array("8/2/2013","04:09","05:54","13:16","17:08","20:27","22:02");
        gun_26     =    new Array("8/3/2013","04:11","05:55","13:16","17:07","20:25","22:00");
        gun_27     =    new Array("8/4/2013","04:12","05:56","13:16","17:07","20:24","21:59");
        gun_28     =    new Array("8/5/2013","04:14","05:57","13:16","17:07","20:23","21:57");
        gun_29     =    new Array("8/6/2013","04:15","05:58","13:16","17:06","20:22","21:56");
        gun_30     =    new Array("8/7/2013","04:17","05:59","13:16","17:06","20:21","21:54");
		
	break;
	case "icel":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi ICEL-
        gun_1      =    new Array("7/9/2013","03:39","05:23","12:54","16:42","20:12","21:47");
        gun_2      =    new Array("7/10/2013","03:40","05:24","12:54","16:42","20:12","21:46");
        gun_3      =    new Array("7/11/2013","03:41","05:25","12:54","16:42","20:11","21:46");
        gun_4      =    new Array("7/12/2013","03:42","05:25","12:54","16:42","20:11","21:45");
        gun_5      =    new Array("7/13/2013","03:43","05:26","12:54","16:42","20:10","21:44");
        gun_6      =    new Array("7/14/2013","03:44","05:27","12:54","16:42","20:10","21:44");
        gun_7      =    new Array("7/15/2013","03:45","05:27","12:55","16:43","20:10","21:43");
        gun_8      =    new Array("7/16/2013","03:46","05:28","12:55","16:43","20:09","21:42");
        gun_9      =    new Array("7/17/2013","03:47","05:29","12:55","16:43","20:08","21:41");
        gun_10     =    new Array("7/18/2013","03:48","05:29","12:55","16:43","20:08","21:40");
        gun_11     =    new Array("7/19/2013","03:49","05:30","12:55","16:42","20:07","21:39");
        gun_12     =    new Array("7/20/2013","03:50","05:31","12:55","16:42","20:07","21:38");
        gun_13     =    new Array("7/21/2013","03:52","05:32","12:55","16:42","20:06","21:37");
        gun_14     =    new Array("7/22/2013","03:53","05:32","12:55","16:42","20:05","21:36");
        gun_15     =    new Array("7/23/2013","03:54","05:33","12:55","16:42","20:05","21:35");
        gun_16     =    new Array("7/24/2013","03:55","05:34","12:55","16:42","20:04","21:34");
        gun_17     =    new Array("7/25/2013","03:56","05:35","12:55","16:42","20:03","21:33");
        gun_18     =    new Array("7/26/2013","03:57","05:35","12:55","16:42","20:02","21:32");
        gun_19     =    new Array("7/27/2013","03:58","05:36","12:55","16:42","20:02","21:31");
        gun_20     =    new Array("7/28/2013","04:00","05:37","12:55","16:42","20:01","21:30");
        gun_21     =    new Array("7/29/2013","04:01","05:38","12:55","16:41","20:00","21:29");
        gun_22     =    new Array("7/30/2013","04:02","05:39","12:55","16:41","19:59","21:27");
        gun_23     =    new Array("7/31/2013","04:03","05:39","12:55","16:41","19:58","21:26");
        gun_24     =    new Array("8/1/2013","04:04","05:40","12:55","16:41","19:57","21:25");
        gun_25     =    new Array("8/2/2013","04:06","05:41","12:55","16:40","19:56","21:23");
        gun_26     =    new Array("8/3/2013","04:07","05:42","12:55","16:40","19:55","21:22");
        gun_27     =    new Array("8/4/2013","04:08","05:43","12:55","16:40","19:54","21:21");
        gun_28     =    new Array("8/5/2013","04:09","05:43","12:55","16:40","19:53","21:19");
        gun_29     =    new Array("8/6/2013","04:11","05:44","12:54","16:39","19:52","21:18");
        gun_30     =    new Array("8/7/2013","04:12","05:45","12:54","16:39","19:51","21:17");
		
	break;
	case "yozgat":
		 // Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  YOZGAT-
        gun_1      =    new Array("7/9/2013","03:20","05:14","12:53","16:48","20:20","22:04");
        gun_2      =    new Array("7/10/2013","03:21","05:15","12:53","16:48","20:20","22:03");
        gun_3      =    new Array("7/11/2013","03:22","05:15","12:53","16:48","20:19","22:02");
        gun_4      =    new Array("7/12/2013","03:23","05:16","12:53","16:48","20:19","22:01");
        gun_5      =    new Array("7/13/2013","03:25","05:17","12:54","16:48","20:18","22:00");
        gun_6      =    new Array("7/14/2013","03:26","05:17","12:54","16:48","20:18","22:00");
        gun_7      =    new Array("7/15/2013","03:27","05:18","12:54","16:48","20:17","21:59");
        gun_8      =    new Array("7/16/2013","03:28","05:19","12:54","16:48","20:17","21:58");
        gun_9      =    new Array("7/17/2013","03:29","05:20","12:54","16:48","20:16","21:57");
        gun_10     =    new Array("7/18/2013","03:31","05:21","12:54","16:48","20:15","21:56");
        gun_11     =    new Array("7/19/2013","03:32","05:21","12:54","16:48","20:15","21:54");
        gun_12     =    new Array("7/20/2013","03:33","05:22","12:54","16:47","20:14","21:53");
        gun_13     =    new Array("7/21/2013","03:35","05:23","12:54","16:47","20:13","21:52");
        gun_14     =    new Array("7/22/2013","03:36","05:24","12:54","16:47","20:13","21:51");
        gun_15     =    new Array("7/23/2013","03:37","05:25","12:54","16:47","20:12","21:50");
        gun_16     =    new Array("7/24/2013","03:39","05:26","12:54","16:47","20:11","21:48");
        gun_17     =    new Array("7/25/2013","03:40","05:26","12:54","16:47","20:10","21:47");
        gun_18     =    new Array("7/26/2013","03:41","05:27","12:54","16:46","20:09","21:46");
        gun_19     =    new Array("7/27/2013","03:43","05:28","12:54","16:46","20:08","21:45");
        gun_20     =    new Array("7/28/2013","03:44","05:29","12:54","16:46","20:07","21:43");
        gun_21     =    new Array("7/29/2013","03:46","05:30","12:54","16:46","20:06","21:42");
        gun_22     =    new Array("7/30/2013","03:47","05:31","12:54","16:45","20:05","21:40");
        gun_23     =    new Array("7/31/2013","03:48","05:32","12:54","16:45","20:04","21:39");
        gun_24     =    new Array("8/1/2013","03:50","05:33","12:54","16:45","20:03","21:37");
        gun_25     =    new Array("8/2/2013","03:51","05:34","12:54","16:44","20:02","21:36");
        gun_26     =    new Array("8/3/2013","03:53","05:35","12:54","16:44","20:01","21:34");
        gun_27     =    new Array("8/4/2013","03:54","05:35","12:54","16:44","20:00","21:33");
        gun_28     =    new Array("8/5/2013","03:56","05:36","12:54","16:43","19:59","21:31");
        gun_29     =    new Array("8/6/2013","03:57","05:37","12:54","16:43","19:58","21:30");
        gun_30     =    new Array("8/7/2013","03:58","05:38","12:54","16:42","19:57","21:28");
		
	break;
	case "zonguldak":
		// Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi ZONGULDAK-
        gun_1      =    new Array("7/9/2013","03:21","05:21","13:05","17:03","20:37","22:27");
        gun_2      =    new Array("7/10/2013","03:22","05:22","13:05","17:03","20:37","22:26");
        gun_3      =    new Array("7/11/2013","03:23","05:22","13:05","17:03","20:36","22:25");
        gun_4      =    new Array("7/12/2013","03:24","05:23","13:06","17:03","20:36","22:24");
        gun_5      =    new Array("7/13/2013","03:25","05:24","13:06","17:03","20:35","22:23");
        gun_6      =    new Array("7/14/2013","03:27","05:25","13:06","17:03","20:35","22:22");
        gun_7      =    new Array("7/15/2013","03:28","05:25","13:06","17:03","20:34","22:21");
        gun_8      =    new Array("7/16/2013","03:29","05:26","13:06","17:03","20:34","22:20");
        gun_9      =    new Array("7/17/2013","03:31","05:27","13:06","17:03","20:33","22:19");
        gun_10     =    new Array("7/18/2013","03:32","05:28","13:06","17:03","20:32","22:18");
        gun_11     =    new Array("7/19/2013","03:34","05:29","13:06","17:03","20:32","22:16");
        gun_12     =    new Array("7/20/2013","03:35","05:30","13:06","17:02","20:31","22:15");
        gun_13     =    new Array("7/21/2013","03:36","05:30","13:06","17:02","20:30","22:14");
        gun_14     =    new Array("7/22/2013","03:38","05:31","13:06","17:02","20:29","22:13");
        gun_15     =    new Array("7/23/2013","03:39","05:32","13:06","17:02","20:28","22:11");
        gun_16     =    new Array("7/24/2013","03:41","05:33","13:06","17:02","20:28","22:10");
        gun_17     =    new Array("7/25/2013","03:42","05:34","13:06","17:01","20:27","22:08");
        gun_18     =    new Array("7/26/2013","03:44","05:35","13:06","17:01","20:26","22:07");
        gun_19     =    new Array("7/27/2013","03:46","05:36","13:06","17:01","20:25","22:05");
        gun_20     =    new Array("7/28/2013","03:47","05:37","13:06","17:01","20:24","22:04");
        gun_21     =    new Array("7/29/2013","03:49","05:38","13:06","17:00","20:23","22:02");
        gun_22     =    new Array("7/30/2013","03:50","05:39","13:06","17:00","20:22","22:01");
        gun_23     =    new Array("7/31/2013","03:52","05:40","13:06","17:00","20:21","21:59");
        gun_24     =    new Array("8/1/2013","03:53","05:41","13:06","16:59","20:20","21:58");
        gun_25     =    new Array("8/2/2013","03:55","05:42","13:06","16:59","20:18","21:56");
        gun_26     =    new Array("8/3/2013","03:56","05:43","13:06","16:58","20:17","21:54");
        gun_27     =    new Array("8/4/2013","03:58","05:44","13:06","16:58","20:16","21:53");
        gun_28     =    new Array("8/5/2013","04:00","05:45","13:06","16:58","20:15","21:51");
        gun_29     =    new Array("8/6/2013","04:01","05:46","13:06","16:57","20:14","21:49");
        gun_30     =    new Array("8/7/2013","04:03","05:47","13:06","16:57","20:12","21:47");		
			
		break;
	}
}

var gunun_sozu = new Array();
gunun_sozu[0] = "Bizim orucumuzla ehl-i kitabın orucu arasında hudut, sahur yemeğidir.<br>(Müslim, 6, 60)";
gunun_sozu[1] = "Ramazan'da orucunu tutup da Şevval'den de altı gün tutan kimse bütün sene oruç tutmuş gibidir.<br>(R. Salihin, 1259)";
gunun_sozu[2] = "İslam beş esas üzerine bina edilmiştir: Allah'tan başka ilah olmadığına ve Muhammed'in O'nun kulu ve elçisi olduguna şehadet etmek, namaz kılmak, oruç tutmak, Kabe'ye haccetmek, Ramazan orucu tutmak.<br>(Tirmizi, İman 3,(2612)";
gunun_sozu[3] = "Bir kadın Resulullah (sav)'a gelerek: 'Ben haccetmek için hazırlık yapmıştım. Bana (bir mani) arz oldu ne yapayım?' Efendimiz, 'Ramazan'da umre yap, zira o ayda umre tıpkı hacc gibidir' buyurdu.<br>(Ebu Davud, Hacc 79, Tirmizi, Hacc 95)";
gunun_sozu[4] = "Ramazan ayı girdiği zaman cennetin kapıları açılır, cehennemin kapıları kapanır ve şeytanlar da zincire vurulur.<br>(Müslim, Sıyam 2, (1079)";
gunun_sozu[5] = "Kim Ramazan orucunu tutar ve ona Şevval ayından altı gün ilave ederse, sanki yıl orucu tutmuş olur.<br>(Tirmizi, Savm 53, (759); Ebu Davud, Savm 58, (2432)";
gunun_sozu[6] = "Beş vakit namaz, bir cuma namazı diğer cuma namazına, bir Ramazan diğer Ramazana hep kefarettirler. Büyük günah irtikab edilmedikçe aralarındaki   günahları affettirirler.<br>(Müslim, Taharet 14, (223))";
gunun_sozu[7] = "Ramazan girip çıktığı halde günahları affedilmemiş olan insanın burnu sürtülsün. Anne ve babasına veya bunlardan birine yetişip de onlar sayesinde cennete girmeyen kimsenin de burnu sürtülsün. Ben yanında zikredildigim zaman bana salat okumayan kimsesinin de burnu sürtülsün.<br>(Tirmizi, Daavat 110, (3539))";
gunun_sozu[8] = "İslam beş esas üzerine bina edilmiştir: Allah'tan başka ilah olmadığına ve Muhammed'in O'nun kulu ve elçisi olduguna şehadet etmek, namaz kılmak, oruç tutmak, Kabe'ye haccetmek, Ramazan orucu tutmak.(Buhari, İman 1; Müslim, İman 22 )";
gunun_sozu[9] = "Oruç perdedir. Biriniz birgün oruç tutacak olursa kötü söz sarfetmesin, bağırıp çağırmasın. Birisi kendisine yakışıksız laf edecek veya kavga edecek olursa 'ben oruçluyum!' desin (ve ona bulaşmasın)<br>(Müslim, Sıyam 164, (1161))";
gunun_sozu[10] = "Kim Allah Teala yolunda bir gün oruç tutsa, Allah onunla ateş arasına, genişliği sema ile arz arasını tutan bir hendek kılar.<br>(Tirmizi, Cihad 3, (1624))";
gunun_sozu[11] = "Cennette Reyyan denilen bir kapı vardır. Oradan sadece oruçlular girer. Oruçlular girdiler mi artık kapanır, kimse oradan giremez.' (Tirmizi'nin rivayetinde şu ziyade var: 'Oraya kim girerse ebediyyen susamaz.)<br>(Tirmizi, Savm 5)";
gunun_sozu[12] = "Kim bir oruçluya iftar ettirirse, kendisine onun sevabı kadar sevap yazılır. Üstelik bu sebeple oruçlunun sevabından hiçbir eksilme olmaz.<br>(Tirmizi, Savm 82, (807); İbnu Mace, Sıyam 45, (1746))";
gunun_sozu[13] = "Kim oruçlu olduğu halde unutur ve yerse veya içerse orucunu tamamlasın. Çünkü ona Allah yedirip içirmiştir.<br>(Müslim, Sıyam 171, (1155); Tirmizi, Savm 26, (721))";
gunun_sozu[14] = "Zahmetsiz ganimet kışta tutulan oruçtur.<br>(Tirmizi, Savm 74, (797))";
gunun_sozu[15] = "Ramazan ayında, hasta veya ruhsat sahibi olmaksızın kim bir günlük orucunu yerse, bütün zaman boyu oruç tutsa bu orucu kaza edemez.<br>(Buhari, Savm 29; Tirmizi, Savm 27, (723))";
gunun_sozu[16] = "Kim Allah Teala yolunda bir gün oruç tutsa, Allah onunla ateş arasına, genişliği sema ile arz arasını tutan bir hendek kılar.<br>(Tirmizi, Cihâd 3, (1624))";
gunun_sozu[17] = "Resulullah (sav) vefat edinceye kadar Ramazanın son on gününde i'tikafa girer ve şöyle buyururdu: 'Kadir gecesini Ramazanın son on gününde   arayın'.<br>(Müslim, İ'tikaf 5, (1172))";
gunun_sozu[18] = "Resulullah (sav) 'Kadir gecesi Ramazan'ın neresinde?” diye sorulmuştu. O, “Ramazanın tamamında!' diye gunun_sozu verdi.<br>(Ebu Davud, Salat, 824, (1387))";
gunun_sozu[19] = "Kadir gecesini, kim sevabına inanıp onu kazanmak ümidiyle ihya ederse, geçmiş günahları affedilir.<br>(Müslim, Müsafirin 174, (769); Ebu Davud, Salat 318, (1371); Tirmizi, Savm 83)";
gunun_sozu[20] = "Kişinin fitnesi ehlinde, malında, çocuğunda, nefsinde ve komşusundadır. Oruç, namaz, sadaka, emr-i bi'l-maruf ve nehy-i ani'l-münker bu fitneye  kefaret olur!<br>(Müslim, Fiten 17, (144), Tirmizi, Fiten 71, (2259))";
gunun_sozu[21] = "Her şeyin bir baharı vardır, Kur’an’ın baharı da Ramazan ayıdır.<br>İmam Bakır (a.s)";
gunun_sozu[22] = "Ramazanda Allah'i zikreden magfiret olunur. Ve o ayda Allah'dan dilekte bulunan kimse de mahrum edilmez.<br>Ravi: Hz. Cābir (r.a.)";
gunun_sozu[23] = "Allah (z.c.hz.) Ramazanin her gecesi iftar zamaninda bir milyon kisiyi Cehennemden azad eder. Cuma'nin her saatinde de, hepsi cehennemlik olan yine bir milyon kisiyi Cehennemden azad eder.<br>Ravi: Hz. Ibni Abbas (r.anhuma)";
gunun_sozu[24] = "Bir kimse hac ve umre etse de ayni sene icinde olse, Cennete girer. Kim Ramazan orucunu tutsa sonra olse Cennete girer.<br>Ravi: Hz. Ebū Said (r.a.)";
gunun_sozu[25] = "Bir kimse Ramazan da inanarak ve sevabini umarak Kiyamul-leyl (teravih namazi) kilsa gecmis gunahi magfiret olur.<br>Ravi: Hz. Ebū Hureyre (r.a.)";
gunun_sozu[26] = "'Ramazan' demeyin. Zira Ramazan Aziz ve Celil olan Allah'in isimlerinden bir isimdir. Lakin “Ramazan ayi” deyin.<br>Ravi: Hz. Ebū Hureyre (r.a.)";
gunun_sozu[27] = "Recep ayı ekini ekme, Şaban ayı sulama, Ramazan ayı ise hasat zamanıdır.<br>Ebu Bekir El-Verrak";
gunun_sozu[28] = "Oruç tutanın uykusu ibadet, susması tesbih, ameli kabul ve duası müstecab olur.<br>Resulullah (s.a.a)";
gunun_sozu[29] = "En iyi (faziletli) cihad sıcak havada oruç tutmaktır.<br>İmam Sadık (a.s)";
gunun_sozu[30] = "Üç amel Allah’ın rahmetindendir: Gece namazı kılmak, mu’min kardeşin halini sormak ve oruç tutmak.<br>Resulullah (s.a.a)";
gunun_sozu[31] = "Allah-u Teala melekleri oruç tutanlara dua etmekle görevlendirmiştir.<br>Resulullah (s.a.a)";
gunun_sozu[32] = "Oruç tutanın uykusu ibadet, susması tesbih, ameli kabul ve duası müstecab olur.<br>Resulullah (s.a.a)";
gunun_sozu[33] = "Oruç tutanın duası reddedilmez<br>Resulullah (s.a.a)";
gunun_sozu[34] = "Cennetin Reyyan adlı bir kapısı vardır; o kapıdan ancak oruç tutanlar girecektir.<br>Resulullah (s.a.a)";
gunun_sozu[35] = "Oruç, cehennem ateşinden koruyan bir siperdir (kalkandır).<br>Resulullah (s.a.a)";
gunun_sozu[36] = "Oruç tutanın duası iftar vakti kabul olur.<br>İmam Kazım (a.s)";
gunun_sozu[37] = "Oruç tutan kimsenin iki mutluluğu vardır; iftar vakti ve Kıyamet günü.<br>Resulullah (s.a.a)";
gunun_sozu[38] = "Her şeyin bir zekatı vardır, bedenin zekatı da oruçtur.<br>İmam Ali (a.s)";
gunun_sozu[39] = "Allah, orucu ihlası sağlamlaştırmak için farz kılmıştır.<br>Hz. Fatıma (s.a.)";
gunun_sozu[40] = "Bu ay Ramazan diye adlandırıldı; çünkü bu ay günahları temizler.<br>Resulullah (s.a.a)";
gunun_sozu[41] = "Nefsimi elinde tutan Allah’a and olsun ki oruç tutan kimsenin ağzının kokusu Allah’ın yanında misk kokusundan daha iyidir.<br>Resulullah (s.a.a)";
gunun_sozu[42] = "Kim ramazan ayını oruç tutar ve haramlardan sakınırsa, Allah onun geçmiş günahlarını affeder.<br>Resulullah (s.a.a)";
gunun_sozu[43] = "En iyi (faziletli) cihad sıcak havada oruç tutmaktır.<br>İmam Sadık (a.s)";
gunun_sozu[44] = "Gökyüzünün kapıları Ramazan ayının ilk gecesi açılır ve son gününün gecesine kadar kapanmaz.<br>Resulullah (s.a.a )";
gunun_sozu[45] = "Cennet, her yıl ramazan ayının gelişiyle süslenip ziynetlenir.<br>Resulullah (s.a.a)";
gunun_sozu[46] = "İnsanın başına bir bela (musibet) geldiği zaman oruç tutsun.<br>İmam Sadık (a.s)";
gunun_sozu[47] = "Selam sana olsun ey Ramazan ayı ki, hiç bir ay  seninle fazilette yarışamaz.<br>İmam Zeynelabidin (a.s)";
gunun_sozu[48] = "Cennet dört kişinin özlemini çeker,biri de ramazan ayında oruç tutandır.<br>Resulullah (s.a.a)";
gunun_sozu[49] = "Ramazan ayı bütün ayların, Kadir gecesi ise bütün gecelerin efendisidir.<br>Resulullah (s.a.a)";
gunun_sozu[50] = "Kim Ramazan ayını oruçlu geçirir ve haramlardan ve iftiradan sakınırsa, Allah ondan razı olur ve cenneti ona farz kılar.<br>Resulullah (s.a.a)";
gunun_sozu[51] = "Ramazan ayı öyle bir aydır ki, başlangıcı rahmet, ortası mağfiret ve sonu Cehennem ateşinden kurtulmadır.<br>Resulullah (s.a.a)";
gunun_sozu[52] = "Oruç, kul ile Yaradanı arasında bir ibadettir, Allah’tan başka kimse onu bilemez.<br>İmam Ali (a.s)";
gunun_sozu[53] = "Oruç sabrın yarısıdır.<br>Resulullah ( s.a.a.)";
gunun_sozu[54] = "Oruç tut; çünkü oruç gibi bir ibadet yoktur.<br>Resulullah (s.a.a)";
gunun_sozu[55] = "İslam beş temel üzerine kurulmuştur; namaz, zekat, hacc, oruç, velayet.<br>İmam Ali (a.s)";
gunun_sozu[56] = "Bir veya iki gün öncesinden oruç tutmak suretiyle sakın Ramazanın önüne geçmeyiniz. Bir kimsenin âdet edindiği bir orucu tutması bundan müstesnadır. Böyle bir kimse o orucunu varsın tutsun' buyurmuştur.<br>Resulüllah (a.s.)";
gunun_sozu[57] = "Allah Resulü (a.s.): 'Bilâl ezanı gece okuyor. Siz, İbn. Ümmü Mektum'un ezanını işitinceye kadar yiyip içiniz' buyurmuştur.<br>(Sahih-i Müslim-1827)";
gunun_sozu[58] = "Resulüllah (a.s.): 'İnsanlar iftar yapmakta (sünnet vechile) acele davrandıkları müddetçe daima hayır üzeredirler' buyurmuştur.<br>(Sahih-i Müslim-1838)";
gunun_sozu[59] = "Kim Allah Teala yolunda bir gün oruç tutsa, Allah onunla ateş arasına, genişliği sema ile arz arasını tutan bir hendek kılar.<br>(Tirmizi, Cihad 3, (1624)";
gunun_sozu[60] = "Her şeyin bir zekatı vardır, bedenin zekatı da oruçtur.<br>İmam Ali (a.s)";

	