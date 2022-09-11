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
        console.log(` [*] Received ${packet.toJsonString()}`);
    }

    rejectedPacket(connection: RapidsConnection, packet: Packet, information: Status): void {
    }
}

new RabbitMqConnection("localhost", 5672).register(new Monitor())
