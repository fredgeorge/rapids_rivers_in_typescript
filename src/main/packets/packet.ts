/*
 * Copyright (c) 2022 by Fred George
 * @author Fred George  fredgeorge@acm.org
 * Licensed under the MIT License; see LICENSE file in root.
 */

class Packet {
    originalJsonString: string;
    map: Map<string, any>

    constructor(jsonString: string = '{}') {
        this.originalJsonString = jsonString;
        this.map = new Map(Object.entries(JSON.parse(jsonString)))
    }

    get(key: string) {
        return this.map.get(key);
    }

    dateTime(key: string) {
        return Date.parse(this.map.get(key))
    }
}

exports.Packet = Packet
