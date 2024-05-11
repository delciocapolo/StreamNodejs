import axios from "axios";
import { Transform, Writable } from "node:stream";

const url = 'http://localhost:4001';

async function consume() {
    // uma grande observacao, eh que o [responseType], eh responsavel por ir entregando os dados no usuario
    // sem ter que esperar o request terminar
    const response = await axios({
        url,
        method: 'get',
        responseType: 'stream'
    });

    return response.data;
}

const stream = await consume();
stream
    .pipe(
        new Transform({
            // chunk: eh o pedaco do arquivo que chegou
            // enc: formato de texto que ele ve
            transform(chunk, enc, cb) {
                const item = JSON.parse(chunk);
                // nesta regex, o:
                // d: refere-se ao digito
                // +: refere-se a, possibilidade, de haver mais de um digito
                // caso nao tivesse o (+), no (d), ele retornaria somente o primeiro digito
                const myNumber = /\d+/.exec(item.name)[0];
                let name = item.name;

                if (myNumber % 2 === 0) name = name.concat(' eh par');
                else name = name.concat(' eh impar');

                item.name = name;
                cb(null, JSON.stringify(item))
            }
        })
    )
    .pipe(
        new Writable({
            write(chunk, enc, cb) {
                console.log('Chegou', chunk.toString());
                cb()
            }
        })
    )
