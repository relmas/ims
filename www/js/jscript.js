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
var ramazan_baslama_tarihi= new Date("6/18/2015" +" "+"00:00:00");
var ramazan_bitis_tarihi= new Date("8/16/2015" +" "+"00:00:00");
var sayac_ne_sayiyor;
var gelen_sehir;	
var gun_1; var gun_2; var gun_3; var gun_4; var gun_5; var gun_6; var gun_7; var gun_8; var gun_9; var gun_10;
var gun_11; var gun_12; var gun_13; var gun_14; var gun_15; var gun_16; var gun_17; var gun_18; var gun_19; var gun_20;
var gun_21; var gun_22; var gun_23; var gun_24; var gun_25; var gun_26; var gun_27; var gun_28; var gun_29;
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
			sayac_ne_sayiyor= "06.18.2015";
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
	case "6/18/2015":
		document.getElementById('title_imsak').innerHTML = gun_1[1];
		document.getElementById('title_ogle').innerHTML  = gun_1[4];
		document.getElementById('title_ikindi').innerHTML= gun_1[5];
		document.getElementById('title_aksam').innerHTML = gun_1[6];
		document.getElementById('title_yatsi').innerHTML = gun_1[7];
		imsak=gun_1[1];
		iftar=gun_1[6];
		bi_sonraki_imsak="6/19/2015" +" "+ gun_2[1];
		imsak_aksam=gun_2[1];
		gunun_sozu_bir=gunun_sozu[1];
		gunun_sozu_iki=gunun_sozu[2];


	break;
	case "6/19/2015":  
		document.getElementById('title_imsak').innerHTML = gun_2[1];
		document.getElementById('title_ogle').innerHTML  = gun_2[4];
		document.getElementById('title_ikindi').innerHTML= gun_2[5];
		document.getElementById('title_aksam').innerHTML = gun_2[6];
		document.getElementById('title_yatsi').innerHTML = gun_2[7];
		imsak=gun_2[1];
		iftar=gun_2[6];
		bi_sonraki_imsak="6/20/2015" + " " + gun_3[1];
		imsak_aksam=gun_3[1];
		gunun_sozu_bir=gunun_sozu[3];
		gunun_sozu_iki=gunun_sozu[4];


	break;
	case "6/20/2015":  
		document.getElementById('title_imsak').innerHTML = gun_3[1];
		document.getElementById('title_ogle').innerHTML  = gun_3[4];
		document.getElementById('title_ikindi').innerHTML= gun_3[5];
		document.getElementById('title_aksam').innerHTML = gun_3[6];
		document.getElementById('title_yatsi').innerHTML = gun_3[7];
		imsak=gun_3[1];
		iftar=gun_3[6];
		bi_sonraki_imsak="6/21/2015" + " " + gun_4[1];
		imsak_aksam=gun_4[1];
		gunun_sozu_bir=gunun_sozu[5];
		gunun_sozu_iki=gunun_sozu[6];


	break;
	case "6/21/2015":  
		document.getElementById('title_imsak').innerHTML = gun_4[1];
		document.getElementById('title_ogle').innerHTML  = gun_4[4];
		document.getElementById('title_ikindi').innerHTML= gun_4[5];
		document.getElementById('title_aksam').innerHTML = gun_4[6];
		document.getElementById('title_yatsi').innerHTML = gun_4[7];
		imsak=gun_4[1];
		iftar=gun_4[6];
		bi_sonraki_imsak="6/22/2015" + " " + gun_5[1];
		imsak_aksam=gun_5[1];
		gunun_sozu_bir=gunun_sozu[7];
		gunun_sozu_iki=gunun_sozu[8];


	break;
	case "6/22/2015":  
		document.getElementById('title_imsak').innerHTML = gun_5[1];
		document.getElementById('title_ogle').innerHTML  = gun_5[4];
		document.getElementById('title_ikindi').innerHTML= gun_5[5];
		document.getElementById('title_aksam').innerHTML = gun_5[6];
		document.getElementById('title_yatsi').innerHTML = gun_5[7];	
		imsak=gun_5[1];
		iftar=gun_5[6];
		bi_sonraki_imsak="6/23/2015" + " " + gun_6[1];
		imsak_aksam=gun_6[1];
		gunun_sozu_bir=gunun_sozu[9];
		gunun_sozu_iki=gunun_sozu[10];
	case "6/23/2015":  
		document.getElementById('title_imsak').innerHTML = gun_6[1];
		document.getElementById('title_ogle').innerHTML  = gun_6[4];
		document.getElementById('title_ikindi').innerHTML= gun_6[5];
		document.getElementById('title_aksam').innerHTML = gun_6[6];
		document.getElementById('title_yatsi').innerHTML = gun_6[7];
		imsak=gun_6[1];
		iftar=gun_6[6];
		bi_sonraki_imsak="6/24/2015" + " " + gun_7[1];
		imsak_aksam=gun_7[1];
		gunun_sozu_bir=gunun_sozu[11];
		gunun_sozu_iki=gunun_sozu[12];


	break;
	case "6/24/2015": 
		document.getElementById('title_imsak').innerHTML = gun_7[1];
		document.getElementById('title_ogle').innerHTML  = gun_7[4];
		document.getElementById('title_ikindi').innerHTML= gun_7[5];
		document.getElementById('title_aksam').innerHTML = gun_7[6];
		document.getElementById('title_yatsi').innerHTML = gun_7[7];
		imsak=gun_7[1];
		iftar=gun_7[6];
		bi_sonraki_imsak="6/25/2015" + " " + gun_8[1];
		imsak_aksam=gun_8[1];
		gunun_sozu_bir=gunun_sozu[13];
		gunun_sozu_iki=gunun_sozu[14];


	break;
	case "6/25/2015": 
		document.getElementById('title_imsak').innerHTML = gun_8[1];
		document.getElementById('title_ogle').innerHTML  = gun_8[4];
		document.getElementById('title_ikindi').innerHTML= gun_8[5];
		document.getElementById('title_aksam').innerHTML = gun_8[6];
		document.getElementById('title_yatsi').innerHTML = gun_8[7];
		imsak=gun_8[1];
		iftar=gun_8[6];
		bi_sonraki_imsak="6/26/2015" + " " + gun_9[1];
		imsak_aksam=gun_9[1];
		gunun_sozu_bir=gunun_sozu[15];
		gunun_sozu_iki=gunun_sozu[16];


	break;
	case "6/26/2015":  
		document.getElementById('title_imsak').innerHTML = gun_9[1];
		document.getElementById('title_ogle').innerHTML  = gun_9[4];
		document.getElementById('title_ikindi').innerHTML= gun_9[5];
		document.getElementById('title_aksam').innerHTML = gun_9[6];
		document.getElementById('title_yatsi').innerHTML = gun_9[7];
		imsak=gun_9[1];
		iftar=gun_9[6];
		bi_sonraki_imsak="6/27/2015" + " " +gun_10[1];
		imsak_aksam=gun_10[1];
		gunun_sozu_bir=gunun_sozu[17];
		gunun_sozu_iki=gunun_sozu[18];


	break;
	case "6/27/2015":  
		document.getElementById('title_imsak').innerHTML = gun_10[1];
		document.getElementById('title_ogle').innerHTML  = gun_10[4];
		document.getElementById('title_ikindi').innerHTML= gun_10[5];
		document.getElementById('title_aksam').innerHTML = gun_10[6];
		document.getElementById('title_yatsi').innerHTML = gun_10[7];
		imsak=gun_10[1];
		iftar=gun_10[6];
		bi_sonraki_imsak="6/28/2015" + " " + gun_11[1];
		imsak_aksam=gun_11[1];
		gunun_sozu_bir=gunun_sozu[19];
		gunun_sozu_iki=gunun_sozu[20];


	break;
	case "6/28/2015": 
		document.getElementById('title_imsak').innerHTML = gun_11[1];
		document.getElementById('title_ogle').innerHTML  = gun_11[4];
		document.getElementById('title_ikindi').innerHTML= gun_11[5];
		document.getElementById('title_aksam').innerHTML = gun_11[6];
		document.getElementById('title_yatsi').innerHTML = gun_11[7];
		imsak=gun_11[1];
		iftar=gun_11[6];
		bi_sonraki_imsak="6/29/2015" + " " + gun_12[1];
		imsak_aksam=gun_12[1];
		gunun_sozu_bir=gunun_sozu[21];
		gunun_sozu_iki=gunun_sozu[22];


	break;
	case "6/29/2015":
		document.getElementById('title_imsak').innerHTML = gun_12[1];
		document.getElementById('title_ogle').innerHTML  = gun_12[4];
		document.getElementById('title_ikindi').innerHTML= gun_12[5];
		document.getElementById('title_aksam').innerHTML = gun_12[6];
		document.getElementById('title_yatsi').innerHTML = gun_12[7];
		imsak=gun_12[1];
		iftar=gun_12[6];
		bi_sonraki_imsak="6/30/2015" + " " + gun_13[1];
		imsak_aksam=gun_13[1];
		gunun_sozu_bir=gunun_sozu[23];
		gunun_sozu_iki=gunun_sozu[24];


	break;
	case "6/30/2015": 
		document.getElementById('title_imsak').innerHTML = gun_13[1];
		document.getElementById('title_ogle').innerHTML  = gun_13[4];
		document.getElementById('title_ikindi').innerHTML= gun_13[5];
		document.getElementById('title_aksam').innerHTML = gun_13[6];
		document.getElementById('title_yatsi').innerHTML = gun_13[7];
		imsak=gun_13[1];
		iftar=gun_13[6];
		bi_sonraki_imsak="7/1/2015" + " " + gun_14[1];
		imsak_aksam=gun_14[1];
		gunun_sozu_bir=gunun_sozu[25];
		gunun_sozu_iki=gunun_sozu[26];


	break;
	case "7/1/2015": 
		document.getElementById('title_imsak').innerHTML = gun_14[1];
		document.getElementById('title_ogle').innerHTML  = gun_14[4];
		document.getElementById('title_ikindi').innerHTML= gun_14[5];
		document.getElementById('title_aksam').innerHTML = gun_14[6];
		document.getElementById('title_yatsi').innerHTML = gun_14[7];
		imsak=gun_14[1];
		iftar=gun_14[6];
		bi_sonraki_imsak="7/2/2015" + " " + gun_15[1];
		imsak_aksam=gun_15[1];
		gunun_sozu_bir=gunun_sozu[27];
		gunun_sozu_iki=gunun_sozu[28];


	break;
	case "7/2/2015": 
		document.getElementById('title_imsak').innerHTML = gun_15[1];
		document.getElementById('title_ogle').innerHTML  = gun_15[4];
		document.getElementById('title_ikindi').innerHTML= gun_15[5];
		document.getElementById('title_aksam').innerHTML = gun_15[6];
		document.getElementById('title_yatsi').innerHTML = gun_15[7];
		imsak=gun_15[1];
		iftar=gun_15[6];
		bi_sonraki_imsak="7/3/2015" + " " + gun_16[1];
		imsak_aksam= gun_16[1];
		gunun_sozu_bir=gunun_sozu[29];
		gunun_sozu_iki=gunun_sozu[30];


	break;
	case "7/3/2015": 
		document.getElementById('title_imsak').innerHTML = gun_16[1];
		document.getElementById('title_ogle').innerHTML  = gun_16[4];
		document.getElementById('title_ikindi').innerHTML= gun_16[5];
		document.getElementById('title_aksam').innerHTML = gun_16[6];
		document.getElementById('title_yatsi').innerHTML = gun_16[7];
		imsak=gun_16[1];
		iftar=gun_16[6];
		bi_sonraki_imsak="7/4/2015" + " " + gun_17[1];
		imsak_aksam=gun_17[1];
		gunun_sozu_bir=gunun_sozu[31];
		gunun_sozu_iki=gunun_sozu[32];


	break;
	case "7/4/2015": 
		document.getElementById('title_imsak').innerHTML = gun_17[1];
		document.getElementById('title_ogle').innerHTML  = gun_17[4];
		document.getElementById('title_ikindi').innerHTML= gun_17[5];
		document.getElementById('title_aksam').innerHTML = gun_17[6];
		document.getElementById('title_yatsi').innerHTML = gun_17[7];
		imsak=gun_17[1];
		iftar=gun_17[6];
		bi_sonraki_imsak="7/5/2015" + " " + gun_18[1];
		imsak_aksam=gun_18[1];
		gunun_sozu_bir=gunun_sozu[33];
		gunun_sozu_iki=gunun_sozu[34];


	break;
	case "7/5/2015": 
		document.getElementById('title_imsak').innerHTML = gun_18[1];
		document.getElementById('title_ogle').innerHTML  = gun_18[4];
		document.getElementById('title_ikindi').innerHTML= gun_18[5];
		document.getElementById('title_aksam').innerHTML = gun_18[6];
		document.getElementById('title_yatsi').innerHTML = gun_18[7];	
		imsak=gun_18[1];
		iftar=gun_18[6];
		bi_sonraki_imsak="7/6/2015" + " " + gun_19[1];
		imsak_aksam=gun_19[1];
		gunun_sozu_bir=gunun_sozu[35];
		gunun_sozu_iki=gunun_sozu[36];


	break;
	case "7/6/2015":
		document.getElementById('title_imsak').innerHTML = gun_19[1];
		document.getElementById('title_ogle').innerHTML  = gun_19[4];
		document.getElementById('title_ikindi').innerHTML= gun_19[5];
		document.getElementById('title_aksam').innerHTML = gun_19[6];
		document.getElementById('title_yatsi').innerHTML = gun_19[7];
		imsak=gun_19[1];
		iftar=gun_19[6];
		bi_sonraki_imsak="7/7/2015" + " " + gun_20[1];
		imsak_aksam=gun_20[1];
		gunun_sozu_bir=gunun_sozu[37];
		gunun_sozu_iki=gunun_sozu[38];


	break;
	case "7/7/2015": 
		document.getElementById('title_imsak').innerHTML = gun_20[1];
		document.getElementById('title_ogle').innerHTML  = gun_20[4];
		document.getElementById('title_ikindi').innerHTML= gun_20[5];
		document.getElementById('title_aksam').innerHTML = gun_20[6];
		document.getElementById('title_yatsi').innerHTML = gun_20[7];
		imsak=gun_20[1];
		iftar=gun_20[6];
		bi_sonraki_imsak="7/8/2015" + " " + gun_21[1];
		imsak_aksam=gun_21[1];
		gunun_sozu_bir=gunun_sozu[39];
		gunun_sozu_iki=gunun_sozu[40];


	break;
	case "7/8/2015": 
		document.getElementById('title_imsak').innerHTML = gun_21[1];
		document.getElementById('title_ogle').innerHTML  = gun_21[4];
		document.getElementById('title_ikindi').innerHTML= gun_21[5];
		document.getElementById('title_aksam').innerHTML = gun_21[6];
		document.getElementById('title_yatsi').innerHTML = gun_21[7];	
		imsak=gun_21[1];
		iftar=gun_21[6];
		bi_sonraki_imsak="7/9/2015" + " " + gun_22[1];
		imsak_aksam=gun_22[1];
		gunun_sozu_bir=gunun_sozu[41];
		gunun_sozu_iki=gunun_sozu[42];


	break;
	case "7/9/2015":  
		document.getElementById('title_imsak').innerHTML = gun_22[1];
		document.getElementById('title_ogle').innerHTML  = gun_22[4];
		document.getElementById('title_ikindi').innerHTML= gun_22[5];
		document.getElementById('title_aksam').innerHTML = gun_22[6];
		document.getElementById('title_yatsi').innerHTML = gun_22[7];
		imsak=gun_22[1];
		iftar=gun_22[6];
		bi_sonraki_imsak="7/10/2015" + " " + gun_23[1];
		imsak_aksam=gun_23[1];
		gunun_sozu_bir=gunun_sozu[43];
		gunun_sozu_iki=gunun_sozu[44];


	break;
	case "7/10/2015": 
		document.getElementById('title_imsak').innerHTML = gun_23[1];
		document.getElementById('title_ogle').innerHTML  = gun_23[4];
		document.getElementById('title_ikindi').innerHTML= gun_23[5];
		document.getElementById('title_aksam').innerHTML = gun_23[6];
		document.getElementById('title_yatsi').innerHTML = gun_23[7];
		imsak=gun_23[1];
		iftar=gun_23[6];
		bi_sonraki_imsak="7/11/2015" + " " + gun_24[1];
		imsak_aksam=gun_24[1];
		gunun_sozu_bir=gunun_sozu[45];
		gunun_sozu_iki=gunun_sozu[46];


	break;
	case "7/11/2015":  
		document.getElementById('title_imsak').innerHTML = gun_24[1];
		document.getElementById('title_ogle').innerHTML  = gun_24[4];
		document.getElementById('title_ikindi').innerHTML= gun_24[5];
		document.getElementById('title_aksam').innerHTML = gun_24[6];
		document.getElementById('title_yatsi').innerHTML = gun_24[7];
		imsak=gun_24[1];
		iftar=gun_24[6];
		bi_sonraki_imsak="7/12/2015" + " " + gun_25[1];
		imsak_aksam=gun_25[1];
		gunun_sozu_bir=gunun_sozu[47];
		gunun_sozu_iki=gunun_sozu[48];


	break;
	case "7/12/2015":  
		document.getElementById('title_imsak').innerHTML = gun_25[1];
		document.getElementById('title_ogle').innerHTML  = gun_25[4];
		document.getElementById('title_ikindi').innerHTML= gun_25[5];
		document.getElementById('title_aksam').innerHTML = gun_25[6];
		document.getElementById('title_yatsi').innerHTML = gun_25[7];
		imsak=gun_25[1];
		iftar=gun_25[6];
		bi_sonraki_imsak="7/13/2015" + " " + gun_26[1];
		imsak_aksam= gun_26[1];
		gunun_sozu_bir=gunun_sozu[49];
		gunun_sozu_iki=gunun_sozu[50];


	break;
	case "7/13/2015": 
		document.getElementById('title_imsak').innerHTML = gun_26[1];
		document.getElementById('title_ogle').innerHTML  = gun_26[4];
		document.getElementById('title_ikindi').innerHTML= gun_26[5];
		document.getElementById('title_aksam').innerHTML = gun_26[6];
		document.getElementById('title_yatsi').innerHTML = gun_26[7];
		imsak=gun_26[1];
		iftar=gun_26[6];
		bi_sonraki_imsak="7/14/2015" + " " + gun_27[1];
		imsak_aksam=gun_27[1];
		gunun_sozu_bir=gunun_sozu[51];
		gunun_sozu_iki=gunun_sozu[52];


	break;
	case "7/14/2015": 
		document.getElementById('title_imsak').innerHTML = gun_27[1];
		document.getElementById('title_ogle').innerHTML  = gun_27[4];
		document.getElementById('title_ikindi').innerHTML= gun_27[5];
		document.getElementById('title_aksam').innerHTML = gun_27[6];
		document.getElementById('title_yatsi').innerHTML = gun_27[7];
		imsak=gun_27[1];
		iftar=gun_27[6];
		bi_sonraki_imsak="7/15/2015" + " " + gun_28[1];
		imsak_aksam=gun_28[1];
		gunun_sozu_bir=gunun_sozu[53];
		gunun_sozu_iki=gunun_sozu[54];


	break;
	case "7/15/2015": 
		document.getElementById('title_imsak').innerHTML = gun_28[1];
		document.getElementById('title_ogle').innerHTML  = gun_28[4];
		document.getElementById('title_ikindi').innerHTML= gun_28[5];
		document.getElementById('title_aksam').innerHTML = gun_28[6];
		document.getElementById('title_yatsi').innerHTML = gun_28[7];
		imsak=gun_28[1];
		iftar=gun_28[6];
		bi_sonraki_imsak="7/16/2015" + " " + gun_29[1];
		imsak_aksam=gun_29[1];
		gunun_sozu_bir=gunun_sozu[55];
		gunun_sozu_iki=gunun_sozu[56];


	break;
	case "7/16/2015": 
		document.getElementById('title_imsak').innerHTML = gun_29[1];
		document.getElementById('title_ogle').innerHTML  = gun_29[4];
		document.getElementById('title_ikindi').innerHTML= gun_29[5];
		document.getElementById('title_aksam').innerHTML = gun_29[6];
		document.getElementById('title_yatsi').innerHTML = gun_29[7];
		imsak=gun_29[1];
		iftar=gun_29[6];
		bi_sonraki_imsak="7/17/2015" + " " + gun_30[1];
		imsak_aksam=gun_30[1];
		gunun_sozu_bir=gunun_sozu[57];
		gunun_sozu_iki=gunun_sozu[58];
	break;
	case "7/17/2015": 
		document.getElementById('title_imsak').innerHTML = gun_30[1];
		document.getElementById('title_ogle').innerHTML  = gun_30[4];
		document.getElementById('title_ikindi').innerHTML= gun_30[5];
		document.getElementById('title_aksam').innerHTML = gun_30[6];
		document.getElementById('title_yatsi').innerHTML = gun_30[7];
		imsak=gun_30[1];
		iftar=gun_30[6];
		bi_sonraki_imsak="7/17/2015" + " " + "23:00:00";
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
		
		gun_1      =    new Array("6/18/2015","3:07","03:27","5:11","12:50","16:42","20:11","21:57");
        gun_2      =    new Array("6/19/2015","3:07","03:27","5:11","12:50","16:42","20:11","21:57");
        gun_3      =    new Array("6/20/2015","3:08","03:28","5:11","12:50","16:42","20:11","21:57");
        gun_4      =    new Array("6/21/2015","3:08","03:28","5:11","12:50","16:43","20:12","21:57");
        gun_5      =    new Array("6/22/2015","3:08","03:28","5:11","12:51","16:43","20:12","21:58");
        gun_6      =    new Array("6/23/2015","3:08","03:28","5:12","12:51","16:43","20:12","21:58");
        gun_7      =    new Array("6/24/2015","3:08","03:28","5:12","12:51","16:43","20:12","21:58");
        gun_8      =    new Array("6/25/2015","3:09","03:29","5:12","12:51","16:44","20:12","21:58");
        gun_9      =    new Array("6/26/2015","3:09","03:29","5:13","12:52","16:44","20:12","21:58");
        gun_10      =    new Array("6/27/2015","3:10","03:30","5:13","12:52","16:44","20:12","21:58");
        gun_11      =    new Array("6/28/2015","3:10","03:30","5:13","12:52","16:44","20:13","21:58");
        gun_12      =    new Array("6/29/2015","3:11","03:31","5:14","12:52","16:44","20:13","21:58");
        gun_13      =    new Array("6/30/2015","3:11","03:31","5:14","12:52","16:44","20:13","21:57");
        gun_14      =    new Array("7/1/2015"," 3:12","03:32","5:14","12:53","16:45","20:12","21:57");
        gun_15      =    new Array("7/2/2015"," 3:12","03:32","5:15","12:53","16:45","20:12","21:57");
        gun_16      =    new Array("7/3/2015"," 3:13","03:33","5:15","12:53","16:45","20:12","21:57");
        gun_17      =    new Array("7/4/2015"," 3:14","03:34","5:16","12:53","16:45","20:12","21:56");
        gun_18      =    new Array("7/5/2015"," 3:15","03:35","5:16","12:53","16:45","20:12","21:56");
        gun_19      =    new Array("7/6/2015"," 3:15","03:35","5:17","12:53","16:45","20:12","21:56");
        gun_20      =    new Array("7/7/2015"," 3:16","03:36","5:17","12:54","16:45","20:11","21:55");
        gun_21      =    new Array("7/8/2015"," 3:17","03:37","5:18","12:54","16:46","20:11","21:55");
        gun_22      =    new Array("7/9/2015"," 3:18","03:38","5:19","12:54","16:46","20:11","21:54");
        gun_23      =    new Array("7/10/2015"," 3:19","03:39","5:19","12:54","16:46","20:11","21:53");
        gun_24      =    new Array("7/11/2015"," 3:20","03:40","5:20","12:54","16:46","20:10","21:53");
        gun_25      =    new Array("7/12/2015"," 3:21","03:41","5:21","12:54","16:46","20:10","21:52");
        gun_26      =    new Array("7/13/2015"," 3:22","03:42","5:21","12:54","16:46","20:09","21:51");
        gun_27      =    new Array("7/14/2015"," 3:23","03:43","5:22","12:55","16:46","20:09","21:51");
        gun_28      =    new Array("7/15/2015"," 3:24","03:44","5:22","12:55","16:46","20:09","21:50");
        gun_29      =    new Array("7/16/2015"," 3:25","03:45","5:23","12:55","16:46","20:08","21:49");

	break;
	case "adiyaman":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:50","03:10","4:56","12:38","16:32","20:02","21:50");
        gun_2      =    new Array("6/19/2015","2:50","03:10","4:56","12:38","16:32","20:02","21:51");
        gun_3      =    new Array("6/20/2015","2:50","03:10","4:56","12:38","16:32","20:03","21:51");
        gun_4      =    new Array("6/21/2015","2:50","03:10","4:56","12:39","16:33","20:03","21:51");
        gun_5      =    new Array("6/22/2015","2:50","03:10","4:57","12:39","16:33","20:03","21:51");
        gun_6      =    new Array("6/23/2015","2:50","03:10","4:57","12:39","16:33","20:03","21:51");
        gun_7      =    new Array("6/24/2015","2:51","03:11","4:57","12:39","16:33","20:03","21:51");
        gun_8      =    new Array("6/25/2015","2:51","03:11","4:58","12:40","16:33","20:04","21:52");
        gun_9      =    new Array("6/26/2015","2:51","03:11","4:58","12:40","16:34","20:04","21:52");
        gun_10      =    new Array("6/27/2015","2:52","03:12","4:58","12:40","16:34","20:04","21:51");
        gun_11      =    new Array("6/28/2015","2:52","03:12","4:59","12:40","16:34","20:04","21:51");
        gun_12      =    new Array("6/29/2015","2:53","03:13","4:59","12:40","16:34","20:04","21:51");
        gun_13      =    new Array("6/30/2015","2:54","03:14","4:59","12:41","16:34","20:04","21:51");
        gun_14      =    new Array("7/1/2015"," 2:54","03:14","5:00","12:41","16:35","20:04","21:51");
        gun_15      =    new Array("7/2/2015"," 2:55","03:15","5:00","12:41","16:35","20:04","21:51");
        gun_16      =    new Array("7/3/2015"," 2:56","03:16","5:01","12:41","16:35","20:03","21:50");
        gun_17      =    new Array("7/4/2015"," 2:56","03:16","5:01","12:41","16:35","20:03","21:50");
        gun_18      =    new Array("7/5/2015"," 2:57","03:17","5:02","12:42","16:35","20:03","21:49");
        gun_19      =    new Array("7/6/2015"," 2:58","03:18","5:02","12:42","16:35","20:03","21:49");
        gun_20      =    new Array("7/7/2015"," 2:59","03:19","5:03","12:42","16:35","20:03","21:48");
        gun_21      =    new Array("7/8/2015"," 3:00","03:20","5:03","12:42","16:35","20:02","21:48");
        gun_22      =    new Array("7/9/2015"," 3:01","03:21","5:04","12:42","16:36","20:02","21:47");
        gun_23      =    new Array("7/10/2015"," 3:02","03:22","5:05","12:42","16:36","20:02","21:47");
        gun_24      =    new Array("7/11/2015"," 3:03","03:23","5:05","12:42","16:36","20:01","21:46");
        gun_25      =    new Array("7/12/2015"," 3:04","03:24","5:06","12:43","16:36","20:01","21:45");
        gun_26      =    new Array("7/13/2015"," 3:05","03:25","5:07","12:43","16:36","20:00","21:45");
        gun_27      =    new Array("7/14/2015"," 3:06","03:26","5:07","12:43","16:36","20:00","21:44");
        gun_28      =    new Array("7/15/2015"," 3:07","03:27","5:08","12:43","16:36","19:59","21:43");
        gun_29      =    new Array("7/16/2015"," 3:08","03:28","5:09","12:43","16:36","19:59","21:42");

	break;
	case "afyon":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","3:13","03:33","5:24","13:09","17:05","20:36","22:27");
        gun_2      =    new Array("6/19/2015","3:13","03:33","5:24","13:09","17:05","20:36","22:28");
        gun_3      =    new Array("6/20/2015","3:13","03:33","5:24","13:09","17:06","20:37","22:28");
        gun_4      =    new Array("6/21/2015","3:14","03:34","5:24","13:10","17:06","20:37","22:28");
        gun_5      =    new Array("6/22/2015","3:14","03:34","5:24","13:10","17:06","20:37","22:28");
        gun_6      =    new Array("6/23/2015","3:14","03:34","5:25","13:10","17:06","20:37","22:29");
        gun_7      =    new Array("6/24/2015","3:14","03:34","5:25","13:10","17:06","20:37","22:29");
        gun_8      =    new Array("6/25/2015","3:15","03:35","5:25","13:10","17:07","20:38","22:29");
        gun_9      =    new Array("6/26/2015","3:15","03:35","5:26","13:11","17:07","20:38","22:29");
        gun_10      =    new Array("6/27/2015","3:16","03:36","5:26","13:11","17:07","20:38","22:29");
        gun_11      =    new Array("6/28/2015","3:16","03:36","5:26","13:11","17:07","20:38","22:29");
        gun_12      =    new Array("6/29/2015","3:17","03:37","5:27","13:11","17:07","20:38","22:28");
        gun_13      =    new Array("6/30/2015","3:17","03:37","5:27","13:11","17:07","20:38","22:28");
        gun_14      =    new Array("7/1/2015"," 3:18","03:38","5:28","13:12","17:08","20:38","22:28");
        gun_15      =    new Array("7/2/2015"," 3:19","03:39","5:28","13:12","17:08","20:37","22:28");
        gun_16      =    new Array("7/3/2015"," 3:19","03:39","5:29","13:12","17:08","20:37","22:27");
        gun_17      =    new Array("7/4/2015"," 3:20","03:40","5:29","13:12","17:08","20:37","22:27");
        gun_18      =    new Array("7/5/2015"," 3:21","03:41","5:30","13:12","17:08","20:37","22:26");
        gun_19      =    new Array("7/6/2015"," 3:22","03:42","5:30","13:13","17:08","20:37","22:26");
        gun_20      =    new Array("7/7/2015"," 3:23","03:43","5:31","13:13","17:08","20:36","22:25");
        gun_21      =    new Array("7/8/2015"," 3:24","03:44","5:31","13:13","17:08","20:36","22:25");
        gun_22      =    new Array("7/9/2015"," 3:25","03:45","5:32","13:13","17:09","20:36","22:24");
        gun_23      =    new Array("7/10/2015"," 3:26","03:46","5:33","13:13","17:09","20:35","22:23");
        gun_24      =    new Array("7/11/2015"," 3:27","03:47","5:33","13:13","17:09","20:35","22:23");
        gun_25      =    new Array("7/12/2015"," 3:28","03:48","5:34","13:13","17:09","20:35","22:22");
        gun_26      =    new Array("7/13/2015"," 3:29","03:49","5:35","13:14","17:09","20:34","22:21");
        gun_27      =    new Array("7/14/2015"," 3:30","03:50","5:35","13:14","17:09","20:34","22:20");
        gun_28      =    new Array("7/15/2015"," 3:32","03:52","5:36","13:14","17:09","20:33","22:19");
        gun_29      =    new Array("7/16/2015"," 3:33","03:53","5:37","13:14ramazan_baslama_tarihi){										//Ramazana Ne Kadar kaldıgını buluyoru7/5/20157/16/2015z
			console.log(","17:09","20:33","22:18");

	break;
	case "aksaray":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","3:02","03:22","5:11","12:55","16:50","20:21","22:11");
        gun_2      =    new Array("6/19/2015","3:02","03:22","5:11","12:55","16:50","20:21","22:11");
        gun_3      =    new Array("6/20/2015","3:02","03:22","5:11","12:55","16:51","20:21","22:11");
        gun_4      =    new Array("6/21/2015","3:03","03:23","5:11","12:56","16:51","20:22","22:12");
        gun_5      =    new Array("6/22/2015","3:03","03:23","5:12","12:56","16:51","20:22","22:12");
        gun_6      =    new Array("6/23/2015","3:03","03:23","5:12","12:56","16:51","20:22","22:12");
        gun_7      =    new Array("6/24/2015","3:03","03:23","5:12","12:56","16:51","20:22","22:12");
        gun_8      =    new Array("6/25/2015","3:04","03:24","5:13","12:56","16:52","20:22","22:12");
        gun_9      =    new Array("6/26/2015","3:04","03:24","5:13","12:57","16:52","20:22","22:12");
        gun_10      =    new Array("6/27/2015","3:05","03:25","5:13","12:57","16:52","20:22","22:12");
        gun_11      =    new Array("6/28/2015","3:05","03:25","5:14","12:57","16:52","20:22","22:12");
        gun_12      =    new Array("6/29/2015","3:06","03:26","5:14","12:57","16:52","20:22","22:12");
        gun_13      =    new Array("6/30/2015","3:06","03:26","5:14","12:57","16:53","20:22","22:12");
        gun_14      =    new Array("7/1/2015"," 3:07","03:27","5:15","12:58","16:53","20:22","22:11");
        gun_15      =    new Array("7/2/2015"," 3:08","03:28","5:15","12:58","16:53","20:22","22:11");
        gun_16      =    new Array("7/3/2015"," 3:08","03:28","5:16","12:58","16:53","20:22","22:11");
        gun_17      =    new Array("7/4/2015"," 3:09","03:29","5:16","12:58","16:53","20:22","22:10");
        gun_18      =    new Array("7/5/2015"," 3:10","03:30","5:17","12:58","16:53","20:22","22:10");
        gun_19      =    new Array("7/6/2015"," 3:11","03:31","5:17","12:59","16:53","20:22","22:09");
        gun_20      =    new Array("7/7/2015"," 3:12","03:32","5:18","12:59","16:54","20:21","22:09");
        gun_21      =    new Array("7/8/2015"," 3:13","03:33","5:19","12:59","16:54","20:21","22:08");
        gun_22      =    new Array("7/9/2015"," 3:14","03:34","5:19","12:59","16:54","20:21","22:08");
        gun_23      =    new Array("7/10/2015"," 3:15","03:35","5:20","12:59","16:54","20:20","22:07");
        gun_24      =    new Array("7/11/2015"," 3:16","03:36","5:20","12:59","16:54","20:20","22:06");
        gun_25      =    new Array("7/12/2015"," 3:17","03:37","5:21","12:59","16:54","20:19","22:06");
        gun_26      =    new Array("7/13/2015"," 3:18","03:38","5:22","13:00","16:54","20:19","22:05");
        gun_27      =    new Array("7/14/2015"," 3:19","03:39","5:23","13:00","16:54","20:19","22:04");
        gun_28      =    new Array("7/15/2015"," 3:20","03:40","5:23","13:00","16:54","20:18","22:03");
        gun_29      =    new Array("7/16/2015"," 3:21","03:41","5:24","13:00","16:54","20:17","22:02");

	break;
	case "amasya":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:37","02:57","4:56","12:48","16:48","20:21","22:19");
        gun_2      =    new Array("6/19/2015","2:37","02:57","4:56","12:48","16:48","20:21","22:20");
        gun_3      =    new Array("6/20/2015","2:37","02:57","4:57","12:48","16:48","20:22","22:20");
        gun_4      =    new Array("6/21/2015","2:37","02:57","4:57","12:48","16:49","20:22","22:20");
        gun_5      =    new Array("6/22/2015","2:37","02:57","4:57","12:49","16:49","20:22","22:20");
        gun_6      =    new Array("6/23/2015","2:38","02:58","4:57","12:49","16:49","20:22","22:21");
        gun_7      =    new Array("6/24/2015","2:38","02:58","4:58","12:49","16:49","20:22","22:21");
        gun_8      =    new Array("6/25/2015","2:38","02:58","4:58","12:49","16:49","20:23","22:21");
        gun_9      =    new Array("6/26/2015","2:39","02:59","4:58","12:49","16:50","20:23","22:21");
        gun_10      =    new Array("6/27/2015","2:39","02:59","4:59","12:50","16:50","20:23","22:21");
        gun_11      =    new Array("6/28/2015","2:40","03:00","4:59","12:50","16:50","20:23","22:20");
        gun_12      =    new Array("6/29/2015","2:40","03:00","4:59","12:50","16:50","20:23","22:20");
        gun_13      =    new Array("6/30/2015","2:41","03:01","5:00","12:50","16:50","20:23","22:20");
        gun_14      =    new Array("7/1/2015"," 2:42","03:02","5:00","12:50","16:50","20:22","22:20");
        gun_15      =    new Array("7/2/2015"," 2:43","03:03","5:01","12:51","16:51","20:22","22:19");
        gun_16      =    new Array("7/3/2015"," 2:44","03:04","5:01","12:51","16:51","20:22","22:19");
        gun_17      =    new Array("7/4/2015"," 2:44","03:04","5:02","12:51","16:51","20:22","22:18");
        gun_18      =    new Array("7/5/2015"," 2:45","03:05","5:02","12:51","16:51","20:22","22:18");
        gun_19      =    new Array("7/6/2015"," 2:46","03:06","5:03","12:51","16:51","20:21","22:17");
        gun_20      =    new Array("7/7/2015"," 2:47","03:07","5:04","12:52","16:51","20:21","22:16");
        gun_21      =    new Array("7/8/2015"," 2:49","03:09","5:04","12:52","16:51","20:21","22:16");
        gun_22      =    new Array("7/9/2015"," 2:50","03:10","5:05","12:52","16:51","20:20","22:15");
        gun_23      =    new Array("7/10/2015"," 2:51","03:11","5:06","12:52","16:51","20:20","22:14");
        gun_24      =    new Array("7/11/2015"," 2:52","03:12","5:06","12:52","16:51","20:20","22:13");
        gun_25      =    new Array("7/12/2015"," 2:53","03:13","5:07","12:52","16:51","20:19","22:13");
        gun_26      =    new Array("7/13/2015"," 2:55","03:15","5:08","12:52","16:51","20:19","22:12");
        gun_27      =    new Array("7/14/2015"," 2:56","03:16","5:08","12:53","16:51","20:18","22:11");
        gun_28      =    new Array("7/15/2015"," 2:57","03:17","5:09","12:53","16:51","20:18","22:10");
        gun_29      =    new Array("7/16/2015"," 2:59","03:19","5:10","12:53","16:51","20:17","22:09");

	break;
	case "ankara":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:55","03:15","5:11","13:00","16:58","20:31","22:26");
        gun_2      =    new Array("6/19/2015","2:55","03:15","5:11","13:00","16:59","20:31","22:26");
        gun_3      =    new Array("6/20/2015","2:55","03:15","5:11","13:00","16:59","20:31","22:27");
        gun_4      =    new Array("6/21/2015","2:55","03:15","5:11","13:00","16:59","20:31","22:27");
        gun_5      =    new Array("6/22/2015","2:56","03:16","5:11","13:01","16:59","20:32","22:27");
        gun_6      =    new Array("6/23/2015","2:56","03:16","5:12","13:01","16:59","20:32","22:27");
        gun_7      =    new Array("6/24/2015","2:56","03:16","5:12","13:01","17:00","20:32","22:27");
        gun_8      =    new Array("6/25/2015","2:56","03:16","5:12","13:01","17:00","20:32","22:27");
        gun_9      =    new Array("6/26/2015","2:57","03:17","5:13","13:01","17:00","20:32","22:27");
        gun_10      =    new Array("6/27/2015","2:57","03:17","5:13","13:02","17:00","20:32","22:27");
        gun_11      =    new Array("6/28/2015","2:58","03:18","5:13","13:02","17:00","20:32","22:27");
        gun_12      =    new Array("6/29/2015","2:59","03:19","5:14","13:02","17:01","20:32","22:27");
        gun_13      =    new Array("6/30/2015","2:59","03:19","5:14","13:02","17:01","20:32","22:27");
        gun_14      =    new Array("7/1/2015"," 3:00","03:20","5:15","13:02","17:01","20:32","22:26");
        gun_15      =    new Array("7/2/2015"," 3:01","03:21","5:15","13:03","17:01","20:32","22:26");
        gun_16      =    new Array("7/3/2015"," 3:02","03:22","5:16","13:03","17:01","20:32","22:26");
        gun_17      =    new Array("7/4/2015"," 3:02","03:22","5:16","13:03","17:01","20:32","22:25");
        gun_18      =    new Array("7/5/2015"," 3:03","03:23","5:17","13:03","17:01","20:31","22:25");
        gun_19      =    new Array("7/6/2015"," 3:04","03:24","5:17","13:03","17:01","20:31","22:24");
        gun_20      =    new Array("7/7/2015"," 3:05","03:25","5:18","13:04","17:02","20:31","22:23");
        gun_21      =    new Array("7/8/2015"," 3:06","03:26","5:19","13:04","17:02","20:31","22:23");
        gun_22      =    new Array("7/9/2015"," 3:07","03:27","5:19","13:04","17:02","20:30","22:22");
        gun_23      =    new Array("7/10/2015"," 3:09","03:29","5:20","13:04","17:02","20:30","22:21");
        gun_24      =    new Array("7/11/2015"," 3:10","03:30","5:21","13:04","17:02","20:29","22:21");
        gun_25      =    new Array("7/12/2015"," 3:11","03:31","5:21","13:04","17:02","20:29","22:20");
        gun_26      =    new Array("7/13/2015"," 3:12","03:32","5:22","13:04","17:02","20:28","22:19");
        gun_27      =    new Array("7/14/2015"," 3:13","03:33","5:23","13:05","17:02","20:28","22:18");
        gun_28      =    new Array("7/15/2015"," 3:15","03:35","5:23","13:05","17:02","20:27","22:17");
        gun_29      =    new Array("7/16/2015"," 3:16","03:36","5:24","13:05","17:02","20:27","22:16");

	break;
	case "antalya":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","3:26","03:46","5:29","13:08","17:00","20:30","22:15");
        gun_2      =    new Array("6/19/2015","3:26","03:46","5:29","13:08","17:00","20:30","22:15");
        gun_3      =    new Array("6/20/2015","3:26","03:46","5:29","13:09","17:01","20:30","22:16");
        gun_4      =    new Array("6/21/2015","3:26","03:46","5:29","13:09","17:01","20:30","22:16");
        gun_5      =    new Array("6/22/2015","3:26","03:46","5:30","13:09","17:01","20:31","22:16");
        gun_6      =    new Array("6/23/2015","3:26","03:46","5:30","13:09","17:01","20:31","22:16");
        gun_7      =    new Array("6/24/2015","3:27","03:47","5:30","13:10","17:02","20:31","22:16");
        gun_8      =    new Array("6/25/2015","3:27","03:47","5:30","13:10","17:02","20:31","22:16");
        gun_9      =    new Array("6/26/2015","3:28","03:48","5:31","13:10","17:02","20:31","22:16");
        gun_10      =    new Array("6/27/2015","3:28","03:48","5:31","13:10","17:02","20:31","22:16");
        gun_11      =    new Array("6/28/2015","3:28","03:48","5:31","13:10","17:02","20:31","22:16");
        gun_12      =    new Array("6/29/2015","3:29","03:49","5:32","13:11","17:02","20:31","22:16");
        gun_13      =    new Array("6/30/2015","3:30","03:50","5:32","13:11","17:03","20:31","22:16");
        gun_14      =    new Array("7/1/2015"," 3:30","03:50","5:33","13:11","17:03","20:31","22:16");
        gun_15      =    new Array("7/2/2015"," 3:31","03:51","5:33","13:11","17:03","20:31","22:16");
        gun_16      =    new Array("7/3/2015"," 3:32","03:52","5:34","13:11","17:03","20:31","22:15");
        gun_17      =    new Array("7/4/2015"," 3:32","03:52","5:34","13:12","17:03","20:31","22:15");
        gun_18      =    new Array("7/5/2015"," 3:33","03:53","5:35","13:12","17:03","20:31","22:15");
        gun_19      =    new Array("7/6/2015"," 3:34","03:54","5:35","13:12","17:04","20:30","22:14");
        gun_20      =    new Array("7/7/2015"," 3:35","03:55","5:36","13:12","17:04","20:30","22:14");
        gun_21      =    new Array("7/8/2015"," 3:36","03:56","5:36","13:12","17:04","20:30","22:13");
        gun_22      =    new Array("7/9/2015"," 3:36","03:56","5:37","13:12","17:04","20:30","22:13");
        gun_23      =    new Array("7/10/2015"," 3:37","03:57","5:37","13:13","17:04","20:29","22:12");
        gun_24      =    new Array("7/11/2015"," 3:38","03:58","5:38","13:13","17:04","20:29","22:11");
        gun_25      =    new Array("7/12/2015"," 3:39","03:59","5:39","13:13","17:04","20:29","22:11");
        gun_26      =    new Array("7/13/2015"," 3:40","04:00","5:39","13:13","17:04","20:28","22:10");
        gun_27      =    new Array("7/14/2015"," 3:41","04:01","5:40","13:13","17:04","20:28","22:09");
        gun_28      =    new Array("7/15/2015"," 3:42","04:02","5:41","13:13","17:04","20:27","22:08");
        gun_29      =    new Array("7/16/2015"," 3:44","04:04","5:41","13:13","17:04","20:27","22:08");

	break;
	case "ardahan":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:05","02:25","4:27","12:20","16:21","19:55","21:55");
        gun_2      =    new Array("6/19/2015","2:05","02:25","4:27","12:20","16:22","19:56","21:56");
        gun_3      =    new Array("6/20/2015","2:05","02:25","4:27","12:21","16:22","19:56","21:56");
        gun_4      =    new Array("6/21/2015","2:05","02:25","4:28","12:21","16:22","19:56","21:56");
        gun_5      =    new Array("6/22/2015","2:05","02:25","4:28","12:21","16:22","19:56","21:57");
        gun_6      =    new Array("6/23/2015","2:06","02:26","4:28","12:21","16:23","19:56","21:57");
        gun_7      =    new Array("6/24/2015","2:06","02:26","4:28","12:21","16:23","19:57","21:57");
        gun_8      =    new Array("6/25/2015","2:06","02:26","4:29","12:22","16:23","19:57","21:57");
        gun_9      =    new Array("6/26/2015","2:07","02:27","4:29","12:22","16:23","19:57","21:57");
        gun_10      =    new Array("6/27/2015","2:07","02:27","4:29","12:22","16:23","19:57","21:57");
        gun_11      =    new Array("6/28/2015","2:08","02:28","4:30","12:22","16:23","19:57","21:56");
        gun_12      =    new Array("6/29/2015","2:09","02:29","4:30","12:23","16:24","19:57","21:56");
        gun_13      =    new Array("6/30/2015","2:09","02:29","4:31","12:23","16:24","19:57","21:56");
        gun_14      =    new Array("7/1/2015"," 2:10","02:30","4:31","12:23","16:24","19:57","21:56");
        gun_15      =    new Array("7/2/2015"," 2:11","02:31","4:32","12:23","16:24","19:56","21:55");
        gun_16      =    new Array("7/3/2015"," 2:12","02:32","4:32","12:23","16:24","19:56","21:55");
        gun_17      =    new Array("7/4/2015"," 2:13","02:33","4:33","12:23","16:24","19:56","21:54");
        gun_18      =    new Array("7/5/2015"," 2:14","02:34","4:33","12:24","16:24","19:56","21:54");
        gun_19      =    new Array("7/6/2015"," 2:15","02:35","4:34","12:24","16:24","19:56","21:53");
        gun_20      =    new Array("7/7/2015"," 2:16","02:36","4:35","12:24","16:24","19:55","21:52");
        gun_21      =    new Array("7/8/2015"," 2:17","02:37","4:35","12:24","16:25","19:55","21:52");
        gun_22      =    new Array("7/9/2015"," 2:18","02:38","4:36","12:24","16:25","19:54","21:51");
        gun_23      =    new Array("7/10/2015"," 2:19","02:39","4:37","12:24","16:25","19:54","21:50");
        gun_24      =    new Array("7/11/2015"," 2:21","02:41","4:37","12:25","16:25","19:54","21:49");
        gun_25      =    new Array("7/12/2015"," 2:22","02:42","4:38","12:25","16:25","19:53","21:48");
        gun_26      =    new Array("7/13/2015"," 2:23","02:43","4:39","12:25","16:25","19:53","21:47");
        gun_27      =    new Array("7/14/2015"," 2:25","02:45","4:39","12:25","16:25","19:52","21:46");
        gun_28      =    new Array("7/15/2015"," 2:26","02:46","4:40","12:25","16:24","19:51","21:45");
        gun_29      =    new Array("7/16/2015"," 2:28","02:48","4:41","12:25","16:24","19:51","21:44");

	break;
	case "artvin":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:08","02:28","4:31","12:24","16:25","19:59","22:00");
        gun_2      =    new Array("6/19/2015","2:08","02:28","4:31","12:24","16:25","19:59","22:00");
        gun_3      =    new Array("6/20/2015","2:08","02:28","4:31","12:24","16:26","20:00","22:00");
        gun_4      =    new Array("6/21/2015","2:08","02:28","4:31","12:25","16:26","20:00","22:01");
        gun_5      =    new Array("6/22/2015","2:08","02:28","4:31","12:25","16:26","20:00","22:01");
        gun_6      =    new Array("6/23/2015","2:09","02:29","4:31","12:25","16:26","20:00","22:01");
        gun_7      =    new Array("6/24/2015","2:09","02:29","4:32","12:25","16:27","20:00","22:01");
        gun_8      =    new Array("6/25/2015","2:09","02:29","4:32","12:25","16:27","20:01","22:01");
        gun_9      =    new Array("6/26/2015","2:10","02:30","4:32","12:26","16:27","20:01","22:01");
        gun_10      =    new Array("6/27/2015","2:10","02:30","4:33","12:26","16:27","20:01","22:01");
        gun_11      =    new Array("6/28/2015","2:11","02:31","4:33","12:26","16:27","20:01","22:01");
        gun_12      =    new Array("6/29/2015","2:12","02:32","4:34","12:26","16:27","20:01","22:00");
        gun_13      =    new Array("6/30/2015","2:12","02:32","4:34","12:26","16:28","20:01","22:00");
        gun_14      =    new Array("7/1/2015"," 2:13","02:33","4:35","12:27","16:28","20:00","22:00");
        gun_15      =    new Array("7/2/2015"," 2:14","02:34","4:35","12:27","16:28","20:00","21:59");
        gun_16      =    new Array("7/3/2015"," 2:15","02:35","4:36","12:27","16:28","20:00","21:59");
        gun_17      =    new Array("7/4/2015"," 2:16","02:36","4:36","12:27","16:28","20:00","21:58");
        gun_18      =    new Array("7/5/2015"," 2:17","02:37","4:37","12:27","16:28","20:00","21:58");
        gun_19      =    new Array("7/6/2015"," 2:18","02:38","4:37","12:28","16:28","19:59","21:57");
        gun_20      =    new Array("7/7/2015"," 2:19","02:39","4:38","12:28","16:28","19:59","21:57");
        gun_21      =    new Array("7/8/2015"," 2:20","02:40","4:39","12:28","16:28","19:59","21:56");
        gun_22      =    new Array("7/9/2015"," 2:21","02:41","4:39","12:28","16:28","19:58","21:55");
        gun_23      =    new Array("7/10/2015"," 2:22","02:42","4:40","12:28","16:28","19:58","21:54");
        gun_24      =    new Array("7/11/2015"," 2:24","02:44","4:41","12:28","16:28","19:58","21:53");
        gun_25      =    new Array("7/12/2015"," 2:25","02:45","4:41","12:28","16:28","19:57","21:52");
        gun_26      =    new Array("7/13/2015"," 2:26","02:46","4:42","12:29","16:28","19:57","21:51");
        gun_27      =    new Array("7/14/2015"," 2:28","02:48","4:43","12:29","16:28","19:56","21:50");
        gun_28      =    new Array("7/15/2015"," 2:29","02:49","4:44","12:29","16:28","19:55","21:49");
        gun_29      =    new Array("7/16/2015"," 2:31","02:51","4:44","12:29","16:28","19:55","21:48");

	break;
	case "aydin":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","3:32","03:52","5:38","13:20","17:14","20:43","22:31");
        gun_2      =    new Array("6/19/2015","3:32","03:52","5:38","13:20","17:14","20:44","22:32");
        gun_3      =    new Array("6/20/2015","3:32","03:52","5:38","13:20","17:14","20:44","22:32");
        gun_4      =    new Array("6/21/2015","3:32","03:52","5:38","13:20","17:14","20:44","22:32");
        gun_5      =    new Array("6/22/2015","3:32","03:52","5:39","13:21","17:15","20:44","22:32");
        gun_6      =    new Array("6/23/2015","3:32","03:52","5:39","13:21","17:15","20:45","22:33");
        gun_7      =    new Array("6/24/2015","3:33","03:53","5:39","13:21","17:15","20:45","22:33");
        gun_8      =    new Array("6/25/2015","3:33","03:53","5:39","13:21","17:15","20:45","22:33");
        gun_9      =    new Array("6/26/2015","3:33","03:53","5:40","13:21","17:15","20:45","22:33");
        gun_10      =    new Array("6/27/2015","3:34","03:54","5:40","13:22","17:16","20:45","22:33");
        gun_11      =    new Array("6/28/2015","3:34","03:54","5:41","13:22","17:16","20:45","22:33");
        gun_12      =    new Array("6/29/2015","3:35","03:55","5:41","13:22","17:16","20:45","22:32");
        gun_13      =    new Array("6/30/2015","3:35","03:55","5:41","13:22","17:16","20:45","22:32");
        gun_14      =    new Array("7/1/2015"," 3:36","03:56","5:42","13:22","17:16","20:45","22:32");
        gun_15      =    new Array("7/2/2015"," 3:37","03:57","5:42","13:23","17:17","20:45","22:32");
        gun_16      =    new Array("7/3/2015"," 3:38","03:58","5:43","13:23","17:17","20:45","22:31");
        gun_17      =    new Array("7/4/2015"," 3:38","03:58","5:43","13:23","17:17","20:44","22:31");
        gun_18      =    new Array("7/5/2015"," 3:39","03:59","5:44","13:23","17:17","20:44","22:31");
        gun_19      =    new Array("7/6/2015"," 3:40","04:00","5:44","13:23","17:17","20:44","22:30");
        gun_20      =    new Array("7/7/2015"," 3:41","04:01","5:45","13:23","17:17","20:44","22:30");
        gun_21      =    new Array("7/8/2015"," 3:42","04:02","5:45","13:24","17:17","20:44","22:29");
        gun_22      =    new Array("7/9/2015"," 3:43","04:03","5:46","13:24","17:17","20:43","22:29");
        gun_23      =    new Array("7/10/2015"," 3:44","04:04","5:47","13:24","17:17","20:43","22:28");
        gun_24      =    new Array("7/11/2015"," 3:45","04:05","5:47","13:24","17:17","20:42","22:27");
        gun_25      =    new Array("7/12/2015"," 3:46","04:06","5:48","13:24","17:18","20:42","22:27");
        gun_26      =    new Array("7/13/2015"," 3:47","04:07","5:49","13:24","17:18","20:42","22:26");
        gun_27      =    new Array("7/14/2015"," 3:48","04:08","5:49","13:24","17:18","20:41","22:25");
        gun_28      =    new Array("7/15/2015"," 3:49","04:09","5:50","13:25","17:18","20:41","22:24");
        gun_29      =    new Array("7/16/2015"," 3:50","04:10","5:51","13:25","17:18","20:40","22:23");

	break;
	case "agri":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:16","02:36","4:30","12:19","16:17","19:49","21:44");
        gun_2      =    new Array("6/19/2015","2:16","02:36","4:31","12:19","16:17","19:49","21:44");
        gun_3      =    new Array("6/20/2015","2:16","02:36","4:31","12:19","16:17","19:50","21:44");
        gun_4      =    new Array("6/21/2015","2:16","02:36","4:31","12:19","16:18","19:50","21:45");
        gun_5      =    new Array("6/22/2015","2:16","02:36","4:31","12:20","16:18","19:50","21:45");
        gun_6      =    new Array("6/23/2015","2:16","02:36","4:31","12:20","16:18","19:50","21:45");
        gun_7      =    new Array("6/24/2015","2:17","02:37","4:32","12:20","16:18","19:50","21:45");
        gun_8      =    new Array("6/25/2015","2:17","02:37","4:32","12:20","16:19","19:51","21:45");
        gun_9      =    new Array("6/26/2015","2:17","02:37","4:32","12:21","16:19","19:51","21:45");
        gun_10      =    new Array("6/27/2015","2:18","02:38","4:33","12:21","16:19","19:51","21:45");
        gun_11      =    new Array("6/28/2015","2:19","02:39","4:33","12:21","16:19","19:51","21:45");
        gun_12      =    new Array("6/29/2015","2:19","02:39","4:33","12:21","16:19","19:51","21:45");
        gun_13      =    new Array("6/30/2015","2:20","02:40","4:34","12:21","16:19","19:51","21:44");
        gun_14      =    new Array("7/1/2015"," 2:20","02:40","4:34","12:22","16:20","19:51","21:44");
        gun_15      =    new Array("7/2/2015"," 2:21","02:41","4:35","12:22","16:20","19:50","21:44");
        gun_16      =    new Array("7/3/2015"," 2:22","02:42","4:35","12:22","16:20","19:50","21:43");
        gun_17      =    new Array("7/4/2015"," 2:23","02:43","4:36","12:22","16:20","19:50","21:43");
        gun_18      =    new Array("7/5/2015"," 2:24","02:44","4:36","12:22","16:20","19:50","21:42");
        gun_19      =    new Array("7/6/2015"," 2:25","02:45","4:37","12:22","16:20","19:50","21:42");
        gun_20      =    new Array("7/7/2015"," 2:26","02:46","4:38","12:23","16:20","19:49","21:41");
        gun_21      =    new Array("7/8/2015"," 2:27","02:47","4:38","12:23","16:20","19:49","21:41");
        gun_22      =    new Array("7/9/2015"," 2:28","02:48","4:39","12:23","16:20","19:49","21:40");
        gun_23      =    new Array("7/10/2015"," 2:29","02:49","4:40","12:23","16:20","19:48","21:39");
        gun_24      =    new Array("7/11/2015"," 2:30","02:50","4:40","12:23","16:20","19:48","21:38");
        gun_25      =    new Array("7/12/2015"," 2:31","02:51","4:41","12:23","16:20","19:47","21:38");
        gun_26      =    new Array("7/13/2015"," 2:32","02:52","4:42","12:23","16:20","19:47","21:37");
        gun_27      =    new Array("7/14/2015"," 2:34","02:54","4:42","12:24","16:20","19:46","21:36");
        gun_28      =    new Array("7/15/2015"," 2:35","02:55","4:43","12:24","16:20","19:46","21:35");
        gun_29      =    new Array("7/16/2015"," 2:36","02:56","4:44","12:24","16:20","19:45","21:34");

	break;
	case "balikesir":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","3:18","03:38","5:32","13:20","17:18","20:49","22:43");
        gun_2      =    new Array("6/19/2015","3:18","03:38","5:32","13:20","17:18","20:50","22:44");
        gun_3      =    new Array("6/20/2015","3:18","03:38","5:32","13:20","17:18","20:50","22:44");
        gun_4      =    new Array("6/21/2015","3:18","03:38","5:33","13:20","17:18","20:50","22:44");
        gun_5      =    new Array("6/22/2015","3:18","03:38","5:33","13:21","17:19","20:50","22:44");
        gun_6      =    new Array("6/23/2015","3:19","03:39","5:33","13:21","17:19","20:50","22:45");
        gun_7      =    new Array("6/24/2015","3:19","03:39","5:33","13:21","17:19","20:51","22:45");
        gun_8      =    new Array("6/25/2015","3:19","03:39","5:34","13:21","17:19","20:51","22:45");
        gun_9      =    new Array("6/26/2015","3:20","03:40","5:34","13:21","17:19","20:51","22:45");
        gun_10      =    new Array("6/27/2015","3:20","03:40","5:34","13:22","17:20","20:51","22:45");
        gun_11      =    new Array("6/28/2015","3:21","03:41","5:35","13:22","17:20","20:51","22:44");
        gun_12      =    new Array("6/29/2015","3:21","03:41","5:35","13:22","17:20","20:51","22:44");
        gun_13      =    new Array("6/30/2015","3:22","03:42","5:35","13:22","17:20","20:51","22:44");
        gun_14      =    new Array("7/1/2015"," 3:23","03:43","5:36","13:22","17:20","20:51","22:44");
        gun_15      =    new Array("7/2/2015"," 3:24","03:44","5:36","13:23","17:20","20:51","22:43");
        gun_16      =    new Array("7/3/2015"," 3:24","03:44","5:37","13:23","17:20","20:50","22:43");
        gun_17      =    new Array("7/4/2015"," 3:25","03:45","5:37","13:23","17:21","20:50","22:43");
        gun_18      =    new Array("7/5/2015"," 3:26","03:46","5:38","13:23","17:21","20:50","22:42");
        gun_19      =    new Array("7/6/2015"," 3:27","03:47","5:39","13:23","17:21","20:50","22:42");
        gun_20      =    new Array("7/7/2015"," 3:28","03:48","5:39","13:23","17:21","20:49","22:41");
        gun_21      =    new Array("7/8/2015"," 3:29","03:49","5:40","13:24","17:21","20:49","22:40");
        gun_22      =    new Array("7/9/2015"," 3:30","03:50","5:40","13:24","17:21","20:49","22:40");
        gun_23      =    new Array("7/10/2015"," 3:31","03:51","5:41","13:24","17:21","20:48","22:39");
        gun_24      =    new Array("7/11/2015"," 3:32","03:52","5:42","13:24","17:21","20:48","22:38");
        gun_25      =    new Array("7/12/2015"," 3:33","03:53","5:42","13:24","17:21","20:48","22:37");
        gun_26      =    new Array("7/13/2015"," 3:35","03:55","5:43","13:24","17:21","20:47","22:36");
        gun_27      =    new Array("7/14/2015"," 3:36","03:56","5:44","13:24","17:21","20:47","22:36");
        gun_28      =    new Array("7/15/2015"," 3:37","03:57","5:45","13:25","17:21","20:46","22:35");
        gun_29      =    new Array("7/16/2015"," 3:38","03:58","5:45","13:25","17:21","20:45","22:34");

	break;
	case "bartin":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:42","03:02","5:07","13:02","17:04","20:38","22:41");
        gun_2      =    new Array("6/19/2015","2:42","03:02","5:07","13:02","17:04","20:39","22:41");
        gun_3      =    new Array("6/20/2015","2:42","03:02","5:07","13:02","17:05","20:39","22:41");
        gun_4      =    new Array("6/21/2015","2:42","03:02","5:08","13:02","17:05","20:39","22:42");
        gun_5      =    new Array("6/22/2015","2:42","03:02","5:08","13:03","17:05","20:39","22:42");
        gun_6      =    new Array("6/23/2015","2:43","03:03","5:08","13:03","17:05","20:39","22:42");
        gun_7      =    new Array("6/24/2015","2:43","03:03","5:08","13:03","17:05","20:40","22:42");
        gun_8      =    new Array("6/25/2015","2:44","03:04","5:09","13:03","17:06","20:40","22:42");
        gun_9      =    new Array("6/26/2015","2:44","03:04","5:09","13:03","17:06","20:40","22:42");
        gun_10      =    new Array("6/27/2015","2:45","03:05","5:09","13:04","17:06","20:40","22:42");
        gun_11      =    new Array("6/28/2015","2:45","03:05","5:10","13:04","17:06","20:40","22:42");
        gun_12      =    new Array("6/29/2015","2:46","03:06","5:10","13:04","17:06","20:40","22:41");
        gun_13      =    new Array("6/30/2015","2:47","03:07","5:11","13:04","17:06","20:40","22:41");
        gun_14      =    new Array("7/1/2015"," 2:47","03:07","5:11","13:04","17:07","20:40","22:41");
        gun_15      =    new Array("7/2/2015"," 2:48","03:08","5:12","13:05","17:07","20:39","22:40");
        gun_16      =    new Array("7/3/2015"," 2:49","03:09","5:12","13:05","17:07","20:39","22:40");
        gun_17      =    new Array("7/4/2015"," 2:50","03:10","5:13","13:05","17:07","20:39","22:39");
        gun_18      =    new Array("7/5/2015"," 2:51","03:11","5:13","13:05","17:07","20:39","22:39");
        gun_19      =    new Array("7/6/2015"," 2:52","03:12","5:14","13:05","17:07","20:38","22:38");
        gun_20      =    new Array("7/7/2015"," 2:53","03:13","5:15","13:06","17:07","20:38","22:37");
        gun_21      =    new Array("7/8/2015"," 2:55","03:15","5:15","13:06","17:07","20:38","22:37");
        gun_22      =    new Array("7/9/2015"," 2:56","03:16","5:16","13:06","17:07","20:37","22:36");
        gun_23      =    new Array("7/10/2015"," 2:57","03:17","5:17","13:06","17:07","20:37","22:35");
        gun_24      =    new Array("7/11/2015"," 2:58","03:18","5:17","13:06","17:07","20:37","22:34");
        gun_25      =    new Array("7/12/2015"," 3:00","03:20","5:18","13:06","17:07","20:36","22:33");
        gun_26      =    new Array("7/13/2015"," 3:01","03:21","5:19","13:06","17:07","20:36","22:32");
        gun_27      =    new Array("7/14/2015"," 3:02","03:22","5:20","13:07","17:07","20:35","22:31");
        gun_28      =    new Array("7/15/2015"," 3:04","03:24","5:20","13:07","17:07","20:34","22:30");
        gun_29      =    new Array("7/16/2015"," 3:05","03:25","5:21","13:07","17:07","20:34","22:29");

	break;
	case "batman":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:37","02:57","4:44","12:27","16:21","19:51","21:39");
        gun_2      =    new Array("6/19/2015","2:37","02:57","4:44","12:27","16:21","19:51","21:40");
        gun_3      =    new Array("6/20/2015","2:38","02:58","4:45","12:27","16:21","19:52","21:40");
        gun_4      =    new Array("6/21/2015","2:38","02:58","4:45","12:27","16:21","19:52","21:40");
        gun_5      =    new Array("6/22/2015","2:38","02:58","4:45","12:27","16:22","19:52","21:40");
        gun_6      =    new Array("6/23/2015","2:38","02:58","4:45","12:28","16:22","19:52","21:41");
        gun_7      =    new Array("6/24/2015","2:38","02:58","4:45","12:28","16:22","19:52","21:41");
        gun_8      =    new Array("6/25/2015","2:39","02:59","4:46","12:28","16:22","19:52","21:41");
        gun_9      =    new Array("6/26/2015","2:39","02:59","4:46","12:28","16:22","19:52","21:41");
        gun_10      =    new Array("6/27/2015","2:40","03:00","4:46","12:29","16:23","19:53","21:41");
        gun_11      =    new Array("6/28/2015","2:40","03:00","4:47","12:29","16:23","19:53","21:41");
        gun_12      =    new Array("6/29/2015","2:41","03:01","4:47","12:29","16:23","19:53","21:40");
        gun_13      =    new Array("6/30/2015","2:41","03:01","4:48","12:29","16:23","19:53","21:40");
        gun_14      =    new Array("7/1/2015"," 2:42","03:02","4:48","12:29","16:23","19:52","21:40");
        gun_15      =    new Array("7/2/2015"," 2:43","03:03","4:48","12:30","16:23","19:52","21:40");
        gun_16      =    new Array("7/3/2015"," 2:43","03:03","4:49","12:30","16:24","19:52","21:39");
        gun_17      =    new Array("7/4/2015"," 2:44","03:04","4:49","12:30","16:24","19:52","21:39");
        gun_18      =    new Array("7/5/2015"," 2:45","03:05","4:50","12:30","16:24","19:52","21:39");
        gun_19      =    new Array("7/6/2015"," 2:46","03:06","4:51","12:30","16:24","19:52","21:38");
        gun_20      =    new);
        gun_6      =    new Array();
        gun_7      =    new Array( Array("7/7/2015"," 2:47","03:07","4:51","12:30","16:24","19:51","21:38");
        gun_21      =    new Array("7/8/2015"," 2:48","03:08","4:52","12:31","16:24","19:51","21:37");
        gun_22      =    new Array("7/9/2015"," 2:49","03:09","4:52","12:31","16:24","19:51","21:36");
        gun_23      =    new Array("7/10/2015"," 2:50","03:10","4:53","12:31","16:24","19:50","21:36");
        gun_24      =    new Array("7/11/2015"," 2:51","03:11","4:54","12:31","16:24","19:50","21:35");
        gun_25      =    new Array("7/12/2015"," 2:52","03:12","4:54","12:31","16:24","19:50","21:34");
        gun_26      =    new Array("7/13/2015"," 2:53","03:13","4:55","12:31","16:25","19:49","21:34");
        gun_27      =    new Array("7/14/2015"," 2:54","03:14","4:56","12:31","16:25","19:49","21:33");
        gun_28      =    new Array("7/15/2015"," 2:55","03:15","4:56","12:31","16:25","19:48","21:32");
        gun_29      =    new Array("7/16/2015"," 2:56","03:16","4:57","12:32","16:25","19:48","21:31");

	break;
	case "bayburt":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:24","02:44","4:41","12:30","16:29","20:01","21:58");
        gun_2      =    new Array("6/19/2015","2:24","02:44","4:41","12:30","16:30","20:02","21:58");
        gun_3      =    new Array("6/20/2015","2:24","02:44","4:41","12:30","16:30","20:02","21:58");
        gun_4      =    new Array("6/21/2015","2:24","02:44","4:41","12:31","16:30","20:02","21:59");
        gun_5      =    new Array("6/22/2015","2:24","02:44","4:41","12:31","16:30","20:02","21:59");
        gun_6      =    new Array("6/23/2015","2:24","02:44","4:42","12:31","16:30","20:03","21:59");
        gun_7      =    new Array("6/24/2015","2:25","02:45","4:42","12:31","16:31","20:03","21:59");
        gun_8      =    new Array("6/25/2015","2:25","02:45","4:42","12:32","16:31","20:03","21:59");
        gun_9      =    new Array("6/26/2015","2:25","02:45","4:42","12:32","16:31","20:03","21:59");
        gun_10      =    new Array("6/27/2015","2:26","02:46","4:43","12:32","16:31","20:03","21:59");
        gun_11      =    new Array("6/28/2015","2:27","02:47","4:43","12:32","16:31","20:03","21:59");
        gun_12      =    new Array("6/29/2015","2:27","02:47","4:44","12:32","16:32","20:03","21:59");
        gun_13      =    new Array("6/30/2015","2:28","02:48","4:44","12:33","16:32","20:03","21:58");
        gun_14      =    new Array("7/1/2015"," 2:29","02:49","4:45","12:33","16:32","20:03","21:58");
        gun_15      =    new Array("7/2/2015"," 2:29","02:49","4:45","12:33","16:32","20:03","21:58");
        gun_16      =    new Array("7/3/2015"," 2:30","02:50","4:46","12:33","16:32","20:02","21:57");
        gun_17      =    new Array("7/4/2015"," 2:31","02:51","4:46","12:33","16:32","20:02","21:57");
        gun_18      =    new Array("7/5/2015"," 2:32","02:52","4:47","12:33","16:32","20:02","21:56");
        gun_19      =    new Array("7/6/2015"," 2:33","02:53","4:47","12:34","16:32","20:02","21:56");
        gun_20      =    new Array("7/7/2015"," 2:34","02:54","4:48","12:34","16:32","20:02","21:55");
        gun_21      =    new Array("7/8/2015"," 2:35","02:55","4:48","12:34","16:33","20:01","21:54");
        gun_22      =    new Array("7/9/2015"," 2:36","02:56","4:49","12:34","16:33","20:01","21:54");
        gun_23      =    new Array("7/10/2015"," 2:37","02:57","4:50","12:34","16:33","20:00","21:53");
        gun_24      =    new Array("7/11/2015"," 2:38","02:58","4:50","12:34","16:33","20:00","21:52");
        gun_25      =    new Array("7/12/2015"," 2:40","03:00","4:51","12:35","16:33","20:00","21:51");
        gun_26      =    new Array("7/13/2015"," 2:41","03:01","4:52","12:35","16:33","19:59","21:50");
        gun_27      =    new Array("7/14/2015"," 2:42","03:02","4:53","12:35","16:33","19:59","21:49");
        gun_28      =    new Array("7/15/2015"," 2:43","03:03","4:53","12:35","16:33","19:58","21:48");
        gun_29      =    new Array("7/16/2015"," 2:45","03:05","4:54","12:35","16:33","19:57","21:47");

	break;
	case "bilecik":gun_1      =    new Array("6/18/2015","3:04","03:24","5:21","13:11","17:10","20:43","22:39");
		gun_2      = 	new Array("6/19/2015","3:04","03:24","5:21","13:11","17:11","20:43","22:40");
		gun_3      = 	new Array("6/20/2015","3:04","03:24","5:22","13:12","17:11","20:43","22:40");
		gun_4      = 	new Array("6/21/2015","3:05","03:25","5:22","13:12","17:11","20:44","22:40");
		gun_5      = 	new Array("6/22/2015","3:05","03:25","5:22","13:12","17:11","20:44","22:40");
		gun_6      = 	new Array("6/23/2015","3:05","03:25","5:22","13:12","17:11","20:44","22:40");
		gun_7      = 	new Array("6/24/2015","3:05","03:25","5:23","13:12","17:12","20:44","22:40");
		gun_8      = 	new Array("6/25/2015","3:06","03:26","5:23","13:13","17:12","20:44","22:41");
		gun_9      = 	new Array("6/26/2015","3:06","03:26","5:23","13:13","17:12","20:44","22:40");
		gun_10      = 	new Array("6/27/2015","3:07","03:27","5:24","13:13","17:12","20:44","22:40");
		gun_11      = 	new Array("6/28/2015","3:07","03:27","5:24","13:13","17:12","20:44","22:40");
		gun_12      = 	new Array("6/29/2015","3:08","03:28","5:24","13:13","17:13","20:44","22:40");
		gun_13      = 	new Array("6/30/2015","3:09","03:29","5:25","13:14","17:13","20:44","22:40");
		gun_14      = 	new Array("7/1/2015"," 3:09","03:29","5:25","13:14","17:13","20:44","22:39");
		gun_15      = 	new Array("7/2/2015"," 3:10","03:30","5:26","13:14","17:13","20:44","22:39");
		gun_16      = 	new Array("7/3/2015"," 3:11","03:31","5:26","13:14","17:13","20:44","22:39");
		gun_17      = 	new Array("7/4/2015"," 3:12","03:32","5:27","13:14","17:13","20:44","22:38");
		gun_18      = 	new Array("7/5/2015"," 3:13","03:33","5:27","13:15","17:13","20:44","22:38");
		gun_19      = 	new Array("7/6/2015"," 3:14","03:34","5:28","13:15","17:13","20:43","22:37");
		gun_20      = 	new Array("7/7/2015"," 3:15","03:35","5:29","13:15","17:13","20:43","22:37");
		gun_21      = 	new Array("7/8/2015"," 3:16","03:36","5:29","13:15","17:14","20:43","22:36");
		gun_22      = 	new Array("7/9/2015"," 3:17","03:37","5:30","13:15","17:14","20:42","22:35");
		gun_23      = 	new Array("7/10/2015"," 3:18","03:38","5:31","13:15","17:14","20:42","22:34");
		gun_24      = 	new Array("7/11/2015"," 3:19","03:39","5:31","13:16","17:14","20:42","22:34");
		gun_25      = 	new Array("7/12/2015"," 3:20","03:40","5:32","13:16","17:14","20:41","22:33");
		gun_26      = 	new Array("7/13/2015"," 3:22","03:42","5:33","13:16","17:14","20:41","22:32");
		gun_27      = 	new Array("7/14/2015"," 3:23","03:43","5:33","13:16","17:14","20:40","22:31");
		gun_28      = 	new Array("7/15/2015"," 3:24","03:44","5:34","13:16","17:14","20:39","22:30");
		gun_29      = 	new Array("7/16/2015"," 3:26","03:46","5:35","13:16","17:14","20:39","22:29");

	break;
	case "bingol":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:33","02:53","4:44","12:29","16:26","19:56","21:48");
        gun_2      =    new Array("6/19/2015","2:33","02:53","4:44","12:29","16:26","19:57","21:48");
        gun_3      =    new Array("6/20/2015","2:33","02:53","4:44","12:30","16:26","19:57","21:49");
        gun_4      =    new Array("6/21/2015","2:33","02:53","4:44","12:30","16:26","19:57","21:49");
        gun_5      =    new Array("6/22/2015","2:33","02:53","4:45","12:30","16:26","19:57","21:49");
        gun_6      =    new Array("6/23/2015","2:34","02:54","4:45","12:30","16:27","19:58","21:49");
        gun_7      =    new Array("6/24/2015","2:34","02:54","4:45","12:30","16:27","19:58","21:49");
        gun_8      =    new Array("6/25/2015","2:34","02:54","4:45","12:31","16:27","19:58","21:49");
        gun_9      =    new Array("6/26/2015","2:35","02:55","4:46","12:31","16:27","19:58","21:49");
        gun_10      =    new Array("6/27/2015","2:35","02:55","4:46","12:31","16:27","19:58","21:49");
        gun_11      =    new Array("6/28/2015","2:36","02:56","4:46","12:31","16:28","19:58","21:49");
        gun_12      =    new Array("6/29/2015","2:36","02:56","4:47","12:31","16:28","19:58","21:49");
        gun_13      =    new Array("6/30/2015","2:37","02:57","4:47","12:32","16:28","19:58","21:49");
        gun_14      =    new Array("7/1/2015"," 2:38","02:58","4:48","12:32","16:28","19:58","21:49");
        gun_15      =    new Array("7/2/2015"," 2:38","02:58","4:48","12:32","16:28","19:58","21:48");
        gun_16      =    new Array("7/3/2015"," 2:39","02:59","4:49","12:32","16:28","19:58","21:48");
        gun_17      =    new Array("7/4/2015"," 2:40","03:00","4:49","12:32","16:29","19:57","21:47");
        gun_18      =    new Array("7/5/2015"," 2:41","03:01","4:50","12:33","16:29","19:57","21:47");
        gun_19      =    new Array("7/6/2015"," 2:42","03:02","4:50","12:33","16:29","19:57","21:46");
        gun_20      =    new Array("7/7/2015"," 2:43","03:03","4:51","12:33","16:29","19:57","21:46");
        gun_21      =    new Array("7/8/2015"," 2:44","03:04","4:51","12:33","16:29","19:56","21:45");
        gun_22      =    new Array("7/9/2015"," 2:45","03:05","4:52","12:33","16:29","19:56","21:45");
        gun_23      =    new Array("7/10/2015"," 2:46","03:06","4:53","12:33","16:29","19:56","21:44");
        gun_24      =    new Array("7/11/2015"," 2:47","03:07","4:53","12:34","16:29","19:55","21:43");
        gun_25      =    new Array("7/12/2015"," 2:48","03:08","4:54","12:34","16:29","19:55","21:42");
        gun_26      =    new Array("7/13/2015"," 2:49","03:09","4:55","12:34","16:29","19:54","21:42");
        gun_27      =    new Array("7/14/2015"," 2:50","03:10","4:55","12:34","16:29","19:54","21:41");
        gun_28      =    new Array("7/15/2015"," 2:51","03:11","4:56","12:34","16:29","19:53","21:40");
        gun_29      =    new Array("7/16/2015"," 2:53","03:13","4:57","12:34","16:29","19:53","21:39");

	break;
	case "bitlis":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:30","02:50","4:39","12:23","16:18","19:49","21:39");
        gun_2      =    new Array("6/19/2015","2:30","02:50","4:39","12:23","16:18","19:49","21:39");
        gun_3      =    new Array("6/20/2015","2:30","02:50","4:39","12:23","16:18","19:49","21:39");
        gun_4      =    new Array("6/21/2015","2:30","02:50","4:39","12:23","16:19","19:49","21:39");
        gun_5      =    new Array("6/22/2015","2:30","02:50","4:39","12:24","16:19","19:50","21:40");
        gun_6      =    new Array("6/23/2015","2:31","02:51","4:40","12:24","16:19","19:50","21:40");
        gun_7      =    new Array("6/24/2015","2:31","02:51","4:40","12:24","16:19","19:50","21:40");
        gun_8      =    new Array("6/25/2015","2:31","02:51","4:40","12:24","16:19","19:50","21:40");
        gun_9      =    new Array("6/26/2015","2:32","02:52","4:41","12:24","16:20","19:50","21:40");
        gun_10      =    new Array("6/27/2015","2:32","02:52","4:41","12:25","16:20","19:50","21:40");
        gun_11      =    new Array("6/28/2015","2:33","02:53","4:41","12:25","16:20","19:50","21:40");
        gun_12      =    new Array("6/29/2015","2:33","02:53","4:42","12:25","16:20","19:50","21:40");
        gun_13      =    new Array("6/30/2015","2:34","02:54","4:42","12:25","16:20","19:50","21:39");
        gun_14      =    new Array("7/1/2015"," 2:34","02:54","4:42","12:25","16:21","19:50","21:39");
        gun_15      =    new Array("7/2/2015"," 2:35","02:55","4:43","12:26","16:21","19:50","21:39");
        gun_16      =    new Array("7/3/2015"," 2:36","02:56","4:43","12:26","16:21","19:50","21:39");
        gun_17      =    new Array("7/4/2015"," 2:37","02:57","4:44","12:26","16:21","19:50","21:38");
        gun_18      =    new Array("7/5/2015"," 2:38","02:58","4:45","12:26","16:21","19:50","21:38");
        gun_19      =    new Array("7/6/2015"," 2:38","02:58","4:45","12:26","16:21","19:49","21:37");
        gun_20      =    new Array("7/7/2015"," 2:39","02:59","4:46","12:26","16:21","19:49","21:37");
        gun_21      =    new Array("7/8/2015"," 2:40","03:00","4:46","12:27","16:21","19:49","21:36");
        gun_22      =    new Array("7/9/2015"," 2:41","03:01","4:47","12:27","16:21","19:48","21:35");
        gun_23      =    new Array("7/10/2015"," 2:42","03:02","4:47","12:27","16:22","19:48","21:35");
        gun_24      =    new Array("7/11/2015"," 2:43","03:03","4:48","12:27","16:22","19:48","21:34");
        gun_25      =    new Array("7/12/2015"," 2:44","03:04","4:49","12:27","16:22","19:47","21:33");
        gun_26      =    new Array("7/13/2015"," 2:45","03:05","4:49","12:27","16:22","19:47","21:33");
        gun_27      =    new Array("7/14/2015"," 2:47","03:07","4:50","12:27","16:22","19:46","21:32");
        gun_28      =    new Array("7/15/2015"," 2:48","03:08","4:51","12:28","16:22","19:46","21:31");
        gun_29      =    new Array("7/16/2015"," 2:49","03:09","4:52","12:28","16:22","19:45","21:30");

	break;
	case "bolu":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:53","03:13","5:13","13:05","17:05","20:38","22:37");
        gun_2      =    new Array("6/19/2015","2:53","03:13","5:13","13:05","17:05","20:39","22:37");
        gun_3      =    new Array("6/20/2015","2:53","03:13","5:13","13:05","17:05","20:39","22:38");
        gun_4      =    new Array("6/21/2015","2:53","03:13","5:13","13:05","17:06","20:39","22:38");
        gun_5      =    new Array("6/22/2015","2:53","03:13","5:13","13:05","17:06","20:39","22:38");
        gun_6      =    new Array("6/23/2015","2:53","03:13","5:14","13:06","17:06","20:39","22:38");
        gun_7      =    new Array("6/24/2015","2:54","03:14","5:14","13:06","17:06","20:40","22:38");
        gun_8      =    new Array("6/25/2015","2:54","03:14","5:14","13:06","17:06","20:40","22:38");
        gun_9      =    new Array("6/26/2015","2:55","03:15","5:15","13:06","17:07","20:40","22:38");
        gun_10      =    new Array("6/27/2015","2:55","03:15","5:15","13:06","17:07","20:40","22:38");
        gun_11      =    new Array("6/28/2015","2:56","03:16","5:15","13:07","17:07","20:40","22:38");
        gun_12      =    new Array("6/29/2015","2:56","03:16","5:16","13:07","17:07","20:40","22:38");
        gun_13      =    new Array("6/30/2015","2:57","03:17","5:16","13:07","17:07","20:40","22:37");
        gun_14      =    new Array("7/1/2015"," 2:58","03:18","5:17","13:07","17:07","20:40","22:37");
        gun_15      =    new Array("7/2/2015"," 2:59","03:19","5:17","13:07","17:08","20:39","22:37");
        gun_16      =    new Array("7/3/2015"," 2:59","03:19","5:18","13:08","17:08","20:39","22:36");
        gun_17      =    new Array("7/4/2015"," 3:00","03:20","5:18","13:08","17:08","20:39","22:36");
        gun_18      =    new Array("7/5/2015"," 3:01","03:21","5:19","13:08","17:08","20:39","22:35");
        gun_19      =    new Array("7/6/2015"," 3:02","03:22","5:19","13:08","17:08","20:39","22:35");
        gun_20      =    new Array("7/7/2015"," 3:03","03:23","5:20","13:08","17:08","20:38","22:34");
        gun_21      =    new Array("7/8/2015"," 3:05","03:25","5:21","13:09","17:08","20:38","22:33");
        gun_22      =    new Array("7/9/2015"," 3:06","03:26","5:21","13:09","17:08","20:38","22:33");
        gun_23      =    new Array("7/10/2015"," 3:07","03:27","5:22","13:09","17:08","20:37","22:32");
        gun_24      =    new Array("7/11/2015"," 3:08","03:28","5:23","13:09","17:08","20:37","22:31");
        gun_25      =    new Array("7/12/2015"," 3:09","03:29","5:23","13:09","17:08","20:36","22:30");
        gun_26      =    new Array("7/13/2015"," 3:11","03:31","5:24","13:09","17:08","20:36","22:29");
        gun_27      =    new Array("7/14/2015"," 3:12","03:32","5:25","13:09","17:08","20:35","22:28");
        gun_28      =    new Array("7/15/2015"," 3:13","03:33","5:26","13:09","17:08","20:35","22:27");
        gun_29      =    new Array("7/16/2015"," 3:15","03:35","5:27","13:10","17:08","20:34","22:26");

	break;
	case "burdur":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","3:22","03:42","5:28","13:10","17:04","20:34","22:22");
        gun_2      =    new Array("6/19/2015","3:22","03:42","5:28","13:10","17:04","20:34","22:22");
        gun_3      =    new Array("6/20/2015","3:22","03:42","5:28","13:10","17:04","20:34","22:22");
        gun_4      =    new Array("6/21/2015","3:22","03:42","5:28","13:11","17:04","20:35","22:23");
        gun_5      =    new Array("6/22/2015","3:22","03:42","5:29","13:11","17:05","20:35","22:23");
        gun_6      =    new Array("6/23/2015","3:22","03:42","5:29","13:11","17:05","20:35","22:23");
        gun_7      =    new Array("6/24/2015","3:23","03:43","5:29","13:11","17:05","20:35","22:23");
        gun_8      =    new Array("6/25/2015","3:23","03:43","5:29","13:11","17:05","20:35","22:23");
        gun_9      =    new Array("6/26/2015","3:24","03:44","5:30","13:12","17:05","20:35","22:23");
        gun_10      =    new Array("6/27/2015","3:24","03:44","5:30","13:12","17:06","20:35","22:23");
        gun_11      =    new Array("6/28/2015","3:24","03:44","5:31","13:12","17:06","20:36","22:23");
        gun_12      =    new Array("6/29/2015","3:25","03:45","5:31","13:12","17:06","20:35","22:23");
        gun_13      =    new Array("6/30/2015","3:26","03:46","5:31","13:12","17:06","20:35","22:23");
        gun_14      =    new Array("7/1/2015"," 3:26","03:46","5:32","13:13","17:06","20:35","22:22");
        gun_15      =    new Array("7/2/2015"," 3:27","03:47","5:32","13:13","17:07","20:35","22:22");
        gun_16      =    new Array("7/3/2015"," 3:28","03:48","5:33","13:13","17:07","20:35","22:22");
        gun_17      =    new Array("7/4/2015"," 3:28","03:48","5:33","13:13","17:07","20:35","22:22");
        gun_18      =    new Array("7/5/2015"," 3:29","03:49","5:34","13:13","17:07","20:35","22:21");
        gun_19      =    new Array("7/6/2015"," 3:30","03:50","5:34","13:14","17:07","20:35","22:21");
        gun_20      =    new Array("7/7/2015"," 3:31","03:51","5:35","13:14","17:07","20:34","22:20");
        gun_21      =    new Array("7/8/2015"," 3:32","03:52","5:35","13:14","17:07","20:34","22:20");
        gun_22      =    new Array("7/9/2015"," 3:33","03:53","5:36","13:14","17:07","20:34","22:19");
        gun_23      =    new Array("7/10/2015"," 3:34","03:54","5:37","13:14","17:07","20:33","22:18");
        gun_24      =    new Array("7/11/2015"," 3:35","03:55","5:37","13:14","17:08","20:33","22:18");
        gun_25      =    new Array("7/12/2015"," 3:36","03:56","5:38","13:14","17:08","20:33","22:17");
        gun_26      =    new Array("7/13/2015"," 3:37","03:57","5:39","13:15","17:08","20:32","22:16");
        gun_27      =    new Array("7/14/2015"," 3:38","03:58","5:39","13:15","17:08","20:32","22:15");
        gun_28      =    new Array("7/15/2015"," 3:39","03:59","5:40","13:15","17:08","20:31","22:15");
        gun_29      =    new Array("7/16/2015"," 3:40","04:00","5:41","13:15","17:08","20:31","22:14");

	break;
	case "bursa":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","3:08","03:28","5:25","13:15","17:14","20:47","22:43");
        gun_2      =    new Array("6/19/2015","3:08","03:28","5:25","13:15","17:14","20:47","22:43");
        gun_3      =    new Array("6/20/2015","3:08","03:28","5:25","13:15","17:15","20:47","22:44");
        gun_4      =    new Array("6/21/2015","3:08","03:28","5:25","13:15","17:15","20:48","22:44");
        gun_5      =    new Array("6/22/2015","3:08","03:28","5:26","13:16","17:15","20:48","22:44");
        gun_6      =    new Array("6/23/2015","3:08","03:28","5:26","13:16","17:15","20:48","22:44");
        gun_7      =    new Array("6/24/2015","3:09","03:29","5:26","13:16","17:15","20:48","22:44");
        gun_8      =    new Array("6/25/2015","3:09","03:29","5:26","13:16","17:16","20:48","22:44");
        gun_9      =    new Array("6/26/2015","3:10","03:30","5:27","13:17","17:16","20:48","22:44");
        gun_10      =    new Array("6/27/2015","3:10","03:30","5:27","13:17","17:16","20:48","22:44");
        gun_11      =    new Array("6/28/2015","3:11","03:31","5:28","13:17","17:16","20:48","22:44");
        gun_12      =    new Array("6/29/2015","3:11","03:31","5:28","13:17","17:16","20:48","22:44");
        gun_13      =    new Array("6/30/2015","3:12","03:32","5:28","13:17","17:16","20:48","22:44");
        gun_14      =    new Array("7/1/2015"," 3:13","03:33","5:29","13:18","17:17","20:48","22:43");
        gun_15      =    new Array("7/2/2015"," 3:14","03:34","5:29","13:18","17:17","20:48","22:43");
        gun_16      =    new Array("7/3/2015"," 3:14","03:34","5:30","13:18","17:17","20:48","22:43");
        gun_17      =    new Array("7/4/2015"," 3:15","03:35","5:30","13:18","17:17","20:48","22:42");
        gun_18      =    new Array("7/5/2015"," 3:16","03:36","5:31","13:18","17:17","20:47","22:42");
        gun_19      =    new Array("7/6/2015"," 3:17","03:37","5:32","13:18","17:17","20:47","22:41");
        gun_20      =    new Array("7/7/2015"," 3:18","03:38","5:32","13:19","17:17","20:47","22:40");
        gun_21      =    new Array("7/8/2015"," 3:19","03:39","5:33","13:19","17:17","20:46","22:40");
        gun_22      =    new Array("7/9/2015"," 3:20","03:40","5:33","13:19","17:17","20:46","22:39");
        gun_23      =    new Array("7/10/2015"," 3:21","03:41","5:34","13:19","17:17","20:46","22:38");
        gun_24      =    new Array("7/11/2015"," 3:23","03:43","5:35","13:19","17:17","20:45","22:37");
        gun_25      =    new Array("7/12/2015"," 3:24","03:44","5:35","13:19","17:17","20:45","22:37");
        gun_26      =    new Array("7/13/2015"," 3:25","03:45","5:36","13:19","17:17","20:44","22:36");
        gun_27      =    new Array("7/14/2015"," 3:26","03:46","5:37","13:20","17:17","20:44","22:35");
        gun_28      =    new Array("7/15/2015"," 3:28","03:48","5:38","13:20","17:17","20:43","22:34");
        gun_29      =    new Array("7/16/2015"," 3:29","03:49","5:38","13:20","17:17","20:43","22:33");

	break;
	case "denizli":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","3:26","03:46","5:33","13:15","17:09","20:39","22:27");
        gun_2      =    new Array("6/19/2015","3:26","03:46","5:33","13:15","17:09","20:39","22:27");
        gun_3      =    new Array("6/20/2015","3:26","03:46","5:33","13:15","17:09","20:39","22:27");
        gun_4      =    new Array("6/21/2015","3:27","03:47","5:33","13:15","17:09","20:40","22:28");
        gun_5      =    new Array("6/22/2015","3:27","03:47","5:33","13:16","17:10","20:40","22:28");
        gun_6      =    new Array("6/23/2015","3:27","03:47","5:34","13:16","17:10","20:40","22:28");
        gun_7      =    new Array("6/24/2015","3:27","03:47","5:34","13:16","17:10","20:40","22:28");
        gun_8      =    new Array("6/25/2015","3:28","03:48","5:34","13:16","17:10","20:40","22:28");
        gun_9      =    new Array("6/26/2015","3:28","03:48","5:35","13:16","17:10","20:40","22:28");
        gun_10      =    new Array("6/27/2015","3:29","03:49","5:35","13:17","17:11","20:40","22:28");
        gun_11      =    new Array("6/28/2015","3:29","03:49","5:35","13:17","17:11","20:40","22:28");
        gun_12      =    new Array("6/29/2015","3:30","03:50","5:36","13:17","17:11","20:40","22:28");
        gun_13      =    new Array("6/30/2015","3:30","03:50","5:36","13:17","17:11","20:40","22:28");
        gun_14      =    new Array("7/1/2015"," 3:31","03:51","5:36","13:17","17:11","20:40","22:27");
        gun_15      =    new Array("7/2/2015"," 3:32","03:52","5:37","13:18","17:11","20:40","22:27");
        gun_16      =    new Array("7/3/2015"," 3:32","03:52","5:37","13:18","17:12","20:40","22:27");
        gun_17      =    new Array("7/4/2015"," 3:33","03:53","5:38","13:18","17:12","20:40","22:27");
        gun_18      =    new Array("7/5/2015"," 3:34","03:54","5:38","13:18","17:12","20:40","22:26");
        gun_19      =    new Array("7/6/2015"," 3:35","03:55","5:39","13:18","17:12","20:40","22:26");
        gun_20      =    new Array("7/7/2015"," 3:36","03:56","5:40","13:19","17:12","20:39","22:25");
        gun_21      =    new Array("7/8/2015"," 3:36","03:56","5:40","13:19","17:12","20:39","22:25");
        gun_22      =    new Array("7/9/2015"," 3:37","03:57","5:41","13:19","17:12","20:39","22:24");
        gun_23      =    new Array("7/10/2015"," 3:38","03:58","5:41","13:19","17:12","20:38","22:23");
        gun_24      =    new Array("7/11/2015"," 3:39","03:59","5:42","13:19","17:12","20:38","22:23");
        gun_25      =    new Array("7/12/2015"," 3:40","04:00","5:43","13:19","17:12","20:38","22:22");
        gun_26      =    new Array("7/13/2015"," 3:41","04:01","5:43","13:19","17:12","20:37","22:21");
        gun_27      =    new Array("7/14/2015"," 3:43","04:03","5:44","13:20","17:12","20:37","22:20");
        gun_28      =    new Array("7/15/2015"," 3:44","04:04","5:45","13:20","17:13","20:36","22:20");
        gun_29      =    new Array("7/16/2015"," 3:45","04:05","5:45","13:20","17:12","20:36","22:19");

	break;
	case "diyarbakir":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:41","03:01","4:48","12:30","16:24","19:55","21:43");
        gun_2      =    new Array("6/19/2015","2:41","03:01","4:48","12:30","16:25","19:55","21:44");
        gun_3      =    new Array("6/20/2015","2:41","03:01","4:48","12:31","16:25","19:55","21:44");
        gun_4      =    new Array("6/21/2015","2:41","03:01","4:48","12:31","16:25","19:55","21:44");
        gun_5      =    new Array("6/22/2015","2:41","03:01","4:48","12:31","16:25","19:56","21:44");
        gun_6      =    new Array("6/23/2015","2:41","03:01","4:49","12:31","16:25","19:56","21:44");
        gun_7      =    new Array("6/24/2015","2:42","03:02","4:49","12:31","16:26","19:56","21:44");
        gun_8      =    new Array("6/25/2015","2:42","03:02","4:49","12:32","16:26","19:56","21:45");
        gun_9      =    new Array("6/26/2015","2:42","03:02","4:49","12:32","16:26","19:56","21:45");
        gun_10      =    new Array("6/27/2015","2:43","03:03","4:50","12:32","16:26","19:56","21:44");
        gun_11      =    new Array("6/28/2015","2:43","03:03","4:50","12:32","16:26","19:56","21:44");
        gun_12      =    new Array("6/29/2015","2:44","03:04","4:51","12:32","16:27","19:56","21:44");
        gun_13      =    new Array("6/30/2015","2:45","03:05","4:51","12:33","16:27","19:56","21:44");
        gun_14      =    new Array("7/1/2015"," 2:45","03:05","4:51","12:33","16:27","19:56","21:44");
        gun_15      =    new Array("7/2/2015"," 2:46","03:06","4:52","12:33","16:27","19:56","21:44");
        gun_16      =    new Array("7/3/2015"," 2:47","03:07","4:52","12:33","16:27","19:56","21:43");
        gun_17      =    new Array("7/4/2015"," 2:47","03:07","4:53","12:33","16:27","19:56","21:43");
        gun_18      =    new Array("7/5/2015"," 2:48","03:08","4:53","12:34","16:28","19:56","21:42");
        gun_19      =    new Array("7/6/2015"," 2:49","03:09","4:54","12:34","16:28","19:55","21:42");
        gun_20      =    new Array("7/7/2015"," 2:50","03:10","4:55","12:34","16:28","19:55","21:41");
        gun_21      =    new Array("7/8/2015"," 2:51","03:11","4:55","12:34","16:28","19:55","21:41");
        gun_22      =    new Array("7/9/2015"," 2:52","03:12","4:56","12:34","16:28","19:55","21:40");
        gun_23      =    new Array("7/10/2015"," 2:53","03:13","4:56","12:34","16:28","19:54","21:40");
        gun_24      =    new Array("7/11/2015"," 2:54","03:14","4:57","12:35","16:28","19:54","21:39");
        gun_25      =    new Array("7/12/2015"," 2:55","03:15","4:58","12:35","16:28","19:53","21:38");
        gun_26      =    new Array("7/13/2015"," 2:56","03:16","4:58","12:35","16:28","19:53","21:37");
        gun_27      =    new Array("7/14/2015"," 2:57","03:17","4:59","12:35","16:28","19:52","21:37");
        gun_28      =    new Array("7/15/2015"," 2:58","03:18","5:00","12:35","16:28","19:52","21:36");
        gun_29      =    new Array("7/16/2015"," 2:59","03:19","5:00","12:35","16:28","19:51","21:35");

	break;
	case "duzce":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:55","03:15","5:15","13:06","17:07","20:40","22:39");
        gun_2      =    new Array("6/19/2015","2:55","03:15","5:15","13:07","17:07","20:40","22:39");
        gun_3      =    new Array("6/20/2015","2:55","03:15","5:15","13:07","17:08","20:40","22:39");
        gun_4      =    new Array("6/21/2015","2:55","03:15","5:16","13:07","17:08","20:41","22:40");
        gun_5      =    new Array("6/22/2015","2:55","03:15","5:16","13:07","17:08","20:41","22:40");
        gun_6      =    new Array("6/23/2015","2:56","03:16","5:16","13:08","17:08","20:41","22:40");
        gun_7      =    new Array("6/24/2015","2:56","03:16","5:16","13:08","17:08","20:41","22:40");
        gun_8      =    new Array("6/25/2015","2:56","03:16","5:17","13:08","17:09","20:41","22:40");
        gun_9      =    new Array("6/26/2015","2:57","03:17","5:17","13:08","17:09","20:41","22:40");
        gun_10      =    new Array("6/27/2015","2:57","03:17","5:17","13:08","17:09","20:41","22:40");
        gun_11      =    new Array("6/28/2015","2:58","03:18","5:18","13:09","17:09","20:41","22:40");
        gun_12      =    new Array("6/29/2015","2:59","03:19","5:18","13:09","17:09","20:41","22:39");
        gun_13      =    new Array("6/30/2015","2:59","03:19","5:19","13:09","17:09","20:41","22:39");
        gun_14      =    new Array("7/1/2015"," 3:00","03:20","5:19","13:09","17:10","20:41","22:39");
        gun_15      =    new Array("7/2/2015"," 3:01","03:21","5:19","13:09","17:10","20:41","22:38");
        gun_16      =    new Array("7/3/2015"," 3:02","03:22","5:20","13:10","17:10","20:41","22:38");
        gun_17      =    new Array("7/4/2015"," 3:03","03:23","5:21","13:10","17:10","20:41","22:37");
        gun_18      =    new Array("7/5/2015"," 3:04","03:24","5:21","13:10","17:10","20:40","22:37");
        gun_19      =    new Array("7/6/2015"," 3:05","03:25","5:22","13:10","17:10","20:40","22:36");
        gun_20      =    new Array("7/7/2015"," 3:06","03:26","5:22","13:10","17:10","20:40","22:36");
        gun_21      =    new Array("7/8/2015"," 3:07","03:27","5:23","13:10","17:10","20:40","22:35");
        gun_22      =    new Array("7/9/2015"," 3:08","03:28","5:24","13:11","17:10","20:39","22:34");
        gun_23      =    new Array("7/10/2015"," 3:09","03:29","5:24","13:11","17:10","20:39","22:33");
        gun_24      =    new Array("7/11/2015"," 3:10","03:30","5:25","13:11","17:10","20:38","22:33");
        gun_25      =    new Array("7/12/2015"," 3:11","03:31","5:26","13:11","17:10","20:38","22:32");
        gun_26      =    new Array("7/13/2015"," 3:13","03:33","5:26","13:11","17:10","20:37","22:31");
        gun_27      =    new Array("7/14/2015"," 3:14","03:34","5:27","13:11","17:10","20:37","22:30");
        gun_28      =    new Array("7/15/2015"," 3:15","03:35","5:28","13:11","17:10","20:36","22:29");
        gun_29      =    new Array("7/16/2015"," 3:17","03:37","5:29","13:11","17:10","20:36","22:28");

	break;
	case "edirne":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","3:06","03:26","5:31","13:25","17:27","21:01","23:03");
        gun_2      =    new Array("6/19/2015","3:06","03:26","5:31","13:25","17:27","21:01","23:04");
        gun_3      =    new Array("6/20/2015","3:06","03:26","5:31","13:25","17:28","21:02","23:04");
        gun_4      =    new Array("6/21/2015","3:06","03:26","5:31","13:25","17:28","21:02","23:04");
        gun_5      =    new Array("6/22/2015","3:06","03:26","5:31","13:26","17:28","21:02","23:04");
        gun_6      =    new Array("6/23/2015","3:06","03:26","5:31","13:26","17:28","21:02","23:05");
        gun_7      =    new Array("6/24/2015","3:07","03:27","5:32","13:26","17:29","21:02","23:05");
        gun_8      =    new Array("6/25/2015","3:07","03:27","5:32","13:26","17:29","21:02","23:05");
        gun_9      =    new Array("6/26/2015","3:08","03:28","5:32","13:27","17:29","21:03","23:05");
        gun_10      =    new Array("6/27/2015","3:08","03:28","5:33","13:27","17:29","21:03","23:04");
        gun_11      =    new Array("6/28/2015","3:09","03:29","5:33","13:27","17:29","21:03","23:04");
        gun_12      =    new Array("6/29/2015","3:09","03:29","5:34","13:27","17:29","21:03","23:04");
        gun_13      =    new Array("6/30/2015","3:10","03:30","5:34);
        gun_23      =    new Array(","13:27","17:30","21:02","23:04");
        gun_14      =    new Array("7/1/2015"," 3:11","03:31","5:35","13:28","17:30","21:02","23:03");
        gun_15      =    new Array("7/2/2015"," 3:12","03:32","5:35","13:28","17:30","21:02","23:03");
        gun_16      =    new Array("7/3/2015"," 3:13","03:33","5:36","13:28","17:30","21:02","23:02");
        gun_17      =    new Array("7/4/2015"," 3:14","03:34","5:36","13:28","17:30","21:02","23:02");
        gun_18      =    new Array("7/5/2015"," 3:15","03:35","5:37","13:28","17:30","21:02","23:01");
        gun_19      =    new Array("7/6/2015"," 3:16","03:36","5:37","13:28","17:30","21:01","23:01");
        gun_20      =    new Array("7/7/2015"," 3:17","03:37","5:38","13:29","17:30","21:01","23:00");
        gun_21      =    new Array("7/8/2015"," 3:18","03:38","5:39","13:29","17:30","21:01","22:59");
        gun_22      =    new Array("7/9/2015"," 3:19","03:39","5:39","13:29","17:30","21:00","22:58");
        gun_23      =    new Array("7/10/2015"," 3:21","03:41","5:40","13:29","17:30","21:00","22:58");
        gun_24      =    new Array("7/11/2015"," 3:22","03:42","5:41","13:29","17:30","20:59","22:57");
        gun_25      =    new Array("7/12/2015"," 3:23","03:43","5:41","13:29","17:30","20:59","22:56");
        gun_26      =    new Array("7/13/2015"," 3:25","03:45","5:42","13:29","17:30","20:58","22:55");
        gun_27      =    new Array("7/14/2015"," 3:26","03:46","5:43","13:30","17:30","20:58","22:54");
        gun_28      =    new Array("7/15/2015"," 3:27","03:47","5:44","13:30","17:30","20:57","22:53");
        gun_29      =    new Array("7/16/2015"," 3:29","03:49","5:45","13:30","17:30","20:56","22:51");

	break;
	case "elazig":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:40","03:00","4:50","12:34","16:30","20:01","21:52");
        gun_2      =    new Array("6/19/2015","2:40","03:00","4:50","12:34","16:30","20:01","21:52");
        gun_3      =    new Array("6/20/2015","2:40","03:00","4:50","12:35","16:31","20:01","21:52");
        gun_4      =    new Array("6/21/2015","2:40","03:00","4:50","12:35","16:31","20:02","21:52");
        gun_5      =    new Array("6/22/2015","2:40","03:00","4:50","12:35","16:31","20:02","21:53");
        gun_6      =    new Array("6/23/2015","2:40","03:00","4:50","12:35","16:31","20:02","21:53");
        gun_7      =    new Array("6/24/2015","2:41","03:01","4:51","12:35","16:31","20:02","21:53");
        gun_8      =    new Array("6/25/2015","2:41","03:01","4:51","12:36","16:32","20:02","21:53");
        gun_9      =    new Array("6/26/2015","2:41","03:01","4:51","12:36","16:32","20:02","21:53");
        gun_10      =    new Array("6/27/2015","2:42","03:02","4:52","12:36","16:32","20:02","21:53");
        gun_11      =    new Array("6/28/2015","2:42","03:02","4:52","12:36","16:32","20:02","21:53");
        gun_12      =    new Array("6/29/2015","2:43","03:03","4:52","12:36","16:32","20:02","21:53");
        gun_13      =    new Array("6/30/2015","2:44","03:04","4:53","12:37","16:32","20:02","21:52");
        gun_14      =    new Array("7/1/2015"," 2:44","03:04","4:53","12:37","16:33","20:02","21:52");
        gun_15      =    new Array("7/2/2015"," 2:45","03:05","4:54","12:37","16:33","20:02","21:52");
        gun_16      =    new Array("7/3/2015"," 2:46","03:06","4:54","12:37","16:33","20:02","21:51");
        gun_17      =    new Array("7/4/2015"," 2:47","03:07","4:55","12:37","16:33","20:02","21:51");
        gun_18      =    new Array("7/5/2015"," 2:47","03:07","4:55","12:38","16:33","20:02","21:51");
        gun_19      =    new Array("7/6/2015"," 2:48","03:08","4:56","12:38","16:33","20:01","21:50");
        gun_20      =    new Array("7/7/2015"," 2:49","03:09","4:57","12:38","16:33","20:01","21:50");
        gun_21      =    new Array("7/8/2015"," 2:50","03:10","4:57","12:38","16:33","20:01","21:49");
        gun_22      =    new Array("7/9/2015"," 2:51","03:11","4:58","12:38","16:34","20:00","21:48");
        gun_23      =    new Array("7/10/2015"," 2:52","03:12","4:58","12:38","16:34","20:00","21:48");
        gun_24      =    new Array("7/11/2015"," 2:53","03:13","4:59","12:39","16:34","20:00","21:47");
        gun_25      =    new Array("7/12/2015"," 2:54","03:14","5:00","12:39","16:34","19:59","21:46");
        gun_26      =    new Array("7/13/2015"," 2:55","03:15","5:00","12:39","16:34","19:59","21:45");
        gun_27      =    new Array("7/14/2015"," 2:57","03:17","5:01","12:39","16:34","19:58","21:45");
        gun_28      =    new Array("7/15/2015"," 2:58","03:18","5:02","12:39","16:34","19:58","21:44");
        gun_29      =    new Array("7/16/2015"," 2:59","03:19","5:03","12:39","16:34","19:57","21:43");

	break;
	case "erzincan":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:30","02:50","4:45","12:33","16:31","20:03","21:58");
        gun_2      =    new Array("6/19/2015","2:30","02:50","4:45","12:33","16:32","20:04","21:58");
        gun_3      =    new Array("6/20/2015","2:30","02:50","4:45","12:33","16:32","20:04","21:59");
        gun_4      =    new Array("6/21/2015","2:30","02:50","4:45","12:34","16:32","20:04","21:59");
        gun_5      =    new Array("6/22/2015","2:30","02:50","4:45","12:34","16:32","20:04","21:59");
        gun_6      =    new Array("6/23/2015","2:31","02:51","4:46","12:34","16:32","20:05","21:59");
        gun_7      =    new Array("6/24/2015","2:31","02:51","4:46","12:34","16:33","20:05","21:59");
        gun_8      =    new Array("6/25/2015","2:31","02:51","4:46","12:35","16:33","20:05","21:59");
        gun_9      =    new Array("6/26/2015","2:32","02:52","4:47","12:35","16:33","20:05","21:59");
        gun_10      =    new Array("6/27/2015","2:32","02:52","4:47","12:35","16:33","20:05","21:59");
        gun_11      =    new Array("6/28/2015","2:33","02:53","4:47","12:35","16:33","20:05","21:59");
        gun_12      =    new Array("6/29/2015","2:33","02:53","4:48","12:35","16:34","20:05","21:59");
        gun_13      =    new Array("6/30/2015","2:34","02:54","4:48","12:36","16:34","20:05","21:59");
        gun_14      =    new Array("7/1/2015"," 2:35","02:55","4:49","12:36","16:34","20:05","21:58");
        gun_15      =    new Array("7/2/2015"," 2:36","02:56","4:49","12:36","16:34","20:05","21:58");
        gun_16      =    new Array("7/3/2015"," 2:36","02:56","4:50","12:36","16:34","20:05","21:58");
        gun_17      =    new Array("7/4/2015"," 2:37","02:57","4:50","12:36","16:34","20:04","21:57");
        gun_18      =    new Array("7/5/2015"," 2:38","02:58","4:51","12:37","16:34","20:04","21:57");
        gun_19      =    new Array("7/6/2015"," 2:39","02:59","4:51","12:37","16:34","20:04","21:56");
        gun_20      =    new Array("7/7/2015"," 2:40","03:00","4:52","12:37","16:34","20:04","21:56");
        gun_21      =    new Array("7/8/2015"," 2:41","03:01","4:52","12:37","16:35","20:03","21:55");
        gun_22      =    new Array("7/9/2015"," 2:42","03:02","4:53","12:37","16:35","20:03","21:54");
        gun_23      =    new Array("7/10/2015"," 2:43","03:03","4:54","12:37","16:35","20:03","21:54");
        gun_24      =    new Array("7/11/2015"," 2:44","03:04","4:54","12:37","16:35","20:02","21:53");
        gun_25      =    new Array("7/12/2015"," 2:45","03:05","4:55","12:38","16:35","20:02","21:52");
        gun_26      =    new Array("7/13/2015"," 2:47","03:07","4:56","12:38","16:35","20:01","21:51");
        gun_27      =    new Array("7/14/2015"," 2:48","03:08","4:57","12:38","16:35","20:01","21:50");
        gun_28      =    new Array("7/15/2015"," 2:49","03:09","4:57","12:38","16:35","20:00","21:49");
        gun_29      =    new Array("7/16/2015"," 2:50","03:10","4:58","12:38","16:35","20:00","21:48");

	break;
	case "erzurum":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:21","02:41","4:37","12:26","16:25","19:57","21:52");
        gun_2      =    new Array("6/19/2015","2:22","02:42","4:37","12:26","16:25","19:57","21:52");
        gun_3      =    new Array("6/20/2015","2:22","02:42","4:37","12:26","16:25","19:57","21:53");
        gun_4      =    new Array("6/21/2015","2:22","02:42","4:38","12:27","16:25","19:57","21:53");
        gun_5      =    new Array("6/22/2015","2:22","02:42","4:38","12:27","16:26","19:58","21:53");
        gun_6      =    new Array("6/23/2015","2:22","02:42","4:38","12:27","16:26","19:58","21:53");
        gun_7      =    new Array("6/24/2015","2:23","02:43","4:38","12:27","16:26","19:58","21:53");
        gun_8      =    new Array("6/25/2015","2:23","02:43","4:39","12:27","16:26","19:58","21:53");
        gun_9      =    new Array("6/26/2015","2:23","02:43","4:39","12:28","16:26","19:58","21:53");
        gun_10      =    new Array("6/27/2015","2:24","02:44","4:39","12:28","16:27","19:58","21:53");
        gun_11      =    new Array("6/28/2015","2:24","02:44","4:40","12:28","16:27","19:58","21:53");
        gun_12      =    new Array("6/29/2015","2:25","02:45","4:40","12:28","16:27","19:58","21:53");
        gun_13      =    new Array("6/30/2015","2:26","02:46","4:41","12:28","16:27","19:58","21:53");
        gun_14      =    new Array("7/1/2015"," 2:26","02:46","4:41","12:29","16:27","19:58","21:52");
        gun_15      =    new Array("7/2/2015"," 2:27","02:47","4:42","12:29","16:27","19:58","21:52");
        gun_16      =    new Array("7/3/2015"," 2:28","02:48","4:42","12:29","16:27","19:58","21:52");
        gun_17      =    new Array("7/4/2015"," 2:29","02:49","4:43","12:29","16:28","19:58","21:51");
        gun_18      =    new Array("7/5/2015"," 2:30","02:50","4:43","12:29","16:28","19:57","21:51");
        gun_19      =    new Array("7/6/2015"," 2:31","02:51","4:44","12:30","16:28","19:57","21:50");
        gun_20      =    new Array("7/7/2015"," 2:32","02:52","4:44","12:30","16:28","19:57","21:49");
        gun_21      =    new Array("7/8/2015"," 2:33","02:53","4:45","12:30","16:28","19:57","21:49");
        gun_22      =    new Array("7/9/2015"," 2:34","02:54","4:46","12:30","16:28","19:56","21:48");
        gun_23      =    new Array("7/10/2015"," 2:35","02:55","4:46","12:30","16:28","19:56","21:47");
        gun_24      =    new Array("7/11/2015"," 2:36","02:56","4:47","12:30","16:28","19:55","21:47");
        gun_25      =    new Array("7/12/2015"," 2:37","02:57","4:48","12:30","16:28","19:55","21:46");
        gun_26      =    new Array("7/13/2015"," 2:38","02:58","4:48","12:31","16:28","19:54","21:45");
        gun_27      =    new Array("7/14/2015"," 2:40","03:00","4:49","12:31","16:28","19:54","21:44");
        gun_28      =    new Array("7/15/2015"," 2:41","03:01","4:50","12:31","16:28","19:53","21:43");
        gun_29      =    new Array("7/16/2015"," 2:42","03:02","4:51","12:31","16:28","19:53","21:42");

	break;
	case "eskisehir":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","3:06","03:26","5:21","13:09","17:07","20:39","22:34");
        gun_2      =    new Array("6/19/2015","3:06","03:26","5:21","13:09","17:08","20:40","22:34");
        gun_3      =    new Array("6/20/2015","3:06","03:26","5:21","13:09","17:08","20:40","22:34");
        gun_4      =    new Array("6/21/2015","3:06","03:26","5:21","13:10","17:08","20:40","22:35");
        gun_5      =    new Array("6/22/2015","3:07","03:27","5:22","13:10","17:08","20:40","22:35");
        gun_6      =    new Array("6/23/2015","3:07","03:27","5:22","13:10","17:08","20:40","22:35");
        gun_7      =    new Array("6/24/2015","3:07","03:27","5:22","13:10","17:09","20:41","22:35");
        gun_8      =    new Array("6/25/2015","3:08","03:28","5:22","13:11","17:09","20:41","22:35");
        gun_9      =    new Array("6/26/2015","3:08","03:28","5:23","13:11","17:09","20:41","22:35");
        gun_10      =    new Array("6/27/2015","3:08","03:28","5:23","13:11","17:09","20:41","22:35");
        gun_11      =    new Array("6/28/2015","3:09","03:29","5:24","13:11","17:09","20:41","22:35");
        gun_12      =    new Array("6/29/2015","3:10","03:30","5:24","13:11","17:10","20:41","22:35");
        gun_13      =    new Array("6/30/2015","3:10","03:30","5:24","13:12","17:10","20:41","22:34");
        gun_14      =    new Array("7/1/2015"," 3:11","03:31","5:25","13:12","17:10","20:41","22:34");
        gun_15      =    new Array("7/2/2015"," 3:12","03:32","5:25","13:12","17:10","20:40","22:34");
        gun_16      =    new Array("7/3/2015"," 3:13","03:33","5:26","13:12","17:10","20:40","22:33");
        gun_17      =    new Array("7/4/2015"," 3:13","03:33","5:26","13:12","17:10","20:40","22:33");
        gun_18      =    new Array("7/5/2015"," 3:14","03:34","5:27","13:13","17:10","20:40","22:32");
        gun_19      =    new Array("7/6/2015"," 3:15","03:35","5:27","13:13","17:10","20:40","22:32");
        gun_20      =    new Array("7/7/2015"," 3:16","03:36","5:28","13:13","17:11","20:39","22:31");
        gun_21      =    new Array("7/8/2015"," 3:17","03:37","5:29","13:13","17:11","20:39","22:31");
        gun_22      =    new Array("7/9/2015"," 3:18","03:38","5:29","13:13","17:11","20:39","22:30");
        gun_23      =    new Array("7/10/2015"," 3:19","03:39","5:30","13:13","17:11","20:38","22:29");
        gun_24      =    new Array("7/11/2015"," 3:21","03:41","5:31","13:13","17:11","20:38","22:28");
        gun_25      =    new Array("7/12/2015"," 3:22","03:42","5:31","13:14","17:11","20:37","22:28");
        gun_26      =    new Array("7/13/2015"," 3:23","03:43","5:32","13:14","17:11","20:37","22:27");
        gun_27      =    new Array("7/14/2015"," 3:24","03:44","5:33","13:14","17:11","20:36","22:26");
        gun_28      =    new Array("7/15/2015"," 3:25","03:45","5:34","13:14","17:11","20:36","22:25");
        gun_29      =    new Array("7/16/2015"," 3:27","03:47","5:34","13:14","17:11","20:35","22:24");

	break;
	case "gaziantep":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:58","03:18","5:02","12:42","16:34","20:03","21:49");
        gun_2      =    new Array("6/19/2015","2:58","03:18","5:02","12:42","16:34","20:04","21:50");
        gun_3      =    new Array("6/20/2015","2:58","03:18","5:02","12:42","16:34","20:04","21:50");
        gun_4      =    new Array("6/21/2015","2:59","03:19","5:03","12:42","16:35","20:04","21:50");
        gun_5      =    new Array("6/22/2015","2:59","03:19","5:03","12:43","16:35","20:04","21:50");
        gun_6      =    new Array("6/23/2015","2:59","03:19","5:03","12:43","16:35","20:04","21:50");
        gun_7      =    new Array("6/24/2015","2:59","03:19","5:03","12:43","16:35","20:05","21:50");
        gun_8      =    new Array("6/25/2015","3:00","03:20","5:04","12:43","16:36","20:05","21:51");
        gun_9      =    new Array("6/26/2015","3:00","03:20","5:04","12:43","16:36","20:05","21:51");
        gun_10      =    new Array("6/27/2015","3:01","03:21","5:04","12:44","16:36","20:05","21:51");
        gun_11      =    new Array("6/28/2015","3:01","03:21","5:05","12:44","16:36","20:05","21:50");
        gun_12      =    new Array("6/29/2015","3:02","03:22","5:05","12:44","16:36","20:05","21:50");
        gun_13      =    new Array("6/30/2015","3:02","03:22","5:05","12:44","16:36","20:05","21:50");
        gun_14      =    new Array("7/1/2015"," 3:03","03:23","5:06","12:44","16:37","20:05","21:50");
        gun_15      =    new Array("7/2/2015"," 3:03","03:23","5:06","12:45","16:37","20:05","21:50");
        gun_16      =    new Array("7/3/2015"," 3:04","03:24","5:07","12:45","16:37","20:05","21:49");
        gun_17      =    new Array("7/4/2015"," 3:05","03:25","5:07","12:45","16:37","20:04","21:49");
        gun_18      =    new Array("7/5/2015"," 3:06","03:26","5:08","12:45","16:37","20:04","21:49");
        gun_19      =    new Array("7/6/2015"," 3:06","03:26","5:08","12:45","16:37","20:04","21:48");
        gun_20      =    new Array("7/7/2015"," 3:07","03:27","5:09","12:45","16:37","20:04","21:48");
        gun_21      =    new Array("7/8/2015"," 3:08","03:28","5:09","12:46","16:38","20:04","21:47");
        gun_22      =    new Array("7/9/2015"," 3:09","03:29","5:10","12:46","16:38","20:03","21:47");
        gun_23      =    new Array("7/10/2015"," 3:10","03:30","5:11","12:46","16:38","20:03","21:46");
        gun_24      =    new Array("7/11/2015"," 3:11","03:31","5:11","12:46","16:38","20:03","21:45");
        gun_25      =    new Array("7/12/2015"," 3:12","03:32","5:12","12:46","16:38","20:02","21:45");
        gun_26      =    new Array("7/13/2015"," 3:13","03:33","5:13","12:46","16:38","20:02","21:44");
        gun_27      =    new Array("7/14/2015"," 3:14","03:34","5:13","12:46","16:38","20:01","21:43");
        gun_28      =    new Array("7/15/2015"," 3:15","03:35","5:14","12:47","16:38","20:01","21:42");
        gun_29      =    new Array("7/16/2015"," 3:16","03:36","5:15","12:47","16:38","20:00","21:42");

	break;
	case "giresun":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:24","02:44","4:45","12:37","16:38","20:12","22:11");
        gun_2      =    new Array("6/19/2015","2:24","02:44","4:45","12:38","16:38","20:12","22:11");
        gun_3      =    new Array("6/20/2015","2:24","02:44","4:45","12:38","16:39","20:12","22:12");
        gun_4      =    new Array("6/21/2015","2:24","02:44","4:46","12:38","16:39","20:13","22:12");
        gun_5      =    new Array("6/22/2015","2:25","02:45","4:46","12:38","16:39","20:13","22:12");
        gun_6      =    new Array("6/23/2015","2:25","02:45","4:46","12:38","16:39","20:13","22:12");
        gun_7      =    new Array("6/24/2015","2:25","02:45","4:46","12:39","16:39","20:13","22:12");
        gun_8      =    new Array("6/25/2015","2:26","02:46","4:47","12:39","16:40","20:13","22:12");
        gun_9      =    new Array("6/26/2015","2:26","02:46","4:47","12:39","16:40","20:13","22:12");
        gun_10      =    new Array("6/27/2015","2:26","02:46","4:47","12:39","16:40","20:13","22:12");
        gun_11      =    new Array("6/28/2015","2:27","02:47","4:48","12:40","16:40","20:13","22:12");
        gun_12      =    new Array("6/29/2015","2:28","02:48","4:48","12:40","16:40","20:13","22:12");
        gun_13      =    new Array("6/30/2015","2:28","02:48","4:49","12:40","16:41","20:13","22:12");
        gun_14      =    new Array("7/1/2015"," 2:29","02:49","4:49","12:40","16:41","20:13","22:11");
        gun_15      =    new Array("7/2/2015"," 2:30","02:50","4:50","12:40","16:41","20:13","22:11");
        gun_16      =    new Array("7/3/2015"," 2:31","02:51","4:50","12:41","16:41","20:13","22:10");
        gun_17      =    new Array("7/4/2015"," 2:32","02:52","4:51","12:41","16:41","20:13","22:10");
        gun_18      =    new Array("7/5/2015"," 2:33","02:53","4:51","12:41","16:41","20:12","22:09");
        gun_19      =    new Array("7/6/2015"," 2:34","02:54","4:52","12:41","16:41","20:12","22:09");
        gun_20      =    new Array("7/7/2015"," 2:35","02:55","4:52","12:41","16:41","20:12","22:08");
        gun_21      =    new Array("7/8/2015"," 2:36","02:56","4:53","12:41","16:41","20:11","22:07");
        gun_22      =    new Array("7/9/2015"," 2:37","02:57","4:54","12:42","16:41","20:11","22:07");
        gun_23      =    new Array("7/10/2015"," 2:38","02:58","4:54","12:42","16:41","20:11","22:06");
        gun_24      =    new Array("7/11/2015"," 2:40","03:00","4:55","12:42","16:41","20:10","22:05");
        gun_25      =    new Array("7/12/2015"," 2:41","03:01","4:56","12:42","16:41","20:10","22:04");
        gun_26      =    new Array("7/13/2015"," 2:42","03:02","4:57","12:42","16:41","20:09","22:03");
        gun_27      =    new Array("7/14/2015"," 2:43","03:03","4:57","12:42","16:41","20:09","22:02");
        gun_28      =    new Array("7/15/2015"," 2:45","03:05","4:58","12:42","16:41","20:08","22:01");
        gun_29      =    new Array("7/16/2015"," 2:46","03:06","4:59","12:42","16:41","20:07","22:00");

	break;
	case "gumushane":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:24","02:44","4:43","12:33","16:33","20:06","22:03");
        gun_2      =    new Array("6/19/2015","2:24","02:44","4:43","12:33","16:33","20:06","22:04");
        gun_3      =    new Array("6/20/2015","2:24","02:44","4:43","12:34","16:33","20:07","22:04");
        gun_4      =    new Array("6/21/2015","2:24","02:44","4:43","12:34","16:34","20:07","22:04");
        gun_5      =    new Array("6/22/2015","2:25","02:45","4:43","12:34","16:34","20:07","22:04");
        gun_6      =    new Array("6/23/2015","2:25","02:45","4:44","12:34","16:34","20:07","22:05");
        gun_7      =    new Array("6/24/2015","2:25","02:45","4:44","12:35","16:34","20:07","22:05");
        gun_8      =    new Array("6/25/2015","2:26","02:46","4:44","12:35","16:35","20:07","22:05");
        gun_9      =    new Array("6/26/2015","2:26","02:46","4:44","12:35","16:35","20:07","22:05");
        gun_10      =    new Array("6/27/2015","2:27","02:47","4:45","12:35","16:35","20:07","22:04");
        gun_11      =    new Array("6/28/2015","2:27","02:47","4:45","12:35","16:35","20:07","22:04");
        gun_12      =    new Array("6/29/2015","2:28","02:48","4:46","12:36","16:35","20:07","22:04");
        gun_13      =    new Array("6/30/2015","2:28","02:48","4:46","12:36","16:35","20:07","22:04");
        gun_14      =    new Array("7/1/2015"," 2:29","02:49","4:47","12:36","16:36","20:07","22:04");
        gun_15      =    new Array("7/2/2015"," 2:30","02:50","4:47","12:36","16:36","20:07","22:03");
        gun_16      =    new Array("7/3/2015"," 2:31","02:51","4:48","12:36","16:36","20:07","22:03");
        gun_17      =    new Array("7/4/2015"," 2:32","02:52","4:48","12:37","16:36","20:07","22:02");
        gun_18      =    new Array("7/5/2015"," 2:33","02:53","4:49","12:37","16:36","20:07","22:02");
        gun_19      =    new Array("7/6/2015"," 2:34","02:54","4:49","12:37","16:36","20:06","22:01");
        gun_20      =    new Array("7/7/2015"," 2:35","02:55","4:50","12:37","16:36","20:06","22:00");
        gun_21      =    new Array("7/8/2015"," 2:36","02:56","4:50","12:37","16:36","20:06","22:00");
        gun_22      =    new Array("7/9/2015"," 2:37","02:57","4:51","12:37","16:36","20:05","21:59");
        gun_23      =    new Array("7/10/2015"," 2:38","02:58","4:52","12:38","16:36","20:05","21:58");
        gun_24      =    new Array("7/11/2015"," 2:39","02:59","4:52","12:38","16:36","20:04","21:57");
        gun_25      =    new Array("7/12/2015"," 2:40","03:00","4:53","12:38","16:36","20:04","21:57");
        gun_26      =    new Array("7/13/2015"," 2:42","03:02","4:54","12:38","16:36","20:04","21:56");
        gun_27      =    new Array("7/14/2015"," 2:43","03:03","4:55","12:38","16:36","20:03","21:55");
        gun_28      =    new Array("7/15/2015"," 2:44","03:04","4:55","12:38","16:36","20:02","21:54");
        gun_29      =    new Array("7/16/2015"," 2:46","03:06","4:56","12:38","16:36","20:02","21:53");

	break;
	case "hakkari":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:29","02:49","4:35","12:16","16:10","19:40","21:27");
        gun_2      =    new Array("6/19/2015","2:29","02:49","4:35","12:16","16:10","19:40","21:28");
        gun_3      =    new Array("6/20/2015","2:29","02:49","4:35","12:16","16:10","19:40","21:28");
        gun_4      =    new Array("6/21/2015","2:29","02:49","4:35","12:17","16:10","19:40","21:28");
        gun_5      =    new Array("6/22/2015","2:29","02:49","4:35","12:17","16:10","19:41","21:28");
        gun_6      =    new Array("6/23/2015","2:29","02:49","4:35","12:17","16:11","19:41","21:28");
        gun_7      =    new Array("6/24/2015","2:30","02:50","4:36","12:17","16:11","19:41","21:28");
        gun_8      =    new Array("6/25/2015","2:30","02:50","4:36","12:18","16:11","19:41","21:29");
        gun_9      =    new Array("6/26/2015","2:31","02:51","4:36","12:18","16:11","19:41","21:29");
        gun_10      =    new Array("6/27/2015","2:31","02:51","4:37","12:18","16:12","19:41","21:28");
        gun_11      =    new Array("6/28/2015","2:32","02:52","4:37","12:18","16:12","19:41","21:28");
        gun_12      =    new Array("6/29/2015","2:32","02:52","4:37","12:18","16:12","19:41","21:28");
        gun_13      =    new Array("6/30/2015","2:33","02:53","4:38","12:19","16:12","19:41","21:28");
        gun_14      =    new Array("7/1/2015"," 2:33","02:53","4:38","12:19","16:12","19:41","21:28");
        gun_15      =    new Array("7/2/2015"," 2:34","02:54","4:39","12:19","16:12","19:41","21:28");
        gun_16      =    new Array("7/3/2015"," 2:35","02:55","4:39","12:19","16:13","19:41","21:27");
        gun_17      =    new Array("7/4/2015"," 2:35","02:55","4:40","12:19","16:13","19:41","21:27");
        gun_18      =    new Array("7/5/2015"," 2:36","02:56","4:40","12:20","16:13","19:41","21:26");
        gun_19      =    new Array("7/6/2015"," 2:37","02:57","4:41","12:20","16:13","19:40","21:26");
        gun_20      =    new Array("7/7/2015"," 2:38","02:58","4:41","12:20","16:13","19:40","21:26");
        gun_21      =    new Array("7/8/2015"," 2:39","02:59","4:42","12:20","16:13","19:40","21:25");
        gun_22      =    new Array("7/9/2015"," 2:40","03:00","4:43","12:20","16:13","19:40","21:24");
        gun_23      =    new Array("7/10/2015"," 2:41","03:01","4:43","12:20","16:13","19:39","21:24");
        gun_24      =    new Array("7/11/2015"," 2:42","03:02","4:44","12:20","16:13","19:39","21:23");
        gun_25      =    new Array("7/12/2015"," 2:43","03:03","4:44","12:21","16:13","19:38","21:22");
        gun_26      =    new Array("7/13/2015"," 2:44","03:04","4:45","12:21","16:13","19:38","21:22");
        gun_27      =    new Array("7/14/2015"," 2:45","03:05","4:46","12:21","16:13","19:38","21:21");
        gun_28      =    new Array("7/15/2015"," 2:46","03:06","4:46","12:21","16:14","19:37","21:20");
        gun_29      =    new Array("7/16/2015"," 2:47","03:07","4:47","12:21","16:14","19:37","21:19");

	break;
	case "hatay":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","3:09","03:29","5:09","12:46","16:37","20:05","21:49");
        gun_2      =    new Array("6/19/2015","3:09","03:29","5:09","12:47","16:37","20:06","21:49");
        gun_3      =    new Array("6/20/2015","3:09","03:29","5:10","12:47","16:37","20:06","21:50");
        gun_4      =    new Array("6/21/2015","3:09","03:29","5:10","12:47","16:37","20:06","21:50");
        gun_5      =    new Array("6/22/2015","3:09","03:29","5:10","12:47","16:38","20:06","21:50");
        gun_6      =    new Array("6/23/2015","3:09","03:29","5:10","12:47","16:38","20:07","21:50");
        gun_7      =    new Array("6/24/2015","3:10","03:30","5:11","12:48","16:38","20:07","21:50");
        gun_8      =    new Array("6/25/2015","3:10","03:30","5:11","12:48","16:38","20:07","21:50");
        gun_9      =    new Array("6/26/2015","3:10","03:30","5:11","12:48","16:39","20:07","21:50");
        gun_10      =    new Array("6/27/2015","3:11","03:31","5:11","12:48","16:39","20:07","21:50");
        gun_11      =    new Array("6/28/2015","3:11","03:31","5:12","12:49","16:39","20:07","21:50");
        gun_12      =    new Array("6/29/2015","3:12","03:32","5:12","12:49","16:39","20:07","21:50");
        gun_13      =    new Array("6/30/2015","3:12","03:32","5:13","12:49","16:39","20:07","21:50");
        gun_14      =    new Array("7/1/2015"," 3:13","03:33","5:13","12:49","16:39","20:07","21:50");
        gun_15      =    new Array("7/2/2015"," 3:14","03:34","5:14","12:49","16:40","20:07","21:50");
        gun_16      =    new Array("7/3/2015"," 3:14","03:34","5:14","12:50","16:40","20:07","21:49");
        gun_17      =    new Array("7/4/2015"," 3:15","03:35","5:14","12:50","16:40","20:07","21:49");
        gun_18      =    new Array("7/5/2015"," 3:16","03:36","5:15","12:50","16:40","20:07","21:49");
        gun_19      =    new Array("7/6/2015"," 3:16","03:36","5:15","12:50","16:40","20:06","21:48");
        gun_20      =    new Array("7/7/2015"," 3:17","03:37","5:16","12:50","16:40","20:06","21:48");
        gun_21      =    new Array("7/8/2015"," 3:18","03:38","5:17","12:50","16:40","20:06","21:47");
        gun_22      =    new Array("7/9/2015"," 3:19","03:39","5:17","12:51","16:41","20:06","21:47");
        gun_23      =    new Array("7/10/2015"," 3:20","03:40","5:18","12:51","16:41","20:05","21:46");
        gun_24      =    new Array("7/11/2015"," 3:21","03:41","5:18","12:51","16:41","20:05","21:46");
        gun_25      =    new Array("7/12/2015"," 3:22","03:42","5:19","12:51","16:41","20:05","21:45");
        gun_26      =    new Array("7/13/2015"," 3:23","03:43","5:20","12:51","16:41","20:04","21:44");
        gun_27      =    new Array("7/14/2015"," 3:24","03:44","5:20","12:51","16:41","20:04","21:44");
        gun_28      =    new Array("7/15/2015"," 3:25","03:45","5:21","12:51","16:41","20:03","21:43");
        gun_29      =    new Array("7/16/2015"," 3:26","03:46","5:22","12:51","16:41","20:03","21:42");

	break;
	case "isparta":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","3:20","03:40","5:27","13:09","17:03","20:33","22:21");
        gun_2      =    new Array("6/19/2015","3:20","03:40","5:27","13:09","17:03","20:33","22:21");
        gun_3      =    new Array("6/20/2015","3:21","03:41","5:27","13:09","17:03","20:34","22:22");
        gun_4      =    new Array("6/21/2015","3:21","03:41","5:27","13:10","17:04","20:34","22:22");
        gun_5      =    new Array("6/22/2015","3:21","03:41","5:28","13:10","17:04","20:34","22:22");
        gun_6      =    new Array("6/23/2015","3:21","03:41","5:28","13:10","17:04","20:34","22:22");
        gun_7      =    new Array("6/24/2015","3:22","03:42","5:28","13:10","17:04","20:34","22:22");
        gun_8      =    new Array("6/25/2015","3:22","03:42","5:28","13:10","17:04","20:34","22:22");
        gun_9      =    new Array("6/26/2015","3:22","03:42","5:29","13:11","17:05","20:35","22:22");
        gun_10      =    new Array("6/27/2015","3:23","03:43","5:29","13:11","17:05","20:35","22:22");
        gun_11      =    new Array("6/28/2015","3:23","03:43","5:29","13:11","17:05","20:35","22:22");
        gun_12      =    new Array("6/29/2015","3:24","03:44","5:30","13:11","17:05","20:35","22:22");
        gun_13      =    new Array("6/30/2015","3:24","03:44","5:30","13:11","17:05","20:35","22:22");
        gun_14      =    new Array("7/1/2015"," 3:25","03:45","5:31","13:12","17:05","20:35","22:22");
        gun_15      =    new Array("7/2/2015"," 3:26","03:46","5:31","13:12","17:06","20:34","22:21");
        gun_16      =    new Array("7/3/2015"," 3:26","03:46","5:32","13:12","17:06","20:34","22:21");
        gun_17      =    new Array("7/4/2015"," 3:27","03:47","5:32","13:12","17:06","20:34","22:21");
        gun_18      =    new Array("7/5/2015"," 3:28","03:48","5:33","13:12","17:06","20:34","22:20");
        gun_19      =    new Array("7/6/2015"," 3:29","03:49","5:33","13:13","17:06","20:34","22:20");
        gun_20      =    new Array("7/7/2015"," 3:30","03:50","5:34","13:13","17:06","20:33","22:19");
        gun_21      =    new Array("7/8/2015"," 3:31","03:51","5:34","13:13","17:06","20:33","22:19");
        gun_22      =    new Array("7/9/2015"," 3:32","03:52","5:35","13:13","17:06","20:33","22:18");
        gun_23      =    new Array("7/10/2015"," 3:33","03:53","5:36","13:13","17:07","20:33","22:18");
        gun_24      =    new Array("7/11/2015"," 3:34","03:54","5:36","13:13","17:07","20:32","22:17");
        gun_25      =    new Array("7/12/2015"," 3:35","03:55","5:37","13:13","17:07","20:32","22:16");
        gun_26      =    new Array("7/13/2015"," 3:36","03:56","5:38","13:14","17:07","20:31","22:15");
        gun_27      =    new Array("7/14/2015"," 3:37","03:57","5:38","13:14","17:07","20:31","22:15");
        gun_28      =    new Array("7/15/2015"," 3:38","03:58","5:39","13:14","17:07","20:30","22:14");
        gun_29      =    new Array("7/16/2015"," 3:39","03:59","5:40","13:14","17:07","20:30","22:13");

	break;
	case "igdir":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:11","02:31","4:26","12:15","16:13","19:46","21:41");
        gun_2      =    new Array("6/19/2015","2:11","02:31","4:26","12:15","16:14","19:46","21:41");
        gun_3      =    new Array("6/20/2015","2:11","02:31","4:27","12:15","16:14","19:46","21:41");
        gun_4      =    new Array("6/21/2015","2:11","02:31","4: 2:2727",,"12:16","16:14","19:46","21:42");
        gun_5      =   , new Array("6/22/2015","2:11","02:31","4:27","12:16","16:14","19:46","21:4,2");
        gun_6      =    new Array("6/23/2015","2:11","02:31","4:27","12:16","16:15","19:47","21:42");
        gun_7      =    new Array("6/24/2015","2:12","02:32","4:27","12:16","16:15","19:47","21:42");
        gun_8      =    new Array("6/25/2015","2:12","02:32","4:28","12:16","16:15","19:47","21:42");
        gun_9      =    new Array("6/26/2015","2:13","02:33","4:28","12:17","16:15","19:47","21:42");
        gun_10      =    new Array("6/27/2015","2:13","02:33","4:28","12:17","16:15","19:47","21:42");
        gun_11      =    new Array("6/28/2015","2:14","02:34","4:29","12:17","16:16","19:47","21:42");
        gun_12      =    new Array("6/29/2015","2:14","02:34","4:29","12:17","16:16","19:47","21:42");
        gun_13      =    new Array("6/30/2015","2:15","02:35","4:30","12:17","16:16","19:47","21:41");
        gun_14      =    new Array("7/1/2015"," 2:16","02:36","4:30","12:18","16:16","19:47","21:41");
        gun_15      =    new Array("7/2/2015"," 2:16","02:36","4:31","12:18","16:16","19:47","21:41");
        gun_16      =    new Array("7/3/2015"," 2:17","02:37","4:31","12:18","16:16","19:47","21:40");
        gun_17      =    new Array("7/4/2015"," 2:18","02:38","4:32","12:18","16:16","19:46","21:40");
        gun_18      =    new Array("7/5/2015"," 2:19","02:39","4:32","12:18","16:16","19:46","21:39");
        gun_19      =    new Array("7/6/2015"," 2:20","02:40","4:33","12:19","16:17","19:46","21:39");
        gun_20      =    new Array("7/7/2015"," 2:21","02:41","4:33","12:19","16:17","19:46","21:38");
        gun_21      =    new Array("7/8/2015"," 2:22","02:42","4:34","12:19","16:17","19:45","21:38");
        gun_22      =    new Array("7/9/2015"," 2:23","02:43","4:35","12:19","16:17","19:45","21:37");
        gun_23      =    new Array("7/10/2015"," 2:24","02:44","4:35","12:19","16:17","19:45","21:36");
        gun_24      =    new Array("7/11/2015"," 2:25","02:45","4:36","12:19","16:17","19:44","21:35");
        gun_25      =    new Array("7/12/2015"," 2:26","02:46","4:37","12:19","16:17","19:44","21:34");
        gun_26      =    new Array("7/13/2015"," 2:28","02:48","4:37","12:20","16:17","19:43","21:34");
        gun_27      =    new Array("7/14/2015"," 2:29","02:49","4:38","12:20","16:17","19:43","21:33");
        gun_28      =    new Array("7/15/2015"," 2:30","02:50","4:39","12:20","16:17","19:42","21:32");
        gun_29      =    new Array("7/16/2015"," 2:31","02:51","4:40","12:20","16:17","19:42","21:31");

	break;
	case "kahramanmaras":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:56","03:16","5:02","12:43","16:37","20:07","21:54");
        gun_2      =    new Array("6/19/2015","2:56","03:16","5:02","12:44","16:37","20:07","21:55");
        gun_3      =    new Array("6/20/2015","2:57","03:17","5:02","12:44","16:37","20:07","21:55");
        gun_4      =    new Array("6/21/2015","2:57","03:17","5:03","12:44","16:38","20:08","21:55");
        gun_5      =    new Array("6/22/2015","2:57","03:17","5:03","12:44","16:38","20:08","21:55");
        gun_6      =    new Array("6/23/2015","2:57","03:17","5:03","12:45","16:38","20:08","21:56");
        gun_7      =    new Array("6/24/2015","2:57","03:17","5:03","12:45","16:38","20:08","21:56");
        gun_8      =    new Array("6/25/2015","2:58","03:18","5:04","12:45","16:38","20:08","21:56");
        gun_9      =    new Array("6/26/2015","2:58","03:18","5:04","12:45","16:39","20:08","21:56");
        gun_10      =    new Array("6/27/2015","2:59","03:19","5:04","12:45","16:39","20:09","21:56");
        gun_11      =    new Array("6/28/2015","2:59","03:19","5:05","12:46","16:39","20:09","21:56");
        gun_12      =    new Array("6/29/2015","3:00","03:20","5:05","12:46","16:39","20:09","21:55");
        gun_13      =    new Array("6/30/2015","3:00","03:20","5:05","12:46","16:39","20:08","21:55");
        gun_14      =    new Array("7/1/2015"," 3:01","03:21","5:06","12:46","16:40","20:08","21:55");
        gun_15      =    new Array("7/2/2015"," 3:02","03:22","5:06","12:46","16:40","20:08","21:55");
        gun_16      =    new Array("7/3/2015"," 3:02","03:22","5:07","12:47","16:40","20:08","21:54");
        gun_17      =    new Array("7/4/2015"," 3:03","03:23","5:07","12:47","16:40","20:08","21:54");
        gun_18      =    new Array("7/5/2015"," 3:04","03:24","5:08","12:47","16:40","20:08","21:54");
        gun_19      =    new Array("7/6/2015"," 3:05","03:25","5:08","12:47","16:40","20:08","21:53");
        gun_20      =    new Array("7/7/2015"," 3:06","03:26","5:09","12:47","16:40","20:07","21:53");
        gun_21      =    new Array("7/8/2015"," 3:06","03:26","5:09","12:47","16:40","20:07","21:52");
        gun_22      =    new Array("7/9/2015"," 3:07","03:27","5:10","12:48","16:41","20:07","21:52");
        gun_23      =    new Array("7/10/2015"," 3:08","03:28","5:11","12:48","16:41","20:06","21:51");
        gun_24      =    new Array("7/11/2015"," 3:09","03:29","5:11","12:48","16:41","20:06","21:50");
        gun_25      =    new Array("7/12/2015"," 3:10","03:30","5:12","12:48","16:41","20:06","21:50");
        gun_26      =    new Array("7/13/2015"," 3:11","03:31","5:13","12:48","16:41","20:05","21:49");
        gun_27      =    new Array("7/14/2015"," 3:12","03:32","5:13","12:48","16:41","20:05","21:48");
        gun_28      =    new Array("7/15/2015"," 3:14","03:34","5:14","12:48","16:41","20:04","21:47");
        gun_29      =    new Array("7/16/2015"," 3:15","03:35","5:15","12:48","16:41","20:04","21:46");

	break;
	case "karabuk":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:45","03:05","5:07","13:01","17:02","20:36","22:36");
        gun_2      =    new Array("6/19/2015","2:45","03:05","5:07","13:01","17:02","20:36","22:37");
        gun_3      =    new Array("6/20/2015","2:45","03:05","5:08","13:01","17:02","20:36","22:37");
        gun_4      =    new Array("6/21/2015","2:45","03:05","5:08","13:01","17:03","20:37","22:37");
        gun_5      =    new Array("6/22/2015","2:45","03:05","5:08","13:01","17:03","20:37","22:38");
        gun_6      =    new Array("6/23/2015","2:45","03:05","5:08","13:02","17:03","20:37","22:38");
        gun_7      =    new Array("6/24/2015","2:46","03:06","5:08","13:02","17:03","20:37","22:38");
        gun_8      =    new Array("6/25/2015","2:46","03:06","5:09","13:02","17:03","20:37","22:38");
        gun_9      =    new Array("6/26/2015","2:47","03:07","5:09","13:02","17:04","20:37","22:38");
        gun_10      =    new Array("6/27/2015","2:47","03:07","5:09","13:02","17:04","20:37","22:38");
        gun_11      =    new Array("6/28/2015","2:48","03:08","5:10","13:03","17:04","20:37","22:37");
        gun_12      =    new Array("6/29/2015","2:48","03:08","5:10","13:03","17:04","20:37","22:37");
        gun_13      =    new Array("6/30/2015","2:49","03:09","5:11","13:03","17:04","20:37","22:37");
        gun_14      =    new Array("7/1/2015"," 2:50","03:10","5:11","13:03","17:04","20:37","22:36");
        gun_15      =    new Array("7/2/2015"," 2:51","03:11","5:12","13:03","17:05","20:37","22:36");
        gun_16      =    new Array("7/3/2015"," 2:52","03:12","5:12","13:04","17:05","20:37","22:36");
        gun_17      =    new Array("7/4/2015"," 2:52","03:12","5:13","13:04","17:05","20:37","22:35");
        gun_18      =    new Array("7/5/2015"," 2:53","03:13","5:13","13:04","17:05","20:36","22:35");
        gun_19      =    new Array("7/6/2015"," 2:55","03:15","5:14","13:04","17:05","20:36","22:34");
        gun_20      =    new Array("7/7/2015"," 2:56","03:16","5:15","13:04","17:05","20:36","22:33");
        gun_21      =    new Array("7/8/2015"," 2:57","03:17","5:15","13:05","17:05","20:35","22:32");
        gun_22      =    new Array("7/9/2015"," 2:58","03:18","5:16","13:05","17:05","20:35","22:32");
        gun_23      =    new Array("7/10/2015"," 2:59","03:19","5:17","13:05","17:05","20:35","22:31");
        gun_24      =    new Array("7/11/2015"," 3:00","03:20","5:17","13:05","17:05","20:34","22:30");
        gun_25      =    new Array("7/12/2015"," 3:02","03:22","5:18","13:05","17:05","20:34","22:29");
        gun_26      =    new Array("7/13/2015"," 3:03","03:23","5:19","13:05","17:05","20:33","22:28");
        gun_27      =    new Array("7/14/2015"," 3:04","03:24","5:20","13:05","17:05","20:33","22:27");
        gun_28      =    new Array("7/15/2015"," 3:06","03:26","5:20","13:05","17:05","20:32","22:26");
        gun_29      =    new Array("7/16/2015"," 3:07","03:27","5:21","13:06","17:05","20:31","22:25");

	break;
	case "karaman":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","3:15","03:35","5:19","12:58","16:51","20:20","22:06");
        gun_2      =    new Array("6/19/2015","3:15","03:35","5:19","12:58","16:51","20:20","22:06");
        gun_3      =    new Array("6/20/2015","3:15","03:35","5:19","12:59","16:51","20:20","22:07");
        gun_4      =    new Array("6/21/2015","3:15","03:35","5:19","12:59","16:51","20:21","22:07");
        gun_5      =    new Array("6/22/2015","3:15","03:35","5:19","12:59","16:52","20:21","22:07");
        gun_6      =    new Array("6/23/2015","3:15","03:35","5:19","12:59","16:52","20:21","22:07");
        gun_7      =    new Array("6/24/2015","3:16","03:36","5:20","12:59","16:52","20:21","22:07");
        gun_8      =    new Array("6/25/2015","3:16","03:36","5:20","13:00","16:52","20:21","22:07");
        gun_9      =    new Array("6/26/2015","3:16","03:36","5:20","13:00","16:53","20:21","22:07");
        gun_10      =    new Array("6/27/2015","3:17","03:37","5:21","13:00","16:53","20:21","22:07");
        gun_11      =    new Array("6/28/2015","3:17","03:37","5:21","13:00","16:53","20:21","22:07");
        gun_12      =    new Array("6/29/2015","3:18","03:38","5:21","13:01","16:53","20:21","22:07");
        gun_13      =    new Array("6/30/2015","3:18","03:38","5:22","13:01","16:53","20:21","22:07");
        gun_14      =    new Array("7/1/2015"," 3:19","03:39","5:22","13:01","16:53","20:21","22:07");
        gun_15      =    new Array("7/2/2015"," 3:20","03:40","5:23","13:01","16:54","20:21","22:06");
        gun_16      =    new Array("7/3/2015"," 3:20","03:40","5:23","13:01","16:54","20:21","22:06");
        gun_17      =    new Array("7/4/2015"," 3:21","03:41","5:24","13:01","16:54","20:21","22:06");
        gun_18      =    new Array("7/5/2015"," 3:22","03:42","5:24","13:02","16:54","20:21","22:05");
        gun_19      =    new Array("7/6/2015"," 3:23","03:43","5:25","13:02","16:54","20:21","22:05");
        gun_20      =    new Array("7/7/2015"," 3:24","03:44","5:25","13:02","16:54","20:20","22:04");
        gun_21      =    new Array("7/8/2015"," 3:24","03:44","5:26","13:02","16:54","20:20","22:04");
        gun_22      =    new Array("7/9/2015"," 3:25","03:45","5:27","13:02","16:54","20:20","22:03");
        gun_23      =    new Array("7/10/2015"," 3:26","03:46","5:27","13:02","16:55","20:20","22:03");
        gun_24      =    new Array("7/11/2015"," 3:27","03:47","5:28","13:03","16:55","20:19","22:02");
        gun_25      =    new Array("7/12/2015"," 3:28","03:48","5:28","13:03","16:55","20:19","22:01");
        gun_26      =    new Array("7/13/2015"," 3:29","03:49","5:29","13:03","16:55","20:18","22:01");
        gun_27      =    new Array("7/14/2015"," 3:30","03:50","5:30","13:03","16:55","20:18","22:00");
        gun_28      =    new Array("7/15/2015"," 3:31","03:51","5:30","13:03","16:55","20:17","21:59");
        gun_29      =    new Array("7/16/2015"," 3:33","03:53","5:31","13:03","16:55","20:17","21:58");

	break;
	case "kars":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:08","02:28","4:28","12:19","16:19","19:52","21:50");
        gun_2      =    new Array("6/19/2015","2:08","02:28","4:28","12:19","16:19","19:52","21:50");
        gun_3      =    new Array("6/20/2015","2:08","02:28","4:28","12:19","16:19","19:52","21:51");
        gun_4      =    new Array("6/21/2015","2:09","02:29","4:28","12:19","16:19","19:53","21:51");
        gun_5      =    new Array("6/22/2015","2:09","02:29","4:28","12:20","16:20","19:53","21:51");
        gun_6      =    new Array("6/23/2015","2:09","02:29","4:28","12:20","16:20","19:53","21:51");
        gun_7      =    new Array("6/24/2015","2:09","02:29","4:29","12:20","16:20","19:53","21:51");
        gun_8      =    new Array("6/25/2015","2:10","02:30","4:29","12:20","16:20","19:53","21:51");
        gun_9      =    new Array("6/26/2015","2:10","02:30","4:29","12:20","16:20","19:53","21:51");
        gun_10      =    new Array("6/27/2015","2:11","02:31","4:30","12:21","16:21","19:53","21:51");
        gun_11      =    new Array("6/28/2015","2:11","02:31","4:30","12:21","16:21","19:53","21:51");
        gun_12      =    new Array("6/29/2015","2:12","02:32","4:31","12:21","16:21","19:53","21:51");
        gun_13      =    new Array("6/30/2015","2:13","02:33","4:31","12:21","16:21","19:53","21:50");
        gun_14      =    new Array("7/1/2015"," 2:13","02:33","4:31","12:21","16:21","19:53","21:50");
        gun_15      =    new Array("7/2/2015"," 2:14","02:34","4:32","12:22","16:21","19:53","21:50");
        gun_16      =    new Array("7/3/2015"," 2:15","02:35","4:32","12:22","16:22","19:53","21:49");
        gun_17      =    new Array("7/4/2015"," 2:16","02:36","4:33","12:22","16:22","19:53","21:49");
        gun_18      =    new Array("7/5/2015"," 2:17","02:37","4:34","12:22","16:22","19:53","21:48");
        gun_19      =    new Array("7/6/2015"," 2:18","02:38","4:34","12:22","16:22","19:52","21:48");
        gun_20      =    new Array("7/7/2015"," 2:19","02:39","4:35","12:23","16:22","19:52","21:47");
        gun_21      =    new Array("7/8/2015"," 2:20","02:40","4:35","12:23","16:22","19:52","21:46");
        gun_22      =    new Array("7/9/2015"," 2:21","02:41","4:36","12:23","16:22","19:51","21:46");
        gun_23      =    new Array("7/10/2015"," 2:22","02:42","4:37","12:23","16:22","19:51","21:45");
        gun_24      =    new Array("7/11/2015"," 2:24","02:44","4:37","12:23","16:22","19:50","21:44");
        gun_25      =    new Array("7/12/2015"," 2:25","02:45","4:38","12:23","16:22","19:50","21:43");
        gun_26      =    new Array("7/13/2015"," 2:26","02:46","4:39","12:23","16:22","19:49","21:42");
        gun_27      =    new Array("7/14/2015"," 2:27","02:47","4:40","12:24","16:22","19:49","21:41");
        gun_28      =    new Array("7/15/2015"," 2:29","02:49","4:40","12:24","16:22","19:48","21:40");
        gun_29      =    new Array("7/16/2015"," 2:30","02:50","4:41","12:24","16:22","19:48","21:39");

	break;
	case "kastamonu":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:38","02:58","5:02","12:56","16:58","20:32","22:33");
        gun_2      =    new Array("6/19/2015","2:38","02:58","5:02","12:56","16:58","20:32","22:34");
        gun_3      =    new Array("6/20/2015","2:39","02:59","5:02","12:56","16:58","20:32","22:34");
        gun_4      =    new Array("6/21/2015","2:39","02:59","5:03","12:57","16:58","20:33","22:34");
        gun_5      =    new Array("6/22/2015","2:39","02:59","5:03","12:57","16:59","20:33","22:34");
        gun_6      =    new Array("6/23/2015","2:39","02:59","5:03","12:57","16:59","20:33","22:34");
        gun_7      =    new Array("6/24/2015","2:39","02:59","5:03","12:57","16:59","20:33","22:34");
        gun_8      =    new Array("6/25/2015","2:40","03:00","5:04","12:57","16:59","20:33","22:34");
        gun_9      =    new Array("6/26/2015","2:40","03:00","5:04","12:58","16:59","20:33","22:34");
        gun_10      =    new Array("6/27/2015","2:41","03:01","5:04","12:58","17:00","20:33","22:34");
        gun_11      =    new Array("6/28/2015","2:41","03:01","5:05","12:58","17:00","20:33","22:34");
        gun_12      =    new Array("6/29/2015","2:42","03:02","5:05","12:58","17:00","20:33","22:34");
        gun_13      =    new Array("6/30/2015","2:43","03:03","5:06","12:58","17:00","20:33","22:34");
        gun_14      =    new Array("7/1/2015"," 2:44","03:04","5:06","12:59","17:00","20:33","22:33");
        gun_15      =    new Array("7/2/2015"," 2:45","03:05","5:07","12:59","17:00","20:33","22:33");
        gun_16      =    new Array("7/3/2015"," 2:45","03:05","5:07","12:59","17:00","20:33","22:32");
        gun_17      =    new Array("7/4/2015"," 2:46","03:06","5:08","12:59","17:00","20:33","22:32");
        gun_18      =    new Array("7/5/2015"," 2:47","03:07","5:08","12:59","17:01","20:32","22:31");
        gun_19      =    new Array("7/6/2015"," 2:48","03:08","5:09","13:00","17:01","20:32","22:31");
        gun_20      =    new Array("7/7/2015"," 2:50","03:10","5:09","13:00","17:01","20:32","22:30");
        gun_21      =    new Array("7/8/2015"," 2:51","03:11","5:10","13:00","17:01","20:31","22:29");
        gun_22      =    new Array("7/9/2015"," 2:52","03:12","5:11","13:00","17:01","20:31","22:28");
        gun_23      =    new Array("7/10/2015"," 2:53","03:13","5:11","13:00","17:01","20:31","22:27");
        gun_24      =    new Array("7/11/2015"," 2:54","03:14","5:12","13:00","17:01","20:30","22:27");
        gun_25      =    new Array("7/12/2015"," 2:56","03:16","5:13","13:00","17:01","20:30","22:26");
        gun_26      =    new Array("7/13/2015"," 2:57","03:17","5:14","13:01","17:01","20:29","22:25");
        gun_27      =    new Array("7/14/2015"," 2:58","03:18","5:14","13:01","17:01","20:29","22:24");
        gun_28      =    new Array("7/15/2015"," 3:00","03:20","5:15","13:01","17:01","20:28","22:23");
        gun_29      =    new Array("7/16/2015"," 3:01","03:21","5:16","13:01","17:01","20:27","22:21");

	break;
	case "kayseri":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:54","03:14","5:04","12:49","16:45","20:16","22:08");
        gun_2      =    new Array("6/19/2015","2:54","03:14","5:04","12:49","16:46","20:17","22:08");
        gun_3      =    new Array("6/20/2015","2:54","03:14","5:04","12:50","16:46","20:17","22:08");
        gun_4      =    new Array("6/21/2015","2:54","03:14","5:05","12:50","16:46","20:17","22:08");
        gun_5      =    new Array("6/22/2015","2:54","03:14","5:05","12:50","16:46","20:17","22:09");
        gun_6      =    new Array("6/23/2015","2:54","03:14","5:05","12:50","16:46","20:18","22:09");
        gun_7      =    new Array("6/24/2015","2:55","03:15","5:05","12:50","16:47","20:18","22:09");
        gun_8      =    new Array("6/25/2015","2:55","03:15","5:06","12:51","16:47","20:18","22:09");
        gun_9      =    new Array("6/26/2015","2:56","03:16","5:06","12:51","16:47","20:18","22:09");
        gun_10      =    new Array("6/27/2015","2:56","03:16","5:06","12:51","16:47","20:18","22:09");
        gun_11      =    new Array("6/28/2015","2:57","03:17","5:07","12:51","16:47","20:18","22:09");
        gun_12      =    new Array("6/29/2015","2:57","03:17","5:07","12:52","16:48","20:18","22:09");
        gun_13      =    new Array("6/30/2015","2:58","03:18","5:07","12:52","16:48","20:18","22:08");
        gun_14      =    new Array("7/1/2015"," 2:58","03:18","5:08","12:52","16:48","20:18","22:08");
        gun_15      =    new Array("7/2/2015"," 2:59","03:19","5:08","12:52","16:48","20:18","22:08");
        gun_16      =    new Array("7/3/2015"," 3:00","03:20","5:09","12:52","16:48","20:18","22:07");
        gun_17      =    new Array("7/4/2015"," 3:01","03:21","5:09","12:52","16:48","20:17","22:07");
        gun_18      =    new Array("7/5/2015"," 3:01","03:21","5:10","12:53","16:48","20:17","22:07");
        gun_19      =    new Array("7/6/2015"," 3:02","03:22","5:10","12:53","16:48","20:17","22:06");
        gun_20      =    new Array("7/7/2015"," 3:03","03:23","5:11","12:53","16:49","20:17","22:05");
        gun_21      =    new Array("7/8/2015"," 3:04","03:24","5:12","12:53","16:49","20:16","22:05");
        gun_22      =    new Array("7/9/2015"," 3:05","03:25","5:12","12:53","16:49","20:16","22:04");
        gun_23      =    new Array("7/10/2015"," 3:06","03:26","5:13","12:53","16:49","20:16","22:04");
        gun_24      =    new Array("7/11/2015"," 3:07","03:27","5:14","12:54","16:49","20:15","22:03");
        gun_25      =    new Array("7/12/2015"," 3:08","03:28","5:14","12:54","16:49","20:15","22:02");
        gun_26      =    new Array("7/13/2015"," 3:10","03:30","5:15","12:54","16:49","20:14","22:01");
        gun_27      =    new Array("7/14/2015"," 3:11","03:31","5:16","12:54","16:49","20:14","22:00");
        gun_28      =    new Array("7/15/2015"," 3:12","03:32","5:16","12:54","16:49","20:13","21:59");
        gun_29      =    new Array("7/16/2015"," 3:13","03:33","5:17","12:54","16:49","20:13","21:59");

	break;
	case "kilis":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","3:01","03:21","5:04","12:43","16:34","20:04","21:49");
        gun_2      =    new Array("6/19/2015","3:01","03:21","5:04","12:43","16:34","20:04","21:49");
        gun_3      =    new Array("6/20/2015","3:01","03:21","5:04","12:43","16:35","20:04","21:49");
        gun_4      =    new Array("6/21/2015","3:01","03:21","5:04","12:43","16:35","20:04","21:49");
        gun_5      =    new Array("6/22/2015","3:02","03:22","5:04","12:43","16:35","20:04","21:50");
        gun_6      =    new Array("6/23/2015","3:02","03:22","5:05","12:44","16:35","20:05","21:50");
        gun_7      =    new Array("6/24/2015","3:02","03:22","5:05","12:44","16:35","20:05","21:50");
        gun_8      =    new Array("6/25/2015","3:03","03:23","5:05","12:44","16:36","20:05","21:50");
        gun_9      =    new Array("6/26/2015","3:03","03:23","5:06","12:44","16:36","20:05","21:50");
        gun_10      =    new Array("6/27/2015","3:03","03:23","5:06","12:45","16:36","20:05","21:50");
        gun_11      =    new Array("6/28/2015","3:04","03:24","5:06","12:45","16:36","20:05","21:50");
        gun_12      =    new Array("6/29/2015","3:04","03:24","5:07","12:45","16:36","20:05","21:50");
        gun_13      =    new Array("6/30/2015","3:05","03:25","5:07","12:45","16:37","20:05","21:49");
        gun_14      =    new Array("7/1/2015"," 3:06","03:26","5:07","12:45","16:37","20:05","21:49");
        gun_15      =    new Array("7/2/2015"," 3:06","03:26","5:08","12:46","16:37","20:05","21:49");
        gun_16      =    new Array("7/3/2015"," 3:07","03:27","5:08","12:46","16:37","20:05","21:49");
        gun_17      =    new Array("7/4/2015"," 3:08","03:28","5:09","12:46","16:37","20:05","21:48");
        gun_18      =    new Array("7/5/2015"," 3:08","03:28","5:09","12:46","16:37","20:05","21:48");
        gun_19      =    new Array("7/6/2015"," 3:09","03:29","5:10","12:46","16:38","20:04","21:48");
        gun_20      =    new Array("7/7/2015"," 3:10","03:30","5:10","12:46","16:38","20:04","21:47");
        gun_21      =    new Array("7/8/2015"," 3:11","03:31","5:11","12:47","16:38","20:04","21:47");
        gun_22      =    new Array("7/9/2015"," 3:12","03:32","5:12","12:47","16:38","20:04","21:46");
        gun_23      =    new Array("7/10/2015"," 3:13","03:33","5:12","12:47","16:38","20:03","21:45");
        gun_24      =    new Array("7/11/2015"," 3:14","03:34","5:13","12:47","16:38","20:03","21:45");
        gun_25      =    new Array("7/12/2015"," 3:15","03:35","5:13","12:47","16:38","20:02","21:44");
        gun_26      =    new Array("7/13/2015"," 3:16","03:36","5:14","12:47","16:38","20:02","21:43");
        gun_27      =    new Array("7/14/2015"," 3:17","03:37","5:15","12:47","16:38","20:02","21:43");
        gun_28      =    new Array("7/15/2015"," 3:18","03:38","5:15","12:47","16:38","20:01","21:42");
        gun_29      =    new Array("7/16/2015"," 3:19","03:39","5:16","12:48","16:38","20:01","21:41");

	break;
	case "kocaeli":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:59","03:19","5:20","13:11","17:12","20:45","22:44");
        gun_2      =    new Array("6/19/2015","2:59","03:19","5:20","13:12","17:12","20:46","22:44");
        gun_3      =    new Array("6/20/2015","3:00","03:20","5:20","13:12","17:12","20:46","22:45");
        gun_4      =    new Array("6/21/2015","3:00","03:20","5:20","13:12","17:13","20:46","22:45");
        gun_5      =    new Array("6/22/2015","3:00","03:20","5:20","13:12","17:13","20:46","22:45");
        gun_6      =    new Array("6/23/2015","3:00","03:20","5:21","13:12","17:13","20:46","22:45");
        gun_7      =    new Array("6/24/2015","3:00","03:20","5:21","13:13","17:13","20:47","22:45");
        gun_8      =    new Array("6/25/2015","3:01","03:21","5:21","13:13","17:13","20:47","22:45");
        gun_9      =    new Array("6/26/2015","3:01","03:21","5:21","13:13","17:14","20:47","22:45");
        gun_10      =    new Array("6/27/2015","3:02","03:22","5:22","13:13","17:14","20:47","22:45");
        gun_11      =    new Array("6/28/2015","3:02","03:22","5:22","13:14","17:14","20:47","22:45");
        gun_12      =    new Array("6/29/2015","3:03","03:23","5:23","13:14","17:14","20:47","22:45");
        gun_13      =    new Array("6/30/2015","3:04","03:24","5:23","13:14","17:14","20:47","22:44");
        gun_14      =    new Array("7/1/2015"," 3:05","03:25","5:24","13:14","17:14","20:47","22:44");
        gun_15      =    new Array("7/2/2015"," 3:05","03:25","5:24","13:14","17:14","20:46","22:44");
        gun_16      =    new Array("7/3/2015"," 3:06","03:26","5:25","13:15","17:15","20:46","22:43");
        gun_17      =    new Array("7/4/2015"," 3:07","03:27","5:25","13:15","17:15","20:46","22:43");
        gun_18      =    new Array("7/5/2015"," 3:08","03:28","5:26","13:15","17:15","20:46","22:42");
        gun_19      =    new Array("7/6/2015"," 3:09","03:29","5:26","13:15","17:15","20:46","22:42");
        gun_20      =    new Array("7/7/2015"," 3:10","03:30","5:27","13:15","17:15","20:45","22:41");
        gun_21      =    new Array("7/8/2015"," 3:11","03:31","5:28","13:15","17:15","20:45","22:40");
        gun_22      =    new Array("7/9/2015"," 3:12","03:32","5:28","13:16","17:15","20:45","22:39");
        gun_23      =    new Array("7/10/2015"," 3:14","03:34","5:29","13:16","17:15","20:44","22:39");
        gun_24      =    new Array("7/11/2015"," 3:15","03:35","5:30","13:16","17:15","20:44","22:38");
        gun_25      =    new Array("7/12/2015"," 3:16","03:36","5:30","13:16","17:15","20:43","22:37");
        gun_26      =    new Array("7/13/2015"," 3:17","03:37","5:31","13:16","17:15","20:43","22:36");
        gun_27      =    new Array("7/14/2015"," 3:19","03:39","5:32","13:16","17:15","20:42","22:35");
        gun_28      =    new Array("7/15/2015"," 3:20","03:40","5:33","13:16","17:15","20:42","22:34");
        gun_29      =    new Array("7/16/2015"," 3:21","03:41","5:33","13:16","17:15","20:41","22:33");

	break;
	case "konya":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","3:13","03:33","5:19","13:01","16:55","20:25","22:13");
        gun_2      =    new Array("6/19/2015","3:13","03:33","5:20","13:01","16:55","20:25","22:13");
        gun_3      =    new Array("6/20/2015","3:13","03:33","5:20","13:01","16:56","20:25","22:13");
        gun_4      =    new Array("6/21/2015","3:13","03:33","5:20","13:02","16:56","20:26","22:14");
        gun_5      =    new Array("6/22/2015","3:13","03:33","5:20","13:02","16:56","20:26","22:14");
        gun_6      =    new Array("6/23/2015","3:14","03:34","5:20","13:02","16:56","20:26","22:14");
        gun_7      =    new Array("6/24/2015","3:14","03:34","5:21","13:02","16:56","20:26","22:14");
        gun_8      =    new Array("6/25/2015","3:14","03:34","5:21","13:03","16:57","20:26","22:14");
        gun_9      =    new Array("6/26/2015","3:15","03:35","5:21","13:03","16:57","20:26","22:14");
        gun_10      =    new Array("6/27/2015","3:15","03:35","5:22","13:03","16:57","20:26","22:14");
        gun_11      =    new Array("6/28/2015","3:16","03:36","5:22","13:03","16:57","20:26","22:14");
        gun_12      =    new Array("6/29/2015","3:16","03:36","5:22","13:03","16:57","20:26","22:14");
        gun_13      =    new Array("6/30/2015","3:17","03:37","5:23","13:04","16:58","20:26","22:14");
        gun_14      =    new Array("7/1/2015"," 3:18","03:38","5:23","13:04","16:58","20:26","22:13");
        gun_15      =    new Array("7/2/2015"," 3:18","03:38","5:24","13:04","16:58","20:26","22:13");
        gun_16      =    new Array("7/3/2015"," 3:19","03:39","5:24","13:04","16:58","20:26","22:13");
        gun_17      =    new Array("7/4/2015"," 3:20","03:40","5:25","13:04","16:58","20:26","22:12");
        gun_18      =    new Array("7/5/2015"," 3:20","03:40","5:25","13:05","16:58","20:26","22:12");
        gun_19      =    new Array("7/6/2015"," 3:21","03:41","5:26","13:05","16:58","20:25","22:12");
        gun_20      =    new Array("7/7/2015"," 3:22","03:42","5:26","13:05","16:59","20:25","22:11");
        gun_21      =    new Array("7/8/2015"," 3:23","03:43","5:27","13:05","16:59","20:25","22:11");
        gun_22      =    new Array("7/9/2015"," 3:24","03:44","5:27","13:05","16:59","20:25","22:10");
        gun_23      =    new Array("7/10/2015"," 3:25","03:45","5:28","13:05","16:59","20:24","22:09");
        gun_24      =    new Array("7/11/2015"," 3:26","03:46","5:29","13:05","16:59","20:24","22:09");
        gun_25      =    new Array("7/12/2015"," 3:27","03:47","5:29","13:06","16:59","20:23","22:08");
        gun_26      =    new Array("7/13/2015"," 3:28","03:48","5:30","13:06","16:59","20:23","22:07");
        gun_27      =    new Array("7/14/2015"," 3:29","03:49","5:31","13:06","16:59","20:23","22:06");
        gun_28      =    new Array("7/15/2015"," 3:30","03:50","5:31","13:06","16:59","20:22","22:06");
        gun_29      =    new Array("7/16/2015"," 3:31","03:51","5:32","13:06","16:59","20:22","22:05");

	break;
	case "kutahya":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","3:11","03:31","5:24","13:11","17:09","20:41","22:34");
        gun_2      =    new Array("6/19/2015","3:11","03:31","5:24","13:12","17:09","20:41","22:34");
        gun_3      =    new Array("6/20/2015","3:11","03:31","5:24","13:12","17:09","20:41","22:35");
        gun_4      =    new Array("6/21/2015","3:11","03:31","5:25","13:12","17:10","20:41","22:35");
        gun_5      =    new Array("6/22/2015","3:11","03:31","5:25","13:12","17:10","20:42","22:35");
        gun_6      =    new Array("6/23/2015","3:11","03:31","5:25","13:12","17:10","20:42","22:35");
        gun_7      =    new Array("6/24/2015","3:12","03:32","5:25","13:13","17:10","20:42","22:35");
        gun_8      =    new Array("6/25/2015","3:12","03:32","5:26","13:13","17:10","20:42","22:35");
        gun_9      =    new Array("6/26/2015","3:13","03:33","5:26","13:13","17:11","20:42","22:35");
        gun_10      =    new Array("6/27/2015","3:13","03:33","5:26","13:13","17:11","20:42","22:35");
        gun_11      =    new Array("6/28/2015","3:14","03:34","5:27","13:13","17:11","20:42","22:35");
        gun_12      =    new Array("6/29/2015","3:14","03:34","5:27","13:14","17:11","20:42","22:35");
        gun_13      =    new Array("6/30/2015","3:15","03:35","5:27","13:14","17:11","20:42","22:35");
        gun_14      =    new Array("7/1/2015"," 3:16","03:36","5:28","13:14","17:11","20:42","22:35");
        gun_15      =    new Array("7/2/2015"," 3:16","03:36","5:28","13:14","17:12","20:42","22:34");
        gun_16      =    new Array("7/3/2015"," 3:17","03:37","5:29","13:14","17:12","20:42","22:34");
        gun_17      =    new Array("7/4/2015"," 3:18","03:38","5:29","13:15","17:12","20:42","22:33");
        gun_18      =    new Array("7/5/2015"," 3:19","03:39","5:30","13:15","17:12","20:41","22:33");
        gun_19      =    new Array("7/6/2015"," 3:20","03:40","5:31","13:15","17:12","20:41","22:32");
        gun_20      =    new Array("7/7/2015"," 3:21","03:41","5:31","13:15","17:12","20:41","22:32");
        gun_21      =    new Array("7/8/2015"," 3:22","03:42","5:32","13:15","17:12","20:41","22:31");
        gun_22      =    new Array("7/9/2015"," 3:23","03:43","5:32","13:15","17:12","20:40","22:30");
        gun_23      =    new Array("7/10/2015"," 3:24","03:44","5:33","13:16","17:12","20:40","22:30");
        gun_24      =    new Array("7/11/2015"," 3:25","03:45","5:34","13:16","17:12","20:39","22:29");
        gun_25      =    new Array("7/12/19:522015"," 3:26","03:46","5:34","13:16","17:12","20:39","22:28");
    ,    gun_26      =    new Array("7/13/2015"," 3:27","03:47","5:35","13:16","17:12","20:38","22:27");
        gun_27      =    new Array("7/14/2015"," 3:28","03:48","5:36","13:16","17:12","20:38","22:26");
        gun_28      =    new Array("7/15/2015"," 3:30","03:50","5:37","13:16","17:12","20:37","22:25");
        gun_29      =    new Array("7/16/2015"," 3:31","03:51","5:37","13:16","17:12","20:37","22:25");

	break;
	case "kirklareli":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","3:02","03:22","5:28","13:22","17:25","20:59","23:01");
        gun_2      =    new Array("6/19/2015","3:02","03:22","5:28","13:22","17:25","20:59","23:02");
        gun_3      =    new Array("6/20/2015","3:02","03:22","5:28","13:23","17:25","20:59","23:02");
        gun_4      =    new Array("6/21/2015","3:02","03:22","5:28","13:23","17:25","21:00","23:02");
        gun_5      =    new Array("6/22/2015","3:03","03:23","5:28","13:23","17:26","21:00","23:03");
        gun_6      =    new Array("6/23/2015","3:03","03:23","5:29","13:23","17:26","21:00","23:03");
        gun_7      =    new Array("6/24/2015","3:03","03:23","5:29","13:23","17:26","21:00","23:03");
        gun_8      =    new Array("6/25/2015","3:04","03:24","5:29","13:24","17:26","21:00","23:03");
        gun_9      =    new Array("6/26/2015","3:04","03:24","5:29","13:24","17:26","21:00","23:03");
        gun_10      =    new Array("6/27/2015","3:05","03:25","5:30","13:24","17:27","21:00","23:02");
        gun_11      =    new Array("6/28/2015","3:05","03:25","5:30","13:24","17:27","21:00","23:02");
        gun_12      =    new Array("6/29/2015","3:06","03:26","5:31","13:24","17:27","21:00","23:02");
        gun_13      =    new Array("6/30/2015","3:07","03:27","5:31","13:25","17:27","21:00","23:02");
        gun_14      =    new Array("7/1/2015"," 3:07","03:27","5:32","13:25","17:27","21:00","23:01");
        gun_15      =    new Array("7/2/2015"," 3:08","03:28","5:32","13:25","17:27","21:00","23:01");
        gun_16      =    new Array("7/3/2015"," 3:09","03:29","5:33","13:25","17:27","21:00","23:00");
        gun_17      =    new Array("7/4/2015"," 3:10","03:30","5:33","13:25","17:27","20:59","23:00");
        gun_18      =    new Array("7/5/2015"," 3:11","03:31","5:34","13:26","17:28","20:59","22:59");
        gun_19      =    new Array("7/6/2015"," 3:12","03:32","5:34","13:26","17:28","20:59","22:59");
        gun_20      =    new Array("7/7/2015"," 3:13","03:33","5:35","13:26","17:28","20:59","22:58");
        gun_21      =    new Array("7/8/2015"," 3:15","03:35","5:36","13:26","17:28","20:58","22:57");
        gun_22      =    new Array("7/9/2015"," 3:16","03:36","5:36","13:26","17:28","20:58","22:56");
        gun_23      =    new Array("7/10/2015"," 3:17","03:37","5:37","13:26","17:28","20:57","22:55");
        gun_24      =    new Array("7/11/2015"," 3:18","03:38","5:38","13:27","17:28","20:57","22:55");
        gun_25      =    new Array("7/12/2015"," 3:20","03:40","5:39","13:27","17:28","20:56","22:54");
        gun_26      =    new Array("7/13/2015"," 3:21","03:41","5:39","13:27","17:28","20:56","22:53");
        gun_27      =    new Array("7/14/2015"," 3:23","03:43","5:40","13:27","17:28","20:55","22:52");
        gun_28      =    new Array("7/15/2015"," 3:24","03:44","5:41","13:27","17:28","20:55","22:50");
        gun_29      =    new Array("7/16/2015"," 3:26","03:46","5:42","13:27","17:28","20:54","22:49");

	break;
	case "kirikkale":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:54","03:14","5:09","12:57","16:55","20:27","22:22");
        gun_2      =    new Array("6/19/2015","2:54","03:14","5:09","12:57","16:56","20:27","22:22");
        gun_3      =    new Array("6/20/2015","2:54","03:14","5:09","12:57","16:56","20:28","22:22");
        gun_4      =    new Array("6/21/2015","2:54","03:14","5:09","12:58","16:56","20:28","22:23");
        gun_5      =    new Array("6/22/2015","2:54","03:14","5:10","12:58","16:56","20:28","22:23");
        gun_6      =    new Array("6/23/2015","2:55","03:15","5:10","12:58","16:57","20:28","22:23");
        gun_7      =    new Array("6/24/2015","2:55","03:15","5:10","12:58","16:57","20:28","22:23");
        gun_8      =    new Array("6/25/2015","2:55","03:15","5:10","12:58","16:57","20:28","22:23");
        gun_9      =    new Array("6/26/2015","2:56","03:16","5:11","12:59","16:57","20:28","22:23");
        gun_10      =    new Array("6/27/2015","2:56","03:16","5:11","12:59","16:57","20:29","22:23");
        gun_11      =    new Array("6/28/2015","2:57","03:17","5:11","12:59","16:57","20:29","22:23");
        gun_12      =    new Array("6/29/2015","2:57","03:17","5:12","12:59","16:58","20:29","22:23");
        gun_13      =    new Array("6/30/2015","2:58","03:18","5:12","12:59","16:58","20:28","22:22");
        gun_14      =    new Array("7/1/2015"," 2:59","03:19","5:13","13:00","16:58","20:28","22:22");
        gun_15      =    new Array("7/2/2015"," 2:59","03:19","5:13","13:00","16:58","20:28","22:22");
        gun_16      =    new Array("7/3/2015"," 3:00","03:20","5:14","13:00","16:58","20:28","22:21");
        gun_17      =    new Array("7/4/2015"," 3:01","03:21","5:14","13:00","16:58","20:28","22:21");
        gun_18      =    new Array("7/5/2015"," 3:02","03:22","5:15","13:00","16:58","20:28","22:20");
        gun_19      =    new Array("7/6/2015"," 3:03","03:23","5:15","13:01","16:59","20:27","22:20");
        gun_20      =    new Array("7/7/2015"," 3:04","03:24","5:16","13:01","16:59","20:27","22:19");
        gun_21      =    new Array("7/8/2015"," 3:05","03:25","5:17","13:01","16:59","20:27","22:19");
        gun_22      =    new Array("7/9/2015"," 3:06","03:26","5:17","13:01","16:59","20:26","22:18");
        gun_23      =    new Array("7/10/2015"," 3:07","03:27","5:18","13:01","16:59","20:26","22:17");
        gun_24      =    new Array("7/11/2015"," 3:08","03:28","5:19","13:01","16:59","20:26","22:16");
        gun_25      =    new Array("7/12/2015"," 3:09","03:29","5:19","13:01","16:59","20:25","22:16");
        gun_26      =    new Array("7/13/2015"," 3:11","03:31","5:20","13:02","16:59","20:25","22:15");
        gun_27      =    new Array("7/14/2015"," 3:12","03:32","5:21","13:02","16:59","20:24","22:14");
        gun_28      =    new Array("7/15/2015"," 3:13","03:33","5:22","13:02","16:59","20:24","22:13");
        gun_29      =    new Array("7/16/2015"," 3:14","03:34","5:22","13:02","16:59","20:23","22:12");

	break;
	case "kirsehir":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:56","03:16","5:08","12:55","16:52","20:23","22:16");
        gun_2      =    new Array("6/19/2015","2:56","03:16","5:08","12:55","16:52","20:23","22:16");
        gun_3      =    new Array("6/20/2015","2:56","03:16","5:08","12:55","16:52","20:24","22:16");
        gun_4      =    new Array("6/21/2015","2:56","03:16","5:09","12:55","16:52","20:24","22:16");
        gun_5      =    new Array("6/22/2015","2:56","03:16","5:09","12:55","16:52","20:24","22:17");
        gun_6      =    new Array("6/23/2015","2:57","03:17","5:09","12:56","16:53","20:24","22:17");
        gun_7      =    new Array("6/24/2015","2:57","03:17","5:09","12:56","16:53","20:24","22:17");
        gun_8      =    new Array("6/25/2015","2:57","03:17","5:10","12:56","16:53","20:24","22:17");
        gun_9      =    new Array("6/26/2015","2:58","03:18","5:10","12:56","16:53","20:24","22:17");
        gun_10      =    new Array("6/27/2015","2:58","03:18","5:10","12:56","16:53","20:25","22:17");
        gun_11      =    new Array("6/28/2015","2:59","03:19","5:11","12:57","16:54","20:25","22:17");
        gun_12      =    new Array("6/29/2015","2:59","03:19","5:11","12:57","16:54","20:25","22:16");
        gun_13      =    new Array("6/30/2015","3:00","03:20","5:12","12:57","16:54","20:24","22:16");
        gun_14      =    new Array("7/1/2015"," 3:01","03:21","5:12","12:57","16:54","20:24","22:16");
        gun_15      =    new Array("7/2/2015"," 3:01","03:21","5:12","12:57","16:54","20:24","22:16");
        gun_16      =    new Array("7/3/2015"," 3:02","03:22","5:13","12:58","16:54","20:24","22:15");
        gun_17      =    new Array("7/4/2015"," 3:03","03:23","5:13","12:58","16:54","20:24","22:15");
        gun_18      =    new Array("7/5/2015"," 3:04","03:24","5:14","12:58","16:55","20:24","22:14");
        gun_19      =    new Array("7/6/2015"," 3:05","03:25","5:15","12:58","16:55","20:24","22:14");
        gun_20      =    new Array("7/7/2015"," 3:06","03:26","5:15","12:58","16:55","20:23","22:13");
        gun_21      =    new Array("7/8/2015"," 3:07","03:27","5:16","12:59","16:55","20:23","22:13");
        gun_22      =    new Array("7/9/2015"," 3:08","03:28","5:16","12:59","16:55","20:23","22:12");
        gun_23      =    new Array("7/10/2015"," 3:09","03:29","5:17","12:59","16:55","20:22","22:11");
        gun_24      =    new Array("7/11/2015"," 3:10","03:30","5:18","12:59","16:55","20:22","22:11");
        gun_25      =    new Array("7/12/2015"," 3:11","03:31","5:18","12:59","16:55","20:21","22:10");
        gun_26      =    new Array("7/13/2015"," 3:12","03:32","5:19","12:59","16:55","20:21","22:09");
        gun_27      =    new Array("7/14/2015"," 3:13","03:33","5:20","12:59","16:55","20:20","22:08");
        gun_28      =    new Array("7/15/2015"," 3:15","03:35","5:21","12:59","16:55","20:20","22:07");
        gun_29      =    new Array("7/16/2015"," 3:16","03:36","5:21","13:00","16:55","20:19","22:06");

	break;
	case "malatya":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:46","03:06","4:54","12:38","16:33","20:04","21:53");
        gun_2      =    new Array("6/19/2015","2:46","03:06","4:54","12:38","16:33","20:04","21:54");
        gun_3      =    new Array("6/20/2015","2:46","03:06","4:55","12:38","16:34","20:04","21:54");
        gun_4      =    new Array("6/21/2015","2:46","03:06","4:55","12:39","16:34","20:04","21:54");
        gun_5      =    new Array("6/22/2015","2:46","03:06","4:55","12:39","16:34","20:04","21:54");
        gun_6      =    new Array("6/23/2015","2:46","03:06","4:55","12:39","16:34","20:05","21:55");
        gun_7      =    new Array("6/24/2015","2:47","03:07","4:55","12:39","16:34","20:05","21:55");
        gun_8      =    new Array("6/25/2015","2:47","03:07","4:56","12:39","16:35","20:05","21:55");
        gun_9      =    new Array("6/26/2015","2:47","03:07","4:56","12:40","16:35","20:05","21:55");
        gun_10      =    new Array("6/27/2015","2:48","03:08","4:56","12:40","16:35","20:05","21:55");
        gun_11      =    new Array("6/28/2015","2:48","03:08","4:57","12:40","16:35","20:05","21:54");
        gun_12      =    new Array("6/29/2015","2:49","03:09","4:57","12:40","16:35","20:05","21:54");
        gun_13      =    new Array("6/30/2015","2:50","03:10","4:58","12:40","16:36","20:05","21:54");
        gun_14      =    new Array("7/1/2015"," 2:50","03:10","4:58","12:41","16:36","20:05","21:54");
        gun_15      =    new Array("7/2/2015"," 2:51","03:11","4:59","12:41","16:36","20:05","21:54");
        gun_16      =    new Array("7/3/2015"," 2:52","03:12","4:59","12:41","16:36","20:05","21:53");
        gun_17      =    new Array("7/4/2015"," 2:52","03:12","5:00","12:41","16:36","20:05","21:53");
        gun_18      =    new Array("7/5/2015"," 2:53","03:13","5:00","12:41","16:36","20:04","21:52");
        gun_19      =    new Array("7/6/2015"," 2:54","03:14","5:01","12:42","16:36","20:04","21:52");
        gun_20      =    new Array("7/7/2015"," 2:55","03:15","5:01","12:42","16:36","20:04","21:51");
        gun_21      =    new Array("7/8/2015"," 2:56","03:16","5:02","12:42","16:37","20:04","21:51");
        gun_22      =    new Array("7/9/2015"," 2:57","03:17","5:02","12:42","16:37","20:03","21:50");
        gun_23      =    new Array("7/10/2015"," 2:58","03:18","5:03","12:42","16:37","20:03","21:50");
        gun_24      =    new Array("7/11/2015"," 2:59","03:19","5:04","12:42","16:37","20:03","21:49");
        gun_25      =    new Array("7/12/2015"," 3:00","03:20","5:04","12:42","16:37","20:02","21:48");
        gun_26      =    new Array("7/13/2015"," 3:01","03:21","5:05","12:43","16:37","20:02","21:47");
        gun_27      =    new Array("7/14/2015"," 3:02","03:22","5:06","12:43","16:37","20:01","21:46");
        gun_28      =    new Array("7/15/2015"," 3:03","03:23","5:06","12:43","16:37","20:01","21:46");
        gun_29      =    new Array("7/16/2015"," 3:05","03:25","5:07","12:43","16:37","20:00","21:45");

	break;
	case "manisa":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","3:27","03:47","5:36","13:21","17:17","20:48","22:39");
        gun_2      =    new Array("6/19/2015","3:27","03:47","5:37","13:21","17:17","20:48","22:39");
        gun_3      =    new Array("6/20/2015","3:27","03:47","5:37","13:22","17:17","20:48","22:39");
        gun_4      =    new Array("6/21/2015","3:27","03:47","5:37","13:22","17:18","20:49","22:39");
        gun_5      =    new Array("6/22/2015","3:27","03:47","5:37","13:22","17:18","20:49","22:40");
        gun_6      =    new Array("6/23/2015","3:27","03:47","5:37","13:22","17:18","20:49","22:40");
        gun_7      =    new Array("6/24/2015","3:28","03:48","5:38","13:22","17:18","20:49","22:40");
        gun_8      =    new Array("6/25/2015","3:28","03:48","5:38","13:23","17:18","20:49","22:40");
        gun_9      =    new Array("6/26/2015","3:29","03:49","5:38","13:23","17:19","20:49","22:40");
        gun_10      =    new Array("6/27/2015","3:29","03:49","5:39","13:23","17:19","20:49","22:40");
        gun_11      =    new Array("6/28/2015","3:30","03:50","5:39","13:23","17:19","20:49","22:40");
        gun_12      =    new Array("6/29/2015","3:30","03:50","5:39","13:23","17:19","20:49","22:39");
        gun_13      =    new Array("6/30/2015","3:31","03:51","5:40","13:24","17:19","20:49","22:39");
        gun_14      =    new Array("7/1/2015"," 3:31","03:51","5:40","13:24","17:19","20:49","22:39");
        gun_15      =    new Array("7/2/2015"," 3:32","03:52","5:41","13:24","17:20","20:49","22:39");
        gun_16      =    new Array("7/3/2015"," 3:33","03:53","5:41","13:24","17:20","20:49","22:38");
        gun_17      =    new Array("7/4/2015"," 3:34","03:54","5:42","13:24","17:20","20:49","22:38");
        gun_18      =    new Array("7/5/2015"," 3:35","03:55","5:42","13:25","17:20","20:49","22:37");
        gun_19      =    new Array("7/6/2015"," 3:35","03:55","5:43","13:25","17:20","20:48","22:37");
        gun_20      =    new Array("7/7/2015"," 3:36","03:56","5:43","13:25","17:20","20:48","22:36");
        gun_21      =    new Array("7/8/2015"," 3:37","03:57","5:44","13:25","17:20","20:48","22:36");
        gun_22      =    new Array("7/9/2015"," 3:38","03:58","5:45","13:25","17:20","20:48","22:35");
        gun_23      =    new Array("7/10/2015"," 3:39","03:59","5:45","13:25","17:20","20:47","22:35");
        gun_24      =    new Array("7/11/2015"," 3:40","04:00","5:46","13:26","17:20","20:47","22:34");
        gun_25      =    new Array("7/12/2015"," 3:41","04:01","5:47","13:26","17:21","20:46","22:33");
        gun_26      =    new Array("7/13/2015"," 3:43","04:03","5:47","13:26","17:21","20:46","22:32");
        gun_27      =    new Array("7/14/2015"," 3:44","04:04","5:48","13:26","17:21","20:45","22:31");
        gun_28      =    new Array("7/15/2015"," 3:45","04:05","5:49","13:26","17:21","20:45","22:31");
        gun_29      =    new Array("7/16/2015"," 3:46","04:06","5:49","13:26","17:21","20:44","22:30");

	break;
	case "mardin":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:43","03:03","4:48","12:28","16:21","19:51","21:37");
        gun_2      =    new Array("6/19/2015","2:43","03:03","4:48","12:28","16:21","19:51","21:38");
        gun_3      =    new Array("6/20/2015","2:43","03:03","4:48","12:29","16:22","19:51","21:38");
        gun_4      =    new Array("6/21/2015","2:44","03:04","4:48","12:29","16:22","19:51","21:38");
        gun_5      =    new Array("6/22/2015","2:44","03:04","4:49","12:29","16:22","19:52","21:38");
        gun_6      =    new Array("6/23/2015","2:44","03:04","4:49","12:29","16:22","19:52","21:38");
        gun_7      =    new Array("6/24/2015","2:44","03:04","4:49","12:29","16:22","19:52","21:38");
        gun_8      =    new Array("6/25/2015","2:45","03:05","4:49","12:30","16:23","19:52","21:39");
        gun_9      =    new Array("6/26/2015","2:45","03:05","4:50","12:30","16:23","19:52","21:39");
        gun_10      =    new Array("6/27/2015","2:45","03:05","4:50","12:30","16:23","19:52","21:39");
        gun_11      =    new Array("6/28/2015","2:46","03:06","4:50","12:30","16:23","19:52","21:38");
        gun_12      =    new Array("6/29/2015","2:47","03:07","4:51","12:31","16:23","19:52","21:38");
        gun_13      =    new Array("6/30/2015","2:47","03:07","4:51","12:31","16:24","19:52","21:38");
        gun_14      =    new Array("7/1/2015"," 2:48","03:08","4:52","12:31","16:24","19:52","21:38");
        gun_15      =    new Array("7/2/2015"," 2:48","03:08","4:52","12:31","16:24","19:52","21:38");
        gun_16      =    new Array("7/3/2015"," 2:49","03:09","4:53","12:31","16:24","19:52","21:37");
        gun_17      =    new Array("7/4/2015"," 2:50","03:10","4:53","12:31","16:24","19:52","21:37");
        gun_18      =    new Array("7/5/2015"," 2:51","03:11","4:54","12:32","16:24","19:52","21:37");
        gun_19      =    new Array("7/6/2015"," 2:51","03:11","4:54","12:32","16:24","19:51","21:36");
        gun_20      =    new Array("7/7/2015"," 2:52","03:12","4:55","12:32","16:25","19:51","21:36");
        gun_21      =    new Array("7/8/2015"," 2:53","03:13","4:55","12:32","16:25","19:51","21:35");
        gun_22      =    new Array("7/9/2015"," 2:54","03:14","4:56","12:32","16:25","19:51","21:35");
        gun_23      =    new Array("7/10/2015"," 2:55","03:15","4:56","12:32","16:25","19:50","21:34");
        gun_24      =    new Array("7/11/2015"," 2:56","03:16","4:57","12:33","16:25","19:50","21:33");
        gun_25      =    new Array("7/12/2015"," 2:57","03:17","4:58","12:33","16:25","19:49","21:33");
        gun_26      =    new Array("7/13/2015"," 2:58","03:18","4:58","12:33","16:25","19:49","21:32");
        gun_27      =    new Array("7/14/2015"," 2:59","03:19","4:59","12:33","16:25","19:49","21:31");
        gun_28      =    new Array("7/15/2015"," 3:00","03:20","5:00","12:33","16:25","19:48","21:30");
        gun_29      =    new Array("7/16/2015"," 3:01","03:21","5:00","12:33","16:25","19:48","21:29");

	break;
	case "mersin":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","3:12","03:32","5:14","12:53","16:44","20:13","21:58");
        gun_2      =    new Array("6/19/2015","3:12","03:32","5:14","12:53","16:45","20:13","21:58");
        gun_3      =    new Array("6/20/2015","3:12","03:32","5:14","12:53","16:45","20:14","21:59");
        gun_4      =    new Array("6/21/2015","3:12","03:32","5:15","12:53","16:45","20:14","21:59");
        gun_5      =    new Array("6/22/2015","3:12","03:32","5:15","12:53","16:45","20:14","21:59");
        gun_6      =    new Array("6/23/2015","3:12","03:32","5:15","12:54","16:45","20:14","21:59");
        gun_7      =    new Array("6/24/2015","3:13","03:33","5:15","12:54","16:46","20:14","21:59");
        gun_8      =    new Array("6/25/2015","3:13","03:33","5:16","12:54","16:46","20:14","21:59");
        gun_9      =    new Array("6/26/2015","3:13","03:33","5:16","12:54","16:46","20:15","21:59");
        gun_10      =    new Array("6/27/2015","3:14","03:34","5:16","12:55","16:46","20:15","21:59");
        gun_11      =    new Array("6/28/2015","3:14","03:34","5:17","12:55","16:46","20:15","21:59");
        gun_12      =    new Array("6/29/2015","3:15","03:35","5:17","12:55","16:47","20:15","21:59");
        gun_13      =    new Array("6/30/2015","3:15","03:35","5:17","12:55","16:47","20:15","21:59");
        gun_14      =    new Array("7/1/2015"," 3:16","03:36","5:18","12:55","16:47","20:15","21:59");
        gun_15      =    new Array("7/2/2015"," 3:17","03:37","5:18","12:56","16:47","20:15","21:59");
        gun_16      =    new Array("7/3/2015"," 3:17","03:37","5:19","12:56","16:47","20:14","21:58");
        gun_17      =    new Array("7/4/2015"," 3:18","03:38","5:19","12:56","16:47","20:14","21:58");
        gun_18      =    new Array("7/5/2015"," 3:19","03:39","5:20","12:56","16:48","20:14","21:58");
        gun_19      =    new Array("7/6/2015"," 3:20","03:40","5:20","12:56","16:48","20:14","21:57");
        gun_20      =    new Array("7/7/2015"," 3:20","03:40","5:21","12:56","16:48","20:14","21:57");
        gun_21      =    new Array("7/8/2015"," 3:21","03:41","5:21","12:57","16:48","20:13","21:56");
        gun_22      =    new Array("7/9/2015"," 3:22","03:42","5:22","12:57","16:48","20:13","21:56");
        gun_23      =    new Array("7/10/2015"," 3:23","03:43","5:23","12:57","16:48","20:13","21:55");
        gun_24      =    new Array("7/11/2015"," 3:24","03:44","5:23","12:57","16:48","20:12","21:54");
        gun_25      =    new Array("7/12/2015"," 3:25","03:45","5:24","12:57","16:48","20:12","21:54");
        gun_26      =    new Array("7/13/2015"," 3:26","03:46","5:25","12:57","16:48","20:12","21:53");
        gun_27      =    new Array("7/14/2015"," 3:27","03:47","5:25","12:57","16:48","20:11","21:52");
        gun_28      =    new Array("7/15/2015"," 3:28","03:48","5:26","12:57","16:48","20:11","21:51");
        gun_29      =    new Array("7/16/2015"," 3:29","03:49","5:27","12:58","16:48","20:10","21:51");

	break;
	case "mugla":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","3:33","03:53","5:37","13:18","17:10","20:40","22:26");
        gun_2      =    new Array("6/19/2015","3:33","03:53","5:37","13:18","17:11","20:40","22:27");
        gun_3      =    new Array("6/20/2015","3:33","03:53","5:38","13:18","17:11","20:41","22:27");
        gun_4      =    new Array("6/21/2015","3:33","03:53","5:38","13:18","17:11","20:41","22:27");
        gun_5      =    new Array("6/22/2015","3:33","03:53","5:38","13:18","17:11","20:41","22:27");
        gun_6      =    new Array("6/23/2015","3:34","03:54","5:38","13:19","17:11","20:41","22:28");
        gun_7      =    new Array("6/24/2015","3:34","03:54","5:38","13:19","17:12","20:41","22:28");
        gun_8      =    new Array("6/25/2015","3:34","03:54","5:39","13:19","17:12","20:41","22:28");
        gun_9      =    new Array("6/26/2015","3:35","03:55","5:39","13:19","17:12","20:42","22:28");
        gun_10      =    new Array("6/27/2015","3:35","03:55","5:39","13:20","17:12","20:42","22:28");
        gun_11      =    new Array("6/28/2015","3:36","03:56","5:40","13:20","17:12","20:42","22:28");
        gun_12      =    new Array("6/29/2015","3:36","03:56","5:40","13:20","17:13","20:42","22:28");
        gun_13      =    new Array("6/30/2015","3:37","03:57","5:41","13:20","17:13","20:42","22:27");
        gun_14      =    new Array("7/1/2015"," 3:37","03:57","5:41","13:20","17:13","20:42","22:27");
        gun_15      =    new Array("7/2/2015"," 3:38","03:58","5:41","13:21","17:13","20:41","22:27");
        gun_16      =    new Array("7/3/2015"," 3:39","03:59","5:42","13:21","17:13","20:41","22:27");
        gun_17      =    new Array("7/4/2015"," 3:39","03:59","5:42","13:21","17:13","20:41","22:26");
        gun_18      =    new Array("7/5/2015"," 3:40","04:00","5:43","13:21","17:14","20:41","22:26");
        gun_19      =    new Array("7/6/2015"," 3:41","04:01","5:43","13:21","17:14","20:41","22:25");
        gun_20      =    new Array("7/7/2015"," 3:42","04:02","5:44","13:21","17:14","20:41","22:25");
        gun_21      =    new Array("7/8/2015"," 3:43","04:03","5:45","13:22","17:14","20:40","22:24");
        gun_22      =    new Array("7/9/2015"," 3:44","04:04","5:45","13:22","17:14","20:40","22:24");
        gun_23      =    new Array("7/10/2015"," 3:45","04:05","5:46","13:22","17:14","20:40","22:23");
        gun_24      =    new Array("7/11/2015"," 3:46","04:06","5:46","13:22","17:14","20:39","22:22");
        gun_25      =    new Array("7/12/2015"," 3:47","04:07","5:47","13:22","17:14","20:39","22:22");
        gun_26      =    new Array("7/13/2015"," 3:48","04:08","5:48","13:22","17:14","20:38","22:21");
        gun_27      =    new Array("7/14/2015"," 3:49","04:09","5:48","13:22","17:14","20:38","22:20");
        gun_28      =    new Array("7/15/2015"," 3:50","04:10","5:49","13:22","17:14","20:38","22:19");
        gun_29      =    new Array("7/16/2015"," 3:51","04:11","5:50","13:23","17:14","20:37","22:19");

	break;
	case "mus":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:30","02:50","4:40","12:25","16:21","19:52","21:43");
        gun_2      =    new Array("6/19/2015","2:30","02:50","4:40","12:25","16:21","19:52","21:43");
        gun_3      =    new Array("6/20/2015","2:30","02:50","4:41","12:25","16:22","19:52","21:44");
        gun_4      =    new Array("6/21/2015","2:30","02:50","4:41","12:26","16:22","19:53","21:44");
        gun_5      =    new Array("6/22/2015","2:30","02:50","4:41","12:26","16:22","19:53","21:44");
        gun_6      =    new Array("6/23/2015","2:31","02:51","4:41","12:26","16:22","19:53","21:44");
        gun_7      =    new Array("6/24/2015","2:31","02:51","4:41","12:26","16:22","19:53","21:44");
        gun_8      =    new Array("6/25/2015","2:31","02:51","4:42","12:27","16:23","19:53","21:44");
        gun_9      =    new Array("6/26/2015","2:32","02:52","4:42","12:27","16:23","19:53","21:44");
        gun_10      =    new Array("6/27/2015","2:32","02:52","4:42","12:27","16:23","19:53","21:44");
        gun_11      =    new Array("6/28/2015","2:33","02:53","4:43","12:27","16:23","19:53","21:44");
        gun_12      =    new Array("6/29/2015","2:33","02:53","4:43","12:27","16:23","19:53","21:44");
        gun_13      =    new Array("6/30/2015","2:34","02:54","4:44","12:28","16:24","19:53","21:44");
        gun_14      =    new Array("7/1/2015"," 2:35","02:55","4:44","12:28","16:24","19:53","21:43");
        gun_15      =    new Array("7/2/2015"," 2:35","02:55","4:45","12:28","16:24","19:53","21:43");
        gun_16      =    new Array("7/3/2015"," 2:36","02:56","4:45","12:28","16:24","19:53","21:43");
        gun_17      =    new Array("7/4/2015"," 2:37","02:57","4:46","12:28","16:24","19:53","21:42");
        gun_18      =    new Array("7/5/2015"," 2:38","02:58","4:46","12:29","16:24","19:53","21:42");
        gun_19      =    new Array("7/6/2015"," 2:39","02:59","4:47","12:29","16:24","19:53","21:41");
        gun_20      =    new Array("7/7/2015"," 2:40","03:00","4:47","12:29","16:24","19:52","21:41");
        gun_21      =    new Array("7/8/2015"," 2:41","03:01","4:48","12:29","16:25","19:52","21:40");
        gun_22      =    new Array("7/9/2015"," 2:42","03:02","4:48","12:29","16:25","19:52","21:40");
        gun_23      =    new Array("7/10/2015"," 2:43","03:03","4:49","12:29","16:25","19:51","21:39");
        gun_24      =    new Array("7/11/2015"," 2:44","03:04","4:50","12:29","16:25","19:51","21:38");
        gun_25      =    new Array("7/12/2015"," 2:45","03:05","4:50","12:30","16:25","19:50","21:38");
        gun_26      =    new Array("7/13/2015"," 2:46","03:06","4:51","12:30","16:25","19:50","21:37");
        gun_27      =    new Array("7/14/2015"," 2:47","03:07","4:52","12:30","16:25","19:49","21:36");
        gun_28      =    new Array("7/15/2015"," 2:48","03:08","4:53","12:30","16:25","19:49","21:35");
        gun_29      =    new Array("7/16/2015"," 2:49","03:09","4:53","12:30","16:25","19:48","21:34");

	break;
	case "nevsehir":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:58","03:18","5:07","12:52","16:48","20:19","22:10");
        gun_2      =    new Array("6/19/2015","2:58","03:18","5:08","12:52","16:48","20:19","22:10");
        gun_3      =    new Array("6/20/2015","2:58","03:18","5:08","12:53","16:48","20:20","22:10");
        gun_4      =    new Array("6/21/2015","2:58","03:18","5:08","12:53","16:49","20:20","22:11");
        gun_5      =    new Array("6/22/2015","2:58","03:18","5:08","12:53","16:49","20:20","22:11");
        gun_6      =    new Array("6/23/2015","2:58","03:18","5:08","12:53","16:49","20:20","22:11");
        gun_7      =    new Array("6/24/2015","2:59","03:19","5:09","12:53","16:49","20:20","22:11");
        gun_8      =    new Array("6/25/2015","2:59","03:19","5:09","12:54","16:50","20:20","22:11");
        gun_9      =    new Array("6/26/2015","2:59","03:19","5:09","12:54","16:50","20:20","22:11");
        gun_10      =    new Array("6/27/2015","3:00","03:20","5:10","12:54","16:50","20:21","22:11");
        gun_11      =    new Array("6/28/2015","3:00","03:20","5:10","12:54","16:50","20:21","22:11");
        gun_12      =    new Array("6/29/2015","3:01","03:21","5:10","12:55","16:50","20:21","22:11");
        gun_13      =    new Array("6/30/2015","3:02","03:22","5:11","12:55","16:50","20:21","22:11");
        gun_14      =    new Array("7/1/2015"," 3:02","03:22","5:11","12:55","16:51","20:20","22:10");
        gun_15      =    new Array("7/2/2015"," 3:03","03:23","5:12","12:55","16:51","20:20","22:10");
        gun_16      =    new Array("7/3/2015"," 3:04","03:24","5:12","12:55","16:51","20:20","22:10");
        gun_17      =    new Array("7/4/2015"," 3:04","03:24","5:13","12:55","16:51","20:20","22:09");
        gun_18      =    new Array("7/5/2015"," 3:05","03:25","5:13","12:56","16:51","20:20","22:09");
        gun_19      =    new Array("7/6/2015"," 3:06","03:26","5:14","12:56","16:51","20:20","22:08");
        gun_20      =    new Array("7/7/2015"," 3:07","03:27","5:14","12:56","16:51","20:19","22:08");
        gun_21      =    new Array("7/8/2015"," 3:08","03:28","5:15","12:56","16:51","20:19","22:07");
        gun_22      =    new Array("7/9/2015"," 3:09","03:29","5:16","12:56","16:52","20:19","22:07");
        gun_23      =    new Array("7/10/2015"," 3:10","03:30","5:16","12:56","16:52","20:18","22:06");
        gun_24      =    new Array("7/11/2015"," 3:11","03:31","5:17","12:57","16:52","20:18","22:05");
        gun_25      =    new Array("7/12/2015"," 3:12","03:32","5:18","12:57","16:52","20:18","22:04");
        gun_26      =    new Array("7/13/2015"," 3:13","03:33","5:18","12:57","16:52","20:17","22:04");
        gun_27      =    new Array("7/14/2015"," 3:15","03:35","5:19","12:57","16:52","20:17","22:03");
        gun_28      =    new Array("7/15/2015"," 3:16","03:36","5:20","12:57","16:52","20:16","22:02");
        gun_29      =    new Array("7/16/2015"," 3:17","03:37","5:20","12:57","16:52","20:16","22:01");

	break;
	case "nigde":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","3:03","03:23","5:10","12:52","16:47","20:17","22:05");
        gun_2      =    new Array("6/19/2015","3:03","03:23","5:10","12:52","16:47","20:17","22:06");
        gun_3      =    new Array("6/20/2015","3:03","03:23","5:10","12:53","16:47","20:17","22:06");
        gun_4      =    new Array("6/21/2015","3:03","03:23","5:10","12:53","16:47","20:17","22:06");
        gun_5      =    new Array("6/22/2015","3:03","03:23","5:11","12:53","16:48","20:18","22:06");
        gun_6      =    new Array("6/23/2015","3:04","03:24","5:11","12:53","16:48","20:18","22:06");
        gun_7      =    new Array("6/24/2015","3:04","03:24","5:11","12:54","16:48","20:18","22:06");
        gun_8      =    new Array("6/25/2015","3:04","03:24","5:11","12:54","16:48","20:18","22:07");
        gun_9      =    new Array("6/26/2015","3:05","03:25","5:12","12:54","16:48","20:18","22:07");
        gun_10      =    new Array("6/27/2015","3:05","03:25","5:12","12:54","16:49","20:18","22:06");
        gun_11      =    new Array("6/28/2015","3:06","03:26","5:12","12:54","16:49","20:18","22:06");
        gun_12      =    new Array("6/29/2015","3:06","03:26","5:13","12:55","16:49","20:18","22:06");
        gun_13      =    new Array("6/30/2015","3:07","03:27","5:13","12:55","16:49","20:18","22:06");
        gun_14      =    new Array("7/1/2015"," 3:07","03:27","5:14","12:55","16:49","20:18","22:06");
        gun_15      =    new Array("7/2/2015"," 3:08","03:28","5:14","12:55","16:49","20:18","22:06");
        gun_16      =    new Array("7/3/2015"," 3:09","03:29","5:15","12:55","16:50","20:18","22:05");
        gun_17      =    new Array("7/4/2015"," 3:10","03:30","5:15","12:56","16:50","20:18","22:05");
        gun_18      =    new Array("7/5/2015"," 3:10","03:30","5:16","12:56","16:50","20:18","22:04");
        gun_19      =    new Array("7/6/2015"," 3:11","03:31","5:16","12:56","16:50","20:17","22:04");
        gun_20      =    new Array("7/7/2015"," 3:12","03:32","5:17","12:56","16:50","20:17","22:03");
        gun_21      =    new Array("7/8/2015"," 3:13","03:33","5:17","12:56","16:50","20:17","22:03");
        gun_22      =    new Array("7/9/2015"," 3:14","03:34","5:18","12:56","16:50","20:16","22:02");
        gun_23      =    new Array("7/10/2015"," 3:15","03:35","5:19","12:57","16:50","20:16","22:02");
        gun_24      =    new Array("7/11/2015"," 3:16","03:36","5:19","12:57","16:50","20:16","22:01");
        gun_25      =    new Array("7/12/2015"," 3:17","03:37","5:20","12:57","16:50","20:15","22:00");
        gun_26      =    new Array("7/13/2015"," 3:18","03:38","5:21","12:57","16:50","20:15","21:59");
        gun_27      =    new Array("7/14/2015"," 3:19","03:39","5:21","12:57","16:50","20:14","21:59");
        gun_28      =    new Array("7/15/2015"," 3:20","03:40","5:22","12:57","16:50","20:14","21:58");
        gun_29      =    new Array("7/16/2015"," 3:22","03:42","5:23","12:57","16:50","20:13","21:57");

	break;
	case "ordu":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:26","02:46","4:47","12:40","16:40","20:14","22:14");
        gun_2      =    new Array("6/19/2015","2:26","02:46","4:47","12:40","16:41","20:14","22:14");
        gun_3      =    new Array("6/20/2015","2:26","02:46","4:47","12:40","16:41","20:15","22:14");
        gun_4      =    new Array("6/21/2015","2:26","02:46","4:47","12:40","16:41","20:15","22:15");
        gun_5      =    new Array("6/22/2015","2:26","02:46","4:48","12:40","16:41","20:15","22:15");
        gun_6      =    new Array("6/23/2015","2:26","02:46","4:48","12:41","16:42","20:15","22:15");
        gun_7      =    new Array("6/24/2015","2:27","02:47","4:48","12:41","16:42","20:15","22:15");
        gun_8      =    new Array("6/25/2015","2:27","02:47","4:48","12:41","16:42","20:16","22:15");
        gun_9      =    new Array("6/26/2015","2:28","02:48","4:49","12:41","16:42","20:16","22:15");
        gun_10      =    new Array("6/27/2015","2:28","02:48","4:49","12:41","16:42","20:16","22:15");
        gun_11      =    new Array("6/28/2015","2:29","02:49","4:50","12:42","16:42","20:16","22:15");
        gun_12      =    new Array("6/29/2015","2:29","02:49","4:50","12:42","16:43","20:16","22:14");
        gun_13      =    new Array("6/30/2015","2:30","02:50","4:50","12:42","16:43","20:16","22:14");
        gun_14      =    new Array("7/1/2015"," 2:31","02:51","4:51","12:42","16:43","20:15","22:14");
        gun_15      =    new Array("7/2/2015"," 2:32","02:52","4:51","12:42","16:43","20:15","22:13");
        gun_16      =    new Array("7/3/2015"," 2:32","02:52","4:52","12:43","16:43","20:15","22:13");
        gun_17      =    new Array("7/4/2015"," 2:33","02:53","4:53","12:43","16:43","20:15","22:12");
        gun_18      =    new Array("7/5/2015"," 2:34","02:54","4:53","12:43","16:43","20:15","22:12");
        gun_19      =    new Array("7/6/2015"," 2:35","02:55","4:54","12:43","16:43","20:14","22:11");
        gun_20      =    new Array("7/7/2015"," 2:36","02:56","4:54","12:43","16:44","20:14","22:11");
        gun_21      =    new Array("7/8/2015"," 2:38","02:58","4:55","12:43","16:44","20:14","22:10");
        gun_22      =    new Array("7/9/2015"," 2:39","02:59","4:56","12:44","16:44","20:13","22:09");
        gun_23      =    new Array("7/10/2015"," 2:40","03:00","4:56","12:44","16:44","20:13","22:08");
        gun_24      =    new Array("7/11/2015"," 2:41","03:01","4:57","12:44","16:44","20:13","22:07");
        gun_25      =    new Array("7/12/2015"," 2:42","03:02","4:58","12:44","16:44","20:12","22:07");
        gun_26      =    new Array("7/13/2015"," 2:44","03:04","4:58","12:44","16:44","20:12","22:06");
        gun_27      =    new Array("7/14/2015"," 2:45","03:05","4:59","12:44","16:44","20:11","22:05");
        gun_28      =    new Array("7/15/2015"," 2:46","03:06","5:00","12:44","16:44","20:10","22:04");
        gun_29      =    new Array("7/16/2015"," 2:48","03:08","5:01","12:45","16:44","20:10","22:02");

	break;
	case "osmaniye":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","3:03","03:23","5:07","12:46","16:38","20:07","21:53");
        gun_2      =    new Array("6/19/2015","3:03","03:23","5:07","12:46","16:39","20:08","21:54");
        gun_3      =    new Array("6/20/2015","3:03","03:23","5:07","12:46","16:39","20:08","21:54");
        gun_4      =    new Array("6/21/2015","3:03","03:23","5:07","12:47","16:39","20:08","21:54");
        gun_5      =    new Array("6/22/2015","3:04","03:24","5:07","12:47","16:39","20:08","21:54");
        gun_6      =    new Array("6/23/2015","3:04","03:24","5:08","12:47","16:40","20:09","21:54");
        gun_7      =    new Array("6/24/2015","3:04","03:24","5:08","12:47","16:40","20:09","21:54");
        gun_8      =    new Array("6/25/2015","3:05","03:25","5:08","12:48","16:40","20:09","21:55");
        gun_9      =    new Array("6/26/2015","3:05","03:25","5:09","12:48","16:40","20:09","21:55");
        gun_10      =    new Array("6/27/2015","3:05","03:25","5:09","12:48","16:40","20:09","21:54");
        gun_11      =    new Array("6/28/2015","3:06","03:26","5:09","12:48","16:41","20:09","21:54");
        gun_12      =    new Array("6/29/2015","3:06","03:26","5:10","12:48","16:41","20:09","21:54");
        gun_13      =    new Array("6/30/2015","3:07","03:27","5:10","12:49","16:41","20:09","21:54");
        gun_14      =    new Array("7/1/2015"," 3:08","03:28","5:11","12:49","16:41","20:09","21:54");
        gun_15      =    new Array("7/2/2015"," 3:08","03:28","5:11","12:49","16:41","20:09","21:54");
        gun_16      =    new Array("7/3/2015"," 3:09","03:29","5:11","12:49","16:41","20:09","21:53");
        gun_17      =    new Array("7/4/2015"," 3:10","03:30","5:12","12:49","16:42","20:09","21:53");
        gun_18      =    new Array("7/5/2015"," 3:11","03:31","5:12","12:50","16:42","20:08","21:53");
        gun_19      =    new Array("7/6/2015"," 3:11","03:31","5:13","12:50","16:42","20:08","21:52");
        gun_20      =    new Array("7/7/2015"," 3:12","03:32","5:14","12:50","16:42","20:08","21:52");
        gun_21      =    new Array("7/8/2015"," 3:13","03:33","5:14","12:50","16:42","20:08","21:51");
        gun_22      =    new Array("7/9/2015"," 3:14","03:34","5:15","12:50","16:42","20:07","21:51");
        gun_23      =    new Array("7/10/2015"," 3:15","03:35","5:15","12:50","16:42","20:07","21:50");
        gun_24      =    new Array("7/11/2015"," 3:16","03:36","5:16","12:50","16:42","20:07","21:49");
        gun_25      =    new Array("7/12/2015"," 3:17","03:37","5:17","12:51","16:42","20:06","21:49");
        gun_26      =    new Array("7/13/2015"," 3:18","03:38","5:17","12:51","16:42","20:06","21:48");
        gun_27      =    new Array("7/14/2015"," 3:19","03:39","5:18","12:51","16:42","20:05","21:47");
        gun_28      =    new Array("7/15/2015"," 3:20","03:40","5:19","12:51","16:42","20:05","21:46");
        gun_29      =    new Array("7/16/2015"," 3:21","03:41","5:19","12:51","16:42","20:04","21:46");

	break;
	case "rize":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:15","02:35","4:37","12:29","16:30","20:03","22:03");
        gun_2      =    new Array("6/19/2015","2:15","02:35","4:37","12:29","16:30","20:04","22:04");
        gun_3      =    new Array("6/20/2015","2:15","02:35","4:37","12:29","16:31","20:04","22:04");
        gun_4      =    new Array("6/21/2015","2:15","02:35","4:37","12:30","16:31","20:04","22:04");
        gun_5      =    new Array("6/22/2015","2:15","02:35","4:37","12:30","16:31","20:04","22:04");
        gun_6      =    new Array("6/23/2015","2:16","02:36","4:37","12:30","16:31","20:05","22:04");
        gun_7      =    new Array("6/24/2015","2:16","02:36","4:38","12:30","16:31","20:05","22:04");
        gun_8      =    new Array("6/25/2015","2:16","02:36","4:38","12:31","16:32","20:05","22:05");
        gun_9      =    new Array("6/26/2015","2:17","02:37","4:38","12:31","16:32","20:05","22:04");
        gun_10      =    new Array("6/27/2015","2:17","02:37","4:39","12:31","16:32","20:05","22:04");
        gun_11      =    new Array("6/28/2015","2:18","02:38","4:39","12:31","16:32","20:05","22:04");
        gun_12      =    new Array("6/29/2015","2:19","02:39","4:40","12:31","16:32","20:05","22:04");
        gun_13      =    new Array("6/30/2015","2:19","02:39","4:40","12:32","16:32","20:05","22:04");
        gun_14      =    new Array("7/1/2015"," 2:20","02:40","4:40","12:32","16:33","20:05","22:03");
        gun_15      =    new Array("7/2/2015"," 2:21","02:41","4:41","12:32","16:33","20:05","22:03");
        gun_16      =    new Array("7/3/2015"," 2:22","02:42","4:42","12:32","16:33","20:04","22:02");
        gun_17      =    new Array("7/4/2015"," 2:23","02:43","4:42","12:32","16:33","20:04","22:02");
        gun_18      =    new Array("7/5/2015"," 2:24","02:44","4:43","12:32","16:33","20:04","22:01");
        gun_19      =    new Array("7/6/2015"," 2:25","02:45","4:43","12:33","16:33","20:04","22:01");
        gun_20      =    new Array("7/7/2015"," 2:26","02:46","4:44","12:33","16:33","20:03","22:00");
        gun_21      =    new Array("7/8/2015"," 2:27","02:47","4:45","12:33","16:33","20:03","21:59");
        gun_22      =    new Array("7/9/2015"," 2:28","02:48","4:45","12:33","16:33","20:03","21:59");
        gun_23      =    new Array("7/10/2015"," 2:29","02:49","4:46","12:33","16:33","20:02","21:58");
        gun_24      =    new Array("7/11/2015"," 2:31","02:51","4:47","12:33","16:33","20:02","21:57");
        gun_25      =    new Array("7/12/2015"," 2:32","02:52","4:47","12:34","16:33","20:01","21:56");
        gun_26      =    new Array("7/13/2015"," 2:33","02:53","4:48","12:34","16:33","20:01","21:55");
        gun_27      =    new Array("7/14/2015"," 2:35","02:55","4:49","12:34","16:33","20:00","21:54");
        gun_28      =    new Array("7/15/2015"," 2:36","02:56","4:50","12:34","16:33","20:00","21:53");
        gun_29      =    new Array("7/16/2015"," 2:37","02:57","4:50","12:34","16:33","19:59","21:52");

	break;
	case "sakarya":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:58","03:18","5:18","13:09","17:10","20:43","22:41");
        gun_2      =    new Array("6/19/2015","2:58","03:18","5:18","13:10","17:10","20:43","22:42");
        gun_3      =    new Array("6/20/2015","2:58","03:18","5:18","13:10","17:10","20:43","22:42");
        gun_4      =    new Array("6/21/2015","2:58","03:18","5:18","13:10","17:11","20:44","22:42");
        gun_5      =    new Array("6/22/2015","2:59","03:19","5:19","13:10","17:11","20:44","22:42");
        gun_6      =    new Array("6/23/2015","2:59","03:19","5:19","13:10","17:11","20:44","22:43");
        gun_7      =    new Array("6/24/2015","2:59","03:19","5:19","13:11","17:11","20:44","22:43");
        gun_8      =    new Array("6/25/2015","3:00","03:20","5:19","13:11","17:11","20:44","22:43");
        gun_9      =    new Array("6/26/2015","3:00","03:20","5:20","13:11","17:12","20:44","22:43");
        gun_10      =    new Array("6/27/2015","3:01","03:21","5:20","13:11","17:12","20:44","22:42");
        gun_11      =    new Array("6/28/2015","3:01","03:21","5:21","13:12","17:12","20:44","22:42");
        gun_12      =    new Array("6/29/2015","3:02","03:22","5:21","13:12","17:12","20:44","22:42");
        gun_13      =    new Array("6/30/2015","3:02","03:22","5:21","13:12","17:12","20:44","22:42");
        gun_14      =    new Array("7/1/2015"," 3:03","03:23","5:22","13:12","17:12","20:44","22:41");
        gun_15      =    new Array("7/2/2015"," 3:04","03:24","5:22","13:12","17:12","20:44","22:41");
        gun_16      =    new Array("7/3/2015"," 3:05","03:25","5:23","13:13","17:13","20:44","22:41");
        gun_17      =    new Array("7/4/2015"," 3:06","03:26","5:23","13:13","17:13","20:44","22:40");
        gun_18      =    new Array("7/5/2015"," 3:07","03:27","5:24","13:13","17:13","20:43","22:40");
        gun_19      =    new Array("7/6/2015"," 3:08","03:28","5:25","13:13","17:13","20:43","22:39");
        gun_20      =    new Array("7/7/2015"," 3:09","03:29","5:25","13:13","17:13","20:43","22:38");
        gun_21      =    new Array("7/8/2015"," 3:10","03:30","5:26","13:13","17:13","20:43","22:38");
        gun_22      =    new Array("7/9/2015"," 3:11","03:31","5:27","13:14","17:13","20:42","22:37");
        gun_23      =    new Array("7/10/2015"," 3:12","03:32","5:27","13:14","17:13","20:42","22:36");
        gun_24      =    new Array("7/11/2015"," 3:13","03:33","5:28","13:14","17:13","20:41","22:35");
        gun_25      =    new Array("7/12/2015"," 3:15","03:35","5:29","13:14","17:13","20:41","22:34");
        gun_26      =    new Array("7/13/2015"," 3:16","03:36","5:29","13:14","17:13","20:40","22:33");
        gun_27      =    new Array("7/14/2015"," 3:17","03:37","5:30","13:14","17:13","20:40","22:32");
        gun_28      =    new Array("7/15/2015"," 3:19","03:39","5:31","13:14","17:13","20:39","22:31");
        gun_29      =    new Array("7/16/2015"," 3:20","03:40","5:32","13:14","17:13","20:39","22:30");

	break;
	case "samsun":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:29","02:49","4:52","12:46","16:47","20:21","22:22");
        gun_2      =    new Array("6/19/2015","2:29","02:49","4:52","12:46","16:47","20:22","22:23");
        gun_3      =    new Array("6/20/2015","2:29","02:49","4:52","12:46","16:48","20:22","22:23");
        gun_4      =    new Array("6/21/2015","2:29","02:49","4:52","12:46","16:48","20:22","22:23");
        gun_5      =    new Array("6/22/2015","2:29","02:49","4:53","12:46","16:48","20:22","22:23");
        gun_6      =    new Array("6/23/2015","2:30","02:50","4:53","12:47","16:48","20:22","22:23");
        gun_7      =    new Array("6/24/2015","2:30","02:50","4:53","12:47","16:48","20:23","22:23");
        gun_8      =    new Array("6/25/2015","2:30","02:50","4:54","12:47","16:49","20:23","22:23");
        gun_9      =    new Array("6/26/2015","2:31","02:51","4:54","12:47","16:49","20:23","22:23");
        gun_10      =    new Array("6/27/2015","2:31","02:51","4:54","12:48","16:49","20:23","22:23");
        gun_11      =    new Array("6/28/2015","2:32","02:52","4:55","12:48","16:49","20:23","22:23");
        gun_12      =    new Array("6/29/2015","2:33","02:53","4:55","12:48","16:49","20:23","22:23");
        gun_13      =    new Array("6/30/2015","2:33","02:53","4:55","12:48","16:49","20:23","22:23");
        gun_14      =    new Array("7/1/2015"," 2:34","02:54","4:56","12:48","16:50","20:23","22:22");
        gun_15      =    new Array("7/2/2015"," 2:35","02:55","4:56","12:49","16:50","20:22","22:22");
        gun_16      =    new Array("7/3/2015"," 2:36","02:56","4:57","12:49","16:50","20:22","22:21");
        gun_17      =    new Array("7/4/2015"," 2:37","02:57","4:58","12:49","16:50","20:22","22:21");
        gun_18      =    new Array("7/5/2015"," 2:38","02:58","4:58","12:49","16:50","20:22","22:20");
        gun_19      =    new Array("7/6/2015"," 2:39","02:59","4:59","12:49","16:50","20:21","22:20");
        gun_20      =    new Array("7/7/2015"," 2:40","03:00","4:59","12:49","16:50","20:21","22:19");
        gun_21      =    new Array("7/8/2015"," 2:41","03:01","5:00","12:50","16:50","20:21","22:18");
        gun_22      =    new Array("7/9/2015"," 2:42","03:02","5:01","12:50","16:50","20:20","22:17");
        gun_23      =    new Array("7/10/2015"," 2:44","03:04","5:01","12:50","16:50","20:20","22:17");
        gun_24      =    new Array("7/11/2015"," 2:45","03:05","5:02","12:50","16:50","20:20","22:16");
        gun_25      =    new Array("7/12/2015"," 2:46","03:06","5:03","12:50","16:50","20:19","22:15");
        gun_26      =    new Array("7/13/2015"," 2:47","03:07","5:04","12:50","16:50","20:19","22:14");
        gun_27      =    new Array("7/14/2015"," 2:49","03:09","5:04","12:50","16:50","20:18","22:13");
        gun_28      =    new Array("7/15/2015"," 2:50","03:10","5:05","12:50","16:50","20:17","22:12");
        gun_29      =    new Array("7/16/2015"," 2:52","03:12","5:06","12:51","16:50","20:17","22:11");

	break;
	case "siirt":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:34","02:54","4:41","12:23","16:18","19:48","21:36");
        gun_2      =    new Array("6/19/2015","2:34","02:54","4:41","12:24","16:18","19:48","21:37");
        gun_3      =    new Array("6/20/2015","2:34","02:54","4:41","12:24","16:18","19:48","21:37");
        gun_4      =    new Array("6/21/2015","2:34","02:54","4:41","12:24","16:18","19:49","21:37");
        gun_5      =    new Array("6/22/2015","2:34","02:54","4:41","12:24","16:19","19:49","21:38");
        gun_6      =    new Array("6/23/2015","2:34","02:54","4:42","12:24","16:19","19:49","21:38");
        gun_7      =    new Array("6/24/2015","2:35","02:55","4:42","12:25","16:19","19:49","21:38");
        gun_8      =    new Array("6/25/2015","2:35","02:55","4:42","12:25","16:19","19:49","21:38");
        gun_9      =    new Array("6/26/2015","2:36","02:56","4:43","12:25","16:19","19:49","21:38");
        gun_10      =    new Array("6/27/2015","2:36","02:56","4:43","12:25","16:20","19:49","21:38");
        gun_11      =    new Array("6/28/2015","2:36","02:56","4:43","12:25","16:20","19:50","21:38");
        gun_12      =    new Array("6/29/2015","2:37","02:57","4:44","12:26","16:20","19:50","21:38");
        gun_13      =    new Array("6/30/2015","2:38","02:58","4:44","12:26","16:20","19:49","21:37");
        gun_14      =    new Array("7/1/2015"," 2:38","02:58","4:45","12:26","16:20","19:49","21:37");
        gun_15      =    new Array("7/2/2015"," 2:39","02:59","4:45","12:26","16:20","19:49","21:37");
        gun_16      =    new Array("7/3/2015"," 2:40","03:00","4:45","12:26","16:21","19:49","21:36");
        gun_17      =    new Array("7/4/2015"," 2:40","03:00","4:46","12:27","16:21","19:49","21:36");
        gun_18      =    new Array("7/5/2015"," 2:41","03:01","4:47","12:27","16:21","19:49","21:36");
        gun_19      =    new Array("7/6/2015"," 2:42","03:02","4:47","12:27","16:21","19:49","21:35");
        gun_20      =    new Array("7/7/2015"," 2:43","03:03","4:48","12:27","16:21","19:48","21:35");
        gun_21      =    new Array("7/8/2015"," 2:44","03:04","4:48","12:27","16:21","19:48","21:34");
        gun_22      =    new Array("7/9/2015"," 2:45","03:05","4:49","12:27","16:21","19:48","21:34");
        gun_23      =    new Array("7/10/2015"," 2:46","03:06","4:49","12:28","16:21","19:47","21:33");
        gun_24      =    new Array("7/11/2015"," 2:47","03:07","4:50","12:28","16:21","19:47","21:32");
        gun_25      =    new Array("7/12/2015"," 2:48","03:08","4:51","12:28","16:21","19:47","21:31");
        gun_26      =    new Array("7/13/2015"," 2:49","03:09","4:51","12:28","16:21","19:46","21:31");
        gun_27      =    new Array("7/14/2015"," 2:50","03:10","4:52","12:28","16:21","19:46","21:30");
        gun_28      =    new Array("7/15/2015"," 2:51","03:11","4:53","12:28","16:21","19:45","21:29");
        gun_29      =    new Array("7/16/2015"," 2:52","03:12","4:54","12:28","16:21","19:45","21:28");

	break;
	case "sinop":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:28","02:48","4:55","12:50","16:54","20:28","22:32");
        gun_2      =    new Array("6/19/2015","2:28","02:48","4:55","12:51","16:54","20:28","22:32");
        gun_3      =    new Array("6/20/2015","2:28","02:48","4:55","12:51","16:54","20:29","22:33");
        gun_4      =    new Array("6/21/2015","2:28","02:48","4:55","12:51","16:54","20:29","22:33");
        gun_5      =    new Array("6/22/2015","2:28","02:48","4:56","12:51","16:54","20:29","22:33");
        gun_6      =    new Array("6/23/2015","2:28","02:48","4:56","12:51","16:55","20:29","22:33");
        gun_7      =    new Array("6/24/2015","2:29","02:49","4:56","12:52","16:55","20:29","22:33");
        gun_8      =    new Array("6/25/2015","2:29","02:49","4:56","12:52","16:55","20:29","22:33");
        gun_9      =    new Array("6/26/2015","2:29","02:49","4:57","12:52","16:55","20:29","22:33");
        gun_10      =    new Array("6/27/2015","2:30","02:50","4:57","12:52","16:55","20:29","22:33");
        gun_11      =    new Array("6/28/2015","2:31","02:51","4:57","12:53","16:56","20:29","22:33");
        gun_12      =    new Array("6/29/2015","2:31","02:51","4:58","12:53","16:56","20:29","22:33");
        gun_13      =    new Array("6/30/2015","2:32","02:52","4:58","12:53","16:56","20:29","22:32");
        gun_14      =    new Array("7/1/2015"," 2:33","02:53","4:59","12:53","16:56","20:29","22:32");
        gun_15      =    new Array("7/2/2015"," 2:34","02:54","4:59","12:53","16:56","20:29","22:31");
        gun_16      =    new Array("7/3/2015"," 2:35","02:55","5:00","12:54","16:56","20:29","22:31");
        gun_17      =    new Array("7/4/2015"," 2:36","02:56","5:00","12:54","16:56","20:29","22:30");
        gun_18      =    new Array("7/5/2015"," 2:37","02:57","5:01","12:54","16:56","20:28","22:30");
        gun_19      =    new Array("7/6/2015"," 2:38","02:58","5:02","12:54","16:56","20:28","22:29");
        gun_20      =    new Array("7/7/2015"," 2:39","02:59","5:02","12:54","16:57","20:28","22:28");
        gun_21      =    new Array("7/8/2015"," 2:40","03:00","5:03","12:54","16:57","20:27","22:28");
        gun_22      =    new Array("7/9/2015"," 2:42","03:02","5:04","12:55","16:57","20:27","22:27");
        gun_23      =    new Array("7/10/2015"," 2:43","03:03","5:04","12:55","16:57","20:27","22:26");
        gun_24      =    new Array("7/11/2015"," 2:44","03:04","5:05","12:55","16:57","20:26","22:25");
        gun_25      =    new Array("7/12/2015"," 2:46","03:06","5:06","12:55","16:57","20:26","22:24");
        gun_26      =    new Array("7/13/2015"," 2:47","03:07","5:07","12:55","16:57","20:25","22:23");
        gun_27      =    new Array("7/14/2015"," 2:48","03:08","5:07","12:55","16:56","20:25","22:22");
        gun_28      =    new Array("7/15/2015"," 2:50","03:10","5:08","12:55","16:56","20:24","22:21");
        gun_29      =    new Array("7/16/2015"," 2:51","03:11","5:09","12:55","16:56","20:23","22:20");

	break;
	case "sivas":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015"," #2:40","03:00","4:55","12:43","16:41","20:13","22:08");
        gun_2      =    new Array("6/19/2015"," #2:40","03:00","4:55","12:43","16:41","20:14","22:08");
        gun_3      =    new Array("6/20/2015"," #2:40","03:00","4:55","12:43","16:42","20:14","22:09");
        gun_4      =    new Array("6/21/2015"," #2:40","03:00","4:55","12:44","16:42","20:14","22:09");
        gun_5      =    new Array("6/22/2015"," #2:40","03:00","4:55","12:44","16:42","20:14","22:09");
        gun_6      =    new Array("6/23/2015"," #2:41","03:01","4:56","12:44","16:42","20:15","22:09");
        gun_7      =    new Array("6/24/2015"," #2:41","03:01","4:56","12:44","16:43","20:15","22:09");
        gun_8      =    new Array("6/25/2015"," #2:41","03:01","4:56","12:45","16:43","20:15","22:09");
        gun_9      =    new Array("6/26/2015"," #2:42","03:02","4:57","12:45","16:43","20:15","22:09");
        gun_10      =    new Array("6/27/2015"," #2:42","03:02","4:57","12:45","16:43","20:15","22:09");
        gun_11      =    new Array("6/28/2015"," #2:43","03:03","4:57","12:45","16:43","20:15","22:09");
        gun_12      =    new Array("6/29/2015"," #2:43","03:03","4:58","12:45","16:43","20:15","22:09");
        gun_13      =    new Array("6/30/2015"," #2:44","03:04","4:58","12:46","16:44","20:15","22:09");
        gun_14      =    new Array("7/1/2015"," # 2:45","03:05","4:59","12:46","16:44","20:15","22:08");
        gun_15      =    new Array("7/2/2015"," # 2:45","03:05","4:59","12:46","16:44","20:15","22:08");
        gun_16      =    new Array("7/3/2015"," # 2:46","03:06","5:00","12:46","16:44","20:14","22:08");
        gun_17      =    new Array("7/4/2015"," # 2:47","03:07","5:00","12:46","16:44","20:14","22:07");
        gun_18      =    new Array("7/5/2015"," # 2:48","03:08","5:01","12:46","16:44","20:14","22:07");
        gun_19      =    new Array("7/6/2015"," # 2:49","03:09","5:01","12:47","16:44","20:14","22:06");
        gun_20      =    new Array("7/7/2015"," # 2:50","03:10","5:02","12:47","16:44","20:14","22:06");
        gun_21      =    new Array("7/8/2015"," # 2:51","03:11","5:02","12:47","16:45","20:13","22:05");
        gun_22      =    new Array("7/9/2015"," # 2:52","03:12","5:03","12:47","16:45","20:13","22:04");
        gun_23      =    new Array("7/10/2015"," # 2:53","03:13","5:04","12:47","16:45","20:12","22:03");
        gun_24      =    new Array("7/11/2015"," # 2:54","03:14","5:04","12:47","16:45","20:12","22:03");
        gun_25      =    new Array("7/12/2015"," # 2:55","03:15","5:05","12:48","16:45","20:12","22:02");
        gun_26      =    new Array("7/13/2015"," # 2:57","03:17","5:06","12:48","16:45","20:11","22:01");
        gun_27      =    new Array("7/14/2015"," # 2:58","03:18","5:07","12:48","16:45","20:11","22:00");
        gun_28      =    new Array("7/15/2015"," # 2:59","03:19","5:07","12:48","16:45","20:10","21:59");
        gun_29      =    new Array("7/16/2015"," # 3:00","03:20","5:08","12:48","16:45","20:09","21:58");


	break;
	case "tekirdag":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","3:07","03:27","5:28","13:21","17:22","20:56","22:55");
        gun_2      =    new Array("6/19/2015","3:07","03:27","5:29","13:21","17:22","20:56","22:56");
        gun_3      =    new Array("6/20/2015","3:07","03:27","5:29","13:21","17:22","20:56","22:56");
        gun_4      =    new Array("6/21/2015","3:07","03:27","5:29","13:22","17:23","20:56","22:56");
        gun_5      =    new Array("6/22/2015","3:08","03:28","5:29","13:22","17:23","20:57","22:56");
        gun_6      =    new Array("6/23/2015","3:08","03:28","5:29","13:22","17:23","20:57","22:56");
        gun_7      =    new Array("6/24/2015","3:08","03:28","5:30","13:22","17:23","20:57","22:56");
        gun_8      =    new Array("6/25/2015","3:09","03:29","5:30","13:23","17:23","20:57","22:56");
        gun_9      =    new Array("6/26/2015","3:09","03:29","5:30","13:23","17:24","20:57","22:56");
        gun_10      =    new Array("6/27/2015","3:10","03:30","5:31","13:23","17:24","20:57","22:56");
        gun_11      =    new Array("6/28/2015","3:10","03:30","5:31","13:23","17:24","20:57","22:56");
        gun_12      =    new Array("6/29/2015","3:11","03:31","5:31","13:23","17:24","20:57","22:56");
        gun_13      =    new Array("6/30/2015","3:11","03:31","5:32","13:24","17:24","20:57","22:56");
        gun_14      =    new Array("7/1/2015"," 3:12","03:32","5:32","13:24","17:24","20:57","22:55");
        gun_15      =    new Array("7/2/2015"," 3:13","03:33","5:33","13:24","17:25","20:57","22:55");
        gun_16      =    new Array("7/3/2015"," 3:14","03:34","5:33","13:24","17:25","20:57","22:54");
        gun_17      =    new Array("7/4/2015"," 3:15","03:35","5:34","13:24","17:25","20:56","22:54");
        gun_18      =    new Array("7/5/2015"," 3:16","03:36","5:35","13:24","17:25","20:56","22:53");
        gun_19      =    new Array("7/6/2015"," 3:17","03:37","5:35","13:25","17:25","20:56","22:53");
        gun_20      =    new Array("7/7/2015"," 3:18","03:38","5:36","13:25","17:25","20:56","22:52");
        gun_21      =    new Array("7/8/2015"," 3:19","03:39","5:36","13:25","17:25","20:55","22:51");
        gun_22      =    new Array("7/9/2015"," 3:20","03:40","5:37","13:25","17:25","20:55","22:51");
        gun_23      =    new Array("7/10/2015"," 3:21","03:41","5:38","13:25","17:25","20:54","22:50");
        gun_24      =    new Array("7/11/2015"," 3:23","03:43","5:38","13:25","17:25","20:54","22:49");
        gun_25      =    new Array("7/12/2015"," 3:24","03:44","5:39","13:26","17:25","20:53","22:48");
        gun_26      =    new Array("7/13/2015"," 3:25","03:45","5:40","13:26","17:25","20:53","22:47");
        gun_27      =    new Array("7/14/2015"," 3:27","03:47","5:41","13:26","17:25","20:52","22:46");
        gun_28      =    new Array("7/15/2015"," 3:28","03:48","5:41","13:26","17:25","20:52","22:45");
        gun_29      =    new Array("7/16/2015"," 3:29","03:49","5:42","13:26","17:25","20:51","22:44");


	break;
	case "tokat":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:37","02:57","4:54","12:45","16:44","20:17","22:14");
        gun_2      =    new Array("6/19/2015","2:37","02:57","4:55","12:45","16:45","20:17","22:14");
        gun_3      =    new Array("6/20/2015","2:37","02:57","4:55","12:45","16:45","20:18","22:15");
        gun_4      =    new Array("6/21/2015","2:37","02:57","4:55","12:45","16:45","20:18","22:15");
        gun_5      =    new Array("6/22/2015","2:37","02:57","4:55","12:46","16:45","20:18","22:15");
        gun_6      =    new Array("6/23/2015","2:37","02:57","4:55","12:46","16:45","20:18","22:15");
        gun_7      =    new Array("6/24/2015","2:38","02:58","4:56","12:46","16:46","20:18","22:15");
        gun_8      =    new Array("6/25/2015","2:38","02:58","4:56","12:46","16:46","20:18","22:15");
        gun_9      =    new Array("6/26/2015","2:38","02:58","4:56","12:46","16:46","20:19","22:15");
        gun_10      =    new Array("6/27/2015","2:39","02:59","4:57","12:47","16:46","20:19","22:15");
        gun_11      =    new Array("6/28/2015","2:40","03:00","4:57","12:47","16:46","20:19","22:15");
        gun_12      =    new Array("6/29/2015","2:40","03:00","4:57","12:47","16:46","20:19","22:15");
        gun_13      =    new Array("6/30/2015","2:41","03:01","4:58","12:47","16:47","20:19","22:15");
        gun_14      =    new Array("7/1/2015"," 2:42","03:02","4:58","12:47","16:47","20:18","22:14");
        gun_15      =    new Array("7/2/2015"," 2:42","03:02","4:59","12:48","16:47","20:18","22:14");
        gun_16      =    new Array("7/3/2015"," 2:43","03:03","4:59","12:48","16:47","20:18","22:13");
        gun_17      =    new Array("7/4/2015"," 2:44","03:04","5:00","12:48","16:47","20:18","22:13");
        gun_18      =    new Array("7/5/2015"," 2:45","03:05","5:00","12:48","16:47","20:18","22:12");
        gun_19      =    new Array("7/6/2015"," 2:46","03:06","5:01","12:48","16:47","20:17","22:12");
        gun_20      =    new Array("7/7/2015"," 2:47","03:07","5:02","12:49","16:47","20:17","22:11");
        gun_21      =    new Array("7/8/2015"," 2:48","03:08","5:02","12:49","16:47","20:17","22:11");
        gun_22      =    new Array("7/9/2015"," 2:49","03:09","5:03","12:49","16:48","20:16","22:10");
        gun_23      =    new Array("7/10/2015"," 2:50","03:10","5:04","12:49","16:48","20:16","22:09");
        gun_24      =    new Array("7/11/2015"," 2:52","03:12","5:04","12:49","16:48","20:16","22:08");
        gun_25      =    new Array("7/12/2015"," 2:53","03:13","5:05","12:49","16:48","20:15","22:07");
        gun_26      =    new Array("7/13/2015"," 2:54","03:14","5:06","12:49","16:48","20:15","22:06");
        gun_27      =    new Array("7/14/2015"," 2:55","03:15","5:06","12:50","16:48","20:14","22:06");
        gun_28      =    new Array("7/15/2015"," 2:57","03:17","5:07","12:50","16:48","20:14","22:05");
        gun_29      =    new Array("7/16/2015"," 2:58","03:18","5:08","12:50","16:47","20:13","22:04");


	break;
	case "trabzon":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:18","02:38","4:40","12:32","16:33","20:07","22:07");
        gun_2      =    new Array("6/19/2015","2:18","02:38","4:40","12:32","16:33","20:07","22:07");
        gun_3      =    new Array("6/20/2015","2:18","02:38","4:40","12:33","16:34","20:07","22:07");
        gun_4      =    new Array("6/21/2015","2:18","02:38","4:40","12:33","16:34","20:08","22:07");
        gun_5      =    new Array("6/22/2015","2:19","02:39","4:40","12:33","16:34","20:08","22:08");
        gun_6      =    new Array("6/23/2015","2:19","02:39","4:41","12:33","16:34","20:08","22:08");
        gun_7      22:05,=    new Array("6/24/2015","2:19","02:39","4:41","12:33","16:34","20:08","22:08");
        gun_8      =    new Array("6/25/2015","2:20","02,:40","4:41","12:34","16:35","20:08","22:08");
        gun_9      =    new Array("6/26/2015","2:20","02:40","4:41","12:34","16:35","20:08","22:08");
        gun_10      =    new Array("6/27/2015","2:21","02:41","4:42","12:34","16:35","20:08","22:08");
        gun_11      =    new Array("6/28/2015","2:21","02:41","4:42","12:34","16:35","20:08","22:07");
        gun_12      =    new Array("6/29/2015","2:22","02:42","4:43","12:35","16:35","20:08","22:07");
        gun_13      =    new Array("6/30/2015","2:22","02:42","4:43","12:35","16:36","20:08","22:07");
        gun_14      =    new Array("7/1/2015"," 2:23","02:43","4:44","12:35","16:36","20:08","22:07");
        gun_15      =    new Array("7/2/2015"," 2:24","02:44","4:44","12:35","16:36","20:08","22:06");
        gun_16      =    new Array("7/3/2015"," 2:25","02:45","4:45","12:35","16:36","20:08","22:06");
        gun_17      =    new Array("7/4/2015"," 2:26","02:46","4:45","12:35","16:36","20:08","22:05");
        gun_18      =    new Array("7/5/2015"," 2:27","02:47","4:46","12:36","16:36","20:07","22:05");
        gun_19      =    new Array("7/6/2015"," 2:28","02:48","4:46","12:36","16:36","20:07","22:04");
        gun_20      =    new Array("7/7/2015"," 2:29","02:49","4:47","12:36","16:36","20:07","22:03");
        gun_21      =    new Array("7/8/2015"," 2:30","02:50","4:48","12:36","16:36","20:06","22:03");
        gun_22      =    new Array("7/9/2015"," 2:31","02:51","4:48","12:36","16:36","20:06","22:02");
        gun_23      =    new Array("7/10/2015"," 2:32","02:52","4:49","12:36","16:36","20:06","22:01");
        gun_24      =    new Array("7/11/2015"," 2:34","02:54","4:50","12:37","16:36","20:05","22:00");
        gun_25      =    new Array("7/12/2015"," 2:35","02:55","4:50","12:37","16:36","20:05","21:59");
        gun_26      =    new Array("7/13/2015"," 2:36","02:56","4:51","12:37","16:36","20:04","21:58");
        gun_27      =    new Array("7/14/2015"," 2:38","02:58","4:52","12:37","16:36","20:04","21:57");
        gun_28      =    new Array("7/15/2015"," 2:39","02:59","4:53","12:37","16:36","20:03","21:56");
        gun_29      =    new Array("7/16/2015"," 2:40","03:00","4:53","12:37","16:36","20:03","21:55");


	break;
	case "tunceli":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:34","02:54","4:46","12:33","16:30","20:01","21:54");
        gun_2      =    new Array("6/19/2015","2:35","02:55","4:47","12:33","16:30","20:01","21:54");
        gun_3      =    new Array("6/20/2015","2:35","02:55","4:47","12:33","16:30","20:02","21:54");
        gun_4      =    new Array("6/21/2015","2:35","02:55","4:47","12:33","16:30","20:02","21:54");
        gun_5      =    new Array("6/22/2015","2:35","02:55","4:47","12:34","16:31","20:02","21:55");
        gun_6      =    new Array("6/23/2015","2:35","02:55","4:47","12:34","16:31","20:02","21:55");
        gun_7      =    new Array("6/24/2015","2:36","02:56","4:48","12:34","16:31","20:02","21:55");
        gun_8      =    new Array("6/25/2015","2:36","02:56","4:48","12:34","16:31","20:03","21:55");
        gun_9      =    new Array("6/26/2015","2:36","02:56","4:48","12:35","16:31","20:03","21:55");
        gun_10      =    new Array("6/27/2015","2:37","02:57","4:49","12:35","16:32","20:03","21:55");
        gun_11      =    new Array("6/28/2015","2:37","02:57","4:49","12:35","16:32","20:03","21:55");
        gun_12      =    new Array("6/29/2015","2:38","02:58","4:49","12:35","16:32","20:03","21:55");
        gun_13      =    new Array("6/30/2015","2:39","02:59","4:50","12:35","16:32","20:03","21:54");
        gun_14      =    new Array("7/1/2015"," 2:39","02:59","4:50","12:36","16:32","20:03","21:54");
        gun_15      =    new Array("7/2/2015"," 2:40","03:00","4:51","12:36","16:32","20:02","21:54");
        gun_16      =    new Array("7/3/2015"," 2:41","03:01","4:51","12:36","16:33","20:02","21:53");
        gun_17      =    new Array("7/4/2015"," 2:42","03:02","4:52","12:36","16:33","20:02","21:53");
        gun_18      =    new Array("7/5/2015"," 2:42","03:02","4:52","12:36","16:33","20:02","21:52");
        gun_19      =    new Array("7/6/2015"," 2:43","03:03","4:53","12:36","16:33","20:02","21:52");
        gun_20      =    new Array("7/7/2015"," 2:44","03:04","4:54","12:37","16:33","20:01","21:51");
        gun_21      =    new Array("7/8/2015"," 2:45","03:05","4:54","12:37","16:33","20:01","21:51");
        gun_22      =    new Array("7/9/2015"," 2:46","03:06","4:55","12:37","16:33","20:01","21:50");
        gun_23      =    new Array("7/10/2015"," 2:47","03:07","4:55","12:37","16:33","20:00","21:49");
        gun_24      =    new Array("7/11/2015"," 2:48","03:08","4:56","12:37","16:33","20:00","21:49");
        gun_25      =    new Array("7/12/2015"," 2:50","03:10","4:57","12:37","16:33","20:00","21:48");
        gun_26      =    new Array("7/13/2015"," 2:51","03:11","4:57","12:37","16:33","19:59","21:47");
        gun_27      =    new Array("7/14/2015"," 2:52","03:12","4:58","12:38","16:33","19:59","21:46");
        gun_28      =    new Array("7/15/2015"," 2:53","03:13","4:59","12:38","16:33","19:58","21:45");
        gun_29      =    new Array("7/16/2015"," 2:54","03:14","5:00","12:38","16:33","19:58","21:44");


	break;
	case "usak":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","3:19","03:39","5:29","13:13","17:09","20:40","22:31");
        gun_2      =    new Array("6/19/2015","3:19","03:39","5:29","13:14","17:10","20:40","22:31");
        gun_3      =    new Array("6/20/2015","3:19","03:39","5:29","13:14","17:10","20:41","22:32");
        gun_4      =    new Array("6/21/2015","3:19","03:39","5:29","13:14","17:10","20:41","22:32");
        gun_5      =    new Array("6/22/2015","3:19","03:39","5:29","13:14","17:10","20:41","22:32");
        gun_6      =    new Array("6/23/2015","3:19","03:39","5:30","13:14","17:10","20:41","22:32");
        gun_7      =    new Array("6/24/2015","3:20","03:40","5:30","13:15","17:11","20:41","22:32");
        gun_8      =    new Array("6/25/2015","3:20","03:40","5:30","13:15","17:11","20:42","22:32");
        gun_9      =    new Array("6/26/2015","3:21","03:41","5:31","13:15","17:11","20:42","22:32");
        gun_10      =    new Array("6/27/2015","3:21","03:41","5:31","13:15","17:11","20:42","22:32");
        gun_11      =    new Array("6/28/2015","3:22","03:42","5:31","13:16","17:11","20:42","22:32");
        gun_12      =    new Array("6/29/2015","3:22","03:42","5:32","13:16","17:12","20:42","22:32");
        gun_13      =    new Array("6/30/2015","3:23","03:43","5:32","13:16","17:12","20:42","22:32");
        gun_14      =    new Array("7/1/2015"," 3:23","03:43","5:33","13:16","17:12","20:42","22:31");
        gun_15      =    new Array("7/2/2015"," 3:24","03:44","5:33","13:16","17:12","20:41","22:31");
        gun_16      =    new Array("7/3/2015"," 3:25","03:45","5:34","13:17","17:12","20:41","22:31");
        gun_17      =    new Array("7/4/2015"," 3:26","03:46","5:34","13:17","17:12","20:41","22:30");
        gun_18      =    new Array("7/5/2015"," 3:27","03:47","5:35","13:17","17:12","20:41","22:30");
        gun_19      =    new Array("7/6/2015"," 3:27","03:47","5:35","13:17","17:13","20:41","22:29");
        gun_20      =    new Array("7/7/2015"," 3:28","03:48","5:36","13:17","17:13","20:40","22:29");
        gun_21      =    new Array("7/8/2015"," 3:29","03:49","5:36","13:17","17:13","20:40","22:28");
        gun_22      =    new Array("7/9/2015"," 3:30","03:50","5:37","13:18","17:13","20:40","22:28");
        gun_23      =    new Array("7/10/2015"," 3:31","03:51","5:38","13:18","17:13","20:39","22:27");
        gun_24      =    new Array("7/11/2015"," 3:32","03:52","5:38","13:18","17:13","20:39","22:26");
        gun_25      =    new Array("7/12/2015"," 3:33","03:53","5:39","13:18","17:13","20:39","22:26");
        gun_26      =    new Array("7/13/2015"," 3:35","03:55","5:40","13:18","17:13","20:38","22:25");
        gun_27      =    new Array("7/14/2015"," 3:36","03:56","5:40","13:18","17:13","20:38","22:24");
        gun_28      =    new Array("7/15/2015"," 3:37","03:57","5:41","13:18","17:13","20:37","22:23");
        gun_29      =    new Array("7/16/2015"," 3:38","03:58","5:42","13:18","17:13","20:37","22:22");

	break;
	case "van":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:24","02:44","4:33","12:18","16:13","19:44","21:34");
        gun_2      =    new Array("6/19/2015","2:24","02:44","4:34","12:18","16:13","19:44","21:34");
        gun_3      =    new Array("6/20/2015","2:24","02:44","4:34","12:18","16:14","19:44","21:34");
        gun_4      =    new Array("6/21/2015","2:25","02:45","4:34","12:18","16:14","19:44","21:35");
        gun_5      =    new Array("6/22/2015","2:25","02:45","4:34","12:18","16:14","19:45","21:35");
        gun_6      =    new Array("6/23/2015","2:25","02:45","4:34","12:19","16:14","19:45","21:35");
        gun_7      =    new Array("6/24/2015","2:25","02:45","4:35","12:19","16:14","19:45","21:35");
        gun_8      =    new Array("6/25/2015","2:26","02:46","4:35","12:19","16:15","19:45","21:35");
        gun_9      =    new Array("6/26/2015","2:26","02:46","4:35","12:19","16:15","19:45","21:35");
        gun_10      =    new Array("6/27/2015","2:27","02:47","4:36","12:19","16:15","19:45","21:35");
        gun_11      =    new Array("6/28/2015","2:27","02:47","4:36","12:20","16:15","19:45","21:35");
        gun_12      =    new Array("6/29/2015","2:28","02:48","4:36","12:20","16:15","19:45","21:35");
        gun_13      =    new Array("6/30/2015","2:28","02:48","4:37","12:20","16:15","19:45","21:35");
        gun_14      =    new Array("7/1/2015"," 2:29","02:49","4:37","12:20","16:16","19:45","21:34");
        gun_15      =    new Array("7/2/2015"," 2:30","02:50","4:38","12:20","16:16","19:45","21:34");
        gun_16      =    new Array("7/3/2015"," 2:30","02:50","4:38","12:21","16:16","19:45","21:34");
        gun_17      =    new Array("7/4/2015"," 2:31","02:51","4:39","12:21","16:16","19:45","21:33");
        gun_18      =    new Array("7/5/2015"," 2:32","02:52","4:39","12:21","16:16","19:44","21:33");
        gun_19      =    new Array("7/6/2015"," 2:33","02:53","4:40","12:21","16:16","19:44","21:32");
        gun_20      =    new Array("7/7/2015"," 2:34","02:54","4:40","12:21","16:16","19:44","21:32");
        gun_21      =    new Array("7/8/2015"," 2:35","02:55","4:41","12:21","16:16","19:44","21:31");
        gun_22      =    new Array("7/9/2015"," 2:36","02:56","4:42","12:22","16:17","19:43","21:31");
        gun_23      =    new Array("7/10/2015"," 2:37","02:57","4:42","12:22","16:17","19:43","21:30");
        gun_24      =    new Array("7/11/2015"," 2:38","02:58","4:43","12:22","16:17","19:43","21:29");
        gun_25      =    new Array("7/12/2015"," 2:39","02:59","4:44","12:22","16:17","19:42","21:29");
        gun_26      =    new Array("7/13/2015"," 2:40","03:00","4:44","12:22","16:17","19:42","21:28");
        gun_27      =    new Array("7/14/2015"," 2:41","03:01","4:45","12:22","16:17","19:41","21:27");
        gun_28      =    new Array("7/15/2015"," 2:42","03:02","4:46","12:22","16:17","19:41","21:26");
        gun_29      =    new Array("7/16/2015"," 2:43","03:03","4:46","12:23","16:17","19:40","21:25");

	break;
	case "yalova":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","3:03","03:23","5:22","13:14","17:14","20:47","22:46");
        gun_2      =    new Array("6/19/2015","3:03","03:23","5:23","13:14","17:14","20:48","22:46");
        gun_3      =    new Array("6/20/2015","3:03","03:23","5:23","13:14","17:15","20:48","22:46");
        gun_4      =    new Array("6/21/2015","3:03","03:23","5:23","13:15","17:15","20:48","22:47");
        gun_5      =    new Array("6/22/2015","3:03","03:23","5:23","13:15","17:15","20:48","22:47");
        gun_6      =    new Array("6/23/2015","3:04","03:24","5:23","13:15","17:15","20:49","22:47");
        gun_7      =    new Array("6/24/2015","3:04","03:24","5:24","13:15","17:15","20:49","22:47");
        gun_8      =    new Array("6/25/2015","3:04","03:24","5:24","13:15","17:16","20:49","22:47");
        gun_9      =    new Array("6/26/2015","3:05","03:25","5:24","13:16","17:16","20:49","22:47");
        gun_10      =    new Array("6/27/2015","3:05","03:25","5:25","13:16","17:16","20:49","22:47");
        gun_11      =    new Array("6/28/2015","3:06","03:26","5:25","13:16","17:16","20:49","22:47");
        gun_12      =    new Array("6/29/2015","3:06","03:26","5:25","13:16","17:16","20:49","22:46");
        gun_13      =    new Array("6/30/2015","3:07","03:27","5:26","13:16","17:17","20:49","22:46");
        gun_14      =    new Array("7/1/2015"," 3:08","03:28","5:26","13:17","17:17","20:49","22:46");
        gun_15      =    new Array("7/2/2015"," 3:09","03:29","5:27","13:17","17:17","20:49","22:45");
        gun_16      =    new Array("7/3/2015"," 3:10","03:30","5:27","13:17","17:17","20:48","22:45");
        gun_17      =    new Array("7/4/2015"," 3:11","03:31","5:28","13:17","17:17","20:48","22:45");
        gun_18      =    new Array("7/5/2015"," 3:11","03:31","5:29","13:17","17:17","20:48","22:44");
        gun_19      =    new Array("7/6/2015"," 3:12","03:32","5:29","13:18","17:17","20:48","22:43");
        gun_20      =    new Array("7/7/2015"," 3:14","03:34","5:30","13:18","17:17","20:47","22:43");
        gun_21      =    new Array("7/8/2015"," 3:15","03:35","5:30","13:18","17:17","20:47","22:42");
        gun_22      =    new Array("7/9/2015"," 3:16","03:36","5:31","13:18","17:17","20:47","22:41");
        gun_23      =    new Array("7/10/2015"," 3:17","03:37","5:32","13:18","17:17","20:46","22:41");
        gun_24      =    new Array("7/11/2015"," 3:18","03:38","5:32","13:18","17:17","20:46","22:40");
        gun_25      =    new Array("7/12/2015"," 3:19","03:39","5:33","13:18","17:17","20:45","22:39");
        gun_26      =    new Array("7/13/2015"," 3:21","03:41","5:34","13:19","17:17","20:45","22:38");
        gun_27      =    new Array("7/14/2015"," 3:22","03:42","5:35","13:19","17:17","20:44","22:37");
        gun_28      =    new Array("7/15/2015"," 3:23","03:43","5:35","13:19","17:17","20:44","22:36");
        gun_29      =    new Array("7/16/2015"," 3:25","03:45","5:36","13:19","17:17","20:43","22:35");

	break;
	case "yozgat":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:48","03:08","5:03","12:52","16:50","20:23","22:18");
        gun_2      =    new Array("6/19/2015","2:48","03:08","5:03","12:52","16:51","20:23","22:18");
        gun_3      =    new Array("6/20/2015","2:48","03:08","5:03","12:52","16:51","20:23","22:18");
        gun_4      =    new Array("6/21/2015","2:48","03:08","5:04","12:53","16:51","20:23","22:18");
        gun_5      =    new Array("6/22/2015","2:48","03:08","5:04","12:53","16:51","20:24","22:19");
        gun_6      =    new Array("6/23/2015","2:49","03:09","5:04","12:53","16:51","20:24","22:19");
        gun_7      =    new Array("6/24/2015","2:49","03:09","5:04","12:53","16:52","20:24","22:19");
        gun_8      =    new Array("6/25/2015","2:49","03:09","5:05","12:53","16:52","20:24","22:19");
        gun_9      =    new Array("6/26/2015","2:50","03:10","5:05","12:54","16:52","20:24","22:19");
        gun_10      =    new Array("6/27/2015","2:50","03:10","5:05","12:54","16:52","20:24","22:19");
        gun_11      =    new Array("6/28/2015","2:51","03:11","5:06","12:54","16:52","20:24","22:19");
        gun_12      =    new Array("6/29/2015","2:51","03:11","5:06","12:54","16:53","20:24","22:18");
        gun_13      =    new Array("6/30/2015","2:52","03:12","5:07","12:54","16:53","20:24","22:18");
        gun_14      =    new Array("7/1/2015"," 2:53","03:13","5:07","12:55","16:53","20:24","22:18");
        gun_15      =    new Array("7/2/2015"," 2:54","03:14","5:08","12:55","16:53","20:24","22:18");
        gun_16      =    new Array("7/3/2015"," 2:54","03:14","5:08","12:55","16:53","20:24","22:17");
        gun_17      =    new Array("7/4/2015"," 2:55","03:15","5:09","12:55","16:53","20:23","22:17");
        gun_18      =    new Array("7/5/2015"," 2:56","03:16","5:09","12:55","16:53","20:23","22:16");
        gun_19      =    new Array("7/6/2015"," 2:57","03:17","5:10","12:56","16:53","20:23","22:16");
        gun_20      =    new Array("7/7/2015"," 2:58","03:18","5:10","12:56","16:54","20:23","22:15");
        gun_21      =    new Array("7/8/2015"," 2:59","03:19","5:11","12:56","16:54","20:22","22:14");
        gun_22      =    new Array("7/9/2015"," 3:00","03:20","5:12","12:56","16:54","20:22","22:14");
        gun_23      =    new Array("7/10/2015"," 3:01","03:21","5:12","12:56","16:54","20:22","22:13");
        gun_24      =    new Array("7/11/2015"," 3:02","03:22","5:13","12:56","16:54","20:21","22:12");
        gun_25      =    new Array("7/12/2015"," 3:04","03:24","5:14","12:56","16:54","20:21","22:11");
        gun_26      =    new Array("7/13/2015"," 3:05","03:25","5:14","12:57","16:54","20:20","22:10");
        gun_27      =    new Array("7/14/2015"," 3:06","03:26","5:15","12:57","16:54","20:20","22:10");
        gun_28      =    new Array("7/15/2015"," 3:07","03:27","5:16","12:57","16:54","20:19","22:09");
        gun_29      =    new Array("7/16/2015"," 3:09","03:29","5:17","12:57","16:54","20:19","22:08");

	break;
	case "zonguldak":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:46","03:06","5:10","13:04","17:06","20:40","22:42");
        gun_2      =    new Array("6/19/2015","2:46","03:06","5:10","13:04","17:06","20:40","22:42");
        gun_3      =    new Array("6/20/2015","2:46","03:06","5:10","13:04","17:06","20:41","22:42");
        gun_4      =    new Array("6/21/2015","2:46","03:06","5:10","13:05","17:07","20:41","22:43");
        gun_5      =    new Array("6/22/2015","2:46","03:06","5:10","13:05","17:07","20:41","22:43");
        gun_6      =    new Array("6/23/2015","2:46","03:06","5:11","13:05","17:07","20:41","22:43");
        gun_7      =    new Array("6/24/2015","2:47","03:07","5:11","13:05","17:07","20:41","22:43");
        gun_8      =    new Array("6/25/2015","2:47","03:07","5:11","13:05","17:07","20:42","22:43");
        gun_9      =    new Array("6/26/2015","2:48","03:08","5:12","13:06","17:08","20:42","22:43");
        gun_10      =    new Array("6/27/2015","2:48","03:08","5:12","13:06","17:08","20:42","22:43");
        gun_11      =    new Array("6/28/2015","2:49","03:09","5:12","13:06","17:08","20:42","22:43");
        gun_12      =    new Array("6/29/2015","2:49","03:09","5:13","13:06","17:08","20:42","22:42");
        gun_13      =    new Array("6/30/2015","2:50","03:10","5:13","13:06","17:08","20:42","22:42");
        gun_14      =    new Array("7/1/2015"," 2:51","03:11","5:14","13:07","17:08","20:41","22:42");
        gun_15      =    new Array("7/2/2015"," 2:52","03:12","5:14","13:07","17:08","20:41","22:41");
        gun_16      =    new Array("7/3/2015"," 2:53","03:13","5:15","13:07","17:09","20:41","22:41");
        gun_17      =    new Array("7/4/2015"," 2:54","03:14","5:15","13:07","17:09","20:41","22:40");
        gun_18      =    new Array("7/5/2015"," 2:55","03:15","5:16","13:07","17:09","20:41","22:40");
        gun_19      =    new Array("7/6/2015"," 2:56","03:16","5:17","13:08","17:09","20:40","22:39");
        gun_20      =    new Array("7/7/2015"," 2:57","03:17","5:17","13:08","17:09","20:40","22:38");
        gun_21      =    new Array("7/8/2015"," 2:58","03:18","5:18","13:08","17:09","20:40","22:38");
        gun_22      =    new Array("7/9/2015"," 2:59","03:19","5:18","13:08","17:09","20:39","22:37");
        gun_23      =    new Array("7/10/2015"," 3:00","03:20","5:19","13:08","17:09","20:39","22:36");
        gun_24      =    new Array("7/11/2015"," 3:02","03:22","5:20","13:08","17:09","20:38","22:35");
        gun_25      =    new Array("7/12/2015"," 3:03","03:23","5:21","13:08","17:09","20:38","22:34");
        gun_26      =    new Array("7/13/2015"," 3:04","03:24","5:21","13:09","17:09","20:37","22:33");
        gun_27      =    new Array("7/14/2015"," 3:06","03:26","5:22","13:09","17:09","20:37","22:32");
        gun_28      =    new Array("7/15/2015"," 3:07","03:27","5:23","13:09","17:09","20:36","22:31");
        gun_29      =    new Array("7/16/2015"," 3:09","03:29","5:24","13:09","17:09","20:36","22:30");

	break;
	case "canakkale":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","3:20","03:40","5:36","13:25","17:25","20:56","22:52");
        gun_2      =    new Array("6/19/2015","3:20","03:40","5:36","13:26","17:25","20:57","22:53");
        gun_3      =    new Array("6/20/2015","3:20","03:40","5:37","13:26","17:25","20:57","22:53");
        gun_4      =    new Array("6/21/2015","3:20","03:40","5:37","13:26","17:25","20:57","22:53");
        gun_5      =    new Array("6/22/2015","3:20","03:40","5:37","13:26","17:25","20:57","22:53");
        gun_6      =    new Array("6/23/2015","3:21","03:41","5:37","13:26","17:26","20:58","22:54");
        gun_7      =    new Array("6/24/2015","3:21","03:41","5:38","13:27","17:26","20:58","22:54");
        gun_8      =    new Array("6/25/2015","3:21","03:41","5:38","13:27","17:26","20:58","22:54");
        gun_9      =    new Array("6/26/2015","3:22","03:42","5:38","13:27","17:26","20:58","22:54");
        gun_10      =    new Array("6/27/2015","3:22","03:42","5:39","13:27","17:26","20:58","22:54");
        gun_11      =    new Array("6/28/2015","3:23","03:43","5:39","13:28","17:27","20:58","22:53");
        gun_12      =    new Array("6/29/2015","3:23","03:43","5:39","13:28","17:27","20:58","22:53");
        gun_13      =    new Array("6/30/2015","3:24","03:44","5:40","13:28","17:27","20:58","22:53");
        gun_14      =    new Array("7/1/2015"," 3:25","03:45","5:40","13:28","17:27","20:58","22:53");
        gun_15      =    new Array("7/2/2015"," 3:26","03:46","5:41","13:28","17:27","20:58","22:52");
        gun_16      =    new Array("7/3/2015"," 3:26","03:46","5:41","13:29","17:27","20:58","22:52");
        gun_17      =    new Array("7/4/2015"," 3:27","03:47","5:42","13:29","17:27","20:57","22:51");
        gun_18      =    new Array("7/5/2015"," 3:28","03:48","5:42","13:29","17:28","20:57","22:51");
        gun_19      =    new Array("7/6/2015"," 3:29","03:49","5:43","13:29","17:28","20:57","22:50");
        gun_20      =    new Array("7/7/2015"," 3:30","03:50","5:44","13:29","17:28","20:57","22:50");
        gun_21      =    new Array("7/8/2015"," 3:31","03:51","5:44","13:29","17:28","20:56","22:49");
        gun_22      =    new Array("7/9/2015"," 3:32","03:52","5:45","13:30","17:28","20:56","22:48");
        gun_23      =    new Array("7/10/2015"," 3:33","03:53","5:46","13:30","17:28","20:55","22:48");
        gun_24      =    new Array("7/11/2015"," 3:35","03:55","5:46","13:30","17:28","20:55","22:47");
        gun_25      =    new Array("7/12/2015"," 3:36","03:56","5:47","13:30","17:28","20:55","22:46");
        gun_26      =    new Array("7/13/2015"," 3:37","03:57","5:48","13:30","17:28","20:54","22:45");
        gun_27      =    new Array("7/14/2015"," 3:38","03:58","5:48","13:30","17:28","20:54","22:44");
        gun_28      =    new Array("7/15/2015"," 3:40","04:00","5:49","13:30","17:28","20:53","22:43");
        gun_29      =    new Array("7/16/2015"," 3:41","04:01","5:50","13:30","17:28","20:52","22:42");

	break;
	case "cankiri":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:47","03:07","5:06","12:57","16:57","20:29","22:27");
        gun_2      =    new Array("6/19/2015","2:47","03:07","5:06","12:57","16:57","20:29","22:27");
        gun_3      =    new Array("6/20/2015","2:47","03:07","5:06","12:57","16:57","20:30","22:27");
        gun_4      =    new Array("6/21/2015","2:48","03:08","5:07","12:57","16:57","20:30","22:28");
        gun_5      =    new Array("6/22/2015","2:48","03:08","5:07","12:57","16:58","20:30","22:28");
        gun_6      =    new Array("6/23/2015","2:48","03:08","5:07","12:58","16:58","20:30","22:28");
        gun_7      =    new Array("6/24/2015","2:48","03:08","5:07","12:58","16:58","20:30","22:28");
        gun_8      =    new Array("6/25/2015","2:49","03:09","5:08","12:58","16:58","20:31","22:28");
        gun_9      =    new Array("6/26/2015","2:49","03:09","5:08","12:58","16:58","20:31","22:28");
        gun_10      =    new Array("6/27/2015","2:50","03:10","5:08","12:59","16:59","20:31","22:28");
        gun_11      =    new Array("6/28/2015","2:50","03:10","5:09","12:59","16:59","20:31","22:28");
        gun_12      =    new Array("6/29/2015","2:51","03:11","5:09","12:59","16:59","20:31","22:28");
        gun_13      =    new Array("6/30/2015","2:52","03:12","5:10","12:59","16:59","20:31","22:27");
        gun_14      =    new Array("7/1/2015"," 2:52","03:12","5:10","12:59","16:59","20:30","22:27");
        gun_15      =    new Array("7/2/2015"," 2:53","03:13","5:11","13:00","16:59","20:30","22:27");
        gun_16      =    new Array("7/3/2015"," 2:54","03:14","5:11","13:00","16:59","20:30","22:26");
        gun_17      =    new Array("7/4/2015"," 2:55","03:15","5:12","13:00","17:00","20:30","22:26");
        gun_18      =    new Array("7/5/2015"," 2:56","03:16","5:12","13:00","17:00","20:30","22:25");
        gun_19      =    new Array("7/6/2015"," 2:57","03:17","5:13","13:00","17:00","20:29","22:25");
        gun_20      =    new Array("7/7/2015"," 2:58","03:18","5:13","13:00","17:00","20:29","22:24");
        gun_21      =    new Array("7/8/2015"," 2:59","03:19","5:14","13:01","17:00","20:29","22:23");
        gun_22      =    new Array("7/9/2015"," 3:00","03:20","5:15","13:01","17:00","20:28","22:22");
        gun_23      =    new Array("7/10/2015"," 3:01","03:21","5:15","13:01","17:00","20:28","22:22");
        gun_24      =    new Array("7/11/2015"," 3:02","03:22","5:16","13:01","17:00","20:28","22:21");
        gun_25      =    new Array("7/12/2015"," 3:04","03:24","5:17","13:01","17:00","20:27","22:20");
        gun_26      =    new Array("7/13/2015"," 3:05","03:25","5:17","13:01","17:00","20:27","22:19");
        gun_27      =    new Array("7/14/2015"," 3:06","03:26","5:18","13:01","17:00","20:26","22:18");
        gun_28      =    new Array("7/15/2015"," 3:08","03:28","5:19","13:01","17:00","20:26","22:17");
        gun_29      =    new Array("7/16/2015"," 3:09","03:29","5:20","13:02","17:00","20:25","22:16");

	break;
	case "corum":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:42","03:02","5:01","12:51","16:51","20:24","22:22");
        gun_2      =    new Array("6/19/2015","2:42","03:02","5:01","12:51","16:52","20:24","22:22");
        gun_3      =    new Array("6/20/2015","2:42","03:02","5:01","12:52","16:52","20:25","22:22");
        gun_4      =    new Array("6/21/2015","2:42","03:02","5:01","12:52","16:52","20:25","22:23");
        gun_5      =    new Array("6/22/2015","2:42","03:02","5:01","12:52","16:52","20:25","22:23");
        gun_6      =    new Array("6/23/2015","2:42","03:02","5:01","12:52","16:52","20:25","22:23");
        gun_7      =    new Array("6/24/2015","2:43","03:03","5:02","12:53","16:53","20:25","22:23");
        gun_8      =    new Array("6/25/2015","2:43","03:03","5:02","12:53","16:53","20:25","22:23");
        gun_9      =    new Array("6/26/2015","2:44","03:04","5:02","12:53","16:53","20:26","22:23");
        gun_10      =    new Array("6/27/2015","2:44","03:04","5:03","12:53","16:53","20:26","22:23");
        gun_11      =    new Array("6/28/2015","2:45","03:05","5:03","12:53","16:53","20:26","22:23");
        gun_12      =    new Array("6/29/2015","2:45","03:05","5:04","12:54","16:53","20:26","22:22");
        gun_13      =    new Array("6/30/2015","2:46","03:06","5:04","12:54","16:54","20:25","22:22");
        gun_14      =    new Array("7/1/2015"," 2:47","03:07","5:04","12:54","16:54","20:25","22:22");
        gun_15      =    new Array("7/2/2015"," 2:48","03:08","5:05","12:54","16:54","20:25","22:22");
        gun_16      =    new Array("7/3/2015"," 2:48","03:08","5:05","12:54","16:54","20:25","22:21");
        gun_17      =    new Array("7/4/2015"," 2:49","03:09","5:06","12:55","16:54","20:25","22:21");
        gun_18      =    new Array("7/5/2015"," 2:50","03:10","5:07","12:55","16:54","20:25","22:20");
        gun_19      =    new Array("7/6/2015"," 2:51","03:11","5:07","12:55","16:54","20:24","22:19");
        gun_20      =    new Array("7/7/2015"," 2:52","03:12","5:08","12:55","16:54","20:24","22:19");
        gun_21      =    new Array("7/8/2015"," 2:53","03:13","5:08","12:55","16:54","20:24","22:18");
        gun_22      =    new Array("7/9/2015"," 2:54","03:14","5:09","12:55","16:54","20:23","22:17");
        gun_23      =    new Array("7/10/2015"," 2:56","03:16","5:10","12:56","16:55","20:23","22:17");
        gun_24      =    new Array("7/11/2015"," 2:57","03:17","5:10","12:56","16:55","20:23","22:16");
        gun_25      =    new Array("7/12/2015"," 2:58","03:18","5:11","12:56","16:55","20:22","22:15");
        gun_26      =    new Array("7/13/2015"," 2:59","03:19","5:12","12:56","16:55","20:22","22:14");
        gun_27      =    new Array("7/14/2015"," 3:01","03:21","5:13","12:56","16:55","20:21","22:13");
        gun_28      =    new Array("7/15/2015"," 3:02","03:22","5:13","12:56","16:54","20:20","22:12");
        gun_29      =    new Array("7/16/2015"," 3:03","03:23","5:14","12:56","16:54","20:20","22:11");

	break;
	case "istanbul":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","3:01","03:21","5:23","13:15","17:16","20:50","22:49");
        gun_2      =    new Array("6/19/2015","3:01","03:21","5:23","13:15","17:17","20:50","22:50");
        gun_3      =    new Array("6/20/2015","3:02","03:22","5:23","13:16","17:17","20:50","22:50");
        gun_4      =    new Array("6/21/2015","3:02","03:22","5:23","13:16","17:17","20:50","22:50");
        gun_5      =    new Array("6/22/2015","3:02","03:22","5:24","13:16","17:17","20:51","22:50");
        gun_6      =    new Array("6/23/2015","3:02","03:22","5:24","13:16","17:17","20:51","22:51");
        gun_7      =    new Array("6/24/2015","3:02","03:22","5:24","13:17","17:18","20:51","22:51");
        gun_8      =    new Array("6/25/2015","3:03","03:23","5:24","13:17","17:18","20:51","22:51");
        gun_9      =    new Array("6/26/2015","3:03","03:23","5:25","13:17","17:18","20:51","22:51");
        gun_10      =    new Array("6/27/2015","3:04","03:24","5:25","13:17","17:18","20:51","22:50");
        gun_11      =    new Array("6/28/2015","3:04","03:24","5:25","13:17","17:18","20:51","22:50");
        gun_12      =    new Array("6/29/2015","3:05","03:25","5:26","13:18","17:18","20:51","22:50");
        gun_13      =    new Array("6/30/2015","3:06","03:26","5:26","13:18","17:19","20:51","22:50");
        gun_14      =    new Array("7/1/2015"," 3:07","03:27","5:27","13:18","17:19","20:51","22:49");
        gun_15      =    new Array("7/2/2015"," 3:07","03:27","5:27","13:18","17:19","20:51","22:49");
        gun_16      =    new Array("7/3/2015"," 3:08","03:28","5:28","13:18","17:19","20:51","22:49");
        gun_17      =    new Array("7/4/2015"," 3:09","03:29","5:28","13:19","17:19","20:50","22:48");
        gun_18      =    new Array("7/5/2015"," 3:10","03:30","5:29","13:19","17:19","20:50","22:48");
        gun_19      =    new Array("7/6/2015"," 3:11","03:31","5:30","13:19","17:19","20:50","22:47");
        gun_20      =    new Array("7/7/2015"," 3:12","03:32","5:30","13:19","17:19","20:50","22:46");
        gun_21      =    new Array("7/8/2015"," 3:13","03:33","5:31","13:19","17:19","20:49","22:46");
        gun_22      =    new Array("7/9/2015"," 3:15","03:35","5:32","13:19","17:19","20:49","22:45");
        gun_23      =    new Array("7/10/2015"," 3:16","03:36","5:32","13:20","17:19","20:49","22:44");
        gun_24      =    new Array("7/11/2015"," 3:17","03:37","5:33","13:20","17:19","20:48","22:43");
        gun_25      =    new Array("7/12/2015"," 3:18","03:38","5:34","13:20","17:19","20:48","22:42");
        gun_26      =    new Array("7/13/2015"," 3:20","03:40","5:34","13:20","17:19","20:47","22:41");
        gun_27      =    new Array("7/14/2015"," 3:21","03:41","5:35","13:20","17:19","20:47","22:40");
 ,       gun_28      =    new Array("7/15/2015"," 3:22","03:42","5:,36","13:20","17:19","20:46","22:39");
        gun_29      =    new Array("7/16/2015"," 3:24","03:44","5:37","13:20","17:19","20:45","22:38");

	break;
	case "izmir":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","3:29","03:49","5:38","13:22","17:18","20:49","22:39");
        gun_2      =    new Array("6/19/2015","3:29","03:49","5:38","13:23","17:18","20:49","22:39");
        gun_3      =    new Array("6/20/2015","3:29","03:49","5:38","13:23","17:18","20:49","22:40");
        gun_4      =    new Array("6/21/2015","3:29","03:49","5:39","13:23","17:18","20:50","22:40");
        gun_5      =    new Array("6/22/2015","3:29","03:49","5:39","13:23","17:19","20:50","22:40");
        gun_6      =    new Array("6/23/2015","3:30","03:50","5:39","13:23","17:19","20:50","22:40");
        gun_7      =    new Array("6/24/2015","3:30","03:50","5:39","13:24","17:19","20:50","22:40");
        gun_8      =    new Array("6/25/2015","3:30","03:50","5:40","13:24","17:19","20:50","22:40");
        gun_9      =    new Array("6/26/2015","3:31","03:51","5:40","13:24","17:19","20:50","22:40");
        gun_10      =    new Array("6/27/2015","3:31","03:51","5:40","13:24","17:20","20:50","22:40");
        gun_11      =    new Array("6/28/2015","3:32","03:52","5:41","13:25","17:20","20:50","22:40");
        gun_12      =    new Array("6/29/2015","3:32","03:52","5:41","13:25","17:20","20:50","22:40");
        gun_13      =    new Array("6/30/2015","3:33","03:53","5:41","13:25","17:20","20:50","22:40");
        gun_14      =    new Array("7/1/2015"," 3:34","03:54","5:42","13:25","17:20","20:50","22:39");
        gun_15      =    new Array("7/2/2015"," 3:34","03:54","5:42","13:25","17:20","20:50","22:39");
        gun_16      =    new Array("7/3/2015"," 3:35","03:55","5:43","13:26","17:21","20:50","22:39");
        gun_17      =    new Array("7/4/2015"," 3:36","03:56","5:43","13:26","17:21","20:50","22:38");
        gun_18      =    new Array("7/5/2015"," 3:37","03:57","5:44","13:26","17:21","20:50","22:38");
        gun_19      =    new Array("7/6/2015"," 3:38","03:58","5:44","13:26","17:21","20:49","22:37");
        gun_20      =    new Array("7/7/2015"," 3:38","03:58","5:45","13:26","17:21","20:49","22:37");
        gun_21      =    new Array("7/8/2015"," 3:39","03:59","5:46","13:26","17:21","20:49","22:36");
        gun_22      =    new Array("7/9/2015"," 3:40","04:00","5:46","13:27","17:21","20:48","22:36");
        gun_23      =    new Array("7/10/2015"," 3:41","04:01","5:47","13:27","17:21","20:48","22:35");
        gun_24      =    new Array("7/11/2015"," 3:42","04:02","5:48","13:27","17:21","20:48","22:34");
        gun_25      =    new Array("7/12/2015"," 3:44","04:04","5:48","13:27","17:21","20:47","22:34");
        gun_26      =    new Array("7/13/2015"," 3:45","04:05","5:49","13:27","17:21","20:47","22:33");
        gun_27      =    new Array("7/14/2015"," 3:46","04:06","5:50","13:27","17:21","20:46","22:32");
        gun_28      =    new Array("7/15/2015"," 3:47","04:07","5:50","13:27","17:21","20:46","22:31");
        gun_29      =    new Array("7/16/2015"," 3:48","04:08","5:51","13:27","17:21","20:45","22:30");

	break;
	case "sanliurfa":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015#2:53","03:13","4:56","12:36","16:28","19:57","21:43");
        gun_2      =    new Array("6/19/2015#2:53","03:13","4:57","12:36","16:29","19:58","21:44");
        gun_3      =    new Array("6/20/2015#2:53","03:13","4:57","12:36","16:29","19:58","21:44");
        gun_4      =    new Array("6/21/2015#2:53","03:13","4:57","12:37","16:29","19:58","21:44");
        gun_5      =    new Array("6/22/2015#2:53","03:13","4:57","12:37","16:29","19:58","21:44");
        gun_6      =    new Array("6/23/2015#2:53","03:13","4:57","12:37","16:30","19:59","21:45");
        gun_7      =    new Array("6/24/2015#2:54","03:14","4:58","12:37","16:30","19:59","21:45");
        gun_8      =    new Array("6/25/2015#2:54","03:14","4:58","12:37","16:30","19:59","21:45");
        gun_9      =    new Array("6/26/2015#2:54","03:14","4:58","12:38","16:30","19:59","21:45");
        gun_10      =    new Array("6/27/2015#2:55","03:15","4:59","12:38","16:30","19:59","21:45");
        gun_11      =    new Array("6/28/2015#2:55","03:15","4:59","12:38","16:31","19:59","21:45");
        gun_12      =    new Array("6/29/2015#2:56","03:16","4:59","12:38","16:31","19:59","21:45");
        gun_13      =    new Array("6/30/2015#2:56","03:16","5:00","12:38","16:31","19:59","21:44");
        gun_14      =    new Array("7/1/2015# 2:57","03:17","5:00","12:39","16:31","19:59","21:44");
        gun_15      =    new Array("7/2/2015# 2:58","03:18","5:01","12:39","16:31","19:59","21:44");
        gun_16      =    new Array("7/3/2015# 2:58","03:18","5:01","12:39","16:31","19:59","21:44");
        gun_17      =    new Array("7/4/2015# 2:59","03:19","5:02","12:39","16:32","19:59","21:43");
        gun_18      =    new Array("7/5/2015# 3:00","03:20","5:02","12:39","16:32","19:58","21:43");
        gun_19      =    new Array("7/6/2015# 3:01","03:21","5:03","12:40","16:32","19:58","21:42");
        gun_20      =    new Array("7/7/2015# 3:02","03:22","5:03","12:40","16:32","19:58","21:42");
        gun_21      =    new Array("7/8/2015# 3:02","03:22","5:04","12:40","16:32","19:58","21:41");
        gun_22      =    new Array("7/9/2015# 3:03","03:23","5:04","12:40","16:32","19:57","21:41");
        gun_23      =    new Array("7/10/2015# 3:04","03:24","5:05","12:40","16:32","19:57","21:40");
        gun_24      =    new Array("7/11/2015# 3:05","03:25","5:06","12:40","16:32","19:57","21:40");
        gun_25      =    new Array("7/12/2015# 3:06","03:26","5:06","12:40","16:32","19:56","21:39");
        gun_26      =    new Array("7/13/2015# 3:07","03:27","5:07","12:41","16:32","19:56","21:38");
        gun_27      =    new Array("7/14/2015# 3:08","03:28","5:08","12:41","16:32","19:55","21:37");
        gun_28      =    new Array("7/15/2015# 3:09","03:29","5:08","12:41","16:32","19:55","21:37");
        gun_29      =    new Array("7/16/2015# 3:11","03:31","5:09","12:41","16:32","19:55","21:36");


	break;
	case "sirnak":
		//Tarih,Imsak,Gunes,Ogle,Ikindi,Aksam,Yatsi  ADANA+
		
		gun_1      =    new Array("6/18/2015","2:34","02:54","4:40","12:21","16:15","19:45","21:32");
        gun_2      =    new Array("6/19/2015","2:34","02:54","4:40","12:21","16:15","19:45","21:32");
        gun_3      =    new Array("6/20/2015","2:34","02:54","4:40","12:22","16:15","19:45","21:33");
        gun_4      =    new Array("6/21/2015","2:35","02:55","4:40","12:22","16:15","19:45","21:33");
        gun_5      =    new Array("6/22/2015","2:35","02:55","4:41","12:22","16:16","19:46","21:33");
        gun_6      =    new Array("6/23/2015","2:35","02:55","4:41","12:22","16:16","19:46","21:33");
        gun_7      =    new Array("6/24/2015","2:35","02:55","4:41","12:23","16:16","19:46","21:33");
        gun_8      =    new Array("6/25/2015","2:36","02:56","4:41","12:23","16:16","19:46","21:33");
        gun_9      =    new Array("6/26/2015","2:36","02:56","4:42","12:23","16:16","19:46","21:33");
        gun_10      =    new Array("6/27/2015","2:37","02:57","4:42","12:23","16:17","19:46","21:33");
        gun_11      =    new Array("6/28/2015","2:37","02:57","4:42","12:23","16:17","19:46","21:33");
        gun_12      =    new Array("6/29/2015","2:38","02:58","4:43","12:24","16:17","19:46","21:33");
        gun_13      =    new Array("6/30/2015","2:38","02:58","4:43","12:24","16:17","19:46","21:33");
        gun_14      =    new Array("7/1/2015"," 2:39","02:59","4:44","12:24","16:17","19:46","21:33");
        gun_15      =    new Array("7/2/2015"," 2:39","02:59","4:44","12:24","16:17","19:46","21:32");
        gun_16      =    new Array("7/3/2015"," 2:40","03:00","4:45","12:24","16:18","19:46","21:32");
        gun_17      =    new Array("7/4/2015"," 2:41","03:01","4:45","12:25","16:18","19:46","21:32");
        gun_18      =    new Array("7/5/2015"," 2:42","03:02","4:46","12:25","16:18","19:46","21:31");
        gun_19      =    new Array("7/6/2015"," 2:43","03:03","4:46","12:25","16:18","19:45","21:31");
        gun_20      =    new Array("7/7/2015"," 2:43","03:03","4:47","12:25","16:18","19:45","21:30");
        gun_21      =    new Array("7/8/2015"," 2:44","03:04","4:47","12:25","16:18","19:45","21:30");
        gun_22      =    new Array("7/9/2015"," 2:45","03:05","4:48","12:25","16:18","19:45","21:29");
        gun_23      =    new Array("7/10/2015"," 2:46","03:06","4:49","12:26","16:18","19:44","21:29");
        gun_24      =    new Array("7/11/2015"," 2:47","03:07","4:49","12:26","16:18","19:44","21:28");
        gun_25      =    new Array("7/12/2015"," 2:48","03:08","4:50","12:26","16:19","19:43","21:27");
        gun_26      =    new Array("7/13/2015"," 2:49","03:09","4:50","12:26","16:19","19:43","21:27");
        gun_27      =    new Array("7/14/2015"," 2:50","03:10","4:51","12:26","16:19","19:43","21:26");
        gun_28      =    new Array("7/15/2015"," 2:51","03:11","4:52","12:26","16:19","19:42","21:25");
        gun_29      =    new Array("7/16/2015"," 2:53","03:13","4:53","12:26","16:19","19:42","21:24");

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

	
;
gunun_sozu[16] = 
br
