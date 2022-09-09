/*
 * Copyright (c) 2022 by Fred George
 * @author Fred George  fredgeorge@acm.org
 * Licensed under the MIT License; see LICENSE file in root.
 */

import {Rules} from "../validation/rules";
import {
    COMMUNITY_KEY,
    HEART_BEAT_GENERATOR_KEY,
    HEART_BEAT_INDEX_KEY,
    HEART_BEAT_RESPONDER_KEY,
    HEART_BEAT_SYSTEM_PURPOSE_VALUE,
    PACKET_TYPE_KEY,
    SYSTEM_COMMUNITY_VALUE,
    SYSTEM_PACKET_TYPE_VALUE,
    SYSTEM_PURPOSE_KEY
} from "./constants";

export class HeartBeat {
    private index: number = 0
    private generatorId: string = '42'

    static rules() {
        return new Rules()
            .requireValue(COMMUNITY_KEY, SYSTEM_COMMUNITY_VALUE)
            .requireValue(PACKET_TYPE_KEY, SYSTEM_PACKET_TYPE_VALUE)
            .requireValue(SYSTEM_PURPOSE_KEY, HEART_BEAT_SYSTEM_PURPOSE_VALUE)
            .requireKeys(HEART_BEAT_GENERATOR_KEY, HEART_BEAT_INDEX_KEY)
            .forbidKeys(HEART_BEAT_RESPONDER_KEY)
    }

    toJsonString() {
        this.index += 1
        return this.jsonString()
    }

    private jsonString() {
        return JSON.stringify(Object.fromEntries(new Map<string, string | number>(
            [
                [COMMUNITY_KEY, SYSTEM_COMMUNITY_VALUE],
                [PACKET_TYPE_KEY, SYSTEM_PACKET_TYPE_VALUE],
                [SYSTEM_PURPOSE_KEY, HEART_BEAT_SYSTEM_PURPOSE_VALUE],
                [HEART_BEAT_GENERATOR_KEY, 'heart beat ' + this.generatorId],
                [HEART_BEAT_INDEX_KEY, this.index]
            ]
        )));
    }
}
