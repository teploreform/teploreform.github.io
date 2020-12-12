var cmsBehaviours = {
  
	'.editContainerBLOCK' : function (el) {
    el.onclick = function () {
			toggleDisplayCookie(el,$(el.hash.substr(1)),getParentNode(el,"FORM").name,"editContainerBLOCK","editContainerNONE");
			return false;
    }
  },

  '.editContainerNONE' : function (el) {
    el.onclick = function () {
			toggleDisplayCookie(el,$(el.hash.substr(1)),getParentNode(el,"FORM").name,"editContainerBLOCK","editContainerNONE");
			return false;
    }
  },

	'.formTab a' : function (el) {
		el.onclick = function () {
			var toggleObj = eval(el.hash.substr(1));
			toggleObj.toggle();
			return false;
		}
	},

	'.disabled' : function (el) {
		el.onkeypress = function (event) { 
			return false;
		},
		el.onfocus = function () {
			el.blur();
		}
	},
	
	'.checkSameBoxes' : function (el) {
		el.onclick = function () {
			checkSameBoxes(el);
		}
	},
  'a.popupPic' : function (el) {
    el.onclick = function () {
			return popupPic(el);
    }
  },

	'a.popupWin' : function (el) {
		el.onclick = function () {
			openWindow(el.href,el.id+'PopupWin');
			return false;
		}
	},

	'a.popupHelp' : function (el) {
		el.onclick = function () {
			openWindow(el.href,el.id+'PopupHelp',800,600);
			return false;
		}
	},
	'.addPicForText' : function (el) {
    el.onclick = function () {
			var newPicNum=Number(el.parentNode.parentNode.getElementsByTagName("INPUT")[0].name.match(/\d+/))+1;
      addFields(el,/\d+/,newPicNum);
      return false;
    }
  },

	'.addRefbookItem' : function (el) {
		el.onclick = function () {
			addPostingContainer(el,'ITEM_ORDNUM',10);
      return false;
		}
	},

	'.redirectMenu' : function (el) {
		el.onchange = function () {
			setActionAndSubmit(el.form);
			el.selectedIndex=0;
		}
	},

	'.submitMenu' : function (el) {
		el.onchange = function () {
			if (el.value && el.value.indexOf("---") == -1 ) el.form.submit();
			else el.selectedIndex=0;
		}
	},

	'#switchWysiwyg' : function (el) {
		el.onclick = function () {
			var message;
			var cookieValue=Number(el.checked);
			if (cookieValue) message="Визуальный редактор будет акт\xD0\xB8вирован после обновления страницы!";
			else message="Визуальный редактор будет отключен после обновления страницы!";
			var cookieExpires=new Date();
			if (confirm(message)) setCookieForever('WYSIWYG',cookieValue);
		}
	},

	'#toolbarToggle' : function (el) {
		el.onclick = function () {
			toggleDisplayCookie(el,$("toolbarMenu"));
			return false;
		}
	},

	'#orderSAVE' : function (el) {
		el.onclick = function () {
			processOrderedList('orderList','orderField');
		}
	},

	'#formBACK' : function (el) {
		el.onclick = function () {
			document.location=Cmw.url_prefix+'/'+Cmw.item_id;
			return false;
		}
	},

	'TEXTAREA.grow' : function (el) {
		el.onkeyup = function () {
			growTextarea(el);
		}
	},
	
	'.labeled' : function (el) {
		el.onfocus = function () {
			el=$(el);
			if (el.value == el.readAttribute('title')) {
				el.value = '';
				el.removeClassName('dimmed');
			}
		},
		el.onblur = function () {
			el=$(el);
			if (el.value == '') {
				el.value = el.readAttribute('title');
				el.addClassName('dimmed');
			}
		}
	}

}
Behaviour.register(cmsBehaviours);
