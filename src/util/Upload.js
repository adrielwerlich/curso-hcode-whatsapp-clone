import { Firebase } from './Firebase'
export class Upload {
    static send(fileToSend, from) {
        return new Promise((s, f) => {
            let uploadTask = Firebase.hd().ref(from).child(Date.now() + '_' + fileToSend.name).put(fileToSend)

            // 3 funções retornam:
            // 1- o progresso do upload (barra de progresso) ; 
            // 2- indica o acontecimento de algum erro; 
            // 3- indica finalização bem sucedida da tarefa de upload )
            uploadTask.on('state_changed', e => {
                console.info('uploading image >> ', e) // 1º retorno
            }, err => {
                console.error('erro no envio da imagem >> ', err) // 2º retorno
            }, () => {
                let downRef = uploadTask.snapshot.ref
                downRef.getDownloadURL().then(url => {
                    s(url)
                })

            })
        })
    }
}