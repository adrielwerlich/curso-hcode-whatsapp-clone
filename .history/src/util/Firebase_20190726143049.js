const firebase = require('firebase')
require('firebase/firestore')

export class Firebase {
    constructor(){

        // this._config = {
        //     apiKey: "AIzaSyDN4GhSyRLZs_DxviuCLJ8g9fByGSfUWl8",
        //     authDomain: "whatsappclone-3eaa5.firebaseapp.com",
        //     databaseURL: "https://whatsappclone-3eaa5.firebaseio.com",
        //     projectId: "whatsappclone-3eaa5",
        //     storageBucket: "whatsappclone-3eaa5.appspot.com",
        //     messagingSenderId: "941806558827"
        //   }
        this._config = {
            apiKey: "AIzaSyDN4GhSyRLZs_DxviuCLJ8g9fByGSfUWl8",
            authDomain: "whatsappclone-3eaa5.firebaseapp.com",
            databaseURL: "https://whatsappclone-3eaa5.firebaseio.com",
            projectId: "whatsappclone-3eaa5",
            storageBucket: "whatsappclone-3eaa5.appspot.com",
            messagingSenderId: "941806558827",
            appId: "1:941806558827:web:76f9770d01532f97"
          };
          // Initialize Firebase
        //   firebase.initializeApp(firebaseConfig);
        this.init()
    }

    init(){
        if (!window._firebaseInitialized){
            firebase.initializeApp(this._config);
            
            firebase.firestore().settings({
                timestampsInSnapshots: true
            })

            window._firebaseInitialized = true
        }
    }

    static db(){
        return firebase.firestore()
    }

    static hd(){
        return firebase.storage()
    }

    initAuth(){
        return new Promise((s,f)=>{
            let provider = new firebase.auth.GoogleAuthProvider()
            firebase.auth().signInWithPopup(provider)
            .then(result=>{
                let token = result.credential.accessToken
                let user = result.user

                // console.log('user > ' , user, ' token >> ', token)
                
                s({user, token})
            }).catch(err=>{
                f(err)
            })
        })
    }
}