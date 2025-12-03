import nodemailer from 'nodemailer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const data = await request.json()
    const isPfleger = data.target_group === 'pfleger'

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    let emailHtml
    let confirmationHtml

    if (isPfleger) {
      // Pfleger-Umfrage E-Mail
      emailHtml = `
        <h2>Neue Pfleger-Umfrage - CareConnect</h2>
        <h3>Zeitstempel: ${new Date(data.timestamp).toLocaleString('de-DE')}</h3>

        <h4>Persönliche Angaben:</h4>
        <ul>
          ${data.full_name ? `<li><strong>Name:</strong> ${data.full_name}</li>` : ''}
          ${data.workplace ? `<li><strong>Arbeitsort:</strong> ${data.workplace}</li>` : ''}
          ${data.phone ? `<li><strong>Telefon:</strong> ${data.phone}</li>` : ''}
          ${data.email ? `<li><strong>E-Mail:</strong> ${data.email}</li>` : ''}
        </ul>

        <h4>Berufliche Informationen:</h4>
        <ul>
          <li><strong>Berufserfahrung:</strong> ${getGermanLabel(data.years_experience, 'experience')}</li>
          <li><strong>Ausbildung:</strong> ${getGermanLabel(data.education_level, 'education')}</li>
          <li><strong>Arbeitsbereich:</strong> ${getGermanLabel(data.work_setting, 'work_setting')}</li>
          <li><strong>Dokumentationszeit:</strong> ${getGermanLabel(data.time_for_documentation, 'documentation_time')}</li>
          <li><strong>Digitale Kompetenz:</strong> ${getGermanLabel(data.app_usage, 'app_usage')}</li>
        </ul>

        <h4>Herausforderungen:</h4>
        <ul>
          ${data.communication_challenges && data.communication_challenges.length > 0 
            ? `<li>${data.communication_challenges.map(c => getGermanLabel(c, 'challenges')).join(', ')}</li>` 
            : '<li>Keine angegeben</li>'}
        </ul>

        <h4>Gewünschte Funktionen:</h4>
        <ul>
          ${data.desired_features && data.desired_features.length > 0 
            ? `<li>${data.desired_features.map(f => getGermanLabel(f, 'features')).join(', ')}</li>` 
            : '<li>Keine angegeben</li>'}
        </ul>

        <h4>App-Interesse:</h4>
        <ul>
          <li>${getGermanLabel(data.app_interest, 'interest')}</li>
        </ul>

        <hr>
        <p><em>Diese E-Mail wurde automatisch von der CareConnect Pfleger-Umfrage gesendet.</em></p>
      `

      if (data.email) {
        confirmationHtml = `
          <h2>Vielen Dank für Ihre Teilnahme!</h2>
          <p>Ihre Antworten zur CareConnect Pfleger-Umfrage wurden erfolgreich übermittelt.</p>

          <h3>Ihre Angaben:</h3>
          <ul>
            <li><strong>Berufserfahrung:</strong> ${getGermanLabel(data.years_experience, 'experience')}</li>
            <li><strong>Ausbildung:</strong> ${getGermanLabel(data.education_level, 'education')}</li>
            <li><strong>Arbeitsbereich:</strong> ${getGermanLabel(data.work_setting, 'work_setting')}</li>
            <li><strong>App-Interesse:</strong> ${getGermanLabel(data.app_interest, 'interest')}</li>
          </ul>

          <p>Wir werden Sie über die Ergebnisse der Umfrage und die Verfügbarkeit von CareConnect informieren.</p>
          <p>Ihre Expertise aus der Praxis ist entscheidend für die Entwicklung einer Lösung, die wirklich funktioniert.</p>

          <hr>
          <p><em>Mit freundlichen Grüßen,<br>Das CareConnect Team</em></p>
        `
      }
    } else {
      // Angehörigen-Umfrage E-Mail (Original)
      emailHtml = `
        <h2>Neue Angehörigen-Umfrage - CareConnect</h2>
        <h3>Zeitstempel: ${new Date(data.timestamp).toLocaleString('de-DE')}</h3>

        <h4>Antworten:</h4>
        <ul>
          <li><strong>Informationsstand:</strong> ${getGermanLabel(data.information_frequency, 'information')}</li>
          <li><strong>Update-Bedürfnis:</strong> ${getGermanLabel(data.update_importance, 'importance')}</li>
          <li><strong>Anruf-Häufigkeit:</strong> ${getGermanLabel(data.calling_frequency, 'calling')}</li>
          <li><strong>Gewünschte Informationen:</strong> ${data.info_types && data.info_types.length > 0 ? data.info_types.join(', ') : 'Keine angegeben'}</li>
          <li><strong>App-Interesse:</strong> ${getGermanLabel(data.app_interest, 'interest')}</li>
        </ul>

        ${data.email ? `<p><strong>E-Mail für Updates:</strong> ${data.email}</p>` : ''}

        <hr>
        <p><em>Diese E-Mail wurde automatisch von der CareConnect Angehörigen-Umfrage gesendet.</em></p>
      `

      if (data.email) {
        confirmationHtml = `
          <h2>Vielen Dank für Ihre Teilnahme!</h2>
          <p>Ihre Antworten zur CareConnect-Umfrage wurden erfolgreich übermittelt.</p>

          <h3>Ihre Antworten:</h3>
          <ul>
            <li><strong>Informationsstand:</strong> ${getGermanLabel(data.information_frequency, 'information')}</li>
            <li><strong>Update-Bedürfnis:</strong> ${getGermanLabel(data.update_importance, 'importance')}</li>
            <li><strong>Anruf-Häufigkeit:</strong> ${getGermanLabel(data.calling_frequency, 'calling')}</li>
            <li><strong>Gewünschte Informationen:</strong> ${data.info_types && data.info_types.length > 0 ? data.info_types.join(', ') : 'Keine angegeben'}</li>
            <li><strong>App-Interesse:</strong> ${getGermanLabel(data.app_interest, 'interest')}</li>
          </ul>

          <p>Wir werden Sie über die Ergebnisse der Umfrage und die Verfügbarkeit von CareConnect informieren.</p>

          <hr>
          <p><em>Mit freundlichen Grüßen,<br>Das CareConnect Team</em></p>
        `
      }
    }

    const subjectPrefix = isPfleger ? 'Pfleger-Umfrage' : 'Angehörigen-Umfrage'
    
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `Neue ${subjectPrefix} - CareConnect (${new Date().toLocaleDateString('de-DE')})`,
      html: emailHtml,
    })

    if (data.email && confirmationHtml) {
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

function getGermanLabel(value, type) {
  const labels = {
    // Angehörigen-Umfrage Labels
    information: {
      sehr_haeufig: 'Sehr häufig informiert',
      haefig: 'Häufig informiert',
      manchmal: 'Manchmal informiert',
      selten: 'Selten informiert',
      nie: 'Nie informiert',
    },
    importance: {
      sehr_wichtig: 'Sehr wichtig',
      wichtig: 'Wichtig',
      neutral: 'Neutral',
      weniger_wichtig: 'Weniger wichtig',
      unwichtig: 'Unwichtig',
    },
    calling: {
      taeglich: 'Täglich oder fast täglich',
      mehrmals_woche: 'Mehrmals pro Woche',
      einmal_woche: 'Einmal pro Woche',
      selten: 'Selten',
      nie: 'Nie',
    },
    interest: {
      definitiv: 'Definitiv',
      wahrscheinlich: 'Wahrscheinlich',
      vielleicht: 'Vielleicht',
      unwahrscheinlich: 'Unwahrscheinlich',
      nein: 'Nein',
    },
    // Pfleger-Umfrage Labels
    experience: {
      unter_1: 'Unter 1 Jahr',
      '1_3': '1-3 Jahre',
      '4_7': '4-7 Jahre',
      '8_15': '8-15 Jahre',
      ueber_15: 'Über 15 Jahre',
    },
    education: {
      pflegehelfer: 'Pflegehelfer/in',
      pflegefachkraft: 'Pflegefachkraft (3-jährige Ausbildung)',
      bachelor: 'Bachelor Pflegewissenschaft/Pflegemanagement',
      master: 'Master oder höher',
      in_ausbildung: 'Aktuell in Ausbildung/Studium',
    },
    work_setting: {
      pflegeheim: 'Pflegeheim/Seniorenresidenz',
      krankenhaus: 'Krankenhaus',
      ambulant: 'Ambulanter Pflegedienst',
      tagespflege: 'Tagespflege',
      sonstiges: 'Sonstiges',
    },
    challenges: {
      zeitaufwand: 'Zu zeitaufwändig',
      unterbrechungen: 'Ständige Unterbrechungen',
      wiederholungen: 'Wiederholte Erklärungen',
      erreichbarkeit: 'Schwierige Erreichbarkeit',
      dokumentation: 'Doppelte Dokumentation',
      keine: 'Keine Herausforderungen',
    },
    documentation_time: {
      unter_30min: 'Unter 30 Minuten',
      '30_60min': '30-60 Minuten',
      '1_2std': '1-2 Stunden',
      ueber_2std: 'Über 2 Stunden',
    },
    app_usage: {
      sehr_sicher: 'Sehr sicher - nutzt täglich verschiedene Apps',
      sicher: 'Sicher - kommt gut zurecht',
      etwas_unsicher: 'Etwas unsicher - braucht manchmal Hilfe',
      unsicher: 'Unsicher - neue Apps sind eine Herausforderung',
    },
    features: {
      schnelle_dokumentation: 'Schnelle Dokumentation',
      automatische_updates: 'Automatische Updates an Angehörige',
      chat_funktion: 'Chat-Funktion',
      spracherkennung: 'Spracherkennung für Notizen',
      medikamentenplan: 'Digitaler Medikamentenplan',
      dienstplanung: 'Dienstplanung & Übergaben',
    },
  }

  return labels[type]?.[value] || value
}

