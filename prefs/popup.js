/**
 * @preserve
 * Copyright (C) Michael Leggett, Made Simple LLC - All Rights Reserved
 * Proprietary and confidential; Unauthorized copying or redistribution of this file,
 * via any medium is strictly prohibited; Written by Michael Leggett (hi@simpl.fyi)
 */

// ==============================================================
// UTILITIES

// Shorthand for getting first matching element; returns Node
const get = (selector, parent = "") => {
  if (parent === "") {
    return document.querySelector(selector);
  } else {
    return parent.querySelector(selector);
  }
};

// Shorthand for getting elements; returns NodeList
const gets = (selector, parent = "") => {
  if (parent === "") {
    return document.querySelectorAll(selector);
  } else {
    return parent.querySelectorAll(selector);
  }
};

// Shorthand for getting number of elements given a provided selector
const count = (selector, parent = "") => {
  if (parent === "") {
    return document.querySelectorAll(selector).length;
  } else {
    return parent.querySelectorAll(selector).length;
  }
};

// Getting active tab's ID
let tabId = null;
const getTabId = () => {
  chrome.tabs.query(
    {
      active: true,
      windowType: "normal",
      currentWindow: true,
    },
    (tabs) => {
      if (tabs[0]) tabId = tabs[0].id;
    }
  );
  console.log("Updated tab ID", tabId);
};
getTabId();

// Update tab id when active tab is changed
chrome.tabs.onActivated.addListener(getTabId);

// ==============================================================
// PREFERENCES

const goto = (where) => {
  switch (where) {
    case "options":
      let optionsUrl = chrome.runtime.getURL("prefs/edit.html");
      chrome.tabs.create({ active: true, url: optionsUrl });
      break;
    case "account":
      chrome.tabs.create({ active: true, url: "https://simpl.fyi/account" });
      break;
    case "issue":
      chrome.tabs.sendMessage(tabId, { action: "report_issue" });
      window.close();
      break;
    case "disable":
      chrome.tabs.sendMessage(tabId, { action: "disable_simplify" });
      window.close();
      break;
    case "changes":
      chrome.tabs.create({ active: true, url: "https://changelog.simpl.fyi" });
      break;
    case "newsletter":
      chrome.tabs.create({
        active: true,
        url: "https://on.simpl.fyi/?no_cover=true",
      });
      break;
    case "privacy":
      chrome.tabs.create({ active: true, url: "https://simpl.fyi/privacy" });
      break;
    case "about":
      chrome.tabs.create({ active: true, url: "https://simpl.fyi/about" });
      break;
    case "details":
      chrome.tabs.sendMessage(tabId, { action: "show_details" });
      window.close();
      break;
  }
};

const setup = () => {
  gets("#menu *[id]").forEach((item) => {
    item.addEventListener("click", () => {
      goto(item.id);
    });
  });
};
window.addEventListener("load", setup);

// Remove pricing link for Safari because, Apple ¯\_(ツ)_/¯
// const UA = navigator.userAgent;
// const isSafari = /Safari/.test(UA) && !/Chrome/.test(UA);
// if (isSafari) {
//   get("#pricing").style.display = "none";
// }
