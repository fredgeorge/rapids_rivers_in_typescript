#!/usr/bin/env node
"use strict";

/*
 * Copyright (c) 2022 by Fred George
 * @author Fred George  fredgeorge@acm.org
 * Licensed under the MIT License; see LICENSE file in root.
 */

// Doesn't implement Service interface since it only sends messages
import {RabbitMqConnection} from "../../../build/main/rapids/rabbit_mq_rapids_connection";
import {Packet} from "../../../build/main/packets/packet";
import {COMMUNITY_KEY} from "../../../build/main/packets/constants";

if (process.argv.length !== 4)
    throw 'Invoke this service with two parameters: host IP as a string, and port (string or number)';
let connection = new RabbitMqConnection(process.argv[2], process.argv[3]);

let packet = new Packet();
packet[COMMUNITY_KEY] = 'offer_engine_family';
packet['need'] = 'car_rental_offer';

const publish = () => {
    console.log(` [<] ${packet.toJsonString()}`);
    connection.publish(packet);  // publishing to the event bus is just this easy!
};

console.log(` [*] Generating messages every 5 seconds. To exit press CTRL+C`);

publish();
setInterval(function () { publish(); }, 5000);