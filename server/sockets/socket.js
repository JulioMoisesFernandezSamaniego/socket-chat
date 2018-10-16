const { io } = require('../server');

const {Usuarios} = require('../classes/usuarios')

const {crearMensaje}= require('../utilidades/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    //configuramos el entrarChat
    client.on('entrarChat', (data,callback)=>{

        if(!data.nombre || !data.sala){
            return callback({
                error: true,
                message: 'El nombre y la sala son  nesecarios'
            })
        }

        //conectados a los usuarios a salas
        client.join(data.sala);

        usuarios.agregarPersona(client.id, data.nombre,data.sala);

        client.broadcast.to(data.sala).emit('listaPersonas',usuarios.getPersonasPorSala(data.sala));

        callback(usuarios.getPersonasPorSala(data.sala));

    })

    //procesa el mensaje
    client.on('crearMensaje', (data)=>{

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje',mensaje);
    })

    client.on('disconnect', ()=>{
        let personaBorrada=usuarios.borrarPersona(client.id);

        //llamamos a la funcion crear mensaje de utilidades
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador',`${personaBorrada.nombre} salio`))
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas',usuarios.getPersonasPorSala(personaBorrada.sala));
    })

    //mensajes privados 
    client.on('mensajePrivado', data=>{
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje))
    })

});