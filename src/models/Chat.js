import { Model } from "./Model"
import { Firebase } from "../util/Firebase"

export class Chat extends Model{
    constructor(){
        super()
    }
    
    get users(){ return this._data.users }
    set users(value) { this._data.users = value}
    
    get timeStamp(){ return this._data.timeStamp }
    set timeStamp(value) { this._data.timeStamp = value}
    
    static getRef(){
        return Firebase.db().collection('chats')
    }
    
    // cria um novo chat
    static create (myEmail, contactEmail){
        return new Promise((s,f)=>{
            
            let users = {}
            users[btoa(myEmail)] = true
            users[btoa(contactEmail)] = true
            
            Chat.getRef().add({
                // ao criar novo chat, retorna o document que é tratado no 'then'
                users,
                timeStamp: new Date()
            }).then(doc => {
                // console.log('docum inside creating chat', doc)
                // console.log('doc.id', doc.id)
                //cria 
                Chat.getRef().doc(doc.id).get().then(chat => {
                    s(chat)
                }).catch(err => { // catch do 'pegar referencia'
                    f(err)
                })
            }).catch(err => { // catch do 'criar'
                f(err)
            }) 
        })
    }
    
    static find(myEmail, contactEmail){
        // lista de paramêtros: 1 - chave q está sendo procurada
        // 2 - operador de comparação (igual[==], diferente, maior, menor etc.)
        // 3 - valor de referência na compãração
        // btoa
        return Chat.getRef()
            .where(btoa(myEmail),'==',true)
            .where(btoa(contactEmail),'==',true)
            .get()
    }
    
    static createIfNotExists(myEmail, contactEmail) {
        return new Promise((s,f)=>{
            Chat.find(myEmail, contactEmail).then(chats => {
                if (chats.empty){
                    Chat.create(myEmail, contactEmail).then(chat => {
                        s(chat)
                    })
                } else {
                    chats.forEach(chat => {
                        s(chat)
                    })
                }
            }).catch(err => { f(err) })
        })
    }
}