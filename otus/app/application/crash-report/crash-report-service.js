(function () {
  'use strict';

  angular
    .module('otusjs.application.crash')
    .service('otusjs.application.crash.CrashReportService', Service);

  Service.$inject = [
    '$window',
    'otusjs.application.crash.CrashReportFactory',
  ];

  function Service($window, CrashReportFactory) {
    var self = this;
    var NAME_PREFIX = 'otus-bugtracker-';
    var MAX_COOKIES_LENGHT_SIZE = 80000; //todo: check for other browsers

    self.persistException = persistException;
    self.getCookie = getCookie;

    var _browserInfo = {};

    _buildBrowserInfo();


    function _buildBrowserInfo() {
      _browserInfo.userAgent = navigator.userAgent;
      _browserInfo.url = $window.location.href;
      _browserInfo.browserName = getBrowserName(_browserInfo.userAgent);
      _browserInfo.browserVersion = getBrowserVersion(_browserInfo.browserName, _browserInfo.userAgent);
      _browserInfo.operatingSystemName = getOSName();
    }

    function persistException(exception) {
      test(exception);
      return;

      console.log(exception.message);
      var cookie = createCookie(exception);

      manageCookiePoolSize(cookie);

      var cookiePoolSize = document.cookie.length;
      document.cookie = cookie;
      if (cookiePoolSize === document.cookie.length) {
        console.log('nao inseriu')
        //todo: build large cookie model
      }

    }

    // @
    // 8340
    // crash-report-service.js:68 last i: 18


    //A
    // 8340
    // crash-report-service.js:75 last i: 0


    function test(exception) {
      console.log('pew');
      //max insertion string: 4111
      var bigString = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n";
      var insertionString = bigString;
      // var bigString= "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@";
      // var bigString= "ØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØØ";

      exception.stack = "";

      var successful = true;

      while (successful) {
        exception.message = insertionString;

        var cookie = createCookie(exception);

        manageCookiePoolSize(cookie);

        var cookiePoolSize = document.cookie.length;
        document.cookie = cookie;
        if (cookiePoolSize === document.cookie.length) {
          console.log('----');
          console.log('nao inseriu');
          console.log(insertionString);
          successful = false;
        }
        console.log(cookie.length);
        insertionString = insertionString + 'A';

      }

      console.log('pool size: ' + document.cookie.length)

    }

    function createCookie(exception) {
      var exdays = 1;
      var date = new Date();

      var name = NAME_PREFIX + date.getTime();

      date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
      var expires = 'expires=' + date.toUTCString();

      var errorData = JSON.stringify(CrashReportFactory.create(exception, _browserInfo.url, _browserInfo.browserName, _browserInfo.browserVersion, _browserInfo.operatingSystemName));
      return name + '=' + errorData + ';' + expires + ';path=/';
    }


    function manageCookiePoolSize(cookie) {
      var cookies = getCookieList();
      var cookiesLength = getCookiesLength();
      var toRemove = [];
      var acSize = 0;

      if (cookiesLength + cookie.length > MAX_COOKIES_LENGHT_SIZE) {
        for (var i = 0; acSize <= cookie.length; i++) {
          toRemove.push(cookies[i]);
          acSize += cookies[i].length;
        }
      }

      toRemove.forEach(function (cookie) {
        deleteCookie(getCookieName(cookie))
      })
    }

    function deleteCookie(name) {
      var date = new Date(new Date().getTime() + parseInt(-1) * 1000 * 60 * 60 * 24);
      var expires = 'expires=' + date.toUTCString();

      var expiredCookie = name + '=' + "" + ';' + expires + ';path=/';

      document.cookie = expiredCookie;
    }

    function getBrowserName(userAgent) {
      var browserName = 'Unknown Browser';
      var nameOffset;
      var verOffset;

      if ((verOffset = userAgent.indexOf('Opera')) != -1) {
        browserName = 'Opera';
      } else if ((verOffset = userAgent.indexOf('MSIE')) != -1) {
        browserName = 'Microsoft Internet Explorer';
      } else if ((verOffset = userAgent.indexOf('Chrome')) != -1) {
        browserName = 'Chrome';
      } else if ((verOffset = userAgent.indexOf('Safari')) != -1) {
        browserName = 'Safari';
      } else if ((verOffset = userAgent.indexOf('Firefox')) != -1) {
        browserName = 'Firefox';
      } else if ((nameOffset = userAgent.lastIndexOf(' ') + 1) <
        (verOffset = userAgent.lastIndexOf('/'))) {
        browserName = userAgent.substring(nameOffset, verOffset);
        if (browserName.toLowerCase() == browserName.toUpperCase()) {
          browserName = navigator.appName;
        }
      }

      return browserName
    }

    function getBrowserVersion(browserName, userAgent) {
      var stringVersion;
      var fullVersion = userAgent.substring(userAgent.indexOf(browserName) + browserName.length + 1);

      stringVersion = fullVersion.indexOf(';');
      if (stringVersion != -1) {
        fullVersion = fullVersion.substring(0, stringVersion);
      }

      stringVersion = fullVersion.indexOf(' ');
      if (stringVersion != -1) {
        fullVersion = fullVersion.substring(0, stringVersion);
      }

      return fullVersion;
    }

    function getOSName() {
      var OSName = 'Unknown OS';
      if (navigator.appVersion.indexOf('Win') != -1) {
        OSName = 'Windows';
      } else if (navigator.appVersion.indexOf('Mac') != -1) {
        OSName = 'MacOS';
      } else if (navigator.appVersion.indexOf('X11') != -1) {
        OSName = 'UNIX';
      } else if (navigator.appVersion.indexOf('Linux') != -1) {
        OSName = 'Linux';
      }

      return OSName;
    }

    function getCookie() {
      var name = NAME_PREFIX;
      var cookies = getCookieList();
      var crash = [];

      for (var i = 0; i < cookies.length; i++) {
        var cookieString = cookies[i];
        while (cookieString.charAt(0) == ' ') {
          cookieString = cookieString.substring(1);
        }
        if (cookieString.indexOf(name) == 0) {
          cookieString = cookieString.substring(name.length + 14, cookieString.length);
          crash.push(cookieString);
        }
      }

      return crash;
    }

    function getCookieList() {
      var decodedCookie = decodeURIComponent(document.cookie);
      return decodedCookie.split(';');
    }

    function getCookieName(cookie) {
      return cookie.split("=")[0];
    }

    function getCookiesLength() {
      return document.cookie.length
    }
  }
}());
