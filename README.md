# m-fabian.de – Astro-Relaunch

Statische Website für Meike Fabian auf Basis von Astro, TypeScript, Tailwind CSS und Astro Content Collections.

## Lokale Entwicklung

```sh
npm install
npm run dev
```

Die lokale Website ist anschließend unter [http://localhost:4331](http://localhost:4331) erreichbar. Der Produktions-Build wird mit `npm run build` erzeugt. Danach prüft `npm run verify:production` die wesentlichen SEO- und Indexierungsregeln der Ausgabe.

## Inhalte online pflegen

Die Redaktionsoberfläche liegt unter [app.pagescms.org](https://app.pagescms.org). Nach der Anmeldung mit einem für das Repository freigeschalteten GitHub-Konto kann die Redakteurin sämtliche Startseitentexte und vorhandenen Seiteninhalte bearbeiten sowie neue Unterseiten in den Bereichen „Über mich“, „Angebote“, „Publikationen“ und „Kontakt“ anlegen.

Neue Unterseiten erscheinen automatisch in der horizontalen Unternavigation ihres Bereichs. Die vier Punkte des Hauptmenüs bleiben fest im Code definiert und können durch das CMS nicht verändert werden. Auch Layout, Komponenten, Farben, Bilder, Header und Footer sind im CMS nicht editierbar.

Beim Speichern schreibt Pages CMS die Änderung direkt in das GitHub-Repository. Der Workflow in `.github/workflows/deploy.yml` baut und veröffentlicht die Website danach automatisch neu.

## Veröffentlichung

Der GitHub-Actions-Workflow veröffentlicht derzeit eine nicht indexierbare Vorschau unter dem Repository-Unterpfad. Der Workflow prüft nach jedem Build automatisch, dass wirklich alle Vorschauseiten `noindex` enthalten und die Vorschau-Sitemap leer bleibt.

Beim späteren Wechsel auf die bestehende Domain müssen Domain, Basis-Pfad und Indexfreigabe gemeinsam umgestellt werden:

1. Unter **GitHub → Settings → Pages** als Quelle **GitHub Actions** auswählen.
2. Als Custom Domain die kanonische Domain `m-fabian.de` eintragen, DNS prüfen und HTTPS erzwingen.
3. Im Workflow `SITE_URL` auf `https://m-fabian.de`, `BASE_PATH` auf `/` und `PUBLIC_PREVIEW_NOINDEX` auf `false` setzen beziehungsweise entfernen.
4. Die Weiterleitung von `www.m-fabian.de` auf `m-fabian.de` und die alte URL `/angebote/burnout-krise/` beim Domainwechsel prüfen.
5. Die Pages-CMS-GitHub-App für das Repository freigeben und die Redaktion über [app.pagescms.org](https://app.pagescms.org) anmelden.
6. Impressum und Datenschutz rechtlich sowie redaktionell prüfen. AGB erst nach inhaltlicher Abstimmung und rechtlicher Prüfung veröffentlichen.

Jeder Push auf `main` und jede über Pages CMS gespeicherte Änderung startet automatisch den Workflow `.github/workflows/deploy.yml`.

Die vollständige, abhakbare Anleitung steht in [`docs/seo-domain-cutover.md`](docs/seo-domain-cutover.md). Offene und widersprüchliche Angaben aus Website, DGSv, DGGO und Google sind in [`docs/faktenabgleich.md`](docs/faktenabgleich.md) dokumentiert. Für die Freigabe mit Meike Fabian gibt es die [`redaktionelle Checkliste`](docs/redaktionelle-freigabe-frau-fabian.md), für spätere echte Fachbeiträge den [`Redaktionsplan`](docs/fachinhalte-redaktionsplan.md). Die bisherige AGB-Fassung liegt ausschließlich als nicht veröffentlichte Prüfquelle unter `docs/rechtliches/`.
