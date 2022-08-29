/*
 * Copyright (c) 2022 by Fred George
 * @author Fred George  fredgeorge@acm.org
 * Licensed under the MIT License; see LICENSE file in root.
 */

class Packet {
    originalJsonString: string;

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
        // return Date.parse(this[dateKey]) if typeof this[dateKey] == string else this[datekey]
        return Date.parse(this[dateKey] as unknown as string)
    }

    toJsonString(): string {
        const { originalJsonString, ...packetFields } = this;
        return JSON.stringify(packetFields)
    }
}

exports.Packet = Packet
