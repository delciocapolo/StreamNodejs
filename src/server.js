import { randomUUID } from "node:crypto";
import http from "node:http";
import { Readable } from "node:stream";

// func generator
function* run() {
    for (let index = 0; index <= 99; index++) {
        const data = {
            id: randomUUID(),
            name: `Delcio-${index}`
        };
        yield data;
    }
}

async function handler(request, response) {
    const readable = new Readable({
        read() {
            // o fluxo de leitura e escrita vai funcionar basicamente assim:
            // a medida que os dados estiverem disponiveis no  primeiro for, e ele ir entregando os valores
            // o segundo for, vai lendo esses dados e escrevendo ou retornando pro pipe
            // e o pipe, retornando pro usuario final
            for (const data of run()) {
                console.log(data);
                this.push(JSON.stringify(data) + "\n");
            }
            // para informar que os dados terminaram eh com:
            this.push(null);
        }
    });

    // o pip eh responsavel por geenciar os dados
    readable
        .pipe(response)
}

const server = http.createServer(handler);

server.listen(4001)
    .on('listening', () => console.log("Server is running"));