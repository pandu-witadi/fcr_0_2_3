//
//
//
let CF = {
    appName: "flask-machine-learning",
    appVersion: "0_2_3",
    port: 5151,
    baseURL : "http://localhost",

    // mongodb setting
    use_mongo : true,
    dburl : 'mongodb://127.0.0.1:27017/',
    dbname : 'MERN-social-media',
    dbCollectionImage : 'image',

    // secret_key for JWT (JSONWebToken)
    secret_str : "this-auth-token",
    refresh_token_time:  2 * 60 // 2 minutes
}
CF.publicURL    = CF.baseURL + ':' + CF.port.toString()
CF.apiURL       = CF.publicURL + '/api'
CF.apiImgGet    = CF.apiURL + '/image/get'
CF.apiImgStore  = CF.apiURL + '/image/store'


module.exports = CF
