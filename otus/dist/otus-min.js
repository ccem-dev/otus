!function(){angular.module("otus",["dependencies","otus.dashboard","otus.installer","otus.authenticator","otus.client","otusDomainClient"])}(),function(){"use strict";angular.module("otus.authenticator",[])}(),function(){angular.module("dependencies",["ngMaterial","ngMessages","ngAnimate","ui.router","lokijs","indexedDB"])}(),function(){function t(t){t.formatDate=function(t){return moment(t).format("DD/MM/YYYY")},t.parseDate=function(t){var e=moment(t,"DD/MM/YYYY",!0);return e.isValid()?e.toDate():new Date(NaN)}}angular.module("otus").config(["$mdDateLocaleProvider",t])}(),function(){function t(t,e,n){t.state("installer",{url:"/installer",views:{"system-wrap":{templateUrl:"app/installer/initial/initial-config.html",controller:"InitialConfigController",controllerAs:"controller"}}}).state("login",{url:"/login",views:{"system-wrap":{templateUrl:"app/authenticator/login/login.html",controller:"LoginController"}}}).state("home",{url:"/home",views:{"system-wrap":{templateUrl:"app/dashboard/home/main-home-content-template.html"}}}),e.otherwise("/login"),n.html5Mode(!0)}angular.module("otus").config(["$stateProvider","$urlRouterProvider","$locationProvider",t]).constant("APP_STATE",{HOME:"home",INSTALLER:"installer",LOGIN:"login"})}(),function(){function t(t,e){t.theme("layoutTheme").primaryPalette("cyan",{"default":"900","hue-1":"400"}).accentPalette("blue-grey",{"default":"900","hue-1":"50"}).warnPalette("red"),e.defaultIconSet("app/assets/img/icons/mdi.svg",24)}angular.module("otus").config(["$mdThemingProvider","$mdIconProvider",t])}(),function(){"use strict";angular.module("otus.installer",[])}(),function(){"use strict";function t(t,e,n,r){function o(){i()}function i(){var t=n.getOtusInstallerResource();t.ready(function(t){t.data?e.goToLogin():e.goToInstaller()})}var u="Login Inválido! Verifique os dados informados.",a="Erro interno do servidor.";o(),t.authenticate=function(t){var o=n.getOtusAuthenticatorResource();o.authenticate(t,function(t){n.setSecurityToken(t.data),t.hasErrors?r.show(r.simple().textContent(u)):e.goToHome()},function(){r.show(r.simple().textContent(a))})}}angular.module("otus.authenticator").controller("LoginController",t),t.$inject=["$scope","DashboardStateService","OtusRestResourceService","$mdToast"]}(),function(){"use strict";function t(t,e,n,r,o,i,u,a){function s(){d=e.getOtusInstallerResource()}function c(t){n.setHostname(t),h=n.getUrlResource();var e=u.defer();return h.isValidDomain(function(t){e.resolve(!0)},function(){o.initialConfigForm.urlProject.$setValidity("domainAccess",!1),e.reject(!1)}),e.promise}function l(t){c(t.domainRestUrl).then(function(){d.config(t,function(t){t.hasErrors?p("Erro ao adicionar novas configurações"):f()},function(){p("Erro ao conectar no domínio.")})})}function f(){alert=a.alert().title("Informação").content("Suas configurações foram realizadas com sucesso! Você vai ser redirecionado para a tela de login.").ok("ok"),a.show(alert)["finally"](function(){t.goToLogin()})}function p(t){i.show(i.simple().textContent(t))}var d,h,g=this;g.register=l,s(),o.resetValidationDomain=function(){o.initialConfigForm.urlProject.$setValidity("domainAccess",!0),o.initialConfigForm.$setValidity("domainAccess",!0)}}angular.module("otus.installer").controller("InitialConfigController",t),t.$inject=["DashboardStateService","OtusRestResourceService","RestResourceService","$http","$scope","$mdToast","$q","$mdDialog"]}(),function(){"use strict";angular.module("otus.dashboard",[])}(),function(){"use strict";function t(t,e,n,r){function o(){s.currentState="Login"}function i(){s.currentState="Login",t.url(n.LOGIN)}function u(){s.currentState="Home",t.url(n.HOME)}function a(){s.currentState="Instalador do Sistema",t.url(n.INSTALLER)}var s=this;"http://"+window.location.hostname,s.goToLogin=i,s.goToInstaller=a,s.goToHome=u,o()}angular.module("otus.dashboard").service("DashboardStateService",t),t.$inject=["$location","$http","APP_STATE","OtusRestResourceService"]}(),function(){"use strict";var t=[].slice;angular.module("indexedDB",[]).provider("$indexedDB",function(){var e,n,r,o,i,u,a,s,c,l,f,p,d,h,g,m;h=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB,e=window.IDBKeyRange||window.mozIDBKeyRange||window.webkitIDBKeyRange||window.msIDBKeyRange,s={readonly:"readonly",readwrite:"readwrite"},g={pending:"pending"},u={next:"next",nextunique:"nextunique",prev:"prev",prevunique:"prevunique"},r={ascending:u.next,descending:u.prev},c="",f=1,a=null,m={},l=null,n=[],p={useIndex:void 0,keyRange:null,direction:u.next},i=function(t,e,n,r,o){var i;for(i in m)!m.hasOwnProperty(i)||t>=i||(o.log("$indexedDB: Running upgrade : "+i+" from "+t),m[i](e,n,r))},d=function(t){return t.target.readyState===g.pending?"Error: Operation pending":t.target.webkitErrorMessage||t.target.error.message||t.target.errorCode},o=function(t,e){return void 0!==e?t.then(function(){return e}):t},this.connection=function(t){return c=t,this},this.upgradeDatabase=function(t,e){return m[t]=e,f=Math.max.apply(null,Object.keys(m)),this},this.$get=["$q","$rootScope","$log",function(g,m,y){var v,w,$,b,D,S,x,j,R,I,k,A;return k=function(t){return function(e){return m.$apply(function(){return t.reject(d(e))})}},x=function(){var t,e;return e=g.defer(),t=h.open(c,parseInt(f)||1),t.onsuccess=function(){a=t.result,m.$apply(function(){e.resolve(a)})},t.onblocked=t.onerror=k(e),t.onupgradeneeded=function(t){var e;a=t.target.result,e=t.target.transaction,y.log("$indexedDB: Upgrading database '"+a.name+"' from version "+t.oldVersion+" to version "+t.newVersion+" ..."),i(t.oldVersion,t,a,e,y)},e.promise},R=function(){return l||(l=x())},S=function(){return R().then(function(){return a.close(),a=null,l=null})},A=function(t){var e,n,r,o;for(e=!0,r=0,o=t.length;o>r;r++)n=t[r],e&=a.objectStoreNames.contains(n);return e},I=function(t,e){return null==e&&(e=s.readonly),R().then(function(){return A(t)?new b(t,e):g.reject("Object stores "+t+" do not exist.")})},j=function(t){return t.beginKey&&t.endKey?e.bound(t.beginKey,t.endKey):void 0},D=function(t){return n.push(t.promise),t.promise["finally"](function(){var e;return e=n.indexOf(t.promise),e>-1?n.splice(e,1):void 0})},b=function(){function t(t,e){null==e&&(e=s.readonly),this.transaction=a.transaction(t,e),this.defer=g.defer(),this.promise=this.defer.promise,this.setupCallbacks()}return t.prototype.setupCallbacks=function(){return this.transaction.oncomplete=function(t){return function(){return m.$apply(function(){return t.defer.resolve("Transaction Completed")})}}(this),this.transaction.onabort=function(t){return function(e){return m.$apply(function(){return t.defer.reject("Transaction Aborted",e)})}}(this),this.transaction.onerror=function(t){return function(e){return m.$apply(function(){return t.defer.reject("Transaction Error",e)})}}(this),D(this)},t.prototype.objectStore=function(t){return this.transaction.objectStore(t)},t.prototype.abort=function(){return this.transaction.abort()},t}(),v=function(){function e(){this.q=g.defer(),this.promise=this.q.promise}return e.prototype.reject=function(){var e;return e=1<=arguments.length?t.call(arguments,0):[],m.$apply(function(t){return function(){var n;return(n=t.q).reject.apply(n,e)}}(this))},e.prototype.rejectWith=function(t){return t.onerror=t.onblocked=function(t){return function(e){return t.reject(d(e))}}(this)},e.prototype.resolve=function(){var e;return e=1<=arguments.length?t.call(arguments,0):[],m.$apply(function(t){return function(){var n;return(n=t.q).resolve.apply(n,e)}}(this))},e.prototype.notify=function(){var e;return e=1<=arguments.length?t.call(arguments,0):[],m.$apply(function(t){return function(){var n;return(n=t.q).notify.apply(n,e)}}(this))},e.prototype.dbErrorFunction=function(){return function(t){return function(e){return m.$apply(function(){return t.q.reject(d(e))})}}(this)},e.prototype.resolveWith=function(t){return this.rejectWith(t),t.onsuccess=function(t){return function(e){return t.resolve(e.target.result)}}(this)},e}(),w=function(){function t(t,e){this.storeName=t,this.store=e.objectStore(t),this.transaction=e}return t.prototype.defer=function(){return new v},t.prototype._mapCursor=function(t,e,n){var r;return null==n&&(n=this.store.openCursor()),r=[],t.rejectWith(n),n.onsuccess=function(n){var o;return(o=n.target.result)?(r.push(e(o)),t.notify(e(o)),o["continue"]()):t.resolve(r)}},t.prototype._arrayOperation=function(t,e){var n,r,o,i,u,a;for(n=this.defer(),angular.isArray(t)||(t=[t]),u=0,a=t.length;a>u;u++)r=t[u],o=e(r),i=[],n.rejectWith(o),o.onsuccess=function(e){return i.push(e.target.result),n.notify(e.target.result),i.length>=t.length?n.resolve(i):void 0};return 0===t.length?g.when([]):n.promise},t.prototype.getAllKeys=function(){var t,e;return t=this.defer(),this.store.getAllKeys?(e=this.store.getAllKeys(),t.resolveWith(e)):this._mapCursor(t,function(t){return t.key}),t.promise},t.prototype.clear=function(){var t,e;return t=this.defer(),e=this.store.clear(),t.resolveWith(e),t.promise},t.prototype["delete"]=function(t){var e;return e=this.defer(),e.resolveWith(this.store["delete"](t)),e.promise},t.prototype.upsert=function(t){return this._arrayOperation(t,function(t){return function(e){return t.store.put(e)}}(this))},t.prototype.insert=function(t){return this._arrayOperation(t,function(t){return function(e){return t.store.add(e)}}(this))},t.prototype.getAll=function(){var t;return t=this.defer(),this.store.getAll?t.resolveWith(this.store.getAll()):this._mapCursor(t,function(t){return t.value}),t.promise},t.prototype.eachWhere=function(t){var e,n,r,o,i;return e=this.defer(),r=t.indexName,o=t.keyRange,n=t.direction,i=r?this.store.index(r).openCursor(o,n):this.store.openCursor(o,n),this._mapCursor(e,function(t){return t.value},i),e.promise},t.prototype.findWhere=function(t){return this.eachWhere(t)},t.prototype.each=function(t){return null==t&&(t={}),this.eachBy(void 0,t)},t.prototype.eachBy=function(t,e){var n;return null==t&&(t=void 0),null==e&&(e={}),n=new $,n.indexName=t,n.keyRange=j(e),n.direction=e.direction||p.direction,this.eachWhere(n)},t.prototype.count=function(){var t;return t=this.defer(),t.resolveWith(this.store.count()),t.promise},t.prototype.find=function(t){var e,n;return e=this.defer(),n=this.store.get(t),e.rejectWith(n),n.onsuccess=function(n){return function(r){return r.target.result?e.resolve(r.target.result):e.reject(""+n.storeName+":"+t+" not found.")}}(this),e.promise},t.prototype.findBy=function(t,e){var n;return n=this.defer(),n.resolveWith(this.store.index(t).get(e)),n.promise},t.prototype.query=function(){return new $},t}(),$=function(){function t(){this.indexName=void 0,this.keyRange=void 0,this.direction=u.next}return t.prototype.$lt=function(t){return this.keyRange=e.upperBound(t,!0),this},t.prototype.$gt=function(t){return this.keyRange=e.lowerBound(t,!0),this},t.prototype.$lte=function(t){return this.keyRange=e.upperBound(t),this},t.prototype.$gte=function(t){return this.keyRange=e.lowerBound(t),this},t.prototype.$eq=function(t){return this.keyRange=e.only(t),this},t.prototype.$between=function(t,n,r,o){return null==r&&(r=!1),null==o&&(o=!1),this.keyRange=e.bound(t,n,r,o),this},t.prototype.$desc=function(t){return this.direction=t?u.prevunique:u.prev,this},t.prototype.$asc=function(t){return this.direction=t?u.nextunique:u.next,this},t.prototype.$index=function(t){return this.indexName=t,this},t}(),{openStore:function(t,e,n){return null==n&&(n=s.readwrite),I([t],n).then(function(n){var r;return r=e(new w(t,n)),o(n.promise,r)})},openStores:function(t,e,n){return null==n&&(n=s.readwrite),I(t,n).then(function(n){var r,i,u;return r=function(){var e,r,o;for(o=[],e=0,r=t.length;r>e;e++)u=t[e],o.push(new w(u,n));return o}(),i=e.apply(null,r),o(n.promise,i)})},openAllStores:function(t,e){return null==e&&(e=s.readwrite),R().then(function(n){return function(){var n,r,i,u,s;return u=Array.prototype.slice.apply(a.objectStoreNames),s=new b(u,e),n=function(){var t,e,n;for(n=[],t=0,e=u.length;e>t;t++)i=u[t],n.push(new w(i,s));return n}(),r=t.apply(null,n),o(s.promise,r)}}(this))},closeDatabase:function(){return S()},deleteDatabase:function(){return S().then(function(){var t;return t=new v,t.resolveWith(h.deleteDatabase(c)),t.promise})["finally"](function(){return y.log("$indexedDB: "+c+" database deleted.")})},queryDirection:r,flush:function(){return n.length>0?g.all(n):g.when([])},databaseInfo:function(){return R().then(function(){var t,e;return e=null,t=Array.prototype.slice.apply(a.objectStoreNames),I(t,s.readonly).then(function(e){var n,r,o;return o=function(){var o,i,u;for(u=[],o=0,i=t.length;i>o;o++)r=t[o],n=e.objectStore(r),u.push({name:r,keyPath:n.keyPath,autoIncrement:n.autoIncrement,indices:Array.prototype.slice.apply(n.indexNames)});return u}(),e.promise.then(function(){return{name:a.name,version:a.version,objectStores:o}})})})}}}]})}.call(this);