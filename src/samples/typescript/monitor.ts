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
    name: string = `Monitor [${Math.random()}]`;
    rules: Rules = new Rules()
        // Specify constraints here (Monitor has no constraints deliberately)
        // .requireValue('key1', 'value1')   // This requires that the key-value pair exists
        // .requireValue('key2', 42.7)  // This requires that the key-value pair exists
        // .requireValue('key3', true)  // This requires that the key-value pair exists
        // .requireKeys('key4', 'key5', 'key6')    // This requires that all these keys exist
        // .forbidKeys('key7', 'key8')   // This forbids the existence of all of these keys
    ;

    // Required API for any Service; invoked when Packet matches Rules
    packet(connection: RapidsConnection, packet: Packet, information: Status): void {
        console.log(` [*] Received valid packet:\n\t\t${packet.toJsonString()}`);
    }

    // Optional API for any Service; useful for debugging 'why' a Packet was rejected
    rejectedPacket(connection: RapidsConnection, packet: Packet, problems: Status): void {
        console.log(` [x] ERROR: The following packet was erroneously rejected:\n\t\t${problems.toString()}`);
    }

    // Special optional API only for SystemServices; allows detection of deviant (non-JSON) messages
    invalidFormat(connection: RapidsConnection, invalidString: string, err: Error) {
        console.log(` [x] Received invalid JSON formatted message:\n\t\t${invalidString}`);
    }
}

if (process.argv.length != 4) throw 'Invoke this service with two parameters: host IP as a string, and port (string or number)'
new RabbitMqConnection(process.argv[2], process.argv[3]).register(new Monitor())  // This is all it takes to start a Service!
