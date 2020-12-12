/* РАБОТА С КУКАМИ */

/* ф-ции позаимствованы из кода tinyMCE
	 tinymce/jscripts/tiny_mce/themes/advanced/editor_template.js */

/* Получить значение cookie */

function getCookie (name) {
	var dc = document.cookie;
	var prefix = name + "=";
	var begin = dc.indexOf("; " + prefix);
	if (begin == -1) {
		begin = dc.indexOf(prefix);
		if (begin != 0)
			return null;
	} else
		begin += 2;
	var end = document.cookie.indexOf(";", begin);
	if (end == -1)
		end = dc.length;
	return unescape(dc.substring(begin + prefix.length, end));
}

/* Установить cookie */

function setCookie (name, value, expires, path, domain, secure) {
	var curCookie = name + "=" + escape(value) +
		((expires) ? "; expires=" + expires.toGMTString() : "") +
		((path) ? "; path=" + escape(path) : "") +
		((domain) ? "; domain=" + domain : "") +
		((secure) ? "; secure" : "");
	document.cookie = curCookie;
}

/* Установить "вечную" cookie */

function setCookieForever (name,value) {
	var cookieExpires=new Date();
	cookieExpires.setTime(cookieExpires.getTime() + 3600000 * 24 * 30 * 12 * 10);
	setCookie(name,value,cookieExpires,"index.html");
}

/* РАБОТА С ФОРМАМИ */ 

/* Одновременное выделение чекбоксов с одинаковыми id */

function checkSameBoxes (checkbox_object) { 
	var checkbox_collection=checkbox_object.form.elements[checkbox_object.id];
	if (checkbox_collection.length)
		for (i=0;i<checkbox_collection.length;i++)
			checkbox_collection[i].checked=checkbox_object.checked;
}

/* Отправка формы на выбранный из выпадающего меню адрес */

function setActionAndSubmit (form) {
  var options=form.elements['Action'].options;
	var action=options[options.selectedIndex].value;
	if (action) { 
		form.action=action;
	  form.submit();
	}
}

/* Изменение типа поля ввода */

function switchUploadType (typeField) {
	var field=typeField.parentNode.getElementsByTagName("INPUT")[0];
	var type=typeField.value;
	if (typeof(field)!='undefined' && field.type!=type) {
		//field.type=type;
		//field.setAttribute("type",type);
		var newField=document.createElement("INPUT");
		newField.setAttribute("type",type);
		newField.setAttribute("name",field.name);
		newField.setAttribute("id",field.id);
		newField.setAttribute("value",field.value);
		newField.setAttribute("size",field.size);
		newField.setAttribute("title",field.title);
		field.parentNode.replaceChild(newField,field);
		return newField;
	}
	else return false;
}

/* Увеличение высоты TEXTAREA со вводом текста */

function growTextarea(textarea) {
	/* Для корректной работы функции для поля дожен быть задан html-атрибут rows */
	var lineHeight = 13;
	var newHeight = textarea.scrollHeight;
	var currentHeight = textarea.clientHeight;
	if (newHeight > currentHeight) 
		textarea.style.height = newHeight + 3 * lineHeight + 'px';
}

/* КЛОНИРОВ\xD0\x90НИЕ ПОЛЕЙ ФОРМЫ */

/* Клонирование строки таблицы с полями ввода 
   c заменой namе, id и value полей по указанному шабнону*/

function addFields (buttonClicked,replaceWhat,replaceTo) {
	var cloneFrom=$(buttonClicked.parentNode.parentNode);
	$(buttonClicked).remove();
	cloneFrom.cleanWhitespace();
	var cloneTo=$(cloneFrom.cloneNode(true));
	cloneTo.lastChild.appendChild(buttonClicked);
	cloneFrom.lastChild.innerHTML='<input type="button" title="удалить поля" value="-" onclick="this.parentNode.parentNode.remove();"/>';
  var inputs=cloneTo.getElementsByTagName("INPUT");
	$A(inputs).each(function (element) {
    /* replace element name, id & value */
    element.name=element.name.replace(replaceWhat,replaceTo);
		if (element.id) 
    	element.id=element.id.replace(replaceWhat,replaceTo);
		if (element.value && element.type!="file" && ! element.name.match(/UPLOAD_PIC_[A-Za-z1-9]*$/)) 
			element.value=element.value.replace(replaceWhat,replaceTo);
		else 
			element.value="";
  });
	var textareas=cloneTo.getElementsByTagName("TEXTAREA");
	$A(textareas).each(function (element) {
    element.name=element.name.replace(replaceWhat,replaceTo);
		if (element.id) 
    	element.id=element.id.replace(replaceWhat,replaceTo);
	});
	var cloneFromSelects=cloneFrom.getElementsByTagName("SELECT");
	var cloneToSelects=cloneTo.getElementsByTagName("SELECT");
	/* restore <select>s values */
	for (var i=0; i<cloneFromSelects.length; i++) {
		cloneToSelects[i].name=cloneToSelects[i].name.replace(replaceWhat,replaceTo);
	  if (cloneToSelects[i].id) 
			cloneToSelects[i].id=cloneToSelects[i].id.replace(replaceWhat,replaceTo);
		cloneToSelects[i].value=cloneFromSelects[i].value;
	}
	cloneTo.hide();
  if (cloneFrom.nextSibling) cloneFrom.parentNode.insertBefore(cloneTo,cloneFrom.nextSibling);
	else cloneFrom.parentNode.appendChild(cloneTo);
	if (typeof Effect!='undefined') cloneTo.appear();
	else cloneTo.show();
  return cloneTo;
}

/* Клонирование контейнера множественного постинга
   с инкрементацией значения указанного поля */			

function addPostingContainer (buttonClicked,incrementFieldId,incrementValue) {
	var curPostingPrefix=buttonClicked.parentNode.parentNode.getElementsByTagName("INPUT")[0].value;
	var newPostingPrefix=curPostingPrefix.match(/\D+/)+(Number(curPostingPrefix.match(/\d+/))+1);
	var newRow=addFields(buttonClicked,curPostingPrefix,newPostingPrefix);
	var newFields=newRow.getElementsByTagName("INPUT");
	if (incrementFieldId && incrementValue) {
		for (i=0; i<newFields.length; i++)
		 if (newFields[i].id==incrementFieldId)
			 newFields[i].value=Number(newFields[i].value)+incrementValue;
	}
}

/* ПРОВЕРКА ЗНАЧЕНИЙ ПОЛЕЙ В ФОРМАХ */

/* Проверка корректности EMAIL */

function checkFieldIsEmail (emailField,errorField,errorMsg) {
	var emailFilter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if (emailFilter.test(emailField.value)) {
		errorField.innerHTML="";
		emailField.className="formField";
		return true;
	}
	else {
		errorField.innerHTML=errorMsg;
		emailField.className="formError";
		return false;
	}
}

/* Проверка корректности URL */
/*
function checkFieldIsUrl (urlField,errorField,errorMsg) {
	var urlFilter  = /(((http|ftp|https|ftps)://)|(www\.))+([a-zA-Z0-9\._-]+\.[a-zA-Z]{2,6})(/[a-zA-Z0-9+,\&%_\./-~-]*)?/;
	if (urlFilter.test(urlField.value)) {
		errorField.innerHTML="";
		emailField.className="formField";
		return true;
	}
	else {
		errorField.innerHTML=errorMsg;
		emailField.className="formError";
		return false;
	}
}
*/
/* Проверка заполненности поля */

function checkFieldNotNull (emailField,errorField,errorMsg) {
	if (emailField.value) {
		errorField.innerHTML="";
		emailField.className="formField";
		return true;
	}
	else {
		errorField.innerHTML=errorMsg;
		emailField.className="formError";
		return false;
	}
}

/* \xD0\xA1ОХ\xD0\xA0АНЕНИЕ УПОРЯДОЧЕННОГО СПИСКА АЙТЕМОВ */

function processOrderedList (listId) {
	var lis=$$('#'+listId+' LI');
	var links=$$('#'+listId+' INPUT');
	lis.each(function(li,i){
		links[i].value=li.id+"("+(i+1)+")";
	});
}


/* ОТОБРАЖЕНИЕ ЭЛЕМЕНТОВ */

/* Вычисление переключаемого контейнера по переключающему */

function getToggleContainer(toggleObj,containerIdPrefix) {
	var containerId=containerIdPrefix;
	if (toggleObj.id.indexOf('_')!=-1) 
		containerId+=toggleObj.id.substring(toggleObj.id.indexOf('_'),toggleObj.id.length); 
	return $(containerId);
}

/* Переключение отображения (св-ва display) элемента */

function toggleDisplay (toggleObj,containerObj,classExpanded,classCollapsed) {
	containerObj=$(containerObj);
	if (containerObj.visible()) {
		containerObj.style.display='none';	
		if (classCollapsed) toggleObj.className=classCollapsed;
	}
	else {
		containerObj.style.display='block';	
		if (classExpanded) toggleObj.className=classExpanded;
	}
	if (typeof Effect!='undefined') containerObj.scrollTo({offset: 30});
	return containerObj.getStyle('display');
}

/* Переключение отображения (св-ва display) элемента 
   c запоминанием соостояния в cookie */

function toggleDisplayCookie (toggleObj,containerObj,cookiePrefix,classExpanded,classCollapsed) {
	var cookieName=containerObj.id+"_display";
	if (cookiePrefix) cookieName=cookiePrefix+"_"+cookieName;
	var cookieValue=toggleDisplay(toggleObj,containerObj,classExpanded,classCollapsed);
	setCookieForever(cookieName,cookieValue);
}

/* Перевод строки при отображении URL-ов*/

function wrapUrls (urls) {
  for (var i=0; i<urls.length; i++) {
    var urlParts=urls[i].innerHTML.match(/[\w=:\.-]+([\/#\?]|&amp;)*/g);
    var formattedUrl="";
    for (var j=0; j<urlParts.length; j++) {
    formattedUrl+=urlParts[j]+"<wbr>";
    }
    urls[i].innerHTML=formattedUrl.link(urls[i].innerHTML);
  }
}

/* РАБОТА С ПАР\xD0\x90МЕТРАМИ URL */

/* Извлечение значения параметра из URL */

function getUrlParameter (url,paramName) {
	var paramValue="";
	if (url.indexOf("?")!=-1) {
		var params;
		var paramsStr=url.substr(url.indexOf("?")+1);
		if (paramsStr.indexOf("&")) params=paramsStr.split("&");
		else params=paramsStr;
		for (var i=0; i<params.length; i++)
			if (params[i].indexOf(paramName)!=-1) 
				paramValue=params[i].substr(params[i].indexOf("=")+1);
	}
	return paramValue;
}

/* Добавление параметра в URL */

function addUrlParameter (url,paramName,paramValue) {
	var paramSeparator;
	if (url.indexOf("?")!=-1) paramSeparator="&";
	else paramSeparator="?"
	return url+paramSeparator+paramName+"="+paramValue;
}

/* РАБОТА С ОКНАМИ */

/* Открыть URL в popup-окне */

function openWindow (url,name,width,height,adds) {  
	url=addUrlParameter(url,"popup",1);
  if (!width) width=500;
  if (!height) height=500;
  var params="width="+width+",height="+height+","+
       ((adds&&adds.indexOf("resizable")!=-1)?"":"resizable=yes,")+
       ((adds&&adds.indexOf("status")!=-1)?"":"status=yes,")+
       ((adds&&adds.indexOf("toolbar")!=-1)?"":"toolbar=no,")+
       ((adds&&adds.indexOf("menubar")!=-1)?"":"menubar=no,")+
       ((adds&&adds.indexOf("scrollbars")!=-1)?"":"scrollbars=yes,")+
       ((adds&&adds.indexOf("status")!=-1)?"":"status=yes,")+
       ((adds&&adds.indexOf("location")!=-1)?"":"location=no,")+
       adds;
  someWindow=window.open(url,name,params);
  someWindow.focus();
}

/* Закрыть popup-окно и обновить родительское */

function closeWindow() {
  if (opener) window.close();
  else window.history.go(-1);
}

/* Открыть окно выбора айтема  */

function openLinktree(link,type,filter,sort,newitem) {
	url=Cmw.url_prefix+"/"+Cmw.item_id+"/cms_bind";
	editForm=document.forms["EditForm"];
	fieldname=editForm.elements["Posting"].value+"."+link;
	itemlist=editForm.elements[fieldname].value;
	searchfor=editForm.elements[fieldname+'_SEARCHFOR'].value;
	editForm.elements[fieldname].value;
	if (link.indexOf("_FOR")!=-1) link=link.substring(0,link.indexOf("_FOR"));
	if (link.indexOf("_TEMP")!=-1) link=link.substring(0,link.indexOf("_TEMP"));
	url=url+"?LINK="+link+
		"&TYPE="+type+
		"&ITEMLIST="+itemlist+
		"&FILTER="+filter+
		"&SORT="+sort+
		"&FIELDNAME="+fieldname+
		"&NEW="+newitem+
		"&SEARCHFOR="+searchfor;
	openWindow(url,"LinkTree");
}

/* Показать картинку в popup-окне */

var pic;
var wait;

function popupPic (link_obj) {
	var urlPrefix=Cmw.url_prefix;
	var itemId=link_obj.pathname.substring(link_obj.pathname.indexOf("index.html",1)+1,link_obj.pathname.lastIndexOf("index.html"));
	var picName=link_obj.pathname.substring(link_obj.pathname.lastIndexOf("index.html")+1);
  pic=new Image();
  var now=new Date();
	pic.src=link_obj.href.substring(0,link_obj.href.indexOf("?")==-1?link_obj.href.length:link_obj.href.indexOf("?"));
	var printFunc=(link_obj.search.match(/print/gi))?"popup.onload=function(){this.print();};":"";
	wait=window.setInterval("if(pic.complete){var popup=window.open('"+urlPrefix+"/"+itemId+"/cms_show_picture?pix="+picName+"','popup"+now.getTime()+"','width='+pic.width+',height='+pic.height+',menubar=no,toolbar=no,location=no,scrollbars=no,status=yes');"+printFunc+"window.clearInterval(wait);}",10);
  return false;
}

/* ПОЗИЦИОНИРОВАНИЕ ЭЛЕМЕНТОВ */

function stickToTop (id) {
	$(id).style.top = ( window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop ) + "px";
}

/* ВСПОМОГАТЕЛЬНЫЕ Ф-ЦИИ ДЛЯ РАБОТЫ С DOM */

function getParentNode (element,tagName) {
	do element=element.parentNode;
	while (element.tagName!=tagName);
	return element;
}

