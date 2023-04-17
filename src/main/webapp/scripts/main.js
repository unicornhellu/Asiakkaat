//funktio lomaketietojen muuttamiseksi JSON-stringiksi
function serialize_form(form){
	return JSON.stringify(
	    Array.from(new FormData(form).entries())
	        .reduce((m, [ key, value ]) => Object.assign(m, { [key]: value }), {})
	        );	
} 

//funktio tietojen hakemista varten. Kutsutaan backin GET metodia
function haeAsiakkaat() {
	let url = "asiakkaat?hakusana=" + document.getElementById("hakusana").value; 
	let requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/x-www-form-urlencoded" }       
    };    
    fetch(url, requestOptions)
    .then(response => response.json())//Muutetaan vastausteksti JSON-objektiksi 
   	.then(response => printItems(response)) 
   	.catch(errorText => console.error("Fetch failed: " + errorText));
}

//Kirjoitetaan tiedot taulukkoon JSON-objektilistasta
function printItems(respObjList){
	//console.log(respObjList);
	let htmlStr="";
	for(let item of respObjList){//yksi kokoelmalooppeista		
    	htmlStr+="<tr id='rivi_"+item.asiakas_id+"'>";
    	htmlStr+="<td>"+item.etunimi+"</td>";
    	htmlStr+="<td>"+item.sukunimi+"</td>";
    	htmlStr+="<td>"+item.puhelin+"</td>";
    	htmlStr+="<td>"+item.sposti+"</td>";
		//htmlStr+="<td>"+item.asiakas_id+"</td>";  
		htmlStr+="<td><span class='poista' onclick=varmistaPoisto("+item.asiakas_id+",'"+item.etunimi+"')>Poista</span></td>"; //encodeURI() muutetaan erikoismerkit, välilyönnit jne. UTF-8 merkeiksi. 	
    	htmlStr+="</tr>";    	
	}	
	document.getElementById("tbody").innerHTML = htmlStr;	
}

//Tutkitaan lisättävät tiedot ennen niiden lähettämistä backendiin
function tutkiJaLisaa() {
	if(tutkiTiedot()) {
		lisaaTiedot();
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
	teksti=teksti.replace(/'/g, "''");//&apos;	
	return teksti;
}

//funktio tietojen lisäämistä varten. Kutsutaan backin POST-metodia ja välitetään kutsun mukana auton tiedot json-stringinä.
function lisaaTiedot(){
	let formData = serialize_form(document.lomake); //Haetaan tiedot lomakkeelta ja muutetaan JSON-stringiksi
	//console.log(formData);
	let url = "asiakkaat";    
    let requestOptions = {
        method: "POST", //Lisätään asiakas
        headers: { "Content-Type": "application/json" },  
    	body: formData
    };    
    fetch(url, requestOptions)
    .then(response => response.json())//Muutetaan vastausteksti JSON-objektiksi
   	.then(responseObj => {	
   		//console.log(responseObj);
   		if(responseObj.response==0){
   			document.getElementById("ilmo").innerHTML = "Asiakkaan lisäys epäonnistui.";	
        }else if(responseObj.response==1){ 
        	document.getElementById("ilmo").innerHTML = "Asiakkaan lisäys onnistui.";
			document.lomake.reset(); //Tyhjennetään asiakkaan lisäämisen lomake		        	
		}
		setTimeout(function(){ document.getElementById("ilmo").innerHTML=""; }, 3000);
   	})
   	.catch(errorText => console.error("Fetch failed: " + errorText));
}

function varmistaPoisto(asiakas_id, etunimi){
	if(confirm("Poista asiakas " + etunimi + "?")){ 
		poistaAsiakas(asiakas_id, etunimi);
	}
}

//Poistetaan auto kutsumalla backin DELETE-metodia ja välittämällä sille poistettavan auton id
function poistaAsiakas(asiakas_id, etunimi){
	let url = "asiakkaat?asiakas_id=" + asiakas_id;    
    let requestOptions = {
        method: "DELETE"             
    };    
    fetch(url, requestOptions)
    .then(response => response.json())//Muutetaan vastausteksti JSON-objektiksi
   	.then(responseObj => {	
   		//console.log(responseObj);
   		if(responseObj.response==0){
			alert("Asiakkaan poisto epäonnistui.");	        	
        }else if(responseObj.response==1){ 
			document.getElementById("rivi_"+asiakas_id).style.backgroundColor="red";
			alert("Asiakkaan " + etunimi + " poisto onnistui."); //decodeURI() muutetaan enkoodatut merkit takaisin normaaliksi kirjoitukseksi
			haeAsiakkaat();        	
		}
   	})
   	.catch(errorText => console.error("Fetch failed: " + errorText));
}	