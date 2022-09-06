/*
 * Copyright (c) 2022 by Fred George
 * @author Fred George  fredgeorge@acm.org
 * Licensed under the MIT License; see LICENSE file in root.
 */

import {Rules} from "../validation/rules";
import {Packet} from "../packets/packet";
import {Status} from "../validation/status";
import {RapidsConnection} from "../rapids/rapids_connection";

export interface Service {
    name: string
    rules: Rules

    (connection: RapidsConnection): boolean  // isStillAlive

    (connection: RapidsConnection, packet: Packet, information: Status): void

}