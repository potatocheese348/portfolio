STUDENT PORTFOLIO WEBSITE
==========================

Technology:
- HTML5
- CSS3
- Vanilla JavaScript
- Google Fonts (optional external font; site otherwise works without a build system)

LOCAL XAMPP DEPLOYMENT
1. Install/start Apache in XAMPP.
2. Copy this entire "student_portfolio" folder to:
   C:\xampp\htdocs\student_portfolio
3. Open:
   http://localhost/student_portfolio/
4. For LAN access, run "ipconfig" on the host PC and note its IPv4 address.
   Example:
   http://192.168.1.10/student_portfolio/
5. If LAN access fails, allow Apache/http traffic through Windows Firewall and ensure
   the host PC and client are on the same network.

INFINITYFREE DEPLOYMENT
1. Create an InfinityFree account and a hosting site/subdomain.
2. Open the site's File Manager or use FTP.
3. Upload the contents of this folder into the hosting site's public web directory
   (commonly public_html; follow the directory shown by your InfinityFree account).
4. Make sure index.html is directly inside the public web directory.
5. Open the assigned domain/subdomain and test every section.

CUSTOMIZATION
- Edit name, biography, email, education and projects in index.html.
- Change colors and layout in css/style.css.
- Add additional functionality in js/script.js.
- The contact form is intentionally frontend-only: it validates input and displays a
  confirmation. It does NOT send email. For real submissions, connect it to a
  server-side PHP endpoint and database/mail service.
