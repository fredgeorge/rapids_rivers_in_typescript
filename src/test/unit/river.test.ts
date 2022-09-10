/*
 * Copyright (c) 2022 by Fred George
 * @author Fred George  fredgeorge@acm.org
 * Licensed under the MIT License; see LICENSE file in root.
 */

import {Packet} from "../../main/packets/packet";
import {TestConnection} from "../util/test_connection";
import {Rules} from "../../main/validation/rules";
import {DeadService, LinkedService, SampleService} from "../util/test_services";
import {HeartBeat} from "../../main/packets/heart_beat_packet";
import {SYSTEM_BREADCRUMBS_KEY, SYSTEM_READ_COUNT_KEY} from "../../main/packets/constants";

let packet = new Packet(`
{
    "string_key":"rental_offer_engine",
    "integer_key":7,
    "double_key":7.5,
    "boolean_key": true,
    "date_time_key": "2022-03-03T00:00:00Z",
    "string_list_key":["foo","bar"],
    "integer_list_key":[2,4],
    "detail_key":{
        "detail_string_key":"upgrade",
        "detail_double_key":10.75,
        "detail_empty_string_key":""
    }
}
`);

test('unfiltered service', () => {
    let connection = new TestConnection();
    let service = new SampleService(new Rules());
    connection.register(service);
    connection.publish(packet);
    expect(service.acceptedPackets.length).toBe(1);
    expect(service.informationStatuses.length).toBe(1);
    expect(service.rejectedPackets.length).toBe(0);
    expect(service.problemStatuses.length).toBe(0);
})

test('filtered service', () => {
    let connection = new TestConnection();
    let acceptedService = new SampleService(new Rules().requireKeys('integer_key'));
    let rejectedService = new SampleService(new Rules().forbidKeys('integer_key'));
    connection.register(acceptedService);
    connection.register(rejectedService);
    connection.publish(packet);
    expect(acceptedService.acceptedPackets.length).toBe(1);
    expect(acceptedService.informationStatuses[0].hasErrors()).toBeFalsy();
    expect(rejectedService.rejectedPackets.length).toBe(1);
    expect(rejectedService.problemStatuses[0].hasErrors()).toBeTruthy();
})

test('invalid JSON', () => {
    let connection = new TestConnection();
    let normalService = new SampleService(new Rules(), false);
    let systemService = new SampleService(new Rules(), true);
    connection.register(normalService);
    connection.register(systemService);
    connection.publishString('{');
    expect(normalService.acceptedPackets.length).toBe(0);
    expect(normalService.rejectedPackets.length).toBe(0);
    expect(systemService.acceptedPackets.length).toBe(0);
    expect(systemService.rejectedPackets.length).toBe(0);
    expect(normalService.invalidStrings.length).toBe(0);
    expect(systemService.invalidStrings.length).toBe(1);
})

test('start up packet', () => {
    let connection = new TestConnection();
    let service = new SampleService(new Rules());
    connection.register(service);
    expect(connection.allPackets.length).toBe(1);
})

test('heart beats', () => {
    let connection = new TestConnection();
    let normalService = new SampleService(new Rules(), false);
    let deadService = new DeadService();
    let systemService = new SampleService(new Rules(), true);
    connection.register(normalService);
    connection.register(deadService);
    connection.register(systemService);
    let heartBeat = new HeartBeat();
    connection.publish(heartBeat);
    expect(normalService.acceptedPackets.length).toBe(0);
    expect(systemService.acceptedPackets.length).toBe(3); // Original heart beat and only 2 responses
    connection.publish(heartBeat);
    connection.publish(heartBeat);
    expect(normalService.acceptedPackets.length).toBe(0);
    expect(systemService.acceptedPackets.length).toBe(9);  // 3 HeartBeat's with 2 responses each
})

test('loop detection', () => {
    let connection = new TestConnection(2);
    let normalService = new SampleService(new Rules(), false);
    let systemService = new SampleService(new Rules(), true);
    connection.register(normalService);
    connection.register(systemService);
    connection.publish(packet);
    expect(normalService.acceptedPackets.length).toBe(1);
    expect(systemService.acceptedPackets.length).toBe(1);

    packet[SYSTEM_READ_COUNT_KEY] = 1;
    connection.publish(packet);
    expect(normalService.acceptedPackets.length).toBe(2);
    expect(systemService.acceptedPackets.length).toBe(2);

    packet[SYSTEM_READ_COUNT_KEY] = 2;
    connection.publish(packet);
    expect(systemService.loopPackets.length).toBe(1);  // Loop detected
    expect(normalService.acceptedPackets.length).toBe(2);  // Not forwarded to normal service
    expect(systemService.acceptedPackets.length).toBe(2);  // Not forwarded to system service
})

test('bread crumbs', () => {
    let connection = new TestConnection();
    let packet = new Packet();
    let serviceA = new LinkedService([], ['a', 'b', 'c']);
    let serviceB = new LinkedService(['a'], ['b', 'c']);
    let serviceC = new LinkedService(['a', 'b'], ['c']);
    let serviceD = new LinkedService(['a', 'b', 'c'], []);
    connection.register(serviceA);
    connection.register(serviceB);
    connection.register(serviceC);
    connection.register(serviceD);
    connection.publish(packet);
    expect(serviceD.acceptedPackets.length).toBe(1);
    expect(serviceD.acceptedPackets[0][SYSTEM_BREADCRUMBS_KEY].length).toBe(4);
})
