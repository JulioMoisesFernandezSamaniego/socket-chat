var socket = io();

//leer los datos del user
var params = new URLSearchParams( window.location.search);

if( !params.has('nombre') || !params.has('sala')){
    window.location= 'index.html';
    throw new Error('El nombre y sala son nesecarios');
}

var usuario= {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');

    //nos identificamos con el backend
    socket.emit('entrarChat',usuario, function(resp){
        console.log('Usuarios conectados ',resp)
    })  

});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Envia el mensaje
/*socket.emit('crearMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});*/

// recibe el mensaje
socket.on('crearMensaje', function(mensaje){
    console.log('Servidor ',mensaje);
})

//cuando un usuario entra o sale del chat

socket.on('listaPersonas', function(personas){
    console.log(personas);
})

//mensajes provados
socket.on('mensajePrivado',function(mensaje){
    console.log('Mensaje Privado:', mensaje);
})