//funktio lomaketietojen muuttamiseksi JSON-stringiksi
function serialize_form(form){
	return JSON.stringify(
	    Array.from(new FormData(form).entries())
	        .reduce((m, [ key, value ]) => Object.assign(m, { [key]: value }), {})
	        );	
} 

//funktio arvon lukemiseen urlista avaimen perusteella
function requestURLParam(sParam){
    let sPageURL = window.location.search.substring(1);
    let sURLVariables = sPageURL.split("&");
    for (let i = 0; i < sURLVariables.length; i++){
        let sParameterName = sURLVariables[i].split("=");
        if(sParameterName[0] == sParam){
            return sParameterName[1];
        }
    }
}

//Tutkitaan lisättävät tiedot ennen niiden lähettämistä backendiin
function tutkiJaLisaa() {
	if(tutkiTiedot()) {
		lisaaTiedot();
	}
}

function tutkiJaPaivita() {
	if(tutkiTiedot()) {
		paivitaTiedot();
	}
}

function tutkiTiedot() {
	let ilmo="";
	let d = new Date();
	if (document.getElementById("etunimi").value.length<3) {
		ilmo="Etunimi ei kelpaa";
		document.getElementById("etunimi").focus();
	} else if (!document.getElementById("etunimi").value.match(/[a-zA-Z]/i)) {
		ilmo="Etunimi ei kelpaa";
		document.getElementById("etunimi").focus();
	} else if (document.getElementById("sukunimi").value.length<3) {
		ilmo="Sukunimi ei kelpaa";
		document.getElementById("sukunimi").focus();
	} else if (!document.getElementById("etunimi").value.match(/[a-zA-Z]/i)) {
		ilmo="Sukunimi ei kelpaa";
		document.getElementById("sukunimi").focus();
	} else if (document.getElementById("puhelin").value.match(/[a-zA-Z]/i)) {
		ilmo="Puhelinnumero ei kelpaa";
		document.getElementById("puhelin").focus();
	} else if (document.getElementById("sposti").value.length<3) {
		ilmo="Spostiosoite ei kelpaa";
		document.getElementById("sposti").focus();
	} else if (document.getElementById("etunimi").value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
		ilmo="Spostiosoite ei kelpaa";
		document.getElementById("sposti").focus();
	}
	if(ilmo!="") {
		document.getElementById("ilmo").innerHTML=ilmo;
		setTimeout(function(){document.getElementById("ilmo").innerHTML=""; }, 3000);
		return false;
	} else {
		document.getElementById("etunimi").value=siivoa(document.getElementById("etunimi").value);
		document.getElementById("sukunimi").value=siivoa(document.getElementById("sukunimi").value);
		document.getElementById("puhelin").value=siivoa(document.getElementById("puhelin").value);
		document.getElementById("sposti").value=siivoa(document.getElementById("sposti").value);
		return true;
	}
}

//Funktio XSS-hyökkäysten estämiseksi (Cross-site scripting)
function siivoa(teksti){
	teksti=teksti.replace(/</g, "");//&lt;
	teksti=teksti.replace(/>/g, "");//&gt;
	teksti=teksti.replace(/;/g, "");//&#59;	
	teksti=teksti.replace(/'/g, "''");//&apos;	
	return teksti;
}

function varmistaPoisto(asiakas_id, nimi){
	if(confirm("Poista asiakas " + decodeURI(nimi) +"?")){ //decodeURI() muutetaan enkoodatut merkit takaisin normaaliksi kirjoitukseksi
		poistaAsiakas(asiakas_id, nimi);
	}
}

function asetaFocus(target){
	document.getElementById(target).focus();	
}

//Funktio Enter-nappiin. Kutsu bodyn onkeydown()-metodista.
function tutkiKey(event, target){	
	if(event.keyCode==13){//13=Enter
		if(target=="listaa"){
			haeAsiakkaat();
		}else if(target=="lisaa"){
			tutkiJaLisaa();
		}else if(target=="paivita"){
			tutkiJaPaivita();
		}
	}else if(event.keyCode==113){//F2
		document.location="listaaasiakkaat.jsp";
	}		
}