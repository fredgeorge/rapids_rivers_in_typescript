/*
 * Copyright (c) 2022 by Fred George
 * @author Fred George  fredgeorge@acm.org
 * Licensed under the MIT License; see LICENSE file in root.
 */

class Status {
    jsonString: string


    constructor(originalJsonString: string) {
        this.jsonString = originalJsonString
    }

    hasErrors() : boolean {
        return false
    }


}

export default Status
