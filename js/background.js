/**
 * @preserve
 * Copyright (C) Michael Leggett, Made Simple LLC - All Rights Reserved
 * Proprietary and confidential; Unauthorized copying or redistribution of this file,
 * via any medium is strictly prohibited; Written by Michael Leggett (hi@simpl.fyi)
 */

// ==========================================================================
// BACKGROUND - Handle background funtions like toggling Simplify on/off

const toggledOnIcon = {
  48: "img/app/icon48.png",
  128: "img/app/icon128.png",
};

const toggledOffIcon = {
  48: "img/app/icon48_off.png",
  128: "img/app/icon128_off.png",
};

// TO REMOVE -- I stopped toggling the icon on 5/9/2022
function updatePageAction(tabId, toggled) {
  chrome.pageAction.setIcon({
    tabId: tabId,
    path: toggled ? toggledOnIcon : toggledOffIcon,
  });
}

chrome.runtime.onMessage.addListener(async function (
  message,
  sender,
  sendResponse
) {
  switch (message.action) {
    case "activate_page_action":
      chrome.pageAction.show(sender.tab.id);
      break;

    case "toggle_simplify":
      // I used to change the page icon when Simplify was toggled, stoped on 5/9/2022
      // updatePageAction(sender.tab.id, message.isOn);
      break;

    case "manage_extensions":
      chrome.tabs.create({ url: "chrome://extensions/" });
      // Firefox: about:addons
      // Safari: ?
      break;

    case "is_tab_pinned":
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        let pinnedState = tabs[0].pinned;
        chrome.tabs.sendMessage(sender.tab.id, {
          action: "is_tab_pinned",
          isTabPinned: pinnedState,
        });
      });
      break;

    case "check_content_permissions":
      chrome.permissions.contains(
        {
          permissions: ["contentSettings"],
        },
        (result) => {
          console.log("Checking contentSettings permission", result);
          chrome.tabs.sendMessage(sender.tab.id, {
            action: "check_content_permissions",
            permission: result,
          });
        }
      );
      break;

    case "request_notifications_permissions":
      requestPermission("contentSettings", (granted) => {
        if (granted) {
          toggleContentSetting("notifications", false);
        } else {
          chrome.tabs.sendMessage(sender.tab.id, {
            action: "permission_not_granted",
            permission: "notifications",
          });
        }
      });
      break;

    case "disable_notifications":
      chrome.permissions.contains(
        { permissions: ["contentSettings"] },
        (hasPermission) => {
          if (hasPermission) {
            toggleContentSetting("notifications", false);
          } else {
            chrome.tabs.sendMessage(sender.tab.id, {
              action: "ask_for_notifications_permissions",
              permission: "notifications",
            });
          }
        }
      );
      break;

    case "enable_notifications":
      toggleContentSetting("notifications", true);
      break;

    default:
      console.error("Unknown message action", message.action);
  }
});

function requestPermission(permission, callback) {
  chrome.permissions.request({ permissions: [permission] }, callback);
}

function toggleContentSetting(permission, clear) {
  if (!chrome.contentSettings) return;

  if (clear) {
    chrome.contentSettings[permission].clear({});
    console.log("Cleared notification settings modifications");
  } else {
    let newState = { primaryPattern: "https://mail.google.com/*" };
    switch (permission) {
      case "notifications":
        newState.setting = "block";
        break;
    }
    chrome.contentSettings[permission].set(newState);
  }
}

// ==========================================================================
// Reload Gmail tab on Simplify installation or update

chrome.runtime.onInstalled.addListener(function () {
  chrome.tabs.query({ url: "*://mail.google.com/*" }, function (tabs) {
    tabs.forEach(function (tab) {
      chrome.tabs.reload(tab.id);
    });
  });
});
