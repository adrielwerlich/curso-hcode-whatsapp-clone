const firebase = require('firebase')
require('firebase/firestore')

export class Firebase {
    constructor(){

        // this._config = {
       xxx
        //   }
        this._config = {
            xxx
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
