# fusapp
Aplicación oficial de Comunidad Fusa

cordova platform add android

# Plugins
cordova plugin add cordova-plugin-device

cordova plugin add cordova-plugin-file

cordova plugin add cordova-plugin-file-transfer

cordova plugin add cordova.plugins.diagnostic

cordova plugin add cordova-plugin-music-controls

cordova plugin add cordova-plugin-facebook4 --save --variable APP_ID="1355985631175437" --variable APP_NAME="Fusa"

cordova run android

# Run vía wifi

Ir a C:\Users\[user]\AppData\Local\Android\sdk\platform-tools

Correr: adb connect 192.168.0.30:5556

Checkear: adb devices

# Notas de este branch

instalar Android Support Repository con el android studio
correr el plugin add del readme
https://stackoverflow.com/questions/42949974/android-support-repo-46-0-0-with-android-studio-2-3 (copiar en el gradle esas lineas)

keytool -exportcert -alias androiddebugkey -keystore %HOMEPATH%\.android\debug.keystore | "D:\xampp\apache\bin\openssl.exe" sha1 -binary | "D:\xampp\apache\bin\openssl.exe" base64
pass: bolivarvive

Para prod
keytool -exportcert -alias androidprodkey -keystore %HOMEPATH%\.android\prod.keystore | "D:\xampp\apache\bin\openssl.exe" sha1 -binary | "D:\xampp\apache\bin\openssl.exe" base64

https://developers.facebook.com/quickstarts/1355985631175437/?platform=android
para prod hay que crear tambien