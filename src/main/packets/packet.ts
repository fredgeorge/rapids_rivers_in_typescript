/*
 * Copyright (c) 2022 by Fred George
 * @author Fred George  fredgeorge@acm.org
 * Licensed under the MIT License; see LICENSE file in root.
 */

import {Rules} from "../validation/rules";
import {Status} from "../validation/status";
import {RapidsPacket} from "../rapids/rapids_connection";

export class Packet implements RapidsPacket {
    originalJsonString: string;
    [key: string]: any

    constructor(jsonString: string = '{}') {
        this.originalJsonString = jsonString;
        Object.assign(this, JSON.parse(jsonString, function (key, value) {
            if (value == null) return undefined
            if (value == '') return undefined
            if (value == []) return undefined
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
}
