!function(e){e.fn.isHappy=function(t){var s,n=[],a=!1;function r(e){return"function"==typeof e}function o(s){return r(t.errorTemplate)?t.errorTemplate(s):(n=s,a=t.classes&&t.classes.message||"unhappyMessage",e('<span id="'+n.id+'" class="'+a+'" role="alert">'+n.message+"</span>"));var n,a}function i(e){var s,a,o=!1;for(t.testMode&&e.preventDefault(),s=0,a=n.length;s<a;s+=1)n[s].testValid(!0)||(o=!0);return o?(r(t.unHappy)&&t.unHappy(e),!1):t.testMode&&(window.console&&console.warn("would have submitted"),r(t.happy))?t.happy(e):r(t.happy)?t.happy(e):void 0}function u(s,i){var u=e(i);if(u.length){i=u.prop("id")||u.prop("name").replace(["[","]"],"");var p={message:s.message||"",id:i+"_unhappy"},l=e(p.id).length>0?e(p.id):o(p);n.push(u),u.testValid=function(n){var a,i,c=u.prop("required")||s.required,d="password"===u.attr("type"),h=r(s.arg)?s.arg():s.arg,m=s.errorTarget&&e(s.errorTarget)||u,f=t.classes&&t.classes.field||"unhappy",g=m.hasClass(f),v=p.message;return u.length>1?(a=[],u.each(function(t,s){a.push(e(s).val())}),a=a.join(",")):(a=r(s.clean)?s.clean(u.val()):!d&&void 0===s.trim||s.trim?e.trim(u.val()):u.val(),u.val(a)),!0===n&&!0===c&&(g=!a.length),(a.length>0||"sometimes"===c)&&s.test&&(r(s.test)?g=s.test(a,h):"object"==typeof s.test&&e.each(s.test,function(e,t){if(r(t)&&!0!==(g=t(a,h)))return!1}),g instanceof Error?p.message=g.message:(g=!g,p.message=s.message||"")),!v!==p.message&&(i=o(p),l.replaceWith(i),l=i),g?(m.addClass(f).after(l),!1):(l.remove(),m.removeClass(f),!0)},u.on(s.when||t.when||"blur",function(){a?e(window).one("mouseup",u.testValid):u.testValid()})}}for(s in t.fields)t.fields.hasOwnProperty(s)&&u(t.fields[s],s);return e(t.submitButton||this).on("mousedown",function(){a=!0}),e(window).on("mouseup",function(){a=!1}),t.submitButton?e(t.submitButton).click(i):this.on("submit",i),this}}(this.jQuery||this.Zepto);
