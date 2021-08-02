import { css } from "linaria";

export const globalStyles = css`
  :global() {
    html {
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
      padding: 0;
      margin: 0;
      height: 100%;
    }

    body {
      padding: 0;
      margin: 0;
      height: 100%;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
        Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    }

    div#__next {
      height: 100%;
    }

    * {
      box-sizing: border-box;
    }
  }

  --dark-text: rgba(148, 148, 149, 1);
  --blue: #007bff;
  --blue-two: #34495e;
  --indigo: #6610f2;
  --purple: #6f42c1;
  --pink: #e83e8c;
  --red: #b90505;
  --red-two: #dc3545;
  --orange: #fd7e14;
  --orange-two: #ffa644;
  --yellow: #ffc107;
  --yellow-two: #c9c243;
  --yellow-three: #ffd200;
  --green: #28a745;
  --green-two: #e74c3c;
  --teal: #20c997;
  --cyan: #17a2b8;
  --white: #fff;
  --gray: #6c757d;
  --gray-dark: #343a40;
  --primary: #007bff;
  --secondary: #6c757d;
  --success: #28a745;
  --info: #17a2b8;
  --warning: #ffc107;
  --danger: #dc3545;
  --light: #f8f9fa;
  --dark: #343a40;
  --breakpoint-xs: 0;
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;

  /* stolen from bootstrap link: https://getbootstrap.com/docs/4.0/components/alerts/ */
  --alert-primary-background-color: #cce5ff;
  --alert-primary-border-color: #b8daff;
  --alert-primary-color: #004085;

  --alert-secondary-background-color: #e2e3e5;
  --alert-secondary-border-color: #d6d8db;
  --alert-secondary-color: #383d41;

  --alert-success-background-color: #d4edda;
  --alert-success-border-color: #c3e6cb;
  --alert-success-color: #155724;

  --alert-info-color: #0c5460;
  --alert-info-background-color: #d1ecf1;
  --alert-info-border-color: #bee5eb;

  --alert-danger-background-color: #f8d7da;
  --alert-danger-border-color: #f5c6cb;
  --alert-danger-color: #721c24;

  --alert-warning-background-color: #fff3cd;
  --alert-warning-border-color: #ffeeba;
  --alert-warning-color: #856404;

  --alert-light-background-color: #fefefe;
  --alert-light-border-color: #fdfdfe;
  --alert-light-color: #818182;

  --alert-dark-background-color: #d6d8d9;
  --alert-dark-border-color: #c6c8ca;
  --alert-dark-color: #1b1e21;
`;
