const mobileStyles = process.env.MOBILE
  ? [
      `.__dumi-default-navbar {
        position: fixed !important;
        top: 44px !important;
        left: 0 !important;
        right: 0 !important;
        z-index: 101 !important;
      }`,
      `.__dumi-default-layout {
        padding-top: 110px !important;
      }`,
      `.__dumi-default-menu {
        top: 94px !important;
      }`,
    ]
  : [];

// 桌面端 sidebar toggle
const sidebarToggleStyles = `
  /* 仅桌面端：显示汉堡按钮 */
  @media screen and (min-width: 768px) {
    .__dumi-default-navbar-toggle {
      display: block !important;
      cursor: pointer;
      top: 20px !important;
    }
  }

  /* Sidebar 收起时隐藏左栏（仅桌面端） */
  @media screen and (min-width: 768px) {
    .__dumi-default-menu {
      transition: transform 0.28s ease, opacity 0.2s ease !important;
      will-change: transform, opacity;
    }

    .__dumi-default-layout {
      transition: padding-left 0.28s ease !important;
    }

    body.sidebar-collapsed .__dumi-default-menu {
      transform: translateX(-100%) !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    body.sidebar-collapsed .__dumi-default-layout {
      padding-left: 58px !important;
    }
  }
`;

export const styles = [
  `.__dumi-default-navbar-logo:not([data-plaintext]) {
        padding-left: 0px !important;
        background: none !important;
      }`,
  sidebarToggleStyles,
  ...mobileStyles,
];

// 桌面端：点击汉堡按钮时切换 sidebar
export const scripts = [
  `(function() {
    function initSidebarToggle() {
      var btn = document.querySelector('.__dumi-default-navbar-toggle');
      if (!btn || btn.dataset.desktopBound) return;
      btn.dataset.desktopBound = 'true';

      btn.addEventListener('click', function(e) {
        if (window.innerWidth > 767) {
          e.stopPropagation();
          document.body.classList.toggle('sidebar-collapsed');
        }
      }, true);
    }

    function tryInit() {
      if (document.querySelector('.__dumi-default-navbar-toggle')) {
        initSidebarToggle();
      } else {
        setTimeout(tryInit, 200);
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', tryInit);
    } else {
      tryInit();
    }

    var observer = new MutationObserver(function() {
      var btn = document.querySelector('.__dumi-default-navbar-toggle');
      if (btn && !btn.dataset.desktopBound) {
        initSidebarToggle();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  })();`,
];
