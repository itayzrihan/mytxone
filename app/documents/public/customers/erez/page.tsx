"use client";

import Link from "next/link";

export default function ErezDocumentPage() {
  return (
    <div className="min-h-screen" dir="rtl">
      <style jsx global>{`
        /* Base Styles */
        body {
          font-family: sans-serif;
        }
        .wrap {
          max-width: 1100px;
          margin: 32px auto 96px;
          padding: 0 20px;
          background: radial-gradient(1200px 600px at 70% -10%, rgba(34,211,238,.12), transparent 60%),
                      radial-gradient(900px 500px at 10% 10%, rgba(56,189,248,.10), transparent 55%),
                      #0f172a;
          min-height: 100vh;
        }

        .report-header {
          background: linear-gradient(135deg, rgba(34,211,238,.10), rgba(56,189,248,.08));
          border: 1px solid #1f2937;
          border-radius: 18px;
          padding: 28px 24px;
          box-shadow: 0 8px 30px rgba(0,0,0,.35);
          position: relative;
          overflow: hidden;
        }

        .meta {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12px;
          align-items: start;
        }

        .title {
          margin: 0;
          font-size: clamp(24px, 4.2vw, 38px);
          line-height: 1.15;
          letter-spacing: 0.2px;
          color: #e5e7eb;
        }

        .subtitle {
          margin: 6px 0 0;
          color: #94a3b8;
          font-size: 16px;
        }

        .chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #0b2942;
          border: 1px solid #1d3a58;
          color: #b9e6ff;
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 13px;
          white-space: nowrap;
        }

        .grid {
          display: grid;
          gap: 16px;
          margin-top: 18px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .fact {
          background: #0a1226;
          border: 1px solid #1f2937;
          padding: 12px 14px;
          border-radius: 10px;
          color: #dbeafe;
          font-size: 14px;
        }

        .toc {
          margin-top: 20px;
          background: #0c142d;
          border: 1px solid #1f2937;
          border-radius: 14px;
          padding: 14px 16px;
        }

        .toc-title {
          font-weight: 700;
          margin: 0 0 8px;
          color: #c7d2fe;
        }

        .toc ol {
          margin: 0;
          padding-inline-start: 20px;
        }

        .toc li {
          padding: 4px 0;
        }

        .toc a {
          color: #7dd3fc;
          text-decoration: none;
        }

        .toc a:hover {
          text-decoration: underline;
        }

        section {
          margin-top: 26px;
          background: #111827;
          border: 1px solid #1f2937;
          border-radius: 18px;
          box-shadow: 0 8px 30px rgba(0,0,0,.35);
          overflow: hidden;
        }

        .sec-header {
          padding: 18px 18px 10px;
          background: linear-gradient(180deg, rgba(148,163,184,.15), transparent);
          border-bottom: 1px solid #1f2937;
        }

        .sec-header h2 {
          margin: 0;
          font-size: clamp(18px, 2.6vw, 22px);
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          color: #e5e7eb;
        }

        .sev {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 13px;
          padding: 6px 10px;
          border-radius: 999px;
        }

        .sev.crit {
          background: rgba(239,68,68,.12);
          border: 1px solid rgba(239,68,68,.35);
          color: #fecaca;
        }

        .sev.high {
          background: rgba(245,158,11,.12);
          border: 1px solid rgba(245,158,11,.35);
          color: #fde68a;
        }

        .sev.med {
          background: rgba(34,197,94,.12);
          border: 1px solid rgba(34,197,94,.35);
          color: #bbf7d0;
        }

        .sev.low {
          background: rgba(100,116,139,.15);
          border: 1px solid rgba(100,116,139,.35);
          color: #cbd5e1;
        }

        .sec-body {
          padding: 18px;
          display: grid;
          gap: 14px;
        }

        .block {
          background: #0b1229;
          border: 1px solid #1f2937;
          border-radius: 10px;
          padding: 14px;
        }

        .block h3 {
          margin: 0 0 6px;
          font-size: 16px;
          color: #e2e8f0;
        }

        .block p {
          margin: 0;
          color: #c7d2fe;
          line-height: 1.65;
        }

        .items {
          display: grid;
          gap: 10px;
        }

        .item {
          background: #0a1226;
          border: 1px dashed #1d2847;
          border-radius: 12px;
          padding: 12px;
        }

        .item h4 {
          margin: 0 0 6px;
          font-size: 15px;
          color: #e5e7eb;
        }

        .item p {
          margin: 0;
          font-size: 14px;
          color: #cbd5e1;
        }

        .route {
          font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
          background: #07101f;
          border: 1px solid #1b2a4a;
          padding: 6px 8px;
          border-radius: 8px;
          display: inline-block;
          color: #a5b4fc;
          font-size: 13px;
          direction: ltr;
        }

        .legend {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }

        .checklist {
          display: grid;
          gap: 10px;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .checklist li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 12px;
          background: #0a162f;
          border: 1px solid #1f2937;
          border-radius: 10px;
        }

        .checkmark {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          border: 2px solid #1e3a8a;
          flex: 0 0 18px;
          display: inline-block;
          margin-top: 2px;
          background: linear-gradient(180deg, #0b1a34, #0e2347);
        }

        .note {
          font-size: 13px;
          color: #93c5fd;
        }

        .spacer {
          height: 10px;
        }

        footer {
          margin-top: 28px;
          color: #94a3b8;
          font-size: 13px;
          text-align: center;
          padding-bottom: 40px;
        }

        footer a {
          color: #7dd3fc;
          text-decoration: none;
        }

        footer a:hover {
          text-decoration: underline;
        }

        @media (max-width: 800px) {
          .grid {
            grid-template-columns: 1fr;
          }
          .meta {
            grid-template-columns: 1fr;
          }
        }

        .navbar-container {
          display: none !important;
        }

        section[aria-label="Notifications alt+T"] {
          display: none !important;
        }
      `}</style>

      <div className="wrap">
        {/* Header */}
        <header className="report-header" id="top" style={{ display: 'none' }}>
          <div className="meta">
            <div>
              <h1 className="title">סקירה טכנית מקיפה</h1>
              <p className="subtitle">
                לקוח: <strong>Erez</strong>
              </p>
              <div className="legend" aria-label="מקרא עדיפויות">
                <span className="sev crit">קריטי</span>
                <span className="sev high">גבוה</span>
                <span className="sev med">בינוני</span>
                <span className="sev low">נמוך</span>
              </div>
            </div>
            <span className="chip" title="דו״ח זה מותאם להצגה ולטביעה">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="16" height="16">
                <path
                  d="M7 2v3M17 2v3M3 10h18M4 5h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              עודכן: 23 באוקטובר 2025
            </span>
          </div>

          {/* Quick facts */}
          <div className="grid" role="group" aria-label="נתונים מהירים">
            <div className="fact">
              דוח מפורט של ממצאים והמלצות לשיפור המערכת
            </div>
          </div>

          {/* TOC */}
          <nav className="toc" aria-label="תוכן עניינים">
            <p className="toc-title">סקירה לפי סדר המקור</p>
            <ol>
              <li>
                <a href="#auth-mobile-admin">ביטול התחברות נפרדת למובייל / ניהול</a>
              </li>
              <li>
                <a href="#conditional-dashboard">רינדור מותנה של כפתור מעבר לדאשבורד הניהולי</a>
              </li>
              <li>
                <a href="#persistent-login">המשתמש לא נשאר מחובר למערכת באופן עקבי לוודא חיבור מאובטח עם טוקן</a>
              </li>
              <li>
                <a href="#profile-icons">להחליף את האייקון פרופיל בראש העמוד זה מבלבל שיש שניים כאלו שמתנהגים שונה, אחד מוביל לעמוד הפרופיל והשני פותח דרופדאון</a>
              </li>
              <li>
                <a href="#rate-limit">רייט לימיט כבר בפיילוט - מומלץ על כל האפליקציה ובעיקר למשתמשים שאינם מחוברים. מומלץ להוסיף שכבת הגנה משלימה: middleware, פרוקסי, או שימוש ב-Edge Functions + Redis לשמירה על ספירה/נעילה.</a>
              </li>
              <li>
                <a href="#supabase-rls">אין לי גישה לDB אך אני ממליץ מאוד לוודא: Row Level Security של supabase בהם הפרוייקט משתמש</a>
              </li>
              <li>
                <a href="#responsive">מומלץ מאוד להוסיף תמיכה ברספונסיביות בין גדלי מסכים שונים במיוחד לצד הלקוח</a>
              </li>
              <li>
                <a href="#profile-inline-edit">מומלץ להוסיף תמיכה בעריכת פרטי הפרופיל ישירות בעמוד הפרופיל ללא מעבר לעמוד נפרד</a>
              </li>
              <li>
                <a href="#routing-back">חלק מהrouting לא עובד כראוי - לדוגמה לחיצה על כפתור החזרה לעמוד הקודם לא תמיד מחזירה לעמוד הקודם</a>
              </li>
              <li>
                <a href="#needed-cars-404">לחיצה על כרטיס רכב בעמוד רכבים דרושים מובילה ל404 עמוד לא נמצא</a>
              </li>
              <li>
                <a href="#needed-cars-new">בעמוד רכבים דרושים כפתור לבקשה חדשה לא מעביר לעמוד אחר</a>
              </li>
              <li>
                <a href="#auctions-back-legacy">בעיה קריטית - כאשר נכנסים למכרז תחת - ההצעות שלי ואז לוחצים על כפתור החזרה אחורה, במקום לחזור לעמוד המכרזים מועברים לעמוד אחר לגמרי של רשימת מכירות פומביות . עמוד שכשלעצמו לא מופיע בfooter או בתפריט הניווט. ככל הנראה מדובר בעמוד ישן שפותח ולא הוסר כראוי. (אם אני טועה ומדובר בעמוד רצוי האם לעצב אותו?)</a>
              </li>
              <li>
                <a href="#requests-back-mismatch">כנ&quot;ל לגבי עמוד כל הבקשות - כאשר נכנסים לאחד הכרטיסים ולוחצים חזרה לעמוד הקודם במקום לחזור לעמוד &quot;כל הבקשות&quot; מועברים לעמוד רכבים דרושים - עמוד שאין שום דרך להגיע אליו בניווט הרשמי של האתר.</a>
              </li>
              <li>
                <a href="#inclusive-language">רוב הפניות הן בלשון זכר כמו &quot;צור&quot; מומלץ להתאים גם לנשים ולהשתמש בביטויים כמו &quot;יצירה&quot; /&quot;ליצור&quot;</a>
              </li>
              <li>
                <a href="#admin-mobile">התאמת עמוד הadmin desktop גם למובייל לנוחות הadmin</a>
              </li>
              <li>
                <a href="#rtl-support">תמיכה שלמה בRTL בכל העמודים - ישנם עמודים בהם האלמנטים לא מיושרים לימין וישנם עמודים בהם הטקסט מוצג הפוך</a>
              </li>
              <li>
                <a href="#notifications-page">דרישות על מנת להשלים את העיצוב: בעמוד ההתראות כאשר לוחצים על התראה מועברים לעמוד ריק - על מנת להטמיע את העיצוב יש ליצור את העמוד הזה</a>
              </li>
              <li>
                <a href="#hot-sales-placeholders">יש להוסיף פלייסהולדרים למכירות חמות על מנת שניתן יהיה לעצב את הכרטיסים שלהם</a>
              </li>
              <li>
                <a href="#auction-step3">בביצירת מכירה פומבית לא ניתן להמשיך לשלב 3</a>
              </li>
            </ol>
          </nav>
        </header>

        {/* Sections */}
        <section id="auth-mobile-admin">
          <header className="sec-header">
            <h2>
              ביטול התחברות נפרדת למובייל / ניהול <span className="sev high">גבוה</span>
            </h2>
          </header>
          <div className="sec-body">
            <div className="block">
              <h3>המלצה</h3>
              <p>
                איחוד מנגנון ההתחברות (SSO אחוד) לכל המכשירים והתפקידים. שימוש באותו זרם OAuth/OIDC עם
                Scope/Role-based Access Control, ללא כתובות כניסה נפרדות.
              </p>
            </div>
            <ul className="checklist">
              <li>
                <span className="checkmark"></span>
                <div>
                  <strong>פעולה</strong>: הסרת מסכים כפולים והפניה לזרם אימות יחיד.
                </div>
              </li>
              <li>
                <span className="checkmark"></span>
                <div>
                  <strong>תוצר</strong>: UX עקבי והפחתת קושי תחזוקה.
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section id="conditional-dashboard">
          <header className="sec-header">
            <h2>
              רינדור מותנה של כפתור מעבר לדאשבורד הניהולי <span className="sev med">בינוני</span>
            </h2>
          </header>
          <div className="sec-body">
            <div className="block">
              <p>
                או לחלופין להחליף את העמוד הראשי בעמוד ה/mobile וכדי להגיע לעמוד הראשי הנוכחי לגשת ל/admin-login
              </p>
            </div>
            <div className="items">
              <div className="item">
                <h4>ניווט לקוחות בנייד</h4>
                <p className="route">mobile &gt; Root &gt; Customer Login</p>
              </div>
              <div className="item">
                <h4>ניווט מנהלים</h4>
                <p className="route">Root &gt; AdminLogin &gt; AdminDashboard</p>
              </div>
            </div>
          </div>
        </section>

        <section id="persistent-login">
          <header className="sec-header">
            <h2>
              המשתמש לא נשאר מחובר למערכת באופן עקבי לוודא חיבור מאובטח עם טוקן <span className="sev crit">קריטי</span>
            </h2>
          </header>
          <div className="sec-body">
            <div className="block">
              <h3>המלצה</h3>
              <p>
                מעבר ל-<strong>Refresh Token Rotation</strong> עם httpOnly, Secure, SameSite=strict; בדיקת חידוש שקט
                (silent refresh) וריענון לפני פקיעה. שמירת טוקן רק ב-cookie מאובטח ולא ב-localStorage.
              </p>
            </div>
          </div>
        </section>

        <section id="profile-icons">
          <header className="sec-header">
            <h2>
              להחליף את האייקון פרופיל בראש העמוד זה מבלבל שיש שניים כאלו שמתנהגים שונה, אחד מוביל לעמוד הפרופיל והשני פותח דרופדאון <span className="sev med">בינוני</span>
            </h2>
          </header>
          <div className="sec-body">
            <div className="block">
              <h3>בעיה</h3>
              <p>שני אייקונים דומים עם התנהגות שונה (עמוד פרופיל לעומת תפריט נפתח) גורמים לבלבול.</p>
            </div>
            <div className="block">
              <h3>פתרון</h3>
              <p>
                איחוד לאייקון יחיד עם תפריט מסודר הכולל קישורים: פרופיל, הגדרות, התנתקות. הדגשה ויזואלית של
                היעד הראשי.
              </p>
            </div>
          </div>
        </section>

        <section id="rate-limit">
          <header className="sec-header">
            <h2>
              רייט לימיט כבר בפיילוט - מומלץ על כל האפליקציה ובעיקר למשתמשים שאינם מחוברים. מומלץ להוסיף שכבת הגנה משלימה: middleware, פרוקסי, או שימוש ב-Edge Functions + Redis לשמירה על ספירה/נעילה. <span className="sev high">גבוה</span>
            </h2>
          </header>
          <div className="sec-body">
            <div className="items">
              <div className="item">
                <h4>החלה רוחבית</h4>
                <p>Rate Limiting לכל נקודות הקצה, בדגש על משתמשים לא מחוברים.</p>
              </div>
              <div className="item">
                <h4>שכבת הגנה משלימה</h4>
                <p>
                  Middleware/Proxy או Edge Functions עם Redis לספירה/נעילה הדרגתית (Sliding Window + Backoff).
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="supabase-rls">
          <header className="sec-header">
            <h2>
              אין לי גישה לDB אך אני ממליץ מאוד לוודא: Row Level Security של supabase בהם הפרוייקט משתמש <span className="sev crit">קריטי</span>
            </h2>
          </header>
          <div className="sec-body">
            <div className="block">
              <h3>המלצה</h3>
              <p>
                להפעיל RLS לכל הטבלאות הציבוריות; מדיניות מבוססת Owner/Org; בדיקות יחידה למדיניות גישה.
              </p>
            </div>
          </div>
        </section>

        <section id="responsive">
          <header className="sec-header">
            <h2>
              מומלץ מאוד להוסיף תמיכה ברספונסיביות בין גדלי מסכים שונים במיוחד לצד הלקוח <span className="sev high">גבוה</span>
            </h2>
          </header>
          <div className="sec-body">
            <div className="block">
              <h3>מיקוד</h3>
              <p>Grid/Container Queries, בדיקות נגישות, התאמות RTL בנייד וטאבלט לצד Desktop.</p>
            </div>
          </div>
        </section>

        <section id="profile-inline-edit">
          <header className="sec-header">
            <h2>
              מומלץ להוסיף תמיכה בעריכת פרטי הפרופיל ישירות בעמוד הפרופיל ללא מעבר לעמוד נפרד <span className="sev med">בינוני</span>
            </h2>
          </header>
          <div className="sec-body">
            <div className="block">
              <h3>UX מוצע</h3>
              <p>Inline Editing עם שמירה/ביטול, ולידציה מיידית, העלאת אווטאר Drag&amp;Drop.</p>
            </div>
          </div>
        </section>

        <section id="routing-back">
          <header className="sec-header">
            <h2>
              חלק מהrouting לא עובד כראוי - לדוגמה לחיצה על כפתור החזרה לעמוד הקודם לא תמיד מחזירה לעמוד הקודם <span className="sev high">גבוה</span>
            </h2>
          </header>
          <div className="sec-body">
            <div className="block">
              <h3>סיבה נפוצה</h3>
              <p>
                ניווט אימפרטיבי/החלפת היסטוריה ב-push/replace לא עקביים; חוסר שמירה של state הקודם.
              </p>
            </div>
            <div className="block">
              <h3>תיקון</h3>
              <p>
                להעדיף <em>history.back()</em> כאשר יש state, אחרת ניווט fallback נתמך ומוצהר.
              </p>
            </div>
          </div>
        </section>

        <section id="needed-cars-404">
          <header className="sec-header">
            <h2>
              לחיצה על כרטיס רכב בעמוד רכבים דרושים מובילה ל404 עמוד לא נמצא <span className="sev high">גבוה</span>
            </h2>
          </header>
          <div className="sec-body">
            <div className="block">
              <h3>בדיקה</h3>
              <p>וולידציה של פרמטר מזהה (slug/id), נתיב דינמי, והרשאות צפייה.</p>
            </div>
          </div>
        </section>

        <section id="needed-cars-new">
          <header className="sec-header">
            <h2>
              בעמוד רכבים דרושים כפתור לבקשה חדשה לא מעביר לעמוד אחר <span className="sev med">בינוני</span>
            </h2>
          </header>
          <div className="sec-body">
            <div className="block">
              <h3>פעולה</h3>
              <p>חיבור ה-CTA לנתיב היעד, ולידציה לפני ניווט, וטיפול בשגיאה ידידותי.</p>
            </div>
          </div>
        </section>

        <section id="auctions-back-legacy">
          <header className="sec-header">
            <h2>
              בעיה קריטית - כאשר נכנסים למכרז תחת - ההצעות שלי ואז לוחצים על כפתור החזרה אחורה, במקום לחזור לעמוד המכרזים מועברים לעמוד אחר לגמרי של רשימת מכירות פומביות . עמוד שכשלעצמו לא מופיע בfooter או בתפריט הניווט. ככל הנראה מדובר בעמוד ישן שפותח ולא הוסר כראוי. (אם אני טועה ומדובר בעמוד רצוי האם לעצב אותו?) <span className="sev crit">קריטי</span>
            </h2>
          </header>
          <div className="sec-body">
            <div className="block">
              <h3>תיאור</h3>
              <p>
                בנתיב: <em>המכרזים &raquo; ההצעות שלי &raquo; חזרה</em> — הניווט מגיע לעמוד &quot;רשימת מכירות
                פומביות&quot; ישן שאינו מופיע בניווט הרשמי/פוטר.
              </p>
            </div>
            <div className="block">
              <h3>המלצה</h3>
              <p>
                להסיר/לנעל את העמוד הישן או להגדיר Redirect 301/Router Guard. אם העמוד רצוי – יש לעצבו
                ולהכניסו לניווט.
              </p>
            </div>
            <p className="note">שאלה פתוחה (ללקוח): אם העמוד ישן – להסיר; אם נדרש – לאשר עיצוב.</p>
          </div>
        </section>

        <section id="requests-back-mismatch">
          <header className="sec-header">
            <h2>
              כנ&quot;ל לגבי עמוד כל הבקשות - כאשר נכנסים לאחד הכרטיסים ולוחצים חזרה לעמוד הקודם במקום לחזור לעמוד &quot;כל הבקשות&quot; מועברים לעמוד רכבים דרושים - עמוד שאין שום דרך להגיע אליו בניווט הרשמי של האתר. <span className="sev high">גבוה</span>
            </h2>
          </header>
          <div className="sec-body">
            <div className="block">
              <h3>תיקון</h3>
              <p>
                שימור query/state של דף המקור (referrer state) או שימוש ב-breadcrumbs עקביים.
              </p>
            </div>
          </div>
        </section>

        <section id="inclusive-language">
          <header className="sec-header">
            <h2>
              רוב הפניות הן בלשון זכר כמו &quot;צור&quot; מומלץ להתאים גם לנשים ולהשתמש בביטויים כמו &quot;יצירה&quot; /&quot;ליצור&quot; <span className="sev low">נמוך</span>
            </h2>
          </header>
          <div className="sec-body">
            <div className="block">
              <h3>המלצה</h3>
              <p>
                החלפת פעלים בלשון זכר (כמו &quot;צור&quot;) לניסוחים ניטרליים: &quot;יצירה&quot;,
                &quot;ליצור&quot;, או הצגת שתי הצורות היכן שרלוונטי.
              </p>
            </div>
          </div>
        </section>

        <section id="admin-mobile">
          <header className="sec-header">
            <h2>
              התאמת עמוד הadmin desktop גם למובייל לנוחות הadmin <span className="sev med">בינוני</span>
            </h2>
          </header>
          <div className="sec-body">
            <div className="block">
              <h3>יישום</h3>
              <p>
                Layout נוזלי, טבלאות ל-cards, סינון וחיפוש ידידותיים בנייד, פעולות מרוכזות בתפריט
                תחתון/עליון.
              </p>
            </div>
          </div>
        </section>

        <section id="rtl-support">
          <header className="sec-header">
            <h2>
              תמיכה שלמה בRTL בכל העמודים - ישנם עמודים בהם האלמנטים לא מיושרים לימין וישנם עמודים בהם הטקסט מוצג הפוך <span className="sev high">גבוה</span>
            </h2>
          </header>
          <div className="sec-body">
            <div className="block">
              <h3>הערות</h3>
              <p>
                יישור לימין כסטנדרט, היפוך איקונים חיצים היכן שצריך, וודא שהטקסט לא מוצג הפוך. בדיקה ידנית
                בכל מסכי המפתח.
              </p>
            </div>
          </div>
        </section>

        <section id="notifications-page">
          <header className="sec-header">
            <h2>
              דרישות על מנת להשלים את העיצוב: בעמוד ההתראות כאשר לוחצים על התראה מועברים לעמוד ריק - על מנת להטמיע את העיצוב יש ליצור את העמוד הזה <span className="sev high">גבוה</span>
            </h2>
          </header>
          <div className="sec-body">
            <div className="block">
              <h3>מה חסר</h3>
              <p>
                לחיצה על התראה מובילה לעמוד ריק. יש לממש תבנית עמוד יעד (Template) עבור כל סוג התראה.
              </p>
            </div>
          </div>
        </section>

        <section id="hot-sales-placeholders">
          <header className="sec-header">
            <h2>
              יש להוסיף פלייסהולדרים למכירות חמות על מנת שניתן יהיה לעצב את הכרטיסים שלהם <span className="sev med">בינוני</span>
            </h2>
          </header>
          <div className="sec-body">
            <div className="block">
              <h3>מטרה</h3>
              <p>
                לאפשר עיצוב כרטיסי מכירה גם ללא נתונים חיים: שלושה מצבי שלד (loading/empty/error) + דוגמת
                נתונים סטטית.
              </p>
            </div>
          </div>
        </section>

        <section id="auction-step3">
          <header className="sec-header">
            <h2>
              בביצירת מכירה פומבית לא ניתן להמשיך לשלב 3 <span className="sev crit">קריטי</span>
            </h2>
          </header>
          <div className="sec-body">
            <div className="block">
              <h3>בדיקות מוצעות</h3>
              <p>
                ולידציית טופס שלב 2, הרשאות, עמידה בדרישות שדות חובה, וניטור שגיאות ברשת/קונסול. לאפשר
                &quot;שמור כטיוטה&quot;.
              </p>
            </div>
          </div>
        </section>

        <section id="summary">
          <header className="sec-header">
            <h2>סיכום והמלצות פעולה</h2>
          </header>
          <div className="sec-body">
            <div className="items">
              <div className="item">
                <h4>עדיפויות מיידיות (קריטי)</h4>
                <p>
                  RLS ב-Supabase, התמדה מאובטחת של התחברות, תיקון מסלולי ניווט שגויים וחסימת העמוד הישן,
                  תיקון מעבר לשלב 3.
                </p>
              </div>
              <div className="item">
                <h4>גל מהיר (גבוה)</h4>
                <p>
                  Rate limit רוחבי + שכבת הגנה, רספונסיביות, RTL מלא, תיקון 404 וכפתורי ניווט.
                </p>
              </div>
              <div className="item">
                <h4>שיפורים (בינוני/נמוך)</h4>
                <p>
                  Inline edit לפרופיל, אחידות אייקון פרופיל, לשון פנייה שוויונית, פלייסהולדרים ועמודי יעד
                  להתראות.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer>
          <p>
            מסמך זה מיועד להצגה, שיתוף והדפסה. ניתן להעתיק כקובץ יחיד (HTML).{" "}
            <a href="#top">חזרה לראש הדף</a> ·{" "}
            <Link href="/">חזרה לעמוד הראשי</Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
