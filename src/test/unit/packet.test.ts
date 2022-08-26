/*
 * Copyright (c) 2022 by Fred George
 * @author Fred George  fredgeorge@acm.org
 * Licensed under the MIT License; see LICENSE file in root.
 */

const p = require('../../main/packets/packet')

let packet = new p.Packet(`
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
        "detail_double_key":10.75
    }
}
`)

test('fetch nuggets', () => {
    expect(packet.get('string_key')).toBe('rental_offer_engine')
    expect(packet.get('integer_key')).toBe(7)
    expect(packet.get('integer_key')).toBe(7.0)
    expect(packet.get('double_key')).toBe(7.5)
    expect(packet.get('boolean_key')).toBe(true)
    expect(packet.get('boolean_string_key')).toBe("false")
    expect(packet.dateTime('date_time_key')).toBe(Date.UTC(2022, 2, 3))
    expect(packet.get('string_list_key')).toEqual(['foo', 'bar'])
    expect(packet.get('integer_list_key')).toEqual([2, 4])
})
