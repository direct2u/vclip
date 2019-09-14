var items = document.getElementsByClassName("items")[0].getElementsByTagName("li");
var itemsL = items.length;
	urls = [];

for (var i = 0; i < itemsL; i++) {
	urls.push(items[i].getElementsByTagName("div")[0].getElementsByTagName("a")[0].getAttribute("href"));
}

function openIframe(url){
	var iframe = document.createElement("iframe");
	iframe.src = url;
	document.body.appendChild(iframe);
	var iWindow = iframe.contentWindow;
	iWindow.addEventListener("load", function() {
        var doc = iframe.contentDocument || iframe.contentWindow.document;
		setTimeout(function(){
			doc.getElementsByClassName("play-btn")[0].parentNode.click();
		}, 1000);
    });
}

function openVids(simlt){
	
	for (var i = 0; i<simlt; i++){
		if (urls.length > 0){
			openIframe(urls.pop());
		} else {
			alert("Всички видеота бяха отворени.");
			clearInterval(dlInterval);
		}
	}		
}

var urlsL = urls.length;
if (urlsL > 0){
	if(confirm("Намерени общо "+urlsL+" видеота на тази страница. Искате ли да ги отворите?")){
		var epTime = Number(prompt("Колко време е продължителността на едно видео в минути?", "25"));
		if (epTime > 0){
			var simlt = Number(prompt("По колко епизода искате да отворите наведнъж?", "1"));
			if (simlt > 0){
				var calc = Math.ceil(urlsL/simlt)*epTime;
				var calcH = Math.floor(calc/60);
				var calcM = calc - (calcH*60);
				
				dlInterval = setInterval(function(){
					openVids(simlt);
				}, epTime*60*1000);
				
				openVids(simlt);
				
				alert("Отварянето започна. След около "+calcH+" часа и "+calcM+" минути всички видеота ще бъдат отворени.");
			} else {
				alert("Грешка, трябва да въведете цяло положително число.");
			}
		} else {
			alert("Грешка, продължителността трябва да е цяло положително число.");
		}
		
	} else {
		alert("Ако желаете, можете да активирате скрипта отново по всяко време.");
	}
} else {
	alert("Няма намерени видеота на тази страница.");
}


//console.log(urls);