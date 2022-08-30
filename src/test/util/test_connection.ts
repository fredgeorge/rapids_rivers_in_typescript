/*
 * Copyright (c) 2022 by Fred George
 * @author Fred George  fredgeorge@acm.org
 * Licensed under the MIT License; see LICENSE file in root.
 */

import {RapidsConnection, RapidsPacket, Service} from "../../main/rapids/rapids_connection";
import {River} from "../../main/rivers/river";

class TestConnection implements RapidsConnection {
    maxReadCount: number
    rivers: River[] = []
    messages: string[] = []
    allPackets: RapidsPacket[] = []
    allMessages: string[] = []

    constructor(maxReadCount = 9) {
        this.maxReadCount = maxReadCount
    }

    register(service: Service) {
        let river = new River(this, service.rules, this.maxReadCount)
        river.register(service)
        this.rivers.push(river)
    }

    publish(packet: RapidsPacket) {
        this.allPackets.push(packet)
        this.publishString(packet.toJsonString())
    }

    publishString(message: string) {
        this.allMessages.push(message)
        if (this.messages.length > 0) this.messages.push(message)
        else {
            this.messages.push(message)
            while (this.messages.length > 0) {
                let nextMessage = this.messages[0]
                this.rivers.forEach((river) => river.message(this, nextMessage))
                this.messages.shift()
            }
        }
    }
}
