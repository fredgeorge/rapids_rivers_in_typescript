/*
 * Copyright (c) 2022 by Fred George
 * @author Fred George  fredgeorge@acm.org
 * Licensed under the MIT License; see LICENSE file in root.
 */

import Rules from "../validation/rules";
import {Packet} from "../packets/packet";
import Status from "../validation/status";

export interface RapidsConnection {
    register(listener: Service): void
    publish(packet: RapidsPacket): void
}

export interface MessageListener {
    message(connection: RapidsConnection, message: string): void
}

export interface Service {
    name: string
    rules: Rules

    isStillAlive(connection: RapidsConnection): boolean  // isStillAlive

    packet(connection: RapidsConnection, packet: Packet, information: Status): void

    rejectedPacket(connection: RapidsConnection, packet: Packet, information: Status): void
}

export interface SystemService extends Service {

    invalidFormat(connection: RapidsConnection, invalidString: string, problems: Status): void

    loopDetected(connection: RapidsConnection, packet: Packet)
}

export interface RapidsPacket {
    toJsonString(): string         // toJsonString
}
