import nodemailer from 'nodemailer'

export async function POST(request) {
  try {
    const data = await request.json()
    
    // E-Mail Konfiguration aus Environment Variables
    const transporter = nodemailer.createTransporter({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    // E-Mail Template für Umfrage-Ergebnisse
    const emailHtml = `
      <h2>Neue Umfrage-Antwort - CareConnect</h2>
      <h3>Zeitstempel: ${new Date(data.timestamp).toLocaleString('de-DE')}</h3>
      
      <h4>Antworten:</h4>
      <ul>
        <li><strong>Informationsstand:</strong> ${getGermanLabel(data.information_frequency, 'information')}</li>
        <li><strong>Update-Bedürfnis:</strong> ${getGermanLabel(data.update_importance, 'importance')}</li>
        <li><strong>Anruf-Häufigkeit:</strong> ${getGermanLabel(data.calling_frequency, 'calling')}</li>
        <li><strong>Gewünschte Informationen:</strong> ${data.info_types.join(', ')}</li>
        <li><strong>App-Interesse:</strong> ${getGermanLabel(data.app_interest, 'interest')}</li>
      </ul>
      
      ${data.email ? `<p><strong>E-Mail für Updates:</strong> ${data.email}</p>` : ''}
      
      <hr>
      <p><em>Diese E-Mail wurde automatisch von der CareConnect Umfrage-Seite gesendet.</em></p>
    `

    // E-Mail an Admin senden
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `Neue Umfrage-Antwort - CareConnect (${new Date().toLocaleDateString('de-DE')})`,
      html: emailHtml,
    })

    // Bestätigungs-E-Mail an Teilnehmer senden (falls E-Mail angegeben)
    if (data.email) {
      const confirmationHtml = `
        <h2>Vielen Dank für Ihre Teilnahme!</h2>
        <p>Ihre Antworten zur CareConnect-Umfrage wurden erfolgreich übermittelt.</p>
        
        <h3>Ihre Antworten:</h3>
        <ul>
          <li><strong>Informationsstand:</strong> ${getGermanLabel(data.information_frequency, 'information')}</li>
          <li><strong>Update-Bedürfnis:</strong> ${getGermanLabel(data.update_importance, 'importance')}</li>
          <li><strong>Anruf-Häufigkeit:</strong> ${getGermanLabel(data.calling_frequency, 'calling')}</li>
          <li><strong>Gewünschte Informationen:</strong> ${data.info_types.join(', ')}</li>
          <li><strong>App-Interesse:</strong> ${getGermanLabel(data.app_interest, 'interest')}</li>
        </ul>
        
        <p>Wir werden Sie über die Ergebnisse der Umfrage und die Verfügbarkeit von CareConnect informieren.</p>
        
        <hr>
        <p><em>Mit freundlichen Grüßen,<br>Das CareConnect Team</em></p>
      `

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: data.email,
        subject: 'Vielen Dank für Ihre Teilnahme - CareConnect Umfrage',
        html: confirmationHtml,
      })
    }

    return Response.json({ success: true, message: 'E-Mail erfolgreich gesendet' })
    
  } catch (error) {
    console.error('E-Mail Fehler:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

// Hilfsfunktion für deutsche Labels
function getGermanLabel(value, type) {
  const labels = {
    information: {
      'sehr_haeufig': 'Sehr häufig informiert',
      'haefig': 'Häufig informiert', 
      'manchmal': 'Manchmal informiert',
      'selten': 'Selten informiert',
      'nie': 'Nie informiert'
    },
    importance: {
      'sehr_wichtig': 'Sehr wichtig',
      'wichtig': 'Wichtig',
      'neutral': 'Neutral',
      'weniger_wichtig': 'Weniger wichtig',
      'unwichtig': 'Unwichtig'
    },
    calling: {
      'taeglich': 'Täglich oder fast täglich',
      'mehrmals_woche': 'Mehrmals pro Woche',
      'einmal_woche': 'Einmal pro Woche',
      'selten': 'Selten',
      'nie': 'Nie'
    },
    interest: {
      'definitiv': 'Definitiv',
      'wahrscheinlich': 'Wahrscheinlich',
      'vielleicht': 'Vielleicht',
      'unwahrscheinlich': 'Unwahrscheinlich',
      'nein': 'Nein'
    }
  }
  
  return labels[type]?.[value] || value
}
