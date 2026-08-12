# m-fabian.de – Astro-Relaunch

Statische Website für Meike Fabian auf Basis von Astro, TypeScript, Tailwind CSS und Astro Content Collections.

## Lokale Entwicklung

```sh
npm install
npm run dev
```

Die lokale Website ist anschließend unter [http://localhost:4331](http://localhost:4331) erreichbar. Der Produktions-Build wird mit `npm run build` erzeugt.

## Inhalte online pflegen

Die Redaktionsoberfläche liegt unter [app.pagescms.org](https://app.pagescms.org). Nach der Anmeldung mit einem für das Repository freigeschalteten GitHub-Konto kann die Redakteurin vorhandene Texte bearbeiten und neue Unterseiten in den Bereichen „Über mich“, „Angebote“, „Aktuelles“ und „Kontakt“ anlegen.

Neue Unterseiten erscheinen automatisch in der horizontalen Unternavigation ihres Bereichs. Die vier Punkte des Hauptmenüs bleiben fest im Code definiert und können durch das CMS nicht verändert werden. Auch Layout, Komponenten, Farben, Bilder, Header und Footer sind im CMS nicht editierbar.

Beim Speichern schreibt Pages CMS die Änderung direkt in das GitHub-Repository. Der Workflow in `.github/workflows/deploy.yml` baut und veröffentlicht die Website danach automatisch neu.

## Veröffentlichung

Das Projekt ist für die Custom Domain `www.m-fabian.de` vorbereitet. Für die einmalige Einrichtung:

1. Unter **GitHub → Settings → Pages** als Quelle **GitHub Actions** auswählen.
2. Dort die Custom Domain `www.m-fabian.de` eintragen und nach erfolgreicher DNS-Prüfung HTTPS erzwingen.
3. Die Pages-CMS-GitHub-App für das Repository freigeben und die Redaktion über [app.pagescms.org](https://app.pagescms.org) anmelden.
4. Impressum, Datenschutz und AGB rechtlich sowie redaktionell prüfen und erst danach die sichtbaren Prüfhinweise entfernen.

Jeder Push auf `main` und jede über Pages CMS gespeicherte Änderung startet automatisch den Workflow `.github/workflows/deploy.yml`.
