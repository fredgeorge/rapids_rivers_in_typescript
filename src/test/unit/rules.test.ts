/*
 * Copyright (c) 2022 by Fred George
 * @author Fred George  fredgeorge@acm.org
 * Licensed under the MIT License; see LICENSE file in root.
 */

import Packet from "../../main/packets/packet";
import Rules from "../../main/validation/rules";

let packet = new Packet(`
{
    "string_key":"rental_offer_engine",
    "integer_key":7,
    "double_key":7.5,
    "null_key":null,
    "empty_string":"",
    "boolean_key": true,
    "boolean_string_key": "false",
    "date_time_key": "2022-03-03T00:00:00Z",
    "string_list_key":["foo","bar"],
    "integer_list_key":[2,4],
    "empty_list_key":[],
    "detail_key":{
        "detail_string_key":"upgrade",
        "detail_double_key":10.75,
        "detail_empty_string_key":""
    }
}
`)

test('no rules', () => {
    assertPasses(new Rules())
})

function assertPasses(rules: Rules) {
    let status = packet.evaluate(rules)
    expect(status.hasErrors()).toBeFalsy()
}
