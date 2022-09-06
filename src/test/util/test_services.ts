/*
 * Copyright (c) 2022 by Fred George
 * @author Fred George  fredgeorge@acm.org
 * Licensed under the MIT License; see LICENSE file in root.
 */

import {RapidsConnection, Service} from "../../main/rapids/rapids_connection";
import {Packet} from "../../main/packets/packet";
import {Status} from "../../main/validation/status";

export class SampleService implements Service {
    name: "SampleService";
    rules;

    constructor(rules) {
        this.rules = rules;
    }

    isStillAlive(connection: RapidsConnection): boolean {
        return true;
    }

    packet(connection: RapidsConnection, packet: Packet, information: Status): void {
    }

    rejectedPacket(connection: RapidsConnection, packet: Packet, information: Status): void {
    }
}