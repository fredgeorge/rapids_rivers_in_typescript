#!/usr/bin/env node

/*
 * Copyright (c) 2022 by Fred George
 * @author Fred George  fredgeorge@acm.org
 * Licensed under the MIT License; see LICENSE file in root.
 */

import {RapidsConnection, SystemService} from "../../main/rapids/rapids_connection";
import {Rules} from "../../main/validation/rules";
import {Packet} from "../../main/packets/packet";
import {Status} from "../../main/validation/status";
import {RabbitMqConnection} from "../../main/rapids/rabbit_mq_rapids_connection";

class Monitor implements SystemService {
    isSystemService: boolean = true;
    name: string = "Monitor"
    rules: Rules = new Rules();

    packet(connection: RapidsConnection, packet: Packet, information: Status): void {
        console.log(` [*] Received valid packet:\n\t\t${packet.toJsonString()}`);
    }

    rejectedPacket(connection: RapidsConnection, packet: Packet, information: Status): void {
        console.log(` [x] ERROR: The following packet was erroneously rejected:\n\t\t${packet.toJsonString()}`);
    }

    invalidFormat(connection: RapidsConnection, invalidString: string, err: Error) {
        console.log(` [*] Received invalid JSON formatted message:\n\t\t${invalidString}`);
    }
}

new RabbitMqConnection("localhost", 5672).register(new Monitor())
