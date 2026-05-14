const mobileStyles = process.env.MOBILE
  ? [
      `body {
        padding-top: 44px !important;
        box-sizing: border-box !important;
      }`,
      `.__dumi-default-navbar {
        top: 44px !important;
      }`,
    ]
  : [];

export const styles = [
  `.__dumi-default-navbar-logo:not([data-plaintext]) {
        padding-left: 0px !important;
        background: none !important;
      }`,
  ...mobileStyles,
];
