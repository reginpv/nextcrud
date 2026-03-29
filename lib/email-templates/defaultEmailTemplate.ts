import { APP_NAME } from '@/config/constants'

export function defaultEmailTemplate(content: string): string {
  return `<!doctype html>
  <html lang="en">
    <head>
      <!-- Required meta tags -->
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <style type="text/css">
        body {
          font-family: Arial, Helvetica, sans-serif;
          background: #f4f4f4;
          line-height: 180%;
          font-size: 16px;
          color: #333333;
        }
        .re {
          margin: auto;
          background: #ffffff;
        }
        @media only screen and (max-width: 480px){
          .re,
          .re tbody,
          .re tbody tr {
            margin: auto;
            width: 100%;
            display: block;
          }
          .re__column {
            width:100% !important;
            display: block;
          }
          .re__image{
            height:auto !important;
            max-width:480px !important;
            width:100% !important;
          }
  
          .default,
          .default tbody {
            display: table;
          }
          .default tbody tr {
            margin: auto;
            width: 100%;
            display: table-row;
          }
        }
      </style>
      <title>Climb Reports</title>
    </head>
    <body style="background: #f4f4f4; padding-top: 30px; padding-bottom: 30px; padding-left: 15px; padding-right: 15px; font-size: 16px; color: #333333;">
      <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; border-radius: 20px;" class="re">
        <!-- Content -->
        <tr align="center" valign="top" width="100%" class="re__column">
          <td style="padding-top: 30px;">
            <table border="0" cellpadding="10" cellspacing="0" width="100%" class="default">
              <tr>
                <td align="center">
                  <h3 style="margin: 0; text-transform: uppercase; color: #443636; font-weight: bold;">
                    ${APP_NAME}
                  </h3>
                </td>
              </tr>
            </table>
  
            <table border="0" cellpadding="30" cellspacing="0" width="100%" class="default">
              <tr>
                <td align="left">
                  ${content}
                </td>
              </tr>
            </table>
  
            
          </td>
        </tr>    
        <!-- Footer -->
        <tr>
          <td align="center" valign="top" width="100%" class="re__column" style="padding-bottom: 15px;">
          </td>
        </tr>
      </table>
      <!-- Outside footer-->
      <table cellpadding="0" cellspacing="0" style="margin: 20px auto; text-align: center;">
        <tr>
          <td style="text-align: center; font-size: 14px;">
            <p style="margin:0;">Copyright &copy; ${new Date().getFullYear()} ${APP_NAME}</p>

          </td>
        </tr>
      </table>
    </body>
  </html>`
}
