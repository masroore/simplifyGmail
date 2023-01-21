/**
 * @preserve
 * Copyright (C) Michael Leggett, Made Simple LLC - All Rights Reserved
 * Proprietary and confidential; Unauthorized copying or redistribution of this file,
 * via any medium is strictly prohibited; Written by Michael Leggett (hi@simpl.fyi)
 */
let report = () => {},
    error = () => {}
const check = {
        theme: !0,
        readingPane: !1,
        readingPaneSize: !1,
        moles: !1,
        popout: !1,
        categories: !1,
        inboxSections: !0,
        trial: !1,
        lists: !0,
        click: !0,
    },
    el = {
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
    },
    trickyElements = {
        oneGoogleRing: { selector: '#gb div path[d$="02,28.27z"]', parent: 2, suffix: ' svg' },
        gsuiteLogo: {
            selector: 'header img[src*="cpanel"], header img[src*="admin.google"], header img[role="img"]',
            parent: 2,
        },
        gsuiteLogoWrapper: {
            selector: 'header img[src*="cpanel"], header img[src*="admin.google"], header img[role="img"]',
            parent: 3,
        },
        topLeftButtons: { selector: 'path[d*="2H3v2zm0"]', parent: 3 },
        menuButton: { selector: 'path[d*="2H3v2zm0"]', parent: 2 },
        backButton: { selector: '#gb div > svg > path[d*="1-1.41L7.83"]', parent: 2 },
        closeButton: { selector: '#gb div > svg > path[d*="6.41L17.59"]', parent: 2 },
        closeSearch: { selector: '#gb form button > svg > path[d*="6.41L17.59"]', parent: 2 },
        searchIcon: { selector: '#gb form button > svg > path[d*="73-5.73C15.53,12.2"]', parent: 2 },
        refreshButton: { selector: '.G-atb .G-Ni div[act="20"][role="button"]', parent: 1 },
    },
    regex = {
        msg: /\/[A-Za-z]{28,}(\?compose=(new|[A-Za-z]{28,}))?/,
        search: /#search|#advanced-search|#create-filter|#section_query/,
        label: /#label|#starred|#snoozed|#sent|#outbox|#drafts|#imp|#chats|#scheduled|#all|#spam|#trash/,
        titleEmail: /[a-z0-9\.]{6,30}\@[\w-.]{1,63}\.[a-z]{2,24} - (Gmail|[^@]+)$/,
        titleEnd: / - (Gmail|[^@]+)$/,
        email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    },
    UA = navigator.userAgent,
    is = {
        simplifyOn: !0,
        okToSimplify: !0,
        loading: !0,
        msg: !1,
        msgOpen: !1,
        list: !1,
        inbox: !1,
        search: !1,
        label: !1,
        settings: !1,
        chat: !1,
        popout: -1 !== location.href.search(/view=btop.*search=/),
        original: -1 !== location.href.indexOf('view=om'),
        print: -1 !== location.href.indexOf('view=pt'),
        gChat: 0 === location.pathname.indexOf('/chat/'),
        tabbedInbox: null,
        readingPane: !1,
        readingPaneType: '',
        readingPaneSize: '500px',
        delegate: /\/mail\/u\/\d\/d/.test(location.pathname),
        safari: / Safari/.test(UA) && !/ Chrome/.test(UA),
        chrome: / Safari\//.test(UA) && / Chrome\//.test(UA) && !/ ORP\//.test(UA) && !/ Firefox\//.test(UA),
        oldChrome: / Chrome\/[1-7]\d\./.test(UA),
        firefox: / Firefox\//.test(UA),
        windows: navigator.platform.indexOf('Win') > -1,
        mac: navigator.platform.indexOf('Mac') > -1,
        tabPinned: null,
        mailplaneDisabled: !1,
        appNavOn: () => hasClass('showAppNav') && !hasClass('appNavOff'),
    }
;(is.original || is.print || is.gChat) && ((is.okToSimplify = !1), (is.simplifyOn = !1))
const userNum = location.pathname.match(/\/[u|b]\/\d/)[0].substr(-1),
    u = is.delegate ? 'b' + userNum : userNum,
    close = { msg: '#inbox', search: '#inbox', settings: '#inbox' }
let simplify = {},
    doNotShow = {}
const lang = document.documentElement.lang || 'en',
    categories = {
        Finance: '#search/category%3Afinance',
        Purchases: '#search/category%3Apurchases',
        Travel: '#search/category%3Atravel',
    },
    fontSizes = {
        13: { rem: 0.8125, px: 13 },
        14: { rem: 0.8751, px: 14.001 },
        15: { rem: 0.9376, px: 15.001 },
        16: { rem: 1.0001, px: 16.001 },
        17: { rem: 1.0626, px: 17.001 },
        18: { rem: 1.1251, px: 18.001 },
        19: { rem: 1.1876, px: 19.001 },
        20: { rem: 1.2501, px: 20.001 },
    }
let fontSize = 14,
    fontSizeRem = fontSizes[fontSize].rem,
    fontSizePx = fontSizes[fontSize].px,
    fontFace = 'Arial, Helvetica, sans-serif'
const defaultParam = {
        version: '9',
        theme: 'lightTheme',
        themeBgColor: '',
        themeBgImgUrl: '',
        themeBgImgPos: '',
        navOpen: !0,
        density: 'lowDensity',
        debug: !1,
        firstTimeWelcome: !0,
        readingPane: !1,
        readingPaneWidth: 'var(--content-width)',
        readingPaneType: 'unknown',
        textButtons: null,
        chat: null,
        rhsChat: null,
        addOnsOpen: null,
        otherExtensions: null,
    },
    sel = {
        accountButton: "a[href*='SignOutOptions']",
        accountWrapper: '.gsuiteLogoWrapper',
        backButton: '.gb_zc.gb_Cc.gb_Fa',
        bar: '.G-atb',
        btnRefresh: "div[aria-label='Refresh'], .nu, div[act='20']",
        gsuiteLogo: "header img[src*='cpanel'], header img[src*='admin.google']",
        listActions: '.aqK',
        listPage: '.aqJ',
        listBg: '.bkK > .nH',
        searchInput: "#gb input[name='q']",
        searchFocused: '.gb_af',
        topLeftButtons: '.gb_2c.gb_9c.gb_ad',
        menuButton: ".gb_Bc, div[aria-label='Main menu']",
        msgActions: '.iH',
        msgPage: '.adF',
        oneGoogleRing: '.gb_3a svg',
        pagination: '.ar5',
        paginationCount: '.amH',
        paginationButtons: '.Di',
        currentPage: "div[gh='tm'] .Dj .ts",
        settingsGear: '.FI',
        supportButton: '.zo',
        readingPaneToggle: '.readingPaneToggle',
        inputTools: '.aBS',
        offline: '.bvE, .bvI, .bvD',
        appSwitcher: '#gbwa',
        chatStatus: '.Yb',
        oeMixMax: '.mixmax-appbar',
        oeBoomerang: '#b4g_manage',
        oeStreak: '.streak__topNav',
        oeSortd: '.openSortdIcon',
        oeGmass: '#gmassbutton',
        oeMailtrack: '#mailtrack-menu-opener',
        oeFlowcrypt: '#flowcrypt_new_message_button',
        oeCopper: '.pw-shadow-host-widget:not(.main-ember-application)',
        oeHubspot: '.app-level-toolbar-icon',
        oeYesware: '.yw-launchpad-container',
        oeSalesforce: '#sfdc-mailapp-container',
        oeDrag: "header .inboxsdk__button_iconImg[src$='Drag-icon.svg']",
        oeInboxWhenReady: '#iwr_wrap_action_buttons',
        oeActiveInbox: '.gtdi-appdropdown',
        oeChq: ".inboxsdk__appButton[title*='cloudHQ']",
        oeChqPause: '.cloudhq-pause-inbox-button',
        oeChqTracker: ".inboxsdk__appButton[title='cloudHQ Email Tracker']",
        oeChqTabs: '#cloudHQ__label_tabs_wrapper',
        oeChqResize: '#cloudHQ_gmail_resize_pane_1',
        oeChqSort: '.chq_gmail_smart_labels_nav_item',
        oeRightInbox: "img.ri-icon[src*='rightinbox.com']",
        oeDarkReader: 'style.darkreader',
        oeBananaTag: '.inboxsdk__button_icon.bt-top-menu',
        oeHippoVideo: '.hippo-top-menu-container',
        oeNightEye: "html[nighteye='active']",
        oeNightEyeGmail: "html[negml='active']",
        listTop: '.BltHke',
        listTopActive: ".BltHke[role='main']",
        list: '.ae4',
        listInner: '.Cp',
        tabs: '.aKh',
        tab: '.aAy',
        oneBox: '.bX',
        selectAll: '.ya',
        newBadge: '.aDG',
        searchChips: '.G6',
        listSectionHeader: '.Wg.aAr',
        msg: '.zA',
        msgRead: '.yO',
        msgActive: '.aps',
        msgSelected: '.x7',
        msgSnippet: '.y2',
        msgSnoozed: '.cL',
        msgAttachment: '.yf',
        msgAdLabel: '.a3x',
        msgAdAria: "img[aria-label='Why this ad?']",
        checkbox: '.xY',
        threadCheckbox: ".xY div[role='checkbox']",
        selectedThreads:
            "div[role='main'] .ae4:not([style*='none']) .Cp tr.zA:not(.advert) div[role='checkbox'][aria-checked='true']",
        focusedThread: "div[role='main'] .ae4:not([style*='none']) .Cp tr.btb:not(.aps):not(.advert)",
        allLists: "div[role='main'] .ae4 .Cp",
        currentList: "div[role='main'] .ae4:not([style*='none']) .Cp",
        scanAllEmails:
            "div[gh='tl'] .ae4:not([style*='none']) .Cp .zA:not(.advert), div.ae4[gh='tl'] .Cp .zA:not(.advert)",
        scanNotGroupedEmails:
            "div[gh='tl'] .ae4:not([style*='none']) .Cp .zA:not([date]), div.ae4[gh='tl'] .Cp .zA:not([date])",
        currentListToGroup:
            "div[gh='tl'] .ae4:not([style*='none']) .Cp tbody:not(:empty), div.ae4[gh='tl'] .Cp tbody:not(:empty)",
        scanListsUnobserved: "div[gh='tl'] .ae4 .Cp:not(.SOFC), div.ae4[gh='tl'] .Cp:not(.SOFC)",
        rPaneMsgSelectdBanner: "div[role='main'] .Bs .apb, div[role='main'] .Bs .apf",
        menuSnooze: "div.brx[role='menu']",
        menuLabel: "div.aX1[role='menu']:not([style*='display: none'])",
        menuMoveTo: "div.aX2[role='menu']:not([style*='display: none'])",
        menuMore: '.J-M.aX0',
        footer: '.aeG, .pfiaof',
        themeBg: '.wl',
        themeBgImg: '.a4t',
        themeBgImgAlt: '.a4t img',
        nav: '.aeN',
        navMail: '.aqn.aIH',
        navItems: '.wT',
        navItemsScrolled: '.ajj',
        navClosed: '.bhZ',
        inboxLink: ".aeN .aim a[href*='#inbox']",
        unreadCount: '.bsU',
        composeHover: '.bym',
        composeButton: '.z0',
        composeInner: '.L3',
        chatAndMeet: '.akc',
        chatSection: '.aND',
        chatRoster: "div[gh='c']",
        chatNew: '.Xa.wT',
        conversation: '.Bs',
        messages: "div[role='list']",
        message: '.gs',
        msgCollapsed: '.gs.gt',
        msgHeader: '.gE',
        msgSnippet: '.g6',
        msgBody: '.a3s',
        composeBody: '.Am',
        composeMolesTop: '.dw',
        composeMoles: '.dw .no',
        composeMinimize: ".Hm .Hk, .Hm .Hl, .Hm img[alt='Minimize']",
        composeMolePopout: ".Hm .Hq, .Hm img[alt='Pop-out']",
        composeMoleOpen: ".dw .Hl, .dw img[aria-label='Minimize']",
        composePopoutTop: '.aSs',
        composePopout: '.aSt',
        composeInlineReply: "div[role='list'] .ip",
        addOnsLauncher: '.bAw',
        addOnsToggle: '.brC-dA-I-Jw',
        addOnsPane: '.bq9',
    },
    monthNamesAll = {
        cs: [
            'leden',
            'únor',
            'březen',
            'duben',
            'květen',
            'červen',
            'červenec',
            'srpen',
            'září',
            'říjen',
            'listopad',
            'prosinec',
        ],
        el: ['Ιαν', 'Φεβ', 'Μαρ', 'Απρ', 'Μαΐ', 'Ιουν', 'Ιουλ', 'Αυγ', 'Σεπ', 'Οκτ', 'Νοε', 'Δεκ'],
        en: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ],
        'en-GB': [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ],
        es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sept', 'oct', 'nov', 'dic'],
        'es-419': ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sept', 'oct', 'nov', 'dic'],
        da: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
        de: ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sept.', 'Okt.', 'Nov.', 'Dez.'],
        fi: [
            'tammik',
            'helmik',
            'maalisk',
            'huhtik',
            'toukok',
            'kesäk',
            'heinäk',
            'elok',
            'syysk',
            'lokak',
            'marrask',
            'jouluk',
        ],
        fr: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
        'fr-CA': ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
        hu: ['jan', 'febr', 'márc', 'ápr', 'máj', 'jún', 'júl', 'aug', 'szept', 'okt', 'nov', 'dec'],
        id: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
        it: ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'],
        ja: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        ko: ['일월', '이월', '삼월', '사월', '오월', '유월', '칠월', '팔월', '구월', '시월', '십일월', '십이월'],
        nl: ['jan.', 'feb.', 'mrt.', 'apr.', 'mei', 'jun.', 'jul.', 'aug.', 'sep.', 'okt.', 'nov.', 'dec.'],
        no: ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'],
        pl: ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'],
        sv: ['jan.', 'feb.', 'mars', 'apr.', 'maj', 'juni', 'juli', 'aug.', 'sep.', 'okt.', 'nov.', 'dec.'],
        'pt-BR': ['jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'],
        'pt-PT': ['jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'],
        ru: ['янв.', 'февр.', 'мар.', 'апр.', 'мая', 'июн.', 'июл.', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'],
        tr: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
        uk: ['січ.', 'лют.', 'бер.', 'квіт.', 'трав.', 'черв.', 'лип.', 'серп.', 'вер.', 'жовт.', 'лист.', 'груд.'],
        'zh-CN': ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        'zh-HK': ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        'zh-TW': ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    },
    monthNames = monthNamesAll[lang],
    dates = {
        now: null,
        today: null,
        day: null,
        month: null,
        year: null,
        yesterday: null,
        lastMon: null,
        prevMonth: [],
        isStale() {
            return new Date().getDate() !== this.day
        },
        update() {
            return (
                !!dates.isStale() &&
                ((this.now = new Date()),
                (this.day = this.now.getDate()),
                (this.month = this.now.getMonth()),
                (this.year = this.now.getFullYear()),
                (this.today = new Date(this.year, this.month, this.day)),
                (this.yesterday = new Date(this.today - 864e5)),
                (this.lastMon = new Date(this.today)),
                this.lastMon.setDate(this.lastMon.getDate() - ((this.lastMon.getDay() + 6) % 7)),
                (this.prevMonth[0] = new Date(this.year, this.month, 1)),
                (this.prevMonth[1] = new Date(this.year, this.month - 1, 1)),
                (this.prevMonth[2] = new Date(this.year, this.month - 2, 1)),
                (this.prevMonth[3] = new Date(this.year, this.month - 3, 1)),
                !0)
            )
        },
        parse(dateStr, lang = 'en') {
            if (!dateStr) return error('dates.parse with empty string', dateStr), !1
            let DD,
                MM,
                YYYY,
                monthStr = null
            switch (lang) {
                case 'en':
                case 'en-GB':
                    return new Date(dateStr)
                case 'cs':
                    ;[, DD, MM, YYYY] = dateStr.replace(/\./g, '').split(' ', 4)
                    break
                case 'da':
                case 'fi':
                    ;[, DD, monthStr, YYYY] = dateStr.replace(/\./g, '').split(' ', 4)
                    break
                case 'fr':
                case 'fr-CA':
                case 'id':
                case 'nl':
                case 'ru':
                case 'sv':
                    ;[, DD, monthStr, YYYY] = dateStr.split(' ', 4)
                    break
                case 'es-419':
                case 'es':
                    ;([, DD, monthStr, YYYY] = dateStr.split(',')[1].split(' ', 4)),
                        report('Parsed the date', monthStr, DD, YYYY)
                    break
                case 'el':
                case 'it':
                    ;[, DD, monthStr, YYYY] = dateStr.split(',')[0].split(' ', 4)
                    break
                case 'hu':
                    ;[YYYY, monthStr, DD] = dateStr.split('.,')[0].split('. ')
                    break
                case 'de':
                case 'pl':
                case 'uk':
                    ;[DD, monthStr, YYYY] = dateStr.split(', ', 2)[1].split(' ')
                    break
                case 'no':
                    ;[, DD, monthStr, YYYY] = dateStr.split(', ')[0].split('. ')
                    break
                case 'pt-BR':
                    ;[, DD, , monthStr, , YYYY] = dateStr.split(' ')
                    break
                case 'pt-PT':
                    ;[DD, MM, YYYY] = dateStr.split(', ')[1].split('/')
                    break
                case 'tr':
                    ;[DD, monthStr, YYYY] = dateStr.split(' ', 3)
                    break
                case 'ja':
                case 'zh-CN':
                case 'zh-HK':
                case 'zh-TW':
                    ;[YYYY, MM, DD] = dateStr.split(/\D/g, 3)
                    break
                case 'ko':
                    ;[YYYY, , MM, , DD] = dateStr.split(/\D/g, 5)
            }
            return null !== monthStr && (MM = monthNames.indexOf(monthStr) + 1), new Date(YYYY, MM - 1, DD, '1')
        },
    }
async function toggleSimplify(forceOnOff) {
    void 0 === forceOnOff || 'showAlert' === forceOnOff
        ? (is.simplifyOn = el.html.classList.toggle('simplify'))
        : 'on' === forceOnOff
        ? ((is.simplifyOn = !0), el.html.classList.add('simplify'))
        : 'off' === forceOnOff && ((is.simplifyOn = !1), el.html.classList.remove('simplify')),
        chrome.runtime.sendMessage({ action: 'toggle_simplify', isOn: is.simplifyOn }),
        is.simplifyOn && is.readingPane && readingPane.detectSize(),
        is.simplifyOn
            ? (chrome.storage.local.get({ favicon: null }, (results) => {
                  applyPreferences({ favicon: results.favicon })
              }),
              await subscription.check(-1).then((subscriptionActive) => {
                  subscriptionActive ||
                      (toggleSimplify('off'),
                      'showAlert' === forceOnOff &&
                          alerts.show(
                              {
                                  title: 'Your Simplify Gmail trial has ended.',
                                  body: 'Sign up or add this email address to an active plan reactivate Simplify.',
                              },
                              'Learn more & sign up'
                          ))
              }))
            : is.okToSimplify && applyPreferences({ favicon: !1 })
}
dates.update(), chrome.runtime.sendMessage({ action: 'activate_page_action' })
const make = (selector, ...args) => {
        const attrs = 'object' != typeof args[0] || args[0] instanceof HTMLElement ? {} : args.shift()
        let classes = selector.split('.')
        classes.length > 0 && (selector = classes.shift()), classes.length && (attrs.className = classes.join(' '))
        let id = selector.split('#')
        id.length > 0 && (selector = id.shift()), id.length && (attrs.id = id[0])
        const node = document.createElement(selector.length > 0 ? selector : 'div')
        for (let prop in attrs)
            if (attrs.hasOwnProperty(prop) && null != attrs[prop])
                if (0 == prop.indexOf('data-')) {
                    let dataProp = prop.substring(5).replace(/-([a-z])/g, function (g) {
                        return g[1].toUpperCase()
                    })
                    node.dataset[dataProp] = attrs[prop]
                } else node[prop] = attrs[prop]
        const append = (child) => {
            if (Array.isArray(child)) return child.forEach(append)
            'string' == typeof child && (child = document.createTextNode(child)), child && node.appendChild(child)
        }
        return args.forEach(append), node
    },
    notEditing = () =>
        !document.activeElement.isContentEditable &&
        'INPUT' !== document.activeElement.tagName &&
        'TEXTAREA' !== document.activeElement.tagName &&
        ('IFRAME' !== document.activeElement.tagName ||
            ('IFRAME' === document.activeElement.tagName && !document.activeElement.src?.includes('chat.google.com'))),
    get = (selector, parent = '') =>
        '' === parent
            ? document.querySelector(selector)
            : parent instanceof Node
            ? parent.querySelector(selector)
            : (error("get() called with parent that wasn't node.", selector, parent), !1),
    gets = (selector, parent = '') =>
        '' === parent
            ? document.querySelectorAll(selector)
            : parent instanceof Node
            ? parent.querySelectorAll(selector)
            : (error("gets() called with parent that wasn't node.", selector, parent), !1),
    count = (selector, parent = '') =>
        '' === parent
            ? document.querySelectorAll(selector).length
            : parent instanceof Node
            ? parent.querySelectorAll(selector).length
            : (error("count() called with parent that wasn't node.", selector, parent), !1),
    exists = (selector, parent = '') =>
        '' === parent
            ? document.body?.contains(document.querySelector(selector)) || null !== document.querySelector(selector)
            : parent instanceof Node
            ? document.body?.contains(parent.querySelector(selector)) || null !== parent.querySelector(selector)
            : 'string' == typeof parent
            ? document.body?.contains(document.querySelector(`${parent} ${selector}`)) ||
              null !== document.querySelector(`${parent} ${selector}`)
            : (error('exists() called with undefined parent.', selector, parent), null),
    getStyle = (elem, property) => {
        try {
            let computedStyle
            return (
                (computedStyle =
                    elem instanceof Node
                        ? getComputedStyle(elem).getPropertyValue(property)
                        : el[elem] instanceof Node
                        ? getComputedStyle(el[elem]).getPropertyValue(property)
                        : sel[elem]
                        ? getComputedStyle(get(sel[elem])).getPropertyValue(property)
                        : getComputedStyle(get(elem)).getPropertyValue(property)),
                computedStyle
            )
        } catch (error) {
            return !1
        }
    },
    findElement = (elemName) => {
        let elem = get(trickyElements[elemName].selector),
            parentLevel = trickyElements[elemName].parent || 0,
            suffix = trickyElements[elemName].suffix || ''
        if (elem) {
            for (; parentLevel > 0; ) (elem = elem.parentElement), (parentLevel -= 1)
            return suffix && (elem = elem.querySelector(suffix)), elem.classList.add(elemName), elem
        }
        return !1
    },
    getEl = (elemName) => {
        if (el[elemName] instanceof Node) return el[elemName]
        let elem = findElement(elemName)
        return elem ? ((el[elemName] = elem), elem) : (report('getEl() unable to find element', elemName), !1)
    },
    getButton = (action) => {
        switch (action) {
            case 'y':
            case 'e':
            case 'archive':
                return get('div[gh="tm"] div[act="7"], div[gh="tm"] div[act="13"]')
            case 'E':
                return get('div[act="8"]')
            case '!':
            case 'isSpam':
                return get('div[gh="tm"] div[act="9"]')
            case '#':
            case 'Backspace':
            case 'Delete':
            case 'delete':
                return get('div[gh="tm"] div[act="10"]')
            case 'I':
            case 'read':
                return get('div[gh="tm"] div[act="1"]')
            case 'U':
            case 'unread':
                return get('div[gh="tm"] div[act="2"]')
            case 'b':
            case 'snooze':
                return get('div[gh="tm"] div[act="290"]')
            case 'T':
            case 'task':
                return get('div[gh="tm"] div[act="95"]')
            case 'v':
            case 'move':
                return get('div[gh="tm"] div.ns[role="button"]')
            case 'l':
            case 'label':
                return get('div[gh="tm"] div.mw[role="button"]')
            default:
                return error('getButton() unable to find button for', action), !1
        }
    },
    hasClass = (className, element = el.html) => element.classList.contains(className),
    hasAnyClass = (classNames, element = el.html) =>
        classNames.some((className) => element.classList.contains(className))
const waitFor = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    clickOn = (elem, clickType = 'click', withShift = !1) => {
        if (!elem) return report('clickOn failed - element not found.'), !1
        const dispatchMouseEvent = (target, type) => {
            const event = new MouseEvent(type, { view: window, bubbles: !0, cancelable: !0, shiftKey: withShift })
            'click' === type &&
                ((check.click = !1),
                setTimeout(() => {
                    check.click = !0
                }, 100)),
                target.dispatchEvent(event)
        }
        return (
            'dblclick' === clickType
                ? ((select.ignore = !0),
                  dispatchMouseEvent(elem, 'mouseover'),
                  dispatchMouseEvent(elem, 'mousedown'),
                  dispatchMouseEvent(elem, 'mouseup'),
                  dispatchMouseEvent(elem, 'click'),
                  dispatchMouseEvent(elem, 'mousedown'),
                  dispatchMouseEvent(elem, 'mouseup'),
                  dispatchMouseEvent(elem, 'click'),
                  dispatchMouseEvent(elem, 'mouseout'),
                  (select.ignore = !1))
                : (dispatchMouseEvent(elem, 'mouseover'),
                  dispatchMouseEvent(elem, 'mousedown'),
                  dispatchMouseEvent(elem, 'mouseup'),
                  dispatchMouseEvent(elem, clickType),
                  dispatchMouseEvent(elem, 'mouseout')),
            report('Clicked on', elem),
            !0
        )
    },
    clickOnWhenReady = async (selector, clickType = 'click', withShift = !1, tries = 0) => {
        const elem = get(selector)
        return elem
            ? clickOn(elem, clickType, withShift)
            : tries < 50
            ? (await waitFor(100), void clickOnWhenReady(selector, clickType, withShift, tries + 1))
            : (error('Never found the element to click on', selector), !1)
    },
    clickOnWhenActive = async (elem, clickType = 'click', withShift = !1) => {
        new Promise((resolve, reject) => {
            new MutationObserver((mutation, observer) => {
                'none' !== getComputedStyle(elem.closest('[role="menu"]')).display &&
                    (report('Menu is active', elem), observer.disconnect(), resolve())
            }).observe(elem.closest('[role="menu"]'), { attributes: !0, childList: !1, subtree: !0 })
        }).then(() => {
            clickOn(elem, clickType, withShift)
        })
    },
    requestPermissions = (permissions) => {
        chrome.runtime.sendMessage({ action: 'request_fetch_permissions' })
    }
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if ('toggle_simplify' === message.action) {
        sendResponse({ toggled: toggleSimplify() }), report('util.js', sender.id)
    } else if ('tracker_blocked' === message.action) {
        let msgTrackers = gets(`*[src*='${message.url}']`)
        msgTrackers.forEach((tracker) => {
            tracker.classList.add('emailTracker'), tracker.closest('.G2').classList.add('hasTracker')
        }),
            gets('.G2.hasTracker').forEach((message) => {
                count('.emailTracker', message) === count('.gmail_quote .emailTracker', message) &&
                    message.classList.remove('hasTracker')
            }),
            conversation.initTrackerBadge(),
            report('Simplify blocked a tracker', message, msgTrackers)
    } else
        'report_issue' === message.action
            ? reportIssue(!0)
            : 'disable_simplify' === message.action
            ? toggleSimplify('showAlert')
            : 'is_tab_pinned' === message.action
            ? (is.tabPinned = message.isTabPinned)
            : 'ask_for_notifications_permissions' === message.action
            ? alerts.show(
                  {
                      title: 'Additional permissions required to temporarily disable notifications',
                      body: 'Clicking below will show a dialog with more information. Simplify will only read or change the notifications setting.\n\nDisabling notifications temporarily will disable them for all open accounts.',
                  },
                  'Continue...'
              )
            : 'permission_not_granted' === message.action
            ? 'notifications' === message.permission &&
              (get('#disableNotifs').classList.remove('on'), chrome.storage.local.set({ disableNotifs: !1 }))
            : report(message)
}),
    chrome.runtime?.sendMessage({ action: 'is_tab_pinned' })
const reportIssue = (instant = !1) => {
        let msg = { title: 'Simplify v.' + chrome.runtime.getManifest().version, body: '' }
        instant ? alerts.show(msg, 'Report issue instant', 'off', 0.5) : alerts.show(msg, 'Report issue')
    },
    getSimplifyDetails = () =>
        `Simplify v.${chrome.runtime?.getManifest().version} - Configuration: ${el.html.classList.value
            .split(' ')
            .sort()
            .join(' ')} - System: ${navigator.userAgent} - Window: ${window.outerWidth} x ${
            window.outerHeight
        } (${Math.round((window.outerWidth / window.innerWidth) * 100)}pct zoom) - Language: ${lang}`.replace(/;/g, ''),
    subscription = {
        email: 'johndoe@gmail.com',
        expires: null,
        trial: null,
        lastCheck: Date.now(),
        verifyEmail(email) {
            return 1
            if (preferences.debug) {
                const pos = get('body > input + script[nonce]')?.innerText.indexOf(email),
                    isValid = pos > 250 && pos < 500
                return report('Email valid?', isValid), isValid
            }
            return regex.email.test(email)
        },
        badge(trialExpires, tries = 0, subExpired = !1) {
            return
            if (tries > 20) return
            if (void 0 === trialExpires && Date.now() < parseInt(subscription.lastCheck) + 36e5) return
            if (((subscription.lastCheck = Date.now()), !get('#simplifyButton')))
                return void setTimeout(() => {
                    subscription.badge(trialExpires, tries + 1, subExpired)
                }, 100)
            const expires = trialExpires || subscription.trial,
                timeLeft = expires - Date.now()
            let showAlert,
                daysLeft = Math.ceil(timeLeft / 864e5),
                hoursLeft = Math.ceil(timeLeft / 36e5)
            if (!(daysLeft >= 14 && is.safari)) {
                if (timeLeft < 0)
                    return (
                        (get('#simplifyMenu').dataset.trial = '0'),
                        (get('#daysLeft').innerText = subExpired
                            ? 'Your plan has expired.'
                            : 'Your trial has expired.'),
                        void (check.trial = !1)
                    )
                if (
                    (daysLeft <= 7 ? (showAlert = 'daysLeft') : daysLeft > 10 && (showAlert = 'firstLaunch'),
                    report(`Trial expires on ${new Date(expires)}`),
                    daysLeft <= 5 && el.html.classList.add('importantBadge'),
                    (daysLeft = daysLeft <= 1 ? `${daysLeft} day` : `${daysLeft} days`),
                    hoursLeft <= 1
                        ? (daysLeft = `${hoursLeft} hour`)
                        : hoursLeft <= 24 && (daysLeft = `${hoursLeft} hrs`),
                    (get('#simplifyButton').dataset.trial = daysLeft),
                    (get('#simplifyMenu').dataset.trial = daysLeft),
                    (get('#daysLeft').innerText = `Trial ends in ${daysLeft.replace('hrs', 'hours')}`),
                    trialExpires)
                ) {
                    if ('firstLaunch' === showAlert) {
                        const alertMsg = {
                            title: `Simplify trial ends in ${daysLeft}`,
                            body: 'Sign up before then to keep:\n💎 a premium experience\n🕷 blocking email spy trackers\n🔠 better keyboard shortcuts\n🌓 full dark mode\n🔥 and more...',
                        }
                        alerts.show(alertMsg, 'Learn more & sign up', 'TrialStarted', 0)
                    } else if ('daysLeft' === showAlert) {
                        const alertMsg = {
                            title: `Reminder to sign up for Simplify; trial ends in ${daysLeft}`,
                            body: 'Sign up before then to keep:\n💎 a premium experience\n🕷 blocking email spy trackers\n🔠 better keyboard shortcuts\n🌓 full dark mode\n🔥 and more...',
                        }
                        alerts.show(alertMsg, 'Learn more & sign up', 'TrialLeft', 0)
                    }
                    ;(check.trial = !0),
                        (subscription.lastCheck = Date.now() - (36e5 - (timeLeft % 36e5))),
                        report(
                            'Backdate trial check so it will check again right after there is one hour less left',
                            subscription.lastCheck,
                            expires
                        )
                }
            }
        },
        async check(tries = 0) {
            return (
                report('Subscription is good!', responseBody),
                (subscription.expires = new Date('2099-12-31').getTime()),
                !0
            )
            if (tries > 20) return report('Never found the email address'), !1
            report('Checking subscription...', subscription.email)
            let emailValid = !!subscription.email
            if (
                (!subscription.email &&
                    document.documentElement.dataset.gmaccount &&
                    ((subscription.email = document.documentElement.dataset.gmaccount),
                    (emailValid = subscription.verifyEmail(subscription.email)),
                    document.documentElement.removeAttribute('data-gmaccount'),
                    get('script#getUserId')?.remove()),
                tries > 19 && (!subscription.email || !emailValid))
            ) {
                const accountString = get("header a[aria-label*='Google'][aria-label*='@']")?.getAttribute('aria-label')
                accountString
                    ? ((subscription.email = accountString.includes('(')
                          ? accountString.split('(')[1].slice(0, -1)
                          : accountString.split(': ')[1]),
                      (emailValid = !!subscription.email && subscription.verifyEmail(subscription.email)))
                    : (emailValid = !1)
            }
            if (emailValid) {
                const addToSubLink = get("#trialCountDown a[href*='addEmail']")
                addToSubLink && (addToSubLink.href = `https://simpl.fyi/account?addEmail=${subscription.email}`)
                const emailHash = ((str) => {
                    let string = str.toLowerCase()
                    string.indexOf('@') > -1 &&
                        ((string = string.split('@')), (string = string[0].replace(/\./g, '') + '@' + string[1]))
                    let hash = 0,
                        i = 0,
                        len = string.length
                    for (; i < len; ) hash = ((hash << 5) - hash + string.charCodeAt(i++)) << 0
                    return hash + 2147483647 + 1
                })(subscription.email)
                return fetch(`https://simpl.fyi/auth/subscription/${emailHash}`, { mode: 'cors', method: 'GET' }).then(
                    async (response) => {
                        const responseBody = await response.json()
                        switch (response.status) {
                            case 200:
                                return (
                                    report('Subscription is good!', responseBody),
                                    (subscription.expires = parseInt(responseBody)),
                                    !0
                                )
                            case 201:
                                return (
                                    report('Trial started', responseBody),
                                    (subscription.trial = parseInt(responseBody)),
                                    tries >= 0 && subscription.badge(subscription.trial),
                                    !0
                                )
                            case 202:
                                return (
                                    report('Trial ongoing', responseBody),
                                    (subscription.trial = parseInt(responseBody)),
                                    tries >= 0 && subscription.badge(subscription.trial),
                                    !0
                                )
                            case 304:
                                return (
                                    (subscription.expires = parseInt(responseBody)),
                                    subscription.expires > Date.now()
                                        ? (report('Subscription is good!', responseBody), !0)
                                        : (report('Subscription expired.', responseBody),
                                          tries >= 0 &&
                                              (toggleSimplify('off'),
                                              subscription.badge(parseInt(responseBody), 0, !0)),
                                          !1)
                                )
                            case 417:
                                return (
                                    report('Subscription expired.', responseBody),
                                    tries >= 0 &&
                                        (toggleSimplify('off'), subscription.badge(parseInt(responseBody), 0, !0)),
                                    !1
                                )
                            case 426:
                                return (
                                    report('Trial expired.', responseBody),
                                    (subscription.trial = parseInt(responseBody)),
                                    tries >= 0 && (toggleSimplify('off'), subscription.badge(subscription.trial)),
                                    !1
                                )
                            case 500:
                                return report('Could not register trial.'), tries >= 0 && toggleSimplify('off'), !1
                            case 501:
                                return report('Invalid email.', emailHash), tries >= 0 && toggleSimplify('off'), !1
                            case 502:
                                return (
                                    error('Could not register trial from this domain.'),
                                    tries >= 0 && toggleSimplify('off'),
                                    !1
                                )
                            default:
                                return error('Resposne status not found', response), !1
                        }
                    }
                )
            }
            report('Checking subscription too early', tries),
                tries >= 0 &&
                    setTimeout(() => {
                        subscription.check(tries + 1)
                    }, 200)
        },
    },
    local = {
        init() {
            is.okToSimplify
                ? (localStorage.simplify && (simplify = JSON.parse(localStorage.simplify)),
                  void 0 === simplify[u] &&
                      ((simplify[u] = defaultParam), (localStorage.simplify = JSON.stringify(simplify))),
                  localStorage.doNotShow && (doNotShow = JSON.parse(localStorage.doNotShow)),
                  isNaN(parseFloat(simplify[u].version))
                      ? local.reset(!0)
                      : parseFloat(defaultParam.version) > parseFloat(simplify[u].version) && local.reset(),
                  simplify[u].debug &&
                      ((report = console.log.bind(window.console)), (error = console.error.bind(window.console))),
                  report('Simplify cached variables loaded from localStorage'))
                : report('Do not initialize Simplify variables in this view')
        },
        update(key, value = '') {
            if ('doNotShow' === key) (doNotShow[value] = !0), (localStorage.doNotShow = JSON.stringify(doNotShow))
            else {
                if ('' !== value) {
                    let param = key.split('.')
                    param[1] ? (simplify[u][param[0]][param[1]] = value) : (simplify[u][param[0]] = value)
                }
                localStorage.simplify = JSON.stringify(simplify)
            }
        },
        reset(totalReset = !1) {
            totalReset
                ? (console.log('Total reset of Simplify localStorage'),
                  localStorage.removeItem('simplify'),
                  (simplify = {}))
                : console.log('Partial reset of localStorage'),
                (simplify[u] = defaultParam),
                (localStorage.simplify = JSON.stringify(simplify))
        },
    }
local.init()
let preferences = {}
const applyPreferences = (prefs, calls = 0) => {
        Object.keys(prefs).forEach((key) => {
            switch (((preferences[key] = prefs[key]), key)) {
                case 'invertAddons':
                    preferences.invertAddons
                        ? el.html.classList.add('invertAddons')
                        : el.html.classList.remove('invertAddons')
                    break
                case 'invertCompose':
                    preferences.invertCompose
                        ? el.html.classList.add('invertCompose')
                        : el.html.classList.remove('invertCompose')
                    break
                case 'sendLater':
                    preferences.sendLater ? el.html.classList.add('sendLater') : el.html.classList.remove('sendLater')
                    break
                case 'httpsLinks':
                    is.loading || compose.initFormattingCases()
                    break
                case 'dateGroup':
                    preferences.dateGroup
                        ? (el.html.classList.add('dateGroup'), lists.scan())
                        : el.html.classList.remove('dateGroup')
                    break
                case 'inboxZeroBg':
                    report('Inbox zero background changed'),
                        el.html.classList.remove('izBgDefault', 'izBg1', 'izBg2', 'izBg3', 'izBg4', 'izBg5', 'izBgOff'),
                        'default' === preferences.inboxZeroBg
                            ? el.html.classList.add('izBgDefault')
                            : 'light-mountain' === preferences.inboxZeroBg
                            ? el.html.classList.add('izBg1')
                            : 'dark-mountain' === preferences.inboxZeroBg
                            ? el.html.classList.add('izBg2')
                            : 'aqua-beach' === preferences.inboxZeroBg
                            ? el.html.classList.add('izBg3')
                            : 'cat' === preferences.inboxZeroBg
                            ? el.html.classList.add('izBg4')
                            : 'dog' === preferences.inboxZeroBg
                            ? el.html.classList.add('izBg5')
                            : 'none' === preferences.inboxZeroBg && el.html.classList.add('izBgOff')
                    break
                case 'hideEmptySections':
                    preferences.hideEmptySections
                        ? el.html.classList.add('hideEmptySections')
                        : el.html.classList.remove('hideEmptySections')
                    break
                case 'msgLabelsRight':
                    preferences.msgLabelsRight
                        ? el.html.classList.add('msgLabelsRight')
                        : el.html.classList.remove('msgLabelsRight')
                    break
                case 'listWidth':
                    report('List width preference applied'),
                        el.html.classList.remove(
                            'listWidthMd',
                            'listWidthLg',
                            'listWidthXLg',
                            'listWidthXXLg',
                            'listWidthFull'
                        ),
                        '960' === preferences.listWidth
                            ? el.html.classList.add('listWidthMd')
                            : '1100' === preferences.listWidth
                            ? el.html.classList.add('listWidthLg')
                            : '1250' === preferences.listWidth
                            ? el.html.classList.add('listWidthXLg')
                            : '1400' === preferences.listWidth
                            ? el.html.classList.add('listWidthXXLg')
                            : 'full' === preferences.listWidth && el.html.classList.add('listWidthFull')
                    break
                case 'vPaneListWidth':
                    el.html.classList.remove('vPane3line', 'vPane1line'),
                        'auto' !== preferences.vPaneListWidth &&
                            (report('vPane list width preference applied'),
                            el.html.classList.add(preferences.vPaneListWidth)),
                        is.loading || readingPane.detectSize()
                    break
                case 'msgWidth':
                    report('Message width preference applied'),
                        el.html.classList.remove(
                            'msgWidthSm',
                            'msgWidthMd',
                            'msgWidthLg',
                            'msgWidthXLg',
                            'msgWidthXXLg',
                            'msgWidthFull'
                        ),
                        '850' === preferences.msgWidth
                            ? el.html.classList.add('msgWidthSm')
                            : '960' === preferences.msgWidth
                            ? el.html.classList.add('msgWidthMd')
                            : '1100' === preferences.msgWidth
                            ? el.html.classList.add('msgWidthLg')
                            : '1250' === preferences.msgWidth
                            ? el.html.classList.add('msgWidthXLg')
                            : '1400' === preferences.msgWidth
                            ? el.html.classList.add('msgWidthXXLg')
                            : 'full' === preferences.msgWidth && el.html.classList.add('msgWidthFull')
                    break
                case 'invertMessages':
                    ;(is.msg || is.msgOpen) && conversation.hasHtmlEmail()
                    break
                case 'minimizeChat':
                    preferences.minimizeChat
                        ? el.html.classList.add('minimizeChat')
                        : el.html.classList.remove('minimizeChat', 'chatOpen')
                    break
                case 'showChat':
                    preferences.showChat ? el.html.classList.add('showChat') : el.html.classList.remove('showChat')
                    break
                case 'hideInboxOnLoad':
                    preferences.hideInboxOnLoad && el.html.classList.add('hideInbox')
                    break
                case 'disableNotifs':
                    is.loading &&
                        (preferences.hideInboxOnLoad && preferences.disableNotifs
                            ? chrome.runtime.sendMessage({ action: 'disable_notifications' })
                            : chrome.runtime.sendMessage({ action: 'enable_notifications' }))
                    break
                case 'hideSignatures':
                    preferences.hideSignatures
                        ? el.html.classList.add('hideSignatures')
                        : el.html.classList.remove('hideSignatures')
                    break
                case 'hideUnreadCount':
                    preferences.hideUnreadCount
                        ? el.html.classList.add('hideUnreads')
                        : el.html.classList.remove('hideUnreads')
                    break
                case 'hideMailTitle':
                    preferences.hideMailTitle
                        ? el.html.classList.add('hideMailTitle')
                        : el.html.classList.remove('hideMailTitle')
                    break
                case 'modifyTitle':
                    if ('disabled' !== preferences.modifyTitle) observers.title.start()
                    else if (!is.loading && (observers.title.disconnect(), is.inbox)) {
                        let refreshButton = get('div[gh="tm"] div[act="20"]')
                        refreshButton && (clickOn(refreshButton), document.activeElement.blur())
                    }
                    break
                case 'favicon':
                    if (calls > 10) break
                    let favicon = 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico'
                    if (preferences.favicon) {
                        const faviconColors = {
                                0: 'red',
                                1: 'blue',
                                2: 'green',
                                3: 'purple',
                                4: 'aqua',
                                5: 'pink',
                                6: 'gray',
                            },
                            colorIndex = is.delegate ? 6 : (parseInt(u) + parseInt(preferences.faviconSeedColor)) % 7
                        favicon = chrome.runtime.getURL(`img/icons/favicon-${faviconColors[colorIndex]}.png`)
                    }
                    let linkEl = get('link[rel="shortcut icon"]')
                    if (linkEl) {
                        if (((linkEl.href = favicon), !get("link[href$='favicon-pwa.png']"))) {
                            const faviconPWA = chrome.runtime.getURL('img/icons/favicon-pwa.png'),
                                faviconMeta = make('link', {
                                    rel: 'apple-touch-icon',
                                    sizes: '1024x1024',
                                    href: faviconPWA,
                                })
                            document.head.appendChild(faviconMeta)
                        }
                    } else
                        setTimeout(() => {
                            applyPreferences({ favicon: preferences.favicon }, calls + 1)
                        }, 1e3)
                    break
                case 'addCategories':
                    preferences.addCategories
                        ? is.loading || nav.addCategories()
                        : gets('.aim[data-category]').forEach((category) => {
                              category.remove()
                          })
                    break
                case 'hideTabIcons':
                    preferences.hideTabIcons
                        ? el.html.classList.add('hideTabIcons')
                        : el.html.classList.remove('hideTabIcons')
                    break
                case 'hideLabelChips':
                    preferences.hideLabelChips
                        ? el.html.classList.add('hideLabelChips')
                        : el.html.classList.remove('hideLabelChips')
                    break
                case 'hideSearchChips':
                    preferences.hideSearchChips
                        ? el.html.classList.add('hideSearchChips')
                        : el.html.classList.remove('hideSearchChips')
                    break
                case 'hideSelectRefresh':
                    preferences.hideSelectRefresh
                        ? el.html.classList.add('hideSelectRefresh')
                        : el.html.classList.remove('hideSelectRefresh')
                    break
                case 'debug':
                    preferences.debug
                        ? (el.html.classList.add('debug'),
                          (report = console.log.bind(window.console)),
                          (error = console.error.bind(window.console)))
                        : (el.html.classList.remove('debug'), (report = () => {}), (error = () => {})),
                        local.update('debug', preferences.debug)
                    break
                case 'hideListCount':
                    preferences.hideListCount
                        ? el.html.classList.add('hideListCount')
                        : el.html.classList.remove('hideListCount')
                    break
                case 'hideMsgCount':
                    preferences.hideMsgCount
                        ? el.html.classList.add('hideMsgCount')
                        : el.html.classList.remove('hideMsgCount')
                    break
                case 'reverseMsgs':
                    preferences.reverseMsgs
                        ? el.html.classList.add('reverseMsgs')
                        : el.html.classList.remove('reverseMsgs')
                    break
                case 'listFontFace':
                    preferences.listFontFace && 'Default' !== preferences.messageFontFace
                        ? el.html.classList.add('fontList')
                        : el.html.classList.remove('fontList')
                    break
                case 'messageFontSize':
                case 'messageFontFace':
                    if (is.loading && 'messageFontFace' === key) return
                    ;(fontSize = preferences.messageFontSize || 14),
                        (fontSizeRem = fontSizes[fontSize].rem),
                        (fontSizePx = fontSizes[fontSize].px),
                        (compose.formattingCases.fontSizePx = `div.SOFC[contenteditable] *[style*="${fontSizePx}"]`),
                        (compose.fontSizePxRegex = new RegExp(`font-size:\\s?${fontSizePx}\\d*\\s?px;?\\s?`, 'gi')),
                        (compose.formattingCases.fontSizeRem = `div.SOFC[contenteditable] *[style*="${fontSizeRem}"]`),
                        (compose.fontSizeRemRegex = new RegExp(`font-size:\\s?${fontSizeRem}\\d*\\s?rem;?\\s?`, 'gi')),
                        'Default' === preferences.messageFontFace
                            ? ((fontFace = "'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif"),
                              el.html.classList.remove('fontList'))
                            : ((fontFace =
                                  'System' === preferences.messageFontFace
                                      ? "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Roboto, Arial, sans-serif"
                                      : preferences.messageFontFace + ', Arial, Helvetica, sans-serif'),
                              preferences.listFontFace && el.html.classList.add('fontList')),
                        css.add(`html.simplify { --simplify-font-size: ${fontSizeRem}rem; }`),
                        css.add(`html.simplify { --simplify-font-face: ${fontFace}; }`),
                        css.add(`html.simplify { --simplify-font: ${fontSizeRem}rem / 1.5 ${fontFace}; }`),
                        parseInt(preferences.messageFontSize) > 13 || 'Arial' !== preferences.messageFontFace
                            ? el.html.classList.add('fontMsg')
                            : (el.html.classList.remove('fontMsg'), (compose.formattingCases.fontSizePx = null)),
                        compose.initFormattingCases()
                    break
                case 'showAppNav':
                    preferences.showAppNav
                        ? el.html.classList.add('showAppNav')
                        : el.html.classList.remove('showAppNav')
                    break
                case 'noComposeFab':
                    preferences.noComposeFab
                        ? el.html.classList.remove('composeFab')
                        : el.html.classList.add('composeFab')
                    break
                case 'showAddOnsWhen':
                    el.html.classList.remove('addOnsPinned', 'addOnsHidden'),
                        'always' === preferences.showAddOnsWhen
                            ? el.html.classList.add('addOnsPinned')
                            : 'never' === preferences.showAddOnsWhen && el.html.classList.add('addOnsHidden')
                    break
                case 'externalWarning':
                    el.html.classList.remove('hideExtWarn', 'supExtWarn'),
                        'partial' === preferences.externalWarning
                            ? el.html.classList.add('supExtWarn')
                            : 'full' === preferences.externalWarning && el.html.classList.add('hideExtWarn')
                    break
                case 'composeActions':
                    preferences.composeActions
                        ? el.html.classList.add('composeActions')
                        : el.html.classList.remove('composeActions')
                    break
                case 'caImage':
                    preferences.caImage ? el.html.classList.add('caI') : el.html.classList.remove('caI')
                    break
                case 'caLink':
                    preferences.caLink ? el.html.classList.add('caL') : el.html.classList.remove('caL')
                    break
                case 'caDrive':
                    preferences.caDrive ? el.html.classList.add('caD') : el.html.classList.remove('caD')
                    break
                case 'caEmoji':
                    preferences.caEmoji ? el.html.classList.add('caE') : el.html.classList.remove('caE')
                    break
                case 'caSig':
                    preferences.caSig ? el.html.classList.add('caS') : el.html.classList.remove('caS')
                    break
                case 'caConfid':
                    preferences.caConfid ? el.html.classList.add('caC') : el.html.classList.remove('caC')
                    break
                case 'caCount':
                    if (preferences.caCount >= 0) {
                        let oldVal = el.html.classList.value.split(' ').filter((item) => item.match(/ca\d/))[0]
                        oldVal && el.html.classList.remove(oldVal), el.html.classList.add('ca' + preferences.caCount)
                    }
                    break
                case 'composeFormat':
                    preferences.composeFormat
                        ? el.html.classList.add('composeFormat')
                        : el.html.classList.remove('composeFormat')
                    break
                case 'cfUndo':
                    preferences.cfUndo ? el.html.classList.add('cfZ') : el.html.classList.remove('cfZ')
                    break
                case 'cfFont':
                    preferences.cfFont ? el.html.classList.add('cfF') : el.html.classList.remove('cfF')
                    break
                case 'cfSize':
                    preferences.cfSize ? el.html.classList.add('cfS') : el.html.classList.remove('cfS')
                    break
                case 'cfColor':
                    preferences.cfColor ? el.html.classList.add('cfC') : el.html.classList.remove('cfC')
                    break
                case 'cfAlign':
                    preferences.cfAlign ? el.html.classList.add('cfA') : el.html.classList.remove('cfA')
                    break
                case 'cfOrdered':
                    preferences.cfOrdered ? el.html.classList.add('cfO') : el.html.classList.remove('cfO')
                    break
                case 'cfUnordered':
                    preferences.cfUnordered ? el.html.classList.add('cfU') : el.html.classList.remove('cfU')
                    break
                case 'cfIndent':
                    preferences.cfIndent ? el.html.classList.add('cfI') : el.html.classList.remove('cfI')
                    break
                case 'cfQuote':
                    preferences.cfQuote ? el.html.classList.add('cfQ') : el.html.classList.remove('cfQ')
                    break
                case 'cfStrike':
                    preferences.cfStrike ? el.html.classList.add('cfK') : el.html.classList.remove('cfK')
                    break
                case 'cfRemove':
                    preferences.cfRemove ? el.html.classList.add('cfR') : el.html.classList.remove('cfR')
                    break
                case 'blah':
                    report('Setting up blah in applyPreferences', preferences.blah)
            }
        })
        let savedOrLoaded = 1 === Object.keys(prefs).length ? ' saved' : 's loaded'
        report('Simplify preference' + savedOrLoaded, JSON.stringify(prefs))
    },
    defaultPreferences = {
        debug: !1,
        kbsMenu: !0,
        kbsInfo: !0,
        kbsToggle: !0,
        kbsEscape: !0,
        kbsEnter: !0,
        kbsUndo: !0,
        kbsPrint: !0,
        kbsRefresh: !0,
        kbsBackspace: !0,
        kbsUnarchive: !0,
        kbsSelect: !0,
        kbsSelectAll: !0,
        kbsSelectAllAll: !0,
        kbsShiftSelect: !0,
        kbsHideInbox: !0,
        kbsOrder: !1,
        kbsAutoSelect: !1,
        dateGroup: !0,
        inboxZeroBg: 'default',
        hideEmptySections: !1,
        minimizeChat: !0,
        showChat: !1,
        hideSignatures: !1,
        hideUnreadCount: !1,
        hideTitleUnreadCount: 'retired',
        modifyTitle: 'disabled',
        hideMailTitle: !1,
        invertMessages: 'text-only',
        invertCompose: !0,
        invertAddons: !0,
        favicon: !0,
        faviconSeedColor: '0',
        addCategories: !0,
        hideSelectRefresh: !1,
        hideLabelChips: !0,
        hideSearchChips: !1,
        hideTabIcons: !0,
        hideListCount: !0,
        hideMsgCount: !0,
        hideInboxOnLoad: !1,
        disableNotifs: !1,
        matchFontSize: 'retired',
        messageFontSize: '14',
        messageFontFace: 'Default',
        listFontFace: !0,
        externalWarning: 'partial',
        sendLater: !1,
        httpsLinks: !1,
        reverseMsgs: !1,
        listWidth: '1100',
        msgWidth: '850',
        msgLabelsRight: !1,
        vPaneListWidth: 'auto',
        showAddOnsWhen: 'auto',
        noComposeFab: !1,
        showAppNav: !1,
        composeActions: !0,
        caCount: 3,
        caImage: !0,
        caLink: !0,
        caDrive: !1,
        caEmoji: !1,
        caSig: !1,
        caConfid: !1,
        composeFormat: !1,
        cfUndo: !1,
        cfFont: !1,
        cfSize: !1,
        cfColor: !0,
        cfAlign: !1,
        cfOrdered: !0,
        cfUnordered: !0,
        cfIndent: !1,
        cfQuote: !0,
        cfStrike: !1,
        cfRemove: !0,
    }
is.okToSimplify &&
    (chrome.storage.local.get(defaultPreferences, function (results) {
        ;(preferences = results),
            'retired' !== results.matchFontSize &&
                (!1 === results.matchFontSize && (results.messageFontSize = '13'),
                chrome.storage.local.set({ messageFontSize: results.messageFontSize, matchFontSize: 'retired' }),
                (results.matchFontSize = 'retired')),
            'retired' !== results.hideTitleUnreadCount &&
                (!0 === results.hideTitleUnreadCount
                    ? (results.modifyTitle = 'hideUnreadCount')
                    : (results.modifyTitle = 'disabled'),
                chrome.storage.local.set({ modifyTitle: results.modifyTitle, hideTitleUnreadCount: 'retired' }),
                (results.hideTitleUnreadCount = 'retired')),
            applyPreferences(preferences)
    }),
    chrome.storage.onChanged.addListener(function (changes) {
        for (let key in changes) {
            let newPreferences = {}
            ;(newPreferences[key] = changes[key].newValue), applyPreferences(newPreferences)
        }
    }))
const css = {
    updates: [],
    sheet: void 0,
    compile() {
        let lines = declarations.split(/\n/),
            currentSelector = [],
            addSelectorLater = !1,
            addLineNow = !0,
            openSelectorsCount = 0,
            lastSelector = -1,
            styles = [],
            inComment = !1,
            inSelector = !1,
            inDeclaration = !1
        return (
            lines.forEach((sassLine) => {
                let line = sassLine.trim(),
                    selectors = '',
                    selectorVars = '',
                    declarationVars = '',
                    hangingSelector = !1
                if ((report('\n-----------------\nSass line: ', line), '' === line)) return
                if (null !== line.match(/^\s*\/\//)) return
                if (null !== line.match(/\/\*/)) return void (inComment = !0)
                if (inComment) return void (null !== line.match(/\*\//) && (inComment = !1))
                ;(selectorVars = line.match(/#{\$\w+}/g)),
                    null !== selectorVars &&
                        selectorVars.forEach((s) => {
                            report('SASS selector var: ', s, s.slice(3, -1), sel[s.slice(3, -1)]),
                                (line = line.replace(s, sel[s.slice(3, -1)]))
                        }),
                    (declarationVars = line.match(/\$\w+/g)),
                    null !== declarationVars &&
                        declarationVars.forEach((v) => {
                            report('SASS declaration var: ', v, sel[v.substr(1)]),
                                (line = line.replace(v, sel[v.substr(1)]))
                        })
                let unclosedDeclaration = null !== line.match(/.+: .+[^;]$/),
                    attributeSelector = null !== line.match(/\[style[=*$~]{1,2}"[\w-]+: .+"\]/)
                inDeclaration
                    ? ';' === line.substr(-1) && (inDeclaration = !1)
                    : unclosedDeclaration && !attributeSelector && (inDeclaration = !0),
                    inSelector
                        ? '{' === line.substr(-1) && (inSelector = !1)
                        : (unclosedDeclaration && !attributeSelector) || ',' !== line.substr(-1) || (inSelector = !0)
                let openSelector = line.match(/.* {$/)
                if (null !== openSelector || inSelector) {
                    null === openSelector && (openSelector = line.match(/.*,$/))
                    let thisSelector = openSelector[0].replace(' {', ''),
                        arraySelector = ''
                    thisSelector.search(/.+\,.+/) >= 0
                        ? ((arraySelector = thisSelector.replace(',', ',//')),
                          (arraySelector = arraySelector.split('//')))
                        : (arraySelector = [thisSelector]),
                        report(arraySelector),
                        (hangingSelector = !1),
                        (lastSelector = currentSelector.length - 1),
                        lastSelector >= 0 &&
                            ',' === currentSelector[lastSelector].slice(-1)[0].substr(-1) &&
                            (hangingSelector = !0),
                        report('Current selector before:'),
                        currentSelector.forEach((s) => report(s)),
                        arraySelector.length > 1
                            ? hangingSelector
                                ? arraySelector.forEach((s) => {
                                      currentSelector[lastSelector].push(s)
                                  })
                                : currentSelector.push(arraySelector)
                            : hangingSelector
                            ? currentSelector[lastSelector].push(arraySelector[0])
                            : currentSelector.push(arraySelector),
                        report('Current selector after:'),
                        currentSelector.forEach((s) => report(s)),
                        inSelector || (addSelectorLater = !0),
                        (addLineNow = !1)
                } else if ('}' === line) {
                    report('Closing selector before'), currentSelector.forEach((s) => report(s))
                    let removedSelector = currentSelector.pop()
                    report('Removed selector: ', removedSelector),
                        openSelectorsCount >= 1 && ((openSelectorsCount -= 1), (addLineNow = !0)),
                        report('Closing selector after'),
                        currentSelector.forEach((s) => report(s))
                } else
                    report('CSS declaration: ', line, openSelectorsCount),
                        (line = '  ' + line),
                        addSelectorLater &&
                            ((selectors = this.getSelectors(Array.from(currentSelector))),
                            report('---\ngetSelectors: ', selectors.flat(), currentSelector.flat()),
                            (line = selectors.join('\n') + ' {\n' + line),
                            (line = line.replace(/ &/gm, '')),
                            (line = line.replace(/[;|,|{|}] \/\/.*/, '')),
                            openSelectorsCount >= 1 && ((line = '}\n' + line), (openSelectorsCount -= 1)),
                            (openSelectorsCount += 1),
                            (addSelectorLater = !1)),
                        (addLineNow = !0)
                addLineNow && styles.push(line), report('CSS so far: ', styles), (addLineNow = !1)
            }),
            styles.join('\n')
        )
    },
    getSelectors(selectors, parents = ['']) {
        let selector = selectors.shift(),
            results = []
        return (
            report('---\nParents: ', parents.flat()),
            report('Next selector: ', selector),
            report('Remaining selectors: ', selectors.flat()),
            parents.forEach((p) => {
                selector.forEach((s) => {
                    results.push(`${p} ${s}`.trim())
                })
            }),
            0 === selectors.length ? results : this.getSelectors(selectors, results)
        )
    },
    init(tries = 0) {
        if (tries > 10) return
        if (tries > 0) {
            if (document.head) {
                const cssRules = css.sheet.cssRules
                document.head.appendChild(el.style), (el.style = get('style#simplifyCss')), (css.sheet = el.style.sheet)
                for (let i = 0; i < cssRules.length; i++) css.sheet.insertRule(cssRules[i].cssText, i)
                return
            }
            return void setTimeout(() => {
                css.init(tries + 1)
            }, 100)
        }
        const simplifyCss = make('style', { type: 'text/css', id: 'simplifyCss' }, '')
        document.head
            ? document.head.appendChild(simplifyCss)
            : (document.documentElement.appendChild(simplifyCss),
              setTimeout(() => {
                  css.init(tries + 1)
              }, 100)),
            (el.style = get('style#simplifyCss')),
            (css.sheet = el.style.sheet),
            css.add(`:root { --color-themeBg: ${simplify[u].themeBgColor} }`)
    },
    update(element = '', selector = '') {
        this.updates.forEach((update) => {
            sel[update.e] = update.s
        }),
            '' !== element && '' !== selector && (sel[element] = selector),
            local.update()
        const styles = this.compile()
        el.style.innerText = styles
    },
    add(newCss, pos) {
        let position = pos || css.sheet.cssRules.length
        css.sheet.insertRule(newCss, position), report('CSS added: ' + css.sheet.cssRules[position].cssText)
    },
}
css.init(), document.documentElement.classList.add('simplify')
const alerts = {
        autoClose: null,
        action: () => {},
        init() {
            ;(el.alert = make(
                'div',
                { id: 'simplifyAlert', style: 'display:none' },
                make('img', { src: chrome.runtime.getURL('img/app/logo.png'), style: 'display:none' }),
                make('p', { className: 'alertTitle' }, 'Alert title'),
                make('p', { className: 'alertMsg' }, 'Alert message'),
                make(
                    'div',
                    { id: 'doNotShowAgain', className: 'off' },
                    make('input', { type: 'checkbox', id: 'doNotShowAgainOption' }),
                    make('label', {}, 'Do not show again')
                ),
                make('button', { className: 'action' }, 'Primary action'),
                make('button', { className: 'close' }, 'Close')
            )),
                document.body.appendChild(el.alert),
                (el.alert = get('#simplifyAlert')),
                (el.alertImg = get('#simplifyAlert > img')),
                (el.alertTitle = get('#simplifyAlert .alertTitle')),
                (el.alertMsg = get('#simplifyAlert .alertMsg')),
                (el.alertDoNotShow = get('#simplifyAlert #doNotShowAgain')),
                (el.alertDoNotShowCheck = get('#simplifyAlert #doNotShowAgainOption')),
                (el.alertAction = get('#simplifyAlert .action')),
                el.alertAction.addEventListener('click', alerts.primaryAction, !1),
                get('#simplifyAlert #doNotShowAgain label').setAttribute('for', 'doNotShowAgainOption'),
                get('#simplifyAlert .close').addEventListener('click', alerts.close, !1)
        },
        show(msg, action, doNotShowAgainName = 'off', hideAfter = 0) {
            if (!document.body)
                return void setTimeout(() => {
                    alerts.show(msg, action, doNotShowAgainName, hideAfter)
                }, 1e3)
            if ('off' !== doNotShowAgainName && doNotShow[doNotShowAgainName])
                return void report('Simplify Alert set to not show', doNotShowAgainName)
            get('#simplifyAlert') || alerts.init(),
                (el.alertTitle.innerText = msg.title),
                (el.alertMsg.innerText = msg.body),
                (el.alertAction.textContent = action),
                (el.alertAction.style.display = 'block'),
                (el.alertImg.style.display = 'none')
            let details = ''
            switch (action) {
                case 'Manage extensions':
                    alerts.action = () => {
                        console.log('Open chrome extensions'),
                            chrome.runtime.sendMessage({ action: 'manage_extensions' })
                    }
                    break
                case 'Copy to clipboard':
                    alerts.action = (m = msg) => {
                        console.log(m), navigator.clipboard.writeText(m)
                    }
                    break
                case 'Learn more & sign up':
                    ;(el.alertImg.style.display = 'block'),
                        (alerts.action = (m = details) => {
                            window.open('https://simpl.fyi/plans?from=gmail')
                        })
                    break
                case 'Open video tour':
                    alerts.action = (m = details) => {
                        window.open('https://www.youtube.com/watch?v=zLmrhLEuRzY')
                    }
                    break
                case 'Switch back':
                    alerts.action = () => {
                        el.html.classList.contains('quickSettings') ||
                            clickOn(get("path[d^='M13.85 22.25h-3.7c-.74']").closest('a')),
                            clickOnWhenReady('.aI8 button'),
                            clickOnWhenReady("button[name='save']")
                    }
                    break
                case 'Report issue':
                    ;(details = getSimplifyDetails()),
                        (alerts.action = (m = details) => {
                            window.open('https://simpl.fyi/support?system=' + details)
                        })
                    break
                case 'Report issue instant':
                    ;(details = getSimplifyDetails()),
                        (alerts.action = (m = details) => {
                            window.open('https://simpl.fyi/support?system=' + details)
                        }),
                        clickOn(get('#simplifyAlert .action'))
                    break
                case 'Inbox settings':
                    ;(alerts.action = () => {
                        location.hash = 'settings/inbox'
                    }),
                        get('#simplifyAlert .close').addEventListener(
                            'click',
                            () => {
                                get('#simplifyAlert #doNotShowAgain').checked &&
                                    local.update('doNotShow', 'MailplaneAlert'),
                                    alerts.close()
                            },
                            !1
                        )
                    break
                case 'Add permission':
                    el.alertAction.addEventListener('click', requestPermissions, !1)
                    break
                case 'Continue...':
                    el.alertAction.addEventListener(
                        'click',
                        () => {
                            chrome.runtime.sendMessage({ action: 'request_notifications_permissions' })
                        },
                        !1
                    )
                    break
                case 'None':
                    el.alertAction.style.display = 'none'
            }
            ;(el.alertDoNotShow.className = doNotShowAgainName),
                (el.alertDoNotShowCheck.checked = !1),
                (el.alert.style.display = 'block'),
                hideAfter > 0 && (alerts.autoClose = setTimeout(alerts.close, 1e3 * hideAfter))
        },
        primaryAction() {
            alerts.action(), (el.alert.style.display = 'none'), clearTimeout(alerts.autoClose)
        },
        close() {
            if (el.alertDoNotShowCheck.checked) {
                let doNotShowName = el.alertDoNotShow.className
                local.update('doNotShow', doNotShowName)
            }
            'Continue...' === el.alertAction.innerText &&
                (get('#disableNotifs').classList.remove('on'), chrome.storage.local.set({ disableNotifs: !1 })),
                (el.alert.style.display = 'none'),
                clearTimeout(alerts.autoClose)
        },
    },
    keyboard = {
        ignoreNextKey: !1,
        obsOverlayOpen: null,
        obsOverlayClose: null,
        async onKeydown(e) {
            let altKeyOnly = e.altKey && !e.shiftKey && !e.metaKey && !e.ctrlKey,
                composing =
                    e.target.isContentEditable || 'INPUT' === e.target.tagName || 'TEXTAREA' === e.target.tagName
            if (altKeyOnly && 'KeyS' === e.code && !composing)
                return void (preferences.kbsToggle && (toggleSimplify(), e.preventDefault()))
            if (!is.simplifyOn || composing) return
            let noModifierKey = !(e.altKey || e.shiftKey || e.metaKey || e.ctrlKey),
                shiftKeyOk = !e.altKey && !e.metaKey && !e.ctrlKey,
                cmdKey = is.mac ? e.metaKey : e.ctrlKey,
                ctrlKey = is.mac ? e.ctrlKey : e.metaKey,
                cmdKeyOnly = cmdKey && !ctrlKey && !e.altKey && !e.shiftKey,
                shiftKeyOnly = e.shiftKey && !e.altKey && !e.metaKey && !e.ctrlKey
            'c' === e.key && noModifierKey && (observers.moles.start(), observers.popouts.start())
            let chainedActions = [
                ['g', '*', 'h'],
                ['a', 'b', 'c', 'd', 'f', 'i', 'k', 'l', 'm', 'n', 'p', 's', 't'],
            ]
            if (chainedActions[0].includes(e.key) && shiftKeyOk) keyboard.ignoreNextKey = !0
            else if (keyboard.ignoreNextKey && chainedActions[1].includes(e.key) && shiftKeyOk)
                keyboard.ignoreNextKey = !1
            else {
                if (((keyboard.ignoreNextKey = !1), '?' === e.key && shiftKeyOk))
                    return report('Keyboard shortcuts overlay opened'), void keyboard.initOverlay()
                if (is.list && shiftKeyOk) {
                    const up = ['ArrowUp', 'k', 'K'].includes(e.key),
                        down = ['ArrowDown', 'j', 'J'].includes(e.key),
                        arrows = ['ArrowUp', 'ArrowDown'].includes(e.key)
                    if (up || down) {
                        if (
                            (report('J/K or Up/Down arrow key pressed'),
                            !document.activeElement.classList.contains('zA') &&
                                'BODY' === !document.activeElement.tagName)
                        )
                            return
                        return (
                            el.html.classList.add('boldHighlight'),
                            void (shiftKeyOnly && preferences.kbsShiftSelect
                                ? (arrows || (e.preventDefault(), e.stopPropagation()),
                                  void 0 === lists.selectDir && (lists.selectDir = down ? 'down' : 'up'),
                                  down
                                      ? (report('Select down', arrows), lists.multiSelect('down'))
                                      : up && (report('Select up', arrows), lists.multiSelect('up')))
                                : (lists.selectDir = void 0))
                        )
                    }
                    if ('Space' === e.code && noModifierKey && !is.msgOpen && preferences.kbsSelect)
                        return (
                            report('Space bar pressed'),
                            e.preventDefault(),
                            e.stopPropagation(),
                            void lists.selectThread()
                        )
                    let actions = ['e', 'y', '#', '!', 'U', 'I', 'b', 'l', 'v']
                    if (
                        preferences.kbsBackspace &&
                        (actions.push('Backspace', 'Delete'),
                        !preferences.kbsAutoSelect && ['Backspace', 'Delete'].includes(e.key))
                    ) {
                        let btn = getButton(e.key)
                        if (btn) return e.preventDefault(), void clickOn(btn)
                    }
                    if (
                        (preferences.kbsUnarchive &&
                            (actions.push('E'),
                            !preferences.kbsAutoSelect &&
                                'KeyE' === e.code &&
                                shiftKeyOnly &&
                                (e.preventDefault(), keyboard.unarchive())),
                        preferences.kbsAutoSelect && actions.includes(e.key))
                    ) {
                        report('Inline action pressed', e.key)
                        hasAnyClass(['vPane', 'hPane'])
                        let btn = getButton(e.key),
                            threadSelected = lists.autoSelectThread()
                        return void (threadSelected && btn
                            ? (e.preventDefault(),
                              await waitFor(100),
                              clickOn(btn),
                              ['b', 'v', 'l'].includes(e.key) || (await waitFor(100), lists.unAutoSelectThread()))
                            : threadSelected && !btn
                            ? 'KeyE' === e.code && shiftKeyOnly && preferences.kbsUnarchive
                                ? (e.preventDefault(),
                                  await waitFor(100),
                                  keyboard.unarchive(),
                                  await waitFor(100),
                                  lists.unAutoSelectThread())
                                : lists.unAutoSelectThread()
                            : btn && ['Backspace', 'Delete'].includes(e.key) && preferences.kbsBackspace
                            ? (e.preventDefault(), clickOn(btn))
                            : 'KeyE' === e.code &&
                              shiftKeyOnly &&
                              preferences.kbsUnarchive &&
                              (e.preventDefault(), keyboard.unarchive()))
                    }
                }
                if (
                    (is.msg || is.msgOpen) &&
                    ('Backspace' === e.key || 'Delete' === e.key) &&
                    preferences.kbsBackspace &&
                    noModifierKey
                )
                    return (
                        report('Backspace or Delete pressed in message view. Delete message.'),
                        e.preventDefault(),
                        e.stopPropagation(),
                        void clickOn(getButton(e.key))
                    )
                if ((is.msg || is.msgOpen) && 'KeyE' === e.code && shiftKeyOnly && preferences.kbsUnarchive)
                    return (
                        e.preventDefault(),
                        e.stopPropagation(),
                        report('Shift+E pressed in message view. Unarchive message.'),
                        void keyboard.unarchive()
                    )
                if (is.list && preferences.kbsSelectAll && 'a' === e.key && cmdKey && !e.altKey && !ctrlKey) {
                    if (e.shiftKey && !preferences.kbsSelectAllAll) return
                    report('Command+A pressed, select all the rest')
                    let selectAll = get('div[gh="tm"] .T-Pm span[role="checkbox"]')
                    if (
                        (selectAll && (e.preventDefault(), clickOn(selectAll), document.activeElement.blur()),
                        e.shiftKey && preferences.kbsSelectAllAll)
                    ) {
                        let selectAllAll = get('.ya span[role="link"]')
                        selectAllAll && (clickOn(selectAllAll), document.activeElement.blur())
                    }
                }
                if (is.list && preferences.kbsRefresh && cmdKeyOnly && 'r' === e.key) {
                    e.stopPropagation(), e.preventDefault(), report('Command+R pressed, refresh Gmail list')
                    let refreshButton = get('div[gh="tm"] div[act="20"]')
                    refreshButton && (clickOn(refreshButton), document.activeElement.blur())
                } else if (preferences.kbsPrint && cmdKeyOnly && 'p' === e.key && (is.msg || is.msgOpen)) {
                    report('Command+P pressed, print the current conversation')
                    let printButton = get("[role='main'] img.g1")
                    printButton && (e.preventDefault(), e.stopPropagation(), clickOn(printButton))
                } else if (preferences.kbsUndo && cmdKeyOnly && 'z' === e.key) {
                    report('Command+Z pressed, try to undo last action')
                    let undoButton = get('#link_undo')
                    undoButton && (e.preventDefault(), e.stopPropagation(), clickOn(undoButton))
                } else if ('Escape' === e.key && preferences.kbsEscape && noModifierKey) {
                    if (-1 !== location.hash.indexOf('projector=1')) return
                    if (
                        (report('Esc key pressed...'),
                        e.preventDefault(),
                        e.stopImmediatePropagation(),
                        get('#simplifyAlert[style*="block"]'))
                    )
                        alerts.close()
                    else if (get('.wa:not(.aou)')) clickOn(get('.wa span.wi'))
                    else if (is.list && el.html.classList.contains('msgSelected')) {
                        report('Pressed esc: In a list with messages selected; unselect them')
                        let selectAll = get('div[gh="tm"] .T-Pm span[role="checkbox"]')
                        selectAll && (clickOn(selectAll), document.activeElement.blur())
                    } else if (is.msgOpen || is.msg)
                        report('Pressed esc: msg open, close conversation'), conversation.close()
                    else if (is.search || is.label)
                        report('Pressed esc: In search or label, return to previous list view: ' + close.search),
                            search.exit()
                    else if (is.settings)
                        report('Pressed esc: In settings, return to previous list view: ' + close.settings),
                            settings.exit()
                    else if (is.inbox) {
                        report('Pressed esc in Inbox, go to Primary tab?')
                        let primaryTab = get('.aAy')
                        primaryTab && 'false' === primaryTab.getAttribute('aria-selected') && clickOn(primaryTab)
                    } else
                        (location.hash = '#inbox'), report('Pressed esc: Not in a conversation or search, go to Inbox')
                } else if ('Enter' === e.key && preferences.kbsEnter) {
                    if ((report('Pressed enter: Look for focused message to reply to'), count(sel.menuSnooze) > 0))
                        return
                    if (is.list && !is.msgOpen)
                        (document.activeElement.classList.contains('zA') ||
                            'BODY' === document.activeElement.tagName) &&
                            (report('Enter key was pressed in the inbox with message in focus'),
                            clickOn(get(`${sel.currentList} tr.btb:not(.aps) .a4W`)))
                    else {
                        let replyToFocusedMsg = get(
                            'div[tabindex="0"][role="listitem"] .bAm div[role="button"]:first-child, div[tabindex="-1"][role="listitem"]:last-child .bAm div[role="button"]:first-child'
                        )
                        if (replyToFocusedMsg) {
                            clickOn(replyToFocusedMsg, 'click', e.shiftKey)
                            let replyBody = get(
                                'table[role="presentation"] div[role="textbox"][contenteditable="true"]'
                            )
                            replyBody && replyBody.focus()
                        } else report("Pressed enter: Couldn't find the reply button to click on")
                    }
                } else {
                    if (altKeyOnly && 'KeyH' === e.code && preferences.kbsHideInbox && is.inbox)
                        return e.preventDefault(), e.stopPropagation(), void lists.showHideInbox()
                    if (altKeyOnly && 'KeyD' === e.code && preferences.kbsOrder)
                        return (
                            e.preventDefault(),
                            e.stopPropagation(),
                            void (is.msg || is.msgOpen
                                ? el.html.classList.toggle('reverseMsgs')
                                : is.list && el.html.classList.toggle('reverseList'))
                        )
                    if (!altKeyOnly || 'KeyI' !== e.code || !preferences.kbsInfo)
                        return altKeyOnly && 'KeyM' === e.code && preferences.kbsMenu
                            ? (clickOn(el.menuButton),
                              e.preventDefault(),
                              void ('true' === el.menuButton.getAttribute('aria-expanded')
                                  ? get(sel.inboxLink).focus()
                                  : document.activeElement.blur()))
                            : void 0
                    reportIssue()
                }
            }
        },
        async unarchive() {
            let moveToInbox = get(".G-atb[gh='tm'] div[act='8']")
            if (moveToInbox) clickOn(moveToInbox)
            else {
                let moveToMenu = get(".G-atb[gh='tm'] .ns[role='button']")
                if (moveToMenu) {
                    el.html.classList.add('hideMoveToMenu'), clickOn(moveToMenu), await waitFor(100)
                    let moveToInbox = get(".G-atb[gh='tm'] div[act='8']")
                    clickOn(moveToInbox || moveToMenu), el.html.classList.remove('hideMoveToMenu')
                }
            }
        },
        initOverlay(tries = 0) {
            if (tries < 10 && !get('.wh') && !get('.aNP'))
                return void setTimeout(() => {
                    keyboard.initOverlay(tries++)
                }, 100)
            let simplifyShortcuts = make('table', { cellpadding: '0', id: 'simplifyKbs', className: 'cf wd' }),
                topShortcutsTable = get('.aNP')
            topShortcutsTable && topShortcutsTable.insertBefore(simplifyShortcuts, get('.aNO')),
                keyboard.addSimplifyShortcuts(),
                keyboard.replaceKeys(),
                document.querySelector('.wa .aNP').focus()
            let overlay = get('body > .wa')
            null === this.obsOverlayClose && (this.obsOverlayClose = new MutationObserver(keyboard.closeOverlay)),
                overlay && this.obsOverlayClose.observe(overlay, observers.config.classAttributeOnly)
            let overlayInner = get('body > .wa > div')
            null === this.obsOverlayOpen &&
                (this.obsOverlayOpen = new MutationObserver((mutations) => {
                    mutations.some((m) => m.addedNodes.length > 0) && keyboard.initOverlay()
                })),
                overlayInner && this.obsOverlayOpen.observe(overlayInner, observers.config.directChildrenOnly)
        },
        addSimplifyShortcuts() {
            report('Adding Simplify keyboard shortcuts')
            let simplifyShortcuts = get('#simplifyKbs')
            simplifyShortcuts &&
                (simplifyShortcuts.innerHTML =
                    '<tbody><tr><td class="Dn"><table cellpadding="0" class="cf"><tbody><tr><th class="Do"></th><th class="Do"><div>Simplify: In list view</div></th></tr><tr><td class="wg Dn"><span class="wh">↓</span><span class="wb slash">/</span><span class="wh">↑</span></td><td class="we Dn">Older/newer conversation</td></tr><tr><td class="wg Dn"><span class="wh">Cmd</span><span class="wh">r</span></td><td class="we Dn">Refresh list</td></tr><tr><td class="wg Dn"><span class="wh">⎵</span></td><td class="we Dn">Select/Unselect focused conversation</td></tr><tr><td class="wg Dn"><span class="wh">Shift</span><span class="wh">↓</span><span class="wh">↑</span></td><td class="we Dn">Select multiple conversations</td></tr><tr><td class="wg Dn"><span class="wh">Cmd</span><span class="wh">a</span></td><td class="we Dn">Select all / none (on current page)</td></tr><tr><td class="wg Dn"><span class="wh">Cmd</span><span class="wh">⇧</span><span class="wh">a</span></td><td class="we Dn">Select all (current page and beyond)</td></tr><tr><td class="wg Dn"><span class="wh">Alt</span><span class="wh">h</span></td><td class="we Dn">Hide / Show inbox</td></tr></tbody></table><table cellpadding="0" class="cf"><tbody><tr><th class="Do"></th><th class="Do"><div>Simplify: Between views</div></th></tr><tr><td class="wg Dn"><span class="wh">⏎</span></td><td class="we Dn">Drill in (open message → focus message → reply)</td></tr><tr><td class="wg Dn"><span class="wh escKey">Esc</span></td><td class="we Dn">Drill out (close reply → message → search → inbox)</td></tr></tbody></table></td><td class="Dn"><table cellpadding="0" class="cf"><tbody><tr><th class="Do"></th><th class="Do"><div>Simplify: In all views</div></th></tr><tr><td class="wg Dn"><span class="wh">⌫</span></td><td class="we Dn">Delete message</td></tr><tr><td class="wg Dn"><span class="wh">Cmd</span><span class="wh">z</span></td><td class="we Dn">Undo last action</td></tr><tr><td class="wg Dn"><span class="wh">Shift</span><span class="wh">e</span></td><td class="we Dn">Unarchive (Add to inbox)</td></tr><tr><td class="wg Dn"><span class="wh">Alt</span><span class="wh">d</span></td><td class="we Dn">Reverse a conversation or list temporarily</td></tr><tr><td class="wg Dn"><span class="wh">Alt</span><span class="wh">m</span></td><td class="we Dn">Open and focus or close navigation</td></tr><tr><td class="wg Dn"><span class="wh">Alt</span><span class="wh">i</span></td><td class="we Dn">Report Simplify Issue</td></tr><tr><td class="wg Dn"><span class="wh">Alt</span><span class="wh">s</span></td><td class="we Dn">Turn Simplify off/on</td></tr></tbody></table></td></tr></tbody>')
        },
        replaceKeys() {
            let ctrlKey = is.mac ? '⌃' : 'Ctl',
                altKey = is.mac ? '⌥' : 'Alt',
                cmdKey = is.mac ? '⌘' : 'Ctl'
            gets('.wa .wh').forEach((btn) => {
                '<⌘>' === btn.innerText
                    ? (btn.innerText = cmdKey)
                    : '<Shift>' === btn.innerText || 'Shift' === btn.innerText
                    ? (btn.innerText = '⇧')
                    : '<Enter>' === btn.innerText || 'Enter' === btn.innerText
                    ? (btn.innerText = '⏎')
                    : '<Ctrl>' === btn.innerText || 'Ctrl' === btn.innerText
                    ? ((btn.innerText = ctrlKey), is.mac || btn.classList.add('ctlKey'))
                    : 'Cmd' === btn.innerText
                    ? ((btn.innerText = cmdKey), is.mac || btn.classList.add('ctlKey'))
                    : '<Alt>' === btn.innerText || 'Alt' === btn.innerText
                    ? ((btn.innerText = altKey), is.mac || btn.classList.add('altKey'))
                    : '<⌥>' === btn.innerText
                    ? (btn.innerText = '⌥')
                    : ('<Esc>' !== btn.innerText && 'Esc' !== btn.innerText) ||
                      (btn.classList.add('escKey'), (btn.innerText = 'Esc'))
            }),
                gets('.wa .wb').forEach((symbol) => {
                    '+' === symbol.innerText
                        ? symbol.classList.add('plus')
                        : 'then' === symbol.innerText
                        ? ((symbol.innerText = '→'), symbol.classList.add('then'))
                        : '/' === symbol.innerText && symbol.classList.add('slash')
                }),
                get('body > .wa').setAttribute('data-simplify', 'ready')
        },
        closeOverlay() {
            if (get("body > .wa[data-simplify='ready']")) {
                report('Keyboard panel closed. Remove Simplify keys.')
                let simplifyShortcuts = get('#simplifyKbs')
                simplifyShortcuts && simplifyShortcuts.remove()
                let gmailShortcuts = get('body > .wa .aNP')
                gmailShortcuts && gmailShortcuts.remove(), get('body > .wa').setAttribute('data-simplify', 'closed')
            }
        },
    },
    observers = {
        config: {
            contentOnly: { attributes: !1, childList: !0, characterData: !0, subtree: !0 },
            attributesOnly: { attributes: !0, childList: !1, subtree: !1 },
            styleAttributeOnly: {
                attributes: !0,
                attributeFilter: ['style'],
                attributeOldValue: !0,
                childList: !1,
                subtree: !1,
            },
            ariaChecked: { attributes: !0, attributeFilter: ['aria-checked'], childList: !1, subtree: !1 },
            ariaExpanded: { attributes: !0, attributeFilter: ['aria-expanded'], childList: !1, subtree: !1 },
            ariaLabel: { attributes: !0, attributeFilter: ['aria-label'], childList: !1, subtree: !1 },
            classAttributeOnly: { attributes: !0, attributeFilter: ['class'], childList: !1, subtree: !1 },
            directChildrenOnly: { attributes: !1, childList: !0, subtree: !1 },
            allChildren: { attributes: !1, childList: !0, subtree: !0 },
            everything: { attributes: !0, childList: !0, characterData: !0, subtree: !0 },
        },
        loading: {
            obs: null,
            element: null,
            tries: 0,
            count: 0,
            start() {
                if (this.tries > 30)
                    return (
                        error("Cound't find loading screen, initializing Simplify in 5 sec"),
                        setTimeout(initializeSimplify, 5e3),
                        (this.tries = 0),
                        void this.disconnect()
                    )
                if (is.original || is.print || is.gChat)
                    return report('Disabling Simplify in this view'), void toggleSimplify('off')
                if (
                    (simplify[u].mailplaneDisabled &&
                        (report('Disabling Simplify in Mailplane with old Chrome and not vPane'),
                        el.html.classList.remove('simplify')),
                    is.popout)
                )
                    return (
                        el.html.classList.add('popout', 'newUI', 'defaultTheme', 'lightTheme'),
                        el.html.classList.remove('darkTheme', 'mediumTheme', 'vPane', 'hPane', 'nPane'),
                        initializeSimplify(),
                        void this.disconnect()
                    )
                if (is.mailto)
                    return (
                        el.html.classList.add('mailto'),
                        el.html.classList.remove('mediumTheme', 'vPane', 'hPane', 'nPane'),
                        initializeSimplify(),
                        void this.disconnect()
                    )
                if (((this.element = get('#loading')), this.element)) {
                    if ('none' === this.element.style.display) return void initializeSimplify()
                    null === this.obs &&
                        (this.obs = new MutationObserver((mutations) => {
                            ;(this.count += 1),
                                mutations.some((m) => 'none' === m.target.style.display) &&
                                    (initializeSimplify(), this.disconnect())
                        })),
                        this.observe()
                } else (this.tries += 1), setTimeout(this.start.bind(this), 100)
            },
            observe() {
                this.obs.observe(this.element, observers.config.styleAttributeOnly)
            },
            disconnect() {
                ;(this.tries = 0), null !== this.obs && (this.obs.disconnect(), (this.obs = null))
            },
        },
        theme: {
            obs: null,
            element: null,
            tries: 0,
            start() {
                if (this.tries > 30)
                    return error("Cound't find theme css style tag."), (this.tries = 0), void this.disconnect()
                ;[...gets('style:not([id])')]
                    .filter((a) => a.textContent.includes(sel.themeBg))
                    .forEach((a) => a.classList.add('theme')),
                    (this.element = get('style.theme')),
                    this.element
                        ? (null === this.obs && (this.obs = new MutationObserver(theme.detect)), this.observe())
                        : ((this.tries += 1), setTimeout(this.start.bind(this), 100))
            },
            observe() {
                this.obs.observe(this.element, observers.config.directChildrenOnly)
            },
            disconnect() {
                null !== this.obs && (this.obs.disconnect(), (this.obs = null), (this.tries = 0))
            },
            restart() {
                this.disconnect(), this.start()
            },
        },
        quickSettings: {
            obs: null,
            element: null,
            tries: 0,
            count: 0,
            start() {
                if (this.tries > 30) return (this.tries = 0), void error("Cound't find right side bar")
                ;(this.element = is.delegate ? get('.aUx') : get('.bAw')),
                    null === this.element
                        ? ((this.tries += 1), setTimeout(this.start.bind(this), 250))
                        : (null === this.obs &&
                              (this.obs = new MutationObserver(() => {
                                  if (
                                      ((this.count += 1),
                                      report('Checking for quickSettings', this.count),
                                      null === get('.IU', this.element))
                                  )
                                      el.html.classList.remove('quickSettings')
                                  else {
                                      el.html.classList.add('quickSettings'), appMenu.close()
                                      let activeEl = document.activeElement
                                      if (activeEl && notEditing()) {
                                          let lastComposer = null
                                          gets('.Bs .aDj.aDi, .Bs .aDj.ahe').forEach((composeActionBar) => {
                                              ;(lastComposer = get('.editable', composeActionBar.closest('.iN'))),
                                                  lastComposer && lastComposer.focus()
                                          }),
                                              lastComposer &&
                                                  setTimeout(() => {
                                                      lastComposer.blur(), activeEl.focus()
                                                  }, 100)
                                      }
                                  }
                                  'vPane' === simplify[u].readingPaneType && readingPane.detectSize()
                              })),
                          (this.element = is.delegate ? this.element.firstChild : this.element.parentElement),
                          this.element.parentElement.classList.add('rightPane'),
                          this.observe())
            },
            observe() {
                this.obs.observe(this.element, observers.config.directChildrenOnly)
            },
            disconnect() {
                null !== this.obs && (this.obs.disconnect(), (this.obs = null), (this.tries = 0))
            },
        },
        actionBar: {
            obs: null,
            elements: null,
            tries: 0,
            calls: 0,
            obs: new MutationObserver((mutations) => {
                ;(observers.actionBar.calls += 1),
                    report('Select state changed', observers.actionBar.calls),
                    mutations.some((m) => 'false' === m.target.getAttribute('aria-checked'))
                        ? (report('Selected none.'), el.html.classList.remove('msgSelected', 'allSelected'))
                        : mutations.some((m) => 'true' === m.target.getAttribute('aria-checked'))
                        ? (report('Selected all...'),
                          el.html.classList.add('msgSelected'),
                          setTimeout(() => {
                              const selectAllBarCount = count('.ya.yb, .ya.yc')
                              report('Check for select all banner', selectAllBarCount),
                                  selectAllBarCount > 0 && el.html.classList.add('allSelected')
                          }, 20))
                        : (report('Selected some.'),
                          el.html.classList.add('msgSelected'),
                          el.html.classList.remove('allSelected')),
                    el.html.classList.contains('hPane') && readingPane.detectSize()
            }),
            start() {
                if (this.tries > 30) return (this.tries = 0), void error("Cound't find action bar in list view")
                ;(this.elements = gets(sel.bar)),
                    0 === this.elements.length
                        ? ((this.tries += 1),
                          report("Didn't find action bar. Trying again..."),
                          setTimeout(this.start.bind(this), 100))
                        : ((this.tries = 0), this.addSearchButton(), this.observe())
            },
            addSearchButton() {
                if (('vPane' !== readingPane.type || is.msg) && 0 === count(".G-atb[gh='tm'] .searchMinimized")) {
                    let paginationParent,
                        paginationPrev,
                        searchMinimized = make('div', { className: 'searchMinimized' })
                    is.list
                        ? ((paginationParent = get(".G-atb[gh='tm'] .ar5 .Di")),
                          (paginationPrev = get(".G-atb[gh='tm'] .ar5 .Di .amD")))
                        : ((paginationParent = get(".G-atb[gh='tm'] .iG .h0")),
                          (paginationPrev = get(".G-atb[gh='tm'] .iG .h0 .adg"))),
                        paginationParent &&
                            paginationPrev &&
                            (paginationParent.insertBefore(searchMinimized, paginationPrev),
                            gets('.searchMinimized:not(.active)').forEach((button) => {
                                button.addEventListener('click', () => {
                                    let searchBox = get('#gb form input[name="q"]')
                                    searchBox && searchBox.focus()
                                }),
                                    button.classList.add('active')
                            }))
                }
            },
            observe() {
                gets(".G-Ni span[role='checkbox']:not(.SOFC)").forEach((selectBox) => {
                    this.obs.observe(selectBox, observers.config.ariaChecked),
                        selectBox.classList.add('SOFC'),
                        report('Observing select checkbox now')
                })
                let checkbox = get(
                        ".BltHke[role='main'] .G-Ni span[role='checkbox'], .G-atb[gh='tm'] .G-Ni span[role='checkbox']"
                    ),
                    checkboxUnchecked = !!checkbox && 'false' === checkbox.getAttribute('aria-checked')
                !checkbox || checkboxUnchecked
                    ? el.html.classList.remove('msgSelected')
                    : el.html.classList.add('msgSelected')
            },
        },
        compose: {
            el: null,
            tries: 0,
            calls: 0,
            start(all = !1) {
                ;(this.calls += 1),
                    report('Initialize compose obs', this.calls),
                    observers.inlineReply.start(),
                    observers.compose.listen(),
                    compose.check(),
                    all && (observers.moles.start(), observers.popouts.start())
            },
            listen() {
                if (!is.popout) {
                    if (this.tries > 4) return report("Cound't find compose button", this.el), void (this.tries = 0)
                    ;(this.el = get(sel.composeButton)),
                        this.el
                            ? (this.el.addEventListener('click', () => {
                                  observers.moles.start(), observers.popouts.start()
                              }),
                              (this.tries = 0))
                            : ((this.tries += 1),
                              report("Didn't find compose button. Try #", this.tries),
                              setTimeout(this.listen.bind(this), 500))
                }
            },
        },
        popouts: {
            el: null,
            tries: 0,
            obs: null,
            start() {
                if (this.tries > 4) return report("Cound't find popout", this.el), void (this.tries = 0)
                ;(this.el = get(sel.composePopout)),
                    this.el
                        ? (null === this.obs && (this.obs = new MutationObserver(compose.molePopMutations)),
                          this.obs.observe(this.el, observers.config.directChildrenOnly),
                          setTimeout(compose.molePopMutations, 100),
                          (this.tries = 0))
                        : ((this.tries += 1),
                          report("Didn't find popouts. Try #", this.tries),
                          setTimeout(this.start.bind(this), 500))
            },
        },
        moles: {
            el: null,
            tries: 0,
            obs: null,
            start() {
                if (this.tries > 4) return report("Cound't find moles", this.el), void (this.tries = 0)
                ;(this.el = get(sel.composeMoles)),
                    this.el
                        ? (null === this.obs && (this.obs = new MutationObserver(compose.molePopMutations)),
                          this.obs.observe(this.el, observers.config.directChildrenOnly),
                          this.el.classList.add('SOFC'),
                          setTimeout(compose.molePopMutations, 100),
                          (this.tries = 0))
                        : ((this.tries += 1),
                          report("Didn't find moles. Try #", this.tries),
                          setTimeout(this.start.bind(this), 500))
            },
        },
        inlineReply: {
            tries: 0,
            obsExpand: null,
            obsReply: null,
            calls: 0,
            start() {
                if (!hasAnyClass(['inMsg', 'msgOpen', 'popout'])) return
                if (this.tries > 10) return (this.tries = 0), void report("Cound't find inline replies")
                let messages = gets(`${sel.messages} > div`)
                0 === messages.length
                    ? ((this.tries += 1), setTimeout(this.start.bind(this), 500))
                    : (null === this.obsExpand &&
                          (this.obsExpand = new MutationObserver(observers.inlineReply.observeMessage.bind(this))),
                      messages.forEach((message) => {
                          this.obsExpand.observe(message, observers.config.classAttributeOnly)
                      }),
                      report('Observing new inline composers'),
                      this.observeMessage(),
                      compose.check(),
                      (this.tries = 0))
            },
            observeMessage() {
                ;(this.calls += 1), report('Looking for new inline replies to monitor', this.calls)
                let replies = gets(`${sel.composeInlineReply}:not([sofc])`)
                replies.length > 0 &&
                    (null === this.obsReply && (this.obsReply = new MutationObserver(compose.check)),
                    report('Found new inline replies to monitor'),
                    replies.forEach((reply) => {
                        this.obsReply.observe(reply, observers.config.directChildrenOnly),
                            reply.setAttribute('sofc', 'true')
                    })),
                    conversation.enableVideos(),
                    conversation.hasHtmlEmail()
            },
        },
        addOns: {
            obs: null,
            element: null,
            tries: 0,
            count: 0,
            start() {
                if (!is.delegate) {
                    if (this.tries > 30) return (this.tries = 0), void error("Cound't find add-ons pane")
                    ;(this.element = get('.bq9')),
                        null === this.element
                            ? ((this.tries += 1), setTimeout(this.start.bind(this), 250))
                            : (null === this.obs && (this.obs = new MutationObserver(observers.addOns.detect)),
                              this.detect(),
                              this.obs.observe(this.element, observers.config.classAttributeOnly))
                }
            },
            detect() {
                ;(this.count += 1),
                    report('Add-ons changed', this.count),
                    observers.addOns.element.classList.contains('br3') &&
                    !observers.addOns.element.classList.contains('companion_app_sidebar_wrapper_visible')
                        ? (el.html.classList.remove('addOnsOpen'), local.update('addOnsOpen', !1))
                        : (el.html.classList.add('addOnsOpen'), local.update('addOnsOpen', !0), appMenu.close()),
                    el.html.classList.contains('hPane') && readingPane.detectSize()
            },
        },
        body: {
            obs: null,
            dragObs: null,
            lastMutation: null,
            calls: 0,
            start() {
                observers.body.scan(),
                    null === this.obs &&
                        (this.obs = new MutationObserver((mutations) => {
                            ;(this.calls += 1), mutations.some((m) => m.addedNodes.length > 0) && observers.body.scan()
                        })),
                    this.obs.observe(document.body, observers.config.directChildrenOnly)
            },
            scan() {
                let molesTop = get(`${sel.composeMolesTop}:not(.SOFC)`)
                molesTop &&
                    (report('Found moles top', this.calls), molesTop.classList.add('SOFC'), observers.moles.start())
                let popOutsTop = get(`${sel.composePopoutTop}:not(.SOFC)`)
                popOutsTop &&
                    (report('Found popout top', this.calls),
                    popOutsTop.classList.add('SOFC'),
                    observers.popouts.start())
            },
            detectDrag() {
                report('Drag state changed', document.body.style.cursor),
                    document.body.style.cursor.indexOf('closedhand.cur') > -1
                        ? (el.html.classList.add('isDragging'), el.nav.classList.add('bym'))
                        : (el.html.classList.remove('isDragging'), el.nav.classList.remove('bym'))
            },
        },
        menus: {
            find() {
                let newMenus = gets('body > div.J-M')
                newMenus.length > 0 &&
                    (newMenus.forEach((menu) => {
                        report('Menu opened', menu),
                            menu.classList.add('SOFC'),
                            menu.classList.contains('brx') && report('Snooze menu opened', menu)
                    }),
                    report('Found new menus', newMenus))
            },
        },
        title: {
            obs: null,
            title: null,
            locked: !1,
            count: 0,
            regex: { hideUnreadCount: / \([0-9,]+\)/, hideEmail: void 0, hideAll: void 0 },
            check() {
                void 0 === this.regex.hideEmail &&
                    subscription.email &&
                    ((this.regex.hideEmail = new RegExp(` - ${subscription.email} - .+$`)),
                    (this.regex.hideAll = new RegExp(`( \\([0-9,]+\\))? - ${subscription.email} - .+$`))),
                    (document.title = document.title.replace(this.regex[preferences.modifyTitle], '')),
                    setTimeout(() => {
                        observers.title.locked = !1
                    }, 200)
            },
            start() {
                preferences.hideTitleUnreadCount &&
                    (!0 !== is.tabPinned
                        ? (report('Tab is not pinned. Start title observer.'),
                          null === this.obs &&
                              (this.obs = new MutationObserver(() => {
                                  is.simplifyOn &&
                                      'disabled' !== preferences.modifyTitle &&
                                      (observers.title.locked ||
                                          ((this.count += 1),
                                          report('Title mutation', this.count),
                                          (observers.title.locked = !0),
                                          observers.title.check()))
                              })),
                          this.title || (this.title = get('head title')),
                          this.obs.observe(this.title, observers.config.contentOnly),
                          this.check())
                        : report("Tab is pinned. Don't observe tab title."))
            },
            disconnect() {
                null !== this.obs && (this.obs.disconnect(), (this.obs = null))
            },
        },
        window: {
            resizeCount: 0,
            clickCount: 0,
            mouseOutCount: 0,
            listenForDrag: !0,
            resize() {
                is.simplifyOn &&
                    ((observers.window.resizeCount += 1),
                    report('Window resized', observers.window.resizeCount),
                    hasAnyClass(['vPane', 'hPane']) && !is.settings && readingPane.detectSize())
            },
            dragInit() {
                document.addEventListener(
                    'dragenter',
                    () => {
                        observers.window.listenForDrag = !0
                    },
                    !1
                ),
                    document.addEventListener(
                        'dragover',
                        (e) => {
                            if (observers.window.listenForDrag) {
                                ;(e.dataTransfer.dropEffect = 'copy'),
                                    e.dataTransfer.items[0]?.type?.indexOf('image/') > -1
                                        ? el.html.classList.add('draggingImage')
                                        : el.html.classList.remove('draggingImage'),
                                    (observers.window.listenForDrag = !1)
                            }
                        },
                        !1
                    )
            },
            click(e) {
                is.simplifyOn &&
                    check.click &&
                    ((observers.window.clickCount += 1),
                    compose.check(!0),
                    ('gmail_signature' === e.target.getAttribute('data-smartmail') ||
                        e.target.id.search(/m_.*Signature/) >= 0) &&
                        e.target.classList.add('show'))
            },
            mouseout(e) {
                is.simplifyOn &&
                    ((observers.window.mouseOutCount += 1),
                    (e.clientY <= 0 ||
                        e.clientX <= 0 ||
                        e.clientX >= window.innerWidth ||
                        e.clientY >= window.innerHeight) &&
                        (report('The mouse has left the building', observers.window.mouseOutCount),
                        nav.unpeek(),
                        chat.unpeek(),
                        appMenu.close()))
            },
        },
    }
observers.loading.start()
const otherExtensions = {
        calls: 0,
        waitTime: 1e3,
        nextSlot: 78,
        observers: {},
        extensions: [
            { name: 'MixMax', width: 47, ok: !0 },
            { name: 'Boomerang', width: 44, ok: !0 },
            { name: 'Streak', width: 90, closest: '.inboxsdk__appButton', ok: !0 },
            { name: 'Sortd', fullName: 'Sortd for Gmail', width: 120, closest: '.inboxsdk__appButton', ok: !1 },
            { name: 'Gmass', width: 135, ok: !0, parent: !0 },
            { name: 'Mailtrack', width: 60, ok: !0 },
            { name: 'Copper', fullName: 'Copper CRM for Gmail', width: 48, ok: !0 },
            { name: 'Hubspot', fullName: 'HubSpot Sales', closest: 'div', width: 48, ok: !0 },
            { name: 'Yesware', fullName: 'Yesware for Chrome', width: 0, ok: !1 },
            { name: 'Flowcrypt', width: 0, ok: !0 },
            { name: 'Salesforce', fullName: 'Salesforce', width: 50, ok: !0 },
            {
                name: 'Drag',
                fullName: 'Drag: Organize and Share your Inbox',
                width: 70,
                closest: '.inboxsdk__appButton',
                ok: !1,
            },
            { name: 'InboxWhenReady', width: 0, ok: !0 },
            { name: 'ActiveInbox', fullName: 'ActiveInbox: Organize Gmail tasks', width: 44, ok: !0 },
            { name: 'Chq', width: 37, ok: !0 },
            { name: 'ChqTabs', fullName: 'Gmail Tabs by cloudHQ', width: 0, ok: !0 },
            { name: 'ChqPause', width: 0, ok: !0 },
            {
                name: 'ChqResize',
                fullName: 'Resize Gmail Sidebar by cloudHQ',
                width: 0,
                ish: ' when using vertical split pane.',
                ok: !1,
            },
            { name: 'ChqTracker', fullName: 'Free Email Tracker by cloudHQ', width: 37, ok: !1 },
            { name: 'ChqSort', width: 0, ok: !0 },
            { name: 'RightInbox', width: 40, closest: 'div', ok: !0 },
            {
                name: 'DarkReader',
                fullName: 'Dark Reader',
                width: 0,
                ok: !1,
                ish: '. You can disable it for just Gmail.',
            },
            { name: 'BananaTag', width: 48, closest: 'div.inboxsdk__appButton', ok: !0 },
            { name: 'HippoVideo', width: 120, ok: !0 },
            { name: 'NightEye', fullName: 'Dark Mode - Night Eye', width: 0, ok: !1 },
            { name: 'NightEyeGmail', fullName: 'Gmail Dark Mode by Night Eye', width: 0, ok: !1 },
        ],
        check() {
            this.calls > 13
                ? (this.calls = 0)
                : (3 === this.calls &&
                      (this.checkMailplane(),
                      get('html[data-inboxsdk-active-app-ids]') &&
                          document.body.classList.add('inboxsdk_hack_disableComposeSizeFixer')),
                  otherExtensions.extensions.forEach((ext, i) => {
                      if (void 0 === ext.found) {
                          let selector = sel[`oe${ext.name}`],
                              element = get(selector)
                          if (null !== element) {
                              if (!ext.ok) {
                                  const breaksWhen = ext.ish || ' 😢'
                                  alerts.show(
                                      {
                                          title: `${ext.fullName} conflicts with Simplify${breaksWhen}`,
                                          body: `For an optimal Gmail experience, disable either ${ext.fullName} or Simplify.`,
                                      },
                                      'Manage extensions',
                                      ext.name
                                  )
                              }
                              if (ext.width > 0) {
                                  ext.parent && (element = element.parentNode),
                                      void 0 !== ext.closest && (element = element.closest(ext.closest)),
                                      element.setAttribute('data-simplify', 'otherExtensions'),
                                      element.setAttribute('data-ext-name', ext.name),
                                      css.add(
                                          `html.simplify *[data-ext-name="${ext.name}"] { position: fixed; right: calc(${otherExtensions.nextSlot}px + var(--width-addOns)) !important; }`
                                      ),
                                      (otherExtensions.nextSlot += ext.width)
                                  let rightMargin = this.nextSlot - 78
                                  css.add(`html.simplify { --nudgePaginationOver: ${rightMargin}px; }`)
                              }
                              if ('Gmass' === ext.name) {
                                  let searchBox = get('header form')
                                  searchBox && searchBox.parentNode.setAttribute('data-simplify', 'Gmass')
                              } else if ('DarkReader' === ext.name)
                                  gets('#simplifyAlert [data-darkreader-inline-color]').forEach((el) => {
                                      el.removeAttribute('data-darkreader-inline-color'), el.removeAttribute('style')
                                  })
                              else if ('Copper' === ext.name) {
                                  let copperRightPane = get(
                                      '.pw-shadow-host-widget.main-ember-application'
                                  ).shadowRoot.querySelector('#PWExtension')
                                  copperRightPane &&
                                      (new MutationObserver(otherExtensions.isCopperOpen).observe(
                                          copperRightPane,
                                          observers.config.classAttributeOnly
                                      ),
                                      otherExtensions.isCopperOpen())
                              } else if ('Hubspot' === ext.name) {
                                  let hubspotRightPane = get('.sales-sidebar-container.hubspot')
                                  hubspotRightPane &&
                                      (new MutationObserver(otherExtensions.isHubspotOpen).observe(
                                          hubspotRightPane,
                                          observers.config.styleAttributeOnly
                                      ),
                                      otherExtensions.isHubspotOpen())
                                  let rightMargin = this.nextSlot - 46
                                  css.add(
                                      `html.simplify.oeHubspot .hubspot #popover-1 { right: calc(${rightMargin}px + var(--width-addOns)) !important; }`
                                  ),
                                      (otherExtensions.observers.Hubspot = new MutationObserver((mutations_list) => {
                                          mutations_list.forEach((mutation) => {
                                              mutation.removedNodes.forEach((removed_node) => {
                                                  if ('Hubspot' === removed_node.getAttribute('data-ext-name')) {
                                                      report('HubSpot button has been removed and re-added')
                                                      const newButton =
                                                          get('.kratos__button_img').parentElement.parentElement
                                                      newButton.setAttribute('data-simplify', 'otherExtensions'),
                                                          newButton.setAttribute('data-ext-name', ext.name)
                                                  }
                                              })
                                          })
                                      }))
                                  const HubSpotButtonParent = get("*[data-ext-name='Hubspot']")?.parentElement
                                  HubSpotButtonParent
                                      ? (report('Observing Hubspot button removal'),
                                        otherExtensions.observers.Hubspot.observe(HubSpotButtonParent, {
                                            subtree: !1,
                                            childList: !0,
                                        }))
                                      : report("Couldn't find Hubspot button to observe")
                              } else 'ChqPause' === ext.name && this.tagPauseGmailButton()
                              ;(ext.found = !0),
                                  report('Found a 3rd party extension', ext.name),
                                  el.html.classList.add('otherExtensions', `oe${ext.name}`)
                          }
                      }
                  }),
                  10 === this.calls && (this.waitTime = 2500),
                  (this.calls += 1),
                  setTimeout(otherExtensions.check.bind(this), this.waitTime))
        },
        checkMailplane() {
            document.body.classList.contains('mp4-gmail') &&
                (el.html.classList.contains('vPane') || navigator.wakeLock
                    ? ((is.mailplaneDisabled = !1), toggleSimplify('on'))
                    : (alerts.show(
                          {
                              title: 'Mailplane only supports Simplify v2 in Vertical Split Pane (for now) 😢',
                              body: "Mailplane currently uses an older version of Chrome that does not support all of Simplify v2's features.\n\nBUT, Mailplane does support Simplify if you use the Vertical Split Pane view which can be enabled under Gmail Settings > Inbox > Reading pane > Right of inbox.",
                          },
                          'Inbox settings',
                          'Mailplane'
                      ),
                      (is.mailplaneDisabled = !0),
                      toggleSimplify('off')),
                local.update('mailplaneDisabled', is.mailplaneDisabled))
        },
        tagPauseGmailButton(tries = 0) {
            if (tries > 20) return
            let pauseButton = get('.cloudhq-pause-inbox-button .z0')
            pauseButton
                ? pauseButton.classList.add('oeCompose')
                : setTimeout(() => {
                      this.tagPauseGmailButton(tries++).bind(this)
                  }, 1e3)
        },
        isCopperOpen() {
            let cooperRightPane = get('.pw-shadow-host-widget.main-ember-application').shadowRoot.querySelector(
                '#PWExtension'
            )
            cooperRightPane &&
                (cooperRightPane.classList.contains('is-expanded')
                    ? el.html.classList.add('addOnsOpen', 'oeCopper')
                    : el.html.classList.remove('addOnsOpen', 'oeCopper'))
        },
        isHubspotOpen() {
            let hubspotRightPane = get('.sales-sidebar-container.hubspot')
            hubspotRightPane &&
                ('none' !== hubspotRightPane.style.display
                    ? el.html.classList.add('addOnsOpen', 'oeHubspot')
                    : el.html.classList.remove('addOnsOpen', 'oeHubspot'))
        },
        keepGrammarlyVisible() {},
    },
    appMenu = {
        tries: 0,
        builds: 0,
        nextSlot: 236,
        profile: null,
        closeMenu: null,
        buttons: [
            { name: 'readingPaneToggle', width: 54 },
            { name: 'inputTools', width: 56 },
            { name: 'offline', width: 44 },
        ],
        init() {
            if (this.tries > 30) return error("Couldn't find profile button to build App Menu."), void (this.tries = 0)
            if (((this.profile = get(`${sel.accountButton}, ${sel.accountWrapper}`)), !this.profile))
                return (this.tries += 1), void setTimeout(this.init.bind(this), 100)
            ;(this.tries = 0),
                this.profile.addEventListener('mouseover', () => {
                    is.settings ||
                        (el.html.classList.add('appMenuOpen'),
                        window.addEventListener('mouseout', observers.window.mouseout))
                })
            const closeAppMenu = make('div', { id: 'closeAppMenu' })
            closeAppMenu.addEventListener('mouseover', appMenu.close),
                document.body.appendChild(closeAppMenu),
                this.addSimplifyMenu(),
                is.delegate && (this.nextSlot = 188),
                this.placeChatStatus(),
                this.build(),
                otherExtensions.check()
        },
        close() {
            el.html.classList.remove('appMenuOpen'),
                window.removeEventListener('mouseout', observers.window.mouseout),
                el.html.classList.remove('simplifyMenuOpen')
        },
        placeChatStatus() {
            css.add(
                `html.simplify.appMenuOpen ${sel.chatStatus} { right: calc(${appMenu.nextSlot}px + var(--width-addOns)) !important; }`
            )
        },
        build() {
            this.builds > 10
                ? (this.builds = 0)
                : (appMenu.buttons.forEach((button, i) => {
                      if (void 0 === button.found || !button.found) {
                          let selector = sel[button.name]
                          null !== get(selector) &&
                              (selector.split(', ').forEach((s) => {
                                  css.add(
                                      `html.simplify ${s} { right: calc(${appMenu.nextSlot}px + var(--width-addOns)) !important; }`
                                  )
                              }),
                              (button.found = !0),
                              (appMenu.nextSlot += button.width),
                              appMenu.placeChatStatus())
                      }
                  }),
                  this.buttons.some((btn) => !btn.found) &&
                      ((this.builds += 1), setTimeout(appMenu.build.bind(this), 1e3)))
        },
        addSimplifyMenu(tries = 0) {
            if (tries > 20) return
            const settingsButton = document.querySelector('.FI')
            if (settingsButton) {
                const simplifyButton = make('div', { id: 'simplifyButton' })
                settingsButton.parentElement.insertBefore(simplifyButton, settingsButton)
                const simplifyMenu = make(
                    'div',
                    { id: 'simplifyMenu', className: 't9' },
                    make('img', { src: chrome.runtime.getURL('img/app/logo.png') }),
                    make(
                        'div',
                        { id: 'trialCountDown' },
                        make('div', { id: 'daysLeft', className: 'menuItem text' }, 'Trial ends in 14 days'),
                        make('a', { href: 'https://simpl.fyi/plans?from=gmail', target: '_new' }, 'Sign up'),
                        make(
                            'a',
                            { href: `https://simpl.fyi/account?addEmail=${subscription.email}`, target: '_new' },
                            'Already signed up?'
                        )
                    ),
                    make('div', { className: 'menuDivider' }),
                    make(
                        'a',
                        {
                            id: 'simplifyOptionsLink',
                            href: chrome.runtime.getURL('prefs/edit.html'),
                            className: 'menuItem',
                            ariaLabel: 'Options',
                            target: '_new',
                        },
                        'Simplify options'
                    ),
                    make(
                        'a',
                        {
                            href: 'https://simpl.fyi/account',
                            id: 'manageSubscription',
                            className: 'menuItem',
                            ariaLabel: 'Manage plan',
                            target: '_new',
                        },
                        'Manage plan'
                    ),
                    make(
                        'div',
                        { id: 'reportSimplifyIssue', className: 'menuItem', ariaLabel: 'Report issue', target: '_new' },
                        'Report issue'
                    ),
                    make(
                        'div',
                        {
                            id: 'disableSimplify',
                            className: 'menuItem',
                            ariaLabel: 'Toggle Simplify off',
                            target: '_new',
                        },
                        'Turn Simplify off'
                    ),
                    make(
                        'div',
                        {
                            id: 'enableSimplify',
                            className: 'menuItem',
                            ariaLabel: 'Toggle Simplify on',
                            target: '_new',
                        },
                        'Turn Simplify on'
                    ),
                    make('div', { className: 'menuDivider' }),
                    make(
                        'a',
                        {
                            href: 'https://changelog.simpl.fyi/',
                            className: 'menuItem',
                            ariaLabel: "What's new?",
                            target: '_new',
                        },
                        "What's new? (v2.5.35)"
                    ),
                    make(
                        'a',
                        {
                            href: 'https://on.simpl.fyi',
                            className: 'menuItem',
                            ariaLabel: 'Newsletter',
                            target: '_new',
                        },
                        'Newsletter'
                    ),
                    make(
                        'a',
                        {
                            href: 'https://simpl.fyi/privacy',
                            className: 'menuItem',
                            ariaLabel: 'Privacy policy',
                            target: '_new',
                        },
                        'Privacy policy'
                    ),
                    make(
                        'a',
                        {
                            href: 'https://simpl.fyi/about',
                            className: 'menuItem',
                            ariaLabel: 'About Simplify',
                            target: '_new',
                        },
                        'About Simplify'
                    )
                )
                settingsButton.parentElement.insertBefore(simplifyMenu, settingsButton),
                    get('#simplifyButton').addEventListener('click', () => {
                        el.html.classList.toggle('simplifyMenuOpen')
                    }),
                    get('#reportSimplifyIssue').addEventListener('click', () => {
                        reportIssue(!0)
                    }),
                    get('#enableSimplify').addEventListener('click', () => {
                        toggleSimplify('on')
                    }),
                    get('#disableSimplify').addEventListener('click', () => {
                        toggleSimplify('off')
                    })
            } else
                report('Settings button not found to insert Simplify button', tries),
                    setTimeout(() => {
                        appMenu.addSimplifyMenu(tries + 1)
                    }, 100)
        },
    }
is.okToSimplify && simplify[u].addOnsOpen && el.html.classList.add('addOnsOpen')
const nav = {
    tries: 0,
    catCalls: 0,
    detectCalls: 0,
    catToggleObs: null,
    navMoreObs: null,
    init() {
        if (this.tries > 30)
            return error("Simplify > nav.init() > Cound't find menu button or nav"), void (this.tries = 0)
        if (((el.menuButton = getEl('menuButton')), (el.nav = get(sel.nav)), el.menuButton && el.nav)) {
            if (exists('.bkL.aqk, .bkL.aql')) {
                el.html.classList.add('newNav'),
                    (sel.nav = '.aqn.aIH'),
                    (sel.inboxLink = ".aqn.aIH .aim a[href*='#inbox']")
                const toggleAppNav = make('div#toggleAppNav')
                if (
                    (toggleAppNav.addEventListener('click', nav.toggleAppNav),
                    document.body.appendChild(toggleAppNav),
                    exists('.aeN ~ .aqn'))
                ) {
                    const alertMsg = {
                        title: "Toggle Gmail's new app bar",
                        body: "You can click on the toggle in the bottom left to show or hide Gmail's new app bar.",
                    }
                    Date.now() < 1660679917502 && alerts.show(alertMsg, 'None', 'appNavToggle')
                } else
                    el.html.classList.add('appNavOff'),
                        (sel.nav = '.aeN'),
                        (sel.inboxLink = ".aeN .aim a[href*='#inbox']")
            } else el.html.classList.add('appNavOff')
            ;(el.nav = get(sel.nav)),
                observers.nav.observe(),
                el.menuButton.addEventListener('mouseover', nav.peek),
                this.detect(!1),
                (this.tries = 0),
                gets(sel.chatNew + ':not(.adZ) .XS').length > 0 &&
                    (report('Found new Gmail nav, adding event listeners'), el.html.classList.add('newUI'))
            const closeNavPeek = make('div', { id: 'closeNavPeek' })
            closeNavPeek.addEventListener('mouseover', nav.unpeek),
                document.body.appendChild(closeNavPeek),
                this.addCategories(),
                this.addHideInboxToggle()
        } else (this.tries += 1), setTimeout(this.init.bind(this), 100)
    },
    toggle(event) {
        'false' === el.menuButton.getAttribute('aria-expanded')
            ? (report('Nav is open, lets close it'), nav.close())
            : (report('Nav is closed, lets open it'), nav.open())
    },
    detect(peek = !0) {
        ;(nav.detectCalls += 1),
            'true' === el.menuButton.getAttribute('aria-expanded') ||
            (null === el.menuButton.getAttribute('aria-expanded') && simplify[u].navOpen)
                ? (report('Nav is open', nav.detectCalls), nav.open())
                : (report('Nav is closed', nav.detectCalls),
                  nav.close(peek),
                  null === el.menuButton.getAttribute('aria-expanded') && error('Nav state was null'))
    },
    open() {
        el.html.classList.add('navOpen'),
            local.update('navOpen', !0),
            hasAnyClass(['vPane', 'hPane']) && readingPane.detectSize()
    },
    close(peek = !0) {
        el.html.classList.remove('navOpen'),
            local.update('navOpen', !1),
            peek && el.html.classList.add('navPeek'),
            hasAnyClass(['vPane', 'hPane']) && readingPane.detectSize()
    },
    peek() {
        !is.simplifyOn ||
            hasAnyClass(['navOpen', 'navPeek']) ||
            is.appNavOn() ||
            (report('Hover over menu button'),
            el.html.classList.add('navPeek'),
            el.nav.classList.add('bym'),
            window.addEventListener('mouseout', observers.window.mouseout))
    },
    unpeek() {
        report('Mouse out menu button or out of window. Unpeek nav.'),
            el.html.classList.remove('navPeek'),
            el.nav.classList.remove('bym'),
            is.msg && simplify[u].navOpen && (el.html.classList.add('navOpen'), el.nav.classList.remove('bhZ')),
            window.removeEventListener('mouseout', observers.window.mouseout)
    },
    toggleAppNav() {
        const onOff = el.html.classList.toggle('showAppNav')
        chrome.storage.local.set({ showAppNav: onOff })
    },
    addHideInboxToggle(tries = 0) {
        if ((report('Setting up hide inbox toggle'), tries > 30)) return
        const inboxLinkWrapper = get(sel.inboxLink)?.closest('.aim')
        if (inboxLinkWrapper) {
            if (inboxLinkWrapper.classList.contains('inboxLink')) report('Inbox link observer already set up')
            else if ((inboxLinkWrapper.classList.add('inboxLink'), !get('#showHideInbox'))) {
                const toggleInbox = make('div', { id: 'showHideInbox' }),
                    inboxLink = get(sel.inboxLink).closest('.TN')
                inboxLink.insertBefore(toggleInbox, inboxLink.firstChild),
                    get('#showHideInbox').addEventListener('click', (e) => {
                        e.stopPropagation(), e.preventDefault(), lists.showHideInbox()
                    }),
                    observers.nav.observeInbox()
            }
        } else setTimeout(() => nav.addHideInboxToggle(tries + 1), 100)
    },
    addCategories() {
        if (!preferences.addCategories || !is.simplifyOn) return
        if (
            ((nav.catCalls += 1),
            report('Add categories?', nav.catCalls),
            get('.aim:not([data-category]) + .aim[data-category]'))
        )
            return
        let strandedCategories = get('.TK .aim[data-category]:first-child')
        if (strandedCategories) {
            let strandedRoot = strandedCategories.parentNode
            for (; strandedRoot.firstChild; ) strandedRoot.removeChild(strandedRoot.firstChild)
        }
        let categoryLink = get('.byl a[href*="#category/"]'),
            categoryItem = null,
            categoryGroup = null
        if (
            (categoryLink
                ? ((categoryItem = categoryLink.closest('.aim')), (categoryGroup = categoryLink.closest('.TK')))
                : ((categoryGroup = get('.byl.aJZ.a0L:not(.TA) > .TK > .aim:first-child:last-child div[role="link"]')),
                  categoryGroup && (categoryGroup = categoryGroup.closest('.TK'))),
            categoryGroup &&
                !categoryGroup.classList.contains('SOFC') &&
                (categoryGroup.classList.add('SOFC'),
                null === nav.catToggleObs && (nav.catToggleObs = new MutationObserver(nav.addCategories)),
                nav.catToggleObs.observe(categoryGroup, observers.config.directChildrenOnly)),
            categoryLink)
        )
            Object.keys(categories).forEach((key) => {
                let newCategory = categoryItem.cloneNode(!0)
                newCategory.setAttribute('data-category', key),
                    newCategory.addEventListener('click', (e) => {
                        location.hash = categories[key]
                        let activeNavItem = e.target.closest('.TO')
                        activeNavItem && activeNavItem.classList.add('nZ', 'aiq'), (check.categories = !0)
                    }),
                    categoryGroup.appendChild(newCategory)
                let newLink = get(`.aim[data-category='${key}'] a`)
                ;(newLink.innerText = key), (newLink.href = categories[key])
                let newLinkWrapper = get(`.aim[data-category='${key}'] .TO`)
                newLinkWrapper && newLinkWrapper.setAttribute('data-tooltip', key),
                    get(`.aim[data-category='${key}'] span.n1`)?.classList.remove('n1')
            }),
                gets('.aim[data-category] .TO').forEach((item) => {
                    item.classList.remove('aS3', 'aS4', 'aS5', 'aS6')
                })
        else {
            let moreNav = get(".wT span[gh='mll']:not(.SOFC)")
            moreNav &&
                (moreNav.classList.add('SOFC'),
                null === nav.navMoreObs && (nav.navMoreObs = new MutationObserver(nav.addCategories)),
                nav.navMoreObs.observe(moreNav, observers.config.classAttributeOnly))
        }
    },
}
observers.nav = {
    toggleObserver: new MutationObserver(nav.detect),
    inboxObserver: new MutationObserver(nav.addHideInboxToggle),
    observe() {
        el.menuButton && this.toggleObserver.observe(el.menuButton, observers.config.ariaExpanded)
    },
    observeInbox() {
        const inboxLink = get('.aim.inboxLink:not(.SOFC)')
        if (!inboxLink) return
        inboxLink.classList.add('SOFC')
        const inboxParent = inboxLink.parentNode
        inboxParent
            ? (this.inboxObserver.observe(inboxParent, observers.config.directChildrenOnly),
              report('Observing .inboxLink parent'))
            : report('Could not find .inboxLink')
    },
}
const lists = {
    scanTries: 0,
    zeroTries: 0,
    groupCalls: 0,
    scanCalls: 0,
    scanning: !1,
    selectDir: void 0,
    init() {
        let monthIndex = dates.month < 2 ? dates.month + 10 : dates.month - 2
        void 0 !== monthNamesAll[lang] &&
            css.add(
                `html.simplify.dateGroup .ae4 tr[date="month2"]::before { content: '${monthNames[monthIndex]}' !important; }`
            ),
            this.scan(),
            this.initializeHideInbox(),
            observers.lists.observeParent()
    },
    initializeHideInbox() {
        if (exists('#inboxHidden')) return
        const inboxHidden = make(
            'div',
            { id: 'inboxHidden' },
            make(
                'div',
                { id: 'hideInboxMsg' },
                make('span', { id: 'howLongHidden' }, 'Inbox hidden.'),
                make('span', { id: 'unhideInbox', className: 'link' }, 'Unhide'),
                make('span', { id: 'showHiOptions', className: 'link' }, 'Options')
            ),
            make(
                'div',
                { id: 'hideInboxOptions' },
                make(
                    'div',
                    { id: 'disableNotifs', className: 'hiOption' },
                    'Disable notifications when inbox is hidden'
                ),
                make('div', { id: 'hideInboxOnLoad', className: 'hiOption' }, 'Hide inbox by default on initial load'),
                make('div', { id: 'kbsHideInbox', className: 'hiOption' }, 'Toggle inbox with Alt+H (⌥H on Mac)'),
                make('button', { id: 'closeHiOptions' }, 'Done')
            )
        )
        document.body.appendChild(inboxHidden),
            get('#showHiOptions').addEventListener('click', () => {
                get('#inboxHidden').classList.add('showOptions')
            }),
            get('#closeHiOptions').addEventListener('click', () => {
                get('#inboxHidden').classList.remove('showOptions')
            }),
            get('#unhideInbox').addEventListener('click', () => {
                lists.showHideInbox(!0)
            }),
            get('#hideInboxOnLoad').addEventListener('click', () => {
                const onOff = get('#hideInboxOnLoad').classList.toggle('on')
                chrome.storage.local.set({ hideInboxOnLoad: onOff })
            }),
            get('#kbsHideInbox').addEventListener('click', () => {
                const onOff = get('#kbsHideInbox').classList.toggle('on')
                chrome.storage.local.set({ kbsHideInbox: onOff })
            }),
            is.safari || is.firefox
                ? get('#disableNotifs').remove()
                : get('#disableNotifs').addEventListener('click', () => {
                      const onOff = get('#disableNotifs').classList.toggle('on')
                      chrome.storage.local.set({ disableNotifs: onOff }),
                          onOff
                              ? chrome.runtime.sendMessage({ action: 'disable_notifications' })
                              : chrome.runtime.sendMessage({ action: 'enable_notifications' })
                  }),
            chrome.storage.local.get({ hideInboxOnLoad: !1, disableNotifs: !1, kbsHideInbox: !0 }, (prefs) => {
                prefs.hideInboxOnLoad && get('#hideInboxOnLoad').classList.add('on'),
                    !prefs.disableNotifs || is.safari || is.firefox || get('#disableNotifs').classList.add('on'),
                    prefs.kbsHideInbox && get('#kbsHideInbox').classList.add('on')
            })
    },
    showHideInbox(forceOff) {
        let justHidden = !0
        forceOff ? el.html.classList.remove('hideInbox') : (justHidden = el.html.classList.toggle('hideInbox')),
            is.safari ||
                is.firefox ||
                !get('#disableNotifs').classList.contains('on') ||
                (justHidden
                    ? chrome.runtime.sendMessage({ action: 'disable_notifications' })
                    : chrome.runtime.sendMessage({ action: 'enable_notifications' }))
    },
    scan() {
        if (!is.list || !is.simplifyOn) return
        if (((lists.scanCalls += 1), lists.scanTries > 4))
            return (lists.scanTries = 0), void report("Cound't find any new lists")
        0 === gets(sel.allLists).length
            ? (report("Didn't find any lists. Will scan again."), (lists.scanTries += 1), setTimeout(lists.scan, 100))
            : (report(`Scanning found lists after ${lists.scanTries} tries. ${lists.scanCalls} total calls.`),
              lists.groupByDate(),
              lists.checkForAds(),
              lists.checkInboxZero(),
              lists.observe(),
              observers.actionBar.start(),
              readingPane.findToggle(!0),
              (lists.scanTries = 0))
    },
    observe() {
        gets(sel.scanListsUnobserved).forEach((list) => {
            observers.lists.observeList(list)
        })
    },
    adsObserver: new MutationObserver(() => lists.checkForAds),
    checkForAds() {
        is.inbox &&
            is.tabbedInbox &&
            (gets(
                "div[role='main'] .ae4:not([style*='none']) .Cp tbody:not(:empty) .xY.AA .yW > span + span > span:not(.adLabel)"
            ).forEach((advert) => {
                advert.classList.add('adLabel'), advert.closest('.zA').classList.add('advert')
            }),
            gets('tr.zA.advert').forEach((advert) => {
                const adContainer = advert.closest('tbody')
                exists('tr.zA:not(.advert)', adContainer)
                    ? adContainer.closest('.Cp').classList.remove('adverts')
                    : (adContainer.closest('.Cp').classList.add('adverts'),
                      adContainer.classList.remove('grouped'),
                      adContainer.classList.contains('SOFC') ||
                          (lists.adsObserver.observe(adContainer, observers.config.directChildrenOnly),
                          adContainer.classList.add('SOFC')))
            }))
    },
    checkInboxZero() {
        is.inbox
            ? (exists(`${sel.currentList} tr.zA:not(.advert)`)
                  ? el.html.classList.remove('inboxZero')
                  : exists("div[role='main'] .ae4.iR:not([style*='none'])")
                  ? (report("Inbox section collapsed, can't test for inbox zero"),
                    el.html.classList.remove('inboxZero'))
                  : (report('Inbox zero!'), el.html.classList.add('inboxZero')),
              gets('.emptySection').forEach((s) => s.classList.remove('emptySection')),
              gets('.Nu.W7 .ae4:not(.iR) div:not([class]) ~ .Cp tbody:empty').forEach((emptySection) => {
                  emptySection.closest('.ae4').classList.add('emptySection')
              }))
            : el.html.classList.remove('inboxZero')
    },
    groupByDate() {
        if (!preferences.dateGroup || void 0 === monthNamesAll[lang]) return
        let anyThreads = count(sel.scanAllEmails) > 0,
            allThreadsGrouped = 0 === count(sel.scanNotGroupedEmails)
        if (anyThreads && allThreadsGrouped && !dates.update()) return
        gets(sel.currentListToGroup).forEach((list) => {
            ;(this.groupCalls += 1), report('Group this list', this.groupCalls, list)
            let notSnoozed = gets('.byZ:empty ~ .xW > span', list),
                lastDate =
                    notSnoozed.length > 0 ? dates.parse(Array.from(notSnoozed).slice(-1)[0].title, lang) : dates.today,
                currentGroup = this.getDateGroup(lastDate)
            const threads = gets('.zA:not(.advert)', list) || []
            Array.from(threads)
                .slice()
                .reverse()
                .forEach((thread) => {
                    if (get('.byZ > div', thread)) return void thread.setAttribute('date', currentGroup)
                    let dateSpan = get('.xW > span', thread)
                    if (!dateSpan)
                        return (
                            report('Date grouping: thread had no date', thread),
                            void thread.setAttribute('date', currentGroup)
                        )
                    let threadDate = dates.parse(dateSpan.title, lang)
                    threadDate < lastDate || ((currentGroup = this.getDateGroup(threadDate)), (lastDate = threadDate)),
                        thread.setAttribute('date', currentGroup)
                })
        })
    },
    getDateGroup: (date) =>
        date > dates.today
            ? 'today'
            : date >= dates.yesterday
            ? 'yesterday'
            : date >= dates.lastMon
            ? 'week'
            : date >= dates.prevMonth[0]
            ? 'month0'
            : date >= dates.prevMonth[1]
            ? 'month1'
            : date >= dates.prevMonth[2]
            ? 'month2'
            : date < dates.prevMonth[2]
            ? 'earlier'
            : (error("getDateGroup couldn't compare date", date), 'today'),
    autoSelectThread() {
        if (count(`${sel.currentList} tr.zA div[role="checkbox"][aria-checked="true"]`) > 0)
            return report('Something is already selected, not selecting thread'), !1
        const toSelect = get(`${sel.currentList} tr.btb:not(.aps) div[role="checkbox"][aria-checked="false"]`)
        return !!toSelect && (clickOn(toSelect), !0)
    },
    unAutoSelectThread() {
        let selectedThread = get(`${sel.currentList} tr.btb div[role="checkbox"][aria-checked="true"]`)
        return !!selectedThread && (clickOn(selectedThread), !0)
    },
    selectThread() {
        if (!is.list) return
        const focusedThread = get(`${sel.currentList} tr.btb div[role="checkbox"]`)
        focusedThread && clickOn(focusedThread)
    },
    multiSelect(direction) {
        if (!is.list) return
        const focusedThread = get(`${sel.currentList} tr.btb`),
            nextThread = 'down' === direction ? focusedThread?.nextSibling : focusedThread?.previousSibling
        if (!focusedThread || !nextThread) return
        const focusedCheckbox = get('div[role="checkbox"]', focusedThread),
            nextCheckbox = get('div[role="checkbox"]', nextThread)
        0 === count(`${sel.currentList} tr.x7`) && (lists.selectDir = direction)
        const checkIf = direction !== lists.selectDir ? 'true' : 'false'
        focusedCheckbox.getAttribute('aria-checked') === checkIf && clickOn(focusedCheckbox),
            nextCheckbox.getAttribute('aria-checked') === checkIf || clickOn(nextCheckbox),
            clickOn(nextCheckbox)
    },
    checkSections() {
        if (
            (report('Checking inbox sections now'),
            count("div[gh='tl'] .iR:not([style*='none'])") > 0 &&
                count("div[gh='tl'] .ae4") === count("div[gh='tl'] .iR"))
        ) {
            report('Gmail loaded with all sections collapsed')
            let section = get('div[gh="tl"] .iR:not([style*="none"]) .Wn')
            clickOn(section), clickOn(section), observers.actionBar.start()
        }
        check.inboxSections = !1
    },
}
observers.lists = {
    parentChangeCount: 0,
    parentObserver: new MutationObserver(() => {
        ;(observers.lists.parentChangeCount += 1),
            report('List watcher saw a change. Call lists.scan()', observers.lists.parentChangeCount),
            exists(sel.listTopActive) &&
                (is.msg && is.readingPane && (check.readingPaneSize = !0),
                (is.list = !0),
                (is.msg = !1),
                lists.scan('observers.lists.parentObserver'))
    }),
    listObserver: new MutationObserver((mutations) => {
        mutations.some((m) => m.addedNodes.length > 0) && lists.scan('observers.lists.listObserver')
    }),
    observeList(list) {
        list &&
            !list.classList.contains('SOFC') &&
            (observers.lists.listObserver.observe(list, observers.config.directChildrenOnly),
            list.classList.add('SOFC'),
            report('Now observing', list))
    },
    observeParent(tries = 0) {
        if (tries > 50) return
        const listParent = get("[role='main']")?.parentNode.parentNode
        listParent ||
            (report('Could not find mainParent list', tries),
            setTimeout(() => {
                observers.lists.observeParent(tries + 1)
            }, 100)),
            listParent.classList.contains('SOFC') ||
                (observers.lists.parentObserver.observe(listParent, {
                    attributes: !0,
                    childList: !1,
                    subtree: !0,
                    attributeFilter: ['role'],
                }),
                listParent.classList.add('SOFC'))
    },
}
const conversation = {
        tries: 0,
        async scan() {
            conversation.initTrackerBadge(), conversation.hasHtmlEmail()
        },
        enableVideos() {
            if (!is.simplifyOn) return
            const attachments = gets('.Bs .aQH > span > a:not(.attachmentThumb)')
            attachments.length > 0
                ? attachments.forEach((attachment) => {
                      report('Found an attachment. Setting up inline playing if a video...'),
                          attachment.classList.add('attachmentThumb'),
                          attachment.addEventListener('click', async (e) => {
                              const url = e.target.closest(
                                  "span[download_url^='video/'] a.attachmentThumb:not([href*='googleusercontent.com/docs'])"
                              )?.href
                              if (url && is.simplifyOn) {
                                  report('Clicked on video (.mp4) attachment'), await waitFor(200)
                                  let videoPlayer = get('#simplifyVideoPlayer source')
                                  if (videoPlayer) videoPlayer.src = url
                                  else {
                                      videoPlayer = make(
                                          'div',
                                          { id: 'simplifyVideoPlayer' },
                                          make(
                                              'video',
                                              { controls: 'true', autoplay: 'true' },
                                              make('source', { src: url })
                                          )
                                      )
                                      const shadowbox = get(
                                          "div[role='dialog'] div[role='main']:not([style*='display: none'])"
                                      )
                                      shadowbox
                                          ? (shadowbox.appendChild(videoPlayer),
                                            shadowbox.classList.add('simplifyPlayer'))
                                          : report('No video dialog found')
                                  }
                              }
                          })
                  })
                : report('No new attachments found')
        },
        close() {
            if (is.msgOpen) {
                report('In reading pane w/ msg open, close conversation')
                const markRead = get('div[gh="tm"] div[act="1"]:not([style*="display: none"])'),
                    markUnread = get('div[gh="tm"] div[act="2"]:not([style*="display: none"])')
                markUnread
                    ? (clickOn(markUnread),
                      clickOnWhenReady('.vh div[role="button"]'),
                      clickOnWhenReady(`${sel.currentList} .btb .bqX.brr`),
                      clickOnWhenReady('.vh div[role="button"]'))
                    : markRead &&
                      (clickOn(markRead),
                      clickOnWhenReady('.vh div[role="button"]'),
                      clickOnWhenActive(get('div[gh="tm"] div[act="2"]'), 'self'),
                      clickOnWhenReady('.vh div[role="button"]'))
            } else if (is.msg) {
                report('In a conversation, return to list view: ' + close.msg)
                let backButton = get('div[gh="tm"] div[act="19"]')
                ;(url.ignore = !0),
                    backButton
                        ? clickOn(backButton)
                        : (report("Coundn't find back button. Going to", close.msg), (location.hash = close.msg))
            }
        },
        hasHtmlEmail() {
            report('Checking for HTML emails')
            const msgCards = gets(
                    'div.nH[role="main"]:not([style*="none"]) .ads:not([style*="none"]):not(.htmlScanned)'
                ),
                msgRoot = '.a3s:not(.undefined):not(:empty)',
                quotedRoot = '.a3s:not(.undefined):not(:empty) .h5 .gmail_quote',
                headings = `${msgRoot} h1:not(:empty), ${msgRoot} h2:not(:empty), ${msgRoot} h3:not(:empty), ${msgRoot} h4:not(:empty), ${msgRoot} h5:not(:empty), ${msgRoot} h6:not(:empty)`,
                qHeadings = `${quotedRoot} h1:not(:empty), ${quotedRoot} h2:not(:empty), ${quotedRoot} h3:not(:empty), ${quotedRoot} h4:not(:empty), ${quotedRoot} h5:not(:empty), ${quotedRoot} h6:not(:empty)`,
                styled =
                    'div[style*="background" i]:not(.gmail_chip):not([style*="background-color:rgba(255,255,255,1" i]):not([style*="background-color: rgba(255,255,255,1" i]):not([style*="background-color:rgba(255, 255, 255, 1" i]):not([style*="background-color: rgba(255, 255, 255, 1" i]):not([style*="background-color:rgb(255,255,255" i]):not([style*="background-color: rgb(255,255,255" i]):not([style*="background-color:rgb(255, 255, 255" i]):not([style*="background-color: rgb(255, 255, 255" i]):not([style*="background-color:white"]):not([style*="background-color: white"]):not([style*="background-color:#fff" i]):not([style*="background-color: #fff" i]):not([style*="background-color:transparent" i]):not([style*="background-color: transparent" i]):not([style*="background:rgba(255,255,255,1" i]):not([style*="background: rgba(255,255,255,1" i]):not([style*="background:rgba(255, 255, 255, 1" i]):not([style*="background: rgba(255, 255, 255, 1" i]):not([style*="background:rgb(255,255,255" i]):not([style*="background: rgb(255,255,255" i]):not([style*="background:rgb(255, 255, 255" i]):not([style*="background: rgb(255, 255, 255" i]):not([style*="background:white"]):not([style*="background: white"]):not([style*="background:#fff" i]):not([style*="background: #fff" i]):not([style*="background:transparent" i]):not([style*="background: transparent" i])'
            if (
                (msgCards.forEach((message) => {
                    const HtmlObjCount = count(
                            `${headings}, ${msgRoot} table img:not(.emailTracker), ${msgRoot} iframe, ${msgRoot} ${styled}`,
                            message
                        ),
                        QuotedHtmlObjCount = count(
                            `${qHeadings}, ${quotedRoot} table img:not(.emailTracker), ${quotedRoot} iframe, ${quotedRoot} ${styled}`,
                            message
                        ),
                        isHtmlMsg = HtmlObjCount > 0 && HtmlObjCount > QuotedHtmlObjCount,
                        isOutlookMsg = exists(`${msgRoot} div[class*='WordSection'] p.MsoNormal`, message),
                        styles = isHtmlMsg && !isOutlookMsg ? ['htmlScanned', 'isHtmlMsg'] : ['htmlScanned']
                    report('Checked the message for html', isHtmlMsg, isOutlookMsg), message.classList.add(...styles)
                }),
                'darkTheme' !== simplify[u].theme)
            )
                return
            if ('none' === preferences.invertMessages) return void el.html.classList.add('htmlEmail')
            if ('all' === preferences.invertMessages)
                return el.html.classList.remove('htmlEmail'), void conversation.tagLightBgs()
            count('div.nH[role="main"]:not([style*="none"]) .ads.isHtmlMsg') > 0
                ? el.html.classList.add('htmlEmail')
                : el.html.classList.remove('htmlEmail')
        },
        initReaderMode() {},
        initTrackerDetails() {
            let trackerDetails = make(
                'div',
                { id: 'trackerDetails' },
                make(
                    'div',
                    {},
                    make('b', {}, 'Simplify protected your privacy by blocking a tracker in this message.'),
                    make(
                        'p',
                        {},
                        'Email trackers can track if you opened the email, when you opened it, where you were located, and what device you were using (phone or computer). Some or all of this data could have been reported back to the sender.'
                    ),
                    make(
                        'p',
                        {},
                        'Simplify considers this an invasion of your privacy and blocks email trackers from gathering and reporting this information. You can read, reply, and forward this email without worrying about being tracked.'
                    )
                )
            )
            trackerDetails.addEventListener('click', () => {
                get('#trackerDetails').classList.remove('show')
            }),
                document.body.appendChild(trackerDetails)
        },
        initTrackerBadge() {
            gets('.bAk .bi4[role="checkbox"]:not(.tbSetup)').forEach((star) => {
                star.parentNode.insertBefore(make('div', { className: 'trackerBadge' }), star),
                    star.classList.add('tbSetup')
            }),
                gets('.trackerBadge').forEach((badge) =>
                    badge.addEventListener('click', (event) => {
                        get('#trackerDetails').classList.add('show'), event.preventDefault(), event.stopPropagation()
                    })
                )
        },
        tagLightBgs() {
            let sel = ".a3s:not(.undefined) *[style*='background"
            gets(
                sel +
                    ":rgb(255']," +
                    sel +
                    ": rgb(255']," +
                    sel +
                    "-color:rgb(255']," +
                    sel +
                    "-color: rgb(255']," +
                    sel +
                    ":#f']," +
                    sel +
                    ": #f']," +
                    sel +
                    "-color:#f']," +
                    sel +
                    "-color: #f']," +
                    sel +
                    ":white']," +
                    sel +
                    ": white']," +
                    sel +
                    "-color:white']," +
                    sel +
                    "-color: white'],.a3s:not(.undefined) *[bgcolor*='#fff']"
            ).forEach((elem) => {
                if ('white' === elem.style.backgroundColor) elem.classList.add('simplifyEeeBg')
                else if (elem.bgColor)
                    ('#fff' !== elem.bgColor.toLowerCase() && '#ffffff' !== elem.bgColor.toLowerCase()) ||
                        elem.classList.add('simplifyEeeBg')
                else {
                    let [, r, g, b] = elem.style.backgroundColor.match(/rgb\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)/)
                    r && g && b && r === g && g === b && r > 238 && elem.classList.add('simplifyEeeBg')
                }
            })
        },
    },
    search = {
        form: null,
        input: null,
        tries: 0,
        delayClose: 100,
        init() {
            if (this.tries > 30) return error("Cound't find search form or input."), void (this.tries = 0)
            ;(this.form = get('#gb form[role="search"]')),
                (this.input = get('#gb form input[name="q"]')),
                this.input && this.form
                    ? (el.closeSearch.addEventListener('mousedown', (e) => {
                          if ((report('Clicked on clear search'), is.search || is.label))
                              return e.stopPropagation(), void search.exit()
                      }),
                      this.input.addEventListener('focus', (e) => {
                          el.html.classList.add('searchFocused'),
                              search.form.classList.add('focused'),
                              (search.delayClose = 100),
                              is.msg && ((search.input.selectionStart = 0), (search.input.selectionEnd = 1e4))
                      }),
                      get('#gb form button.searchIcon')?.addEventListener('click', (e) => {
                          el.html.classList.contains('searchFocused') ||
                              '' !== search.input.value ||
                              search.input.focus()
                      }),
                      gets('button', this.form).forEach((button) => {
                          button.addEventListener('mousedown', (e) => {
                              report('Delay closing search to register click on search button'),
                                  (search.delayClose = 500)
                          })
                      }),
                      this.form.addEventListener('click', (e) => {
                          report('Focus on search'), search.input.focus()
                      }),
                      this.input.addEventListener('blur', (e) => {
                          report('Blur focus from search'),
                              setTimeout(search.close, search.delayClose),
                              (search.delayClose = 100)
                      }))
                    : ((this.tries += 1), setTimeout(this.init.bind(this), 100))
        },
        close() {
            'q' !== document.activeElement.name &&
                (report('Closing search'),
                el.html.classList.remove('searchFocused'),
                search.form.classList.remove('focused'))
        },
        exit() {
            const inboxLink = get(sel.inboxLink)
            inboxLink ? clickOn(inboxLink) : (location.hash = close.search),
                setTimeout(() => {
                    search.input.blur(), report('Remove focus from search')
                }, 100)
        },
    },
    compose = {
        checkTries: 0,
        obsFormatting: null,
        obsMinimize: null,
        molePopCount: 0,
        anyMoleCount: 0,
        checkCount: 0,
        fontSizeRemRegex: new RegExp(`font-size:\\s?${fontSizeRem}\\d*\\s?rem;?\\s?`, 'gi'),
        fontSizePxRegex: new RegExp(`font-size:\\s?${fontSizePx}\\d*\\s?px;?\\s?`, 'gi'),
        formattingCases: {
            font: 'div.SOFC[contenteditable] *[style*="--simplify-font"]',
            fontSize: 'div.SOFC[contenteditable] *[style*="--simplify-font-size"]',
            fontSizeRem: `div.SOFC[contenteditable] *[style*="${fontSizeRem}"]`,
            fontSizePx: `div.SOFC[contenteditable] *[style*="${fontSizePx}"]`,
            fontSizePxAll: 'div.SOFC[contenteditable] *[style*=".0016px"]',
            fontStyle: 'div.SOFC[contenteditable] *[style*="font-variant-ligatures"]',
            gDocsWrap:
                'div.SOFC[contenteditable] *[dir="ltr"] span[style*="pre-wrap"], div.SOFC[contenteditable] *[dir="ltr"] *[style*="white-space: pre"], div.SOFC[contenteditable] *[dir="ltr"][style*="white-space: pre"]',
            darkThemeBg: 'div.SOFC[contenteditable] *[style*="rgb(17, 17, 17);"]',
            lightThemeBg: 'div.SOFC[contenteditable] *[style*="rgb(255, 255, 255);"]',
            safariFont: 'div.SOFC[contenteditable] *[style*="font-family: -webkit-standard;"]',
            bullets: 'div.SOFC[contenteditable] li:not([style*="0.6001"])',
            tracker: 'div.SOFC[contenteditable] .gmail_quote .emailTracker',
        },
        formattingCasesFlat: !1,
        initFormattingCases() {
            preferences.httpsLinks
                ? (compose.formattingCases.httpsLinks =
                      "div.SOFC[contenteditable] a[href^='http:']:not(.gmail_signature a):not(.gmail_quote a)")
                : (compose.formattingCases.httpsLinks = null),
                (compose.formattingCasesFlat = Object.values(compose.formattingCases)
                    .filter((selector) => null !== selector)
                    .toString())
        },
        checkFormatting() {
            is.simplifyOn &&
                (compose.formattingCasesFlat || compose.initFormattingCases(),
                0 !== count(compose.formattingCasesFlat) &&
                    (report('checkFormatting found something...', compose.checkCount),
                    gets(compose.formattingCases.font).forEach((styledEl) => {
                        report('Found a styled element (font var)', styledEl)
                        let newStyle = styledEl
                            .getAttribute('style')
                            .replace(/font:\s?var\(--simplify-font\)\s?;?\s?/, '')
                        styledEl.setAttribute('style', newStyle)
                    }),
                    gets(compose.formattingCases.fontSize).forEach((styledEl) => {
                        report('Found a styled element (font size var)', styledEl)
                        let newStyle = styledEl
                            .getAttribute('style')
                            .replace(/font-size:\s?var\(--simplify-font-size\)\s?;?\s?/, '')
                            .replace(
                                /font-size:\s?calc\(\s?var\(--simplify-font-size\)\s?\+\s?\d+.\d{4}rem\s?\)\s?;?\s?/,
                                ''
                            )
                        styledEl.setAttribute('style', newStyle)
                    }),
                    compose.formattingCases.fontSizeRem &&
                        gets(compose.formattingCases.fontSizeRem).forEach((styledEl) => {
                            report('Found a styled element (font size in rem)', styledEl)
                            let newStyle = styledEl.getAttribute('style').replace(compose.fontSizeRemRegex, '')
                            styledEl.setAttribute('style', newStyle)
                        }),
                    compose.formattingCases.fontSizePx &&
                        gets(compose.formattingCases.fontSizePx).forEach((styledEl) => {
                            report('Found a styled element (font size in px)', styledEl)
                            let newStyle = styledEl.getAttribute('style').replace(compose.fontSizePxRegex, '')
                            styledEl.setAttribute('style', newStyle)
                        }),
                    gets(compose.formattingCases.fontSizePxAll).forEach((styledEl) => {
                        report('Found a styled element (font size)', styledEl)
                        let newStyle = styledEl.getAttribute('style').replace(/font-size:\s?\d\d.0016px;?/i, '')
                        styledEl.setAttribute('style', newStyle)
                    }),
                    gets(compose.formattingCases.fontStyle).forEach((styledEl) => {
                        report('Found a styled element (font-style)', styledEl)
                        let newStyle = styledEl
                            .getAttribute('style')
                            .replace(/font-style:\s?normal;?\s?/i, '')
                            .replace(/font-variant-ligatures:\s?normal;?\s?/i, '')
                            .replace(/font-variant-caps:\s?normal;?\s?/i, '')
                            .replace(/font-weight:\s?400;?\s?/i, '')
                            .replace(/font-size:\s?small;?\s?/i, '')
                            .replace(/overflow-wrap:\s?break-word;?\s?/i, '')
                            .replace(/font-family:\s?[^;]+;\s?/i, '')
                        styledEl.setAttribute('style', newStyle)
                    }),
                    gets(compose.formattingCases.gDocsWrap).forEach((styledEl) => {
                        report('Found a pre-wrap GDocs element', styledEl)
                        let newStyle = styledEl.getAttribute('style').replace(/white-space:\s?pre(-wrap)?;?/i, '')
                        styledEl.setAttribute('style', newStyle)
                    }),
                    gets(compose.formattingCases.darkThemeBg).forEach((styledEl) => {
                        report('Found dark theme styling applied in compose', styledEl)
                        let newStyle = styledEl
                            .getAttribute('style')
                            .replace(/background-color:\s?rgb\(17,\s?17,\s?17\);?/i, '')
                            .replace(/(\s|;|^)color:\s?rgb\((\d{1,3},?\s?){3}\);?/i, '')
                        styledEl.setAttribute('style', newStyle)
                    }),
                    gets(compose.formattingCases.lightThemeBg).forEach((styledEl) => {
                        report('Found light theme styling applied in compose', styledEl)
                        let newStyle = styledEl
                            .getAttribute('style')
                            .replace('color: rgb(34, 34, 34);', '')
                            .replace('background-color: rgb(255, 255, 255);', '')
                        styledEl.setAttribute('style', newStyle)
                    }),
                    is.safari &&
                        gets(compose.formattingCases.safariFont).forEach((styledEl) => {
                            report('Found Safari-added styles', styledEl)
                            let newStyle = styledEl
                                .getAttribute('style')
                                .replace(/font-family:\s?-webkit-standard;?\s?/, '')
                                .replace(/font-size:\s?medium;?\s?/, '')
                                .replace(/caret-color:\s?rgb\([0, ]*\);?\s?/, '')
                                .replace(/color:\s?rgb\([0, ]*\);?\s?/, '')
                            styledEl.setAttribute('style', newStyle)
                        }),
                    gets(compose.formattingCases.bullets).forEach((bullet) => {
                        const currentStyle = bullet.getAttribute('style') || ''
                        bullet.setAttribute('style', 'padding-bottom:0.6001em; ' + currentStyle)
                    }),
                    gets(compose.formattingCases.tracker).forEach((tracker) => {
                        tracker.parentElement.removeChild(tracker)
                    }),
                    preferences.httpsLinks &&
                        gets(compose.formattingCases.httpsLinks).forEach((link) => {
                            if (!/http:/.test(link.innerText)) {
                                link.href = link.href.replace('http:', 'https:')
                                const linkPopup = get('#tr_test-link')
                                linkPopup && (linkPopup.innerText = linkPopup.innerText.replace('http:', 'https:'))
                            }
                        })))
        },
        check(singleCheck = !1) {
            if (is.settings) return
            if (compose.checkTries > 4) return report("Cound't find any new composers"), void (compose.checkTries = 0)
            let newComposers = gets('div[contenteditable]:not(.gmail_chip):not(.gmail_drive_chip):not(.SOFC)')
            0 === newComposers.length
                ? singleCheck || ((compose.checkTries += 1), setTimeout(compose.check, 500))
                : (report('Found new composers', newComposers),
                  (compose.checkTries = 0),
                  null === compose.obsFormatting &&
                      (compose.obsFormatting = new MutationObserver((mutations) => {
                          ;(compose.checkCount += 1),
                              mutations.some((m) => m.addedNodes.length > 0) && compose.checkFormatting()
                      })),
                  compose.checkForExtWarning(),
                  newComposers.forEach((composeBody) => {
                      if (preferences.reverseMsgs) {
                          const composeScrollPos = composeBody.getBoundingClientRect()?.y,
                              scrollView = ['hPane', 'vPane'].includes(readingPane.type)
                                  ? get("div.UI[gh='tl'] .Nu.S3")
                                  : get('.Tm')
                          composeScrollPos && composeScrollPos < 0 && scrollView && (scrollView.scrollTop = 0)
                      }
                      if (
                          (compose.obsFormatting.observe(composeBody, observers.config.allChildren),
                          composeBody.classList.add('SOFC'),
                          preferences.composeFormat && is.simplifyOn && setTimeout(compose.closeFormattingBar, 100),
                          preferences.composeActions)
                      ) {
                          let showComposeActions = make('div', { className: 'showComposeActions' }),
                              composeActionBar = get('.bAK', composeBody.closest('.iN'))
                          composeActionBar && (composeActionBar = composeActionBar.parentNode),
                              report('Adding compose actions expander', composeActionBar),
                              composeActionBar &&
                                  (composeActionBar.appendChild(showComposeActions),
                                  gets('.bAK ~ .showComposeActions:not(.active)').forEach((button) => {
                                      button.addEventListener('click', (event) => {
                                          event.target.closest('.iN').classList.toggle('showActions')
                                      }),
                                          button.classList.add('active')
                                  }))
                      }
                  }))
        },
        closeFormattingBar() {
            let formattingMenuButton = get('.Bs .oc.gU div[role="button"]')
            formattingMenuButton &&
                'true' === formattingMenuButton.getAttribute('aria-pressed') &&
                clickOn(formattingMenuButton)
        },
        molePopMutations(mutations) {
            if (
                ((compose.molePopCount += 1),
                report('Checking for new composers...', compose.molePopCount),
                compose.anyOpenMoles(),
                !mutations || mutations.some((m) => m.addedNodes.length > 0))
            ) {
                compose.check(),
                    null === compose.obsMinimize && (compose.obsMinimize = new MutationObserver(compose.anyOpenMoles))
                let buttons = gets(`${sel.composeMinimize}:not([sofc])`)
                buttons.length > 0 &&
                    buttons.forEach((minimizeButton) => {
                        compose.obsMinimize.observe(minimizeButton, observers.config.ariaLabel),
                            minimizeButton.setAttribute('sofc', 'true')
                    })
            }
        },
        jiggleStickySendBar() {
            if (get('.Bs .aDj.aDi, .Bs .aDj.ahe')) {
                report('Sticky send bar found')
                let activeEl = document.activeElement,
                    inlineReplyBody = get('.Bs .Am.editable.aO9')
                activeEl &&
                    inlineReplyBody &&
                    notEditing() &&
                    (activeEl.blur(),
                    inlineReplyBody.focus(),
                    setTimeout(() => {
                        inlineReplyBody.blur(), activeEl.focus()
                    }, 100))
            } else report('Sticky send NOT bar found')
        },
        checkForFromField() {
            let fromFieldInPopOut = get('.xr form .zm, .aSt form .zm')
            fromFieldInPopOut && fromFieldInPopOut.closest('.aoC').classList.add('hasFromField')
        },
        checkForExtWarning() {
            if ('no' === preferences.externalWarning && preferences.composeFormat) {
                gets('.iN .ac4').forEach((warning) => {
                    warning.closest('.aDg').dataset.warning = 'true'
                })
            }
        },
        anyOpenMoles() {
            ;(compose.anyMoleCount += 1),
                report('Checking to see if mole is open', compose.anyMoleCount),
                count(sel.composeMoleOpen) > 0
                    ? el.html.classList.add('openMole')
                    : el.html.classList.remove('openMole'),
                compose.jiggleStickySendBar()
        },
    },
    theme = {
        detectCount: 0,
        detectColor() {
            if (is.delegate) return void el.html.classList.add('defaultTheme')
            const appSwitcher = get('#gbwa path')
            if (!appSwitcher) return void error("Coundn't test theme - app switcher not loaded yet.")
            const isDarkIcons = -1 === getStyle(appSwitcher, 'color').search(/255/),
                listBg = get(sel.listBg)
            let isDarkListBg
            if (listBg) {
                listBg.classList.add('themeCheck')
                const listBgColor = getStyle(listBg, 'background-color')
                ;-1 !== listBgColor.search(/(0.8)|(255)/)
                    ? ((isDarkListBg = -1 !== listBgColor.search(/(0,)|(51,)/)),
                      report('new theme check worked', listBgColor, isDarkListBg))
                    : report("new theme check didn't work", listBgColor),
                    listBg.classList.remove('themeCheck')
            }
            if ((el.html.classList.remove('defaultTheme', 'lightTheme', 'mediumTheme', 'darkTheme'), isDarkIcons))
                el.html.classList.add('lightTheme'),
                    local.update('theme', 'lightTheme'),
                    report('Theme: detected light theme'),
                    (check.theme = !1)
            else if (void 0 === isDarkListBg)
                el.html.classList.add(simplify[u].theme),
                    report('Theme is dark or medium, will check later when in a list'),
                    (check.theme = !0)
            else {
                const themeIs = isDarkListBg ? 'darkTheme' : 'mediumTheme'
                report('Theme color detected:', themeIs),
                    el.html.classList.add(themeIs),
                    local.update('theme', themeIs),
                    (check.theme = !1)
            }
            let themeBgColor = getStyle('themeBg', 'background-color')
            if (isDarkListBg) themeBgColor = 'rgb(17, 17, 17)'
            else if (themeBgColor) {
                local.update('themeBgColor', themeBgColor), theme.setBgMeta(themeBgColor)
                ;('rgb(241, 243, 244)' === themeBgColor ||
                    'rgb(246, 248, 252)' === themeBgColor ||
                    themeBgColor.search(/255/) >= 0) &&
                    (local.update('theme', 'defaultTheme'), el.html.classList.add('defaultTheme'))
            } else
                report('Theme layer not found, themes probably disabled'),
                    local.update('theme', 'defaultTheme'),
                    el.html.classList.add('defaultTheme')
            let themeBgImgUrl = getStyle('themeBgImg', 'background-image'),
                themeBgImgPos = getStyle('themeBgImg', 'background-position')
            if (
                ((themeBgImgUrl && 'none' !== themeBgImgUrl) ||
                    ((themeBgImgUrl = get(sel.themeBgImgAlt)?.src || !1),
                    themeBgImgUrl
                        ? ((themeBgImgUrl = `url("${themeBgImgUrl}")`),
                          (themeBgImgPos = 'top'),
                          el.html.classList.add('imgTheme'))
                        : ((themeBgImgUrl = 'none'),
                          (themeBgImgPos = ''),
                          'none' === getStyle('.yL .wo', 'background-image') &&
                          'none' === getStyle('.yL .wn', 'background-image')
                              ? el.html.classList.remove('imgTheme')
                              : el.html.classList.add('imgTheme'))),
                theme.setBg(themeBgColor, themeBgImgUrl, themeBgImgPos),
                is.list && check.theme)
            ) {
                const checkbox = get('tr.zA .xY div[role="checkbox"]')
                if (checkbox) {
                    getComputedStyle(checkbox).getPropertyValue('background-image').indexOf('white') > -1
                        ? (el.html.classList.add('darkTheme'),
                          el.html.classList.remove('defaultTheme', 'lightTheme', 'mediumTheme'),
                          local.update('theme', 'darkTheme'),
                          report('Theme: detected dark theme'))
                        : (el.html.classList.add('mediumTheme'),
                          el.html.classList.remove('defaultTheme', 'lightTheme', 'darkTheme'),
                          local.update('theme', 'mediumTheme'),
                          report('Theme: detected medium theme')),
                        (check.theme = !1)
                }
            }
        },
        detectDensity() {
            const densityTest = get('div[role="navigation"] .TN, .aqn.aIH .TN')
            densityTest &&
                (parseInt(getStyle(densityTest, 'height')) <= 26
                    ? (report('Theme: detected high density'),
                      el.html.classList.add('highDensity'),
                      el.html.classList.remove('lowDensity'),
                      local.update('density', 'highDensity'))
                    : (report('Theme: detected low density'),
                      el.html.classList.add('lowDensity'),
                      el.html.classList.remove('highDensity'),
                      local.update('density', 'lowDensity')))
        },
        detectButtons(tries = 0) {
            if (tries > 10) return
            const secondButton = gets('div[gh="tm"] div[role="button"] > div')[2]
            if (secondButton) {
                '' == secondButton.innerText
                    ? (report('Icon button labels detected', tries),
                      local.update('textButtons', !1),
                      el.html.classList.remove('textButtons'))
                    : (report('Text button labels detected', tries),
                      local.update('textButtons', !0),
                      el.html.classList.add('textButtons'))
            } else theme.detectButtons(tries + 1)
        },
        detectSystemPref() {
            let systemColorPref,
                simplifyAlert = get('html.simplify #simplifyAlert[style*="none"]')
            simplifyAlert &&
                ((systemColorPref = getStyle(simplifyAlert, 'content').replace(/\"/g, '')),
                report('system color pref', systemColorPref),
                'dark' === systemColorPref && report('system prefers dark, switch to dark theme'))
        },
        detectMaterialYou() {
            getStyle(document.body, 'font-family').indexOf('Google Sans') >= 0
                ? (report('Material You design detected'), el.html.classList.add('matYou'))
                : el.html.classList.remove('matYou')
        },
        detect() {
            ;(theme.detectCount += 1),
                report('Theme changed? Detect #', theme.detectCount),
                theme.detectDensity(),
                theme.detectColor(),
                theme.detectButtons(),
                theme.detectMaterialYou()
        },
        setBg(color = !1, img = !1, imgPos = !1) {
            color && local.update('themeBgColor', color),
                img && local.update('themeBgImgUrl', img),
                imgPos && local.update('themeBgImgPos', imgPos),
                css.add(`:root { --color-themeBg: ${simplify[u].themeBgColor} !important; }`),
                css.add(`:root { --img-themeBg: ${simplify[u].themeBgImgUrl} !important; }`),
                css.add(`:root { --img-themeBgPos: ${simplify[u].themeBgImgPos} !important; }`),
                el.html.classList.remove('grayTheme', 'contrastTheme'),
                'rgb(245, 245, 245)' === simplify[u].themeBgColor
                    ? el.html.classList.add('grayTheme')
                    : 'rgb(238, 238, 238)' === simplify[u].themeBgColor && el.html.classList.add('contrastTheme'),
                theme.setBgMeta(simplify[u].themeBgColor)
        },
        setBgMeta(themeBgColor, count = 0) {
            if (document.head) {
                const themeMeta = get("head meta[name='theme-color']"),
                    themeColor = ((rgb) => {
                        const [, r, g, b] = rgb.match(/(\d{1,3}), ?(\d{1,3}), ?(\d{1,3})/).map((x) =>
                            ((c) => {
                                const hex = c.toString(16)
                                return 1 == hex.length ? '0' + hex : hex
                            })(parseInt(x))
                        )
                        return `#${r}${g}${b}`
                    })(themeBgColor),
                    color = '#ffffff' === themeColor ? '#f7f7f7' : '#444444' === themeColor ? '#2C2E30' : themeColor
                if (themeMeta) themeMeta.content = color
                else {
                    const metaTag = make('meta', { name: 'theme-color', content: color })
                    document.head.appendChild(metaTag)
                }
            } else
                count < 20 &&
                    setTimeout(() => {
                        setBgMeta(themeBgColor, count + 1)
                    }, 100)
        },
    }
is.okToSimplify && (el.html.classList.add(simplify[u].theme), el.html.classList.add(simplify[u].density))
const settings = {
        init() {
            const closeButton = getEl('closeButton')
            closeButton &&
                (report('Adding event listener to close button'), closeButton.addEventListener('click', settings.exit)),
                appMenu.close()
            let settingsWrapper = get('.nH[style*="width"] + .bq9')
            ;(settingsWrapper = !!settingsWrapper && settingsWrapper.previousSibling),
                settingsWrapper && settingsWrapper.classList.add('settingsWrapper')
        },
        exit() {
            const inboxLink = get(sel.inboxLink)
            inboxLink ? clickOn(inboxLink) : (location.hash = close.settings), (check.readingPane = !0)
        },
        addSimplifySettingsLink() {
            const settingsNav = get('.fY'),
                alreadyCreated = get('#simplifyOptions')
            if (settingsNav && !alreadyCreated) {
                const openSimplifySettings = make(
                    'div',
                    { className: 'f1', id: 'simplifyOptions' },
                    make('a', { href: chrome.runtime.getURL('prefs/edit.html'), className: 'f0' }, 'Simplify Gmail')
                )
                settingsNav.appendChild(openSimplifySettings)
            }
        },
        addSimplifySettingsButton() {
            const quickSettingsBottom = get('.IU fieldset')
            if (quickSettingsBottom) {
                const openSimplifySettings = make(
                    'div',
                    { className: 'Q3' },
                    make('div', { className: 'OG' }, 'SIMPLIFY GMAIL'),
                    make(
                        'button',
                        { id: 'openSimplifySettings', className: 'Tj', ariaLabel: 'Simplify options' },
                        'Simplify options'
                    )
                )
                openSimplifySettings.addEventListener('click', () => {
                    window.open(chrome.runtime.getURL('prefs/edit.html')), clickOn(get('.rightPane .OB'))
                }),
                    quickSettingsBottom.appendChild(openSimplifySettings)
            }
        },
    },
    chat = {
        triesSide: 0,
        triesPeek: 0,
        triesMeet: 0,
        side: void 0,
        meet: null,
        roster: null,
        newChat: null,
        init() {
            if (this.triesPeek > 30)
                return (
                    report('Simplify > chat.init() > No roster, assume chat is disabled'),
                    (this.triesPeek = 0),
                    void el.html.classList.add('newUI')
                )
            if (((this.roster = get(sel.chatAndMeet)), (this.newChat = get(sel.chatNew)), null !== this.newChat))
                return (
                    report('New Gmail nav. Aborting looking for old chat roster'),
                    void (
                        get(`.aeN ${sel.chatNew}:not(.adZ) .XS`) ||
                        (report('New chat roster is on the right size'), el.html.classList.add('rhsChat'))
                    )
                )
            if (null === this.roster) (this.triesPeek += 1), setTimeout(this.init.bind(this), 100)
            else {
                report('Chat: Set up peeking', this.roster),
                    (this.triesPeek = 0),
                    this.roster.addEventListener('mouseover', chat.peek)
                const closeChatPeek = make('div', { id: 'closeChatPeek' })
                closeChatPeek.addEventListener('mouseover', chat.unpeek),
                    document.body.appendChild(closeChatPeek),
                    this.detectChat(),
                    this.detectMeet()
            }
        },
        detectChat() {
            if (this.triesSide > 10)
                return (
                    report('Simplify > chat.detectChat() > No roster, assume chat is disabled'),
                    local.update('chat', 'off'),
                    void (this.triesSide = 0)
                )
            report(`Finding chat roster attempt #${this.triesSide}`)
            let roster = get('#talk_roster')
            roster && (this.side = roster.getAttribute('guidedhelpid')),
                void 0 === this.side
                    ? ((this.triesSide += 1),
                      el.html.classList.add('chatOff'),
                      setTimeout(this.detectChat.bind(this), 250))
                    : ((this.triesSide = 0),
                      local.update('chat', this.side),
                      el.html.classList.remove('chatOff'),
                      report(`Found chat: ${simplify[u].chat}`),
                      'right_roster' === this.side
                          ? el.html.classList.add('rhsChat')
                          : el.html.classList.remove('rhsChat'))
        },
        detectMeet() {
            if (this.triesMeet > 10)
                return (
                    report('Simplify > chat.detectChat() > No roster, assume chat is disabled'),
                    local.update('meet', !1),
                    void (this.triesMeet = 0)
                )
            report(`Finding meet widget attempt #${this.triesMeet}`),
                (this.meet = get('.YM, *[aria-label="Meet"]')),
                this.meet
                    ? ((this.triesMeet = 0), local.update('meet', !0), el.html.classList.remove('meetOff'))
                    : ((this.triesMeet += 1),
                      el.html.classList.add('meetOff'),
                      setTimeout(this.detectMeet.bind(this), 250))
        },
        peek(event) {
            is.simplifyOn &&
                (el.html.classList.add('chatOpen'),
                event.stopPropagation(),
                window.addEventListener('mouseout', observers.window.mouseout))
        },
        unpeek() {
            el.html.classList.remove('chatOpen'), window.removeEventListener('mouseout', observers.window.mouseout)
        },
    },
    readingPane = {
        element: null,
        tries: 0,
        size: '500px',
        type: '',
        calls: 0,
        init() {
            if (is.list) {
                if (this.tries > 30)
                    return error("Simplify > readingPane.init() > Cound't find div[gh='tl']"), void (this.tries = 0)
                ;(this.element = get("div[gh='tl']")),
                    this.element
                        ? (report('Detecting reading pane took this many loops:', this.tries),
                          (this.tries = 0),
                          this.element.classList.contains('vy')
                              ? ((is.readingPane = !0), readingPane.detect())
                              : ((is.readingPane = !1),
                                (this.type = 'unknown'),
                                el.html.classList.remove('nPane', 'hPane', 'vPane', 'msgOpen')),
                          (check.readingPane = !1),
                          local.update('readingPane', is.readingPane),
                          local.update('readingPaneType', this.type))
                        : ((this.tries += 1), setTimeout(this.init.bind(this), 100))
            } else check.readingPane = !0
        },
        detect() {
            report('readingPane.detect called', this.calls),
                (this.calls += 1),
                this.detectType(),
                this.detectSize(),
                this.findToggle()
        },
        findToggle(listScan = !1) {
            let foundNewToggles = !1
            gets('.apF, div[data-tooltip="Toggle split pane mode"]').forEach((element) => {
                element.parentElement.classList.contains('readingPaneToggle') ||
                    (element.parentElement.classList.add('readingPaneToggle'), (foundNewToggles = !0))
            }),
                count(
                    '.apH:not([data-simplify]), .apI:not([data-simplify]), .apJ:not([data-simplify]), .apK:not([data-simplify]), div[data-tooltip*="Toggle split pane"] .asa > div:not([data-simplify])'
                ) > 0 &&
                    (report('Found an unobserved toggle, restarting readingPane observer'),
                    observers.readingPane.restart())
        },
        detectType() {
            if (is.msg) return (this.type = 'nPane'), void (check.readingPane = !0)
            ;(this.element = get("div[gh='tl'], div.UI")),
                report('Detect type of reading pane'),
                this.element &&
                    (this.element.classList.contains('Nm')
                        ? (this.type = 'vPane')
                        : (gets('.Zs').forEach((list) => {
                              list.classList.remove('Zs')
                          }),
                          this.element.classList.contains('S2')
                              ? ((this.type = 'nPane'), (check.readingPane = !1))
                              : this.element.classList.contains('Nf')
                              ? (this.type = 'hPane')
                              : ((this.type = 'unknown'),
                                (is.readingPane = !1),
                                report('Looks like reading pane is disabled')))),
                ['vPane', 'hPane'].includes(this.type) ||
                    (el.html.classList.remove('msgOpen'), (is.msgOpen = !1), observers.readingPane.disconnect()),
                observers.actionBar.start(),
                observers.readingPane.restart(),
                local.update('readingPaneType', this.type),
                el.html.classList.remove('nPane', 'hPane', 'vPane'),
                'unknown' !== this.type && el.html.classList.add(simplify[u].readingPaneType)
        },
        detectSize() {
            if ('nPane' === this.type) return
            report('detectSize called', this.type)
            let newSize = 0
            'vPane' === this.type
                ? (newSize = getStyle(".UI.vy[gh='tl'] > div:first-child", 'width'))
                : 'hPane' === this.type && (newSize = getStyle(".UI.vy[gh='tl'] > div:last-child", 'height')),
                this.size !== newSize &&
                    ((this.size = newSize || '0px'),
                    local.update('readingPaneSize', this.size),
                    'vPane' === this.type
                        ? (css.add(`:root { --width-readingPane: ${this.size} !important; }`),
                          parseInt(this.size) < 510
                              ? gets('.UI .Nu > div[jsaction]').forEach((list) => {
                                    list.classList.add('Zs')
                                })
                              : gets('.Zs').forEach((list) => {
                                    list.classList.remove('Zs')
                                }))
                        : 'hPane' === this.type && css.add(`:root { --height-readingPane: ${this.size} !important; }`))
        },
    }
;(observers.readingPane = {
    toggles: null,
    listPanes: [],
    mode: null,
    size: null,
    tries: 0,
    messagePane: null,
    currentListPane: null,
    pauseScrollObs: !1,
    paneCalls: 0,
    toggleCalls: 0,
    msgCalls: 0,
    paneObserver: new MutationObserver(() => {
        ;(observers.readingPane.paneCalls += 1),
            report('paneObserver fired', observers.readingPane.paneCalls),
            readingPane.detectSize()
    }),
    toggleObserver: new MutationObserver(() => {
        ;(observers.readingPane.toggleCalls += 1),
            report('toggleObserver fired', observers.readingPane.toggleCalls),
            setTimeout(readingPane.detect.bind(readingPane), 100)
    }),
    msgObserver: new MutationObserver((mutations) => {
        ;(observers.readingPane.msgCalls += 1),
            report('Message mutation', observers.readingPane.msgCalls),
            mutations.some((m) => m.target.classList.contains('UG'))
                ? (el.html.classList.add('msgOpen'),
                  (is.msgOpen = !0),
                  report('Scan conversation for trackers & htmlEmail if darkTheme'),
                  conversation.scan(),
                  observers.inlineReply.start())
                : count(sel.rPaneMsgSelectdBanner) > 0 && (el.html.classList.remove('msgOpen'), (is.msgOpen = !1)),
            preferences.reverseMsgs || el.html.classList.remove('reverseMsgs', 'reverseList')
    }),
    start() {
        if (this.tries > 30) return error("Cound't find list view for reading pane"), void (this.tries = 0)
        let vhPane = 'vPane' === readingPane.type || 'hPane' === readingPane.type
        ;(this.toggles = gets('.apH, .apI, .apJ, .apK, div[data-tooltip*="Toggle split pane"] .asa > div')),
            vhPane &&
                ((this.messagePane = get(".BltHke[role='main'] .UI:not(.S2) .Bs")),
                (this.listPanes = gets('.UI:not(.S2) > .Nu:first-child'))),
            0 === this.toggles.length || (vhPane && 0 === this.listPanes.length)
                ? ((this.tries += 1), setTimeout(this.start.bind(this), 100))
                : ((this.tries = 0), this.observe())
    },
    observe() {
        report('Observe reading panes and/or toggles', readingPane.type),
            this.toggles.forEach((toggle) => {
                toggle.setAttribute('data-simplify', 'sofc'),
                    this.toggleObserver.observe(toggle, observers.config.classAttributeOnly)
            }),
            this.listPanes.forEach((listPane) => {
                this.paneObserver.observe(listPane, observers.config.styleAttributeOnly)
            }),
            this.messagePane &&
                (this.msgObserver.observe(this.messagePane, observers.config.classAttributeOnly),
                this.messagePane.classList.add('SOFC')),
            this.observeScrolling()
    },
    disconnect() {
        null !== this.paneObserver && this.paneObserver.disconnect(),
            null !== this.msgObserver && this.msgObserver.disconnect()
    },
    restart() {
        this.disconnect(), this.start()
    },
    scrollObserver() {
        report('Scrolling'),
            observers.readingPane.pauseScrollObs ||
                (observers.readingPane.isListScrolled(this),
                (observers.readingPane.pauseScrollObs = !0),
                setTimeout(() => {
                    ;(observers.readingPane.pauseScrollObs = !1), observers.readingPane.isListScrolled(this)
                }, 200))
    },
    isListScrolled(list) {
        list.scrollTop < 30 ? el.html.classList.remove('listScrolled') : el.html.classList.add('listScrolled')
    },
    observeScrolling() {
        ;(is.search || is.label) &&
            is.readingPane &&
            'nPane' !== readingPane.type &&
            ((this.currentListPane = get(".BltHke[role='main'] .UI > .Nu:first-child")),
            this.currentListPane &&
                null === this.currentListPane.onscroll &&
                ((this.currentListPane.onscroll = this.scrollObserver), report('Observe scrolling search list')))
    },
}),
    is.okToSimplify &&
        'unknown' !== simplify[u].readingPaneType &&
        (el.html.classList.add(simplify[u].readingPaneType),
        report('Loading with reading pane enabled', simplify[u].readingPaneType))
const url = {
    hash: null,
    check() {
        ;(is.popout = -1 !== location.href.search(/view=btop.*search=/)),
            (is.original = -1 !== location.href.indexOf('view=om')),
            (is.print = -1 !== location.href.indexOf('view=pt')),
            (is.mailto = -1 !== location.href.search(/tf=cm|view=btop.*#cmid/)),
            (is.gChat = 0 === location.pathname.indexOf('/chat/')),
            '' !== location.hash &&
                (is.msg && is.readingPane
                    ? (report('Yes, check the readingPane size'), (check.readingPaneSize = !0))
                    : report('No, do not check the readingPane size', is.msg, is.readingPane),
                (this.hash = location.hash.replace(/\/p\d{1,3}$/, '')),
                (is.msg = -1 !== this.hash.search(regex.msg)),
                (is.list = -1 === this.hash.search(regex.msg)),
                (is.inbox = 0 === this.hash.search(/#inbox/)),
                (is.search = 0 === this.hash.search(regex.search)),
                (is.label = 0 === this.hash.search(regex.label)),
                (is.spam = 0 === url.hash.search(/#spam/)),
                (is.chat = 0 === url.hash.search(/#chat/)),
                (is.trash = 0 === url.hash.search(/#trash/)),
                (is.settings = 0 === this.hash.search(/#settings/)),
                is.settings
                    ? (el.html.classList.add('inSettings'), (is.list = !1))
                    : (el.html.classList.remove('inSettings'), (close.settings = this.hash)),
                is.chat ? el.html.classList.add('inChat') : el.html.classList.remove('inChat'),
                is.msg
                    ? (el.html.classList.add('inMsg'),
                      conversation.scan(),
                      (is.inbox = !1),
                      (is.search = !1),
                      (is.label = !1),
                      (is.list = !1),
                      (is.spam = !1),
                      (is.trash = !1))
                    : el.html.classList.remove('inMsg'),
                is.search
                    ? el.html.classList.add('inSearch')
                    : (el.html.classList.remove('inSearch'), is.list && (close.search = this.hash)),
                is.label
                    ? el.html.classList.add('inLabel')
                    : (el.html.classList.remove('inLabel'), is.list && (close.search = this.hash)),
                is.inbox
                    ? (el.html.classList.add('inInbox'),
                      is.loading || null !== is.tabbedInbox || (is.tabbedInbox = count(sel.tabs) > 0))
                    : el.html.classList.remove('inInbox'),
                is.list
                    ? (el.html.classList.add('inList'), (close.msg = this.hash))
                    : el.html.classList.remove('inList', 'inboxZero'),
                is.spam ? el.html.classList.add('inSpam') : el.html.classList.remove('inSpam'),
                is.trash ? el.html.classList.add('inTrash') : el.html.classList.remove('inTrash'),
                is.delegate ? el.html.classList.add('delegate') : el.html.classList.remove('delegate'),
                check.readingPaneSize && (readingPane.detectSize(), (check.readingPaneSize = !1)))
    },
}
is.okToSimplify &&
    (window.onhashchange = () => {
        report('URL changed'),
            url.check(),
            document.documentElement.classList.remove('appMenuOpen'),
            is.msg && (observers.inlineReply.start(), observers.actionBar.addSearchButton()),
            is.list &&
                (check.theme && theme.detect(),
                check.readingPane && readingPane.init(),
                el.html.classList.remove('boldHighlight'),
                lists.scan(),
                observers.actionBar.start(),
                is.readingPane &&
                    (readingPane.findToggle(),
                    ['vPane', 'hPane'].includes(readingPane.type) && observers.readingPane.restart())),
            is.settings && settings.init(),
            preferences.reverseMsgs || el.html.classList.remove('reverseMsgs', 'reverseList'),
            check.categories &&
                (Object.values(categories).indexOf(location.hash) > -1
                    ? (Object.keys(categories).forEach((key) => {
                          if (
                              (report(
                                  'Checking location hash for category',
                                  location.hash,
                                  key,
                                  categories[key],
                                  location.hash === categories[key]
                              ),
                              location.hash !== categories[key])
                          ) {
                              let wasActive = get(`.aim[data-category="${key}"] .TO.nZ.aiq`)
                              wasActive && wasActive.classList.remove('nZ', 'aiq')
                          }
                      }),
                      observers.actionBar.observe())
                    : ((check.categories = !1),
                      gets('.aim[data-category] .TO.nZ.aiq').forEach((item) => {
                          item.classList.remove('nZ', 'aiq')
                      }))),
            check.trial && subscription.badge()
    }),
    url.check(),
    is.okToSimplify && console.log('Simplify v' + chrome.runtime.getManifest().version + ' loaded')
const initializeSimplify = () => {
    if ((report('Gmail is loaded, initializing Simplify'), (is.loading = !1), !is.popout && !is.mailto)) {
        const authUser = chrome.runtime.getURL('js/authUser.js')
        document.head.appendChild(make('script#getUserId', { src: authUser }))
    }
    if ((is.safari && el.html.classList.add('isSafari'), is.mailto || is.popout))
        return observers.compose.start(), void document.body.classList.add('inboxsdk_hack_disableComposeSizeFixer')
    Object.keys(trickyElements).forEach((el) => {
        getEl(el)
    }),
        document.body.addEventListener('keydown', keyboard.onKeydown, !1),
        report('Loading done? About try adding categories'),
        url.check(),
        nav.init(),
        readingPane.init(),
        search.init(),
        chat.init(),
        lists.init(),
        alerts.init(),
        appMenu.init(),
        is.list && observers.actionBar.start(),
        is.settings && settings.init(),
        theme.detect(),
        observers.theme.start(),
        observers.quickSettings.start(),
        observers.addOns.start(),
        observers.body.start(),
        observers.compose.start(),
        conversation.initTrackerDetails(),
        ('vPane' !== simplify[u].readingPaneType && 'hPane' !== simplify[u].readingPaneType) ||
            setTimeout(readingPane.detectSize, 100),
        window.addEventListener('resize', observers.window.resize),
        window.addEventListener('click', observers.window.click),
        observers.window.dragInit(),
        is.inbox && check.inboxSections && lists.checkSections(),
        subscription.check(),
        is.chrome &&
            el.html.classList.contains('simplifyCanary') &&
            alerts.show(
                {
                    title: 'Two versions of Simplify detected',
                    body: 'Bad things happen when you have two versions of Simplify Gmail enabled. Please disable one and reload Gmail.',
                },
                'Manage extensions'
            )
}
