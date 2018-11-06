
import {
    Format
} from './../util/Format'
import {
    CameraController
} from './CameraController'
import {
    MicrophoneController
} from './MicrophoneController'
import {
    DocumentPreviewController
} from './DocumentPreviewController'
import {
    Firebase
} from './../util/Firebase'
import {
    User
} from '../models/User';
import {
    Chat
} from "../models/Chat"
import {
    Message
} from "../models/Message"
import {
    Base64
} from '../util/Base64';
import {
    ContactsController
} from '../controller/ContactsController'
import {
    Upload
} from '../util/Upload';


export class WhatsAppController {
    constructor() {
        this.el
        console.log('controller constructor')
        this._active = true
        this._firebase = new Firebase()
        this.initAuth()
        this.elementsPrototype()
        this.loadElements()
        this.initEvents()
        this.checkNotifications()

    }

    checkNotifications(){
        // debugger
        if (typeof Notification === 'function'){
            if (Notification.permission !== 'granted'){
                this.el.alertNotificationPermission.show()
            } else {
                this.el.alertNotificationPermission.hide()
            }

            this.el.alertNotificationPermission.on('click', e=> {
                Notification.requestPermission(permission => {
                    if (permission === 'granted') {
                        this.el.alertNotificationPermission.hide()
                        console.info('notificações permitidas!')
                    }
                })
            })
        }
    }

    notification(data){
        console.log('entrou em notif ')
        // console.log("Notification.permission === 'granted'", Notification.permission === 'granted') 
        // console.log('!this._active', !this._active)

        // if ('Notification' in window) {
        //     console.log('notif permit')
        //   } else {
        //     console.log('notif not permit')
        //   }

            // console.log('push1', Push)
        Push.Permission.request();
        // console.log('push', p)
        Push.create('Hi there!', {
            body: 'This is a notification.',
            // icon: 'icon.png',
            timeout: 8000,               // Timeout before notification closes automatically.
            vibrate: [100, 100, 100],    // An array of vibration pulses for mobile devices.
            onClick: function() {
                // Callback for when the notification is clicked. 
                console.log(this);
            }  
        });

        // console.log('this ', this)
        // console.log('this._activeContact', this._activeContact)

        // debugger
        if(Notification.permission === 'granted' && !this._active) {
            console.log('antes da criação da notificação')
            let n = new Notification(this._activeContact.name,{
                icon : this._activeContact.photo,
                body : data.content
            });
            console.log('depois da criação da notificação')
            // n.requestPermission()

            // Notification.requestPermission().then(function(result) {
            //     if (result === 'denied') {
            //       console.log('Permission wasn\'t granted. Allow a retry.');
            //       return;
            //     }
            //     if (result === 'default') {
            //       console.log('The permission request was dismissed.');
            //       return;
            //     }
            //     // Do something with the granted permission.
            //   });


            // n.onshow = function() {
            //     console.log('Notification shown');
            //     console.log('this._activeContact', this._activeContact)
            //     console.log('body : data.content', data.content)
            //   };
            // n.display()
            // n.open()
            
            // console.log('mandando notificação ', n)

            let sound = new Audio('./audio/alert.mp3')
            sound.currentTime = 0
            sound.play()
            setTimeout(()=>{
                if (n) n.close()
            },3000)
        }
    }

    initAuth() {
        this._firebase.initAuth()
            .then((userResponse) => {

                // console.log('controllerresponse >> ', userResponse)

                this._user = new User(userResponse.user.email)

                this._user.on('datachanged', data => {
                    // console.log('datachanged event >>> ', data)
                    document.querySelector('title').innerHTML = data.name + ' - ' + 'What´s App Clone'

                    this.el.inputNamePanelEditProfile.innerHTML = data.name

                    if (data.photo) {
                        let photo = this.el.imgPanelEditProfile
                        photo.src = data.photo
                        photo.show()
                        this.el.imgDefaultPanelEditProfile.hide()

                        let photo2 = this.el.myPhoto.querySelector('img')
                        photo2.src = data.photo
                        photo2.show()
                    }

                    this.initContacts()
                })

                this._user.name = userResponse.user.displayName
                this._user.email = userResponse.user.email
                this._user.photo = userResponse.user.photoURL

                this._user.save().then(() => {
                    this.el.appContent.css({
                        display: 'flex'
                    })
                })

                let userRef = User.findByEmail(userResponse.user.email)

            }).catch(err => {
                console.error(err)
            })
    }

    initContacts() {
        // console.log('entrou no initContacts()')
        this._user.on('contactschanged', docs => {
            this.el.contactsMessagesList.innerHTML = ''

            docs.forEach(doc => {

                let contact = doc.data()

                let div = document.createElement('div')
                div.id = contact.email
                div.className = 'contact-item'

                div.innerHTML =
                    `
                <div class="dIyEr">
                    <div class="_1WliW" style="height: 49px; width: 49px;">
                        <img src="#" class="Qgzj8 gqwaM photo" style="display:none;">
                        <div class="_3ZW2E">
                            <span data-icon="default-user" class="">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212 212" width="212" height="212">
                                    <path fill="#DFE5E7" d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z"></path>
                                    <g fill="#FFF">
                                        <path d="M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z"></path>
                                    </g>
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="_3j7s9">
                    <div class="_2FBdJ">
                        <div class="_25Ooe">
                            <span dir="auto" title="${contact.name}" class="_1wjpf">${contact.name}</span>
                        </div>
                        <div class="_3Bxar">
                            <span class="_3T2VG">${Format.timeStampToTime(contact.lastMessageTime)}</span>
                        </div>
                    </div>
                    <div class="_1AwDx">
                        <div class="_itDl">
                            <span title="digitando…" class="vdXUe _1wjpf typing" style="display:none">digitando…</span>
        
                            <span class="_2_LEW last-message">
                                <div class="_1VfKB">
                                    <span data-icon="status-dblcheck" class="">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18">
                                            <path fill="#263238" fill-opacity=".4" d="M17.394 5.035l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-.427-.388a.381.381 0 0 0-.578.038l-.451.576a.497.497 0 0 0 .043.645l1.575 1.51a.38.38 0 0 0 .577-.039l7.483-9.602a.436.436 0 0 0-.076-.609zm-4.892 0l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-2.614-2.556a.435.435 0 0 0-.614.007l-.505.516a.435.435 0 0 0 .007.614l3.887 3.8a.38.38 0 0 0 .577-.039l7.483-9.602a.435.435 0 0 0-.075-.609z"></path>
                                        </svg>
                                    </span>
                                </div>
                                <span dir="ltr" class="_1wjpf _3NFp9">${contact.lastMessage}</span>
                                <div class="_3Bxar">
                                    <span>
                                        <div class="_15G96">
                                            <span class="OUeyt messages-count-new" style="display:none;">1</span>
                                        </div>
                                </span></div>
                                </span>
                        </div>
                    </div>
                </div>
                `
                //se o contato tiver foto mostra a foto
                // console.log(contact.photo)
                if (contact.photo) {
                    // console.log('entrou no if da foto')
                    let img = div.querySelector('.photo')
                    img.src = contact.photo
                    img.show()
                }

                div.on('click', e => {

                    // console.log('clickDivContactId', contact.chatId)
                    this.setActiveChat(contact)

                })

                this.el.contactsMessagesList.appendChild(div)
            })
        })

        this._user.getContacts()
    }

    setActiveChat(contact) {

        if (this._activeContact)
            Message.getAllMessagesForActiveContact(this._activeContact.chatId).onSnapshot(() => {})
        console.log('this._activeContact before ', this._activeContact)
        this._activeContact = contact
        console.log('this._activeContact after ', this._activeContact)

        this.el.activeName.innerHTML = contact.name
        this.el.activeStatus.innerHTML = contact.status
        if (contact.photo) {
            let img = this.el.activePhoto
            img.src = contact.photo
            img.show()
        }
        this.el.home.hide()
        this.el.main.css({
            display: 'flex'
        })

        this.el.panelMessagesContainer.innerHTML = ''
        this._messagesReceived = []
        Message.getAllMessagesForActiveContact(this._activeContact.chatId)
            .orderBy('timeStamp')
            .onSnapshot(docs => {
                // console.log('snapshot get all messages for active contact')
                let scrollTop = this.el.panelMessagesContainer.scrollTop
                let scrollTopMax =
                    (this.el.panelMessagesContainer.scrollHeight -
                        this.el.panelMessagesContainer.offsetHeight)
                let autoScroll = (scrollTop >= scrollTopMax)

                this.el.panelMessagesContainer.innerHTML = ''

                docs.forEach(doc => {
                    let data = doc.data()
                    data.id = doc.id

                    let message = new Message()
                    let isMe = (data.from === this._user.email)
                    message.fromJSON(data)
                    // console.log('isMe', isMe)

                    // console.log("this._messagesReceived.filter(id => { return (id === data.id) })",
                    // this._messagesReceived.filter(id => {
                    //     return (id === data.id) }))


                    // console.log("this._messagesReceived.filter(id => { return (id === data.id) }).length === 0",
                    // this._messagesReceived.filter(id => {
                    //     return (id === data.id) }).length === 0)
                    // debugger
                    if 
                        (!isMe && this._messagesReceived.filter(id => {
                            return (id === data.id) }).length === 0 )
                    {

                        // console.log('enviando notif')
                        this.notification(data)
                        this._messagesReceived.push(data.id)
                    }


                    let messageToShow = message.getViewElement(isMe)
                    let panelMessages = this.el.panelMessagesContainer.querySelector('#_' + data.id)

                    if (!panelMessages) {

                        if (!isMe) {
                            doc.ref.set({
                                status: 'readed'
                            }, {
                                merge: true
                            })
                        }
                        // console.log('calling getViewElement >>> ')
                        // console.log('depois da getViewElem -->>  ', view)
                        this.el.panelMessagesContainer.appendChild(messageToShow)

                    } else {
                        // updates the message element in the message list main view
                        oldmessage = this.el.panelMessagesContainer.querySelector('#_' + data.id)
                        let messageparent = oldmessage.parentNode
                        messageparent.replaceChild(messageToShow, oldmessage)
                    }

                    if (panelMessages && isMe) {
                        // console.log('entrou no else')
                        let msgEl = panelMessages
                        msgEl.querySelector('.message-status').innerHTML = message.getStatusViewElement().outerHTML
                    }

                    if (message.type === 'contact') {
                        messageToShow.querySelector('.btn-message-send').on('click', e => {
                            Chat.createIfNotExists(this._user.email, message.content.email).then(chat => {

                                let contact = new User(message.content.email)

                                contact.on('datachanged', data => {
                                    contact.chatId = chat.id
                                    this._user.addContact(contact)
                                    this._user.chatId = chat.id
                                    contact.addContact(this._user)

                                    this.setActiveChat(contact)
                                })

                            })
                        })
                    }
                })



                if (autoScroll) {
                    this.el.panelMessagesContainer.scrollTop =
                        (this.el.panelMessagesContainer.scrollHeight -
                            this.el.panelMessagesContainer.offsetHeight)
                } else {
                    this.el.panelMessagesContainer.scrollTop = scrollTop
                }
            })


    }

    loadElements() {
        this.el = {}
        document.querySelectorAll('[id]').forEach(element => {
            this.el[Format.getCamelCase(element.id)] = element;

        })
    }

    elementsPrototype() {
        Element.prototype.hide = function () {
            this.style.display = 'none'
            return this
        }
        Element.prototype.show = function () {
            this.style.display = 'block'
            return this
        }
        Element.prototype.toggle = function () {
            this.style.display = (this.style.display === 'none') ? 'block' : 'none'
            return this
        }
        Element.prototype.on = function (events, fn) {
            events.split(' ').forEach(event => {
                this.addEventListener(event, fn)
                //(exemplo para digitar no console) app.el.btnNewContact.on('click mouseover dblclick', (event) => {console.log('evento do botão newContact >>> ', event.type)})
            })
            return this
        }
        Element.prototype.css = function (styles) {
            for (let name in styles) {
                this.style[name] = styles[name]
            }
            return this
            //app.el.app.css({width:'50%', height:'50%'})
        }
        Element.prototype.addClass = function (name) {
            this.classList.add(name)
            return this
        }
        Element.prototype.removeClass = function (name) {
            this.classList.remove(name)
            return this
        }
        Element.prototype.toggleClass = function (name) {
            this.classList.toggle(name)
            return this
        }
        Element.prototype.hasClass = function (name) {
            return this.classList.contains(name)
        }
        HTMLFormElement.prototype.getForm = function () {
            console.log('prototype form el >>> ', this)
            return new FormData(this)
        }
        HTMLFormElement.prototype.toJSON = function () {
            // console.log('prototype form el >>> ' , this)
            let json = {}

            this.getForm().forEach((value, key) => {
                json[key] = value
            })
            return json // dentro do console app.el.formPanelAddContact.toJSON()
        }
    }



    initEvents() {
        window.addEventListener('focus', e=> {
            this._active = true
            console.log('focus active? ' , this._active)
        })

        window.addEventListener('blur', e=> {
            this._active = false
            console.log('blur active? ' , this._active)
        })

        this.el.inputSearchContacts.on('keyup', e => {
            if (this.el.inputSearchContacts.value.length > 0) {
                this.el.inputSearchContactsPlaceholder.hide()
            } else {
                this.el.inputSearchContactsPlaceholder.show()
            }

            this._user.getContacts(this.el.inputSearchContacts.value)
        })
        this.el.myPhoto.on('click', e => {
            this.closeLeftPanels()
            this.el.panelEditProfile.show()
            setTimeout(() => {
                this.el.panelEditProfile.addClass('open')
            }, 300)

        })
        this.el.btnNewContact.on('click', e => {
            this.closeLeftPanels()
            this.el.panelAddContact.show()
            setTimeout(() => {
                this.el.panelAddContact.addClass('open')
            }, 300)
        })
        this.el.btnClosePanelEditProfile.on('click', e => {
            this.el.panelEditProfile.removeClass('open');
        })
        this.el.btnClosePanelAddContact.on('click', e => {
            this.el.panelAddContact.removeClass('open');
        })
        this.el.photoContainerEditProfile.on('click', e => {
            this.el.inputProfilePhoto.click()
        })
        this.el.inputProfilePhoto.on('change', e => {
            if (this.el.inputProfilePhoto.files.length > 0) {
                let file = this.el.inputProfilePhoto.files[0]
                Upload.send(file, this._user.email).then(url => {
                    this._user.photo = url
                    this._user.save().then(() => {
                        this.el.btnClosePanelEditProfile.click()
                    })
                })
            }
        })
        this.el.inputNamePanelEditProfile.on('keypress', e => {
            if (e.key === 'Enter') {
                e.preventDefault()
                console.log('enter no input name profile')
                this.el.btnSavePanelEditProfile.click()
            }
        })


        this.el.btnSavePanelEditProfile.on('click', e => {
            this.el.btnSavePanelEditProfile.disabled = true
            this._user.name = this.el.inputNamePanelEditProfile.innerHTML

            this._user.save().then(() => {
                this.el.btnSavePanelEditProfile.disabled = false
            })

            // console.log(this.el.inputNamePanelEditProfile.innerHTML)
        })
        this.el.formPanelAddContact.on('submit', e => {
            e.preventDefault()
            let formData = new FormData(this.el.formPanelAddContact)

            let contact = new User(formData.get('email'))

            contact.on('datachanged', data => {
                if (data.name) {

                    Chat.createIfNotExists(this._user.email, contact.email).then(chat => {

                        contact.chatId = chat.id
                        this._user.chatId = chat.id
                        contact.addContact(this._user)

                        this._user.addContact(contact).then(() => {
                            this.el.btnClosePanelAddContact.click()
                            console.info('contato adicionado')
                        })
                    })

                } else {
                    console.log('usuário não existe')
                }
            })

            // this._user.addContact()
        })
        this.el.contactsMessagesList.querySelectorAll('.contact-item').forEach(item => {
            item.on('click', e => {
                this.el.home.hide()
                this.el.main.css({
                    display: 'flex'
                })
            })
        })
        this.el.btnAttach.on('click', e => {
            e.stopPropagation()
            this.el.menuAttach.addClass('open')
            document.addEventListener('click', this.closeMenuAttach.bind(this))
        })
        this.el.btnAttachPhoto.on('click', e => {
            console.log('photo')
            this.el.inputPhoto.click()
        })
        this.el.inputPhoto.on('change', e => {
            console.log(this.el.inputPhoto.files);
            [...this.el.inputPhoto.files].forEach(imageToSend => {
                console.log('file ... ', imageToSend)
                Message.sendImage(this._activeContact.chatId, this._user.email, imageToSend)

            })
        })
        this.el.btnAttachCamera.on('click', e => {
            console.log('camera')

            this.closeAllMainPanel()
            this.el.panelCamera.addClass('open')
            this.el.panelCamera.css({
                'height': 'calc(100% - 120px)'
            })

            this._camera = new CameraController(this.el.videoCamera)
        })
        this.el.btnClosePanelCamera.on('click', e => {
            this.closeAllMainPanel()
            // this.el.panelCamera.removeClass('open')
            this.el.panelMessagesContainer.show()
            this._camera.stop()
        })
        this.el.btnTakePicture.on('click', e => {
            console.log('picture')
            let dataUrl = this._camera.takePicture()

            this.el.pictureCamera.src = dataUrl
            this.el.pictureCamera.show()
            this.el.videoCamera.hide()
            this.el.btnReshootPanelCamera.show()
            this.el.containerTakePicture.hide()
            this.el.containerSendPicture.show()
        })

        this.el.btnReshootPanelCamera.on('click', e => {
            this.el.pictureCamera.hide()
            this.el.videoCamera.show()
            this.el.btnReshootPanelCamera.hide()
            this.el.containerTakePicture.show()
            this.el.containerSendPicture.hide()
        })

        this.el.btnSendPicture.on('click', e => {
            // console.log(this.pictureCamera.src)



            this.el.btnSendPicture.disabled = true

            let regex = /^data:(.+);base64,(.*)$/;
            let result = this.el.pictureCamera.src.match(regex)
            let mimeType = result[1]
            let ext = mimeType.split('/')[1]
            let filename = `camera${Date.now()}.${ext}`

            let picture = new Image()
            picture.src = this.el.pictureCamera.src
            picture.onload = e => {
                let canvas = document.createElement('canvas')
                let context = canvas.getContext('2d')

                canvas.width = picture.width
                canvas.height = picture.height

                // desloca horizontalmente a largura
                context.translate(picture.width, 0)
                // inverte horizontalmente 'flip'
                context.scale(-1, 1)
                // terminada a inversão desenha no canvas
                context.drawImage(picture, 0, 0, canvas.width, canvas.height)

                fetch(canvas.toDataURL(mimeType))
                    .then(res => {
                        return res.arrayBuffer()
                    })
                    .then(buffer => {
                        return new File([buffer], filename, {
                            type: mimeType
                        })
                    })
                    .then(photoToSend => {
                        Message.sendImage(this._activeContact.chatId, this._user.email, photoToSend)
                        this.el.btnSendPicture.disabled = false

                        this.closeAllMainPanel()
                        this._camera.stop()
                        this.el.btnReshootPanelCamera.hide()
                        this.el.pictureCamera.hide()
                        this.el.videoCamera.show()
                        this.el.containerSendPicture.hide()
                        this.el.containerTakePicture.show()
                        this.el.panelMessagesContainer.show()
                    })
            }



            console.log('photo array ', result)
        })

        this.el.btnAttachContact.on('click', e => {

            // console.log(this)
            this._contactsController = new ContactsController(this.el.modalContacts, this._user)

            this._contactsController.on('select', contact => {
                Message.sendContact(
                    this._activeContact.chatId,
                    this._user.email,
                    contact
                )
            })

            this._contactsController.open(this._activeContact.email)

        })
        this.el.btnCloseModalContacts.on('click', e => {

            this._contactsController.close()
            // this.el.modalContacts.hide()
        })

        this.el.btnAttachDocument.on('click', e => {
            // this.closeAllMainPanel()
            // this.el.panelDocumentPreview.addClass('open')
            // this.el.panelDocumentPreview.css({'height':'calc(100% - 120px)'})

            this.el.inputDocument.click()
        })
        this.el.inputDocument.on('change', e => {

            this.el.panelDocumentPreview.css({
                'height': '1%'
            })

            if (this.el.inputDocument.files.length) {
                let file = this.el.inputDocument.files[0]

                this.closeAllMainPanel();
                this.el.panelMessagesContainer.hide();
                this.el.panelDocumentPreview.addClass('open');
                // this.el.panelDocumentPreview.sleep(500, () => {
                this.el.panelDocumentPreview.style.height = 'calc(100% - 120px)'
                // });

                this._documentPreviewController = new DocumentPreviewController(file)

                this._documentPreviewController.getPreviewData().then(result => {

                    console.log('document preview ok >>> ', result)


                    this.el.imgPanelDocumentPreview.src = result.src
                    this.el.infoPanelDocumentPreview.innerHTML = result.info

                    // console.log('imgPanelDocumentPreview.src >>> ', this.el.imgPanelDocumentPreview.src)
                    // console.log('infoPanelDocumentPreview.innerHTML >>> ', this.el.infoPanelDocumentPreview.innerHTML)


                    this.el.filePanelDocumentPreview.hide()
                    this.el.imagePanelDocumentPreview.show()
                    this.el.imgPanelDocumentPreview.show()
                    // console.log(this.el.imgPanelDocumentPreview.show())
                    // this.el.imgPanelDocumentPreview.style.height = '100%'                

                    // this.el.panelDocumentPreview.css({
                    //     'height':'calc(100% - 120px)'
                    // })

                }).catch(err => {
                    // this.el.panelDocumentPreview.css({
                    //     'height':'calc(100% - 120px)'
                    // })
                    if (err.error) {
                        console.log(event.event)
                    } else {
                        switch (file.type) {
                            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                            case 'application/msword':
                                this.el.iconPanelDocumentPreview.classList.value = 'jcxhw icon-doc-doc';
                                break;

                            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                            case 'application/vnd.ms-excel':
                                this.el.iconPanelDocumentPreview.classList.value = 'jcxhw icon-doc-xls';
                                break;

                            case 'application/vnd.ms-powerpoint':
                            case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                                this.el.iconPanelDocumentPreview.classList.value = 'jcxhw icon-doc-ppt';
                                break;

                            default:
                                this.el.iconPanelDocumentPreview.classList.value = 'jcxhw icon-doc-generic'
                                break
                        }
                        this.el.filenamePanelDocumentPreview.innerHTML = file.name


                        this.el.filePanelDocumentPreview.show()
                        this.el.imagePanelDocumentPreview.hide()


                    }

                    // console.log('document preview err >>> ', err)
                })

                // console.log('file console >>> ', file)
            }

        })


        this.el.btnClosePanelDocumentPreview.on('click', e => {

            this.closeAllMainPanel()
            this.el.panelMessagesContainer.show()
        })
        this.el.btnSendDocument.on('click', e => {

            let file = this.el.inputDocument.files[0]
            let base64 = this.el.imgPanelDocumentPreview.src

            if (file.type === 'application/pdf') {

                Base64.toFile(base64).then(filePreview => {
                    Message.sendDocument(this._activeContact.chatId,
                        this._user.email,
                        file,
                        filePreview,
                        this.el.infoPanelDocumentPreview.innerHTML) // if pdf, last parameter has the number of pages
                })
            } else {
                Message.sendDocument(this._activeContact.chatId,
                    this._user.email,
                    file)
            }

            this.el.btnClosePanelDocumentPreview.click()

            // console.log('send document')
        })
        this.el.btnSendMicrophone.on('click', e => {
            this.el.recordMicrophone.show()
            this.el.btnSendMicrophone.hide()
            // this.startRecordMicrophoneTimer()

            this._microphoneController = new MicrophoneController()



            this._microphoneController.on('ready', audio => {
                console.log('recebendo evento ready >>> ', audio)
                this._microphoneController.startRecorder()
            })

            this._microphoneController.on('timerStarted', time => {
                this.el.recordMicrophoneTimer.innerHTML = Format.toTime(time)
            })
        })
        this.el.btnCancelMicrophone.on('click', e => {
            this._microphoneController.stopRecorder()
            this.closeRecordMicrophone()
        })
        this.el.btnFinishMicrophone.on('click', e => {

            this._microphoneController.on('recorded', (file, metadata) => {
                Message.sendAudio(
                    this._activeContact.chatId,
                    this._user.email,
                    file,
                    metadata,
                    this._user.photo // url da photo
                )
            })
            this._microphoneController.stopRecorder()
            this.closeRecordMicrophone()
        })
        this.el.inputText.on('keyup', e => {
            if (e.key === 'Enter' && !e.ctrlKey) {
                e.preventDefault()
                this.el.btnSend.click()
            }
        })
        this.el.inputText.on('keyup', e => {
            if (this.el.inputText.innerHTML.length) {
                this.el.inputPlaceholder.hide()
                this.el.btnSendMicrophone.hide()
                this.el.btnSend.show()
            } else {
                this.el.inputPlaceholder.show()
                this.el.btnSendMicrophone.show()
                this.el.btnSend.hide()
            }
        })

        this.el.btnSend.on('click', e => {

            let indiceBug = this.el.inputText.innerHTML.indexOf('<div>')
            if (indiceBug === -1)
                indiceBug = this.el.inputText.innerHTML.length

            // console.log('sem substring >>> ', this.el.inputText.innerHTML)
            // console.log('substring >>> ', this.el.inputText.innerHTML.substring(0, indiceBug))
            // activeContact é criado dentro do método 
            // setActiveChat e é recuperado do initContacts
            // O método send recebe 4 paramêtros. O id do 
            // chat, o remetente, o tipo de mensagem, e o conteúdo 
            // propriamente dito
            Message.send(
                this._activeContact.chatId,
                this._user.email,
                'text',
                this.el.inputText.innerHTML.substring(0, indiceBug))
            this.el.inputText.innerHTML = ''
            this.el.panelEmojis.removeClass('open')

        })
        this.el.btnEmojis.on('click', e => {
            this.el.panelEmojis.toggleClass('open')
        })
        this.el.panelEmojis.querySelectorAll('.emojik').forEach(emoji => {
            emoji.on('click', e => {
                console.log('emoji >>> ', emoji.dataset)
                let img = this.el.imgEmojiDefault.cloneNode()
                img.style.cssText = emoji.style.cssText
                img.dataset.unicode = emoji.dataset.unicode
                img.alt = emoji.dataset.unicode
                img.dataset.emojiIndex = emoji.dataset.emojiIndex
                emoji.classList.forEach(name => {
                    img.classList.add(name)
                })
                // console.log('img >>> ', img.dataset)


                let cursor = window.getSelection()
                if (!cursor.focusNode || !cursor.focusNode.id == 'input-text') {
                    this.el.inputText.focus()
                    cursor = window.getSelection()
                }
                let range = document.createRange()

                range = cursor.getRangeAt(0)
                range.deleteContents()

                let frag = document.createDocumentFragment()
                frag.appendChild(img)

                range.insertNode(frag)
                range.setStartAfter(img)
                // console.log(img.dataset.unicode)
                this.el.inputText.dispatchEvent(new Event('keyup'))
                // this.el.inputText.appendChild(img)
                this.el.inputText.focus()
            })
        })

    }

    // startRecordMicrophoneTimer(){
    //     let start = Date.now()
    //     this._recordMicrophoneInterval = setInterval(()=>{
    //         this.el.recordMicrophoneTimer.innerHTML = Format.toTime(Date.now() - start)
    //     }, 100)
    // }

    closeRecordMicrophone() {
        this.el.recordMicrophone.hide()
        this.el.btnSendMicrophone.show()
        // clearInterval(this._recordMicrophoneInterval)
        this.el.recordMicrophoneTimer.innerHTML = '0:00'
    }

    closeAllMainPanel() {
        this.el.panelMessagesContainer.hide()
        this.el.panelDocumentPreview.removeClass('open')
        this.el.panelCamera.removeClass('open')
    }

    closeMenuAttach(e) {
        document.removeEventListener('click', this.closeMenuAttach)
        this.el.menuAttach.removeClass('open')
        // console.log('remove attach menu event and close')
    }

    closeLeftPanels() {
        this.el.panelEditProfile.hide();
        this.el.panelAddContact.hide();
    }

}