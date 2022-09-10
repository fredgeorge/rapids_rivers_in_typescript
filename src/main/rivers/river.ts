/*
 * Copyright (c) 2022 by Fred George
 * @author Fred George  fredgeorge@acm.org
 * Licensed under the MIT License; see LICENSE file in root.
 */

import {Rules} from "../validation/rules";
import {RapidsConnection, MessageListener, Service, SystemService} from "../rapids/rapids_connection";
import {Packet} from "../packets/packet";
import {Status} from "../validation/status";
import {StartUpPacket} from "../packets/start_up_packet";

export class River implements MessageListener {
    private readonly connection: RapidsConnection;
    private readonly rules: Rules
    private readonly maxReadCount: number;
    private readonly listeners: Service[] = []
    private readonly systemListeners: SystemService[] = []

    constructor(connection: RapidsConnection, rules: Rules, maxReadCount: number) {
        this.connection = connection;
        this.rules = rules;
        this.maxReadCount = maxReadCount;
    }

    message(connection: RapidsConnection, message: string): void {
        try {
            let packet = new Packet(message);
            if (packet.hasInvalidReadCount(this.maxReadCount)) {
                this.triggerLoopDetection(connection, packet);
                return;
            }
            if (packet.isHeartBeat()) this.triggerHeartBeatResponse(connection, packet)
            let status = packet.evaluate(this.rules);
            let listeners = packet.isSystem() ? this.systemListeners : this.listeners;
            if (status.hasErrors()) this.triggerRejectedPacket(listeners, connection, packet, status)
            else this.triggerAcceptedPacket(listeners, connection, packet, status)
        } catch (err) {
            this.triggerInvalidFormat(connection, message, err)
        }
    }

    register(service: Service) {
        this.listeners.push(service)
        if (service.isSystemService) this.systemListeners.push(service)
        this.connection.publish(new StartUpPacket(service))
    }

    private triggerAcceptedPacket(services: Service[], connection: RapidsConnection, packet: Packet, information: Status) {
        services.forEach(s => s.packet(connection, packet, information))
    }

    private triggerRejectedPacket(services: Service[], connection: RapidsConnection, packet: Packet, problems: Status) {
        services.forEach(s => s.rejectedPacket(connection, packet, problems))
    }

    private triggerInvalidFormat(connection: RapidsConnection, message: string, err: Error) {
        this.systemListeners.forEach(s => s.invalidFormat(connection, message, err))
    }

    private triggerHeartBeatResponse(connection: RapidsConnection, packet: Packet) {
        this.listeners.forEach(s => {
                if (s.isStillAlive == undefined || s.isStillAlive(connection) == true)
                    connection.publish(packet.toHeartBeatResponse(s));
            }
        )
    }

    private triggerLoopDetection(connection: RapidsConnection, packet: Packet) {
        this.systemListeners.forEach(s => s.loopDetected(connection, packet))
    }
}