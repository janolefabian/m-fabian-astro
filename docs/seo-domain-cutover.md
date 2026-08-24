# SEO- und Domain-Cutover-Checkliste

Stand: 25. August 2026

Diese Liste beschreibt den Wechsel von der derzeitigen Grav-Seite auf die Astro-Seite. Die drei Build-Werte `SITE_URL`, `BASE_PATH` und `PUBLIC_PREVIEW_NOINDEX` bilden eine Einheit und dürfen beim Domainwechsel nur gemeinsam geändert werden.

## Aktueller sicherer Vorschauzustand

- `SITE_URL=https://janolefabian.github.io`
- `BASE_PATH=/m-fabian-astro/`
- `PUBLIC_PREVIEW_NOINDEX=true`
- Jede HTML-Seite enthält dadurch `noindex, follow`.
- `robots.txt` nennt in der Vorschau keine Sitemap.
- `sitemap.xml` enthält in der Vorschau keine URLs.
- Der Build bricht ab, falls eine GitHub-Pages-URL ohne `PUBLIC_PREVIEW_NOINDEX=true` gebaut wird.
- `npm run verify:preview` prüft diese Bedingungen nach dem Build.

## 1. Inhaltliche Freigabe vor dem Domainwechsel

- [ ] Adresse, Telefon, E-Mail und genaue Praxisbezeichnung von Meike Fabian bestätigt
- [ ] Berufs- und Qualifikationsbezeichnungen bestätigt
- [ ] laufende Tätigkeiten und Angaben mit „seit …“ bestätigt
- [ ] Einzugsgebiet und mögliche Online-/Vor-Ort-Angebote bestätigt
- [ ] alle neuen Leistungsversprechen und „typischen Anlässe“ bestätigt
- [ ] Kundenstimmen und Auslassungen freigegeben
- [ ] AGB in einer rechtlich geprüften, aktuellen Fassung freigegeben
- [ ] Impressum und Datenschutz für das tatsächliche Hosting rechtlich geprüft

Der Arbeitsstand für den Faktenabgleich liegt in `docs/faktenabgleich.md`. Die bisherige Live-Fassung der AGB ist ausschließlich als Review-Quelle in `docs/rechtliches/` gesichert.

## 2. Technische Vorprüfung

- [ ] `npm ci` erfolgreich
- [ ] `npm run build` erfolgreich
- [ ] `npm run verify:production` erfolgreich
- [ ] keine ungewollten Entwürfe oder Testseiten im Build
- [ ] alle internen Links und Downloads geprüft
- [ ] wichtige Seiten auf 320, 390, 768, 1024 und 1440 Pixel Breite geprüft
- [ ] Titel, Beschreibungen, Canonicals, OpenGraph und JSON-LD stichprobenartig geprüft
- [ ] `sitemap.xml` enthält nur freigegebene, indexierbare Seiten
- [ ] `robots.txt` nennt genau die produktive Sitemap

## 3. Domainwechsel als eine Änderung

Im GitHub-Workflow gemeinsam setzen:

```yaml
SITE_URL: https://m-fabian.de
BASE_PATH: /
PUBLIC_PREVIEW_NOINDEX: "false"
```

Danach in derselben geplanten Veröffentlichung:

- [ ] Custom Domain `m-fabian.de` in GitHub Pages hinterlegen
- [ ] DNS-Einträge gemäß den dann angezeigten GitHub-Pages-Vorgaben setzen
- [ ] HTTPS erzwingen, sobald das Zertifikat bereitsteht
- [ ] festlegen, dass `https://m-fabian.de/` die kanonische Variante ist
- [ ] `https://www.m-fabian.de/` dauerhaft auf die kanonische Variante weiterleiten
- [ ] sicherstellen, dass das alte Hosting nicht parallel mit indexierbaren Duplikaten erreichbar bleibt

Keinen isolierten Push ausführen, der nur `PUBLIC_PREVIEW_NOINDEX=false` setzt, solange `SITE_URL` oder `BASE_PATH` noch auf die GitHub-Vorschau zeigen.

## 4. Unmittelbare Prüfung nach dem Umschalten

- [ ] Startseite und alle Hauptseiten antworten über HTTPS
- [ ] Canonicals beginnen ausnahmslos mit `https://m-fabian.de/`
- [ ] normale Inhaltsseiten enthalten `index, follow`
- [ ] ungeprüfte Rechtsseiten und die 404-Seite enthalten weiterhin `noindex`
- [ ] `https://m-fabian.de/robots.txt` nennt `https://m-fabian.de/sitemap.xml`
- [ ] `https://m-fabian.de/sitemap.xml` enthält nur kanonische URLs mit abschließendem Slash
- [ ] `/angebote/burnout-krise/` führt zur Angebotsübersicht und bleibt `noindex`
- [ ] historische URLs aus der alten Website auf korrekte Ziele prüfen
- [ ] OpenGraph-Bilder über ihre vollständigen URLs erreichbar
- [ ] Fachartikel verwendet sein Titelblatt als Social- und Article-Bild
- [ ] JSON-LD auf mehreren Seitentypen valide
- [ ] keine Canonicals oder Assets zeigen mehr auf `github.io`

## 5. Suchmaschinen und lokale Profile

- [ ] Property für `m-fabian.de` in der Google Search Console bestätigt
- [ ] neue Sitemap eingereicht
- [ ] Indexierung der Startseite und zentralen Angebotsseiten angefordert
- [ ] Abdeckung und Weiterleitungen in den ersten Wochen beobachten
- [ ] Google-Unternehmensprofil auf bestätigte Kontaktdaten bringen
- [ ] DGSv- und DGGO-Profil auf dieselben bestätigten Daten bringen
- [ ] persönliche Verbandsprofile erst danach als `sameAs` im Person-Schema ergänzen

## 6. Beobachtung nach Veröffentlichung

- [ ] nach 24 Stunden: Erreichbarkeit, HTTPS, robots.txt und Sitemap erneut prüfen
- [ ] nach 7 Tagen: Search Console auf 404, ausgeschlossene Seiten und Canonical-Abweichungen prüfen
- [ ] nach 30 Tagen: Rankings und lokale Profilkonsistenz prüfen
- [ ] Rechts- und Kontaktdaten bei späteren Änderungen immer gleichzeitig auf Website und Verbandsprofilen aktualisieren

Referenzen: [Google: Website-Umzug mit URL-Änderungen](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes), [Google: Sitemap erstellen und einreichen](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [GitHub: Custom Domain für GitHub Pages](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages).
