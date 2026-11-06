# Your Pharmacy (demo)

A demo pharmacy patient app, inspired by the Lumistry patient portal, built with Expo (SDK 58), React Native and Expo Router. It has no backend: all data is mock data saved on the device.

**Demo login:** `chris@demo.com` / `demo123`. You can also tap **Use demo account**.

## Features

| Tab | What you can do |
|---|---|
| Meds | See medications per family member, refill status, order refills (pick up or delivery), track orders, archive, add a med, turn auto-refill on or off |
| Messages | Chat with the pharmacy (simulated replies), attach photos, start new conversations, get alerts when orders are ready and appointments are booked |
| Appointments | Upcoming and past visits, book with a calendar and time slots, reschedule, cancel, fill in the pre-visit checklist |
| Family | Patients under your care (appointments, forms, meds), caregivers (revoke, review requests, invite), request to add a family member |
| Account | Pharmacy on a Google map, call or get directions, reset demo data, sign out |

Simulated behaviour: orders become "ready" 15 seconds after you place them, and the pharmacist replies to messages after about 2.5 seconds.

## Setup

Requires Node 20 or newer (`nvm use 22`).

```bash
npm install
```

Create a `.env` file (git ignores it) with your Google Maps key:

```
GOOGLE_MAPS_API_KEY=AIza...
```

## Run on a phone (Expo Go)

```bash
npx expo start
```

Scan the QR code with Expo Go on Android. In Expo Go, maps use Expo Go's own key.

## Build an installable APK (EAS)

1. Upload the Maps key to EAS once. Cloud builds can't see your local `.env`:
   ```bash
   npx eas-cli@latest env:set --name GOOGLE_MAPS_API_KEY \
     --value "$(grep GOOGLE_MAPS_API_KEY .env | cut -d= -f2)" \
     --environment preview --environment production --visibility sensitive
   ```
2. Build:
   ```bash
   npx eas-cli@latest build -p android --profile preview
   ```
3. Open the link EAS prints on your phone and install the APK.
4. In Google Cloud, make sure the key's Android restriction lists package `com.pranab.pharmacydemo` and the keystore SHA-1. Run `npx eas-cli@latest credentials` → Android → preview to see the SHA-1.

## Project layout

```
src/
  app/                 screens (Expo Router: every file is a route)
    login.tsx
    (tabs)/            Meds, Messages, Appointments, Family, Account
    chat/[threadId]    full-screen conversation
  components/          shared UI (cards, header, calendar, chat bubble, map…)
  features/            larger pieces of a single tab (meds lists, family lists)
  data/                mock data, types, fake appointment availability
  services/api.ts      fake backend (swap for real HTTP calls later)
  store/               auth session and demo data store (saved with AsyncStorage)
  utils/               date formatting, refill status, photo picker
```

## Checks

```bash
npx tsc --noEmit
npx expo lint
npx expo-doctor
```
