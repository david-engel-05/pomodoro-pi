# 🚀 Deployment Guide für Raspberry Pi

## Schnell-Start (ohne Supabase)

```bash
# 1. Repository klonen
git clone https://github.com/david-engel-05/pomodoro-pi.git
cd pomodoro-pi

# 2. Deployment-Script ausführen
chmod +x deploy-raspberry-pi.sh
./deploy-raspberry-pi.sh

# 3. Fertig! App läuft auf http://your-pi-ip:3000
```

## Mit Supabase (vollständige Features)

### Schritt 1: Supabase Projekt erstellen
1. Gehen Sie zu [supabase.com](https://supabase.com)
2. Erstellen Sie ein kostenloses Konto
3. Klicken Sie "New Project"
4. Wählen Sie einen Namen und Passwort
5. Notieren Sie sich:
   - **Project URL**: `https://xxxxxxxxxx.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Schritt 2: Database Setup
1. Gehen Sie zu SQL Editor in Supabase
2. Kopieren Sie den Inhalt von `supabase/schema.sql`
3. Führen Sie das SQL aus

### Schritt 3: Deployment konfigurieren
```bash
# Repository klonen
git clone https://github.com/david-engel-05/pomodoro-pi.git
cd pomodoro-pi

# .env erstellen
cp .env.example .env

# .env bearbeiten
nano .env
```

### Schritt 4: .env Datei ausfüllen
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App Configuration (IP Ihres Raspberry Pi)
NEXT_PUBLIC_APP_URL=http://192.168.1.100:3000

# System Monitoring
SYSTEM_MONITOR_ENABLED=true
SYSTEM_MONITOR_INTERVAL=5000
```

### Schritt 5: Deployment starten
```bash
./deploy-raspberry-pi.sh
```

## 📋 Was passiert beim Deployment

Das Script macht automatisch:
1. ✅ Prüft Docker Installation
2. ✅ Erstellt `.env` falls nicht vorhanden
3. ✅ Zieht das neueste Docker Image
4. ✅ Stoppt alte Container
5. ✅ Startet die neue Version
6. ✅ Prüft ob die App gesund ist

## 🌐 Nach dem Deployment

Die App ist verfügbar unter:
- **Lokal**: http://localhost:3000
- **Netzwerk**: http://192.168.1.XXX:3000 (IP Ihres Pi)

## 📱 PWA Installation

1. Öffnen Sie die App im Browser
2. Klicken Sie auf "Zur Startseite hinzufügen"
3. Die App wird wie eine native App installiert

## 🔧 Nützliche Befehle

```bash
# Logs anzeigen
docker-compose -f docker-compose.prod.yml logs -f

# App stoppen
docker-compose -f docker-compose.prod.yml down

# App neustarten
docker-compose -f docker-compose.prod.yml restart

# Update auf neue Version
./deploy-raspberry-pi.sh
```

## 🐛 Troubleshooting

### Container startet nicht
```bash
# Prüfen Sie verfügbaren Speicher
free -h

# Prüfen Sie Docker Status
sudo systemctl status docker

# Prüfen Sie Container Logs
docker logs pomodoro-pi
```

### System Monitor funktioniert nicht
```bash
# In der .env Datei:
SYSTEM_MONITOR_ENABLED=false
```

### Port 3000 bereits in Verwendung
```bash
# Anderen Port verwenden (in docker-compose.prod.yml)
ports:
  - "3001:3000"  # App läuft dann auf Port 3001
```