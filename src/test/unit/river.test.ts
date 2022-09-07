/*
 * Copyright (c) 2022 by Fred George
 * @author Fred George  fredgeorge@acm.org
 * Licensed under the MIT License; see LICENSE file in root.
 */

import {Packet} from "../../main/packets/packet";
import {TestConnection} from "../util/test_connection";
import {Rules} from "../../main/validation/rules";
import {SampleService} from "../util/test_services";

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
`)

test('unfiltered service', () => {
    let connection = new TestConnection()
    let service = new SampleService(new Rules())
    connection.register(service)
    connection.publish(packet)
    expect(service.acceptedPackets.length).toBe(1)
    expect(service.informationStatuses.length).toBe(1)
    expect(service.rejectedPackets.length).toBe(0)
    expect(service.problemStatuses.length).toBe(0)
})
