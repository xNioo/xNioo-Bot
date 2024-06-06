# xNioo-Bot

Ein dedizierter Discord-Bot mit Web-Dashboard.

## Übersicht

Dieses Projekt umfasst einen Discord-Bot und ein zugehöriges Web-Dashboard. Der Bot interagiert mit Discord und speichert benutzerdefinierte Commands in einer MongoDB-Datenbank. Das Web-Dashboard ermöglicht es Benutzern, ihre Commands zu verwalten und Einstellungen vorzunehmen.

## Voraussetzungen

- Node.js (empfohlen Version 14 oder höher)
- MongoDB

## Installation

1. Klonen Sie dieses Repository:

    ```bash
    git clone https://github.com/IhrBenutzername/xNioo-Bot.git
    cd xNioo-Bot
2. Installieren Sie die Abhängigkeiten:
    ```bash
    npm install
3. Erstellen Sie eine .env-Datei im Stammverzeichnis des Projekts und fügen Sie die folgenden Umgebungsvariablen hinzu:
    TOKEN=
    DB_PASSWORD=
    SECRETKEY=
    CLIENT_ID=
    CLIENT_SECRET=

## Starten des Projekts

1. Starten Sie den Bot:

    ```bash
    node index.js
2. Starten Sie den Server:

    ```bash
    node server.js

## Nutzung

- Nach dem Starten des Servers können Sie das Dashboard unter http://localhost:3000 aufrufen.
- Melden Sie sich mit Ihrem Discord-Konto an, um auf das Dashboard zuzugreifen.
- Über das Dashboard können Sie benutzerdefinierte Commands für Ihre Gilden verwalten.
