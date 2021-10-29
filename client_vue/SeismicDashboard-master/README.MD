How To Install :
1. Clone github MyLibVue
2. Clone github SeismicDashboard
3. Open directory : MyLibVue
    + install dependency : npm install
    + add code to library : npm link
4. Open SeismicDashboard
    + edit config.js Set server location in this file
    + install dependency : npm install
    + add MyLibVue library to this project : npm link MyLibVue
5. Testing : npm run serve
6. Build : npm run build
