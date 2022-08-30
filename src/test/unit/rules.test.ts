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

test('required keys', () => {
    assertPasses(new Rules().requireKeys('string_key', 'integer_key'))
    assertFails(new Rules().requireKeys('string_key', 'foo'))
    assertPasses(new Rules().requireKeys('detail_key'))
})

test('forbidden keys', () => {
    assertPasses(new Rules().forbidkeys('foo'))
    assertFails(new Rules().forbidkeys('string_key', 'foo'))
    assertPasses(new Rules().forbidkeys('null_key', 'empty_string', 'empty_list_key'))
})

test('require key-value pairs', () => {
    assertPasses(new Rules().requireValue('string_key', 'rental_offer_engine'))
    assertFails(new Rules().requireValue('string_key', 'foo'))
    assertFails(new Rules().requireValue('bar', 'foo'))
    assertPasses(new Rules().requireValue('integer_key', 7))
    assertPasses(new Rules().requireValue('integer_key', 7.0))
    assertFails(new Rules().requireValue('integer_key', 8))
    assertFails(new Rules().requireValue('integer_key', 'foo'))
    assertPasses(new Rules().requireValue('double_key', 7.5))
    assertFails(new Rules().requireValue('double_key', 8))
    assertPasses(new Rules().requireValue('boolean_key', true))
    assertFails(new Rules().requireValue('boolean_key', false))
    assertFails(new Rules().requireValue('boolean_string_key', false))
    assertPasses(new Rules().requireValue('boolean_string_key', 'false'))
    assertFails(new Rules().requireValue('boolean_string_key', 'true'))
    assertFails(new Rules().requireValue('boolean_string_key', 'foo'))
})

test('compound rules', () => {
    assertPasses(new Rules()
        .requireKeys('string_key', 'integer_key')
        .requireValue('boolean_key', true)
        .forbidkeys('null_key', 'empty_string', 'empty_list_key')
        .requireKeys('detail_key')
    )

})

function assertPasses(rules: Rules) {
    let status = packet.evaluate(rules)
    expect(status.hasErrors()).toBeFalsy()
}

function assertFails(rules: Rules) {
    let status = packet.evaluate(rules)
    expect(status.hasErrors()).toBeTruthy()
}
