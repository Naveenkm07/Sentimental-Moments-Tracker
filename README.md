# 📖 Sentimental Moments Tracker

![Sentimental Moments Hero](https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80) <!-- Replace with your actual hero screenshot -->

A beautifully designed, deeply personal journal and memory-tracking application. Sentimental Moments Tracker helps you capture life's most precious memories using text, photos, and voice notes. Relive your journey through an interactive timeline, analyze your mood trends, and safely back up your memories.

Originally conceptualized in [Figma](https://www.figma.com/design/XHtJYCO2RbDCUlHXjQQHxd/Sentimental-Moments-Tracker), this project features both a responsive Web Application and a fully-fledged Mobile Application (Android/iOS).

---

## ✨ Key Features

- 📸 **Rich Media Logs:** Attach photos and record voice notes directly into your daily journal entries.
- 🕒 **Interactive Timeline:** Scroll through your life's moments in a beautifully crafted timeline view.
- 📊 **Mood & Statistics Tracking:** Automatically visualize your emotional trends and category breakdowns over time.
- 👪 **Family Sharing:** Connect with family members to create shared timelines and collaborative memory books.
- 🎨 **Dynamic Theming:** Seamlessly switch between Light and Dark modes.
- 🔒 **Privacy First:** All data is processed locally by default with optional passcode protection.
- 📱 **Cross-Platform:** Available as a web app and a mobile app via Expo.

---

## 🛠 Tech Stack

**Web Application (Vite + React)**
- **Framework:** React 18 with Vite
- **Styling:** TailwindCSS, Vanilla CSS, and Radix UI primitives
- **Animations:** Framer Motion (`motion/react`)
- **Icons:** Lucide React & Material UI Icons

**Mobile Application (Expo / React Native)**
- **Framework:** Expo & React Native (located in `/mobile`)
- **Native Modules:** `expo-camera`, `expo-av`, `expo-image-picker`
- **Routing:** React Navigation

---

## 🚀 Getting Started

You can run either the web app or the mobile app locally. 

### 1. Running the Web App

Make sure you have [Node.js](https://nodejs.org/) installed, then run:

```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
The app will be available at `http://localhost:5173`.

### 2. Running the Mobile App (Expo)

To run the Android/iOS version, navigate to the `mobile` directory:

```bash
# Move into the mobile directory
cd mobile

# Install dependencies
npm install

# Start the Expo server
npm start
```
You can scan the generated QR code using the **Expo Go** app on your physical device, or press `a` or `i` to launch an Android/iOS emulator.

---

## 🔐 Privacy & Play Store Deployment

The mobile application is strictly configured to respect user privacy. See the [Privacy Policy](./PRIVACY_POLICY.md) for details on how we handle storage, camera, and microphone permissions.

If you are a developer looking to build the Android `.apk` or `.aab`, EAS is pre-configured:
```bash
cd mobile
npx eas-cli build --platform android --profile production
```

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Naveenkm07/Sentimental-Moments-Tracker/issues).

## 📄 License
This project is proprietary. See the [LICENSE](./mobile/LICENSE) file for more details.