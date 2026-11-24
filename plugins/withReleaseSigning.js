/**
 * Expo config plugin: signs the Android release build with the upload keystore when
 * ANDROID_KEYSTORE_PATH (and the 3 related env vars) are set, e.g. by GitHub Actions.
 * Without them the release build falls back to the debug key (fine for local test APKs,
 * NOT acceptable for Google Play; the release workflow refuses to run without secrets).
 */
const { withAppBuildGradle } = require('expo/config-plugins');

module.exports = function withReleaseSigning(config) {
  return withAppBuildGradle(config, (c) => {
    let g = c.modResults.contents;
    if (g.includes('brainrushRelease')) return c;
    const before = g;
    g = g.replace(/signingConfigs\s*\{\s*debug\s*\{/, `signingConfigs {
        brainrushRelease {
            if (System.getenv('ANDROID_KEYSTORE_PATH')) {
                storeFile file(System.getenv('ANDROID_KEYSTORE_PATH'))
                storePassword System.getenv('ANDROID_KEYSTORE_PASSWORD')
                keyAlias System.getenv('ANDROID_KEY_ALIAS')
                keyPassword System.getenv('ANDROID_KEY_PASSWORD')
            }
        }
        debug {`);
    g = g.replace(/(release\s*\{[^}]*?)signingConfig signingConfigs\.debug/, `$1signingConfig System.getenv('ANDROID_KEYSTORE_PATH') ? signingConfigs.brainrushRelease : signingConfigs.debug`);
    if (g === before || !g.includes('signingConfigs.brainrushRelease')) {
      throw new Error('withReleaseSigning: could not patch app/build.gradle (template changed). Update plugins/withReleaseSigning.js');
    }
    c.modResults.contents = g;
    return c;
  });
};
