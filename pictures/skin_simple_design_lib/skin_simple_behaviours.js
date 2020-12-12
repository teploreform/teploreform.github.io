var skinSimpleBehaviours = {

  '#login' : function (el) {
    el.onfocus = function () {
      if (el.value=="логин") el.value="";
    },
    el.onblur = function () {
      if (!el.value) el.value="логин";
    }
  },

  '#password' : function (el) {
    el.onfocus = function () {
      if (el.value=="пароль") el.value="";
    },
    el.onblur = function () {
      if (!el.value) el.value="пароль";
    }
  },

  '#logout' : function (el) {
    el.onclick = function () {
      $("logoutForm").submit();
      return false;
    }
  }

}
Behaviour.register(skinSimpleBehaviours);
