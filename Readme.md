# Offline Share

Send files between phones and laptops with no internet, no install and no ads. Open the site on two devices, scan two QR codes, and the files travel directly from one device to the other.

**Live site:** https://hypersnc.vercel.app


## Why it exists

Apps like Xender move files without internet, but they need an install on both devices and most are full of ads. Offline Share is a website. Anyone who can open a link can use it, on Android, on a laptop, and (testing in progress) on iPhone.

## Features

- Works with no internet after the first visit, because a service worker saves the site on the device
- Pairing by QR code, with no server involved
- Any file type: photos, videos, PDFs, documents, music and APK files
- Live progress, transfer speed and estimated time remaining
- Delivery confirmation, so the sender only sees "Sent" after the receiver has the whole file
- Cancel a file while it is sending
- Drag and drop on desktop
- Keeps the screen awake during a transfer, where the browser allows it
- Encrypted in transit, since WebRTC data channels are always encrypted
- Files go straight between the two devices and never touch a server

## How it works

There is no backend. The two devices connect to each other with WebRTC, and the QR codes replace the server that would normally introduce them.

1. **Offer.** The sending device creates a WebRTC connection and a data channel, then shows its connection details as a QR code. The details are trimmed to IPv4 UDP addresses and compressed with lz-string so the code stays easy to scan.
2. **Answer.** The receiving device scans the offer, creates its own answer, and shows it as a second QR code.
3. **Connect.** The sender scans the answer. Both devices now know each other's local network addresses, so the data channel opens directly between them. No STUN or TURN servers are used.
4. **Transfer.** Each file is sent as a small JSON message (name, size, type), then binary chunks, then an end message. The sender pauses when the channel's buffer fills (backpressure), so large files do not crash the browser. The receiver rebuilds the file, checks its size, and replies with an acknowledgement.

## Tech stack

- React and Vite
- Tailwind CSS v4
- Framer Motion
- WebRTC data channels
- qr-scanner and qrcode.react
- lz-string
- vite-plugin-pwa (service worker)
- lucide-react
- Plus Jakarta Sans, bundled with Fontsource so it works offline

## Project structure

```
src/
  hooks/
    usePeer.js        WebRTC connection, offer and answer handling
    useTransfer.js    sending, receiving, progress, acknowledgements
    useWakeLock.js    keeps the screen on during transfers
  lib/
    signaling.js      encodes and decodes the QR connection codes
    file-transfer.js  chunked sending with backpressure, and saving files
    format.js         file size and file type helpers
  screens/            Home, PairSend, PairReceive, Transfer
  pages/              Landing page
```

## Getting started

You need Node.js 20 or newer.

```bash
git clone https://github.com/writefreak/hypersnc.git
cd offline-share
npm install
npm run dev
```

The camera only works on `https` or `localhost`. To try it on a phone, deploy a preview, or expose your dev server through an https tunnel.

## Testing offline

The service worker only exists in a production build, so `npm run dev` cannot test offline behavior.

1. Run `npm run build`, then `npm run preview`.
2. Open the preview address on both devices with internet on, and reload twice on each so the new version takes over.
3. Put both devices on the same hotspot or Wi-Fi network, then turn off mobile data.
4. Reload `/app`. It should load from the saved copy.
5. Pair the devices on this network and send a file.

Pairing has to happen on the network you will transfer over, because the QR codes contain each device's local address.

## Deploying

The project deploys to Vercel as a static site. `vercel.json` rewrites `/app` to `index.html`, so the tool loads when opened directly.

## Tested

- Android to Android, offline
- Laptop to phone, with and without internet, including an 81 MB video

## Known limits

- Both devices must share a network. One device turns on its hotspot and the other joins it, or both join the same Wi-Fi.
- The first visit needs internet, so the site can save itself to the device.
- Keep the screen on during a transfer. Locking a device can pause it.
- Files transfer one at a time.
- iPhone is still being tested. Safari holds a received file in memory before saving it, so very large files may fail there.
- Speed depends on the hotspot. A 5 GHz hotspot is much faster than 2.4 GHz.
- Treat each QR code like a one-time link and only show it to the person you are sharing with.

## Ideas for later

- A real "ready for offline" indicator driven by the service worker
- Pause and resume
- Sending whole folders
- Verified iPhone support and measured size limits

## Built by

[TageLabs Digital Solutions](https://tagelabs.vercel.app)