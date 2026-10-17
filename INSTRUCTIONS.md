# Sculpt for Android: step by step

This folder turns Sculpt into a real Android app. You'll do three things: put the app online for free, turn it into an Android app with PWABuilder, then install it. Allow about 30 minutes the first time.

**What's in the folder**

- `index.html`: the app itself
- `manifest.webmanifest`: the app's name, colours and icons
- `sw.js`: lets the app open without internet after the first time
- `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`: the app icons
- `_config.yml`: helps GitHub publish a file you'll add in step 4

## Step 1: Put the app online (free)

These steps work in your phone's browser.

1. Unzip `sculpt-android.zip`. In most file managers, tap the file, then Extract.
2. Go to github.com and create a free account. Note your username.
3. Tap **+**, then **New repository**. Name it exactly `yourusername.github.io`, using your real username. Set it to **Public**, then tap **Create repository**.
4. Tap **uploading an existing file**. Select all the files from the unzipped folder, then tap **Commit changes**.
5. Go to **Settings**, then **Pages**. Under "Build and deployment", set Source to **Deploy from a branch**, the branch to **main** and the folder to **/ (root)**. Tap **Save**.
6. Wait 1 to 2 minutes, then open `https://yourusername.github.io` in Chrome. You should see the Sculpt setup screen.

On a computer, Netlify Drop is even quicker: go to app.netlify.com/drop and drag the unzipped folder onto the page. Sign up so the site stays online.

## Step 2: Make the Android app (PWABuilder)

1. Go to pwabuilder.com, paste your site address and tap **Start**.
2. When the report loads, tap **Package for stores**, choose **Android**, then **Generate package**. The default options are fine.
3. Download the zip it gives you and unzip it. Inside you'll find:
   - an `.apk` file: the app to install on your phone
   - an `.aab` file: only needed for the Google Play Store
   - `assetlinks.json`: used in step 4
   - a signing key file and its passwords: keep these safe. You need them for Play Store updates.

## Step 3: Install it on your phone

1. Open the `.apk` file on your phone.
2. If Android asks, allow your browser or file manager to install unknown apps.
3. Tap **Install**. Sculpt appears on your home screen with its own icon.

## Step 4: Remove the address bar

At first the app may show a thin address bar at the top. Adding one file removes it:

1. In your GitHub repository, tap **Add file**, then **Create new file**.
2. Name it `.well-known/assetlinks.json` (typing the `/` creates the folder).
3. Open `assetlinks.json` from the PWABuilder zip, copy everything in it, paste it in and tap **Commit changes**.
4. Wait a few minutes, close the app completely and open it again.

## Step 5: Bring your logs across

The Android app starts empty, because each place you use Sculpt keeps its own logs.

1. In the version you've been using (your Claude link), go to **Profile → Your data → Download backup**.
2. Open the Android app. On the first screen, tap **Moving from another device? Restore a backup** and choose the file.

## Good to know

- **Works offline:** everything is built into the app, including the food list, meals, recipes, charts and icons. Sculpt needs internet only the first time you open it. After that, it works with no data or Wi-Fi at all. Profile → Your data shows "Works offline" once it's ready.
- **Your data** is saved on your phone, and the app asks Android not to clear it. Still, tap **Profile → Your data → Download backup** every week or so.
- **Updates:** when you get a new version, upload the new `index.html` to your repository so it replaces the old one. The next time Sculpt opens with internet, it downloads the update and shows a **Restart** button. You don't need to reinstall.
- **Claude estimates:** "Ask Claude to estimate" only works inside Claude, so it's hidden in the Android app. Everything else works the same.

## Optional: publish on the Google Play Store

1. Create a Google Play Console developer account. Google charges a one-time $25 fee.
2. Create an app and upload the `.aab` file from the PWABuilder zip.
3. Google asks for a store listing, screenshots and a privacy policy link before reviewing it.
