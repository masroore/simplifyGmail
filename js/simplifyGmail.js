/**
 * @preserve
 * Copyright (C) Michael Leggett, Made Simple LLC - All Rights Reserved
 * Proprietary and confidential; Unauthorized copying or redistribution of this file,
 * via any medium is strictly prohibited; Written by Michael Leggett (hi@simpl.fyi)
 */

// ==========================================================================
// SHARED VARIABLES

// Default to not showing debug messages in the console
let report = () => {};
let error = () => {};

// Number of miliseconds to wait before retrying something
const retryIn = 100;
const retryInSlow = 250;

// Number of miliseconds to wait before trying something (usually b/c el not loaded in DOM yet)
const tryIn = 100;

// Maximun number of times we should retry something
const retryAttempts = 30;
const retryAttemptsFew = 4;

// Things to check on view change or later
const check = {
  theme: true,
  readingPane: false,
  readingPaneSize: false,
  moles: false,
  popout: false,
  categories: false,
  inboxSections: true,
  trial: false,
  lists: true,
  click: true,
};

const el = {
  html: document.documentElement,
  style: null,
  oneGoogleRing: null,
  gsuiteLogo: null,
  topLeftButtons: null,
  menuButton: null,
  backButton: null,
  closeButton: null,
  closeSearch: null,
  alert: null,
  alertMsg: null,
  alertAction: null,
  refreshButton: null,
};

// Selectors we have to find via traversing the DOM
const trickyElements = {
  oneGoogleRing: {
    selector: '#gb div path[d$="02,28.27z"]',
    parent: 2,
    suffix: " svg",
  },
  gsuiteLogo: {
    selector:
      'header img[src*="cpanel"], header img[src*="admin.google"], header img[role="img"]',
    parent: 2,
  },
  gsuiteLogoWrapper: {
    selector:
      'header img[src*="cpanel"], header img[src*="admin.google"], header img[role="img"]',
    parent: 3,
  },
  topLeftButtons: { selector: 'path[d*="2H3v2zm0"]', parent: 3 },
  menuButton: { selector: 'path[d*="2H3v2zm0"]', parent: 2 },
  backButton: { selector: '#gb div > svg > path[d*="1-1.41L7.83"]', parent: 2 },
  closeButton: { selector: '#gb div > svg > path[d*="6.41L17.59"]', parent: 2 },
  closeSearch: {
    selector: '#gb form button > svg > path[d*="6.41L17.59"]',
    parent: 2,
  },
  searchIcon: {
    selector: '#gb form button > svg > path[d*="73-5.73C15.53,12.2"]',
    parent: 2,
  },
  refreshButton: {
    selector: '.G-atb .G-Ni div[act="20"][role="button"]',
    parent: 1,
  },
};

// Regexs used by url.js and localstorage.js
const regex = {
  msg: /\/[A-Za-z]{28,}(\?compose=(new|[A-Za-z]{28,}))?/,
  search: /#search|#advanced-search|#create-filter|#section_query/, // |#label TODO: should a label count as a search? System labels?
  label:
    /#label|#starred|#snoozed|#sent|#outbox|#drafts|#imp|#chats|#scheduled|#all|#spam|#trash/,
  titleEmail: /[a-z0-9\.]{6,30}\@[\w-.]{1,63}\.[a-z]{2,24} - (Gmail|[^@]+)$/,
  titleEnd: / - (Gmail|[^@]+)$/,
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
};

// User agent for sniffing browsers
const UA = navigator.userAgent;

// Current View: are in one of these views
const is = {
  simplifyOn: true,
  okToSimplify: true,
  loading: true,
  msg: false,
  msgOpen: false,
  list: false,
  inbox: false,
  search: false,
  label: false,
  settings: false,
  chat: false,
  popout: location.href.search(/view=btop.*search=/) !== -1,
  original: location.href.indexOf("view=om") !== -1,
  print: location.href.indexOf("view=pt") !== -1,
  gChat: location.pathname.indexOf("/chat/") === 0,
  tabbedInbox: null,
  readingPane: false,
  readingPaneType: "",
  readingPaneSize: "500px",
  delegate: /\/mail\/u\/\d\/d/.test(location.pathname),
  safari: / Safari/.test(UA) && !/ Chrome/.test(UA),
  chrome:
    / Safari\//.test(UA) &&
    / Chrome\//.test(UA) &&
    !/ ORP\//.test(UA) &&
    !/ Firefox\//.test(UA),
  oldChrome: / Chrome\/[1-7]\d\./.test(UA),
  firefox: / Firefox\//.test(UA),
  windows: navigator.platform.indexOf("Win") > -1,
  mac: navigator.platform.indexOf("Mac") > -1,
  tabPinned: null,
  mailplaneDisabled: false,
  appNavOn: () => {
    return hasClass("showAppNav") && !hasClass("appNavOff");
  },
};

// Do not initialize Simplify for these views
if (is.original || is.print || is.gChat) {
  is.okToSimplify = false;
  is.simplifyOn = false;
}

// Get user number from URL
const userNum = location.pathname.match(/\/[u|b]\/\d/)[0].substr(-1);
const u = is.delegate ? "b" + userNum : userNum;

// Hash tag for view to go to when closing a view
// TODO: Delete this if I switched to an array
const close = {
  msg: "#inbox",
  search: "#inbox",
  settings: "#inbox",
};

// Cached states and paremeters from localStorage
let simplify = {};
let doNotShow = {};

// Gmail interface language code
const lang = document.documentElement.lang || "en";

// Google Inbox categories that aren't visible in Gmail
const categories = {
  Finance: "#search/category%3Afinance",
  Purchases: "#search/category%3Apurchases",
  Travel: "#search/category%3Atravel",
};

// Body font size
const fontSizes = {
  13: { rem: 0.8125, px: 13 },
  14: { rem: 0.8751, px: 14.001 },
  15: { rem: 0.9376, px: 15.001 },
  16: { rem: 1.0001, px: 16.001 },
  17: { rem: 1.0626, px: 17.001 },
  18: { rem: 1.1251, px: 18.001 },
  19: { rem: 1.1876, px: 19.001 },
  20: { rem: 1.2501, px: 20.001 },
};
let fontSize = 14;
let fontSizeRem = fontSizes[fontSize].rem;
let fontSizePx = fontSizes[fontSize].px;
let fontFace = "Arial, Helvetica, sans-serif";

// Time in miliseconds
const oneDay = 86400000;
const oneHour = 3600000;

// Default parameters & element selectors
const defaultParam = {
  version: "9",
  theme: "lightTheme",
  themeBgColor: "",
  themeBgImgUrl: "",
  themeBgImgPos: "",
  navOpen: true,
  density: "lowDensity",
  debug: false,
  firstTimeWelcome: true,

  readingPane: false,
  readingPaneWidth: "var(--content-width)",
  readingPaneType: "unknown", // unknown | nPane | vPane | hPane

  textButtons: null,
  chat: null, // left_roster, right_roster, off
  rhsChat: null,
  addOnsOpen: null,
  otherExtensions: null,
};

// SASS variables and selectors
// TODO: Maybe break this out into something I auto-generate when
//       building the extension. Maybe declarations.js > sass.js which
//       has sass.variables and
const sel = {
  // Bars selectors
  accountButton: "a[href*='SignOutOptions']",
  accountWrapper: ".gsuiteLogoWrapper", //"div[href*='SignOutOptions']",
  backButton: ".gb_zc.gb_Cc.gb_Fa",
  bar: ".G-atb",
  btnRefresh: "div[aria-label='Refresh'], .nu, div[act='20']",
  gsuiteLogo: "header img[src*='cpanel'], header img[src*='admin.google']",
  listActions: ".aqK",
  listPage: ".aqJ",
  listBg: ".bkK > .nH",
  searchInput: "#gb input[name='q']",
  searchFocused: ".gb_af", // TODO This changes often; build listner for search focused
  topLeftButtons: ".gb_2c.gb_9c.gb_ad",
  menuButton: ".gb_Bc, div[aria-label='Main menu']",
  msgActions: ".iH",
  msgPage: ".adF",
  oneGoogleRing: ".gb_3a svg", // TODO This changes often
  pagination: ".ar5",
  paginationCount: ".amH",
  paginationButtons: ".Di",
  currentPage: "div[gh='tm'] .Dj .ts",
  settingsGear: ".FI",
  supportButton: ".zo",
  readingPaneToggle: ".readingPaneToggle", // ".apF, .apG",
  inputTools: ".aBS",
  offline: ".bvE, .bvI, .bvD",
  appSwitcher: "#gbwa",
  chatStatus: ".Yb",

  // Other Extensions (oe) menu bar icons
  oeMixMax: ".mixmax-appbar",
  oeBoomerang: "#b4g_manage",
  oeStreak: ".streak__topNav",
  oeSortd: ".openSortdIcon",
  oeGmass: "#gmassbutton",
  oeMailtrack: "#mailtrack-menu-opener",
  oeFlowcrypt: "#flowcrypt_new_message_button",
  oeCopper: ".pw-shadow-host-widget:not(.main-ember-application)",
  oeHubspot: ".app-level-toolbar-icon",
  oeYesware: ".yw-launchpad-container",
  oeSalesforce: "#sfdc-mailapp-container",
  oeDrag: "header .inboxsdk__button_iconImg[src$='Drag-icon.svg']",
  oeInboxWhenReady: "#iwr_wrap_action_buttons",
  oeActiveInbox: ".gtdi-appdropdown",
  oeChq: ".inboxsdk__appButton[title*='cloudHQ']",
  oeChqPause: ".cloudhq-pause-inbox-button",
  oeChqTracker: ".inboxsdk__appButton[title='cloudHQ Email Tracker']",
  oeChqTabs: "#cloudHQ__label_tabs_wrapper",
  oeChqResize: "#cloudHQ_gmail_resize_pane_1", // Also on for ChqSort :/
  oeChqSort: ".chq_gmail_smart_labels_nav_item",
  oeRightInbox: "img.ri-icon[src*='rightinbox.com']",
  oeDarkReader: "style.darkreader",
  oeBananaTag: ".inboxsdk__button_icon.bt-top-menu",
  oeHippoVideo: ".hippo-top-menu-container",
  oeNightEye: "html[nighteye='active']",
  oeNightEyeGmail: "html[negml='active']",

  // List view selectors
  listTop: ".BltHke",
  listTopActive: ".BltHke[role='main']",
  list: ".ae4",
  listInner: ".Cp",
  tabs: ".aKh",
  tab: ".aAy",
  oneBox: ".bX",
  selectAll: ".ya",
  newBadge: ".aDG",
  searchChips: ".G6",
  listSectionHeader: ".Wg.aAr",
  msg: ".zA",
  msgRead: ".yO",
  msgActive: ".aps",
  msgSelected: ".x7",
  msgSnippet: ".y2",
  msgSnoozed: ".cL",
  msgAttachment: ".yf",
  msgAdLabel: ".a3x",
  msgAdAria: "img[aria-label='Why this ad?']",
  checkbox: ".xY",
  threadCheckbox: ".xY div[role='checkbox']",
  selectedThreads:
    "div[role='main'] .ae4:not([style*='none']) .Cp tr.zA:not(.advert) div[role='checkbox'][aria-checked='true']",
  focusedThread:
    "div[role='main'] .ae4:not([style*='none']) .Cp tr.btb:not(.aps):not(.advert)",

  allLists: "div[role='main'] .ae4 .Cp",
  currentList: "div[role='main'] .ae4:not([style*='none']) .Cp",
  scanAllEmails:
    "div[gh='tl'] .ae4:not([style*='none']) .Cp .zA:not(.advert), div.ae4[gh='tl'] .Cp .zA:not(.advert)",
  scanNotGroupedEmails:
    "div[gh='tl'] .ae4:not([style*='none']) .Cp .zA:not([date]), div.ae4[gh='tl'] .Cp .zA:not([date])",
  currentListToGroup:
    "div[gh='tl'] .ae4:not([style*='none']) .Cp tbody:not(:empty), div.ae4[gh='tl'] .Cp tbody:not(:empty)",
  scanListsUnobserved:
    "div[gh='tl'] .ae4 .Cp:not(.SOFC), div.ae4[gh='tl'] .Cp:not(.SOFC)",

  rPaneMsgSelectdBanner: "div[role='main'] .Bs .apb, div[role='main'] .Bs .apf",

  // Menus
  menuSnooze: "div.brx[role='menu']",
  menuLabel: "div.aX1[role='menu']:not([style*='display: none'])",
  menuMoveTo: "div.aX2[role='menu']:not([style*='display: none'])",
  menuMore: ".J-M.aX0",

  // Main selectors
  footer: ".aeG, .pfiaof",
  themeBg: ".wl",
  themeBgImg: ".a4t",
  themeBgImgAlt: ".a4t img",

  // Nav selectors
  nav: ".aeN",
  navMail: ".aqn.aIH",
  navItems: ".wT",
  navItemsScrolled: ".ajj", // This is above .wT but inside .aeN
  navClosed: ".bhZ",
  inboxLink: ".aeN .aim a[href*='#inbox']",
  unreadCount: ".bsU",
  composeHover: ".bym",
  composeButton: ".z0",
  composeInner: ".L3",
  chatAndMeet: ".akc",
  chatSection: ".aND",
  chatRoster: "div[gh='c']",
  chatNew: ".Xa.wT",

  // Conversation view selectors
  conversation: ".Bs",
  messages: "div[role='list']",
  message: ".gs",
  msgCollapsed: ".gs.gt",
  msgHeader: ".gE",
  msgSnippet: ".g6",
  msgBody: ".a3s",
  composeBody: ".Am",

  // Composer selectors
  composeMolesTop: ".dw",
  composeMoles: ".dw .no",
  composeMinimize: ".Hm .Hk, .Hm .Hl, .Hm img[alt='Minimize']",
  composeMolePopout: ".Hm .Hq, .Hm img[alt='Pop-out']",
  composeMoleOpen: ".dw .Hl, .dw img[aria-label='Minimize']",
  composePopoutTop: ".aSs",
  composePopout: ".aSt",
  composeInlineReply: "div[role='list'] .ip",

  // Add ons selectors
  addOnsLauncher: ".bAw",
  addOnsToggle: ".brC-dA-I-Jw",
  addOnsPane: ".bq9",
};



// Copyright (C) Michael Leggett, Made Simple LLC - All Rights Reserved
// Proprietary and confidential; Unauthorized copying or redistribution of this file,
// via any medium is strictly prohibited; Written by Michael Leggett (hi@simpl.fyi)

// ==========================================================================
// DATES - For parsing international dates

// prettier-ignore
const monthNamesAll = {
  cs: ["leden","únor","březen","duben","květen","červen","červenec","srpen","září","říjen","listopad","prosinec"],
  el: ["Ιαν","Φεβ","Μαρ","Απρ","Μαΐ","Ιουν","Ιουλ","Αυγ","Σεπ","Οκτ","Νοε","Δεκ"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  "en-GB": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  es: ["ene","feb","mar","abr","may","jun","jul","ago","sept","oct","nov","dic"],
  "es-419": ["ene","feb","mar","abr","may","jun","jul","ago","sept","oct","nov","dic"],
  // "es-419": ["ene.","feb.","mar.","abr.","may.","jun.","jul.","ago.","sept.","oct.","nov.","dic."],
  da: ["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec"],
  de: ["Jan.","Feb.","März","Apr.","Mai","Juni","Juli","Aug.","Sept.","Okt.","Nov.","Dez."],
  fi: ["tammik","helmik","maalisk","huhtik","toukok","kesäk","heinäk","elok","syysk","lokak","marrask","jouluk"],
  fr: ["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."],
  "fr-CA": ["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."],
  hu: ["jan","febr","márc","ápr","máj","jún","júl","aug","szept","okt","nov","dec"],
  id: ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"],
  it: ["gen","feb","mar","apr","mag","giu","lug","ago","set","ott","nov","dic"],
  ja: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
  ko: ["일월","이월","삼월","사월","오월","유월","칠월","팔월","구월","시월","십일월","십이월"],
  nl: ["jan.","feb.","mrt.","apr.","mei","jun.","jul.","aug.","sep.","okt.","nov.","dec."],
  no: ["jan","feb","mar","apr","mai","jun","jul","aug","sep","okt","nov","des"],
  pl: ["sty","lut","mar","kwi","maj","cze","lip","sie","wrz","paź","lis","gru"],
  sv: ["jan.","feb.","mars","apr.","maj","juni","juli","aug.","sep.","okt.","nov.","dec."],
  "pt-BR": ["jan.","fev.","mar.","abr.","mai.","jun.","jul.","ago.","set.","out.","nov.","dez."],
  "pt-PT": ["jan.","fev.","mar.","abr.","mai.","jun.","jul.","ago.","set.","out.","nov.","dez."],
  ru: ["янв.","февр.","мар.","апр.","мая","июн.","июл.","авг.","сент.","окт.","нояб.","дек."],
  tr: ["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"],
  uk: ["січ.","лют.","бер.","квіт.","трав.","черв.","лип.","серп.","вер.","жовт.","лист.","груд."],
  "zh-CN": ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
  "zh-HK": ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
  "zh-TW": ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
};

// Initialize months to be for the current interface language
const monthNames = monthNamesAll[lang];

// Dates functionality
const dates = {
  now: null,
  today: null,
  day: null,
  month: null,
  year: null,
  yesterday: null,
  lastMon: null,
  prevMonth: [],

  isStale() {
    return new Date().getDate() !== this.day;
  },

  update() {
    if (dates.isStale()) {
      this.now = new Date();
      this.day = this.now.getDate();
      this.month = this.now.getMonth();
      this.year = this.now.getFullYear();
      this.today = new Date(this.year, this.month, this.day);
      this.yesterday = new Date(this.today - 86400000);
      this.lastMon = new Date(this.today);
      this.lastMon.setDate(this.lastMon.getDate() - ((this.lastMon.getDay() + 6) % 7));
      this.prevMonth[0] = new Date(this.year, this.month, 1);
      this.prevMonth[1] = new Date(this.year, this.month - 1, 1);
      this.prevMonth[2] = new Date(this.year, this.month - 2, 1);
      this.prevMonth[3] = new Date(this.year, this.month - 3, 1);
      return true;
    } else {
      return false;
    }
  },

  parse(dateStr, lang = "en") {
    if (!dateStr) {
      error("dates.parse with empty string", dateStr);
      return false;
    }

    // Replace narrow non-breaking space with normal space
    const dateString = dateStr.replace(/\u{202F}/gu, " ");

    let DD,
      MM,
      YYYY,
      monthStr = null;

    switch (lang) {
      case "en":
      case "en-GB":
        return new Date(dateString);

      case "cs":
        [, DD, MM, YYYY] = dateString.replace(/\./g, "").split(" ", 4);
        break;

      case "da":
      case "fi":
        [, DD, monthStr, YYYY] = dateString.replace(/\./g, "").split(" ", 4);
        break;

      case "fr":
      case "fr-CA":
      case "id":
      case "nl":
      case "ru":
      case "sv":
        [, DD, monthStr, YYYY] = dateString.split(" ", 4);
        break;

      case "es-419":
      case "es":
        [, DD, monthStr, YYYY] = dateString.split(",")[1].split(" ", 4);
        report("Parsed the date", monthStr, DD, YYYY);
        break;

      case "el":
      case "it":
        [, DD, monthStr, YYYY] = dateString.split(",")[0].split(" ", 4);
        break;

      case "hu":
        [YYYY, monthStr, DD] = dateString.split(".,")[0].split(". ");
        break;

      case "de":
      case "pl":
      case "uk":
        [DD, monthStr, YYYY] = dateString.split(", ", 2)[1].split(" ");
        break;

      case "no":
        [, DD, monthStr, YYYY] = dateString.split(", ")[0].split(". ");
        break;

      case "pt-BR":
        [, DD, , monthStr, , YYYY] = dateString.split(" ");
        break;

      case "pt-PT":
        [DD, MM, YYYY] = dateString.split(", ")[1].split("/");
        break;

      case "tr":
        [DD, monthStr, YYYY] = dateString.split(" ", 3);
        break;

      case "ja":
      case "zh-CN":
      case "zh-HK":
      case "zh-TW":
        [YYYY, MM, DD] = dateString.split(/\D/g, 3);
        break;

      case "ko":
        [YYYY, , MM, , DD] = dateString.split(/\D/g, 5);
        break;
    }

    // Extract the month number if the month is a string
    if (monthStr !== null) {
      MM = monthNames.indexOf(monthStr) + 1;
    }

    // Return date with 1am time
    return new Date(YYYY, MM - 1, DD, "1");
  },
};

// Initialize dates
dates.update();



// Copyright (C) Michael Leggett, Made Simple LLC - All Rights Reserved
// Proprietary and confidential; Unauthorized copying or redistribution of this file,
// via any medium is strictly prohibited; Written by Michael Leggett (hi@simpl.fyi)

// ==========================================================================
// UTILITIES

// Toggles custom style and returns latest state
async function toggleSimplify(forceOnOff) {
  //CRACKX
  forceOnOff="on";
  if (forceOnOff === undefined || forceOnOff === "showAlert") {
    is.simplifyOn = el.html.classList.toggle("simplify");
  } else if (forceOnOff === "on") {
    is.simplifyOn = true;
    el.html.classList.add("simplify");
  } else if (forceOnOff === "off") {
    is.simplifyOn = false;
    el.html.classList.remove("simplify");
  }

  chrome.runtime.sendMessage({
    action: "toggle_simplify",
    isOn: is.simplifyOn,
  });

  // Reset a few things if Simplify was just re-enabled?
  if (is.simplifyOn && is.readingPane) {
    readingPane.detectSize();
  }

  // Make sure the subscription is active
  // TODO: Should/could I cache this in localstorage and only check on load?
  // I should only check if the subscription is expired
  if (is.simplifyOn) {
    // Reset favicon
    chrome.storage.local.get({ favicon: null }, (results) => {
      applyPreferences({ favicon: results.favicon });
    });

    // Turn Simplify back off if the subscription isn't valid
    await subscription.check(-1).then((subscriptionActive) => {
      if (!subscriptionActive) {
        toggleSimplify("off");

        if (forceOnOff === "showAlert") {
          alerts.show(
            {
              title: "Your Simplify Gmail trial has ended.",
              body: "Sign up or add this email address to an active plan reactivate Simplify.",
            },
            "Learn more & sign up"
          );
        }
      }
    });
  } else if (is.okToSimplify) {
    // Reset the favicon
    applyPreferences({ favicon: false });
  }
}

// Activate page action button
chrome.runtime.sendMessage({ action: "activate_page_action" });

// Make and return element(s) for appending to the DOM
const make = (selector, ...args) => {
  const attrs =
    typeof args[0] === "object" && !(args[0] instanceof HTMLElement)
      ? args.shift()
      : {};

  let classes = selector.split(".");
  if (classes.length > 0) selector = classes.shift();
  if (classes.length) attrs.className = classes.join(" ");

  let id = selector.split("#");
  if (id.length > 0) selector = id.shift();
  if (id.length) attrs.id = id[0];

  const node = document.createElement(selector.length > 0 ? selector : "div");
  for (let prop in attrs) {
    if (attrs.hasOwnProperty(prop) && attrs[prop] != undefined) {
      if (prop.indexOf("data-") == 0) {
        let dataProp = prop.substring(5).replace(/-([a-z])/g, function (g) {
          return g[1].toUpperCase();
        });
        node.dataset[dataProp] = attrs[prop];
      } else {
        node[prop] = attrs[prop];
      }
    }
  }

  const append = (child) => {
    if (Array.isArray(child)) return child.forEach(append);
    if (typeof child == "string") child = document.createTextNode(child);
    if (child) node.appendChild(child);
  };
  args.forEach(append);
  return node;
};

// Check if focus is in input or text area
const notEditing = () => {
  return (
    !document.activeElement.isContentEditable &&
    document.activeElement.tagName !== "INPUT" &&
    document.activeElement.tagName !== "TEXTAREA" &&
    (document.activeElement.tagName !== "IFRAME" ||
      (document.activeElement.tagName === "IFRAME" &&
        !document.activeElement.src?.includes("chat.google.com")))
  );
};

// Shorthand for getting first matching element; returns Node
const get = (selector, parent = "") => {
  if (parent === "") {
    return document.querySelector(selector);
  } else if (parent instanceof Node) {
    return parent.querySelector(selector);
  } else {
    error("get() called with parent that wasn't node.", selector, parent);
    return false;
  }
};

// Shorthand for getting elements; returns NodeList
const gets = (selector, parent = "") => {
  if (parent === "") {
    return document.querySelectorAll(selector);
  } else if (parent instanceof Node) {
    return parent.querySelectorAll(selector);
  } else {
    error("gets() called with parent that wasn't node.", selector, parent);
    return false;
  }
};

// Shorthand for getting number of elements given a provided selector
const count = (selector, parent = "") => {
  if (parent === "") {
    return document.querySelectorAll(selector).length;
  } else if (parent instanceof Node) {
    return parent.querySelectorAll(selector).length;
  } else {
    error("count() called with parent that wasn't node.", selector, parent);
    return false;
  }
};

// Shorthand for seeing if an element exists
const exists = (selector, parent = "") => {
  if (parent === "") {
    // return document.querySelectorAll(selector).length > 0;
    return (
      document.body?.contains(document.querySelector(selector)) ||
      document.querySelector(selector) !== null
    );
  } else if (parent instanceof Node) {
    return (
      document.body?.contains(parent.querySelector(selector)) ||
      parent.querySelector(selector) !== null
    );
  } else if (typeof parent === "string") {
    return (
      document.body?.contains(
        document.querySelector(`${parent} ${selector}`)
      ) || document.querySelector(`${parent} ${selector}`) !== null
    );
  } else {
    error("exists() called with undefined parent.", selector, parent);
    return null;
  }
};

// Get the computed style of an element
const getStyle = (elem, property) => {
  try {
    let computedStyle;
    if (elem instanceof Node) {
      computedStyle = getComputedStyle(elem).getPropertyValue(property);
    } else if (el[elem] instanceof Node) {
      computedStyle = getComputedStyle(el[elem]).getPropertyValue(property);
    } else if (sel[elem]) {
      computedStyle = getComputedStyle(get(sel[elem])).getPropertyValue(
        property
      );
    } else {
      computedStyle = getComputedStyle(get(elem)).getPropertyValue(property);
    }
    return computedStyle;
  } catch (error) {
    return false;
  }
};

// Convert RGB string to Hex
const componentToHex = (c) => {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};
const rgbToHex = (rgb) => {
  const [, r, g, b] = rgb
    .match(/(\d{1,3}), ?(\d{1,3}), ?(\d{1,3})/)
    .map((x) => componentToHex(parseInt(x)));
  return `#${r}${g}${b}`;
};

// Find element based on selector, traversing parentELements, and any extra selectors
const findElement = (elemName) => {
  let elem = get(trickyElements[elemName].selector);
  let parentLevel = trickyElements[elemName].parent || 0;
  let suffix = trickyElements[elemName].suffix || "";

  if (elem) {
    while (parentLevel > 0) {
      elem = elem.parentElement;
      parentLevel -= 1;
    }
    if (suffix) {
      elem = elem.querySelector(suffix);
    }
    elem.classList.add(elemName);
    return elem;
  } else {
    return false;
  }
};

// Shorthand for getting element based on structure in localStorage
const getEl = (elemName) => {
  if (el[elemName] instanceof Node) {
    return el[elemName];
  }

  let elem = findElement(elemName);
  if (elem) {
    el[elemName] = elem;
    return elem;
  } else {
    report("getEl() unable to find element", elemName);
    return false;
  }
};

const getButton = (action) => {
  switch (action) {
    case "y":
    case "e":
    case "archive":
      return get('div[gh="tm"] div[act="7"], div[gh="tm"] div[act="13"]');
    case "E":
      return get('div[act="8"]');
    case "!":
    case "isSpam":
      return get('div[gh="tm"] div[act="9"]');
    case "#":
    case "Backspace":
    case "Delete":
    case "delete":
      return get('div[gh="tm"] div[act="10"]');
    case "I":
    case "read":
      return get('div[gh="tm"] div[act="1"]');
    case "U":
    case "unread":
      return get('div[gh="tm"] div[act="2"]');
    case "b":
    case "snooze":
      return get('div[gh="tm"] div[act="290"]');
    case "T":
    case "task":
      return get('div[gh="tm"] div[act="95"]');
    case "v":
    case "move":
      return get('div[gh="tm"] div.ns[role="button"]');
    case "l":
    case "label":
      return get('div[gh="tm"] div.mw[role="button"]');
    default:
      error("getButton() unable to find button for", action);
      return false;
  }
};

// Return true if element has class (string)
const hasClass = (className, element = el.html) => {
  return element.classList.contains(className);
};

// Return true if element has any class (array)
const hasAnyClass = (classNames, element = el.html) => {
  return classNames.some((className) => element.classList.contains(className));
};

const onScreen = (el) => {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Add an ID to an element
const addId = (elemName, id = "") => {
  const elem = findElement(elemName);
  if (elem) {
    elem.id = id === "" ? elemName : id;
  } else {
    error("addId(): Could not find element", elemName);
  }
};

// Test if something is of a type
function isString(string) {
  return Object.prototype.toString.call(string) === "[object String]";
}
function isElement(element) {
  return element instanceof Element || element instanceof HTMLDocument;
}

// Hash String
const hashString = (str) => {
  let string = str.toLowerCase();

  // Strip out periods from username if an email
  if (string.indexOf("@") > -1) {
    string = string.split("@");
    string = string[0].replace(/\./g, "") + "@" + string[1];
  }

  // Hash the string
  let hash = 0,
    i = 0,
    len = string.length;
  while (i < len) {
    hash = ((hash << 5) - hash + string.charCodeAt(i++)) << 0;
  }

  // Add biggest number to make it possitive
  return hash + 2147483647 + 1;
};

// Wait function to delay execution of something
const waitFor = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Simulate clicking on an element
const clickOn = (elem, clickType = "click", withShift = false) => {
  if (!elem) {
    report("clickOn failed - element not found.");
    return false;
  }

  const dispatchMouseEvent = (target, type) => {
    const event = new MouseEvent(type, {
      view: window,
      bubbles: true,
      cancelable: true,
      shiftKey: withShift,
    });
    if (type === "click") {
      check.click = false;
      setTimeout(() => {
        check.click = true;
      }, tryIn);
    }
    target.dispatchEvent(event);
  };

  if (clickType === "dblclick") {
    select.ignore = true;
    dispatchMouseEvent(elem, "mouseover");
    dispatchMouseEvent(elem, "mousedown");
    dispatchMouseEvent(elem, "mouseup");
    dispatchMouseEvent(elem, "click");
    dispatchMouseEvent(elem, "mousedown");
    dispatchMouseEvent(elem, "mouseup");
    dispatchMouseEvent(elem, "click");
    dispatchMouseEvent(elem, "mouseout");
    select.ignore = false;
  } else {
    dispatchMouseEvent(elem, "mouseover");
    dispatchMouseEvent(elem, "mousedown");
    dispatchMouseEvent(elem, "mouseup");
    dispatchMouseEvent(elem, clickType);
    dispatchMouseEvent(elem, "mouseout");
  }

  report("Clicked on", elem);
  return true;
};

// Click on an element when I find it
const clickOnWhenReady = async (
  selector,
  clickType = "click",
  withShift = false,
  tries = 0
) => {
  const elem = get(selector);
  if (elem) {
    return clickOn(elem, clickType, withShift);
  } else if (tries < 50) {
    await waitFor(100);
    clickOnWhenReady(selector, clickType, withShift, tries + 1);
  } else {
    error("Never found the element to click on", selector);
    return false;
  }
};

const clickOnDelay = async (
  selector,
  delay = 250,
  clickType = "click",
  withShift = false
) => {
  await waitFor(delay);
  report("Click on how many", count(selector));
  return clickOnWhenReady(selector, clickType, withShift);
};

// Simulate clicking on a button when it is active
// This is a hot mess right now...
const clickOnWhenActive = async (
  elem,
  clickType = "click",
  withShift = false
) => {
  const isActive = (button) => {
    return (
      getComputedStyle(button.closest('[role="menu"]')).display !== "none"
      // getComputedStyle(button.parentNode).display !== "none" &&
      // button.getAttribute("aria-disabled") !== "true"
    );
  };

  const buttonIsActive = new Promise((resolve, reject) => {
    const observer = new MutationObserver((mutation, observer) => {
      if (isActive(elem)) {
        report("Menu is active", elem);
        observer.disconnect();
        resolve();
      }
    });
    observer.observe(elem.closest('[role="menu"]'), {
      // elem.parentNode
      attributes: true,
      childList: false,
      subtree: true,
    });
  });

  buttonIsActive.then(() => {
    clickOn(elem, clickType, withShift);
  });
};

const requestPermissions = (permissions) => {
  switch (permissions) {
    case "fetch":
    default:
      chrome.runtime.sendMessage({ action: "request_fetch_permissions" });
      break;
  }
};

// Handle messages from background script that
// supports page action to toggle Simplify on/off
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // Toggle Simplify on / off
  if (message.action === "toggle_simplify") {
    const isNowToggled = toggleSimplify();
    sendResponse({ toggled: isNowToggled });
    report("util.js", sender.id);
  }

  // Tracker was blocked by tracker.js
  // TODO: Use sass variables for .G2
  else if (message.action === "tracker_blocked") {
    // Hide trackers in the DOM
    let msgTrackers = gets(`*[src*='${message.url}']`);
    msgTrackers.forEach((tracker) => {
      tracker.classList.add("emailTracker");
      tracker.closest(".G2").classList.add("hasTracker");
    });

    // Remove flag if all trackers are in quoted text of message
    gets(".G2.hasTracker").forEach((message) => {
      if (
        count(".emailTracker", message) ===
        count(".gmail_quote .emailTracker", message)
      ) {
        message.classList.remove("hasTracker");
      }
    });

    // Init tracker badget again in case message was expanded adding new star
    conversation.initTrackerBadge();
    report("Simplify blocked a tracker", message, msgTrackers);
  }

  // Handle call to show details from popup menu
  // else if (message.action === "show_details") {
  //   showSimplifyDetails();
  // }

  // Return details
  else if (message.action === "report_issue") {
    reportIssue(true);
  }

  // Handle call to disable Simplify from popup menu
  else if (message.action === "disable_simplify") {
    toggleSimplify("showAlert");
  }

  // Handle call to disable Simplify from popup menu
  else if (message.action === "is_tab_pinned") {
    is.tabPinned = message.isTabPinned;
  }

  // Handle response from checking permissions
  else if (message.action === "ask_for_notifications_permissions") {
    alerts.show(
      {
        title:
          "Additional permissions required to temporarily disable notifications",
        body: "Clicking below will show a dialog with more information. Simplify will only read or change the notifications setting.\n\nDisabling notifications temporarily will disable them for all open accounts.",
      },
      "Continue..."
    );
  }

  // Handle response that permissions were not granted
  else if (message.action === "permission_not_granted") {
    if (message.permission === "notifications") {
      get("#disableNotifs").classList.remove("on");
      chrome.storage.local.set({ disableNotifs: false });
    }
  }

  // Something else (not expected)
  else {
    report(message);
  }
});

// Initialize is.tabPinned
chrome.runtime?.sendMessage({ action: "is_tab_pinned" });

// Show report issue dialog
const reportIssue = (instant = false) => {
  let msg = {
    title: "Simplify v." + chrome.runtime.getManifest().version,
    body: "",
  };
  if (instant) {
    alerts.show(msg, "Report issue instant", "off", 0.5);
  } else {
    alerts.show(msg, "Report issue");
  }
};

// Get system report
const getSimplifyDetails = () => {
  let config =
    `Simplify v.${chrome.runtime?.getManifest().version}` +
    ` - Configuration: ${el.html.classList.value.split(" ").sort().join(" ")}` +
    ` - System: ${navigator.userAgent} - Window: ` +
    `${window.outerWidth} x ${window.outerHeight} (` +
    `${Math.round((window.outerWidth / window.innerWidth) * 100)}` +
    `pct zoom) - Language: ${lang}`;

  return config.replace(/;/g, "");
};

// Show Simplify Welcome
const showSimplifyWelcome = () => {
  if (document.body) {
    // Build out of box experience
    // prettier-ignore
    let welcomeDialog = make("div", { id: "welcomeToSimplify", className: "wtsS1" },
      make("div", { className: "wtsContent screen1" }, 
        make("div", { className: "simplifyLogo" }),
        make("p", { className: "wtsTitle" }, "The new Simplify \u2014 making Gmail even more simple, capable, and respectful"),
        make("button", { className: "startTrial" }, "TRY IT NOW FOR FREE"),
        make("p", { className: "wtsDisclaimer" }, "1-month trial - No commitment – No credit card"),
        make("p", { className: "wtsUninstall" }, "As low as $2/mo after. More details...")
      ),
      make("div", { className: "wtsContent screen2" }, 
        make("div", { className: "profileArrow" },
          make("p", { }, "Settings, help, toggles, and add-ons under here"),
          make("button", { }, "Got it"),
        ),
      ),
      make("div", { className: "wtsContent screen3" }, 
        make("div", { className: "wtsKeyShortcuts" },
          make("p", { className: "wtsTitle" }, "Get around faster with keyboard shortcuts"),
          make("div", { className: "wtsKeys" },
            make("div", { className: "wtsKey" }, "↑"),
            make("div", { className: "wtsLabel" }, "Previous message in list"),
            make("div", { className: "wtsKey" }, "↓"),
            make("div", { className: "wtsLabel" }, "Next message in list"),
            make("div", { className: "wtsKey" }, "⏎"),
            make("div", { className: "wtsLabel" }, "Open message"),
            make("div", { className: "wtsKey wtsEscKey" }, "ESC"),
            make("div", { className: "wtsLabel" }, "Return to inbox"),
            make("div", { className: "wtsKey" }, "?"),
            make("div", { className: "wtsLabel" }, "See all shortcuts")
          ),
          make("button", { }, "Vroom Vroom"),
        ),
      ),
      make("div", { className: "wtsContent screen4" }, 
        make("div", { className: "profileArrow" },
          make("p", { }, "Last thing \u2014 Click on the Simplify logo for options, pricing, and more"),
          make("p", { className: "wtsDisclaimer" }, "It might be hidden in your extensions menu"),
          make("button", { }, "Let's go!"),
        ),
      )
    );

    // Attach it to the body
    document.body.appendChild(welcomeDialog);

    // Progress through screens as you click
    let welcome = get("#welcomeToSimplify");
    welcome.addEventListener("click", (e) => {
      if (welcome.classList.contains("wtsS1")) {
        welcome.classList.remove("wtsS1");
        welcome.classList.add("wtsS2");
      } else if (welcome.classList.contains("wtsS2")) {
        welcome.classList.remove("wtsS2");
        welcome.classList.add("wtsS3");
      } else if (welcome.classList.contains("wtsS3")) {
        welcome.classList.remove("wtsS3");
        welcome.classList.add("wtsS4");
      } else {
        welcome.classList.remove("wtsShow");
        local.update("firstTimeWelcome", false);
      }
    });

    // Open link to pricing article if you click to read more
    get("#welcomeToSimplify .wtsUninstall").addEventListener("click", (e) => {
      // chrome.runtime.sendMessage({ action: "manage_extensions" });
      // welcome.classList.remove("wtsShow");
      window.open("https://simpl.fyi/plans?from=gmail");
      e.stopPropagation();
    });
  } else {
    setTimeout(showSimplifyWelcome, 500);
  }
};



// Copyright (C) Michael Leggett, Made Simple LLC - All Rights Reserved
// Proprietary and confidential; Unauthorized copying or redistribution of this file,
// via any medium is strictly prohibited; Written by Michael Leggett (hi@simpl.fyi)

// ==========================================================================
// SIMPLIFY SUBSCRIPTION

const subscription = {
  //CRACKX
  email: "johndoe@gmail.com",
  expires: null,
  trial: null,
  lastCheck: null,

  verifyEmail(email) {
    //CRACKX
    return true;
    if (preferences.debug) {
      // I'm worried this is fragile
      const pos = get("body > input + script[nonce]")?.innerText.indexOf(email);
      const isValid = pos > 250 && pos < 500;
      report("Email valid?", isValid);
      return isValid;
    } else {
      // This just checks if it is a valid email address
      return regex.email.test(email);
    }
  },

  badge(trialExpires, tries = 0, subExpired = false) {
    if (tries > 20) return;

    // Exit function if we checked within the last hour
    if (
      trialExpires === undefined &&
      Date.now() < parseInt(subscription.lastCheck) + oneHour
    ) {
      return;
    }

    // Update lastChecked
    subscription.lastCheck = Date.now();

    // Wait and try again if Simplify button hasn't been added
    if (!get("#simplifyButton")) {
      setTimeout(() => {
        subscription.badge(trialExpires, tries + 1, subExpired);
      }, retryIn);
      return;
    }

    // Calculate time left in trial
    const expires = trialExpires || subscription.trial;
    const timeLeft = expires - Date.now();
    let daysLeft = Math.ceil(timeLeft / oneDay);
    let hoursLeft = Math.ceil(timeLeft / oneHour);
    let showAlert;

    if (daysLeft >= 14 && is.safari) return;

    // What alert do we show on load (if any)?
    if (timeLeft < 0) {
      // TODO (maybe): Add 1 week grace period where you can temporarily turn it back on?
      // const gracePeriod = 7 * oneDay;
      // if (subscription.trial < Date.now() + gracePeriod) {
      //   const alertMsg = {
      //     title: "Your Simplify Gmail trial has ended.",
      //     body: "Click to learn more about the subscription and sign up.",
      //   };
      //   alerts.show(alertMsg, "Learn more & sign up", "TrialEnded", 0);
      //   // Simplify trial has expired. You can turn it back on temporarily for one more week to compare Gmail with Simplify on/off
      //   toggleSimplify("off");
      //   subscription.badge(subscription.trial);
      //   return true;
      // } else {
      //   toggleSimplify("off");
      //   subscription.badge(subscription.trial);
      //   return false;
      // }

      get("#simplifyMenu").dataset.trial = "0";
      get("#daysLeft").innerText = subExpired
        ? "Your plan has expired."
        : "Your trial has expired.";

      // We're done checking the trial every hour
      check.trial = false;

      // Exit function, nothing more to do if trial or subscription is expired
      return;
    } else if (daysLeft <= 7) {
      showAlert = "daysLeft";
    } else if (daysLeft > 10) {
      showAlert = "firstLaunch";
    }

    report(`Trial expires on ${new Date(expires)}`);

    // Do we promote the Simplify menu?
    if (daysLeft <= 5) {
      el.html.classList.add("importantBadge");
    }

    // Plain english for days/hours left
    daysLeft = daysLeft <= 1 ? `${daysLeft} day` : `${daysLeft} days`;
    if (hoursLeft <= 1) {
      daysLeft = `${hoursLeft} hour`;
    } else if (hoursLeft <= 24) {
      daysLeft = `${hoursLeft} hrs`;
    }

    get("#simplifyButton").dataset.trial = daysLeft;
    get("#simplifyMenu").dataset.trial = daysLeft;
    get("#daysLeft").innerText = `Trial ends in ${daysLeft.replace(
      "hrs",
      "hours"
    )}`;

    // Show alert if Gmail was just reloaded (trialExpires is undefined when badge is run otherwise)
    if (trialExpires) {
      if (showAlert === "firstLaunch") {
        const alertMsg = {
          title: `Simplify trial ends in ${daysLeft}`,
          body: `Sign up before then to keep:\n💎 a premium experience\n🕷 blocking email spy trackers\n🔠 better keyboard shortcuts\n🌓 full dark mode\n🔥 and more...`,
        };
        alerts.show(alertMsg, "Learn more & sign up", "TrialStarted", 0);
      } else if (showAlert === "daysLeft") {
        const alertMsg = {
          title: `Reminder to sign up for Simplify; trial ends in ${daysLeft}`,
          body: `Sign up before then to keep:\n💎 a premium experience\n🕷 blocking email spy trackers\n🔠 better keyboard shortcuts\n🌓 full dark mode\n🔥 and more...`,
        };
        alerts.show(alertMsg, "Learn more & sign up", "TrialLeft", 0);
      }

      // Keep trial countdown on badge up to date by re-checking periodically
      // (called onHashChange, throttled to run no more than once an hour)
      //CRACKX
      check.trial = false;
      subscription.lastCheck = Date.now() - (oneHour - (timeLeft % oneHour));
      report(
        "Backdate trial check so it will check again right after there is one hour less left",
        subscription.lastCheck,
        expires
      );
    }
  },

  async check(tries = 0) {
    //CRACKX
    subscription.expires = new Date(Date.now() + 365 * 86400),
    return true;

    // Only try so many times to find and verify the email address
    if (tries > 20) {
      report("Never found the email address");
      return false;
    }

    report("Checking subscription...", subscription.email);

    // Get email address from the account button
    let emailValid = subscription.email ? true : false;

    // Check gmaccount
    if (!subscription.email && document.documentElement.dataset.gmaccount) {
      subscription.email = document.documentElement.dataset.gmaccount;
      emailValid = subscription.verifyEmail(subscription.email);

      // Clean up
      document.documentElement.removeAttribute("data-gmaccount");
      get("script#getUserId")?.remove();
    }

    // Backup way to check username: Get email address from the sign out button if the primary method failed
    if (tries > 19 && (!subscription.email || !emailValid)) {
      const accountString = get(
        "header a[aria-label*='Google'][aria-label*='@']"
      )?.getAttribute("aria-label");

      if (!accountString) {
        emailValid = false;
      } else {
        subscription.email = accountString.includes("(")
          ? accountString.split("(")[1].slice(0, -1)
          : accountString.split(": ")[1];

        emailValid = subscription.email
          ? subscription.verifyEmail(subscription.email)
          : false;
      }
    }

    if (emailValid) {
      // Update link to add account to existing subscription
      const addToSubLink = get("#trialCountDown a[href*='addEmail']");
      if (addToSubLink) {
        addToSubLink.href = `https://simpl.fyi/account?addEmail=${subscription.email}`;
      }

      // Validate the subscription
      const emailHash = hashString(subscription.email);
      const subscriptionCheck = `https://simpl.fyi/auth/subscription/${emailHash}`;

      // Check for active Simplify subscription
      // 200 = subscription found & active
      // 201 = trial registered
      // 202 = trial exists, not expired
      // 304 = cached 200 (not modified)
      // 426 = trial has expired
      // 417 = subscription has expired
      // 501 = email hash not provided or invalid
      // 500 = something else went wrong
      return fetch(subscriptionCheck, {
        mode: "cors",
        method: "GET",
      }).then(async (response) => {
        const responseBody = await response.json();
        switch (response.status) {
          case 200:
            report("Subscription is good!", responseBody);
            subscription.expires = parseInt(responseBody);
            return true;
          case 201:
            report("Trial started", responseBody);
            subscription.trial = parseInt(responseBody);
            if (tries >= 0) subscription.badge(subscription.trial);
            return true;
          case 202:
            report("Trial ongoing", responseBody);
            subscription.trial = parseInt(responseBody);
            if (tries >= 0) subscription.badge(subscription.trial);
            return true;
          case 304:
            // Cached response (should only cache 200), Double check the date
            subscription.expires = parseInt(responseBody);
            if (subscription.expires > Date.now()) {
              report("Subscription is good!", responseBody);
              return true;
            } else {
              report("Subscription expired.", responseBody);
              if (tries >= 0) {
                toggleSimplify("off");
                subscription.badge(parseInt(responseBody), 0, true);
              }
              return false;
            }
          case 417:
            report("Subscription expired.", responseBody);
            if (tries >= 0) {
              toggleSimplify("off");
              subscription.badge(parseInt(responseBody), 0, true);
            }
            return false;
          case 426:
            report("Trial expired.", responseBody);
            subscription.trial = parseInt(responseBody);
            if (tries >= 0) {
              toggleSimplify("off");
              subscription.badge(subscription.trial);
            }
            return false;
          case 500:
            report("Could not register trial.");
            if (tries >= 0) toggleSimplify("off");
            return false;
          case 501:
            report("Invalid email.", emailHash);
            if (tries >= 0) toggleSimplify("off");
            return false;
          case 502:
            error("Could not register trial from this domain.");
            if (tries >= 0) toggleSimplify("off");
            return false;
          default:
            error("Resposne status not found", response);
            return false;
        }
      });
    } else {
      report("Checking subscription too early", tries);
      if (tries >= 0) {
        setTimeout(() => {
          subscription.check(tries + 1);
        }, 200);
      }
    }
  },
};



// Copyright (C) Michael Leggett, Made Simple LLC - All Rights Reserved
// Proprietary and confidential; Unauthorized copying or redistribution of this file,
// via any medium is strictly prohibited; Written by Michael Leggett (hi@simpl.fyi)

// ==========================================================================
// LOCAL STORAGE

const local = {
  init() {
    if (!is.okToSimplify) {
      report("Do not initialize Simplify variables in this view");
      return;
    }

    if (localStorage.simplify) {
      simplify = JSON.parse(localStorage.simplify);
    }

    // Initialize paremeters for userNum if they don't exist
    if (typeof simplify[u] === "undefined") {
      simplify[u] = defaultParam;
      localStorage.simplify = JSON.stringify(simplify);
    }

    if (localStorage.doNotShow) {
      doNotShow = JSON.parse(localStorage.doNotShow);
    }

    // Reset the localStorage if it is an older version
    if (isNaN(parseFloat(simplify[u].version))) {
      local.reset(true);
    } else if (
      parseFloat(defaultParam.version) > parseFloat(simplify[u].version)
    ) {
      local.reset();
    }

    // Reset the localStorage.sass if it is an older version
    // if (isNaN(parseFloat(sel.version))) {
    //   local.resetSass();
    // } else if (
    //   parseFloat(sel.version) < parseFloat(defaultParam.sass.version)
    // ) {
    //   local.resetSass();
    // }

    if (simplify[u].debug) {
      // Point global variable to user
      // selectors = sel;

      // Initialize debug function if enabled in Simplify settings
      report = console.log.bind(window.console);
      error = console.error.bind(window.console);
    }

    report("Simplify cached variables loaded from localStorage");
  },

  // Write to local prefs and localStorage object
  update(key, value = "") {
    if (key === "doNotShow") {
      doNotShow[value] = true;
      localStorage.doNotShow = JSON.stringify(doNotShow);
    } else {
      if (value !== "") {
        let param = key.split(".");
        if (param[1]) {
          simplify[u][param[0]][param[1]] = value;
        } else {
          simplify[u][param[0]] = value;
        }
      }
      localStorage.simplify = JSON.stringify(simplify);
    }
  },

  // Reset local storage
  reset(totalReset = false) {
    if (totalReset) {
      console.log("Total reset of Simplify localStorage");
      localStorage.removeItem("simplify");
      simplify = {};
    } else {
      console.log("Partial reset of localStorage");
    }
    simplify[u] = defaultParam;
    localStorage.simplify = JSON.stringify(simplify);
  },

  // Reset sass variables in local storage
  // resetSass() {
  //   console.log("Reset Sass variables in Simplify localStorage");
  //   sel = defaultParam.sass;
  //   localStorage.simplify = JSON.stringify(simplify);
  // },
};

// Initialize localStorage and simplify global variable
local.init();



// Copyright (C) Michael Leggett, Made Simple LLC - All Rights Reserved
// Proprietary and confidential; Unauthorized copying or redistribution of this file,
// via any medium is strictly prohibited; Written by Michael Leggett (hi@simpl.fyi)

// ==========================================================================
// SIMPLIFY PREFERENCES

// Global variable for Simplify Preferences
let preferences = {};

// Apply setting
const applyPreferences = (prefs, calls = 0) => {
  Object.keys(prefs).forEach((key) => {
    preferences[key] = prefs[key];

    switch (key) {
      case "invertAddons":
        if (preferences.invertAddons) {
          el.html.classList.add("invertAddons");
        } else {
          el.html.classList.remove("invertAddons");
        }
        break;

      case "invertCompose":
        if (preferences.invertCompose) {
          el.html.classList.add("invertCompose");
        } else {
          el.html.classList.remove("invertCompose");
        }
        break;

      case "sendLater":
        if (preferences.sendLater) {
          el.html.classList.add("sendLater");
        } else {
          el.html.classList.remove("sendLater");
        }
        break;

      case "httpsLinks":
        if (!is.loading) compose.initFormattingCases();
        break;

      case "dateGroup":
        if (preferences.dateGroup) {
          el.html.classList.add("dateGroup");
          lists.scan();
        } else {
          el.html.classList.remove("dateGroup");
        }
        break;

      case "inboxZeroBg":
        report("Inbox zero background changed");
        el.html.classList.remove("izBgDefault", "izBg1", "izBg2", "izBg3", "izBg4", "izBg5", "izBgOff");

        if (preferences.inboxZeroBg === "default") {
          el.html.classList.add("izBgDefault");
        } else if (preferences.inboxZeroBg === "light-mountain") {
          el.html.classList.add("izBg1");
        } else if (preferences.inboxZeroBg === "dark-mountain") {
          el.html.classList.add("izBg2");
        } else if (preferences.inboxZeroBg === "aqua-beach") {
          el.html.classList.add("izBg3");
        } else if (preferences.inboxZeroBg === "cat") {
          el.html.classList.add("izBg4");
        } else if (preferences.inboxZeroBg === "dog") {
          el.html.classList.add("izBg5");
        } else if (preferences.inboxZeroBg === "none") {
          el.html.classList.add("izBgOff");
        }
        break;

      case "hideEmptySections":
        if (preferences.hideEmptySections) {
          el.html.classList.add("hideEmptySections");
        } else {
          el.html.classList.remove("hideEmptySections");
        }
        break;

      case "msgLabelsRight":
        if (preferences.msgLabelsRight) {
          el.html.classList.add("msgLabelsRight");
        } else {
          el.html.classList.remove("msgLabelsRight");
        }
        break;

      case "listWidth":
        report("List width preference applied");
        el.html.classList.remove("listWidthMd", "listWidthLg", "listWidthXLg", "listWidthXXLg", "listWidthFull");
        if (preferences.listWidth === "960") {
          el.html.classList.add("listWidthMd");
        } else if (preferences.listWidth === "1100") {
          el.html.classList.add("listWidthLg");
        } else if (preferences.listWidth === "1250") {
          el.html.classList.add("listWidthXLg");
        } else if (preferences.listWidth === "1400") {
          el.html.classList.add("listWidthXXLg");
        } else if (preferences.listWidth === "full") {
          el.html.classList.add("listWidthFull");
        }
        break;

      case "vPaneListWidth":
        el.html.classList.remove("vPane3line", "vPane1line");
        if (preferences.vPaneListWidth !== "auto") {
          report("vPane list width preference applied");
          el.html.classList.add(preferences.vPaneListWidth);
        }
        if (!is.loading) readingPane.detectSize();
        break;

      case "msgWidth":
        report("Message width preference applied");
        el.html.classList.remove(
          "msgWidthSm",
          "msgWidthMd",
          "msgWidthLg",
          "msgWidthXLg",
          "msgWidthXXLg",
          "msgWidthFull"
        );
        if (preferences.msgWidth === "850") {
          el.html.classList.add("msgWidthSm");
        } else if (preferences.msgWidth === "960") {
          el.html.classList.add("msgWidthMd");
        } else if (preferences.msgWidth === "1100") {
          el.html.classList.add("msgWidthLg");
        } else if (preferences.msgWidth === "1250") {
          el.html.classList.add("msgWidthXLg");
        } else if (preferences.msgWidth === "1400") {
          el.html.classList.add("msgWidthXXLg");
        } else if (preferences.msgWidth === "full") {
          el.html.classList.add("msgWidthFull");
        }
        break;

      case "invertMessages":
        if (is.msg || is.msgOpen) conversation.hasHtmlEmail();
        break;

      case "minimizeChat":
        if (preferences.minimizeChat) {
          el.html.classList.add("minimizeChat");
        } else {
          el.html.classList.remove("minimizeChat", "chatOpen");
        }
        break;

      case "showChat":
        if (preferences.showChat) {
          el.html.classList.add("showChat");
        } else {
          el.html.classList.remove("showChat");
        }
        break;

      case "hideInboxOnLoad":
        if (preferences.hideInboxOnLoad) {
          el.html.classList.add("hideInbox");
        }
        break;

      case "disableNotifs":
        if (is.loading) {
          if (preferences.hideInboxOnLoad && preferences.disableNotifs) {
            chrome.runtime.sendMessage({ action: "disable_notifications" });
          } else {
            chrome.runtime.sendMessage({ action: "enable_notifications" });
          }
        }
        break;

      case "hideSignatures":
        if (preferences.hideSignatures) {
          el.html.classList.add("hideSignatures");
        } else {
          el.html.classList.remove("hideSignatures");
        }
        break;

      case "hideUnreadCount":
        if (preferences.hideUnreadCount) {
          el.html.classList.add("hideUnreads");
        } else {
          el.html.classList.remove("hideUnreads");
        }
        break;

      case "hideMailTitle":
        if (preferences.hideMailTitle) {
          el.html.classList.add("hideMailTitle");
        } else {
          el.html.classList.remove("hideMailTitle");
        }
        break;

      case "modifyTitle":
        if (preferences.modifyTitle !== "disabled") {
          observers.title.start();
        } else if (!is.loading) {
          observers.title.disconnect();
          if (is.inbox) {
            // Refresh current view will restore the title
            let refreshButton = get('div[gh="tm"] div[act="20"]');
            if (refreshButton) {
              clickOn(refreshButton);
              document.activeElement.blur();
            }
          }
        }
        break;

      case "favicon":
        if (calls > 10) break;

        let favicon = "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico";
        if (preferences.favicon) {
          const faviconColors = {
            0: "red",
            1: "blue",
            2: "green",
            3: "purple",
            4: "aqua",
            5: "pink",
            6: "gray",
          };

          const colorIndex = is.delegate ? 6 : (parseInt(u) + parseInt(preferences.faviconSeedColor)) % 7;
          favicon = chrome.runtime.getURL(`img/icons/favicon-${faviconColors[colorIndex]}.png`);
        }
        let linkEl = get('link[rel="shortcut icon"]');
        if (linkEl) {
          linkEl.href = favicon;

          // Add PWA favicon if not already added
          if (!get("link[href$='favicon-pwa.png']")) {
            const faviconPWA = chrome.runtime.getURL("img/icons/favicon-pwa.png");
            const faviconMeta = make("link", {
              rel: "apple-touch-icon",
              sizes: "1024x1024",
              href: faviconPWA,
            });
            document.head.appendChild(faviconMeta);
          }
        } else {
          setTimeout(() => {
            applyPreferences({ favicon: preferences.favicon }, calls + 1);
          }, 1000);
        }
        break;

      case "addCategories":
        if (preferences.addCategories) {
          if (!is.loading) nav.addCategories();
        } else {
          gets(".aim[data-category]").forEach((category) => {
            category.remove();
          });
        }
        break;

      case "hideTabIcons":
        if (preferences.hideTabIcons) {
          el.html.classList.add("hideTabIcons");
        } else {
          el.html.classList.remove("hideTabIcons");
        }
        break;

      case "hideLabelChips":
        if (preferences.hideLabelChips) {
          el.html.classList.add("hideLabelChips");
        } else {
          el.html.classList.remove("hideLabelChips");
        }
        break;

      case "hideSearchChips":
        if (preferences.hideSearchChips) {
          el.html.classList.add("hideSearchChips");
        } else {
          el.html.classList.remove("hideSearchChips");
        }
        break;

      case "hideSelectRefresh":
        if (preferences.hideSelectRefresh) {
          el.html.classList.add("hideSelectRefresh");
        } else {
          el.html.classList.remove("hideSelectRefresh");
        }
        break;

      case "debug":
        if (preferences.debug) {
          el.html.classList.add("debug");

          // Add the binding to console.log
          report = console.log.bind(window.console);
          error = console.error.bind(window.console);
        } else {
          el.html.classList.remove("debug");

          // Remove the binding to console.log
          report = () => {};
          error = () => {};
        }
        // Cache state in localStorage
        local.update("debug", preferences.debug);
        break;

      case "hideListCount":
        if (preferences.hideListCount) {
          el.html.classList.add("hideListCount");
        } else {
          el.html.classList.remove("hideListCount");
        }
        break;

      case "hideMsgCount":
        if (preferences.hideMsgCount) {
          el.html.classList.add("hideMsgCount");
        } else {
          el.html.classList.remove("hideMsgCount");
        }
        break;

      case "reverseMsgs":
        if (preferences.reverseMsgs) {
          el.html.classList.add("reverseMsgs");
        } else {
          el.html.classList.remove("reverseMsgs");
        }
        break;

      case "listFontFace":
        if (preferences.listFontFace && preferences.messageFontFace !== "Default") {
          el.html.classList.add("fontList");
        } else {
          el.html.classList.remove("fontList");
        }
        break;

      case "messageFontSize":
      case "messageFontFace":
        // Only run on messageFontSize on initial load so I don't add everything twice
        if (is.loading && key === "messageFontFace") return;

        // Font size / change constants
        fontSize = preferences.messageFontSize || 14;
        fontSizeRem = fontSizes[fontSize].rem;
        fontSizePx = fontSizes[fontSize].px;
        compose.formattingCases.fontSizePx = `div.Am.SOFC[contenteditable] *[style*="${fontSizePx}"]`;
        compose.fontSizePxRegex = new RegExp(`font-size:\\s?${fontSizePx}\\d*\\s?px;?\\s?`, "gi");
        compose.formattingCases.fontSizeRem = `div.Am.SOFC[contenteditable] *[style*="${fontSizeRem}"]`;
        compose.fontSizeRemRegex = new RegExp(`font-size:\\s?${fontSizeRem}\\d*\\s?rem;?\\s?`, "gi");

        // Font face not default?
        if (preferences.messageFontFace === "Default") {
          // fontFace = "Arial, Helvetica, sans-serif";
          fontFace = "'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif";
          el.html.classList.remove("fontList");
        } else {
          fontFace =
            preferences.messageFontFace === "System"
              ? "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Roboto, Arial, sans-serif"
              : preferences.messageFontFace + ", Arial, Helvetica, sans-serif";

          // Style list too if pref is enabled
          if (preferences.listFontFace) el.html.classList.add("fontList");
        }

        // Add CSS
        css.add(`html.simplify { --simplify-font-size: ${fontSizeRem}rem; }`);
        css.add(`html.simplify { --simplify-font-face: ${fontFace}; }`);
        css.add(`html.simplify { --simplify-font: ${fontSizeRem}rem / 1.5 ${fontFace}; }`);

        // Add / remove global className depending on setting
        if (parseInt(preferences.messageFontSize) > 13 || preferences.messageFontFace !== "Arial") {
          el.html.classList.add("fontMsg");
        } else {
          el.html.classList.remove("fontMsg");
          compose.formattingCases.fontSizePx = null;
        }

        // Re-initialize the flat regex for formatting cases
        compose.initFormattingCases();
        break;

      case "showAppNav":
        if (preferences.showAppNav) {
          el.html.classList.add("showAppNav");
        } else {
          el.html.classList.remove("showAppNav");
        }
        break;

      case "noComposeFab":
        if (preferences.noComposeFab) {
          el.html.classList.remove("composeFab");
        } else {
          el.html.classList.add("composeFab");
        }
        break;

      case "showAddOnsWhen":
        el.html.classList.remove("addOnsPinned", "addOnsHidden");
        if (preferences.showAddOnsWhen === "always") {
          el.html.classList.add("addOnsPinned");
        } else if (preferences.showAddOnsWhen === "never") {
          el.html.classList.add("addOnsHidden");
        }
        break;

      case "externalWarning":
        el.html.classList.remove("hideExtWarn", "supExtWarn");
        if (preferences.externalWarning === "partial") {
          el.html.classList.add("supExtWarn");
        } else if (preferences.externalWarning === "full") {
          el.html.classList.add("hideExtWarn");
        }
        break;

      case "composeActions":
        if (preferences.composeActions) {
          el.html.classList.add("composeActions");
        } else {
          el.html.classList.remove("composeActions");
        }
        break;

      case "caImage":
        if (preferences.caImage) {
          el.html.classList.add("caI");
        } else {
          el.html.classList.remove("caI");
        }
        break;

      case "caLink":
        if (preferences.caLink) {
          el.html.classList.add("caL");
        } else {
          el.html.classList.remove("caL");
        }
        break;

      case "caDrive":
        if (preferences.caDrive) {
          el.html.classList.add("caD");
        } else {
          el.html.classList.remove("caD");
        }
        break;

      case "caEmoji":
        if (preferences.caEmoji) {
          el.html.classList.add("caE");
        } else {
          el.html.classList.remove("caE");
        }
        break;

      case "caSig":
        if (preferences.caSig) {
          el.html.classList.add("caS");
        } else {
          el.html.classList.remove("caS");
        }
        break;

      case "caConfid":
        if (preferences.caConfid) {
          el.html.classList.add("caC");
        } else {
          el.html.classList.remove("caC");
        }
        break;

      case "caCount":
        if (preferences.caCount >= 0) {
          // Remove old className (/.ca\d/)
          let oldVal = el.html.classList.value.split(" ").filter((item) => item.match(/ca\d/))[0];
          if (oldVal) {
            el.html.classList.remove(oldVal);
          }

          // Add new className
          el.html.classList.add("ca" + preferences.caCount);
        }
        break;

      case "composeFormat":
        if (preferences.composeFormat) {
          el.html.classList.add("composeFormat");
        } else {
          el.html.classList.remove("composeFormat");
        }
        break;

      case "cfUndo":
        if (preferences.cfUndo) {
          el.html.classList.add("cfZ");
        } else {
          el.html.classList.remove("cfZ");
        }
        break;

      case "cfFont":
        if (preferences.cfFont) {
          el.html.classList.add("cfF");
        } else {
          el.html.classList.remove("cfF");
        }
        break;

      case "cfSize":
        if (preferences.cfSize) {
          el.html.classList.add("cfS");
        } else {
          el.html.classList.remove("cfS");
        }
        break;

      case "cfColor":
        if (preferences.cfColor) {
          el.html.classList.add("cfC");
        } else {
          el.html.classList.remove("cfC");
        }
        break;

      case "cfAlign":
        if (preferences.cfAlign) {
          el.html.classList.add("cfA");
        } else {
          el.html.classList.remove("cfA");
        }
        break;

      case "cfOrdered":
        if (preferences.cfOrdered) {
          el.html.classList.add("cfO");
        } else {
          el.html.classList.remove("cfO");
        }
        break;

      case "cfUnordered":
        if (preferences.cfUnordered) {
          el.html.classList.add("cfU");
        } else {
          el.html.classList.remove("cfU");
        }
        break;

      case "cfIndent":
        if (preferences.cfIndent) {
          el.html.classList.add("cfI");
        } else {
          el.html.classList.remove("cfI");
        }
        break;

      case "cfQuote":
        if (preferences.cfQuote) {
          el.html.classList.add("cfQ");
        } else {
          el.html.classList.remove("cfQ");
        }
        break;

      case "cfStrike":
        if (preferences.cfStrike) {
          el.html.classList.add("cfK");
        } else {
          el.html.classList.remove("cfK");
        }
        break;

      case "cfRemove":
        if (preferences.cfRemove) {
          el.html.classList.add("cfR");
        } else {
          el.html.classList.remove("cfR");
        }
        break;

      case "blah":
        report("Setting up blah in applyPreferences", preferences.blah);
        break;
    }
  });

  let savedOrLoaded = Object.keys(prefs).length === 1 ? " saved" : "s loaded";
  report("Simplify preference" + savedOrLoaded, JSON.stringify(prefs));
};

// Initialize Simplify preferences
// TODO: What if the preferences are old and don't have all the new names? OR if I add a preference?
// TODO: Make preferences tri-state (true, false, or undefined/null) and defer to the default when undefined/null
const defaultPreferences = {
  debug: false,

  // Keyboard shortcuts
  kbsMenu: true,
  kbsInfo: true,
  kbsToggle: true,
  kbsEscape: true,
  kbsEnter: true,
  kbsUndo: true,
  kbsPrint: true,
  kbsRefresh: true,
  kbsBackspace: true,
  kbsUnarchive: true,
  kbsSelect: true,
  kbsSelectAll: true,
  kbsSelectAllAll: true,
  kbsShiftSelect: true,
  kbsHideInbox: true,
  kbsOrder: false,
  kbsAutoSelect: false,

  dateGroup: true,
  inboxZeroBg: "default",
  hideEmptySections: false,
  minimizeChat: true,
  showChat: false,
  hideSignatures: false,
  hideUnreadCount: false,
  hideTitleUnreadCount: "retired",
  modifyTitle: "disabled",
  hideMailTitle: false,
  invertMessages: "text-only",
  invertCompose: true,
  invertAddons: true,
  favicon: true,
  faviconSeedColor: "0",
  addCategories: true,
  hideSelectRefresh: false,
  hideLabelChips: true,
  hideSearchChips: false,
  hideTabIcons: true,
  hideListCount: true,
  hideMsgCount: true,
  hideInboxOnLoad: false,
  disableNotifs: false,
  matchFontSize: "retired",
  messageFontSize: "14",
  messageFontFace: "Default",
  listFontFace: true,
  externalWarning: "partial",
  sendLater: false,
  httpsLinks: false,
  reverseMsgs: false,
  listWidth: "1100",
  msgWidth: "850",
  msgLabelsRight: false,
  vPaneListWidth: "auto",
  showAddOnsWhen: "auto",
  noComposeFab: false,

  // Gmail's new design
  showAppNav: false,

  // Compose actions
  composeActions: true,
  caCount: 3,
  caImage: true,
  caLink: true,
  caDrive: false,
  caEmoji: false,
  caSig: false,
  caConfid: false,

  // Compose formatting
  composeFormat: false,
  cfUndo: false,
  cfFont: false,
  cfSize: false,
  cfColor: true,
  cfAlign: false,
  cfOrdered: true,
  cfUnordered: true,
  cfIndent: false,
  cfQuote: true,
  cfStrike: false,
  cfRemove: true,
};

// Helper function to handle any preferences changing
function handlePrefChange(changes) {
  for (let key in changes) {
    let newPreferences = {};
    newPreferences[key] = changes[key].newValue;
    applyPreferences(newPreferences);
  }
}

// Initialize preferences
if (is.okToSimplify) {
  chrome.storage.local.get(defaultPreferences, function (results) {
    preferences = results;

    // Temporary code to retire matchFontSize and introduce messageFontSize
    // Delete later (added June 19, 2021)
    if (results["matchFontSize"] !== "retired") {
      if (results["matchFontSize"] === false) {
        results["messageFontSize"] = "13";
      }
      chrome.storage.local.set({
        messageFontSize: results["messageFontSize"],
        matchFontSize: "retired",
      });
      results["matchFontSize"] = "retired";
    }

    // Temporary code to retire hideTitleUnreadCount and introduce modifyTitle
    // Delete later (added June 28, 2021)
    if (results["hideTitleUnreadCount"] !== "retired") {
      if (results["hideTitleUnreadCount"] === true) {
        results["modifyTitle"] = "hideUnreadCount";
      } else {
        results["modifyTitle"] = "disabled";
      }
      chrome.storage.local.set({
        modifyTitle: results["modifyTitle"],
        hideTitleUnreadCount: "retired",
      });
      results["hideTitleUnreadCount"] = "retired";
    }

    applyPreferences(preferences);
  });

  // Detect changes in preferences and make appropriate changes
  chrome.storage.onChanged.addListener(handlePrefChange);
}



// Copyright (C) Michael Leggett, Made Simple LLC - All Rights Reserved
// Proprietary and confidential; Unauthorized copying or redistribution of this file,
// via any medium is strictly prohibited; Written by Michael Leggett (hi@simpl.fyi)

// ==========================================================================
// CSS / SASS

/**
 * SASS is in multiple files
 * Shell script merges them into one js variable in one file and removes variable definitions and comments
 * css.compile {
 *   take sass and parse it line by line into CSS
 *   replace SASS variables with selectors loaded from localStorage / simplify[u]
 *   return CSS
 * }
 * css.init {
 *   css = this.compile()
 *   Put CSS into DOM
 * }
 * sass.update {
 *   update variable(s)
 *   this.load()
 * }
 *
 * Things to test still
 *  - empty declaration
 *  - multiple selectors on one line
 *  - multiple line declaration
 *  - trailing comments
 *  - style attribute selectors which put ": " in the selector
 */

const css = {
  updates: [],
  sheet: undefined,

  compile() {
    let lines = declarations.split(/\n/);
    let currentSelector = [];
    let addSelectorLater = false;
    let addLineNow = true;
    let openSelectorsCount = 0;
    let lastSelector = -1;
    let styles = [];
    let inComment = false;
    let inSelector = false;
    let inDeclaration = false;

    lines.forEach((sassLine) => {
      let line = sassLine.trim();
      let selectors = "";
      let selectorVars = "";
      let declarationVars = "";
      let hangingSelector = false;

      report("\n-----------------\nSass line: ", line);

      /** -------------------------------------------------------------
       * Reasons to skip this line
       */

      // Ignore empty lines
      if (line === "") return;

      // Ignore // comments
      if (line.match(/^\s*\/\//) !== null) return;

      // Ignore /* comments */
      if (line.match(/\/\*/) !== null) {
        inComment = true;
        return;
      }

      // Has the comment ended?
      if (inComment) {
        if (line.match(/\*\//) !== null) {
          inComment = false;
        }
        return;
      }

      /** -------------------------------------------------------------
       * Resove variables
       */

      // Replace selector variables
      selectorVars = line.match(/#{\$\w+}/g);
      if (selectorVars !== null) {
        selectorVars.forEach((s) => {
          report("SASS selector var: ", s, s.slice(3, -1), sel[s.slice(3, -1)]);
          line = line.replace(s, sel[s.slice(3, -1)]);
        });
      }

      // Replace value variables
      declarationVars = line.match(/\$\w+/g);
      if (declarationVars !== null) {
        declarationVars.forEach((v) => {
          report("SASS declaration var: ", v, sel[v.substr(1)]);
          line = line.replace(v, sel[v.substr(1)]);
        });
      }

      /** -------------------------------------------------------------
       * Detect multiple line selectors and declarations
       */

      // Is this line part of a multi-line declaration?
      let unclosedDeclaration = line.match(/.+: .+[^;]$/) !== null;
      let attributeSelector =
        line.match(/\[style[=*$~]{1,2}"[\w-]+: .+"\]/) !== null;

      if (inDeclaration) {
        if (line.substr(-1) === ";") {
          inDeclaration = false;
        }
      } else {
        // Does the line have a ": " in it but not end in a ;
        if (unclosedDeclaration && !attributeSelector) {
          inDeclaration = true;
        }
      }

      // Is this line part of a multi-line selector?
      if (inSelector) {
        if (line.substr(-1) === "{") {
          inSelector = false;
        }
      } else {
        if (
          (!unclosedDeclaration || attributeSelector) &&
          line.substr(-1) === ","
        ) {
          inSelector = true;
        }
      }

      /** -------------------------------------------------------------
       * Parse line
       */

      // If the line is an opening selector, add to building hierarchy
      let openSelector = line.match(/.* {$/);
      if (openSelector !== null || inSelector) {
        // If the line didn't end in a "{" and we're in a selector,
        // then the openSelector will end in a ","
        if (openSelector === null) {
          openSelector = line.match(/.*,$/);
        }

        // Remove bracket from end of selector
        let thisSelector = openSelector[0].replace(" {", "");

        /* Handle multiple selectors in one line */
        let arraySelector = "";
        if (thisSelector.search(/.+\,.+/) >= 0) {
          arraySelector = thisSelector.replace(",", ",//");
          arraySelector = arraySelector.split("//");
        } else {
          arraySelector = [thisSelector];
        }
        report(arraySelector);

        // Check to see if ending of last selector was a comma
        hangingSelector = false;
        lastSelector = currentSelector.length - 1;
        if (lastSelector >= 0) {
          if (currentSelector[lastSelector].slice(-1)[0].substr(-1) === ",") {
            hangingSelector = true;
          }
        }

        // Add selector to the hierarchy
        report("Current selector before:");
        currentSelector.forEach((s) => report(s));

        if (arraySelector.length > 1) {
          if (hangingSelector) {
            arraySelector.forEach((s) => {
              currentSelector[lastSelector].push(s);
            });
          } else {
            currentSelector.push(arraySelector);
          }
        } else {
          if (hangingSelector) {
            currentSelector[lastSelector].push(arraySelector[0]);
          } else {
            currentSelector.push(arraySelector);
          }
        }

        report("Current selector after:");
        currentSelector.forEach((s) => report(s));

        // We're only ready to show the selector if it has been fully opened
        if (!inSelector) {
          addSelectorLater = true;
        }

        // And selectors are only added at the start of a definition
        addLineNow = false;
      }

      // Else if this is a closing statement, see if we should print it
      else if (line === "}") {
        report("Closing selector before");
        currentSelector.forEach((s) => report(s));

        // Remove last selector from from currentSelector
        let removedSelector = currentSelector.pop();
        report("Removed selector: ", removedSelector);

        if (openSelectorsCount >= 1) {
          openSelectorsCount -= 1;
          addLineNow = true;
        }

        report("Closing selector after");
        currentSelector.forEach((s) => report(s));
      }

      // Otherwise, this is a CSS declaration
      else {
        report("CSS declaration: ", line, openSelectorsCount);

        // Indent CSS declaration
        line = "  " + line;

        // Do I need to print the accumulated selector?
        if (addSelectorLater) {
          selectors = this.getSelectors(Array.from(currentSelector));
          report(
            "---\ngetSelectors: ",
            selectors.flat(),
            currentSelector.flat()
          );

          line = selectors.join("\n") + " {\n" + line;

          // Replace & with currentSelector
          // TODO: I think SASS does something special when the & is at the end
          line = line.replace(/ &/gm, "");

          // Remove trailing comments
          line = line.replace(/[;|,|{|}] \/\/.*/, "");

          // Do I need to close the previous selector?
          if (openSelectorsCount >= 1) {
            line = "}\n" + line;
            openSelectorsCount -= 1;
          }

          // After testing, increment the openSelectorsCount
          openSelectorsCount += 1;

          // Reset addSelectorLater
          addSelectorLater = false;
        }

        // Update state variables
        addLineNow = true;
      }

      // Add final line to CSS
      if (addLineNow) styles.push(line);
      report("CSS so far: ", styles);

      // Reset addLineNow
      addLineNow = false;
    });

    // Put all the lines back into one big string
    return styles.join(`\n`);
  },

  getSelectors(selectors, parents = [""]) {
    let selector = selectors.shift();
    let results = [];

    report("---\nParents: ", parents.flat());
    report("Next selector: ", selector);
    report("Remaining selectors: ", selectors.flat());

    parents.forEach((p) => {
      selector.forEach((s) => {
        results.push(`${p} ${s}`.trim());
      });
    });

    if (selectors.length === 0) {
      return results;
    } else {
      return this.getSelectors(selectors, results);
    }
  },

  // Initialize Simplify CSS into embedded <style> tag
  // TODO: Eventually, also load SASS as CSS into page
  init(tries = 0) {
    // Trying to move Simplify's style sheet in the head if the head wasn't ready when initialized
    if (tries > 10) {
      return;
    } else if (tries > 0) {
      if (document.head) {
        const cssRules = css.sheet.cssRules;

        // Move the style tag (this drops the styles)
        document.head.appendChild(el.style);
        el.style = get("style#simplifyCss");
        css.sheet = el.style.sheet;

        // Put all the rules back into the moved style sheet
        for (let i = 0; i < cssRules.length; i++) {
          css.sheet.insertRule(cssRules[i].cssText, i);
        }
        return;
      } else {
        setTimeout(() => {
          css.init(tries + 1);
        }, tryIn);
        return;
      }
    }

    // TODO: Use SASS Compiler
    // const styles = this.compile();
    const styles = "";

    const simplifyCss = make(
      "style",
      { type: "text/css", id: "simplifyCss" },
      styles
    );
    if (document.head) {
      document.head.appendChild(simplifyCss);
    } else {
      // Insert the style tag into the HTML tag so I can add styles and try to move it when document.head is loaded
      document.documentElement.appendChild(simplifyCss);
      setTimeout(() => {
        css.init(tries + 1);
      }, tryIn);
    }

    el.style = get("style#simplifyCss");
    css.sheet = el.style.sheet;

    // Initialize the theme bg for loading screen
    css.add(`:root { --color-themeBg: ${simplify[u].themeBgColor} }`);
  },

  // Update a SASS variable and then update the CSS in the page
  update(element = "", selector = "") {
    // Process any accumulated updates
    this.updates.forEach((update) => {
      sel[update.e] = update.s;
    });

    // Process any inline updates
    if (element !== "" && selector !== "") {
      sel[element] = selector;
    }

    // Update localStorage
    local.update();

    // Compile CSS with new variables and selectors
    const styles = this.compile();

    // Insert compiled CSS into Gmail
    // TODO: Should I use insertRule?
    el.style.innerText = styles;
  },

  add(newCss, pos) {
    let position = pos ? pos : css.sheet.cssRules.length;
    css.sheet.insertRule(newCss, position);
    report("CSS added: " + css.sheet.cssRules[position].cssText);
  },
};

// Load Simplify CSS
css.init();

// Add .simplify to <html>
document.documentElement.classList.add("simplify");



// Copyright (C) Michael Leggett, Made Simple LLC - All Rights Reserved
// Proprietary and confidential; Unauthorized copying or redistribution of this file,
// via any medium is strictly prohibited; Written by Michael Leggett (hi@simpl.fyi)

// ==========================================================================
// ALERTS

// Support for showing Simplify notifications
const alerts = {
  autoClose: null,

  action: () => {},

  init() {
    // Create Simplify Alert Dialog
    // prettier-ignore
    el.alert = make("div", { id: "simplifyAlert", style: "display:none" }, 
      make("img", { src: chrome.runtime.getURL("img/app/logo.png"), style: "display:none" }),
      make("p", { className: "alertTitle"}, "Alert title"),
      make("p", { className: "alertMsg"}, "Alert message"),
      make("div", { id: "doNotShowAgain", className: "off" },
        make("input", { type: "checkbox", id: "doNotShowAgainOption" }), 
        make("label", {}, "Do not show again")
      ),
      make("button", { className: "action" }, "Primary action"),
      make("button", { className: "close" }, "Close")
    );
    document.body.appendChild(el.alert);

    // Initialize global el references
    el.alert = get("#simplifyAlert");
    el.alertImg = get("#simplifyAlert > img");
    el.alertTitle = get("#simplifyAlert .alertTitle");
    el.alertMsg = get("#simplifyAlert .alertMsg");
    el.alertDoNotShow = get("#simplifyAlert #doNotShowAgain");
    el.alertDoNotShowCheck = get("#simplifyAlert #doNotShowAgainOption");
    el.alertAction = get("#simplifyAlert .action");
    el.alertAction.addEventListener("click", alerts.primaryAction, false);

    // Initialize Do Not Show label
    get("#simplifyAlert #doNotShowAgain label").setAttribute(
      "for",
      "doNotShowAgainOption"
    );

    // Initialize close button action
    get("#simplifyAlert .close").addEventListener("click", alerts.close, false);
  },

  show(msg, action, doNotShowAgainName = "off", hideAfter = 0) {
    // If Gmail is still loaoding, try again in a second
    if (!document.body) {
      setTimeout(() => {
        alerts.show(msg, action, doNotShowAgainName, hideAfter);
      }, 1000);
      return;
    }

    // If set to not show, exit
    if (doNotShowAgainName !== "off") {
      if (doNotShow[doNotShowAgainName]) {
        report("Simplify Alert set to not show", doNotShowAgainName);
        return;
      }
    }

    // Initialize the alert box if it hasn't already been
    if (!get("#simplifyAlert")) {
      alerts.init();
    }

    // Add content to notification div
    // TODO: Find and replace any URLs with <a> tags; use markdown syntax
    el.alertTitle.innerText = msg.title;
    el.alertMsg.innerText = msg.body;
    el.alertAction.textContent = action;
    el.alertAction.style.display = "block";
    el.alertImg.style.display = "none";

    let details = "";

    // Add primary action to notification div
    switch (action) {
      case "Manage extensions":
        alerts.action = () => {
          console.log("Open chrome extensions");
          chrome.runtime.sendMessage({ action: "manage_extensions" });
        };
        break;

      case "Copy to clipboard":
        alerts.action = (m = msg) => {
          console.log(m);
          navigator.clipboard.writeText(m);
        };
        break;

      // Subscription trial
      case "Learn more & sign up":
        el.alertImg.style.display = "block";
        alerts.action = (m = details) => {
          window.open("https://simpl.fyi/plans?from=gmail");
        };
        break;

      case "Open video tour":
        alerts.action = (m = details) => {
          window.open("https://www.youtube.com/watch?v=zLmrhLEuRzY");
        };
        break;

      // Opt out of new Gmail design
      case "Switch back":
        alerts.action = () => {
          // Open Gmail Quick Settings
          if (!el.html.classList.contains("quickSettings")) {
            clickOn(get("path[d^='M13.85 22.25h-3.7c-.74']").closest("a"));
          }

          // Click on go back to old design
          clickOnWhenReady(".aI8 button");

          // Click save
          clickOnWhenReady("button[name='save']");
        };
        break;

      // Open dialog with Simplify version number and option to report issue
      case "Report issue":
        details = getSimplifyDetails();
        alerts.action = (m = details) => {
          window.open("https://simpl.fyi/support?system=" + details);
        };
        break;

      // Open support page in new window immmediately
      case "Report issue instant":
        details = getSimplifyDetails();
        alerts.action = (m = details) => {
          window.open("https://simpl.fyi/support?system=" + details);
        };
        clickOn(get("#simplifyAlert .action"));
        break;

      // For Mailplane
      case "Inbox settings":
        alerts.action = () => {
          location.hash = "settings/inbox";
        };
        get("#simplifyAlert .close").addEventListener(
          "click",
          () => {
            if (get("#simplifyAlert #doNotShowAgain").checked) {
              // Remember to not show this again
              local.update("doNotShow", "MailplaneAlert");
            }
            alerts.close();
          },
          false
        );
        break;

      case "Add permission":
        // alerts.action = requestPermissions;
        // alerts.action = () => { requestPermissions("fetch"); };
        el.alertAction.addEventListener("click", requestPermissions, false);
        break;

      case "Continue...":
        el.alertAction.addEventListener(
          "click",
          () => {
            chrome.runtime.sendMessage({
              action: "request_notifications_permissions",
            });
          },
          false
        );
        break;

      case "None":
        el.alertAction.style.display = "none";
        break;
    }

    // Setup Do Not Show Again option
    el.alertDoNotShow.className = doNotShowAgainName;
    el.alertDoNotShowCheck.checked = false;

    // Should probably do this at the end
    el.alert.style.display = "block";

    // Auto hide this notification in 30 seconds
    if (hideAfter > 0) {
      alerts.autoClose = setTimeout(alerts.close, hideAfter * 1000);
    }
  },

  primaryAction() {
    alerts.action();
    el.alert.style.display = "none";
    clearTimeout(alerts.autoClose);
  },

  close() {
    if (el.alertDoNotShowCheck.checked) {
      // Remember to not show this again
      let doNotShowName = el.alertDoNotShow.className;
      local.update("doNotShow", doNotShowName);
    }

    // Extra actions for certain dialogs
    if (el.alertAction.innerText === "Continue...") {
      get("#disableNotifs").classList.remove("on");
      chrome.storage.local.set({ disableNotifs: false });
    }

    el.alert.style.display = "none";
    clearTimeout(alerts.autoClose);

    // TODO: Add "Don't remind me"
    // preferences.kbsNotified = true;
  },
};



// Copyright (C) Michael Leggett, Made Simple LLC - All Rights Reserved
// Proprietary and confidential; Unauthorized copying or redistribution of this file,
// via any medium is strictly prohibited; Written by Michael Leggett (hi@simpl.fyi)

// ==========================================================================
// KEYBOARD SHORTCUTS

// Keypress handler
const keyboard = {
  ignoreNextKey: false,
  obsOverlayOpen: null,
  obsOverlayClose: null,

  async onKeydown(e) {
    // Test if only the Alt/Option key was only modifier key used
    let altKeyOnly = e.altKey && !e.shiftKey && !e.metaKey && !e.ctrlKey;

    // Was person typing somewhere when keypress event happened?
    let composing =
      e.target.isContentEditable ||
      e.target.tagName === "INPUT" ||
      e.target.tagName === "TEXTAREA";

    // If Option+S or Alt+S was pressed, toggle Simplify on/off
    if (altKeyOnly && e.code === "KeyS" && !composing) {
      if (preferences.kbsToggle) {
        toggleSimplify();
        e.preventDefault();
      }
      return;
    }

    // Only handle the rest of the keyboard shortcuts if Simplify is enabled and user is not typing
    if (!is.simplifyOn || composing) return;

    // Test different combinations of modifier keys
    let noModifierKey = !e.altKey && !e.shiftKey && !e.metaKey && !e.ctrlKey;
    let shiftKeyOk = !e.altKey && !e.metaKey && !e.ctrlKey;
    let cmdKey = is.mac ? e.metaKey : e.ctrlKey;
    let ctrlKey = is.mac ? e.ctrlKey : e.metaKey; // Flip to Win key for Windows so I make sure it isn't pressed
    let cmdKeyOnly = cmdKey && !ctrlKey && !e.altKey && !e.shiftKey;
    let shiftKeyOnly = e.shiftKey && !e.altKey && !e.metaKey && !e.ctrlKey;

    // Double check for moles if "c" pressed to compose new message
    if (e.key === "c" && noModifierKey) {
      observers.moles.start();
      observers.popouts.start();
    }

    // Don't block chained keyboard shortcuts like g -> i
    let chainedActions = [
      ["g", "*", "h"],
      ["a", "b", "c", "d", "f", "i", "k", "l", "m", "n", "p", "s", "t"],
    ];
    if (chainedActions[0].includes(e.key) && shiftKeyOk) {
      keyboard.ignoreNextKey = true;
      return;
    } else if (
      keyboard.ignoreNextKey &&
      chainedActions[1].includes(e.key) &&
      shiftKeyOk
    ) {
      keyboard.ignoreNextKey = false;
      return;
    } else {
      keyboard.ignoreNextKey = false;
    }

    // Dress up keyboard shortcuts overlay when opened
    if (e.key === "?" && shiftKeyOk) {
      report("Keyboard shortcuts overlay opened");
      keyboard.initOverlay();
      return;
    }

    // Inline actions on list
    if (is.list && shiftKeyOk) {
      // Things to do when moving up/down the list
      const up = ["ArrowUp", "k", "K"].includes(e.key);
      const down = ["ArrowDown", "j", "J"].includes(e.key);
      const arrows = ["ArrowUp", "ArrowDown"].includes(e.key);
      if (up || down) {
        report("J/K or Up/Down arrow key pressed");

        // Don't trigger if focus is elsewhere (like the nav)
        if (
          !document.activeElement.classList.contains("zA") &&
          !document.activeElement.tagName === "BODY"
        ) {
          return;
        }

        // Stregthen item highlight after using J/K or arrow keys
        el.html.classList.add("boldHighlight");

        if (shiftKeyOnly && preferences.kbsShiftSelect) {
          // Make Shift+J/K work the same as Shift+up/down (doesn't do anything)
          if (!arrows) {
            e.preventDefault();
            e.stopPropagation();
          }
          if (lists.selectDir === undefined) {
            lists.selectDir = down ? "down" : "up";
          }
          if (down) {
            report("Select down", arrows);
            lists.multiSelect("down");
          } else if (up) {
            report("Select up", arrows);
            lists.multiSelect("up");
          }
        } else {
          lists.selectDir = undefined;
        }
        return;
      }

      // Click to select (or unselect) thread when Spacebar is pressed
      if (
        e.code === "Space" &&
        noModifierKey &&
        !is.msgOpen &&
        preferences.kbsSelect
      ) {
        report("Space bar pressed");
        e.preventDefault();
        e.stopPropagation();
        lists.selectThread();
        return;
      }

      // If action key pressed while nothing is selected, select it, do action, unselect
      let actions = ["e", "y", "#", "!", "U", "I", "b", "l", "v"];
      if (preferences.kbsBackspace) {
        actions.push("Backspace", "Delete");

        // If auto-select isn't enabled, and delete button was pressed
        if (
          !preferences.kbsAutoSelect &&
          ["Backspace", "Delete"].includes(e.key)
        ) {
          let btn = getButton(e.key);
          if (btn) {
            e.preventDefault();
            clickOn(btn);
            return;
          }
        }
      }
      if (preferences.kbsUnarchive) {
        actions.push("E");

        // If auto-select isn't enabled, and Shift+E was pressed, unarchive
        if (!preferences.kbsAutoSelect && e.code === "KeyE" && shiftKeyOnly) {
          e.preventDefault();
          keyboard.unarchive();
        }
      }
      if (preferences.kbsAutoSelect && actions.includes(e.key)) {
        report("Inline action pressed", e.key);
        const readingPane = hasAnyClass(["vPane", "hPane"]);

        // Get the correct action button
        let btn = getButton(e.key);

        // I only need to do something if it is a Simplify key OR if I had to select the thread
        // Try to select thread (and find out if one is already selected)
        let threadSelected = lists.autoSelectThread();

        // Thread was auto-selected & we have the button
        if (threadSelected && btn) {
          e.preventDefault();
          await waitFor(tryIn); // Slight delay to make sure thread was selected
          clickOn(btn);

          // Unselect if action didn't open a menu (move, label, and snooze)
          if (!["b", "v", "l"].includes(e.key)) {
            await waitFor(tryIn);
            lists.unAutoSelectThread();
          }
        }

        // Thread was auto-selected but we don't have the button
        else if (threadSelected && !btn) {
          // The Move to inbox button isn't always there...
          if (e.code === "KeyE" && shiftKeyOnly && preferences.kbsUnarchive) {
            e.preventDefault();
            await waitFor(tryIn); // Slight delay to make sure thread was selected
            keyboard.unarchive();
            await waitFor(tryIn);
            lists.unAutoSelectThread();
          } else {
            // Otherwise, we couldn't find the button; Unselect the thread
            lists.unAutoSelectThread();
          }
        }

        // Thread was already selected (no need to auto-select)
        else {
          if (
            btn &&
            ["Backspace", "Delete"].includes(e.key) &&
            preferences.kbsBackspace
          ) {
            // Backspace or delete was pressed; map to deleting selected thread(s)
            e.preventDefault();
            clickOn(btn);
          } else if (
            e.code === "KeyE" &&
            shiftKeyOnly &&
            preferences.kbsUnarchive
          ) {
            // Shift+E was pressed, unarchive (add to inbox)
            e.preventDefault();
            keyboard.unarchive();
          }
        }
        return;
      }
    }

    // Delete message in message view
    if (
      (is.msg || is.msgOpen) &&
      (e.key === "Backspace" || e.key === "Delete") &&
      preferences.kbsBackspace &&
      noModifierKey
    ) {
      report("Backspace or Delete pressed in message view. Delete message.");
      e.preventDefault();
      e.stopPropagation();
      clickOn(getButton(e.key));
      return;
    }

    // Unarchive message (add to inbox) in message view
    if (
      (is.msg || is.msgOpen) &&
      e.code === "KeyE" &&
      shiftKeyOnly &&
      preferences.kbsUnarchive
    ) {
      e.preventDefault();
      e.stopPropagation();
      report("Shift+E pressed in message view. Unarchive message.");
      keyboard.unarchive();
      return;
    }

    // Go between messages with Space bar
    // TODO: This won't work for reading pane? Or do I just always map space bar to scrolling through messages?
    // TODO: I may be able to scroll to the next message but not sure I can focus it like N/P does :(
    // TODO: Dig more into what N/P does and see if I can replicate it
    // if (e.key === "Space" && is.msg) {
    //   report("Space bar pressed");
    //   // TODO: Write the actual code for this!
    //   // AFTER you press N or P, clicking on the body of the next message focuses
    //   // it + scroll the page (if current email is long) or to top of next message
    //   return;
    // }

    // Block sender
    // TODO: Not sure this is possible with a single shortcut as
    // the browser blocks two clicks on different things
    // if (
    //   // preferences.kbsBlock &&
    //   shiftKeyOnly &&
    //   e.key === "@" &&
    //   (is.msg || is.msgOpen)
    // ) {
    //   report("@ pressed, block sender");
    //   const moreActionsButtons = gets(".h7 .aap");
    //   let moreActionsButton = moreActionsButtons[0];

    //   let blockButton = get("#bs"); // [act="32"]

    //   // If multiple more action buttons, find the one on the screen
    //   // Somehow fell into an infinite loop
    //   // if (moreActionsButtons.length > 1) {
    //   //   moreActionsButton = null;
    //   //   let n = 0;
    //   //   while (moreActionsButton === null && n < moreActionsButtons.length) {
    //   //     if (onScreen(moreActionsButtons[n])) {
    //   //       moreActionsButton = moreActionsButtons[n];
    //   //     }
    //   //   }
    //   // }

    //   if (moreActionsButton) {
    //     e.preventDefault();
    //     e.stopPropagation();

    //     clickOn(moreActionsButton);
    //     clickOnWhenActive(blockButton);
    //     // clickOn(blockButton);
    //     // doubleClickOn(moreActionsButton, '[act="32"]');
    //     // clickDrag(moreActionsButton, '[act="32"]');

    //     // await waitFor(200);
    //     // blockButton = get('[act="32"]'); //265
    //     // if (blockButton) {
    //     //   // clickOn(blockButton);
    //     //   blockButton.focus();
    //     // } else {
    //     //   clickOn(moreActionsButton);
    //     // }
    //   }
    //   return;
    // }

    // Smart Select All if you press Cmd+A
    if (
      is.list &&
      preferences.kbsSelectAll &&
      e.key === "a" &&
      cmdKey &&
      !e.altKey &&
      !ctrlKey
    ) {
      // Ignore keypress if shift pressed and SelectAllAll is disabled
      if (e.shiftKey && !preferences.kbsSelectAllAll) return;

      report("Command+A pressed, select all the rest");
      let selectAll = get('div[gh="tm"] .T-Pm span[role="checkbox"]');
      if (selectAll) {
        e.preventDefault();
        clickOn(selectAll);
        document.activeElement.blur();
      }

      if (e.shiftKey && preferences.kbsSelectAllAll) {
        let selectAllAll = get('.ya span[role="link"]');
        if (selectAllAll) {
          clickOn(selectAllAll);
          document.activeElement.blur();
        }
      }

      // TODO: More advanced version:
      // If nothing selected, select evertying after current item in current section
      // If something selected before current item, select everything after current item
      // If everything selected after current item (e.g. you just pressed Cmd+A), select everything in current section
      // If everything selected in current selection, select everything on page
      // If everything on page selected, select nothing
    }

    // Refresh list instead of entire page
    // TODO: This isn't working in Safari
    // report(
    //   "Refresh?",
    //   preferences.kbsRefresh, cmdKeyOnly, e.key === "r", e.key
    // );
    if (is.list && preferences.kbsRefresh && cmdKeyOnly && e.key === "r") {
      e.stopPropagation();
      e.preventDefault();

      report("Command+R pressed, refresh Gmail list");
      let refreshButton = get('div[gh="tm"] div[act="20"]');
      if (refreshButton) {
        clickOn(refreshButton);
        document.activeElement.blur();
      }
      return;
    }

    // Print conversation if you press Cmd+P/Ctrl+P
    if (
      preferences.kbsPrint &&
      cmdKeyOnly &&
      e.key === "p" &&
      (is.msg || is.msgOpen)
    ) {
      report("Command+P pressed, print the current conversation");
      let printButton = get("[role='main'] img.g1");
      if (printButton) {
        e.preventDefault();
        e.stopPropagation();
        clickOn(printButton);
      }
      return;
    }

    // Undo last action if you press Cmd+Z/Ctrl+Z
    if (preferences.kbsUndo && cmdKeyOnly && e.key === "z") {
      report("Command+Z pressed, try to undo last action");
      let undoButton = get("#link_undo");
      if (undoButton) {
        e.preventDefault();
        e.stopPropagation();
        clickOn(undoButton);
      }
      return;
    }

    // If Escape was pressed, close conversation or search
    if (e.key === "Escape" && preferences.kbsEscape && noModifierKey) {
      // Don't intercept keypress if attachment preview is open
      if (location.hash.indexOf("projector=1") !== -1) return;

      // Prevent ESC from focusing or hiding an open mole instead
      report("Esc key pressed...");
      e.preventDefault();
      e.stopImmediatePropagation();

      // Simplify alert is open
      if (get('#simplifyAlert[style*="block"]')) {
        alerts.close();
      }

      // Keyboard shortcuts overlay is open
      else if (get(".wa:not(.aou)")) {
        clickOn(get(".wa span.wi"));
      }

      // In list with selected messages
      else if (is.list && el.html.classList.contains("msgSelected")) {
        report("Pressed esc: In a list with messages selected; unselect them");
        let selectAll = get('div[gh="tm"] .T-Pm span[role="checkbox"]');
        if (selectAll) {
          clickOn(selectAll);
          document.activeElement.blur();
        }
      }

      // Message is open, close it
      else if (is.msgOpen || is.msg) {
        report("Pressed esc: msg open, close conversation");
        conversation.close();
      }

      // In a search or label
      else if (is.search || is.label) {
        report(
          "Pressed esc: In search or label, return to previous list view: " +
            close.search
        );
        // location.hash = close.search;
        search.exit();
      }

      // In settings
      else if (is.settings) {
        report(
          "Pressed esc: In settings, return to previous list view: " +
            close.settings
        );
        // location.hash = close.settings;
        settings.exit();
      }

      // In inbox, check for tabs and return to primary tab
      else if (is.inbox) {
        report("Pressed esc in Inbox, go to Primary tab?");

        // TODO: Use sass variables
        let primaryTab = get(".aAy");
        if (primaryTab) {
          if (primaryTab.getAttribute("aria-selected") === "false") {
            clickOn(primaryTab);
          }
        }
      }

      // Return to Inbox if anywhere else (this might have unintended consequences)
      else {
        location.hash = "#inbox";
        report("Pressed esc: Not in a conversation or search, go to Inbox");
      }

      return;
    }

    // If Enter is pressed, zoom in and eventually reply to the focused message
    if (e.key === "Enter" && preferences.kbsEnter) {
      report("Pressed enter: Look for focused message to reply to");

      // Don't do anything if the Snooze menu is open
      if (count(sel.menuSnooze) > 0) {
        return;
      }

      // If still in the list, open message
      // TODO: Use sass variables
      if (is.list && !is.msgOpen) {
        if (
          document.activeElement.classList.contains("zA") ||
          document.activeElement.tagName === "BODY"
        ) {
          report("Enter key was pressed in the inbox with message in focus");
          clickOn(get(`${sel.currentList} tr.btb:not(.aps) .a4W`));
        }
      } else {
        let replyToFocusedMsg = get(
          'div[tabindex="0"][role="listitem"] .bAm div[role="button"]:first-child, div[tabindex="-1"][role="listitem"]:last-child .bAm div[role="button"]:first-child'
        );
        if (replyToFocusedMsg) {
          clickOn(replyToFocusedMsg, "click", e.shiftKey);

          let replyBody = get(
            'table[role="presentation"] div[role="textbox"][contenteditable="true"]'
          );
          if (replyBody) replyBody.focus();
        } else {
          report("Pressed enter: Couldn't find the reply button to click on");
        }
      }
      return;
    }

    // If Option+H or Alt+H was pressed, Hide / show inbox
    if (
      altKeyOnly &&
      e.code === "KeyH" &&
      preferences.kbsHideInbox &&
      is.inbox
    ) {
      e.preventDefault();
      e.stopPropagation();
      lists.showHideInbox();
      return;
    }

    // If Option+D or Alt+D was pressed, temporarily reverse order of list or conversation
    if (altKeyOnly && e.code === "KeyD" && preferences.kbsOrder) {
      e.preventDefault();
      e.stopPropagation();

      if (is.msg || is.msgOpen) {
        el.html.classList.toggle("reverseMsgs");
      } else if (is.list) {
        el.html.classList.toggle("reverseList");
      }
      return;
    }

    // If Option+I or Alt+I was pressed, show Simplify details
    if (altKeyOnly && e.code === "KeyI" && preferences.kbsInfo) {
      // showSimplifyDetails();
      reportIssue();
      return;
    }

    // If Alt+M or Option+M was pressed, toggle nav menu open/closed
    if (altKeyOnly && e.code === "KeyM" && preferences.kbsMenu) {
      clickOn(el.menuButton);
      e.preventDefault();

      // If opening, focus the first element
      if (el.menuButton.getAttribute("aria-expanded") === "true") {
        get(sel.inboxLink).focus();
      } else {
        document.activeElement.blur();
      }
      return;
    }
  },

  async unarchive() {
    // Use the Move To Inbox button if I can
    let moveToInbox = get(".G-atb[gh='tm'] div[act='8']");
    if (moveToInbox) {
      clickOn(moveToInbox);
    }

    // Otherwise, use Move To menu -> select Inbox
    else {
      let moveToMenu = get(".G-atb[gh='tm'] .ns[role='button']");
      if (moveToMenu) {
        // Temporarily hide the Move to menu
        el.html.classList.add("hideMoveToMenu");
        clickOn(moveToMenu);

        // Wait for menu to be added to DOM
        await waitFor(tryIn);

        // Find the Inbox item in the Move To menu
        let moveToInbox = get(".G-atb[gh='tm'] div[act='8']");
        if (moveToInbox) {
          clickOn(moveToInbox);
        } else {
          // Hide the menu if I couldn't find the item for some reason
          clickOn(moveToMenu);
        }

        // Unhide the Move To menu
        el.html.classList.remove("hideMoveToMenu");
      }
    }
  },

  initOverlay(tries = 0) {
    if (tries < 10) {
      if (!get(".wh") && !get(".aNP")) {
        setTimeout(() => {
          keyboard.initOverlay(tries++);
        }, retryIn);
        return;
      }
    }

    // Add Simplify keyboard shortcuts (if not there) and fix formatting of overlay
    let simplifyShortcuts = make("table", {
      cellpadding: "0",
      id: "simplifyKbs",
      className: "cf wd",
    });
    let topShortcutsTable = get(".aNP");
    if (topShortcutsTable) {
      topShortcutsTable.insertBefore(simplifyShortcuts, get(".aNO"));
    }
    keyboard.addSimplifyShortcuts();

    // Replace modifier keys
    keyboard.replaceKeys();

    // Focus keyboard shortcuts
    // TODO: Use sass variable
    document.querySelector(".wa .aNP").focus();

    // Listen for overlay closing
    let overlay = get("body > .wa");
    if (this.obsOverlayClose === null) {
      this.obsOverlayClose = new MutationObserver(keyboard.closeOverlay);
    }
    if (overlay) {
      this.obsOverlayClose.observe(
        overlay,
        observers.config.classAttributeOnly
      );
    }

    // Listen for overlay re-opening
    let overlayInner = get("body > .wa > div");
    if (this.obsOverlayOpen === null) {
      this.obsOverlayOpen = new MutationObserver((mutations) => {
        if (mutations.some((m) => m.addedNodes.length > 0)) {
          keyboard.initOverlay();
        }
      });
    }
    if (overlayInner) {
      this.obsOverlayOpen.observe(
        overlayInner,
        observers.config.directChildrenOnly
      );
    }
  },

  addSimplifyShortcuts() {
    report("Adding Simplify keyboard shortcuts");
    let simplifyShortcuts = get("#simplifyKbs");
    if (simplifyShortcuts) {
      simplifyShortcuts.innerHTML =
        '<tbody><tr><td class="Dn"><table cellpadding="0" class="cf"><tbody><tr><th class="Do"></th><th class="Do"><div>Simplify: In list view</div></th></tr>' +
        '<tr><td class="wg Dn"><span class="wh">↓</span><span class="wb slash">/</span><span class="wh">↑</span></td><td class="we Dn">Older/newer conversation</td></tr>' +
        '<tr><td class="wg Dn"><span class="wh">Cmd</span><span class="wh">r</span></td><td class="we Dn">Refresh list</td></tr>' +
        '<tr><td class="wg Dn"><span class="wh">⎵</span></td><td class="we Dn">Select/Unselect focused conversation</td></tr>' +
        '<tr><td class="wg Dn"><span class="wh">Shift</span><span class="wh">↓</span><span class="wh">↑</span></td><td class="we Dn">Select multiple conversations</td></tr>' +
        '<tr><td class="wg Dn"><span class="wh">Cmd</span><span class="wh">a</span></td><td class="we Dn">Select all / none (on current page)</td></tr>' +
        '<tr><td class="wg Dn"><span class="wh">Cmd</span><span class="wh">⇧</span><span class="wh">a</span></td><td class="we Dn">Select all (current page and beyond)</td></tr>' +
        '<tr><td class="wg Dn"><span class="wh">Alt</span><span class="wh">h</span></td><td class="we Dn">Hide / Show inbox</td></tr></tbody></table><table cellpadding="0" class="cf"><tbody><tr><th class="Do"></th><th class="Do"><div>Simplify: Between views</div></th></tr>' +
        '<tr><td class="wg Dn"><span class="wh">⏎</span></td><td class="we Dn">Drill in (open message → focus message → reply)</td></tr>' +
        '<tr><td class="wg Dn"><span class="wh escKey">Esc</span></td><td class="we Dn">Drill out (close reply → message → search → inbox)</td></tr></tbody></table></td><td class="Dn"><table cellpadding="0" class="cf"><tbody><tr><th class="Do"></th><th class="Do"><div>Simplify: In all views</div></th></tr>' +
        '<tr><td class="wg Dn"><span class="wh">⌫</span></td><td class="we Dn">Delete message</td></tr>' +
        '<tr><td class="wg Dn"><span class="wh">Cmd</span><span class="wh">z</span></td><td class="we Dn">Undo last action</td></tr>' +
        '<tr><td class="wg Dn"><span class="wh">Shift</span><span class="wh">e</span></td><td class="we Dn">Unarchive (Add to inbox)</td></tr>' +
        '<tr><td class="wg Dn"><span class="wh">Alt</span><span class="wh">d</span></td><td class="we Dn">Reverse a conversation or list temporarily</td></tr>' +
        '<tr><td class="wg Dn"><span class="wh">Alt</span><span class="wh">m</span></td><td class="we Dn">Open and focus or close navigation</td></tr>' +
        '<tr><td class="wg Dn"><span class="wh">Alt</span><span class="wh">i</span></td><td class="we Dn">Report Simplify Issue</td></tr>' +
        '<tr><td class="wg Dn"><span class="wh">Alt</span><span class="wh">s</span></td><td class="we Dn">Turn Simplify off/on</td></tr></tbody></table></td></tr></tbody>';
    }
  },

  replaceKeys() {
    // Platform specific modifier keys; Cmd maps to Ctrl for Simplify shortcuts
    let ctrlKey = is.mac ? "⌃" : "Ctl";
    let altKey = is.mac ? "⌥" : "Alt";
    let cmdKey = is.mac ? "⌘" : "Ctl";

    // Convert system buttons into symbols
    gets(".wa .wh").forEach((btn) => {
      if (btn.innerText === "<⌘>") {
        btn.innerText = cmdKey;
      } else if (btn.innerText === "<Shift>" || btn.innerText === "Shift") {
        btn.innerText = "⇧";
      } else if (btn.innerText === "<Enter>" || btn.innerText === "Enter") {
        btn.innerText = "⏎";
      } else if (btn.innerText === "<Ctrl>" || btn.innerText === "Ctrl") {
        btn.innerText = ctrlKey;
        if (!is.mac) btn.classList.add("ctlKey");
      } else if (btn.innerText === "Cmd") {
        btn.innerText = cmdKey;
        if (!is.mac) btn.classList.add("ctlKey");
      } else if (btn.innerText === "<Alt>" || btn.innerText === "Alt") {
        btn.innerText = altKey;
        if (!is.mac) btn.classList.add("altKey");
      } else if (btn.innerText === "<⌥>") {
        btn.innerText = "⌥";
      } else if (btn.innerText === "<Esc>" || btn.innerText === "Esc") {
        btn.classList.add("escKey");
        btn.innerText = "Esc";
      }
    });

    // Get rid of the plus signs
    gets(".wa .wb").forEach((symbol) => {
      if (symbol.innerText === "+") {
        symbol.classList.add("plus");
      } else if (symbol.innerText === "then") {
        symbol.innerText = "→";
        symbol.classList.add("then");
      } else if (symbol.innerText === "/") {
        symbol.classList.add("slash");
      }
    });

    // Show keyboard shortcut overlay
    get("body > .wa").setAttribute("data-simplify", "ready");
  },

  closeOverlay() {
    if (get("body > .wa[data-simplify='ready']")) {
      report("Keyboard panel closed. Remove Simplify keys.");

      // Shouldn't be needed but just to be careful in case the below
      // selector stops working. Remove this as it eneds to be set back
      // up each time the overlay is opened
      let simplifyShortcuts = get("#simplifyKbs");
      if (simplifyShortcuts) simplifyShortcuts.remove();

      // Gmail rebuilds this overlay but only after it is opened again.
      // If I don't remove this part, I clean up the old overlay that
      // then immediately gets removed the next time.
      let gmailShortcuts = get("body > .wa .aNP");
      if (gmailShortcuts) gmailShortcuts.remove();

      // Hide keyboard shortcut window until resetup
      get("body > .wa").setAttribute("data-simplify", "closed");
    }
  },
};



// Copyright (C) Michael Leggett, Made Simple LLC - All Rights Reserved
// Proprietary and confidential; Unauthorized copying or redistribution of this file,
// via any medium is strictly prohibited; Written by Michael Leggett (hi@simpl.fyi)

// ==========================================================================
// OBSERVERS

// Observers used to detect that Gmail has finished loading
const observers = {
  // Observer configs
  config: {
    contentOnly: {
      attributes: false,
      childList: true,
      characterData: true,
      subtree: true,
    },
    attributesOnly: {
      attributes: true,
      childList: false,
      subtree: false,
    },
    styleAttributeOnly: {
      attributes: true,
      attributeFilter: ["style"],
      attributeOldValue: true,
      childList: false,
      subtree: false,
    },
    ariaChecked: {
      attributes: true,
      attributeFilter: ["aria-checked"],
      childList: false,
      subtree: false,
    },
    ariaExpanded: {
      attributes: true,
      attributeFilter: ["aria-expanded"],
      childList: false,
      subtree: false,
    },
    ariaLabel: {
      attributes: true,
      attributeFilter: ["aria-label"],
      childList: false,
      subtree: false,
    },
    classAttributeOnly: {
      attributes: true,
      attributeFilter: ["class"],
      childList: false,
      subtree: false,
    },
    directChildrenOnly: {
      attributes: false,
      childList: true,
      subtree: false,
    },
    allChildren: {
      attributes: false,
      childList: true,
      subtree: true,
    },
    everything: {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true,
    },
  },

  // Once the loading screen is gone, call initAfterLoaded()
  loading: {
    obs: null,
    element: null,
    tries: 0,
    count: 0,

    start() {
      // Only try so many times
      if (this.tries > retryAttempts) {
        error("Cound't find loading screen, initializing Simplify in 5 sec");
        setTimeout(initializeSimplify, 5000);
        this.tries = 0;
        this.disconnect();
        return;
      }

      // Don't run Simplify if Print View, View Original, or Google Chat
      if (is.original || is.print || is.gChat) {
        report("Disabling Simplify in this view");
        toggleSimplify("off");
        return;
      }

      // If Mailplane was disabled, turn off Simplify for now
      // Simplify will be re-enabled or fully disabled under otherExtensions.checkMailplane()
      if (simplify[u].mailplaneDisabled) {
        report("Disabling Simplify in Mailplane with old Chrome and not vPane");
        el.html.classList.remove("simplify");
      }

      // Show warning for old versions of Chrome
      // TODO: UserAgents are not very reliable and this may throw false positives
      // if (is.chrome && is.oldChrome) {
      //   report(
      //     "Looks like a really old version of Chrome",
      //     navigator.userAgent,
      //     is.chrome,
      //     is.oldChrome
      //   );
      //   alerts.show(
      //     {title:"⚠️ Warning ⚠️", body:"It looks like you are using a really old version of Chrome which is less secure and doesn't support Simplify Gmail.\nGoogle Support article on fixing Chrome update problems & failed updates: https://support.google.com/chrome/answer/111996"},
      //     "None"
      //   );
      //   toggleSimplify("off");
      //   return;
      // }

      // Popout view seems to always default to the light theme
      // Don't run full Simplify in pop-out view
      // TODO: Can I make the window dark if the theme is darkTheme?
      if (is.popout) {
        el.html.classList.add("popout", "newUI", "defaultTheme", "lightTheme");
        el.html.classList.remove(
          "darkTheme",
          "mediumTheme",
          "vPane",
          "hPane",
          "nPane"
        );
        initializeSimplify();
        this.disconnect();
        return;
      }

      // Don't run full Simplify in pop-out view
      if (is.mailto) {
        el.html.classList.add("mailto");
        el.html.classList.remove("mediumTheme", "vPane", "hPane", "nPane");
        initializeSimplify();
        this.disconnect();
        return;
      }

      this.element = get("#loading");
      if (!this.element) {
        this.tries += 1;
        setTimeout(this.start.bind(this), retryIn);
      } else {
        // If the loading screen is already hidden, go ahead and initialize Simplify
        if (this.element.style.display === "none") {
          initializeSimplify();
          return;
        }

        if (this.obs === null) {
          this.obs = new MutationObserver((mutations) => {
            this.count += 1;
            if (mutations.some((m) => m.target.style.display === "none")) {
              initializeSimplify();
              this.disconnect();
            }
          });
        }

        this.observe();
      }
    },

    observe() {
      this.obs.observe(this.element, observers.config.styleAttributeOnly);
    },

    disconnect() {
      this.tries = 0;
      if (this.obs !== null) {
        this.obs.disconnect();
        this.obs = null;
      }
    },
  },

  // Observe style tag for changes to themes
  theme: {
    obs: null,
    element: null,
    tries: 0,

    start() {
      // Only try so many times
      if (this.tries > retryAttempts) {
        error("Cound't find theme css style tag.");
        this.tries = 0;
        this.disconnect();
        return;
      }

      // Find element to observe (style tag with theme css in it)
      [...gets("style:not([id])")]
        .filter((a) => a.textContent.includes(sel.themeBg))
        .forEach((a) => a.classList.add("theme"));

      this.element = get("style.theme");
      if (!this.element) {
        this.tries += 1;
        setTimeout(this.start.bind(this), retryIn);
      } else {
        if (this.obs === null) {
          this.obs = new MutationObserver(theme.detect);
        }
        this.observe();
      }
    },

    observe() {
      this.obs.observe(this.element, observers.config.directChildrenOnly);
    },

    disconnect() {
      if (this.obs !== null) {
        this.obs.disconnect();
        this.obs = null;
        this.tries = 0;
      }
    },

    restart() {
      this.disconnect();
      this.start();
    },
  },

  // Observe when Quick Settings is opened
  quickSettings: {
    obs: null,
    element: null,
    tries: 0,
    count: 0,

    start() {
      // if (is.delegate) return;

      // Only try so many times
      if (this.tries > retryAttempts) {
        this.tries = 0;
        error("Cound't find right side bar");
        return;
      }

      // TODO: use sass variable
      this.element = is.delegate ? get(".aUx") : get(".bAw");

      if (this.element === null) {
        this.tries += 1;
        setTimeout(this.start.bind(this), retryInSlow);
      } else {
        if (this.obs === null) {
          this.obs = new MutationObserver(() => {
            this.count += 1;
            report("Checking for quickSettings", this.count);

            // When Quick Settings is opened, div.IU is added to the DOM
            if (get(".IU", this.element) === null) {
              el.html.classList.remove("quickSettings");
            } else {
              el.html.classList.add("quickSettings");
              // settings.addSimplifySettingsButton();
              appMenu.close();

              // Remember what has focus
              let activeEl = document.activeElement;

              // Focus the body on any open compose moles so the formatting bar is moved with the mole
              if (activeEl && notEditing()) {
                let lastComposer = null;
                gets(".Bs .aDj.aDi, .Bs .aDj.ahe").forEach(
                  (composeActionBar) => {
                    lastComposer = get(
                      ".editable",
                      composeActionBar.closest(".iN")
                    );
                    if (lastComposer) lastComposer.focus();
                  }
                );

                // Reapply focus
                if (lastComposer) {
                  setTimeout(() => {
                    lastComposer.blur();
                    activeEl.focus();
                  }, tryIn);
                }
              }

              // TODO: Add listeners to the inbox type changing? Is that even still needed?
              // TODO: Use sass variables
              // gets('.Vn input[type="radio"]').forEach(radioButton => {})
            }

            // Resize the reading pane if enabled
            if (simplify[u].readingPaneType === "vPane") {
              readingPane.detectSize();
            }
          });
        }

        this.element = is.delegate
          ? this.element.firstChild
          : this.element.parentElement;
        this.element.parentElement.classList.add("rightPane");
        this.observe();
      }
    },

    observe() {
      this.obs.observe(this.element, observers.config.directChildrenOnly);
    },

    disconnect() {
      if (this.obs !== null) {
        this.obs.disconnect();
        this.obs = null;
        this.tries = 0;
      }
    },
  },

  // Observe if action bar is toggled and toggle html.msgSelected
  actionBar: {
    obs: null,
    elements: null,
    tries: 0,
    calls: 0,
    obs: new MutationObserver((mutations) => {
      observers.actionBar.calls += 1;
      report("Select state changed", observers.actionBar.calls);

      // When a message is selected, the select all checkbox state is changed
      // Note, if you are in a search with some items in the inbox (or other cached views)
      // Gmail will update the select state on the checkbox for the Inbox at the same time
      if (
        mutations.some((m) => m.target.getAttribute("aria-checked") === "false")
      ) {
        report("Selected none.");
        el.html.classList.remove("msgSelected", "allSelected");
      } else if (
        // mutations.some((m) => m.target.getAttribute("aria-checked") === "mixed")
        mutations.some((m) => m.target.getAttribute("aria-checked") === "true")
      ) {
        report("Selected all...");
        el.html.classList.add("msgSelected");

        // TODO: do something special if there is no "Select all" banner which happens if there are not multiple pages
        // TODO: Use sass variables
        // Delay checking for the Select All banner to give it a chance to be added to the DOM
        setTimeout(() => {
          const selectAllBarCount = count(".ya.yb, .ya.yc");
          report("Check for select all banner", selectAllBarCount);
          if (selectAllBarCount > 0) {
            el.html.classList.add("allSelected");
          }
        }, 20);
      } else {
        report("Selected some.");
        el.html.classList.add("msgSelected");
        el.html.classList.remove("allSelected");
      }

      // Sometimes the action bar isn't in the right place after this change
      if (el.html.classList.contains("hPane")) readingPane.detectSize();
    }),

    start() {
      // Only try so many times
      if (this.tries > retryAttempts) {
        this.tries = 0;
        error("Cound't find action bar in list view");
        return;
      }

      // Get all the action bars (there can be multiple)
      this.elements = gets(sel.bar);

      // Try again if no action bars found
      if (this.elements.length === 0) {
        this.tries += 1;
        report("Didn't find action bar. Trying again...");
        setTimeout(this.start.bind(this), retryIn);
      } else {
        this.tries = 0;
        this.addSearchButton();
        this.observe();
      }
    },

    // Add minimized search button to action bar near pagination buttons
    addSearchButton() {
      if (readingPane.type === "vPane" && !is.msg) {
        return;
      }

      if (count(".G-atb[gh='tm'] .searchMinimized") === 0) {
        let searchMinimized = make("div", { className: "searchMinimized" });
        let paginationParent, paginationPrev;

        // List
        if (is.list) {
          paginationParent = get(".G-atb[gh='tm'] .ar5 .Di");
          paginationPrev = get(".G-atb[gh='tm'] .ar5 .Di .amD");
        } else {
          // Message
          paginationParent = get(".G-atb[gh='tm'] .iG .h0");
          paginationPrev = get(".G-atb[gh='tm'] .iG .h0 .adg");
        }

        // TODO: This still doesn't work on a sectioned inbox as there are no pagination buttons
        if (paginationParent && paginationPrev) {
          paginationParent.insertBefore(searchMinimized, paginationPrev);
          gets(".searchMinimized:not(.active)").forEach((button) => {
            button.addEventListener("click", () => {
              let searchBox = get('#gb form input[name="q"]');
              if (searchBox) searchBox.focus();
            });
            button.classList.add("active");
          });
        }
      }
    },

    observe() {
      // Make sure we're observing all select boxes
      gets(".G-Ni span[role='checkbox']:not(.SOFC)").forEach((selectBox) => {
        this.obs.observe(selectBox, observers.config.ariaChecked);
        selectBox.classList.add("SOFC");
        report("Observing select checkbox now");
      });

      // Initialize select state for current view
      let checkbox = get(
        ".BltHke[role='main'] .G-Ni span[role='checkbox'], .G-atb[gh='tm'] .G-Ni span[role='checkbox']"
      );
      let checkboxUnchecked = checkbox
        ? checkbox.getAttribute("aria-checked") === "false"
        : false;

      if (!checkbox || checkboxUnchecked) {
        el.html.classList.remove("msgSelected");
      } else {
        el.html.classList.add("msgSelected");
      }
    },
  },

  // Observe body for certain things being setup (currently, just popout and moles container)
  compose: {
    el: null,
    tries: 0,
    calls: 0,

    start(all = false) {
      this.calls += 1;
      report("Initialize compose obs", this.calls);

      // Look for inline composers (this will exit if not in conversation)
      observers.inlineReply.start();

      // Setup listener on compose button
      observers.compose.listen();

      // Check for any contenteditble elements just to be safe
      compose.check();

      // Moles and popouts will get started when their parent is found by body observer
      if (all) {
        observers.moles.start();
        observers.popouts.start();
      }
    },

    // Add click listener on compose button -> check for new moles & popouts
    listen() {
      // Abort if a popout (no compose button)
      if (is.popout) return;

      if (this.tries > retryAttemptsFew) {
        report("Cound't find compose button", this.el);
        this.tries = 0;
        return;
      }

      this.el = get(sel.composeButton);

      if (!this.el) {
        this.tries += 1;
        report("Didn't find compose button. Try #", this.tries);
        setTimeout(this.listen.bind(this), 500);
      } else {
        this.el.addEventListener("click", () => {
          observers.moles.start();
          observers.popouts.start();
        });
        this.tries = 0;
      }
    },
  },

  // Observe for popouts being opened / closed
  popouts: {
    el: null,
    tries: 0,
    obs: null,

    start() {
      // Only try to find the element to observe so many times
      if (this.tries > retryAttemptsFew) {
        report("Cound't find popout", this.el);
        this.tries = 0;
        return;
      }

      // Get the compose containers
      this.el = get(sel.composePopout);

      // Try again if no compose container found
      if (!this.el) {
        this.tries += 1;
        report("Didn't find popouts. Try #", this.tries);
        setTimeout(this.start.bind(this), 500);
      } else {
        if (this.obs === null) {
          this.obs = new MutationObserver(compose.molePopMutations);
        }

        this.obs.observe(this.el, observers.config.directChildrenOnly);

        // Run now in case mole was just added -- not sure this is needed
        setTimeout(compose.molePopMutations, tryIn);

        // Reset setup
        this.tries = 0;
      }
    },
  },

  // Observe for moles being opened / closed
  moles: {
    el: null,
    tries: 0,
    obs: null,

    start() {
      // Only try to find the element to observe so many times
      if (this.tries > retryAttemptsFew) {
        report("Cound't find moles", this.el);
        this.tries = 0;
        return;
      }

      // Get the compose containers
      this.el = get(sel.composeMoles);

      // Try again if no compose container found
      if (!this.el) {
        this.tries += 1;
        report("Didn't find moles. Try #", this.tries);
        setTimeout(this.start.bind(this), 500);
      } else {
        if (this.obs === null) {
          this.obs = new MutationObserver(compose.molePopMutations);
        }

        this.obs.observe(this.el, observers.config.directChildrenOnly);

        this.el.classList.add("SOFC");

        // Run now in case mole was just added -- not sure this is needed
        setTimeout(compose.molePopMutations, tryIn);

        // Reset setup
        this.tries = 0;
      }
    },
  },

  // Observe inline composer moles opening and for extra css in drafts
  inlineReply: {
    tries: 0,
    obsExpand: null,
    obsReply: null,
    calls: 0,

    start() {
      // Don't try to setup the inline reply observers if not in a message
      if (!hasAnyClass(["inMsg", "msgOpen", "popout"])) return;

      // Only try to find the element to observe so many times
      if (this.tries > 10) {
        this.tries = 0;
        report("Cound't find inline replies");
        // Should I instead add check.composers when they haven't been loaded yet?
        return;
      }

      // Get the compose containers
      let messages = gets(`${sel.messages} > div`);

      // Try again if no messages found
      if (messages.length === 0) {
        this.tries += 1;
        setTimeout(this.start.bind(this), 500);
      } else {
        if (this.obsExpand === null) {
          this.obsExpand = new MutationObserver(
            observers.inlineReply.observeMessage.bind(this)
          );
        }

        // Observe changes to classname on each message
        messages.forEach((message) => {
          // This catches when a message is expanded or inserted
          this.obsExpand.observe(message, observers.config.classAttributeOnly);
        });

        report("Observing new inline composers");

        // See if there are any composers already loaded
        this.observeMessage();

        // See if there are any composers already loaded
        compose.check();

        // Reset tries
        this.tries = 0;
      }
    },

    // Listen for inline replies to be inserted
    observeMessage() {
      // Are there any messages I'm not observing for new inline replies?
      this.calls += 1;
      report("Looking for new inline replies to monitor", this.calls);

      let replies = gets(`${sel.composeInlineReply}:not([sofc])`);
      if (replies.length > 0) {
        if (this.obsReply === null) {
          this.obsReply = new MutationObserver(compose.check);
        }
        report("Found new inline replies to monitor");
        replies.forEach((reply) => {
          // Observe .ip directChildren added -> look for new composers
          this.obsReply.observe(reply, observers.config.directChildrenOnly);
          reply.setAttribute("sofc", "true");
        });
      }

      // Find and enable playing attached MP4's inline
      conversation.enableVideos();

      // Check for HTML emails
      conversation.hasHtmlEmail();
    },
  },

  // Observe if the Add-ons pane is opened or closed
  addOns: {
    // bq9 buW br3 -- remove br3 when open
    obs: null,
    element: null,
    tries: 0,
    count: 0,

    start() {
      if (is.delegate) return;

      // Only try so many times
      if (this.tries > retryAttempts) {
        this.tries = 0;
        error("Cound't find add-ons pane");
        return;
      }

      // TODO: use sass variable $addOnsPane
      this.element = get(".bq9");

      if (this.element === null) {
        this.tries += 1;
        setTimeout(this.start.bind(this), retryInSlow);
      } else {
        if (this.obs === null) {
          this.obs = new MutationObserver(observers.addOns.detect);
        }

        this.detect();
        this.obs.observe(this.element, observers.config.classAttributeOnly);
      }
    },

    detect() {
      this.count += 1;
      report("Add-ons changed", this.count);

      // When Add-ons is opened, .br3 is removed
      // 3rd party extensions leave .br3 and add .companion_app_sidebar_wrapper_visible
      // if (observers.addOns.element.classList.contains("br3")) {
      if (
        observers.addOns.element.classList.contains("br3") &&
        !observers.addOns.element.classList.contains(
          "companion_app_sidebar_wrapper_visible"
        )
      ) {
        el.html.classList.remove("addOnsOpen");
        local.update("addOnsOpen", false);
      } else {
        el.html.classList.add("addOnsOpen");
        local.update("addOnsOpen", true);
        appMenu.close();
      }

      // Sometimes toggling the addOns open/closed causes the action bar to get misplaced
      // TODO: I don't think I'm doing this for Copper and Hubspot and I probably need to (test w/ hPane)
      if (el.html.classList.contains("hPane")) {
        readingPane.detectSize();
      }
    },
  },

  // Observe menus, moles, and popouts being loaded into the DOM
  body: {
    obs: null,
    dragObs: null,
    lastMutation: null,
    calls: 0,

    start() {
      // Scan on initial startup
      observers.body.scan();

      // Setup observer to find new mole or popout composer containers
      if (this.obs === null) {
        this.obs = new MutationObserver((mutations) => {
          this.calls += 1;

          if (mutations.some((m) => m.addedNodes.length > 0)) {
            observers.body.scan();
          }
        });
      }
      this.obs.observe(document.body, observers.config.directChildrenOnly);

      // Setup observer to detect when dragging is occuring
      // if (this.dragObs === null) {
      //   this.dragObs = new MutationObserver(observers.body.detectDrag);
      // }
      // this.dragObs.observe(document.body, observers.config.styleAttributeOnly);
    },

    // Scan for each of the things that are added as a direct child of <body>
    scan() {
      // Any new menus? (not doing anything here yet, so not calling)
      // observers.menus.find();

      // New moles?
      let molesTop = get(`${sel.composeMolesTop}:not(.SOFC)`);
      if (molesTop) {
        report("Found moles top", this.calls);
        molesTop.classList.add("SOFC");
        observers.moles.start();
      }

      // New popouts?
      let popOutsTop = get(`${sel.composePopoutTop}:not(.SOFC)`);
      if (popOutsTop) {
        report("Found popout top", this.calls);
        popOutsTop.classList.add("SOFC");
        observers.popouts.start();
      }

      // New shadowbox?
      // TODO: more to do here to actually use this to show video attachments inline
      // let shadowbox = get(".aLF-aPX:not(.SOFC)");
      // if (shadowbox) {
      //   report("Found new shadowbox");
      //   shadowbox.classList.add("SOFC");
      // }
    },

    detectDrag() {
      report("Drag state changed", document.body.style.cursor);
      if (document.body.style.cursor.indexOf("closedhand.cur") > -1) {
        el.html.classList.add("isDragging");
        el.nav.classList.add("bym");
      } else {
        el.html.classList.remove("isDragging");
        el.nav.classList.remove("bym");
      }
    },
  },

  // Find new menus and modify them as needed (set input placeholder text, add options, etc)
  // TODO: This isn't being used right now.
  menus: {
    find() {
      // Menus are usually added as empty divs with .J-M and other classes for the specific menu
      // When the menu is opened, the menu is actually set up
      // A lot of menus are removed from the DOM and added back as needed

      // let newMenus = gets('body > div[role="menu"]');
      // TODO: Use sass variables
      let newMenus = gets("body > div.J-M");

      if (newMenus.length > 0) {
        newMenus.forEach((menu) => {
          report("Menu opened", menu);

          menu.classList.add("SOFC");
          // TODO: I'm not actually observing them though for when they are opened. Most are removed from dom on closing but not all.

          if (menu.classList.contains("brx")) {
            report("Snooze menu opened", menu);
          }

          // TODO: Add placeholder text to label and move to menus
        });
        report("Found new menus", newMenus);
      }
    },
  },

  title: {
    obs: null,
    title: null,
    locked: false,
    count: 0,

    // Regular expressions for different title modification settings
    regex: {
      hideUnreadCount: / \([0-9,]+\)/,
      hideEmail: undefined,
      hideAll: undefined,
    },

    check() {
      // Initialize the regexes that use the email address
      if (this.regex.hideEmail === undefined && subscription.email) {
        this.regex.hideEmail = new RegExp(` - ${subscription.email} - .+$`);
        this.regex.hideAll = new RegExp(
          `( \\([0-9,]+\\))? - ${subscription.email} - .+$`
        );
      }

      // let currentTitle = this.title.innerText;
      document.title = document.title.replace(
        this.regex[preferences.modifyTitle],
        ""
      );
      // this.title.innerText = currentTitle.replace(/ \(\d+\) - /i, " - ");

      // Unlock observer
      setTimeout(() => {
        observers.title.locked = false;
      }, 200);
    },

    start() {
      if (!preferences.hideTitleUnreadCount) return;

      // Don't monitor title if tab is pinned
      if (is.tabPinned === true) {
        report("Tab is pinned. Don't observe tab title.");
        return;
      }

      report("Tab is not pinned. Start title observer.");

      if (this.obs === null) {
        this.obs = new MutationObserver(() => {
          if (!is.simplifyOn || preferences.modifyTitle === "disabled") return;

          if (!observers.title.locked) {
            this.count += 1;
            report("Title mutation", this.count);

            // Lock observer so changing the title doesn't create an infinite loop
            observers.title.locked = true;
            observers.title.check();
          }
        });
      }
      if (!this.title) {
        this.title = get("head title");
      }
      this.obs.observe(this.title, observers.config.contentOnly);
      this.check();
    },

    disconnect() {
      if (this.obs !== null) {
        this.obs.disconnect();
        this.obs = null;
      }
    },
  },

  // Observe window events
  window: {
    resizeCount: 0,
    clickCount: 0,
    mouseOutCount: 0,
    listenForDrag: true,

    resize() {
      if (!is.simplifyOn) return;

      observers.window.resizeCount += 1;
      report("Window resized", observers.window.resizeCount);

      if (hasAnyClass(["vPane", "hPane"]) && !is.settings) {
        readingPane.detectSize();
      }
    },

    dragInit() {
      document.addEventListener(
        "dragenter",
        () => {
          observers.window.listenForDrag = true;
        },
        false
      );

      document.addEventListener(
        "dragover",
        (e) => {
          if (observers.window.listenForDrag) {
            e.dataTransfer.dropEffect = "copy";
            let draggingImage =
              e.dataTransfer.items[0]?.type?.indexOf("image/") > -1;
            if (draggingImage) {
              el.html.classList.add("draggingImage");
            } else {
              el.html.classList.remove("draggingImage");
            }
            observers.window.listenForDrag = false;
          }
        },
        false
      );
    },

    click(e) {
      if (!is.simplifyOn || !check.click) return;

      observers.window.clickCount += 1;
      // report("Click count", observers.window.clickCount);

      // Make sure there aren't any unobserved composers
      compose.check(true);

      // If clicking on a hidden email signature, show it
      if (
        e.target.getAttribute("data-smartmail") === "gmail_signature" ||
        e.target.id.search(/m_.*Signature/) >= 0
      ) {
        e.target.classList.add("show");
      }
    },

    mouseout(e) {
      if (!is.simplifyOn) return;

      // Sometimes it is useful to not have things close when the mouse leaves the window
      // if (preferences.debug) return;
      observers.window.mouseOutCount += 1;

      if (
        e.clientY <= 0 ||
        e.clientX <= 0 ||
        e.clientX >= window.innerWidth ||
        e.clientY >= window.innerHeight
      ) {
        report(
          "The mouse has left the building",
          observers.window.mouseOutCount
        );
        nav.unpeek();
        chat.unpeek();
        appMenu.close();
      }
    },
  },

  // TODO: Disconnect all observers -- should we do this when Simplify is temporarily disabled?
  // disconnectAll() {
  // },
};

// Start observing the loading screen right away
observers.loading.start();



// Copyright (C) Michael Leggett, Made Simple LLC - All Rights Reserved
// Proprietary and confidential; Unauthorized copying or redistribution of this file,
// via any medium is strictly prohibited; Written by Michael Leggett (hi@simpl.fyi)

// ==========================================================================
// OTHER EXTENSIONS

// Add functionality to profile button in top right
const otherExtensions = {
  calls: 0,
  waitTime: 1000,
  nextSlot: 78,
  observers: {},

  // Third party extension app menu bar icons
  extensions: [
    {
      name: "MixMax",
      width: 47,
      ok: true,
    },
    {
      name: "Boomerang",
      width: 44,
      ok: true,
    },
    {
      name: "Streak",
      width: 90,
      closest: ".inboxsdk__appButton",
      ok: true,
    },
    {
      name: "Sortd",
      fullName: "Sortd for Gmail",
      width: 120,
      closest: ".inboxsdk__appButton",
      ok: false,
    },
    {
      name: "Gmass",
      width: 135,
      ok: true,
      parent: true,
    },
    {
      name: "Mailtrack",
      width: 60,
      ok: true,
    },
    {
      name: "Copper",
      fullName: "Copper CRM for Gmail",
      width: 48,
      ok: true,
    },
    {
      name: "Hubspot",
      fullName: "HubSpot Sales",
      closest: "div",
      width: 48,
      ok: true,
    },
    {
      name: "Yesware",
      fullName: "Yesware for Chrome",
      width: 0,
      ok: false,
    },
    {
      name: "Flowcrypt",
      width: 0,
      ok: true,
    },
    {
      name: "Salesforce",
      fullName: "Salesforce",
      width: 50,
      ok: true,
    },
    {
      name: "Drag",
      fullName: "Drag: Organize and Share your Inbox",
      width: 70,
      closest: ".inboxsdk__appButton",
      ok: false,
    },
    {
      name: "InboxWhenReady",
      width: 0,
      ok: true,
    },
    {
      name: "ActiveInbox",
      fullName: "ActiveInbox: Organize Gmail tasks",
      width: 44,
      ok: true,
    },
    {
      name: "Chq",
      width: 37,
      ok: true,
    },
    {
      name: "ChqTabs",
      fullName: "Gmail Tabs by cloudHQ",
      width: 0,
      ok: true,
    },
    {
      name: "ChqPause",
      width: 0,
      ok: true,
    },
    {
      name: "ChqResize",
      fullName: "Resize Gmail Sidebar by cloudHQ",
      width: 0,
      ish: " when using vertical split pane.",
      ok: false, // ish - bad in vPane
    },
    {
      name: "ChqTracker",
      fullName: "Free Email Tracker by cloudHQ",
      width: 37,
      ok: false,
    },
    {
      name: "ChqSort",
      width: 0,
      ok: true,
    },
    {
      name: "RightInbox",
      width: 40,
      closest: "div",
      ok: true,
    },
    {
      name: "DarkReader",
      fullName: "Dark Reader",
      width: 0,
      ok: false,
      ish: ". You can disable it for just Gmail.",
    },
    {
      name: "BananaTag",
      width: 48,
      closest: "div.inboxsdk__appButton",
      ok: true,
    },
    {
      name: "HippoVideo",
      width: 120,
      ok: true,
    },
    {
      name: "NightEye",
      fullName: "Dark Mode - Night Eye",
      width: 0,
      ok: false,
    },
    {
      name: "NightEyeGmail",
      fullName: "Gmail Dark Mode by Night Eye",
      width: 0,
      ok: false,
    },
  ],

  // Look for and place any 3rd party extensions
  // Called from appMenu.init()
  check() {
    if (this.calls > 13) {
      this.calls = 0;
      return;
    }

    // A few things to check only once
    if (this.calls === 3) {
      // Check if Mailplane is running on the 3rd call
      this.checkMailplane();

      // Short term fix for Inbox SDK to nullify their changes to the composer height
      if (get("html[data-inboxsdk-active-app-ids]")) {
        document.body.classList.add("inboxsdk_hack_disableComposeSizeFixer");
      }
    }

    otherExtensions.extensions.forEach((ext, i) => {
      if (ext.found === undefined) {
        let selector = sel[`oe${ext.name}`];
        let element = get(selector);

        if (element !== null) {
          if (!ext.ok) {
            const breaksWhen = ext.ish || " 😢";
            alerts.show(
              {
                title: `${ext.fullName} conflicts with Simplify${breaksWhen}`,
                body: `For an optimal Gmail experience, disable either ${ext.fullName} or Simplify.`,
              },
              "Manage extensions",
              ext.name
            );
          }

          if (ext.width > 0) {
            if (ext.parent) {
              element = element.parentNode;
            }
            if (ext.closest !== undefined) {
              element = element.closest(ext.closest);
            }

            element.setAttribute("data-simplify", "otherExtensions");
            element.setAttribute("data-ext-name", ext.name);

            // Set the right position of the element based on otherExtensions.nextSlot
            css.add(
              `html.simplify *[data-ext-name="${ext.name}"] { position: fixed; right: calc(${otherExtensions.nextSlot}px + var(--width-addOns)) !important; }`
            );

            // If any extensions were detected, we should move over the pagination so it doesn't overlap
            otherExtensions.nextSlot += ext.width;
            let rightMargin = this.nextSlot - 78;
            css.add(
              `html.simplify { --nudgePaginationOver: ${rightMargin}px; }`
            );
          }

          // ---------------------------------------------------------
          // Further ajustments for some extensions

          // Gmass breaks Simplify, but I can fix it
          if (ext.name === "Gmass") {
            let searchBox = get("header form");
            if (searchBox) {
              searchBox.parentNode.setAttribute("data-simplify", "Gmass");
            }
          }

          // Dark Reader makes the warning dialog hard to read
          else if (ext.name === "DarkReader") {
            gets("#simplifyAlert [data-darkreader-inline-color]").forEach(
              (el) => {
                el.removeAttribute("data-darkreader-inline-color");
                el.removeAttribute("style");
              }
            );
          }

          // Copper breaks Simplify, but I can fix it
          else if (ext.name === "Copper") {
            // el.html.classList.add("oeCopper");

            // Observe when Copper pane is opened/closed
            let copperRightPane = get(
              ".pw-shadow-host-widget.main-ember-application"
            ).shadowRoot.querySelector("#PWExtension");
            if (copperRightPane) {
              new MutationObserver(otherExtensions.isCopperOpen).observe(
                copperRightPane,
                observers.config.classAttributeOnly
              );
              otherExtensions.isCopperOpen();
            }
          }

          // Hubspot breaks Simplify, but I can fix it
          else if (ext.name === "Hubspot") {
            // Observe when Hubspot pane is opened/closed
            let hubspotRightPane = get(".sales-sidebar-container.hubspot");
            if (hubspotRightPane) {
              new MutationObserver(otherExtensions.isHubspotOpen).observe(
                hubspotRightPane,
                observers.config.styleAttributeOnly
              );
              otherExtensions.isHubspotOpen();
            }

            // Adjust the pop-over to line up with the app icon
            let rightMargin = this.nextSlot - 46;
            css.add(
              `html.simplify.oeHubspot .hubspot #popover-1 { right: calc(${rightMargin}px + var(--width-addOns)) !important; }`
            );

            // Observe when HubSpot button is clicked on as it is re-added to the DOM :(
            otherExtensions.observers["Hubspot"] = new MutationObserver(
              (mutations_list) => {
                mutations_list.forEach((mutation) => {
                  mutation.removedNodes.forEach((removed_node) => {
                    if (
                      removed_node.getAttribute("data-ext-name") === "Hubspot"
                    ) {
                      report("HubSpot button has been removed and re-added");
                      const newButton = get(".kratos__button_img").parentElement
                        .parentElement;
                      newButton.setAttribute(
                        "data-simplify",
                        "otherExtensions"
                      );
                      newButton.setAttribute("data-ext-name", ext.name);
                      // otherExtensions.observers["Hubspot"].disconnect();
                    }
                  });
                });
              }
            );

            const HubSpotButtonParent = get(
              "*[data-ext-name='Hubspot']"
            )?.parentElement;

            if (HubSpotButtonParent) {
              report("Observing Hubspot button removal");
              otherExtensions.observers["Hubspot"].observe(
                HubSpotButtonParent,
                { subtree: false, childList: true }
              );
            } else {
              report("Couldn't find Hubspot button to observe");
            }
          }

          // Puase Gmail by cloudHQ
          else if (ext.name === "ChqPause") {
            this.tagPauseGmailButton();
          }

          // ---------------------------------------------------------
          // Mark the extensions we find

          ext.found = true;
          report("Found a 3rd party extension", ext.name);
          el.html.classList.add("otherExtensions", `oe${ext.name}`);
        }
      }
    });

    // Slow down the last few calls in case some extensions take a long time to load
    if (this.calls === 10) {
      this.waitTime = 2500;
    }
    this.calls += 1;
    setTimeout(otherExtensions.check.bind(this), this.waitTime);
  },

  checkMailplane() {
    if (document.body.classList.contains("mp4-gmail")) {
      // Test if not vPane and use !navigator.wakeLock as test for Chrome v79+
      if (!el.html.classList.contains("vPane") && !navigator.wakeLock) {
        // Show alert
        alerts.show(
          {
            title:
              "Mailplane only supports Simplify v2 in Vertical Split Pane (for now) 😢",
            body: "Mailplane currently uses an older version of Chrome that does not support all of Simplify v2's features.\n\nBUT, Mailplane does support Simplify if you use the Vertical Split Pane view which can be enabled under Gmail Settings > Inbox > Reading pane > Right of inbox.",
          },
          "Inbox settings",
          "Mailplane"
        );

        // Disable Simplify
        is.mailplaneDisabled = true;
        toggleSimplify("off");
      } else {
        is.mailplaneDisabled = false;
        toggleSimplify("on");
      }

      local.update("mailplaneDisabled", is.mailplaneDisabled);
    }
  },

  tagPauseGmailButton(tries = 0) {
    if (tries > 20) return;

    let pauseButton = get(".cloudhq-pause-inbox-button .z0");
    if (pauseButton) {
      pauseButton.classList.add("oeCompose");
    } else {
      setTimeout(() => {
        this.tagPauseGmailButton(tries++).bind(this);
      }, 1000);
    }
  },

  isCopperOpen() {
    let cooperRightPane = get(
      ".pw-shadow-host-widget.main-ember-application"
    ).shadowRoot.querySelector("#PWExtension");
    if (cooperRightPane) {
      if (cooperRightPane.classList.contains("is-expanded")) {
        el.html.classList.add("addOnsOpen", "oeCopper");
      } else {
        el.html.classList.remove("addOnsOpen", "oeCopper");
      }
    }
  },

  isHubspotOpen() {
    let hubspotRightPane = get(".sales-sidebar-container.hubspot");
    if (hubspotRightPane) {
      if (hubspotRightPane.style.display !== "none") {
        el.html.classList.add("addOnsOpen", "oeHubspot");
      } else {
        el.html.classList.remove("addOnsOpen", "oeHubspot");
      }
    }
  },

  // TODO: Keep the Grammarly button above the formatting bar
  keepGrammarlyVisible() {
    // Add a listener for the formatting button that moves the grammarly button if open or opened:
    // get('.IZ grammarly-extension').shadowRoot.querySelector("div[data-grammarly-part='button'] > div[style*='absolute']").style.top = "-58px"
  },
};



// Copyright (C) Michael Leggett, Made Simple LLC - All Rights Reserved
// Proprietary and confidential; Unauthorized copying or redistribution of this file,
// via any medium is strictly prohibited; Written by Michael Leggett (hi@simpl.fyi)

// ==========================================================================
// APP & ACTION BARS

// Add functionality to profile button in top right
const appMenu = {
  tries: 0,
  builds: 0,
  nextSlot: 236, // 192
  profile: null,
  closeMenu: null,

  // Gmail app menu bar buttons
  buttons: [
    {
      name: "readingPaneToggle",
      width: 54,
    },
    {
      name: "inputTools",
      width: 56,
    },
    {
      name: "offline",
      width: 44,
    },
  ],

  init() {
    // Only try so many times
    if (this.tries > retryAttempts) {
      error("Couldn't find profile button to build App Menu.");
      this.tries = 0;
      return;
    }

    this.profile = get(`${sel.accountButton}, ${sel.accountWrapper}`);

    if (!this.profile) {
      this.tries += 1;
      setTimeout(this.init.bind(this), retryIn);
      return;
    }
    this.tries = 0;

    // Open profile menu on hover
    this.profile.addEventListener("mouseover", () => {
      if (!is.settings) {
        el.html.classList.add("appMenuOpen");
        window.addEventListener("mouseout", observers.window.mouseout);
      }
    });

    // Create and add button to close profile menu
    const closeAppMenu = make("div", { id: "closeAppMenu" });
    closeAppMenu.addEventListener("mouseover", appMenu.close);
    document.body.appendChild(closeAppMenu);

    // Add Simplify menu button
    this.addSimplifyMenu();

    // Delegate accounts don't have the app switcher menu
    if (is.delegate) {
      this.nextSlot = 188; // 144
    }

    // Initialize the position of the Chat Status Menu
    this.placeChatStatus();

    // Build the app menu (find and place all the buttons in the right place)
    this.build();

    // Look for 3rd party extensions
    otherExtensions.check();
  },

  close() {
    el.html.classList.remove("appMenuOpen");
    window.removeEventListener("mouseout", observers.window.mouseout);
    el.html.classList.remove("simplifyMenuOpen");
  },

  // Correct the position of Status menu
  placeChatStatus() {
    css.add(
      `html.simplify.appMenuOpen ${sel.chatStatus} { right: calc(${appMenu.nextSlot}px + var(--width-addOns)) !important; }`
    );
  },

  // Build app menu (place various buttons in a row)
  build() {
    if (this.builds > 10) {
      this.builds = 0;
      return;
    }

    // Find and place Gmail icons in the app menu
    appMenu.buttons.forEach((button, i) => {
      if (button.found === undefined || !button.found) {
        let selector = sel[button.name];
        let element = get(selector);

        if (element !== null) {
          // Set the right position of the element based on appMenu.nextSlot
          selector.split(", ").forEach((s) => {
            css.add(`html.simplify ${s} { right: calc(${appMenu.nextSlot}px + var(--width-addOns)) !important; }`);
          });

          button.found = true;
          appMenu.nextSlot += button.width;

          // Correct position of Status menu
          appMenu.placeChatStatus();
        }
      }
    });

    // Some buttons sometimes show up well after load, keep trying for 15 seconds
    if (this.buttons.some((btn) => !btn.found)) {
      this.builds += 1;
      setTimeout(appMenu.build.bind(this), 1000);
    }
  },

  // Initialize the Simplify button and menu in the app bar
  addSimplifyMenu(tries = 0) {
    if (tries > 20) return;

    const settingsButton = document.querySelector(".FI");
    if (settingsButton) {
      // Add Simplify button
      const simplifyButton = make("div", { id: "simplifyButton" });
      settingsButton.parentElement.insertBefore(simplifyButton, settingsButton);

      // Add Simplify menu
      const simplifyMenu = make(
        "div",
        {
          id: "simplifyMenu",
          className: "t9",
        },
        make("img", { src: chrome.runtime.getURL("img/app/logo.png") }),
        make(
          "div",
          { id: "trialCountDown" },
          make("div", { id: "daysLeft", className: "menuItem text" }, "Trial ends in 14 days"),
          make("a", { href: "https://simpl.fyi/plans?from=gmail", target: "_new" }, "Sign up"),
          make(
            "a",
            {
              href: `https://simpl.fyi/account?addEmail=${subscription.email}`,
              target: "_new",
            },
            "Already signed up?"
          )
        ),
        make("div", { className: "menuDivider" }),
        make(
          "a",
          {
            id: "simplifyOptionsLink",
            href: chrome.runtime.getURL("prefs/edit.html"),
            className: "menuItem",
            ariaLabel: "Options",
            target: "_new",
          },
          "Simplify options"
        ),
        make(
          "a",
          {
            href: "https://simpl.fyi/account",
            id: "manageSubscription",
            className: "menuItem",
            ariaLabel: "Manage plan",
            target: "_new",
          },
          "Manage plan"
        ),
        make(
          "div",
          {
            id: "reportSimplifyIssue",
            className: "menuItem",
            ariaLabel: "Report issue",
            target: "_new",
          },
          "Report issue"
        ),
        make(
          "div",
          {
            id: "disableSimplify",
            className: "menuItem",
            ariaLabel: "Toggle Simplify off",
            target: "_new",
          },
          "Turn Simplify off"
        ),
        make(
          "div",
          {
            id: "enableSimplify",
            className: "menuItem",
            ariaLabel: "Toggle Simplify on",
            target: "_new",
          },
          "Turn Simplify on"
        ),
        make("div", { className: "menuDivider" }),
        // make("div", { className: "menuItem text" }, "Version 2.5.37"),
        make(
          "a",
          {
            href: "https://changelog.simpl.fyi/",
            className: "menuItem",
            ariaLabel: "What's new?",
            target: "_new",
          },
          "What's new? (v2.5.37)"
        ),
        make(
          "a",
          {
            href: "https://on.simpl.fyi",
            className: "menuItem",
            ariaLabel: "Newsletter",
            target: "_new",
          },
          "Newsletter"
        ),
        make(
          "a",
          {
            href: "https://simpl.fyi/privacy",
            className: "menuItem",
            ariaLabel: "Privacy policy",
            target: "_new",
          },
          "Privacy policy"
        ),
        make(
          "a",
          {
            href: "https://simpl.fyi/about",
            className: "menuItem",
            ariaLabel: "About Simplify",
            target: "_new",
          },
          "About Simplify"
        )
      );
      settingsButton.parentElement.insertBefore(simplifyMenu, settingsButton);

      // Add event listeners
      get("#simplifyButton").addEventListener("click", () => {
        el.html.classList.toggle("simplifyMenuOpen");
      });
      get("#reportSimplifyIssue").addEventListener("click", () => {
        reportIssue(true);
      });
      get("#enableSimplify").addEventListener("click", () => {
        toggleSimplify("on");
      });
      get("#disableSimplify").addEventListener("click", () => {
        toggleSimplify("off");
      });
    } else {
      report("Settings button not found to insert Simplify button", tries);
      setTimeout(() => {
        appMenu.addSimplifyMenu(tries + 1);
      }, tryIn);
    }
  },
};

// Initialize add ons
if (is.okToSimplify && simplify[u].addOnsOpen) {
  el.html.classList.add("addOnsOpen");
}



// Copyright (C) Michael Leggett, Made Simple LLC - All Rights Reserved
// Proprietary and confidential; Unauthorized copying or redistribution of this file,
// via any medium is strictly prohibited; Written by Michael Leggett (hi@simpl.fyi)

// ==========================================================================
// NAV

const nav = {
  tries: 0,
  catCalls: 0,
  detectCalls: 0,
  catToggleObs: null,
  navMoreObs: null,

  init() {
    // Only try so many times
    if (this.tries > retryAttempts) {
      error("Simplify > nav.init() > Cound't find menu button or nav");
      this.tries = 0;
      return;
    }

    el.menuButton = getEl("menuButton");
    el.nav = get(sel.nav);
    // el.navMail = get(sel.navMail);

    if (!el.menuButton || !el.nav) {
      this.tries += 1;
      setTimeout(this.init.bind(this), retryIn);
    } else {
      // Check for 2022 Gmail UI
      // if (count(".aeN ~ .aqn") > 0) {
      if (exists(".bkL.aqk, .bkL.aql")) {
        el.html.classList.add("newNav");
        sel.nav = ".aqn.aIH";
        sel.inboxLink = ".aqn.aIH .aim a[href*='#inbox']";

        // Create div for toggling appNav open/close
        const toggleAppNav = make("div#toggleAppNav");
        toggleAppNav.addEventListener("click", nav.toggleAppNav);
        document.body.appendChild(toggleAppNav);

        // Detect if the app bar is disabled in Gmail's settings
        if (!exists(".aeN ~ .aqn")) {
          el.html.classList.add("appNavOff");
          sel.nav = ".aeN";
          sel.inboxLink = ".aeN .aim a[href*='#inbox']";
        } else {
          // Alert about new toggle if app bar is enabled
          const alertMsg = {
            title: "Toggle Gmail's new app bar",
            body: "You can click on the toggle in the bottom left to show or hide Gmail's new app bar.",
          };
          if (Date.now() < 1660679917502) {
            alerts.show(alertMsg, "None", "appNavToggle");
          }
        }
      } else {
        el.html.classList.add("appNavOff");
      }

      el.nav = get(sel.nav);

      // Start nav observer
      observers.nav.observe();

      // Init hovering over the menu button to peek the nav
      el.menuButton.addEventListener("mouseover", nav.peek);

      // Init nav state
      this.detect(false);

      // Reset counter
      this.tries = 0;

      // Look for new Gmail Nav
      // TODO: use sass variable and get a better selector for this (all sections but the last)
      let newNavSections = gets(sel.chatNew + ":not(.adZ) .XS");
      if (newNavSections.length > 0) {
        report("Found new Gmail nav, adding event listeners");
        el.html.classList.add("newUI");
      }

      // Create div for closing unpeeking nav
      const closeNavPeek = make("div", { id: "closeNavPeek" });
      closeNavPeek.addEventListener("mouseover", nav.unpeek);
      document.body.appendChild(closeNavPeek);

      // Add missing sections
      this.addCategories();

      // Add hideInbox toggle
      this.addHideInboxToggle();
    }
  },

  toggle(event) {
    if (el.menuButton.getAttribute("aria-expanded") === "false") {
      report("Nav is open, lets close it");
      nav.close();
    } else {
      report("Nav is closed, lets open it");
      nav.open();
    }
  },

  detect(peek = true) {
    nav.detectCalls += 1;
    if (
      el.menuButton.getAttribute("aria-expanded") === "true" ||
      (el.menuButton.getAttribute("aria-expanded") === null &&
        simplify[u].navOpen)
    ) {
      report("Nav is open", nav.detectCalls);
      nav.open();
    } else {
      report("Nav is closed", nav.detectCalls);
      nav.close(peek);

      if (el.menuButton.getAttribute("aria-expanded") === null) {
        error("Nav state was null");
      }
    }
  },

  open() {
    el.html.classList.add("navOpen");
    local.update("navOpen", true);

    // Update the size of the reading pane if enabled
    // simplify[u].readingPaneType === "vPane"
    if (hasAnyClass(["vPane", "hPane"])) {
      readingPane.detectSize();
    }
  },

  close(peek = true) {
    el.html.classList.remove("navOpen");
    local.update("navOpen", false);

    // Don't peek nav when closing as part of initialization
    if (peek) {
      el.html.classList.add("navPeek");
    }

    // Update the size of the reading pane if enabled
    if (hasAnyClass(["vPane", "hPane"])) {
      readingPane.detectSize();
    }
  },

  peek() {
    if (
      is.simplifyOn &&
      !hasAnyClass(["navOpen", "navPeek"]) &&
      !is.appNavOn()
    ) {
      report("Hover over menu button");
      el.html.classList.add("navPeek");
      el.nav.classList.add("bym");
      // el.navMail?.classList.add("bym");

      window.addEventListener("mouseout", observers.window.mouseout);
    }
  },

  unpeek() {
    report("Mouse out menu button or out of window. Unpeek nav.");
    el.html.classList.remove("navPeek");
    el.nav.classList.remove("bym");
    // el.navMail?.classList.remove("bym");

    if (is.msg && simplify[u].navOpen) {
      el.html.classList.add("navOpen");
      el.nav.classList.remove("bhZ");
    }

    window.removeEventListener("mouseout", observers.window.mouseout);
  },

  toggleAppNav() {
    const onOff = el.html.classList.toggle("showAppNav");
    chrome.storage.local.set({ showAppNav: onOff });
  },

  addHideInboxToggle(tries = 0) {
    report("Setting up hide inbox toggle");

    // Stop trying if can't find inbox link
    if (tries > retryAttempts) return;

    // Is the inbox link already set up?
    const inboxLinkWrapper = get(sel.inboxLink)?.closest(".aim");
    if (!inboxLinkWrapper) {
      setTimeout(() => nav.addHideInboxToggle(tries + 1), retryIn);
      return;
    }

    if (inboxLinkWrapper.classList.contains("inboxLink")) {
      report("Inbox link observer already set up");
      return;
    }

    // Add classname to inbox nav item
    inboxLinkWrapper.classList.add("inboxLink");

    // Set up toggle if not already there
    if (!get("#showHideInbox")) {
      // Add show/hide toggle
      const toggleInbox = make("div", { id: "showHideInbox" });
      const inboxLink = get(sel.inboxLink).closest(".TN");
      inboxLink.insertBefore(toggleInbox, inboxLink.firstChild);

      get("#showHideInbox").addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        lists.showHideInbox();
      });

      // Resetup the observer
      observers.nav.observeInbox();
    }
  },

  addCategories() {
    // Don't add categories if setting is disabled
    if (!preferences.addCategories || !is.simplifyOn) return;

    nav.catCalls += 1;
    report("Add categories?", nav.catCalls);

    // Don't add the categories if they have already been added
    if (get(".aim:not([data-category]) + .aim[data-category]")) return;

    // If you drag the whole categories folder, it abandons the previously added categories which can mess things up
    // TODO: Use sass variables
    let strandedCategories = get(".TK .aim[data-category]:first-child");
    if (strandedCategories) {
      let strandedRoot = strandedCategories.parentNode;
      while (strandedRoot.firstChild) {
        strandedRoot.removeChild(strandedRoot.firstChild);
      }
    }

    // Determine if we can add categories
    let categoryLink = get('.byl a[href*="#category/"]');
    let categoryItem = null;
    let categoryGroup = null;
    if (categoryLink) {
      categoryItem = categoryLink.closest(".aim");
      categoryGroup = categoryLink.closest(".TK");
    } else {
      categoryGroup = get(
        '.byl.aJZ.a0L:not(.TA) > .TK > .aim:first-child:last-child div[role="link"]'
      );
      if (categoryGroup) {
        categoryGroup = categoryGroup.closest(".TK");
      }
    }

    // Setup observer on categories expander
    if (categoryGroup && !categoryGroup.classList.contains("SOFC")) {
      categoryGroup.classList.add("SOFC");
      if (nav.catToggleObs === null) {
        nav.catToggleObs = new MutationObserver(nav.addCategories);
      }
      nav.catToggleObs.observe(
        categoryGroup,
        observers.config.directChildrenOnly
      );
    }

    // If none of the categories are visible, I can't set them up
    if (!categoryLink) {
      // Setup observer on More labels (.HwgYue) being shown/hidden
      // TODO: Use sass variable
      let moreNav = get(".wT span[gh='mll']:not(.SOFC)");
      if (moreNav) {
        moreNav.classList.add("SOFC");

        if (nav.navMoreObs === null) {
          nav.navMoreObs = new MutationObserver(nav.addCategories);
        }
        nav.navMoreObs.observe(moreNav, observers.config.classAttributeOnly);
      }

      // Can't add categories now, so exit
      return;
    }

    // Add three new categories
    Object.keys(categories).forEach((key) => {
      let newCategory = categoryItem.cloneNode(true);
      newCategory.setAttribute("data-category", key);
      newCategory.addEventListener("click", (e) => {
        location.hash = categories[key];

        // Give item a selected background color
        let activeNavItem = e.target.closest(".TO");
        if (activeNavItem) activeNavItem.classList.add("nZ", "aiq");

        // We need to check the category highlights until we're not on an added category again
        check.categories = true;
      });
      categoryGroup.appendChild(newCategory);

      // Update name
      let newLink = get(`.aim[data-category='${key}'] a`);
      newLink.innerText = key;
      newLink.href = categories[key];

      // Update tool tip
      let newLinkWrapper = get(`.aim[data-category='${key}'] .TO`);
      if (newLinkWrapper) newLinkWrapper.setAttribute("data-tooltip", key);

      // Make unbold (in case we cloned an unread link to begin with)
      get(`.aim[data-category='${key}'] span.n1`)?.classList.remove("n1");
    });

    // Remove special category color
    gets(".aim[data-category] .TO").forEach((item) => {
      item.classList.remove("aS3", "aS4", "aS5", "aS6");
    });

    // Remove bold
    // gets(".aim[data-category] span.nU.n1").forEach((item) => {
    //   item.classList.remove("n1");
    // });
  },
};

observers.nav = {
  toggleObserver: new MutationObserver(nav.detect),
  inboxObserver: new MutationObserver(nav.addHideInboxToggle),

  observe() {
    if (el.menuButton) {
      this.toggleObserver.observe(el.menuButton, observers.config.ariaExpanded);
    }
  },

  observeInbox() {
    const inboxLink = get(".aim.inboxLink:not(.SOFC)");
    if (!inboxLink) return;

    inboxLink.classList.add("SOFC");
    const inboxParent = inboxLink.parentNode;
    if (inboxParent) {
      this.inboxObserver.observe(
        inboxParent,
        observers.config.directChildrenOnly
      );
      report("Observing .inboxLink parent");
    } else {
      report("Could not find .inboxLink");
    }
  },
};



// Copyright (C) Michael Leggett, Made Simple LLC - All Rights Reserved
// Proprietary and confidential; Unauthorized copying or redistribution of this file,
// via any medium is strictly prohibited; Written by Michael Leggett (hi@simpl.fyi)

// ==========================================================================
// LISTS

const lists = {
  scanTries: 0,
  zeroTries: 0,
  groupCalls: 0,
  scanCalls: 0,
  scanning: false,
  selectDir: undefined,

  init() {
    // Initialize the month2 name
    // TODO: Use sass variables
    let monthIndex = dates.month < 2 ? dates.month + 10 : dates.month - 2;
    if (monthNamesAll[lang] !== undefined) {
      css.add(
        `html.simplify.dateGroup .ae4 tr[date="month2"]::before { content: '${monthNames[monthIndex]}' !important; }`
      );
    }

    this.scan();
    this.initializeHideInbox();
    observers.lists.observeParent();
  },

  // Setup inboxHidden div and actions
  initializeHideInbox() {
    // Don't set it up if it is already there
    if (exists("#inboxHidden")) return;

    // Build the elements
    // prettier-ignore
    const inboxHidden = make( "div", { id: "inboxHidden" },
      make( "div", { id: "hideInboxMsg" },
        make("span", { id: "howLongHidden" }, "Inbox hidden."),
        make("span", { id: "unhideInbox", className: "link" }, "Unhide"),
        make("span", { id: "showHiOptions", className: "link" }, "Options")
      ),
      make("div", { id: "hideInboxOptions" },
        make("div", { id: "disableNotifs", className: "hiOption" }, "Disable notifications when inbox is hidden"),
        make("div", { id: "hideInboxOnLoad", className: "hiOption" }, "Hide inbox by default on initial load"),
        make("div", { id: "kbsHideInbox", className: "hiOption" }, "Toggle inbox with Alt+H (⌥H on Mac)"),
        make("button", { id: "closeHiOptions" }, "Done")
      )
    );

    // Add the elements to the DOM
    document.body.appendChild(inboxHidden);

    // Add all the actions to the elements
    get("#showHiOptions").addEventListener("click", () => {
      get("#inboxHidden").classList.add("showOptions");
    });
    get("#closeHiOptions").addEventListener("click", () => {
      get("#inboxHidden").classList.remove("showOptions");
    });
    get("#unhideInbox").addEventListener("click", () => {
      lists.showHideInbox(true);
    });
    get("#hideInboxOnLoad").addEventListener("click", () => {
      const onOff = get("#hideInboxOnLoad").classList.toggle("on");
      chrome.storage.local.set({ hideInboxOnLoad: onOff });
    });
    get("#kbsHideInbox").addEventListener("click", () => {
      const onOff = get("#kbsHideInbox").classList.toggle("on");
      chrome.storage.local.set({ kbsHideInbox: onOff });
    });

    // Setup disabling notifications setting & action
    if (is.safari || is.firefox) {
      // I haven't tested optional permissions with Firefox and Safari yet
      get("#disableNotifs").remove();
    } else {
      get("#disableNotifs").addEventListener("click", () => {
        const onOff = get("#disableNotifs").classList.toggle("on");
        chrome.storage.local.set({ disableNotifs: onOff });
        if (onOff) {
          chrome.runtime.sendMessage({ action: "disable_notifications" });
        } else {
          chrome.runtime.sendMessage({ action: "enable_notifications" });
        }
      });
    }

    // Initialize prefs
    chrome.storage.local.get(
      { hideInboxOnLoad: false, disableNotifs: false, kbsHideInbox: true },
      (prefs) => {
        if (prefs.hideInboxOnLoad) {
          get("#hideInboxOnLoad").classList.add("on");
        }
        if (prefs.disableNotifs && !is.safari && !is.firefox) {
          get("#disableNotifs").classList.add("on");
        }
        if (prefs.kbsHideInbox) {
          get("#kbsHideInbox").classList.add("on");
        }
      }
    );
  },

  showHideInbox(forceOff) {
    // Toggle Inbox
    let justHidden = true;
    if (forceOff) {
      el.html.classList.remove("hideInbox");
    } else {
      justHidden = el.html.classList.toggle("hideInbox");
    }

    // Toggle notifications if they were off
    if (
      !is.safari &&
      !is.firefox &&
      get("#disableNotifs").classList.contains("on")
    ) {
      if (justHidden) {
        chrome.runtime.sendMessage({ action: "disable_notifications" });
      } else {
        chrome.runtime.sendMessage({ action: "enable_notifications" });
      }
    }
  },

  // This is called every time the view changes
  scan() {
    if (!is.list || !is.simplifyOn) {
      return;
    }

    lists.scanCalls += 1;

    // Only try to find the element to observe so many times
    if (lists.scanTries > retryAttemptsFew) {
      lists.scanTries = 0;
      report("Cound't find any new lists");
      return;
    }

    // Find ALL lists that aren't ads
    const allLists = gets(sel.allLists);

    if (allLists.length === 0) {
      report("Didn't find any lists. Will scan again.");
      lists.scanTries += 1;
      setTimeout(lists.scan, retryIn);
    } else {
      report(
        `Scanning found lists after ${lists.scanTries} tries. ${lists.scanCalls} total calls.`
      );

      // Group threads by date
      lists.groupByDate();

      // Check for ads
      lists.checkForAds();

      // checkInboxZero
      lists.checkInboxZero();

      // Observe lists
      lists.observe();

      // Re-setup action bar observer and minimized search button
      observers.actionBar.start();

      // TODO: Rescan for reading pane toggles? (switching inbox types creates a new button)
      readingPane.findToggle(true);

      // Reset counter
      lists.scanTries = 0;
    }
  },

  observe() {
    // Find lists not already being observed
    // const unobservedLists = gets(`${sel.allLists}:not(.SOFC)`);

    gets(sel.scanListsUnobserved).forEach((list) => {
      observers.lists.observeList(list);
    });
  },

  adsObserver: new MutationObserver(() => lists.checkForAds),
  checkForAds() {
    // Ads are only in the Tabbed Inbox
    // TODO use sass variables or something from sel
    // TODO: .ast is new... need new better way to find this
    // TODO: Is .AA stable? (as part of a replacement for .ast and .a3x)
    if (is.inbox && is.tabbedInbox) {
      // gets(`div[role='main'] .ae4:not([style*='none']) .Cp tbody:not(:empty) ${sel.msgAdLabel}:not(.adLabel), div[role='main'] .ae4:not([style*='none']) .Cp tbody:not(:empty) span.ast:not(.adLabel)`)
      gets(
        "div[role='main'] .ae4:not([style*='none']) .Cp tbody:not(:empty) .xY.AA .yW > span + span > span:not(.adLabel)"
      ).forEach((advert) => {
        advert.classList.add("adLabel");
        advert.closest(".zA").classList.add("advert");
      });

      gets("tr.zA.advert").forEach((advert) => {
        // Observe this table for new ads being injected
        const adContainer = advert.closest("tbody");
        const hasNonAds = exists("tr.zA:not(.advert)", adContainer);

        if (hasNonAds) {
          adContainer.closest(".Cp").classList.remove("adverts");
        } else {
          adContainer.closest(".Cp").classList.add("adverts");
          adContainer.classList.remove("grouped");
          if (!adContainer.classList.contains("SOFC")) {
            lists.adsObserver.observe(
              adContainer,
              observers.config.directChildrenOnly
            );
            adContainer.classList.add("SOFC");
          }
        }
      });
    }
  },

  // TODO: If you're using multiple inboxes, this doesn't work as
  // messages can be outside of the inbox
  checkInboxZero() {
    if (!is.inbox) {
      el.html.classList.remove("inboxZero");
      return;
    }

    // TODO: Use sass variables
    if (exists(`${sel.currentList} tr.zA:not(.advert)`)) {
      el.html.classList.remove("inboxZero");
    } else if (exists("div[role='main'] .ae4.iR:not([style*='none'])")) {
      report("Inbox section collapsed, can't test for inbox zero");
      el.html.classList.remove("inboxZero");
    } else {
      report("Inbox zero!");
      el.html.classList.add("inboxZero");
    }

    // Tag any empty sections in Multiple Inboxes
    // TODO: Use sass variables
    gets(".emptySection").forEach((s) => s.classList.remove("emptySection"));
    gets(".Nu.W7 .ae4:not(.iR) div:not([class]) ~ .Cp tbody:empty").forEach(
      (emptySection) => {
        emptySection.closest(".ae4").classList.add("emptySection");
      }
    );
  },

  groupByDate() {
    // Skip if date grouping is disabled in preferences or language not supported
    if (!preferences.dateGroup || monthNamesAll[lang] === undefined) return;

    // Skip if already grouped and dates are not stale
    let anyThreads = count(sel.scanAllEmails) > 0;
    let allThreadsGrouped = count(sel.scanNotGroupedEmails) === 0;
    if (anyThreads && allThreadsGrouped && !dates.update()) return;

    // Get all the lists in the current view
    const emailLists = gets(sel.currentListToGroup);

    emailLists.forEach((list) => {
      this.groupCalls += 1;
      report("Group this list", this.groupCalls, list);

      // Initialize variables as date and group from last non-snoozed item in list
      let notSnoozed = gets(".byZ:empty ~ .xW > span", list);
      let lastDate =
        notSnoozed.length > 0
          ? dates.parse(Array.from(notSnoozed).slice(-1)[0].title, lang)
          : dates.today;

      let currentGroup = this.getDateGroup(lastDate);

      const threads = gets(".zA:not(.advert)", list) || [];

      Array.from(threads)
        .slice()
        .reverse()
        .forEach((thread) => {
          // Skip snoozed emails (the date they have is not the basis on their position in the list)
          if (get(".byZ > div", thread)) {
            thread.setAttribute("date", currentGroup);
            return;
          }

          let dateSpan = get(".xW > span", thread);
          if (!dateSpan) {
            report("Date grouping: thread had no date", thread);
            thread.setAttribute("date", currentGroup);
            return;
          }

          // Extract date from thread
          let threadDate = dates.parse(dateSpan.title, lang);

          // If threadDate is earlier than previous item, use currentGroup (this was a snoozed item)
          if (threadDate < lastDate) {
            thread.setAttribute("date", currentGroup);
            return;
          }

          currentGroup = this.getDateGroup(threadDate);
          lastDate = threadDate;
          thread.setAttribute("date", currentGroup);
        });
    });
  },

  getDateGroup(date) {
    if (date > dates.today) {
      return "today";
    } else if (date >= dates.yesterday) {
      return "yesterday";
    } else if (date >= dates.lastMon) {
      return "week";
    } else if (date >= dates.prevMonth[0]) {
      return "month0";
    } else if (date >= dates.prevMonth[1]) {
      return "month1";
    } else if (date >= dates.prevMonth[2]) {
      return "month2";
    } else if (date < dates.prevMonth[2]) {
      return "earlier";
    } else {
      error("getDateGroup couldn't compare date", date);
      return "today";
    }
  },

  autoSelectThread() {
    // Do not select thread if other threads are already selected
    if (
      count(
        `${sel.currentList} tr.zA div[role="checkbox"][aria-checked="true"]`
      ) > 0
    ) {
      report("Something is already selected, not selecting thread");
      return false;
    }

    // Find focused thread and select if not already selected (should always be unselected due to above check)
    const toSelect = get(
      `${sel.currentList} tr.btb:not(.aps) div[role="checkbox"][aria-checked="false"]`
    );
    if (toSelect) {
      clickOn(toSelect);
      return true;
    } else {
      return false;
    }
  },

  // Unselect first selected thread
  unAutoSelectThread() {
    // if thread not given, initialize to being the active thread
    let selectedThread = get(
      `${sel.currentList} tr.btb div[role="checkbox"][aria-checked="true"]`
    );
    if (selectedThread) {
      clickOn(selectedThread);
      return true;
    } else {
      return false;
    }
  },

  // Click on checkbox for focused thread
  selectThread() {
    if (!is.list) return;

    const focusedThread = get(`${sel.currentList} tr.btb div[role="checkbox"]`);
    if (focusedThread) {
      clickOn(focusedThread);
    }
  },

  // Used for Shift up/down to select multiple
  multiSelect(direction) {
    if (!is.list) return;

    const focusedThread = get(`${sel.currentList} tr.btb`);
    const nextThread =
      direction === "down"
        ? focusedThread?.nextSibling
        : focusedThread?.previousSibling;

    // If I can't find the focused or next thread, this isn't going to work
    if (!focusedThread || !nextThread) return;

    const focusedCheckbox = get('div[role="checkbox"]', focusedThread);
    const nextCheckbox = get('div[role="checkbox"]', nextThread);

    // If I've reverse unselected everything, time to switch directions
    const numSelected = count(`${sel.currentList} tr.x7`);
    if (numSelected === 0) {
      lists.selectDir = direction;
    }

    // Unselect if you reverse directions
    const unselect = direction !== lists.selectDir ? true : false;
    const checkIf = unselect ? "true" : "false";

    // Select the current message?
    if (focusedCheckbox.getAttribute("aria-checked") === checkIf) {
      clickOn(focusedCheckbox);
    }

    // Select the next/previous message?
    if (nextCheckbox.getAttribute("aria-checked") === checkIf) {
      clickOn(nextCheckbox);
    } else {
      // If not supposed to select it, double select it to move focus
      clickOn(nextCheckbox);
      clickOn(nextCheckbox);
    }
  },

  // Are all the sections collapsed on load time?
  // This causes a Gmail issue where the actions are shown
  // TODO: Use sass variables
  checkSections() {
    report("Checking inbox sections now");
    if (
      count("div[gh='tl'] .iR:not([style*='none'])") > 0 &&
      count("div[gh='tl'] .ae4") === count("div[gh='tl'] .iR")
    ) {
      report("Gmail loaded with all sections collapsed");

      // Get first collapsed section
      let section = get('div[gh="tl"] .iR:not([style*="none"]) .Wn');

      // Open it
      clickOn(section);

      // Close it again
      clickOn(section);

      // Rescan for the action bar as the select checkbox is only setup after the sections are toggled
      observers.actionBar.start();
    }
    // Don't need to check this again
    check.inboxSections = false;
  },
};

// Observe list for changes to scan for ads, inbox zero, grouping and more
observers.lists = {
  parentChangeCount: 0,

  parentObserver: new MutationObserver(() => {
    observers.lists.parentChangeCount += 1;
    report(
      "List watcher saw a change. Call lists.scan()",
      observers.lists.parentChangeCount
    );

    // Only scan the list if it is visible
    if (exists(sel.listTopActive)) {
      // Before we reset is.msg, check if we're leaving a message in reading pane
      if (is.msg && is.readingPane) check.readingPaneSize = true;

      // Update view state variables immediately
      is.list = true;
      is.msg = false;

      // Scan the list
      lists.scan("observers.lists.parentObserver");
    }
  }),

  listObserver: new MutationObserver((mutations) => {
    // TODO: This seems to fire multiple times a mutation happens, is that a problem?
    if (mutations.some((m) => m.addedNodes.length > 0)) {
      // const addedNodes = mutations.filter((m) => m.addedNodes.length > 0).map((m) => m.addedNodes);
      // addedNodes.forEach((nodeList) => { nodeList.forEach((node) => { node.classList.add("seen"); }); });
      // report("Added nodes", mutations, ...addedNodes);

      // Looking for a way to reduce the calls to lists.scan
      // if (count(sel.listTopActive) > 0) {
      //   report("List observer saw a change", mutations);
      //   lists.scan("observers.lists.listObserver");
      // } else {
      //   report("List oberver saw a change but list wasn't active");
      // }
      lists.scan("observers.lists.listObserver");
    }
  }),

  observeList(list) {
    if (!list || list.classList.contains("SOFC")) return;

    observers.lists.listObserver.observe(
      list,
      observers.config.directChildrenOnly
    );
    list.classList.add("SOFC");
    report("Now observing", list);
  },

  // Observe when the list view changes (this fires before the URL is
  // changed and is important to avoiding the user seeing the list
  // change as it is grouped and bundled)
  observeParent(tries = 0) {
    if (tries > 50) return;

    const listParent = get("[role='main']")?.parentNode.parentNode;

    if (!listParent) {
      report("Could not find mainParent list", tries);
      setTimeout(() => {
        observers.lists.observeParent(tries + 1);
      }, retryIn);
    }

    // Don't observe if already being observed
    if (listParent.classList.contains("SOFC")) return;

    observers.lists.parentObserver.observe(listParent, {
      attributes: true,
      childList: false,
      subtree: true,
      attributeFilter: ["role"],
    });

    listParent.classList.add("SOFC");
  },
};



// Copyright (C) Michael Leggett, Made Simple LLC - All Rights Reserved
// Proprietary and confidential; Unauthorized copying or redistribution of this file,
// via any medium is strictly prohibited; Written by Michael Leggett (hi@simpl.fyi)

// ==========================================================================
// CONVERSATION

const conversation = {
  tries: 0,

  async scan() {
    conversation.initTrackerBadge();
    conversation.hasHtmlEmail();
    // conversation.initReaderMode();

    // After 1 sec, look for video attachments to setup playing inline (they are lazy loaded)
    // await waitFor(1000);
    // report("Scanning for video attachments from conversation.scan");
    // conversation.enableVideos();
  },

  enableVideos() {
    if (!is.simplifyOn) return;
    const attachments = gets(".Bs .aQH > span > a:not(.attachmentThumb)");

    if (attachments.length > 0) {
      // Add click handler for video attachment
      attachments.forEach((attachment) => {
        report("Found an attachment. Setting up inline playing if a video...");
        attachment.classList.add("attachmentThumb");
        attachment.addEventListener("click", async (e) => {
          // Get the video url (only if it isn't a thumbnail for a Google Drive video)
          const url = e.target.closest(
            "span[download_url^='video/'] a.attachmentThumb:not([href*='googleusercontent.com/docs'])"
          )?.href;

          if (url && is.simplifyOn) {
            report("Clicked on video (.mp4) attachment");

            // Give the dialog a chance to be added to the DOM and/or Gmail to play the video
            await waitFor(200);

            let videoPlayer = get("#simplifyVideoPlayer source");
            if (videoPlayer) {
              videoPlayer.src = url;
            } else {
              // Setup video player
              videoPlayer = make(
                "div",
                { id: "simplifyVideoPlayer" },
                make(
                  "video",
                  { controls: "true", autoplay: "true" },
                  make("source", { src: url })
                )
              );

              const shadowbox = get(
                "div[role='dialog'] div[role='main']:not([style*='display: none'])"
              );
              if (shadowbox) {
                shadowbox.appendChild(videoPlayer);
                shadowbox.classList.add("simplifyPlayer");
              } else {
                report("No video dialog found");
              }
            }
          }
        });
      });
    } else {
      report("No new attachments found");
    }
  },

  // Close an open conversation
  close() {
    if (is.msgOpen) {
      // TODO: Use sass variables
      report("In reading pane w/ msg open, close conversation");
      const markRead = get(
        'div[gh="tm"] div[act="1"]:not([style*="display: none"])'
      );
      const markUnread = get(
        'div[gh="tm"] div[act="2"]:not([style*="display: none"])'
      );
      // const undo = markUnread.style.display !== "none";

      if (markUnread) {
        // Click mark unread
        clickOn(markUnread);

        // Close notification
        clickOnWhenReady('.vh div[role="button"]');

        // Click mark as read using hover action
        clickOnWhenReady(`${sel.currentList} .btb .bqX.brr`);

        // Close notification
        // clickOnDelay('.vh div[role="button"]', 1000);
        clickOnWhenReady('.vh div[role="button"]');
      }

      // Or if the message is still unread (b/c it was just opened)
      else if (markRead) {
        // Click mark read
        clickOn(markRead);

        // Close notification
        clickOnWhenReady('.vh div[role="button"]');

        // Click mark unread
        clickOnWhenActive(get('div[gh="tm"] div[act="2"]'), "self");

        // Close notification
        // clickOnDelay('.vh div[role="button"]', 1000);
        clickOnWhenReady('.vh div[role="button"]');
      }

      // // Mark conversation as unread
      // if (!markUnread) return;
      // clickOn(markUnread);

      // // Press undo button
      // // if (undo) clickOnWhenReady(".vh #link_undo");
      // // Click "Mark read" in list
      // const markRead = get(`${sel.currentList} .btb .bqX.brr`);
      // if (!markRead) return;
      // clickOnWhenReady(markRead);

      // // Press close on confirmation banner
      // clickOnWhenReady(".vh div[role='button']");
    } else if (is.msg) {
      report("In a conversation, return to list view: " + close.msg);
      let backButton = get('div[gh="tm"] div[act="19"]');
      url.ignore = true;
      if (backButton) {
        clickOn(backButton);
      } else {
        report("Coundn't find back button. Going to", close.msg);
        location.hash = close.msg;
      }
    }
  },

  hasHtmlEmail() {
    report("Checking for HTML emails");

    // Flag individual emails
    const msgCard = 'div.nH[role="main"]:not([style*="none"]) .ads';
    const msgCards = gets(`${msgCard}:not([style*="none"]):not(.htmlScanned)`);
    const msgRoot = ".a3s:not(.undefined):not(:empty)";
    const quotedRoot = ".a3s:not(.undefined):not(:empty) .h5 .gmail_quote";

    // Ways to detect an HTML email
    const headings = `${msgRoot} h1:not(:empty), ${msgRoot} h2:not(:empty), ${msgRoot} h3:not(:empty), ${msgRoot} h4:not(:empty), ${msgRoot} h5:not(:empty), ${msgRoot} h6:not(:empty)`;
    const qHeadings = `${quotedRoot} h1:not(:empty), ${quotedRoot} h2:not(:empty), ${quotedRoot} h3:not(:empty), ${quotedRoot} h4:not(:empty), ${quotedRoot} h5:not(:empty), ${quotedRoot} h6:not(:empty)`;
    const styled = `div[style*="background" i]:not(.gmail_chip):not([style*="background-color:rgba(255,255,255,1" i]):not([style*="background-color: rgba(255,255,255,1" i]):not([style*="background-color:rgba(255, 255, 255, 1" i]):not([style*="background-color: rgba(255, 255, 255, 1" i]):not([style*="background-color:rgb(255,255,255" i]):not([style*="background-color: rgb(255,255,255" i]):not([style*="background-color:rgb(255, 255, 255" i]):not([style*="background-color: rgb(255, 255, 255" i]):not([style*="background-color:white"]):not([style*="background-color: white"]):not([style*="background-color:#fff" i]):not([style*="background-color: #fff" i]):not([style*="background-color:transparent" i]):not([style*="background-color: transparent" i]):not([style*="background:rgba(255,255,255,1" i]):not([style*="background: rgba(255,255,255,1" i]):not([style*="background:rgba(255, 255, 255, 1" i]):not([style*="background: rgba(255, 255, 255, 1" i]):not([style*="background:rgb(255,255,255" i]):not([style*="background: rgb(255,255,255" i]):not([style*="background:rgb(255, 255, 255" i]):not([style*="background: rgb(255, 255, 255" i]):not([style*="background:white"]):not([style*="background: white"]):not([style*="background:#fff" i]):not([style*="background: #fff" i]):not([style*="background:transparent" i]):not([style*="background: transparent" i])`;
    const gmailHints = `${msgRoot} > u:first-child:empty, ${msgRoot} > .adM + u`;
    const qGmailHints = `${quotedRoot} > u:first-child:empty, ${quotedRoot} > .adM + u`;

    msgCards.forEach((message) => {
      const HtmlObjCount = count(
        `${headings}, ${msgRoot} table img:not(.emailTracker), ${msgRoot} iframe, ${msgRoot} ${styled}`,
        message
      );

      const QuotedHtmlObjCount = count(
        `${qHeadings}, ${quotedRoot} table img:not(.emailTracker), ${quotedRoot} iframe, ${quotedRoot} ${styled}`,
        message
      );

      const isHtmlMsg = HtmlObjCount > 0 && HtmlObjCount > QuotedHtmlObjCount;

      const isOutlookMsg = exists(
        `${msgRoot} div[class*='WordSection'] p.MsoNormal`,
        message
      );

      const styles =
        isHtmlMsg && !isOutlookMsg
          ? ["htmlScanned", "isHtmlMsg"]
          : ["htmlScanned"];

      report("Checked the message for html", isHtmlMsg, isOutlookMsg);
      message.classList.add(...styles);
    });

    // Only go further if it is an HTML email if user is using Dark Theme
    if (simplify[u].theme !== "darkTheme") return;

    // If set to not invert any message, flag all emails as htmlEmail
    // (I don't invert emails flagged as htmlEmail)
    if (preferences.invertMessages === "none") {
      el.html.classList.add("htmlEmail");
      return;
    }

    // If set to invert all messages, don't flag any email as htmlEmail
    else if (preferences.invertMessages === "all") {
      el.html.classList.remove("htmlEmail");
      conversation.tagLightBgs();
      return;
    }

    // This seems to work most the time but also catches some messages that don't need to be inverted
    const hasHtmlEmail =
      count('div.nH[role="main"]:not([style*="none"]) .ads.isHtmlMsg') > 0;

    if (hasHtmlEmail) {
      el.html.classList.add("htmlEmail");
    } else {
      el.html.classList.remove("htmlEmail");
    }
  },

  initReaderMode() {
    // Get .ade > .hk:first-child and insertBefore readerMode
    // html.simplify.readerMode { // Hide everything and zoom .a3s }
  },

  initTrackerDetails() {
    // Insert tracker details
    let trackerDetails = make(
      "div",
      { id: "trackerDetails" },
      make(
        "div",
        {},
        make(
          "b",
          {},
          "Simplify protected your privacy by blocking a tracker in this message."
        ),
        make(
          "p",
          {},
          "Email trackers can track if you opened the email, when you opened it, where you were located, and what device you were using (phone or computer). Some or all of this data could have been reported back to the sender."
        ),
        make(
          "p",
          {},
          "Simplify considers this an invasion of your privacy and blocks email trackers from gathering and reporting this information. You can read, reply, and forward this email without worrying about being tracked."
        )
      )
    );
    trackerDetails.addEventListener("click", () => {
      get("#trackerDetails").classList.remove("show");
    });
    document.body.appendChild(trackerDetails);
  },

  initTrackerBadge() {
    // Insert tracker badge before every star button on each message
    let stars = gets('.bAk .bi4[role="checkbox"]:not(.tbSetup)');
    stars.forEach((star) => {
      star.parentNode.insertBefore(
        make("div", { className: "trackerBadge" }),
        star
      );

      // Mark star so I don't add another tracker badge later
      star.classList.add("tbSetup");
    });
    gets(".trackerBadge").forEach((badge) =>
      badge.addEventListener("click", (event) => {
        get("#trackerDetails").classList.add("show");
        event.preventDefault();
        event.stopPropagation();
      })
    );
  },

  // Find elements with a background lighter than #eee and tag it so I
  // can make it match the darkTheme background (#111) when inverted
  tagLightBgs() {
    // TODO use sass variable for .a3s (message wrapper)
    let sel = ".a3s:not(.undefined) *[style*='background";

    // prettier-ignore
    gets(
      sel + ":rgb(255']," +
      sel + ": rgb(255']," +
      sel + "-color:rgb(255']," +
      sel + "-color: rgb(255']," +
      sel + ":#f']," +
      sel + ": #f']," +
      sel + "-color:#f']," +
      sel + "-color: #f']," + 
      sel + ":white']," +
      sel + ": white']," +
      sel + "-color:white']," +
      sel + "-color: white']," +
      ".a3s:not(.undefined) *[bgcolor*='#fff']"
    ).forEach((elem) => {
      if (elem.style.backgroundColor === "white") {
        elem.classList.add("simplifyEeeBg");
      } else if (elem.bgColor) {
        if (elem.bgColor.toLowerCase() === "#fff" || elem.bgColor.toLowerCase() === "#ffffff") {
          elem.classList.add("simplifyEeeBg");
        }
      } else {
        let [, r, g, b] = elem.style.backgroundColor.match(
          /rgb\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)/
        );
        if (r && g && b) {
          if (r === g && g === b && r > 238) {
            elem.classList.add("simplifyEeeBg");
          }
        }  
      }
    });
  },
};



// Copyright (C) Michael Leggett, Made Simple LLC - All Rights Reserved
// Proprietary and confidential; Unauthorized copying or redistribution of this file,
// via any medium is strictly prohibited; Written by Michael Leggett (hi@simpl.fyi)

// ==========================================================================
// SEARCH

const search = {
  form: null,
  input: null,
  tries: 0,
  delayClose: 100,

  init() {
    // Only try so many times
    if (this.tries > retryAttempts) {
      error("Cound't find search form or input.");
      this.tries = 0;
      return;
    }

    this.form = get('#gb form[role="search"]');
    this.input = get('#gb form input[name="q"]');

    if (!this.input || !this.form) {
      this.tries += 1;
      setTimeout(this.init.bind(this), retryIn);
    } else {
      // Return to previous view if you clear the search
      el.closeSearch.addEventListener("mousedown", (e) => {
        report("Clicked on clear search");
        if (is.search || is.label) {
          e.stopPropagation();
          search.exit();
          return;
        }
      });

      // Handle focusing the search input
      this.input.addEventListener("focus", (e) => {
        // TODO: test if the close button was clicked?
        /* This delays adding focus too much
        if (is.list && e.relatedTarget?.search(/closeSearch/) >= 0) {
          report("Search focused", e.relatedTarget);
          this.blur();
          return;
        }
        */

        el.html.classList.add("searchFocused");
        search.form.classList.add("focused");
        search.delayClose = 100;

        // Select the search if we're in a message
        if (is.msg) {
          search.input.selectionStart = 0;
          search.input.selectionEnd = 10000;
        }
      });

      // Focus search if not focused and empty when you click on the search button
      get("#gb form button.searchIcon")?.addEventListener("click", (e) => {
        if (
          el.html.classList.contains("searchFocused") ||
          search.input.value !== ""
        ) {
          return;
        }
        search.input.focus();
      });

      // Cancel defocusing search if clicking on a button inside search
      gets("button", this.form).forEach((button) => {
        button.addEventListener("mousedown", (e) => {
          report("Delay closing search to register click on search button");
          search.delayClose = 500;
        });
      });

      this.form.addEventListener("click", (e) => {
        report("Focus on search");
        search.input.focus();
      });

      // Handle bluring focus from the search input
      this.input.addEventListener("blur", (e) => {
        report("Blur focus from search");
        setTimeout(search.close, search.delayClose);
        search.delayClose = 100;
      });

      // Add starred only toggle if not added
      // let starToggle = make("button", { id: "starToggle" }, make("span", {}));
      // this.form.insertBefore(starToggle, el.closeSearch);
      // get("#starToggle").addEventListener("click", (e) => {
      //   report(e, this);

      //   // get("#starToggle").classList.toggle("on");
      //   e.target.closest("#starToggle").classList.toggle("on");
      // });
    }
  },

  close() {
    if (document.activeElement.name !== "q") {
      report("Closing search");
      el.html.classList.remove("searchFocused");
      search.form.classList.remove("focused");
    }
  },

  exit() {
    const inboxLink = get(sel.inboxLink);
    if (inboxLink) {
      clickOn(inboxLink);
    } else {
      location.hash = close.search;
    }

    // Requires a delay before bluring focus
    setTimeout(() => {
      search.input.blur();
      report("Remove focus from search");
    }, retryIn);
  },
};



// Copyright (C) Michael Leggett, Made Simple LLC - All Rights Reserved
// Proprietary and confidential; Unauthorized copying or redistribution of this file,
// via any medium is strictly prohibited; Written by Michael Leggett (hi@simpl.fyi)

// ==========================================================================
// COMPOSE

const compose = {
  checkTries: 0,
  obsFormatting: null,
  obsMinimize: null,
  molePopCount: 0,
  anyMoleCount: 0,
  checkCount: 0,
  fontSizeRemRegex: new RegExp(`font-size:\\s?${fontSizeRem}\\d*\\s?rem;?\\s?`, "gi"),
  fontSizePxRegex: new RegExp(`font-size:\\s?${fontSizePx}\\d*\\s?px;?\\s?`, "gi"),

  formattingCases: {
    font: 'div.Am.SOFC[contenteditable] *[style*="--simplify-font"]',
    fontSize: 'div.Am.SOFC[contenteditable] *[style*="--simplify-font-size"]',
    fontSizeRem: `div.Am.SOFC[contenteditable] *[style*="${fontSizeRem}"]`,
    fontSizePx: `div.Am.SOFC[contenteditable] *[style*="${fontSizePx}"]`,
    fontSizePxAll: 'div.Am.SOFC[contenteditable] *[style*=".0016px"]',
    fontStyle: 'div.Am.SOFC[contenteditable] *[style*="font-variant-ligatures"]',
    gDocsWrap:
      'div.Am.SOFC[contenteditable] *[dir="ltr"] span[style*="pre-wrap"], div.Am.SOFC[contenteditable] *[dir="ltr"] *[style*="white-space: pre"], div.Am.SOFC[contenteditable] *[dir="ltr"][style*="white-space: pre"]',
    darkThemeBg: 'div.Am.SOFC[contenteditable] *[style*="rgb(17, 17, 17);"]',
    lightThemeBg: 'div.Am.SOFC[contenteditable] *[style*="rgb(255, 255, 255);"]',
    safariFont: 'div.Am.SOFC[contenteditable] *[style*="font-family: -webkit-standard;"]',
    bullets: 'div.Am.SOFC[contenteditable] li:not([style*="0.6001"])',
    tracker: "div.Am.SOFC[contenteditable] .gmail_quote .emailTracker",
  },

  formattingCasesFlat: false,

  initFormattingCases() {
    if (preferences.httpsLinks) {
      compose.formattingCases.httpsLinks =
        "div.Am.SOFC[contenteditable] a[href^='http:']:not(.gmail_signature a):not(.gmail_quote a)";
    } else {
      compose.formattingCases.httpsLinks = null;
    }

    compose.formattingCasesFlat = Object.values(compose.formattingCases)
      .filter((selector) => selector !== null)
      .toString();
  },

  // This is only called when a node is added to an observed content editable div
  checkFormatting() {
    if (!is.simplifyOn) return;

    // Replace &nbsp; with a actual space so text can wrap
    // ISSUE: This moves the cursor placement to the start of the email = super annoying
    // Can I remember the cursor location and put it back there?
    // Is there a safer/better way to do this?
    // gets("div.SOFC[contenteditable]").forEach((composer) => {
    //   report("Found a &nbsp;");
    //   if (composer.innerHTML.search(/&nbsp;/) > -1) {
    //     composer.innerHTML = composer.innerHTML.replace(/&nbsp;/g, " ");
    //   }
    // });

    // Initialize formatting cases
    if (!compose.formattingCasesFlat) compose.initFormattingCases();

    // Cancel early if none of the other cases are found
    if (count(compose.formattingCasesFlat) === 0) return;

    report("checkFormatting found something...", compose.checkCount);

    // Remove inline styles for Simplify's font size adjustment
    gets(compose.formattingCases.font).forEach((styledEl) => {
      report("Found a styled element (font var)", styledEl);
      let newStyle = styledEl.getAttribute("style").replace(/font:\s?var\(--simplify-font\)\s?;?\s?/, "");
      styledEl.setAttribute("style", newStyle);
    });
    gets(compose.formattingCases.fontSize).forEach((styledEl) => {
      report("Found a styled element (font size var)", styledEl);
      let newStyle = styledEl
        .getAttribute("style")
        .replace(/font-size:\s?var\(--simplify-font-size\)\s?;?\s?/, "")
        .replace(/font-size:\s?calc\(\s?var\(--simplify-font-size\)\s?\+\s?\d+.\d{4}rem\s?\)\s?;?\s?/, "");
      styledEl.setAttribute("style", newStyle);
    });

    // NOTE: It is possible I don't need to look for REMs as it seems
    // to always paste as a px font size. But better safe than sorry.
    if (compose.formattingCases.fontSizeRem) {
      gets(compose.formattingCases.fontSizeRem).forEach((styledEl) => {
        report("Found a styled element (font size in rem)", styledEl);
        let newStyle = styledEl.getAttribute("style").replace(compose.fontSizeRemRegex, "");
        styledEl.setAttribute("style", newStyle);
      });
    }
    if (compose.formattingCases.fontSizePx) {
      gets(compose.formattingCases.fontSizePx).forEach((styledEl) => {
        report("Found a styled element (font size in px)", styledEl);
        let newStyle = styledEl.getAttribute("style").replace(compose.fontSizePxRegex, "");
        styledEl.setAttribute("style", newStyle);
      });
    }

    // This catches any varients of Simplify's font size from bumping font-size:small|large|xx-large
    gets(compose.formattingCases.fontSizePxAll).forEach((styledEl) => {
      report("Found a styled element (font size)", styledEl);
      let newStyle = styledEl.getAttribute("style").replace(/font-size:\s?\d\d.0016px;?/i, "");
      styledEl.setAttribute("style", newStyle);
    });

    // This catches any varients of Simplify's font family from being pasted in
    gets(compose.formattingCases.fontStyle).forEach((styledEl) => {
      report("Found a styled element (font-style)", styledEl);
      let newStyle = styledEl
        .getAttribute("style")
        .replace(/font-style:\s?normal;?\s?/i, "")
        .replace(/font-variant-ligatures:\s?normal;?\s?/i, "")
        .replace(/font-variant-caps:\s?normal;?\s?/i, "")
        .replace(/font-weight:\s?400;?\s?/i, "")
        .replace(/font-size:\s?small;?\s?/i, "")
        .replace(/overflow-wrap:\s?break-word;?\s?/i, "")
        .replace(/font-family:\s?[^;]+;\s?/i, "");
      styledEl.setAttribute("style", newStyle);
    });

    // Remove white-space:no-wrap from Google Docs pasted copy
    gets(compose.formattingCases.gDocsWrap).forEach((styledEl) => {
      report("Found a pre-wrap GDocs element", styledEl);
      let newStyle = styledEl.getAttribute("style").replace(/white-space:\s?pre(-wrap)?;?/i, "");
      styledEl.setAttribute("style", newStyle);
    });

    // Remove background styling from dark mode (#111 bg + any font color)
    gets(compose.formattingCases.darkThemeBg).forEach((styledEl) => {
      report("Found dark theme styling applied in compose", styledEl);
      let newStyle = styledEl
        .getAttribute("style")
        .replace(/background-color:\s?rgb\(17,\s?17,\s?17\);?/i, "")
        .replace(/(\s|;|^)color:\s?rgb\((\d{1,3},?\s?){3}\);?/i, "");
      styledEl.setAttribute("style", newStyle);
    });

    // Remove background styling from normal theme
    gets(compose.formattingCases.lightThemeBg).forEach((styledEl) => {
      report("Found light theme styling applied in compose", styledEl);
      let newStyle = styledEl
        .getAttribute("style")
        .replace("color: rgb(34, 34, 34);", "")
        .replace("background-color: rgb(255, 255, 255);", "");
      styledEl.setAttribute("style", newStyle);
    });

    // Remove Safari's extra styles added
    if (is.safari) {
      gets(compose.formattingCases.safariFont).forEach((styledEl) => {
        report("Found Safari-added styles", styledEl);
        let newStyle = styledEl
          .getAttribute("style")
          .replace(/font-family:\s?-webkit-standard;?\s?/, "")
          .replace(/font-size:\s?medium;?\s?/, "")
          .replace(/caret-color:\s?rgb\([0, ]*\);?\s?/, "")
          .replace(/color:\s?rgb\([0, ]*\);?\s?/, "");
        styledEl.setAttribute("style", newStyle);
      });
    }

    // Add space between bullets
    gets(compose.formattingCases.bullets).forEach((bullet) => {
      const currentStyle = bullet.getAttribute("style") || "";
      bullet.setAttribute("style", "padding-bottom:0.6001em; " + currentStyle);
    });

    // Remove any trackers from quoted text (when replying or forwarding an email that had a tracker)
    gets(compose.formattingCases.tracker).forEach((tracker) => {
      tracker.parentElement.removeChild(tracker);
    });

    // Upgrade http links to https if enabled and http is not in the link text
    if (preferences.httpsLinks) {
      gets(compose.formattingCases.httpsLinks).forEach((link) => {
        if (!/http:/.test(link.innerText)) {
          link.href = link.href.replace("http:", "https:");

          // Also replace the http in the link pop-up if there is one
          const linkPopup = get("#tr_test-link");
          if (linkPopup) {
            linkPopup.innerText = linkPopup.innerText.replace("http:", "https:");
          }
        }
      });
    }
  },

  check(singleCheck = false) {
    if (is.settings) return;

    if (compose.checkTries > 4) {
      report("Cound't find any new composers");
      compose.checkTries = 0;
      return;
    }

    let newComposers = gets("div.Am[contenteditable]:not(.SOFC)");
    if (newComposers.length === 0) {
      if (!singleCheck) {
        compose.checkTries += 1;
        setTimeout(compose.check, 500);
      }
    } else {
      report("Found new composers", newComposers);
      compose.checkTries = 0;

      if (compose.obsFormatting === null) {
        // compose.obsFormatting = new MutationObserver(compose.checkFormatting);
        compose.obsFormatting = new MutationObserver((mutations) => {
          compose.checkCount += 1;
          if (mutations.some((m) => m.addedNodes.length > 0)) {
            compose.checkFormatting();
          }
        });
      }

      // Check for external warnings
      compose.checkForExtWarning();

      newComposers.forEach((composeBody) => {
        // Check if inline composer is off screen in reverse sorted inbox
        if (preferences.reverseMsgs) {
          const composeScrollPos = composeBody.getBoundingClientRect()?.y;
          const scrollView = ["hPane", "vPane"].includes(readingPane.type) ? get("div.UI[gh='tl'] .Nu.S3") : get(".Tm");
          if (composeScrollPos && composeScrollPos < 0 && scrollView) {
            scrollView.scrollTop = 0;
          }
        }

        // Add mutation observer to listen for new nodes being added to
        // composer so we can check them for bad formatting
        compose.obsFormatting.observe(composeBody, observers.config.allChildren);

        // TODO: Add event listener on keydown for keyboard shortcuts and [Tab] key
        // composeBody.addEventListener('keydown', )

        composeBody.classList.add("SOFC");

        // If promoting formatting buttons enabled, close formatting bar parent as it causes page to scroll while typing
        if (preferences.composeFormat && is.simplifyOn) {
          // Slight delay so it can be created
          setTimeout(compose.closeFormattingBar, tryIn);
        }

        // Flag compose pop-outs that have From address field
        // compose.checkForFromField();

        // Add compose expand button if preference enabled
        if (preferences.composeActions) {
          let showComposeActions = make("div", {
            className: "showComposeActions",
          });

          // TODO use sass variables
          let composeActionBar = get(".bAK", composeBody.closest(".iN"));
          if (composeActionBar) {
            composeActionBar = composeActionBar.parentNode;
          }

          report("Adding compose actions expander", composeActionBar);
          if (composeActionBar) {
            composeActionBar.appendChild(showComposeActions);
            gets(".bAK ~ .showComposeActions:not(.active)").forEach((button) => {
              button.addEventListener("click", (event) => {
                event.target.closest(".iN").classList.toggle("showActions");
              });
              button.classList.add("active");
            });
          }
        }
      });
    }
  },

  closeFormattingBar() {
    // TODO: use sass variables -- only check in inline composers
    let formattingMenuButton = get('.Bs .oc.gU div[role="button"]');
    if (formattingMenuButton) {
      if (formattingMenuButton.getAttribute("aria-pressed") === "true") {
        clickOn(formattingMenuButton);
      }
    }
  },

  molePopMutations(mutations) {
    compose.molePopCount += 1;
    report("Checking for new composers...", compose.molePopCount);

    // Check if moles are open
    compose.anyOpenMoles();

    // If node was added, setup new moles
    if (!mutations || mutations.some((m) => m.addedNodes.length > 0)) {
      // Look for new content editable divs and watch for formatting issues
      compose.check();

      if (compose.obsMinimize === null) {
        compose.obsMinimize = new MutationObserver(compose.anyOpenMoles);
      }

      // Monitor mole minimize state
      let buttons = gets(`${sel.composeMinimize}:not([sofc])`);
      if (buttons.length > 0) {
        buttons.forEach((minimizeButton) => {
          compose.obsMinimize.observe(minimizeButton, observers.config.ariaLabel);
          minimizeButton.setAttribute("sofc", "true");
        });
      }
    }
  },

  // If inline reply is longer than window, send bar is pos:fixed and
  // does not move over with conversation when mole is opened/closed.
  // Putting focus in and out of inline reply resets left pos of fixed bar.
  jiggleStickySendBar() {
    let stickySendBar = get(".Bs .aDj.aDi, .Bs .aDj.ahe");
    if (stickySendBar) {
      report("Sticky send bar found");
      let activeEl = document.activeElement;
      let inlineReplyBody = get(".Bs .Am.editable.aO9");
      if (activeEl && inlineReplyBody && notEditing()) {
        activeEl.blur();
        inlineReplyBody.focus();

        setTimeout(() => {
          inlineReplyBody.blur();
          activeEl.focus();
        }, tryIn);
      }
    } else {
      report("Sticky send NOT bar found");
    }
  },

  // Flag compose pop-outs that have From address field
  // TODO: Use sass variables
  checkForFromField() {
    let fromFieldInPopOut = get(".xr form .zm, .aSt form .zm");
    if (fromFieldInPopOut) {
      fromFieldInPopOut.closest(".aoC").classList.add("hasFromField");
    }
  },

  // TODO: Use sass variables
  checkForExtWarning() {
    if (preferences.externalWarning === "no" && preferences.composeFormat) {
      const extWarnings = gets(".iN .ac4");
      extWarnings.forEach((warning) => {
        warning.closest(".aDg").dataset.warning = "true";
      });
    }

    // Click to close the external warning if hidden so tab+enter works to send
    // TODO: This causes focus issues if replying inline with a separate compose mole open
    // if (preferences.externalWarning !== "no") {
    //   setTimeout(() => {
    //     const extWarnings = gets(".iN .ac4");
    //     extWarnings.forEach((warning) => {
    //       const closeWarning = get("div[role='button']", warning);
    //       if (closeWarning) clickOn(closeWarning);
    //     });
    //   }, 500);
    // }
  },

  anyOpenMoles() {
    compose.anyMoleCount += 1;
    report("Checking to see if mole is open", compose.anyMoleCount);

    if (count(sel.composeMoleOpen) > 0) {
      el.html.classList.add("openMole");
    } else {
      el.html.classList.remove("openMole");
    }

    // Check if we need to jiggle any pinned send bars
    compose.jiggleStickySendBar();

    // Check for the to field on popped out composers
    // compose.checkForFromField();
  },
};



// Copyright (C) Michael Leggett, Made Simple LLC - All Rights Reserved
// Proprietary and confidential; Unauthorized copying or redistribution of this file,
// via any medium is strictly prohibited; Written by Michael Leggett (hi@simpl.fyi)

// ==========================================================================
// GMAIL THEMES

// Detect if a dark, light, or medium theme is being used and change styles accordingly
const theme = {
  detectCount: 0,

  detectColor() {
    if (is.delegate) {
      el.html.classList.add("defaultTheme");
      return;
    }

    const appSwitcher = get("#gbwa path");
    if (!appSwitcher) {
      error("Coundn't test theme - app switcher not loaded yet.");
      return;
    }

    // Test icon button color
    // const isLightTheme = getStyle(appSwitcher, "color").search(/255/) === -1;
    const iconBg = getStyle(appSwitcher, "color");
    const isDarkIcons = iconBg.search(/255/) === -1;

    // Test list background
    // This only works in the new Material You design
    const listBg = get(sel.listBg);
    let isDarkListBg;

    if (listBg) {
      listBg.classList.add("themeCheck");
      const listBgColor = getStyle(listBg, "background-color");
      if (listBgColor.search(/(0.8)|(255)/) !== -1) {
        isDarkListBg = listBgColor.search(/(0,)|(51,)/) !== -1;
        report("new theme check worked", listBgColor, isDarkListBg);
      } else {
        report("new theme check didn't work", listBgColor);
      }
      listBg.classList.remove("themeCheck");
    }

    // defaultTheme = Gmail's default theme
    // imgTheme = theme has an image background
    // lightTheme = light bg (dark icon buttons) + light list bg
    // mediumTheme = dark bg (white icon buttons) + light list bg
    // darkTheme = dark bg (white icon buttons) + dark list bg

    // If I couldn't test the listBg, probably in old Gmail where I have to be in list view

    // Reset theme classes
    el.html.classList.remove(
      "defaultTheme",
      "lightTheme",
      "mediumTheme",
      "darkTheme"
    );

    // Check if light theme based on icons (we can test in any view)
    if (isDarkIcons) {
      el.html.classList.add("lightTheme");
      local.update("theme", "lightTheme");
      report("Theme: detected light theme");
      check.theme = false;
    } else {
      if (isDarkListBg === undefined) {
        // TODO: There is an edge case bug where somehow the cached theme is wrong and the
        // initial load is in a tabbed inbox with the first tab being empty so you can't test
        // Would probably fix it to check the theme on switching tabs but it feels over kill
        el.html.classList.add(simplify[u].theme);
        report("Theme is dark or medium, will check later when in a list");
        check.theme = true;
      } else {
        const themeIs = isDarkListBg ? "darkTheme" : "mediumTheme";
        report("Theme color detected:", themeIs);
        el.html.classList.add(themeIs);
        local.update("theme", themeIs);
        check.theme = false;
      }
    }

    // Detect background color
    // TODO: This is flawed as I initialize the background as the cached color making it impossible to detect any updates
    let themeBgColor = getStyle("themeBg", "background-color");
    if (isDarkListBg) {
      themeBgColor = "rgb(17, 17, 17)";
    } else if (themeBgColor) {
      local.update("themeBgColor", themeBgColor);
      theme.setBgMeta(themeBgColor);
      // Test for the default theme
      const isDefaultTheme =
        themeBgColor === "rgb(241, 243, 244)" ||
        themeBgColor === "rgb(246, 248, 252)" ||
        themeBgColor.search(/255/) >= 0;
      if (isDefaultTheme) {
        local.update("theme", "defaultTheme");
        el.html.classList.add("defaultTheme");
      }
    } else {
      // I assume themes are disabled in this case; More info at https://github.com/leggett/simplify/issues/409
      report("Theme layer not found, themes probably disabled");
      local.update("theme", "defaultTheme");
      el.html.classList.add("defaultTheme");
    }

    // Detect background image (can be a css background or an img tag)
    let themeBgImgUrl = getStyle("themeBgImg", "background-image");
    let themeBgImgPos = getStyle("themeBgImg", "background-position");
    if (!themeBgImgUrl || themeBgImgUrl === "none") {
      themeBgImgUrl = get(sel.themeBgImgAlt)?.src || false;
      if (themeBgImgUrl) {
        themeBgImgUrl = `url("${themeBgImgUrl}")`;
        themeBgImgPos = "top";
        el.html.classList.add("imgTheme");
      } else {
        themeBgImgUrl = "none";
        themeBgImgPos = "";

        // Check for classic Gmail themes before declaring no image theme
        if (
          getStyle(".yL .wo", "background-image") === "none" &&
          getStyle(".yL .wn", "background-image") === "none"
        ) {
          el.html.classList.remove("imgTheme");
        } else {
          el.html.classList.add("imgTheme");
        }
      }
    }

    // TODO This is working at load time, but not after the theme is changed
    // TODO I'm not monitoring inline changes on the background image and I think I should
    theme.setBg(themeBgColor, themeBgImgUrl, themeBgImgPos);

    // Detect thread checkbox color to decide if darkTheme or mediumTheme
    if (is.list && check.theme) {
      // TODO: Use Sass variable
      const checkbox = get('tr.zA .xY div[role="checkbox"]');

      // We could be in a list view with no items
      if (checkbox) {
        const isTextInverted =
          getComputedStyle(checkbox)
            .getPropertyValue("background-image")
            .indexOf("white") > -1;
        if (isTextInverted) {
          el.html.classList.add("darkTheme");
          el.html.classList.remove("defaultTheme", "lightTheme", "mediumTheme");
          local.update("theme", "darkTheme");
          report("Theme: detected dark theme");
        } else {
          el.html.classList.add("mediumTheme");
          el.html.classList.remove("defaultTheme", "lightTheme", "darkTheme");
          local.update("theme", "mediumTheme");
          report("Theme: detected medium theme");
        }

        // No need to check for themes further
        check.theme = false;
      }
    }
  },

  detectDensity() {
    const densityTest = get('div[role="navigation"] .TN, .aqn.aIH .TN');
    if (!densityTest) return;

    if (parseInt(getStyle(densityTest, "height")) <= 26) {
      report("Theme: detected high density");
      el.html.classList.add("highDensity");
      el.html.classList.remove("lowDensity");
      local.update("density", "highDensity");
    } else {
      report("Theme: detected low density");
      el.html.classList.add("lowDensity");
      el.html.classList.remove("highDensity");
      local.update("density", "lowDensity");
    }
  },

  detectButtons(tries = 0) {
    if (tries > 10) return;

    // TODO use sass variables
    const secondButton = gets('div[gh="tm"] div[role="button"] > div')[2];
    if (secondButton) {
      const textButtonLabel = secondButton.innerText;
      if (textButtonLabel == "") {
        // Using icon buttons
        report("Icon button labels detected", tries);
        local.update("textButtons", false);
        el.html.classList.remove("textButtons");
      } else {
        // Using text buttons
        report("Text button labels detected", tries);
        local.update("textButtons", true);
        el.html.classList.add("textButtons");
      }
    } else {
      theme.detectButtons(tries + 1);
    }
  },

  detectSystemPref() {
    let simplifyAlert = get('html.simplify #simplifyAlert[style*="none"]');
    let systemColorPref;

    if (simplifyAlert) {
      systemColorPref = getStyle(simplifyAlert, "content").replace(/\"/g, "");
      report("system color pref", systemColorPref);

      // TODO: create mutation observer that looks for this value to change? Can it detect that if the style isn't inline?
      // No way to observe this changing, would have to check it every so often... on list.scan?
      // new MutationObserver((mutations) => {
      //   console.log("system color pref changed?", mutations);
      // }).observe(simplifyAlert, observers.config.everything);

      if (systemColorPref === "dark") {
        report("system prefers dark, switch to dark theme");

        // TODO: CHANGE ICON -- Change browser icon to dark version

        // TODO: CHANGE THEME
        // build clickSequence()

        // // Click on settings gear
        // clickOn(get(".FH"));

        // // Click on View all button for themes
        // clickOn(get('div[aria-label="Theme"] + button'));

        // // Click on basicwhite or basicblack theme
        // clickOn(get('div[bgid="basicwhite"]'));
        // clickOn(get('div[bgid="basicblack"]'));

        // // Click on save button
        // clickOn(get('.a8Y > div[role="button"]:first-child'));
      }
    }
  },

  detectMaterialYou() {
    if (getStyle(document.body, "font-family").indexOf("Google Sans") >= 0) {
      report("Material You design detected");
      el.html.classList.add("matYou");
    } else {
      el.html.classList.remove("matYou");
    }
  },

  detect() {
    theme.detectCount += 1;
    report("Theme changed? Detect #", theme.detectCount);

    theme.detectDensity();
    theme.detectColor();
    theme.detectButtons();
    theme.detectMaterialYou();
    // theme.detectSystemPref();
  },

  // I think this was originally just for the loading screen and reading pane
  // TODO: I either need to kill it or make it better; issues when switching away
  // from reading pane
  setBg(color = false, img = false, imgPos = false) {
    if (color) {
      local.update("themeBgColor", color);
    }
    if (img) {
      local.update("themeBgImgUrl", img);
    }
    if (imgPos) {
      local.update("themeBgImgPos", imgPos);
    }

    css.add(
      `:root { --color-themeBg: ${simplify[u].themeBgColor} !important; }`
    );
    css.add(
      `:root { --img-themeBg: ${simplify[u].themeBgImgUrl} !important; }`
    );
    css.add(
      `:root { --img-themeBgPos: ${simplify[u].themeBgImgPos} !important; }`
    );

    // Check for the Soft Gray theme and the High Contrast theme
    el.html.classList.remove("grayTheme", "contrastTheme");
    if (simplify[u].themeBgColor === "rgb(245, 245, 245)") {
      el.html.classList.add("grayTheme");
    } else if (simplify[u].themeBgColor === "rgb(238, 238, 238)") {
      el.html.classList.add("contrastTheme");
    }

    // Update theme meta tag
    theme.setBgMeta(simplify[u].themeBgColor);
  },

  // Add the theme background as a meta tag
  setBgMeta(themeBgColor, count = 0) {
    if (document.head) {
      const themeMeta = get("head meta[name='theme-color']");
      const themeColor = rgbToHex(themeBgColor);
      const color =
        themeColor === "#ffffff"
          ? "#f7f7f7"
          : themeColor === "#444444"
          ? "#2C2E30"
          : themeColor;

      if (themeMeta) {
        themeMeta.content = color;
      } else {
        const metaTag = make("meta", { name: "theme-color", content: color });
        document.head.appendChild(metaTag);
      }
    } else if (count < 20) {
      setTimeout(() => {
        setBgMeta(themeBgColor, count + 1);
      }, retryIn);
    }
  },
};

// Initialize theme & density
if (is.okToSimplify) {
  el.html.classList.add(simplify[u].theme);
  el.html.classList.add(simplify[u].density);
}



// Copyright (C) Michael Leggett, Made Simple LLC - All Rights Reserved
// Proprietary and confidential; Unauthorized copying or redistribution of this file,
// via any medium is strictly prohibited; Written by Michael Leggett (hi@simpl.fyi)

// ==========================================================================
// GMAIL SETTINGS

const settings = {
  init() {
    // TODO: This should be part of elements and sel
    const closeButton = getEl("closeButton");
    if (closeButton) {
      report("Adding event listener to close button");
      closeButton.addEventListener("click", settings.exit);
    }

    // Make sure the App menu is closed
    appMenu.close();

    // Note: this appears to be the main app's container div when themes are disabled for a domain
    let settingsWrapper = get('.nH[style*="width"] + .bq9');
    settingsWrapper = settingsWrapper ? settingsWrapper.previousSibling : false;
    if (settingsWrapper) {
      settingsWrapper.classList.add("settingsWrapper");
    }

    // Add Simplify options link to settings nav
    // this.addSimplifySettingsLink();
  },

  exit() {
    const inboxLink = get(sel.inboxLink);
    if (inboxLink) {
      clickOn(inboxLink);
    } else {
      // This is better in that it goes to where we were previously (good) BUT
      // it breaks if there were unsaved changes and the user tried to cancel leaving
      // TODO: is there a way to always go here?
      location.hash = close.settings;
    }

    // Need to re-setup reading-pane upon leaving Settings
    check.readingPane = true;
  },

  // Add Simplify Options link to Gmail settings nav
  // NO LONGER CALLED AS OF 5/24/2021
  addSimplifySettingsLink() {
    const settingsNav = get(".fY");
    const alreadyCreated = get("#simplifyOptions");

    if (settingsNav && !alreadyCreated) {
      const openSimplifySettings = make(
        "div",
        { className: "f1", id: "simplifyOptions" },
        make(
          "a",
          {
            href: chrome.runtime.getURL("prefs/edit.html"),
            className: "f0",
          },
          "Simplify Gmail"
        )
      );
      settingsNav.appendChild(openSimplifySettings);
    }
  },

  // Add Simplify Options button to quick settings
  // NO LONGER CALLED AS OF 5/24/2021
  addSimplifySettingsButton() {
    const quickSettingsBottom = get(".IU fieldset");

    if (quickSettingsBottom) {
      const openSimplifySettings = make(
        "div",
        { className: "Q3" },
        make("div", { className: "OG" }, "SIMPLIFY GMAIL"),
        make(
          "button",
          {
            id: "openSimplifySettings",
            className: "Tj",
            ariaLabel: "Simplify options",
          },
          "Simplify options"
        )
      );

      openSimplifySettings.addEventListener("click", () => {
        window.open(chrome.runtime.getURL("prefs/edit.html"));

        // Close quick settings when user clicks on Simplify Settings
        // TODO: Use Sass variable
        clickOn(get(".rightPane .OB"));
      });
      quickSettingsBottom.appendChild(openSimplifySettings);
    }
  },
};



// Copyright (C) Michael Leggett, Made Simple LLC - All Rights Reserved
// Proprietary and confidential; Unauthorized copying or redistribution of this file,
// via any medium is strictly prohibited; Written by Michael Leggett (hi@simpl.fyi)

// ==========================================================================
// CHAT

const chat = {
  triesSide: 0,
  triesPeek: 0,
  triesMeet: 0,
  side: undefined,
  meet: null,
  roster: null,
  newChat: null,

  init() {
    // Only try so many times
    if (this.triesPeek > retryAttempts) {
      report("Simplify > chat.init() > No roster, assume chat is disabled");
      this.triesPeek = 0;

      // If chat is disabled, you get the new icons
      el.html.classList.add("newUI");

      return;
    }

    this.roster = get(sel.chatAndMeet);
    this.newChat = get(sel.chatNew);

    // Abort if we find the new chat roster
    if (this.newChat !== null) {
      report("New Gmail nav. Aborting looking for old chat roster");

      // Check if new roster is on the right size
      if (!get(`.aeN ${sel.chatNew}:not(.adZ) .XS`)) {
        report("New chat roster is on the right size");
        el.html.classList.add("rhsChat");
      }
      return;
    }

    // Loop if we haven't found the roster
    if (this.roster === null) {
      this.triesPeek += 1;
      setTimeout(this.init.bind(this), retryIn);
    } else {
      report("Chat: Set up peeking", this.roster);
      this.triesPeek = 0;
      this.roster.addEventListener("mouseover", chat.peek);

      // TODO: Not sure why we need click when we have mouseover - removed on 3/5
      // this.roster.addEventListener("click", chat.peek);

      // Add invisible div for hiding the chat roster when you mouse away
      const closeChatPeek = make("div", { id: "closeChatPeek" });
      closeChatPeek.addEventListener("mouseover", chat.unpeek);
      document.body.appendChild(closeChatPeek);

      // Find out what side the chat roster is on
      this.detectChat();
      this.detectMeet();
    }
  },

  detectChat() {
    // Only try so many times
    if (this.triesSide > 10) {
      report(
        "Simplify > chat.detectChat() > No roster, assume chat is disabled"
      );
      local.update("chat", "off");
      this.triesSide = 0;
      return;
    }

    report(`Finding chat roster attempt #${this.triesSide}`);
    let roster = get("#talk_roster");
    if (roster) {
      this.side = roster.getAttribute("guidedhelpid");
    }

    if (this.side === undefined) {
      this.triesSide += 1;
      el.html.classList.add("chatOff");
      setTimeout(this.detectChat.bind(this), 250);
    } else {
      this.triesSide = 0;
      local.update("chat", this.side);
      el.html.classList.remove("chatOff");
      report(`Found chat: ${simplify[u].chat}`);

      if (this.side === "right_roster") {
        el.html.classList.add("rhsChat");
      } else {
        el.html.classList.remove("rhsChat");
      }
    }
  },

  detectMeet() {
    // Only try so many times
    if (this.triesMeet > 10) {
      report(
        "Simplify > chat.detectChat() > No roster, assume chat is disabled"
      );
      local.update("meet", false);
      this.triesMeet = 0;
      return;
    }

    report(`Finding meet widget attempt #${this.triesMeet}`);

    // TODO: use sass variables
    this.meet = get('.YM, *[aria-label="Meet"]');

    if (!this.meet) {
      this.triesMeet += 1;
      el.html.classList.add("meetOff");
      setTimeout(this.detectMeet.bind(this), 250);
    } else {
      this.triesMeet = 0;
      local.update("meet", true);
      el.html.classList.remove("meetOff");
    }
  },

  peek(event) {
    if (is.simplifyOn) {
      el.html.classList.add("chatOpen");
      event.stopPropagation();
      window.addEventListener("mouseout", observers.window.mouseout);
    }
  },

  unpeek() {
    el.html.classList.remove("chatOpen");
    window.removeEventListener("mouseout", observers.window.mouseout);
  },
};



// Copyright (C) Michael Leggett, Made Simple LLC - All Rights Reserved
// Proprietary and confidential; Unauthorized copying or redistribution of this file,
// via any medium is strictly prohibited; Written by Michael Leggett (hi@simpl.fyi)

// ==========================================================================
// READING PANE

// Detect if reading pane is enabled
const readingPane = {
  element: null,
  tries: 0,
  size: "500px",
  type: "",
  calls: 0,

  init() {
    // Only try to detect reading pane if in a list
    if (!is.list) {
      check.readingPane = true;
      return;
    }

    // Only try so many times
    if (this.tries > retryAttempts) {
      // TODO: Add Sass variable
      error("Simplify > readingPane.init() > Cound't find div[gh='tl']");
      this.tries = 0;
      return;
    }

    this.element = get("div[gh='tl']");
    if (!this.element) {
      this.tries += 1;
      setTimeout(this.init.bind(this), retryIn);
    } else {
      report("Detecting reading pane took this many loops:", this.tries);
      this.tries = 0;
      // TODO: Use Sass variable, strip out "."
      if (this.element.classList.contains("vy")) {
        is.readingPane = true;
        readingPane.detect();
      } else {
        is.readingPane = false;
        this.type = "unknown";
        el.html.classList.remove("nPane", "hPane", "vPane", "msgOpen");
        // Reset background if I'm still overriding it
        // theme.setBg("initial");
      }
      check.readingPane = false;
      local.update("readingPane", is.readingPane);
      local.update("readingPaneType", this.type);
    }
  },

  detect() {
    report("readingPane.detect called", this.calls);
    this.calls += 1;

    this.detectType();
    this.detectSize();
    this.findToggle();
  },

  // Add class to toggle so we can move it around
  // TODO: Use Sass variables for selector or el.
  findToggle(listScan = false) {
    let foundNewToggles = false;
    gets('.apF, div[data-tooltip="Toggle split pane mode"]').forEach(
      (element) => {
        if (!element.parentElement.classList.contains("readingPaneToggle")) {
          element.parentElement.classList.add("readingPaneToggle");
          foundNewToggles = true;
        }
      }
    );

    let unobservedToggles =
      count(
        '.apH:not([data-simplify]), .apI:not([data-simplify]), .apJ:not([data-simplify]), .apK:not([data-simplify]), div[data-tooltip*="Toggle split pane"] .asa > div:not([data-simplify])'
      ) > 0;
    if (unobservedToggles) {
      report("Found an unobserved toggle, restarting readingPane observer");
      observers.readingPane.restart();
    }

    // if (foundNewToggles && listScan) {
    // observers.readingPane.restart();
    // report("Found a new toggle on a list.scan, reinitializing readingPane");
    // readingPane.init();
    // }
  },

  detectType() {
    // If in conversation view, most likely nPane but could be an email opened via search suggestion
    if (is.msg) {
      this.type = "nPane";
      check.readingPane = true;
      return;
    }

    // TODO: This needs to be refreshed when the view changes, probably not here
    this.element = get("div[gh='tl'], div.UI");

    // TODO: Use Sass variable
    // Detect type of reading pane
    report("Detect type of reading pane");
    if (this.element) {
      if (this.element.classList.contains("Nm")) {
        this.type = "vPane";
      } else {
        // Make sure we revert to single-line rows in list view
        gets(".Zs").forEach((list) => {
          list.classList.remove("Zs");
        });

        if (this.element.classList.contains("S2")) {
          this.type = "nPane";
          check.readingPane = false;
        } else if (this.element.classList.contains("Nf")) {
          this.type = "hPane";
        } else {
          this.type = "unknown";
          is.readingPane = false;
          report("Looks like reading pane is disabled");
        }
      }
    }

    // Reset is.msgOpen if not on vPane or hPane anymore
    if (!["vPane", "hPane"].includes(this.type)) {
      el.html.classList.remove("msgOpen");
      is.msgOpen = false;

      // Disconnect pane and message observers
      observers.readingPane.disconnect();
    }

    // Restart action bar observer
    observers.actionBar.start();

    // Restart readingPane observer
    observers.readingPane.restart();

    // Cache reading pane type and update class on <html>
    local.update("readingPaneType", this.type);
    el.html.classList.remove("nPane", "hPane", "vPane");
    if (this.type !== "unknown") {
      el.html.classList.add(simplify[u].readingPaneType);
    }
  },

  // Detect if the size of the reading pane has changed
  // TODO: Use Sass variables
  detectSize() {
    // If Gmail was loaded in vhPane and then switched to nPane,
    // this still gets called sometimes but isn't needed
    if (this.type === "nPane") return;

    report("detectSize called", this.type);
    let newSize = 0;

    if (this.type === "vPane") {
      newSize = getStyle(".UI.vy[gh='tl'] > div:first-child", "width");
    } else if (this.type === "hPane") {
      newSize = getStyle(".UI.vy[gh='tl'] > div:last-child", "height");
    }

    if (this.size !== newSize) {
      // Save & apply reading pane size when it changes
      this.size = newSize || "0px";
      local.update("readingPaneSize", this.size);

      if (this.type === "vPane") {
        css.add(`:root { --width-readingPane: ${this.size} !important; }`);

        // If width is below 510 pixels, add Zs to wrap the threads
        if (parseInt(this.size) < 510) {
          gets(".UI .Nu > div[jsaction]").forEach((list) => {
            list.classList.add("Zs");
          });
        } else {
          gets(".Zs").forEach((list) => {
            list.classList.remove("Zs");
          });
        }
      } else if (this.type === "hPane") {
        css.add(`:root { --height-readingPane: ${this.size} !important; }`);
      }
    }
  },
};

// Observer for reading pane size change or toggle
observers.readingPane = {
  toggles: null,
  listPanes: [],
  mode: null,
  size: null,
  tries: 0,
  messagePane: null,
  currentListPane: null,
  pauseScrollObs: false,
  paneCalls: 0,
  toggleCalls: 0,
  msgCalls: 0,

  paneObserver: new MutationObserver(() => {
    observers.readingPane.paneCalls += 1;
    report("paneObserver fired", observers.readingPane.paneCalls);
    readingPane.detectSize();
  }),

  toggleObserver: new MutationObserver(() => {
    observers.readingPane.toggleCalls += 1;
    report("toggleObserver fired", observers.readingPane.toggleCalls);

    // Delay the check just a little so the DOM has a chance to update
    setTimeout(readingPane.detect.bind(readingPane), retryIn);
  }),

  msgObserver: new MutationObserver((mutations) => {
    observers.readingPane.msgCalls += 1;
    report("Message mutation", observers.readingPane.msgCalls);

    // TODO: Use sass variables
    if (mutations.some((m) => m.target.classList.contains("UG"))) {
      el.html.classList.add("msgOpen");
      is.msgOpen = true;

      report("Scan conversation for trackers & htmlEmail if darkTheme");
      conversation.scan();
      observers.inlineReply.start();
    } else if (count(sel.rPaneMsgSelectdBanner) > 0) {
      el.html.classList.remove("msgOpen");
      is.msgOpen = false;
    }

    // Remove .reverseMsgs if setting not enabled
    if (!preferences.reverseMsgs) {
      el.html.classList.remove("reverseMsgs", "reverseList");
    }
  }),

  start() {
    // Only try so many times
    if (this.tries > retryAttempts) {
      error("Cound't find list view for reading pane");
      this.tries = 0;
      return;
    }

    let vhPane = readingPane.type === "vPane" || readingPane.type === "hPane";

    // Find the reading pane toggle
    // TODO: Use Sass variables
    this.toggles = gets(
      '.apH, .apI, .apJ, .apK, div[data-tooltip*="Toggle split pane"] .asa > div'
    );

    if (vhPane) {
      // Find the message pane
      // TODO: Use Sass variables
      this.messagePane = get(".BltHke[role='main'] .UI:not(.S2) .Bs"); // nH ao9 id UG

      // Find list panes
      // TODO: Use Sass variables
      this.listPanes = gets(".UI:not(.S2) > .Nu:first-child");
    }

    if (this.toggles.length === 0 || (vhPane && this.listPanes.length === 0)) {
      this.tries += 1;
      setTimeout(this.start.bind(this), retryIn);
    } else {
      this.tries = 0;
      this.observe();

      // REMOVED 2/22 as I think this is overkill
      // readingPane.detect();
    }
  },

  observe() {
    report("Observe reading panes and/or toggles", readingPane.type);

    this.toggles.forEach((toggle) => {
      toggle.setAttribute("data-simplify", "sofc");
      this.toggleObserver.observe(toggle, observers.config.classAttributeOnly);
    });

    this.listPanes.forEach((listPane) => {
      this.paneObserver.observe(listPane, observers.config.styleAttributeOnly);
    });

    if (this.messagePane) {
      this.msgObserver.observe(
        this.messagePane,
        observers.config.classAttributeOnly
      );
      this.messagePane.classList.add("SOFC");
    }

    this.observeScrolling();
  },

  disconnect() {
    if (this.paneObserver !== null) {
      this.paneObserver.disconnect();
    }

    if (this.msgObserver !== null) {
      this.msgObserver.disconnect();
    }
  },

  restart() {
    this.disconnect();
    this.start();
  },

  // For detecting when search results are scrolled to the top
  scrollObserver() {
    report("Scrolling");

    if (!observers.readingPane.pauseScrollObs) {
      observers.readingPane.isListScrolled(this);
      observers.readingPane.pauseScrollObs = true;
      setTimeout(() => {
        observers.readingPane.pauseScrollObs = false;
        observers.readingPane.isListScrolled(this);
      }, 200);
    }
  },

  isListScrolled(list) {
    if (list.scrollTop < 30) {
      el.html.classList.remove("listScrolled");
    } else {
      el.html.classList.add("listScrolled");
    }
  },

  observeScrolling() {
    if (
      !(is.search || is.label) ||
      !is.readingPane ||
      readingPane.type === "nPane"
    ) {
      return;
    }

    this.currentListPane = get(".BltHke[role='main'] .UI > .Nu:first-child");

    if (this.currentListPane) {
      if (this.currentListPane.onscroll === null) {
        this.currentListPane.onscroll = this.scrollObserver;
        report("Observe scrolling search list");
      }
    }
  },
};

// Init reading pane based on cached state
if (is.okToSimplify && simplify[u].readingPaneType !== "unknown") {
  el.html.classList.add(simplify[u].readingPaneType);
  report("Loading with reading pane enabled", simplify[u].readingPaneType);
}



// Copyright (C) Michael Leggett, Made Simple LLC - All Rights Reserved
// Proprietary and confidential; Unauthorized copying or redistribution of this file,
// via any medium is strictly prohibited; Written by Michael Leggett (hi@simpl.fyi)

// ==========================================================================
// URL, HISTORY, & TRACKING CURRENT VIEW

// Update view state variables based on URL
// TODO: Detecting message view won't work in Reading Pane, anything to do about that? Does it matter?
const url = {
  hash: null,

  check() {
    // Check for special Gmail views
    is.popout = location.href.search(/view=btop.*search=/) !== -1;
    is.original = location.href.indexOf("view=om") !== -1;
    is.print = location.href.indexOf("view=pt") !== -1;
    is.mailto = location.href.search(/tf=cm|view=btop.*#cmid/) !== -1;
    is.gChat = location.pathname.indexOf("/chat/") === 0;

    if (location.hash === "") return;

    // Before we reset is.msg, check if we're leaving a message in reading pane
    if (is.msg && is.readingPane) {
      report("Yes, check the readingPane size");
      check.readingPaneSize = true;
    } else {
      report("No, do not check the readingPane size", is.msg, is.readingPane);
    }

    // Remove pagination from url hash
    this.hash = location.hash.replace(/\/p\d{1,3}$/, "");

    is.msg = this.hash.search(regex.msg) !== -1;
    is.list = this.hash.search(regex.msg) === -1;
    is.inbox = this.hash.search(/#inbox/) === 0;
    is.search = this.hash.search(regex.search) === 0;
    is.label = this.hash.search(regex.label) === 0;
    is.spam = url.hash.search(/#spam/) === 0;
    is.chat = url.hash.search(/#chat/) === 0;
    is.trash = url.hash.search(/#trash/) === 0;
    is.settings = this.hash.search(/#settings/) === 0;

    if (is.settings) {
      el.html.classList.add("inSettings");

      // Since is.list is based on it not being a message,
      // it could be wrong if in Settings
      is.list = false;
    } else {
      el.html.classList.remove("inSettings");
      close.settings = this.hash;
    }

    if (is.chat) {
      el.html.classList.add("inChat");
    } else {
      el.html.classList.remove("inChat");
    }

    if (is.msg) {
      el.html.classList.add("inMsg");
      conversation.scan();

      // If in a message, set the list views to false
      is.inbox = false;
      is.search = false;
      is.label = false;
      is.list = false;
      is.spam = false;
      is.trash = false;
    } else {
      el.html.classList.remove("inMsg");
    }

    if (is.search) {
      el.html.classList.add("inSearch");
    } else {
      el.html.classList.remove("inSearch");
      if (is.list) close.search = this.hash;
    }

    if (is.label) {
      el.html.classList.add("inLabel");
    } else {
      el.html.classList.remove("inLabel");
      if (is.list) close.search = this.hash;
    }

    if (is.inbox) {
      el.html.classList.add("inInbox");

      // Find out if the inbox is a tabbed inbox
      if (!is.loading && is.tabbedInbox === null) {
        is.tabbedInbox = count(sel.tabs) > 0;
      }
    } else {
      el.html.classList.remove("inInbox");
    }

    if (is.list) {
      el.html.classList.add("inList");
      close.msg = this.hash;
    } else {
      el.html.classList.remove("inList", "inboxZero");
    }

    if (is.spam) {
      el.html.classList.add("inSpam");
    } else {
      el.html.classList.remove("inSpam");
    }

    if (is.trash) {
      el.html.classList.add("inTrash");
    } else {
      el.html.classList.remove("inTrash");
    }

    if (is.delegate) {
      el.html.classList.add("delegate");
    } else {
      el.html.classList.remove("delegate");
    }

    if (check.readingPaneSize) {
      readingPane.detectSize();
      check.readingPaneSize = false;
    }
  },
};

if (is.okToSimplify) {
  window.onhashchange = () => {
    report("URL changed");

    url.check();

    // Close profile menu if it is open
    document.documentElement.classList.remove("appMenuOpen");

    // Look for new inline replies when changing conversations
    if (is.msg) {
      observers.inlineReply.start();
      observers.actionBar.addSearchButton();
    }

    if (is.list) {
      // Happens if Gmail originally loaded in a message
      // and we couldn't fully detect the theme
      if (check.theme) {
        theme.detect();
      }
      if (check.readingPane) {
        readingPane.init();
      }

      // Remove bold highlight on focused thread
      el.html.classList.remove("boldHighlight");

      // Scan list for ads and date grouping
      lists.scan();

      // Resetup actionBar observers
      observers.actionBar.start();

      if (is.readingPane) {
        // The toggle gets recreated across views and needs to be retagged
        readingPane.findToggle();

        // If the URL changed and we're using vPane or hPane, restart observers
        if (["vPane", "hPane"].includes(readingPane.type)) {
          observers.readingPane.restart();
        }
      }
    }

    if (is.settings) {
      settings.init();
    }

    // Remove .reverseMsgs if setting not enabled
    if (!preferences.reverseMsgs) {
      el.html.classList.remove("reverseMsgs", "reverseList");
    }

    if (check.categories) {
      if (Object.values(categories).indexOf(location.hash) > -1) {
        Object.keys(categories).forEach((key) => {
          report(
            "Checking location hash for category",
            location.hash,
            key,
            categories[key],
            location.hash === categories[key]
          );
          // Remove highlight if not on this category
          if (location.hash !== categories[key]) {
            let wasActive = get(`.aim[data-category="${key}"] .TO.nZ.aiq`);
            if (wasActive) wasActive.classList.remove("nZ", "aiq");
          }
        });

        // Make sure I'm observing the select checkbox
        observers.actionBar.observe();
      } else {
        // If not on any category, no need to check next time
        check.categories = false;

        // Remove highlight from nav item if not on that category
        gets(".aim[data-category] .TO.nZ.aiq").forEach((item) => {
          item.classList.remove("nZ", "aiq");
        });
      }
    }

    // Check the trial badge
    if (check.trial) subscription.badge();
  };
}

// Check locaton on load (I also run this again after loading is complete)
url.check();



// Copyright (C) Michael Leggett, Made Simple LLC - All Rights Reserved
// Proprietary and confidential; Unauthorized copying or redistribution of this file,
// via any medium is strictly prohibited; Written by Michael Leggett (hi@simpl.fyi)

// ==========================================================================
// INITIALIZE

// Print Simplify version to console
if (is.okToSimplify) {
  console.log("Simplify v" + chrome.runtime.getManifest().version + " loaded");
}

// Call all initialization functions
const initializeSimplify = () => {
  report("Gmail is loaded, initializing Simplify");

  // Done loading
  is.loading = false;

  // Get username in from GLOBAL variable
  if (!is.popout && !is.mailto) {
    const authUser = chrome.runtime.getURL("js/authUser.js");
    document.head.appendChild(make("script#getUserId", { src: authUser }));
    // document.head.appendChild(make("script#getUserId", "(" + subscription.getEmail + ")();"));
  }

  // Show OOBE
  // if (simplify[u].firstTimeWelcome) {
  //   let oobe = get("#welcomeToSimplify");
  //   if (oobe) oobe.classList.add("wtsShow");
  // }

  // Flag if this is Safari
  if (is.safari) {
    el.html.classList.add("isSafari");
  }

  // If this is a mailto popout or a message popout, only start compose function
  if (is.mailto || is.popout) {
    observers.compose.start();

    // Disable InboxSDK's compose height adjustment in case there are other extensions installed
    document.body.classList.add("inboxsdk_hack_disableComposeSizeFixer");

    return;
  }

  // Initialize all the elements
  Object.keys(trickyElements).forEach((el) => {
    getEl(el);
  });

  // Initialize keyboard shortcut handler
  document.body.addEventListener("keydown", keyboard.onKeydown, false);

  report("Loading done? About try adding categories");

  url.check();
  nav.init();
  readingPane.init();
  search.init();
  chat.init();
  lists.init();
  alerts.init();
  appMenu.init();

  if (is.list) {
    observers.actionBar.start();
  }

  if (is.settings) {
    settings.init();
  }

  theme.detect();
  observers.theme.start();
  observers.quickSettings.start();
  observers.addOns.start();
  observers.body.start();
  observers.compose.start();
  conversation.initTrackerDetails();

  // Get the correct width of the readingPane after it is fully loaded
  if (
    simplify[u].readingPaneType === "vPane" ||
    simplify[u].readingPaneType === "hPane"
  ) {
    setTimeout(readingPane.detectSize, 100);
  }

  // Setup window event listeners
  window.addEventListener("resize", observers.window.resize);
  window.addEventListener("click", observers.window.click);
  observers.window.dragInit();

  // See if I need to check the inbox sections on initial load
  if (is.inbox && check.inboxSections) {
    lists.checkSections();
  }

  // Check the subscription
  subscription.check();

  // Make sure Simplify Canary isn't enabled at the same time
  if (is.chrome && el.html.classList.contains("simplifyCanary")) {
    alerts.show(
      {
        title: "Two versions of Simplify detected",
        body: "Bad things happen when you have two versions of Simplify Gmail enabled. Please disable one and reload Gmail.",
      },
      "Manage extensions"
    );
  }
};
