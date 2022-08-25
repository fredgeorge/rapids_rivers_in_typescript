/*
 * Copyright (c) 2022 by Fred George
 * @author Fred George  fredgeorge@acm.org
 * Licensed under the MIT License; see LICENSE file in root.
 */

const p = require('../../main/packets/packet')

test('Packet accessible', () => {
    expect(new p.Packet()).not.toBeNull()
})
