// Email Template Generator - Profesyonel HTML Email Şablonu

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  color: string;
}

interface EmailTemplateOptions {
  subject: string;
  content: string;
  companyName?: string;
  companyAddress?: string;
  companyLogo?: string; // Profil fotoğrafı/logo
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    discord?: string;
    youtube?: string;
    instagram?: string;
    github?: string;
  };
  unsubscribeUrl?: string;
  viewInBrowserUrl?: string;
}

export function generateEmailHTML(options: EmailTemplateOptions): string {
  const {
    subject,
    content,
    companyName = '',
    companyAddress = '',
    companyLogo = '',
    socialLinks = {},
    unsubscribeUrl,
    viewInBrowserUrl,
  } = options;

  // Sosyal medya linklerini filtrele ve formatla (Gmail uyumlu Base64 PNG)
  const activeSocialLinks: SocialLink[] = [];
  
  if (socialLinks.linkedin) {
    activeSocialLinks.push({
      platform: 'LinkedIn',
      url: socialLinks.linkedin,
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAACNElEQVRoge2au2sVQRSHvzMxoiAmmqAp7OwkjYJtNJVRfJQRrcVGwcJC8A+wEMRCrKztRUSCD0yQEKIi8YHYGUTEVDbC9fr4yeBekOvd2U3Qe89Ev2JZ9pwznN/OzsyZYQGQdFDSvKSG/NOQNCdpf8zdJB0GbpAnh6KAJ8Au8uRxFNAE+smTZhQgMiaQOWtq+j0CXgFbgD3AerygNB8k7W3zH5F0V06weCnTBoyZ2cMOogeB58A2HI+BmU7JR8zsI3ABB4SELb7hFAs4FzBYEbsJ5wImJG1I2I/jXMAwcFVSX7tB0iRwFAdYYhZqMQtcAl4CW4vETwC/CesFVkOAawL/SCnxp3kP3AFeAw1gMzACxFV/+7JaqlipS1daSTNtvjcTvucKnyVJxzpNDC0k7ZQ0XbeU6OYn9AzYbWbXzexbmZOZPQXGgSt1Gu2WgFh6HDGzxTrOZvYdOAM88CLgmpm9WU6A/eyl8y4EmNnXFcbNAi9cTaOShiWNSRqP9zVC7rkQUOw9LgLvgGngPvBW0umK0DioXfTASeAssPaXZ+uAy5JGE3GLXgScSuQwmYhb6rmAoizfkXAZTdjiSt3zHhiKk0rCPpCwffYgIJVgayysiG4J6PtbeQQyJ5A5gcwJZE4gcwKZE8icQOYEVvmxyoCkTzVj+yWVHfhurMpD5bHJMuT/yVyvCawCAV/Il2YoTsxyZSEO4n3A7Yodk0cUf/YIZjYVb4D5qu2bE2KOc8ABM7v1AwXqac5SznEPAAAAAElFTkSuQmCC',
      color: '#0A66C2'
    });
  }
  
  if (socialLinks.twitter) {
    activeSocialLinks.push({
      platform: 'X (Twitter)',
      url: socialLinks.twitter,
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAADa0lEQVRoge2ZW4hOURTH95lxG6aRu8wYMYncIjUJD+SSoqlRkilyex1PiszwoPFi5sV4YUijpHiiJoQaSUgml4wHilxLbjOY3P20dSZ7VnvPmXO+c75v5PvXqa/WOmv91zl7/89a+1Mqiyz+b3idP4AJSqlVEWI0eZ7XGhchYI1SqthialNKNXieh+vGHOAM4fEQGBwT+Y2OHN+AxT0JMBR4HKGI04CXIvmFwFdL7F/AujCBSh2BglCZAvlpQJsj7o4oAbdYAh3Xr9G4Tgq7Lro0Qq6xwAsH+YbQ5I3AxyzrcK5hHwS0Cp8nwLAQOQqA2w7yej/2SaWAfOC+CPoUGG74TAU6hE9TT/YD0Bc47yB/NxZh8Ndmh+XJ5Bg+FRYCWwPiekCjg/xzoChl8gEEq4TPEWH/DszvJuZuB/l2YEZs5I2Eh0Sin8ASwz4AuCV8npnLLTatjwKfYItI+AooNHwm+k/QxEUgN3atjwKgBHgvEl/Vm9HwWe3S8di1PgqAcv9pmdgrfA4I+w9gbSJaHwVAneX1rzTs/S3LjUS0Pgp0QuCyIKKXVolYbq7l0gldZL7KBIDRwEtB6A6QZ/iUWZZbMlofBb6i6PVt4qDw2Zc2rY8CYKeF4HrRLmilkvI7RvUGYB+CPgMzDZ9i4I3wuZT2zRtyCHqgO03DZ7llP+xRvQWOIeiE8KkVdl1Qmeot0B1od1Oavx+uCPtrPdBklvlfchccDdo8w6/IJ23iOtAvk+R1b38UN+QQtMgiv3WZLKCGYMiutMayH8ozQX6zg7AeaCSqjftygWZhfweMTyf5ZQ6if3p73WVahqClxv2jLO3IDd0MpoP89G6atSpjCLoZMAQtsOyH+qTJF/rjog2Hhe844K3wuWaqDrDLEqciKfIFftdpw1lbewCssHyFa0U7ck7YPwKT06X1gec4jq+wOQSN8FtsGTMvHVof2Ns7hqAPwCTDZ47/4XO250lofY97+x4OQdstOVI7rQA2xXWO4xiCGsSbPiXsn4ApiWh9xJjVAUPQEEt7fg8YGDbRLH+dEnS0GMMQ1KFjAtv8Sx7dazQmovURi9BP+RHhsSERrU9hCPoSsoAu42qsWh+xiErCo8u4Kp+m/ouoxb8k6j3Pa4+zAM/z9vtnqyND3jpbKdUcJ5csslD/KH4DzmEXAUi+9W8AAAAASUVORK5CYII=',
      color: '#000000'
    });
  }
  
  if (socialLinks.discord) {
    activeSocialLinks.push({
      platform: 'Discord',
      url: socialLinks.discord,
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAADfElEQVRoge2Z22tUVxSHf1vrJalRAjGh94hR8AZqQQriQ++G2kql9EFQUIRoEQsKXh60T63xURAsFPrQFnqBPhVKay//QF+kEcW0RoOiLxqN0VysyVcWWRPG8cyZfcyEztT5YJgDZ6+119pr77XX3keqUaPG4wswDVgCzH8E2WaXnTY11iV3GoDVwEHgN+A243zxCLq+clnT8StwAFhlfUyF4cuATuAiyfwDtOW1nwM0Aq3+s+c5ee/bgPtFdPUAn1h0ymF4O/A7cXQDZ4D+lDb93uZ8hL4xj/KbaTYWDRewVNJpSTP033JP0qoQwtmkl4kLyOfhiQow3pgp6dNia6NYBtgi6WVVDuskbUt68ZBXwJOSLkhqUWVxTVJbCGGwVAQ+qEDjjack7VZaBHz0eyQ1qzK5KWlhCMH+EyOws4KNNxolbVdSBHyVd9s8U2VzQdLiEMJYYQRerQLjjYWSJja3fAd2qHrY/sAU8sV7Q9IsVQd3Jc0PIQzlIvBaFRlv2IC/YQ85B9qVfSG9J6lBUr2kDZK6Msifk/SOG2JV6ruSzme0YePEE3ApsuLMVZ1Nhdq8hP4jQv5PYF6CfKNXqtF25ARbyMbrxYYEWOllcBovpcivzWCH9dOUq/ljuVrqxOQjnD5q6fI9Gex5y9bAasXzVwiBEm3SjOyO6UPxrDAHFmUQqJtkm8nKF9JqDjyjeFYAlnkSAZ6QtCZF/kWgaLoG6jLOiAVZHZgtaU+JHfKhDJWHZZ+OlPe7PLXG8rx5fZ1sjACWtx8AeAUYiJAfTDqoM55M7F0Wrtg9z4BvJlmwhfyDpB8ljXoh+H7KETVJ/ntJp7ycsV11U9olQxH6zIERPzhXI0M2YtNVvUw3B4ZVvdwxB/pVvdw2B25lEPhS0udej5ebAUmfSfomi4w50GmeRGaOXkl7JT3tFwC/THIKDnsm6vD9aL+kS5GyNnOOjVsGL/gVdww3gI+BZ122HlgPHAG+BbqAPmC0oHLs83L5O+Ajz/v1ruM54Ki3ieFnk0m6+98KXI5UYvtAKn5GaIho91Nkn73A5tSK2Ef0MHArRZHd7S9XmWD8HJEfsUJuAoe8VopWOhfY514XcrxcxucATib0Yx9UPsz/OJIZYAaw0efuEPC332KUFaDBj7Z3ga+Bt726LWsn82zBl1VpHv45quSaqVGjxv+IfwGOiZ4XM6BfsgAAAABJRU5ErkJggg==',
      color: '#5865F2'
    });
  }
  
  if (socialLinks.youtube) {
    activeSocialLinks.push({
      platform: 'YouTube',
      url: socialLinks.youtube,
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAACYUlEQVRoge2ZPWsUURSGn3cJJGyMwSSIsqKCn2g6URS1sPEXSDrFzkLsLQQrC3+AhVZ+VJFgL4iNiqKWppEgIkZE1k3UfELMkRPOwEYXQXNnyMA8cJc7O8y55+XcuXPuuVBRUVFRsQbkP2Z2ErgI9AIPgNvATmAPsAXYDAwB9Wgbgb7o+zMZ/UCt7Tq7N9v23zLwre16FpgDfgDfo++tCXwBPgNvJb3vqMDMTpvZT1vNvK0/pszshpntWBUBM3sMnKI8TAEjkh4R4fapUSY2AWNmtisT8JDy0Q9czabQYLwwZWPBo+ER2E456QH2uYBhysuwCzhAeTnoAhoJDS5RLI3Uy+hR4J5/HymGwdQCPko6F0Kekz9DLmAgtVVJL4ETwHlgkpwjUM/DsqRlSXeAvcBlYCaHYeq1WE9zQ9KcpOvAfuBWZKOp6HYB3RSApElJF+L9eJbIbE9hAjIkvQJ8/zECdM7x/zECpaYGLBY5oJkdBp4A92PXtxYWChNgZg0zuwm8AI4nMrvYFWlpbpiZL9OXgCvAhsTmF7piA50cM/PongWuJc632pn3Qb6SGDM7AjyN6kZezjvNWuLd2DYzuxvz/Bj50+xKHAF33G0WRauWONkq0nln0gWMU17Gyy7gjZdVPBudLjonSlZWkeSdMcrHqPueVad3A6+j4lUGpoFDkt6tZKOSJoAzUThd77TcV3f+jzteuo4SdsvWH63wbVUlcWUKdSLq8D61tsYBx0AcWNSjQtwbrT1B6/vtW9DpgGMpDjMyZuL+bMyAuei34oDjEzAh6cN/RKuioqKigr/yCwiB4llRzBVxAAAAAElFTkSuQmCC',
      color: '#FF0000'
    });
  }
  
  if (socialLinks.instagram) {
    activeSocialLinks.push({
      platform: 'Instagram',
      url: socialLinks.instagram,
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAFEElEQVRogdVaS2idRRT+zr03aiVNtTQSW00Rohuv3agLEQUrBUWhFVFiLVhJoVq1pFUQBDfiUulCfCBm5QvctD7aiIVqVUTrpmLTTVuliTaaKH2ojW0en5w6kcm553/d2yTXD364M/88vnPnzMw3Z35BDpBcCuAOANcBuBLAFQDaoyJtAMpRugVAq2nmTwDjUXoSwKkoPQrgJwBDAL4H0C8iw3n4JZEukXyA5D6SU5x7TIW+lUOpKPkbSB5k8+CgcspLvpvkX2w+/E1yveUrhvw6AG8m2HYawBcAjgA4CuAEgD8ATJhy48Hfp9u/JGWulEOeogNAJ4CuMNdmcIuwTkTe9v75G0mOOZYfILmW5ALMEUguJfk0yRGHz+kadyJZTvD5V0nqijIvIHkpyU8cXgMzJnaY6RavoAlAspJgRHdc6Fvz8jutOA9k15DsI/kiyavMSFh32hf7m13n75sH8k8aDieMETonYijnDn3RY16cInnhHJMXkr85bvJCVMb7o9erm1RNe3tF5EyDhBYFybEsZP2sEkFETiZUqQBY6OQvnv4hIsdIqsRYEb2vVkJHMY40QHoDgDUAbjLrvWKS5FcAdgB4Q0T+00EiMk6yH8BqU+d9kz5sDOjUjr8xw7KlIHFdgnsTXCAJoyQ3a92onctI7iB5NrS11elrm2nna808ZDLXFiC/iOQu1o+PSLaZNi9I6c9O5EO6GdjlciIv+SAt7kT9uEvbiI0QkbMp5WM5rqjUZUAY+neDZrHQidYbFofW8FRD3gGn/AoA7+SUzJZbRckMm2FZncMA9XlPLT6aRiScMTaRPOPUfyJHv4+ZOsNwdri7c/j9qEP+tiwCURsrHSNG7Hxw6m20dTwX0qNeGnoALDF5vSLyaV4DRGQPALvKtIe2C7lQPQbc4/j86yiO1wAMmDzdQ9Iw2ZABYeXRTSpGn4hMoSBERPvpM9k3Z7iROwLlAqtQp1N+N+rHbpMuhz6SYLmV1YCWAi6k4RWLQdSPozn7SHWhpLOnB+L8Qhrto+RUSDvIeIGmtCHPQqeTdyylfM2m6xlgfdy6ix3GVagfq0x6MkTmklCjcL1dM9GAoOdVEsfYEKvKvAh1ekz2l7HMno0RUGw3adU5G1EcmwBcm9G2Ra1uIzlRUEq0OVJCZcHKvMxJ3u5IiV9JLsyo94gnJWqWprRGwhA/b7JVw/cHsVXOOPyoaNsV6sR4TkQ00peG2k2X5Elj1b0ZjUwT2UkfGsnbQrJKsjU81ZCn7zx8kEdOOyp4yJPT92c1FLmSxo8axf4sFRr1+ZSp+6NaPWbK5QolBle6BcBO1I8PAdyasfKkcTu3CunNSIzL8/YeOtYD0GannTSMAHhc1WcB8h6330vOxrG8qKoUkZdCWFw1/ucJekrz9gLQqEeXiLxch4q13AYrjgHXoA6Ef3KbPsGnbWBrMMcqk4WrTXrICy1q/P1iNBlILncWgIcTY45oMpB81nBUzv/OiXAbGONwM40CyXaSx93wesoFx3uFrzdnASRbSH6WdcFRCtc2Ftuz9Mksk19Cck/mFVN0N6wT2EJ36q3nLhPmjvgyks8kBIxnXPLZa9YHAbyV1G4IofwQzrLDCZ8MIKTtXqD/mEY1YiwAcFHg0RHW+S7nziL7mvV/cNE9RvKhFMNq3MmbE/OFAZLX5yLfhB97dKethrlCKmEC6+c2GgpXiaDP+f7cRgWeyprpz20+FpFfsrj9A+4O7UrDOAf4AAAAAElFTkSuQmCC',
      color: '#E4405F'
    });
  }
  
  if (socialLinks.github) {
    activeSocialLinks.push({
      platform: 'GitHub',
      url: socialLinks.github,
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAEGElEQVRogc2aXYhVVRTH//umpvmRWfQ1ZpSWBTEVOVoQpFFokRRR2EPUQxg9RNlTREQRFL1UvvQQ2YP1UBTRhxgWUaGSgoOhFGIUYx9qZWaO4jRN+Ytle+J2Oufudc69c64/OE977bX/65y791577RvUQYCGpHMlzZE0XdK02DQo6TdJX0v6NoRwtFNjhnYdAPMk3STpWkl9kiYmugxJ2iLpY0lrQghbVTfAFOAh4Eva5wtgBTC5DuEnAo8Av9B59gEPAxPGSvxCYCdjzw7gmk4KPwF4AviT+jgKPGNjtyv+JGAt3eM901BV/DTgM7rPRtNSVvwE4EOOHz4Bcpdn23jyWC3peh0/LJS0ymUJ3NfiTbwBrAT6x2DSbgSeB95vYbc8JX4OMNTCwTkZ25UJ+xSHgKcyfvta2B8Bzi9MJYB1khYXxLczhHBRTtDnSXpB0qWS+uOzS9KB+NgYp8THBp8Xnw2SHggh7M34s6VzX7TPY20IwVKX/wlZknhbH6gmgG0JLdflTeJHHUlYXQwl2v+rFZjv+L1aBlkLwHcOPVc0f4G7HH4vsSy0BvFnS5rpML27OdexTDDF20CoIYBxceNK8dOxA5R9CofxfsBOWLUA9MQlM8VljbjLpXguhGBHwloIIeyW9KLDdFEjrt8pXlf9vOaw6bUALkwYDYQQvlH99Es6mLCZawH8u40X8IO6QPincrEnYTbLApiaMDqk7jGYaJ9qAaROPDPUPWYk2idbACMJo9PUPU5PtA9bAIcTRme2fbiuAGA/7dRR8nDDMUktfZiv+lnkqBx+bwF4lsglqp/FDpsBC+Bzh+E9lcsbFQDsMHOHw7TfAtjkMOyRtEL18Zhz9ds8WkIZdCROw4Dns7YFcAsw4tBzEBg/2ulVfFigN4yh+GXA704tq5s7XllgdKSgBLIKmNVB4XOBNylHX9bJloyBFXQDcDnwUY4DK/a+A9wLXBBvZ7yCxwO9wIPRt72UMmzOc3pnzm/+/tjWAF5KOLWvdbVD/G3O33grluU5bsTqWJbHm95aq4rcWyW+QN44Xj4tPNoCdnD/I9PBPu+Cpmrc3gLHS0sEsJxqDAMXp5w/3aqoZWVAWwGAA7Ftd5zUJ5cIwOZVFZ70VgXW5XS+yivQMcbMCuLXuJPKeLmxPePA7sdS6a3X/1klxW8tXZOydR4YyDjaBdzcbnptxasS4r+Kxa5cWqarwBmS3pV0bBI38aMku6D+OVaRbVNbEEJIHY5G/fY4z9rrJd0aQtjv8Vs02CTnLjmxw3PgFbuXriw8Z9DbYzmviEklfNlKVsQewFOrrRTEqcDLwF85A08pOb+yjMQbn3I3klUAZgPPNu0FlqWOK9F/etyUAH6Nwu1fLvVif9CIq1Jvhb62md1YZu7k8TdELa/qDQ3FmQAAAABJRU5ErkJggg==',
      color: '#333333'
    });
  }

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
      color: #333333;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .email-content {
      padding: 40px 30px;
      line-height: 1.6;
      font-size: 16px;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 40px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      text-align: center;
    }
    .social-section {
      background-color: #2a2a2a;
      padding: 30px;
      text-align: center;
    }
    .social-icons {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin: 20px 0;
    }
    .social-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      font-size: 24px;
      transition: transform 0.2s;
    }
    .social-icon:hover {
      transform: scale(1.1);
    }
    .company-info {
      background-color: #1a1a1a;
      color: #999999;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      line-height: 1.8;
    }
    .company-name {
      color: #ffffff;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 10px;
    }
    .footer-links {
      margin-top: 20px;
    }
    .footer-links a {
      color: #667eea;
      text-decoration: none;
      margin: 0 10px;
    }
    .footer-links a:hover {
      text-decoration: underline;
    }
    @media only screen and (max-width: 600px) {
      .email-content {
        padding: 30px 20px;
      }
      .social-section, .company-info {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Ana İçerik -->
    <div class="email-content">
      ${content}
    </div>

    ${activeSocialLinks.length > 0 ? `
    <!-- Sosyal Medya Bölümü -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa; padding: 30px 0;">
      <tr>
        <td align="center">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              ${activeSocialLinks.map(link => `
                <td align="center" valign="middle" style="padding: 0 8px;">
                  <table cellpadding="0" cellspacing="0" border="0" role="presentation">
                    <tr>
                      <td
                        align="center"
                        valign="middle"
                        width="44"
                        height="44"
                        style="width: 44px; height: 44px; border-radius: 22px; background-color: ${link.color}; text-align: center; vertical-align: middle;"
                      >
                        <a
                          href="${link.url}"
                          title="${link.platform}"
                          style="display: block; width: 44px; height: 44px; text-decoration: none; line-height: 44px;"
                        >
                          <img
                            src="${link.icon}"
                            alt="${link.platform}"
                            width="20"
                            height="20"
                            style="display: block; width: 20px; height: 20px; margin: 12px auto; border: 0; outline: none; text-decoration: none;"
                          />
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              `).join('')}
            </tr>
          </table>
        </td>
      </tr>
    </table>
    ` : ''}

    <!-- Şirket Bilgileri ve Footer -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 30px 0;">
      <tr>
        <td align="center" style="padding: 0 20px;">
          ${companyName ? `
            <div style="font-size: 20px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
              ${companyName}
            </div>
          ` : ''}
          ${companyAddress ? `
            <div style="color: #666666; font-size: 14px; margin-bottom: 15px;">
              ${companyAddress}
            </div>
          ` : ''}
          
          <div style="margin-top: 20px; color: #888888; font-size: 13px;">
            Bu e-postayı <strong>${unsubscribeUrl ? 'haber bültenimize abone olduğunuz' : 'tarafımızdan gönderildiği'}</strong> için aldınız.
          </div>

          ${(viewInBrowserUrl || unsubscribeUrl) ? `
            <div style="margin-top: 15px; font-size: 13px;">
              ${viewInBrowserUrl ? `<a href="${viewInBrowserUrl}" style="color: #667eea; text-decoration: none;">Tarayıcıda Görüntüle</a>` : ''}
              ${viewInBrowserUrl && unsubscribeUrl ? ' <span style="color: #cccccc;">|</span> ' : ''}
              ${unsubscribeUrl ? `<a href="${unsubscribeUrl}" style="color: #667eea; text-decoration: none;">Abonelikten Çık</a>` : ''}
            </div>
          ` : ''}
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
  `.trim();
}

// Basit text içeriğini HTML'e çevirme yardımcı fonksiyonu
export function textToHTML(text: string): string {
  return text
    .split('\n\n')
    .map(paragraph => {
      let processed = paragraph
        .replace(/\n/g, '<br>')
        // Butonları işle (HTML buton)
        .replace(/<a href="([^"]+)" class="cta-button"[^>]*>([^<]+)<\/a>/g, '<div style="text-align: center; margin: 20px 0;"><a href="$1" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; transition: all 0.3s;">$2</a></div>')
        // Görselleri işle
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<div style="text-align: center; margin: 20px 0;"><img src="$2" alt="$1" style="max-width: 100%; height: auto; border-radius: 8px;"></div>')
        // Linkleri işle (gömülü link)
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #667eea; text-decoration: none; font-weight: 500;">$1</a>')
        // Kalın yazı
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // İtalik yazı (tek yıldız, ama kalın olmayan)
        .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
      
      return `<p style="margin: 0 0 16px 0;">${processed}</p>`
    })
    .join('');
}
