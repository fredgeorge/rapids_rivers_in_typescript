/*
 * Copyright (c) 2022 by Fred George
 * @author Fred George  fredgeorge@acm.org
 * Licensed under the MIT License; see LICENSE file in root.
 */

import {Rules} from "../validation/rules";
import {Status} from "../validation/status";
import {RapidsPacket, Service} from "../rapids/rapids_connection";
import {HEART_BEAT_RESPONDER_KEY, SYSTEM_COMMUNITY_VALUE, SYSTEM_READ_COUNT_KEY} from "./constants";
import {HeartBeat} from "./heart_beat_packet";

export class Packet implements RapidsPacket {
    originalJsonString: string;
    [key: string]: any

    constructor(jsonString: string = '{}') {
        this.originalJsonString = jsonString;
        Object.assign(this, JSON.parse(jsonString, function (key, value) {  // Create Packet properties for each JSON element
            if (value == null) return undefined     // null counts as "missing"
            if (value == '') return undefined       // empty string counts as "missing"
            if (value == []) return undefined       // empty array counts as "missing"
            return value
        }));
    }

    dateTime(key: string) {
        type ObjectKey = keyof typeof this;
        const dateKey = key as ObjectKey;
        return Date.parse(this[dateKey] as unknown as string)
    }

    toJsonString(): string {
        const { originalJsonString, ...packetFields } = this;
        return JSON.stringify(packetFields)
    }

    evaluate(rules: Rules): Status {
        let status = new Status(this.originalJsonString)
        rules.assess(this, status)
        return status
    }

    has(key): boolean {
        return this[key] !== undefined
    }

    isSystem(): boolean {
        return this.community == SYSTEM_COMMUNITY_VALUE;
    }

    isHeartBeat(): boolean {
        let status = this.evaluate(HeartBeat.rules())
        return !status.hasErrors()
    }

    hasInvalidReadCount(maxCount: number) {
        return maxCount != 0 && this.readCount() > maxCount
    }

    private readCount() {
        let result = this.has(SYSTEM_READ_COUNT_KEY) ? this[SYSTEM_READ_COUNT_KEY] + 1 : 1;
        this[SYSTEM_READ_COUNT_KEY] = result;
        return result;
    }

    toHeartBeatResponse(service: Service) : Packet {
        let result = new Packet(this.originalJsonString);
        result[HEART_BEAT_RESPONDER_KEY] = service.name;
        return result;
    }
}
