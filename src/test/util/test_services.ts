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
    name: string = "SampleService";
    rules: Rules;
    isSystemService: boolean;
    acceptedPackets: Packet[]= [];
    rejectedPackets: Packet[]= [];
    informationStatuses: Status[]= [];
    problemStatuses: Status[]= [];
    formatProblems: string[] = [];
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

    invalidFormat(connection: RapidsConnection, invalidString: string, problems: Status): void {
        this.formatProblems.push(invalidString);
    }

    loopDetected(connection: RapidsConnection, packet: Packet) {
        this.loopPackets.push(packet);
    }
}

export class DeadService extends SampleService {

    isStillAlive(connection: RapidsConnection): boolean {
        return false;
    }
}