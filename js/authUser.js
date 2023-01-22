(function () {
  if (!GLOBALS) {
    let window_opener = typeof window !== "undefined" ? window.opener : null;
    if (window_opener) {
      try {
        // access to window.opener domain will fail in case of cross-origin access
        let opener_domain = window_opener.document.domain;
        if (opener_domain !== window.document.domain) {
          window_opener = null;
        }
      } catch (error) {
        window_opener = null;
      }
    }
  }

  document.documentElement.dataset.gmaccount =
    GLOBALS[10] || window_opener?.GLOBALS[10] || "";
})();
