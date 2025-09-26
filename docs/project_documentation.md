# Architekturdokumentation

## 1. Einführung und Ziele

Der Technologie-Radar soll Unternehmen, Produktteams und Software-Architekten dabei unterstützen, den Überblick über
eingesetzte und relevante Technologien zu behalten. Technologien werden dabei nach Kategorien (z.B. Tools, Platforms,
Languages & Frameworks, Techniques) sowie nach ihrem Reifegrad (Assess, Trial, Adopt, Hold) eingeordnet.

Der Nutzen liegt insbesondere darin, technologische Entscheidungen im Unternehmen nachvollziehbar, transparent und
zentral zugänglich zu machen. Mitarbeiterinnen und Mitarbeiter können sich schnell über den aktuellen Stand informieren,
während CTOs die Verantwortung für Pflege, Bewertung und Publikation der Technologien tragen.

### 1.2. Projektziele
Ziel des Projekts ist die Entwicklung eines Tech-Radar-Systems, das folgende Hauptkomponenten umfasst:

- **Technologie-Radar-Administration**: Verwaltung von Technologien durch CTO's
    (Erfassen, Publizieren, Bearbeiten und Einstufen).
- **Technologie-Radar-Viewer**: Darstellung der publizierten Technologien für alle Mitarbeitenden, 
    strukturiert nach Kategorien und Reifegrad.

Dadurch sollen Unternehmen befähigt werden, ihre technologische Landschaft aktiv zu steuern und Wissen über 
Technologien zentral verfügbar zu machen.

### 1.3. Qualitätsziele
Für das Projekt sind insbesondere folgende Qualitätsziele wesentlich:
- **Benutzerfreundlichkeit**: Einfache und übersichtliche Bedienbarkeit der Administration und Viewer-Oberfläche.
- **Performance**: Der Viewer soll auch bei mobilen Endgeräten mit 4G-Verbindungen innerhalb von 1 Sekunde laden.
- **Sicherheit**: Zugriffe auf Administration und Viewer erfolgen nur über Authentifizierung mit Benutzername und 
                  Passwort. Alle Anmeldungen in der Administration werden protokolliert.
- **Testbarkeit**: Zentrale Funktionen werden durch automatisierte Unit- und Integrationstests abgesichert.
- **Responsivität**: Der Viewer soll sowohl auf Desktop- als auch auf mobilen Endgeräten nutzbar sein.

### 1.4. Stakeholder
Die wesentlichen Stakeholder des Projekts sind:

- **CTO**: Hauptnutzer der Administration, verantwortlich für die Pflege und Einordnung von Technologien.
- **Mitarbeitende**: Konsumieren die Inhalte im Viewer, nutzen den Radar zur Orientierung in technologischen Fragen.
- **Software-Architekten / Software Engineers**: Entwickeln und betreiben die Anwendung.

## 2. Randbedingungen

- **Technologie-Stack**: Der Technologiestack ist auf JavaScript und TypeScript festgelegt.
- **Testing**: Es müssen sinnvolle automatisierte Unit- und Integrationstests zur Überprüfung der Funktionalitäten 
               implementiert werden.
- **Dokumentation**: Architektur wird nach arc42 dokumentiert.

## 3. Kontextabgrenzung

### 3.1. Fachlicher Kontext
Der Technologie-Radar besteht aus zwei Hauptkomponenten:
- **Technologie-Radar-Administration**: Wird von CTOs genutzt, um neue Technologien zu erfassen, zu bearbeiten, 
                                        zu publizieren oder deren Einordnung zu ändern.
- **Technologie-Radar-Viewer**: Wird von Mitarbeitenden genutzt, um publizierte Technologien nach Kategorien und 
                                Reifegrad einzusehen.

### 3.2. Technischer Kontext
Das System ist als Webanwendung mit einem Client-Server-Ansatz aufgebaut.
- **Frontend (Administration & Viewer)**: Realisiert in JavaScript/TypeScript (Angular)
- **Backend**: Stellt Schnittstellen zur Verwaltung und Abfrage von Technologien bereit (Express.js).
- **Datenbank**: MongoDB zur Speicherung von Technologien und Benutzerinformationen.

### 3.3. Kontextdiagramm
![Kontextdiagramm](img/Kontextdiagramm.png)

## 4. Lösungsstrategie

### 4.1. Grundprinzipien
Die Architektur des Technologie-Radars orientiert sich an folgenden Prinzipien:
1. **Klare Trennung von Verantwortlichkeiten**
   - Administration und Viewer sind getrennte Frontend-Komponenten.
   - Das Backend kapselt die Geschäftslogik und stellt eine konsistente API bereit.
   - Die Datenbank wird ausschliesslich über das Backend angesprochen.
2. **Modularität und Erweiterbarkeit**
   - Neue Funktionen, z.B. Mandantenverwaltung oder zusätzliche Datenfelder, können ohne grössere Änderungen am 
     bestehenden System ergänzt werden.
   - Die Trennung von Frontend, Backend und Datenhaltung unterstützt die Wiederverwendbarkeit der Komponenten.
3. **Standardisierte Schnittstellen**
   - Die Frontend-Komponenten kommunizieren über REST-APIs mit dem Backend.
   - Alle Daten werden in JSON ausgetauscht, um Konsistenz und einfache Integration zu gewährleisten.
4. **Sicherheit und Rollenmanagement**
   - Authentifizierung und Autorisierung werden zentral im Backend geprüft.
   - CTO haben Zugriff auf die Administration, alle Mitarbeitenden auf den Viewer.
   - Alle Aktionen in der Administration werden protokolliert.
5. **Testbarkeit**
   - Kernfunktionen werden durch automatisierte Unit- und Integrationstests abgesichert.
   - Backend-Tests prüfen API-Endpunkte, Datenvalidierung und Geschäftslogik.
   - Frontend-Tests sichern die korrekte Darstellung und Interaktion der Benutzeroberflächen ab.

## 5. Bausteinsicht

## 6. Laufzeitsicht

## 7. Verteilungssicht

## 8. Querschnittliche Konzepte

## 9. Architekturentscheidungen

## 10. Qualitätsanforderungen

## 11. Risiken und technische Schulden