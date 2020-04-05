/*
 * Copyright 2020 SPHAERA FINTECH SASU
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ApostilleMetadata } from './ApostilleMetadata';

export class ApostilleVerificationResult {

    constructor(public readonly code: number,
        public readonly result: boolean,
        public readonly message: string,
        public readonly metadata: ApostilleMetadata) { }

    /**
     * Create an object containing the Apostille verification result
     * @param {number} code Result code
     * @param {boolean} result Verification result
     * @param {ApostilleMetadata} metadata Apostille metadata (optional)
     * @return {ApostilleVerificationResult}
     */
    public static create(code: number, result: boolean, metadata: ApostilleMetadata = undefined): ApostilleVerificationResult {
        const messages = {
            "1": "File name is not in Apostille format",
            "2": "Dedicated account has no valid Apostille metadata",
            "3": "Filename does not match the filename stored in metadata",
            "4": "Signature in metadata does not match with the hash of your file",
            "5": "Apostille is valid"
        }
        return new ApostilleVerificationResult(code, result, messages[code], metadata);
    }

}