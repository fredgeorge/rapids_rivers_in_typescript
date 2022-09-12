# rapids_rivers_in_typescript

Copyright (c) 2022 by Fred George  
@author Fred George  fredgeorge@acm.org  
Licensed under the MIT License; see LICENSE file in root.

A TypeScript implementation of Rapids/Rivers framework using 
RabbitMQ for the event bus.

## Summary

This framework models the Rapids/Rivers/Pond metaphor first proposed by Fred George.
It strives to present a relatively simple choreography scheme to allow tiny MicroServices
to interact with minimal coupling.

Originally formulated for a workshop conference in Bergen, Norway, and it has been re-implemented
several times, including NAV (Norwegian Welfare Association) in 2019 and Orn Software in 2022 (in C#).

## Dependencies

This project is built with:

- WebStorm 2022.2.1 (Professional Edition)
- TypeScript 4.7.4
- jest 28.1.3
- ts-jest 28.0.8
- amqplib 0.10.3 (access to RabbitMQ)

## Basic Concepts

An event bus acts as a __rapids__, an undifferentiated 
stream of all messages. Access to the rapids is through an adapter;
for RabbitMQ, the adapter is the RabbitMqRapidsConnection.

Messages on the event bus are captured into __packets__. In TypeScript
and JavaScript, you can inspect the received fields directly as properties
of the packet. You can also create new packets, and add properties to them
that will be rendered into JSON automatically on publishing to the rapids.

Using a set of __rules__, a subset of the rapids is created as a __river__.
Services are attached to a river, and will receive only packets that
conform to the rules.

## Sample Services

Two TypeScript sample services are provided:

- __Need__ service generates a stream of messages on the event bus
  - Examine this code for how to send a Packet
- __Monitor__ service logs to the console all messages on the bus
  - Examine this code for how to attach to the __rapids__ via a __river__
  - Also note the comments for how to set up __rules__ for the __packets__ you want to process