/*
 * Copyright (c) 2022 by Fred George
 * @author Fred George  fredgeorge@acm.org
 * Licensed under the MIT License; see LICENSE file in root.
 */

import {Rules} from "../validation/rules";
import {RapidsConnection, MessageListener, Service} from "../rapids/rapids_connection";

export class River implements MessageListener {
    listeners: Service[] = []
    systemListeners: Service[] = []

    constructor(connection: RapidsConnection, rules: Rules, maxReadCount: number) {

    }

    message(connection: RapidsConnection, message: string): void {
    }

    register(service: Service) {
        this.listeners.push(service)
    }


}