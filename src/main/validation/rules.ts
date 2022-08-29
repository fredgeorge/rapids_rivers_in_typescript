/*
 * Copyright (c) 2022 by Fred George
 * @author Fred George  fredgeorge@acm.org
 * Licensed under the MIT License; see LICENSE file in root.
 */

import Packet from "../packets/packet";
import Status from "./status";


class Rules {
    requiredKeys = []

    assess(packet: Packet, status: Status) {
        this.confirmRequiredKeys(status)
    }

    confirmRequiredKeys(status: Status) {

    }
}

export default Rules
