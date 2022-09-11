/*
 * Copyright (c) 2022 by Fred George
 * @author Fred George  fredgeorge@acm.org
 * Licensed under the MIT License; see LICENSE file in root.
 */

import {RapidsConnection, RapidsPacket, Service} from "./rapids_connection";
import {River} from "../rivers/river";
import * as Amqp from "amqp-ts";
import {Connection, Exchange, Queue} from "amqp-ts";

export class RabbitMqConnection implements RapidsConnection {
    private rivers: River[] = []
    private maxReadCount: number;
    private connection: Connection;
    private exchange: Exchange;

    constructor(host: string, port: string | number, maxReadCount: number = 9) {
        this.maxReadCount = maxReadCount;
        this.connection = new Amqp.Connection(`amqp://${host}:${Number(port)}`);
        this.exchange = this.connection.declareExchange('rapids', 'fanout', {durable: true, autoDelete: true});
    }

    register(service: Service): void {
        let river = new River(this, service.rules, this.maxReadCount)  // No sharing of Rivers (yet)
        river.register(service)
        this.rivers.push(river)
        this.configureQueueForRiver(service.name)  // Dedicated queue for each River
        console.log(` [*] Waiting for messages in ${service.name}. To exit press CTRL+C`);
    }

    publish(packet: RapidsPacket) {
        this.exchange.send(new Amqp.Message(packet.toJsonString()));
    }

    private configureQueueForRiver(queueName: string) {
        const queue: Queue = this.connection.declareQueue(queueName);
        queue.bind(this.exchange);
        queue.activateConsumer((message) => {
            this.rivers.forEach(r => r.message(this, message.content.toString()))
        });
    }
}