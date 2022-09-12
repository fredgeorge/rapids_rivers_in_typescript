/*
 * Copyright (c) 2022 by Fred George
 * @author Fred George  fredgeorge@acm.org
 * Licensed under the MIT License; see LICENSE file in root.
 */

import {RapidsConnection, SystemService} from "../../main/rapids/rapids_connection";
import {Packet} from "../../main/packets/packet";
import {Status} from "../../main/validation/status";
import {Rules} from "../../main/validation/rules";

export class SampleService implements SystemService {
    name: string = "SampleService" + Math.random();
    rules: Rules;
    isSystemService: boolean;
    acceptedPackets: Packet[]= [];
    rejectedPackets: Packet[]= [];
    informationStatuses: Status[]= [];
    problemStatuses: Status[]= [];
    invalidStrings: string[] = [];
    loopPackets: Packet[] = [];

    constructor(rules, isSystemService: boolean = false) {
        this.rules = rules;
        this.isSystemService = isSystemService;
    }

    isStillAlive(connection: RapidsConnection): boolean {
        return true;
    }

    packet(connection: RapidsConnection, packet: Packet, information: Status): void {
        this.acceptedPackets.push(packet);
        this.informationStatuses.push(information)
    }

    rejectedPacket(connection: RapidsConnection, packet: Packet, information: Status): void {
        this.rejectedPackets.push(packet);
        this.problemStatuses.push(information)
    }

    invalidFormat(connection: RapidsConnection, invalidString: string, err: Error): void {
        this.invalidStrings.push(invalidString);
    }

    loopDetected(connection: RapidsConnection, packet: Packet) {
        this.loopPackets.push(packet);
    }
}

export class DeadService extends SampleService {
    name: string = `DeadService [${Math.random()}]`

    constructor() {
        super(new Rules());
    }

    isStillAlive(connection: RapidsConnection): boolean {
        return false;
    }
}

export class LinkedService extends SampleService{
    name: string = `LinkedService [${Math.random()}]`
    private readonly forbiddenKeys: string[];

    constructor(requiredKeys: string[], forbiddenKeys: string[]) {
        super(new Rules().requireKeys(...requiredKeys).forbidKeys(...forbiddenKeys))
        this.forbiddenKeys = forbiddenKeys;
    }

    packet(connection: RapidsConnection, packet: Packet, information: Status) {
        if (this.forbiddenKeys.length != 0) {
            packet[this.forbiddenKeys[0]] = true;
            connection.publish(packet);
        }
        super.packet(connection, packet, information);
    }
}

export class OnlyLoopsService implements SystemService {
    name: string = `OnlyLoopsService [${Math.random()}]`;
    rules: Rules = new Rules();
    isSystemService: boolean = true;
    readonly validPackets: Packet[] = [];
    readonly loopPackets: Packet[] = [];

    loopDetected(connection: RapidsConnection, packet: Packet) {
        this.loopPackets.push(packet);
    }

    packet(connection: RapidsConnection, packet: Packet, information: Status): void {
        this.validPackets.push(packet);
    }
}

export class OnlyInvalidJsonService implements SystemService {
    name: string = `OnlyInvalidJsonService [${Math.random()}]`;
    rules: Rules = new Rules();
    isSystemService: boolean = true;
    readonly validPackets: Packet[] = [];
    readonly invalidStrings: string[] = [];

    packet(connection: RapidsConnection, packet: Packet, information: Status): void {
        this.validPackets.push(packet);
    }

    invalidFormat(connection: RapidsConnection, invalidString: string, err: Error) {
        this.invalidStrings.push(invalidString);
    }
}
