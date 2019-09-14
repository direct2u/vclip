var cmpFaktorio = document.getElementById("cmp-faktor-io");
if (cmpFaktorio){ cmpFaktorio.style.display = "none"; }

var domainFull = window.location.hostname;

function toPlay(m3u8URL){
	var vid = document.getElementsByTagName("video")[0];
	vid.src = m3u8URL;
	try { setClass("lightboxV","open"); } catch(err) { }
	var userAgent = navigator.userAgent || navigator.vendor || window.opera;
	if (/android/i.test(userAgent)) {
		if (vid.requestFullscreen) {
			vid.requestFullscreen();
		} else if (elem.mozRequestFullScreen) { /* Firefox */
			vid.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
			vid.webkitRequestFullscreen();
		} else if (elem.msRequestFullscreen) { /* IE/Edge */
			vid.msRequestFullscreen();
		}
	}
}
function novaPlay(vidID){
	var MtgLink = "https://play.nova.bg/service/publishpoint?type=video&id="+vidID+"&format=xml&callback=getHTML5PublishPointCallback";
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		loadYES = xhttp.status;
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			var MTGresponseText = xhttp.responseText;
			if (MTGresponseText.indexOf('<![CDATA[http') > -1) {
				var m3u8URL = MTGresponseText.split('<![CDATA[')[1].split("]]")[0];
				toPlay(m3u8URL);
			} else { alert("Грешка"); }
		} else if (xhttp.readyState == 4 && xhttp.status == 403) {
			console.log("Грешка 403, повторен опит.");
		}
	};
	xhttp.open("GET", MtgLink, false);
	xhttp.send();
}

var lightbox = document.createElement('style');
lightbox.type = 'text/css';
lightbox.innerHTML = '\
#lightboxV { z-index: 999; position: fixed; width: 100%; height: 100%; top: 0px; left: 0px; background: rgba(0, 0, 0, 0.3); display: none; }\
#lightboxV.open { display: block; }';

document.getElementsByTagName('head')[0].appendChild(lightbox);
var elem = document.createElement('div');
elem.setAttribute("id", "lightboxV");
elem.innerHTML = '<div id="lightboxV_content" style="position: absolute; background: #black; border-radius: 0px;\
left: 50%; top: 50%; margin-left: -240px; margin-top: -135px; text-align: center;"><video style="width:480px; height: 270px" controls></video></div>';
document.body.appendChild(elem);

document.getElementById("lightboxV").addEventListener("click", function(e) {
	if (e.target.id == "lightboxV") {
		document.getElementById("lightboxV").className = "";
	}
});


document.addEventListener('click', function(e) {
	e = e || window.event;
	var target = e.target;
	var vidID = 0;
	var vidHref = false;
	for (var i=0; i<5; i++){
		var vidID = target.getAttribute("data-id");
		if (Number(vidID) > 99) {
			novaPlay(Number(vidID));
			event.preventDefault(); return false; break;
		} else {
			let tmp = target.getAttribute("href");
			if (tmp && tmp.indexOf("/video/") == 0){
				var vidHref = tmp;
			}
			target = target.parentElement;
		}
	}
	
	if (vidHref){
		var vidHref = "https://"+domainFull+vidHref;
		console.log(vidHref);
		
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				var MTGresponseText = xhttp.responseText;
				if (MTGresponseText.indexOf('var video =') > -1) {
					var vidID = Number(MTGresponseText.split('var video =')[1].split('id:"')[1].split('"')[0]);
					if (vidID > 99) { novaPlay(vidID); }
				} else { alert("Грешка"); }
			} else if (xhttp.readyState == 4 && xhttp.status == 403) {
				console.log("Грешка 403.");
			}
		};
		xhttp.open("GET", vidHref, false);
		xhttp.send();
		
		event.preventDefault(); return false;
	}
}, false);