/*
 * Copyright (c) 2022 by Fred George
 * @author Fred George  fredgeorge@acm.org
 * Licensed under the MIT License; see LICENSE file in root.
 */

import Packet from "../packets/packet";
import Status from "./status";


class Rules {
    requiredKeys : string[] = []
    forbiddenKeys : string[] = []
    requiredValues: {key: string, value: any}[] = []

    assess(packet: Packet, status: Status) {
        this.confirmRequiredValues(packet, status)
        this.confirmRequiredKeys(packet, status)
        this.confirmForbiddenKeys(packet, status)
    }

    requireKeys(...keys: string[]) : Rules {
        this.requiredKeys.push(...keys);
        return this;        // Support chaining during construction
    }

    forbidkeys(...keys: string[]) : Rules {
        this.forbiddenKeys.push(...keys);
        return this;        // Support chaining during construction
    }

    requireValue(key: string, value: any) : Rules {
        this.requiredValues.push({key, value})
        return this;        // Support chaining during construction
    }

    confirmRequiredValues(packet: Packet, status: Status) {
        this.requiredValues.forEach((pair) => {
            if (!packet.has(pair.key)) status.unexpectedlyMissing(pair.key)
            else if (packet[pair.key] == pair.value) status.foundValue(pair.key, pair.value)
            else status.missingValue(pair.key, pair.value)
        })
    }

    confirmRequiredKeys(packet: Packet, status: Status) {
        this.requiredKeys.forEach((key) => {
            if (packet.has(key)) status.foundExpected(key)
            else status.unexpectedlyMissing(key)
        })
    }

    confirmForbiddenKeys(packet: Packet, status: Status) {
        this.forbiddenKeys.forEach((key) => {
            if (packet.has(key)) status.unexpectedlyFound(key)
            else status.missingExpected(key)
        })
    }

}

export default Rules
