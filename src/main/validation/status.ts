/*
 * Copyright (c) 2022 by Fred George
 * @author Fred George  fredgeorge@acm.org
 * Licensed under the MIT License; see LICENSE file in root.
 */

class Status {
    jsonString: string
    informationalMessages = []
    errorMessages = []


    constructor(originalJsonString: string) {
        this.jsonString = originalJsonString
    }

    hasErrors(): boolean {
        return this.errorMessages.length > 0
    }

    foundExpected(key: string) {
        this.informationalMessages.push(`Required key of <${key}> was found`)
    }

    unexpectedlyMissing(key: string) {
        this.errorMessages.push(`Required key of <${key}> is missing`)
    }

    missingExpected(key: string) {
        this.informationalMessages.push(`Forbidden key of <${key}> was not found`)
    }

    unexpectedlyFound(key: string) {
        this.errorMessages.push(`Fobidden key of <${key}> unexpectedly exists`)
    }

    foundValue(key: string, requiredValue: any) {
        this.informationalMessages.push(`Required key of <${key}> have value <${requiredValue}>`)
    }

    missingValue(key: string, requiredValue: any) {
        this.errorMessages.push(`Required key of <${key}> is missing required value of <${requiredValue}>`)
    }
}

export default Status
