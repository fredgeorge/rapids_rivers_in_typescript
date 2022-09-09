/*
 * Copyright (c) 2022 by Fred George
 * @author Fred George  fredgeorge@acm.org
 * Licensed under the MIT License; see LICENSE file in root.
 */

import {RapidsPacket, Service} from "../rapids/rapids_connection";
import {
    COMMUNITY_KEY,
    PACKET_TYPE_KEY,
    SYSTEM_PURPOSE_KEY,
    SERVICE_NAME_KEY,
    START_UP_SYSTEM_PURPOSE_VALUE,
    SYSTEM_COMMUNITY_VALUE,
    SYSTEM_PACKET_TYPE_VALUE
} from "./constants";

export class StartUpPacket implements RapidsPacket {
    serviceName: string

    constructor(service: Service) {
        this.serviceName = service.name;
    }

    toJsonString(): string {
        return JSON.stringify(Object.fromEntries(new Map<string, string>(
            [
                [COMMUNITY_KEY, SYSTEM_COMMUNITY_VALUE],
                [PACKET_TYPE_KEY, SYSTEM_PACKET_TYPE_VALUE],
                [SYSTEM_PURPOSE_KEY, START_UP_SYSTEM_PURPOSE_VALUE],
                [SERVICE_NAME_KEY, this.serviceName]
            ]
        )));
    }
}
