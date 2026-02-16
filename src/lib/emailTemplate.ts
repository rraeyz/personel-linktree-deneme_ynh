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

  // Sosyal medya linklerini filtrele ve formatla (Base64 embedded SVG)
  const activeSocialLinks: SocialLink[] = [];
  
  if (socialLinks.linkedin) {
    activeSocialLinks.push({
      platform: 'LinkedIn',
      url: socialLinks.linkedin,
      icon: 'data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmaWxsPSIjZmZmZmZmIj48cGF0aCBkPSJNMjAuNDQ3IDIwLjQ1MmgtMy41NTR2LTUuNTY5YzAtMS4zMjgtLjAyNy0zLjAzNy0xLjg1Mi0zLjAzNy0xLjg1MyAwLTIuMTM2IDEuNDQ1LTIuMTM2IDIuOTM5djUuNjY3SDkuMzUxVjloMy40MTR2MS41NjFoLjA0NmMuNDc3LS45IDEuNjM3LTEuODUgMy4zNy0xLjg1IDMuNjAxIDAgNC4yNjcgMi4zNyA0LjI2NyA1LjQ1NXY2LjI4NnpNNS4zMzcgNy40MzNjLTEuMTQ0IDAtMi4wNjMtLjkyNi0yLjA2My0yLjA2NSAwLTEuMTM4LjkyLTIuMDYzIDIuMDYzLTIuMDYzIDEuMTQgMCAyLjA2NC45MjUgMi4wNjQgMi4wNjMgMCAxLjEzOS0uOTI1IDIuMDY1LTIuMDY0IDIuMDY1em0xLjc4MiAxMy4wMTlIMy41NTVWOWgzLjU2NHYxMS40NTJ6TTIyLjIyNSAwSDEuNzcxQy43OTIgMCAwIC43NzQgMCAxLjcyOXYyMC41NDJDMCAyMy4yMjcuNzkyIDI0IDEuNzcxIDI0aDIwLjQ1MUMyMy4yIDI0IDI0IDIzLjIyNyAyNCAyMi4yNzFWMS43MjlDMjQgLjc3NCAyMy4yIDAgMjIuMjIyIDBoLjAwM3oiLz48L3N2Zz4=',
      color: '#0A66C2'
    });
  }
  
  if (socialLinks.twitter) {
    activeSocialLinks.push({
      platform: 'X (Twitter)',
      url: socialLinks.twitter,
      icon: 'data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmaWxsPSIjZmZmZmZmIj48cGF0aCBkPSJNMTguMjQ0IDIuMjVoMy4zMDhsLTcuMjI3IDguMjYgOC41MDIgMTEuMjRIMTYuMTdsLTUuMjE0LTYuODE3TDQuOTkgMjEuNzVIMS42OGw3LjczLTguODM1TDEuMjU0IDIuMjVIOC4wOGw0LjcxMyA2LjIzMXptLTEuMTYxIDE3LjUyaDEuODMzTDcuMDg0IDQuMTI2SDUuMTE3eiIvPjwvc3ZnPg==',
      color: '#000000'
    });
  }
  
  if (socialLinks.discord) {
    activeSocialLinks.push({
      platform: 'Discord',
      url: socialLinks.discord,
      icon: 'data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmaWxsPSIjZmZmZmZmIj48cGF0aCBkPSJNMjAuMzE3IDQuMzdhMTkuNzkxIDE5Ljc5MSAwIDAgMC00Ljg4NS0xLjUxNS4wNzQuMDc0IDAgMCAwLS4wNzkuMDM3Yy0uMjEuMzc1LS40NDQuODY0LS42MDggMS4yNWExOC4yNyAxOC4yNyAwIDAgMC01LjQ4NyAwIDEyLjY0IDEyLjY0IDAgMCAwLS42MTctMS4yNS4wNzcuMDc3IDAgMCAwLS4wNzktLjAzN0ExOS43MzYgMTkuNzM2IDAgMCAwIDMuNjc3IDQuMzdhLjA3LjA3IDAgMCAwLS4wMzIuMDI3Qy41MzMgOS4wNDYtLjMyIDEzLjU4LjA5OSAxOC4wNTdhLjA4Mi4wODIgMCAwIDAgLjAzMS4wNTcgMTkuOSAxOS45IDAgMCAwIDUuOTkzIDMuMDMuMDc4LjA3OCAwIDAgMCAuMDg0LS4wMjggMTQuMDkgMTQuMDkgMCAwIDAgMS4yMjYtMS45OTQuMDc2LjA3NiAwIDAgMC0uMDQxLS4xMDYgMTMuMTA3IDEzLjEwNyAwIDAgMS0xLjg3Mi0uODkyLjA3Ny4wNzcgMCAwIDEtLjAwOC0uMTI4IDEwLjIgMTAuMiAwIDAgMCAuMzcyLS4yOTIuMDc0LjA3NCAwIDAgMSAuMDc3LS4wMWMzLjkyOCAxLjc5MyA4LjE4IDEuNzkzIDEyLjA2MiAwYS4wNzQuMDc0IDAgMCAxIC4wNzguMDFjLjEyLjA5OC4yNDYuMTk4LjM3My4yOTJhLjA3Ny4wNzcgMCAwIDEtLjAwNi4xMjcgMTIuMjk5IDEyLjI5OSAwIDAgMS0xLjg3My44OTIuMDc3LjA3NyAwIDAgMC0uMDQxLjEwN2MuMzYuNjk4Ljc3MiAxLjM2MiAxLjIyNSAxLjk5M2EuMDc2LjA3NiAwIDAgMCAuMDg0LjAyOCAxOS44MzkgMTkuODM5IDAgMCAwIDYuMDAyLTMuMDNhLjA3Ny4wNzcgMCAwIDAgLjAzMi0uMDU0Yy41LTUuMTc3LS44MzgtOS42NzQtMy41NDktMTMuNjZhLjA2MS4wNjEgMCAwIDAtLjAzMS0uMDN6TTguMDIgMTUuMzNjLTEuMTgzIDAtMi4xNTctMS4wODUtMi4xNTctMi40MTkgMC0xLjMzMy45NTYtMi40MTkgMi4xNTctMi40MTkgMS4yMSAwIDIuMTc2IDEuMDk2IDIuMTU3IDIuNDIgMCAxLjMzMy0uOTU2IDIuNDE4LTIuMTU3IDIuNDE4em03Ljk3NSAwYy0xLjE4MyAwLTIuMTU3LTEuMDg1LTIuMTU3LTIuNDE5IDAtMS4zMzMuOTU1LTIuNDE5IDIuMTU3LTIuNDE5IDEuMjEgMCAyLjE3NiAxLjA5NiAyLjE1NyAyLjQyIDAgMS4zMzMtLjk0NiAyLjQxOC0yLjE1NyAyLjQxOHoiLz48L3N2Zz4=',
      color: '#5865F2'
    });
  }
  
  if (socialLinks.youtube) {
    activeSocialLinks.push({
      platform: 'YouTube',
      url: socialLinks.youtube,
      icon: 'data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmaWxsPSIjZmZmZmZmIj48cGF0aCBkPSJNMjMuNDk4IDYuMTg2YTMuMDE2IDMuMDE2IDAgMCAwLTIuMTIyLTIuMTM2QzE5LjUwNSAzLjU0NSAxMiAzLjU0NSAxMiAzLjU0NXMtNy41MDUgMC05LjM3Ny41MDVBMS4wMTcgMS4wMTcgMCAwIDAgLjUwMiA2LjE4NkMwIDguMDcgMCAxMiAwIDEyczAgMy45My41MDIgNS44MTRhMy4wMTYgMy4wMTYgMCAwIDAgMi4xMjIgMi4xMzZjMS44NzEuNTA1IDkuMzc2LjUwNSA5LjM3Ni41MDVzNy41MDUgMCA5LjM3Ny0uNTA1YTMuMDE1IDMuMDE1IDAgMCAwIDIuMTIyLTIuMTM2QzI0IDE1LjkzIDI0IDEyIDI0IDEyczAtMy45My0uNTAyLTUuODE0ek05LjU0NSAxNS41NjhWOC40MzJMMTUuODE4IDEybC02LjI3MyAzLjU2OHoiLz48L3N2Zz4=',
      color: '#FF0000'
    });
  }
  
  if (socialLinks.instagram) {
    activeSocialLinks.push({
      platform: 'Instagram',
      url: socialLinks.instagram,
      icon: 'data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmaWxsPSIjZmZmZmZmIj48cGF0aCBkPSJNMTIgMEM4Ljc0IDAgOC4zMzMuMDE1IDcuMDUzLjA3MiA1Ljc3NS4xMzIgNC45MDUuMzMzIDQuMTQuNjNjLS43ODkuMzA2LTEuNDU5LjcxNy0yLjEyNiAxLjM4NFMuOTM1IDMuMzUuNjMgNC4xNEMuMzMzIDQuOTA1LjEzMSA1Ljc3NS4wNzIgNy4wNTMuMDEyIDguMzMzIDAgOC43NCAwIDEyczAgMy42NjcuMDcyIDQuOTQ3Yy4wNiAxLjI3Ny4yNjEgMi4xNDguNTU4IDIuOTEzLjMwNi43ODguNzE3IDEuNDU5IDEuMzg0IDIuMTI2LjY2Ny42NjYgMS4zMzYgMS4wNzkgMi4xMjYgMS4zODQuNzY2LjI5NiAxLjYzNi40OTkgMi45MTMuNTU4QzguMzMzIDIzLjk4OCA4Ljc0IDI0IDEyIDI0czMuNjY3LS4wMTUgNC45NDctLjA3MmMxLjI3Ny0uMDYgMi4xNDgtLjI2MiAyLjkxMy0uNTU4Ljc4OC0uMzA2IDEuNDU5LS43MTggMi4xMjYtMS4zODQuNjY2LS42NjcgMS4wNzktMS4zMzUgMS4zODQtMi4xMjYuMjk2LS43NjUuNDk5LTEuNjM2LjU1OC0yLjkxMy4wNi0xLjI4LjA3Mi0xLjY4Ny4wNzItNC45NDdzLS4wMTUtMy42NjctLjA3Mi00Ljk0N2MtLjA2LTEuMjc3LS4yNjItMi4xNDktLjU1OC0yLjkxMy0uMzA2LS43ODktLjcxOC0xLjQ1OS0xLjM4NC0yLjEyNkMyMS4zMTkgMS4zNDcgMjAuNjUxLjkzNSAxOS44Ni42M2MtLjc2NS0uMjk3LTEuNjM2LS40OTktMi45MTMtLjU1OEMxNS42NjcuMDEyIDE1LjI2IDAgMTIgMHptMCAyLjE2YzMuMjAzIDAgMy41ODUuMDE2IDQuODUuMDcxIDEuMTcuMDU1IDEuODA1LjI0OSAyLjIyNy40MTUuNTYyLjIxNy45Ni40NzcgMS4zODIuODk2LjQxOS40Mi42NzkuODE5Ljg5NiAxLjM4MS4xNjQuNDIyLjM2IDEuMDU3LjQxMyAyLjIyNy4wNTcgMS4yNjYuMDcgMS42NDYuMDcgNC44NXMtLjAxNSAzLjU4NS0uMDc0IDQuODVjLS4wNjEgMS4xNy0uMjU2IDEuODA1LS40MjEgMi4yMjctLjIyNC41NjItLjQ3OS45Ni0uODk5IDEuMzgyLS40MTkuNDE5LS44MjQuNjc5LTEuMzguODk2LS40Mi4xNjQtMS4wNjUuMzYtMi4yMzUuNDEzLTEuMjc0LjA1Ny0xLjY0OS4wNy00Ljg1OS4wNy0zLjIxMSAwLTMuNTg2LS4wMTUtNC44NTktLjA3NC0xLjE3MS0uMDYxLTEuODE2LS4yNTYtMi4yMzYtLjQyMS0uNTY5LS4yMjQtLjk2LS40NzktMS4zNzktLjg5OS0uNDIxLS40MTktLjY5LS44MjQtLjktMS4zOC0uMTY1LS40Mi0uMzU5LTEuMDY1LS40Mi0yLjIzNS0uMDQ1LTEuMjYtLjA2MS0xLjY0OS0uMDYxLTQuODQ0IDAtMy4xOTYuMDE2LTMuNTg2LjA2MS00Ljg2MS4wNjEtMS4xNy4yNTUtMS44MTQuNDItMi4yMzQuMjEtLjU3LjQ3OS0uOTYuOS0xLjM4MS40MTktLjQxOS44MS0uNjg5IDEuMzc5LS44OTguNDItLjE2NiAxLjA1MS0uMzYxIDIuMjIxLS40MjEgMS4yNzUtLjA0NSAxLjY1LS4wNiA0Ljg1OS0uMDZsLjA0NS4wM3ptMCAzLjY3OGMtMy40MDUgMC02LjE2MiAyLjc2LTYuMTYyIDYuMTYyIDAgMy40MDUgMi43NiA2LjE2MiA2LjE2MiA2LjE2MiAzLjQwNSAwIDYuMTYyLTIuNzYgNi4xNjItNi4xNjIgMC0zLjQwNS0yLjc2LTYuMTYyLTYuMTYyLTYuMTYyek0xMiAxNmMtMi4yMSAwLTQtMS43OS00LTRzMS43OS00IDQtNCA0IDEuNzkgNCA0LTEuNzkgNC00IDR6bTcuODQ2LTEwLjQwNWMwIC43OTUtLjY0NiAxLjQ0LTEuNDQgMS40NC0uNzk1IDAtMS40NC0uNjQ2LTEuNDQtMS40NCAwLS43OTQuNjQ2LTEuNDM5IDEuNDQtMS40MzkuNzkzLS4wMDEgMS40NC42NDUgMS40NCAxLjQzOXoiLz48L3N2Zz4=',
      color: '#E4405F'
    });
  }
  
  if (socialLinks.github) {
    activeSocialLinks.push({
      platform: 'GitHub',
      url: socialLinks.github,
      icon: 'data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmaWxsPSIjZmZmZmZmIj48cGF0aCBkPSJNMTIgLjI5N2MtNi42MyAwLTEyIDUuMzczLTEyIDEyIDAgNS4zMDMgMy40MzggOS44IDguMjA1IDExLjM4NS42LjExMy44Mi0uMjU4LjgyLS41NzcgMC0uMjg1LS4wMS0xLjA0LS4wMTUtMi4wNC0zLjMzOC43MjQtNC4wNDItMS42MS00LjA0Mi0xLjYxQzQuNDIyIDE4LjA3IDMuNjMzIDE3LjcgMy42MzMgMTcuN2MtMS4wODctLjc0NC4wODQtLjcyOS4wODQtLjcyOSAxLjIwNS4wODQgMS44MzggMS4yMzYgMS44MzggMS4yMzYgMS4wNyAxLjgzNSAyLjgwOSAxLjMwNSAzLjQ5NS45OTguMTA4LS43NzYuNDE3LTEuMzA1Ljc2LTEuNjA1LTIuNjY1LS4zLTUuNDY2LTEuMzMyLTUuNDY2LTUuOTMgMC0xLjMxLjQ2NS0yLjM4IDEuMjM1LTMuMjItLjEzNS0uMzAzLS41NC0xLjUyMy4xMDUtMy4xNzYgMCAwIDEuMDA1LS4zMjIgMy4zIDEuMjMuOTYtLjI2NyAxLjk4LS4zOTkgMy0uNDA1IDEuMDIuMDA2IDIuMDQuMTM4IDMgLjQwNSAyLjI4LTEuNTUyIDMuMjg1LTEuMjMgMy4yODUtMS4yMy42NDUgMS42NTMuMjQgMi44NzMuMTIgMy4xNzYuNzY1Ljg0IDEuMjMgMS45MSAxLjIzIDMuMjIgMCA0LjYxLTIuODA1IDUuNjI1LTUuNDc1IDUuOTIuNDIuMzYuODEgMS4wOTYuODEgMi4yMiAwIDEuNjA2LS4wMTUgMi44OTYtLjAxNSAzLjI4NiAwIC4zMTUuMjEuNjkuODI1LjU3QzIwLjU2NSAyMi4wOTIgMjQgMTcuNTkyIDI0IDEyLjI5N2MwLTYuNjI3LTUuMzczLTEyLTEyLTEyIi8+PC9zdmc+',
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
                <td style="padding: 0 8px;">
                  <a href="${link.url}" style="display: inline-block; width: 44px; height: 44px; text-align: center; border-radius: 50%; background-color: ${link.color}; text-decoration: none; padding: 10px;" title="${link.platform}">
                    <img src="${link.icon}" alt="${link.platform}" width="24" height="24" style="display: block; margin: 0 auto;" />
                  </a>
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
