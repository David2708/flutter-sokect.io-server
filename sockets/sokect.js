
const {io} = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand( new Band( 'Queen' ) );
bands.addBand( new Band( 'Bon Jovi' ) );
bands.addBand( new Band( 'Héroes del silencio' ) );
bands.addBand( new Band( 'Metallica' ) );

//Mensajes de sockets
io.on('connection', client => {

    console.log('Cliente conectado')

    client.emit('active-bands', bands.getBands())

    client.on('disconnect', () => {
        console.log('Cliente desconectado')
    });

    client.on('mensaje', ( payload ) => {
        console.log('Mensaje!!! ', payload);

        io.emit( 'mensaje', {admin: 'Nuevo mensaje'} );
    });

    // client.on('emitir-mensaje', ( payload ) => {
    //     // io.emit('nuevo-mensaje', payload );// emite a todos los clientes
    //     client.broadcast.emit('nuevo-mensaje', payload ); //emite a todos menos el qu elo emitio
    // });


    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands())
    });

    client.on('add-band', ( payload ) => {
        bands.addBand( new Band( payload.name ) )
        io.emit('active-bands', bands.getBands())
    })

    client.on('delete-band', (payload) => {
        console.log(payload);
        bands.deleteBand( payload.id );
        io.emit('active-bands', bands.getBands())
    })

});