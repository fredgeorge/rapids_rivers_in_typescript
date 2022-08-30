/*
 * Copyright (c) 2022 by Fred George
 * @author Fred George  fredgeorge@acm.org
 * Licensed under the MIT License; see LICENSE file in root.
 */

import {Packet} from "../../main/packets/packet";


test('render unchanged without missing keys', () => {
    let packet = new Packet(`
        {
            "integer_key": 7,
            "boolean_key": true,
            "null_key":null,
            "empty_string":"",
            "empty_list_key":[]
        }
    `)
    expect(packet.toJsonString()).toBe('{"integer_key":7,"boolean_key":true}')
})

test('render additional keys', () => {
    let packet = new Packet(`
        {
            "integer_key": 7,
            "boolean_key": true
        }
    `)
    packet.new_key = "new value"
    expect(packet.toJsonString()).toBe('{"integer_key":7,"boolean_key":true,"new_key":"new value"}')
})

test('render changed without missing keys', () => {
    let packet = new Packet(`
        {
            "integer_key": 7,
            "boolean_key": true
        }
    `)
    packet.integer_key = 9
    expect(packet.toJsonString()).toBe('{"integer_key":9,"boolean_key":true}')
    packet.boolean_key = false
    expect(packet.toJsonString()).toBe('{"integer_key":9,"boolean_key":false}')
})
