import {Firebase} from './../util/Firebase'
import { Model } from './model';

export class User extends Model {

    constructor(id){
        super()

        if (id) this.getById(id)
    }

    get chatId(){ return this._data.chatId } 
    set chatId(value) { this._data.chatId = value }
    
    get name(){ return this._data.name } 
    set name(value) { this._data.name = value }

    get email(){ return this._data.email } 
    set email(value) { this._data.email = value }

    get photo(){ return this._data.photo } 
    set photo(value) { this._data.photo = value }

    getById(id){
        return new Promise((s,f)=>{
            // faz monitoramento em tempo real de mudanças no registro
            User.findByEmail(id).onSnapshot(doc => {
                this.fromJSON(doc.data())
                s(doc)
            })

            //serve para pegar apenas 1 vez o registro. Não monitora mudanças
            // User.findByEmail(id).get().then(doc=>{
            //     this.fromJSON(doc.data())
            //     s(doc)
            // }).catch(err=>{
            //     f(err)
            // })
        })
    }

    save(){
        return User.findByEmail(this.email).set(this.toJSON())
    }

    /* 
    * está retornando os usúarios
    */
    static getRef(){
        return Firebase.db().collection('/users')
    }

    static findByEmail(email){
        return User.getRef().doc(email)
    }

    static getContactsRef(id){
        return User.getRef()
                    .doc(id)
                    .collection('/contacts')
    }

    addContact(contact){
        console.log('undefined? >> ',contact)
        return User.getContactsRef(this.email)
        .doc(btoa(contact.email))
        .set(contact.toJSON())
    }

    getContacts(filter = ''){
        // console.log('passando por getContacts()')

        return new Promise((s,f)=>{
            User.getContactsRef(this.email)
            .where('name','>=',filter)
            .onSnapshot(docs =>{
                let contacts = []

                docs.forEach(doc =>{
                    let data = doc.data()

                    data.id = doc.id

                    contacts.push(data)
                })
                this.trigger('contactschanged',docs)
                s(contacts)
            })
        }).catch(err=> {
            f(err)
                
        })
    }
}