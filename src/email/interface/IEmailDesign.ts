export function IEmailDesign(userName: string, recoveryKey: number): string {
  return `
      <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
  </head>
  <body style="margin: 0; padding: 0;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0; padding: 0;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="width: 600px;">
          <tr>
            <td style="background-color: #e88b00; border-radius: 20px; padding: 20px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="background-color: #ffffff; border-radius: 20px; padding: 20px; width: 100%; height: 200px;">
                    <span style="font-family: 'Comic Sans MS', 'Arial', sans-serif; color: #E88B00FF; font-size: 60px; position: relative; top: -30px;">
                      Delicias Caseiras Tia nana
                    </span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-family: Arial, sans-serif; font-size: 50px; color: #ffffff; padding: 10px; position: relative; top: -30px; left: -120px;">
                    Olá, ${userName}
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-family: Arial, sans-serif; font-size: 18px; color: #ffffff; padding: 10px;">
                    Use o código abaixo para trocar a senha da sua conta
                  </td>
                </tr>
                <tr>
                <td align="center" style="padding: 20px;">
                  <div style="background-color: #ffffff; border-radius: 20px; width: 300px; height: 100px; text-align: center; font-family: 'Comic Sans MS', 'Comic Sans', cursive; font-size: 30px;">
                    <table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" valign="middle">
                          ${recoveryKey}
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
                </tr>
                <tr>
                  <td align="center" style="font-family: Arial, sans-serif; font-size: 18px; color: #ffffff; padding: 10px;">
                    Se você não solicitou esta troca, por favor ignore esta mensagem.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
 </body>
</html>
    `;
}