# FIV en Calma (PWA)

Aquesta és una **app web** (PWA) pensada per al mòbil: es pot obrir al navegador i **afegir-la a la pantalla d'inici** com si fos una aplicació.

## Què fa
- Programa de **14 dies** en aquest ordre:
  1) **Mòdul 1 (Audio 2):** regular el sistema (baixar alarma/estrès) amb microaccions.
  2) **Mòdul 2 (Audio 1):** construir “proves” petites de possibilitat (seguretat → voler → flexibilitat).
- Check-in diari (ànim, energia, rumiació).
- Timers (respiració 3'/5', aire 8'/10', tasca mecànica).
- Notes i prompts enfocats a **FIV**.
- “Banc de proves” (evidències petites de progrés).
- Pestanya “Parella” amb frases i microaccions.

## Com executar-la (recomanat)
Perquè el “mode instal·lable” i l'offline funcionin, cal servir-la via **http** (no obrint l'arxiu directament).

### Opció A — Amb Python (molt fàcil)
1) Descomprimeix la carpeta.
2) Obre un terminal dins la carpeta.
3) Executa:
   ```bash
   python -m http.server 8080
   ```
4) Al navegador: http://localhost:8080

### Opció B — Veure-la al mòbil a la mateixa Wi‑Fi
1) Executa el servidor (Opció A) al teu ordinador.
2) Mira la IP local del PC (ex: 192.168.1.20).
3) Al mòbil, obre: http://LA-TEVA-IP:8080

### Afegir a pantalla d'inici
- **iPhone (Safari):** Compartir → “Afegir a pantalla d'inici”
- **Android (Chrome):** Menú → “Instal·lar aplicació” o “Afegir a pantalla d'inici”

## Dades i privacitat
- Tot es guarda al **localStorage** del dispositiu (no surt a internet).
- Pots esborrar-ho tot a ⚙️ Configuració → “Esborrar dades (reset)”.

## Avís important
Aquesta app és **suport emocional i d'hàbits**. No substitueix professionals ni el teu equip mèdic de FIV.
Si hi ha risc imminent o idees d'autolesió, truca a emergències (112) i demana ajuda immediata.
