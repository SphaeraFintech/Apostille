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

import * as ApostilleConstants from './ApostilleConstants';
import * as CryptoJS from 'crypto-js';
import { Account, NetworkType } from 'symbol-sdk';

export class ApostilleHash {

    constructor(public readonly checksum: string,
        public readonly data: string,
        public readonly full: string) { }

    /**
     * Hash the file content and sign it
     * @param {string} data File content (as Base64)
     * @param {string} privateKey Private key of owner
     * @param {NetworkType} network Network type
     * @return {ApostilleHash}
     */
    public static create(data: string, privateKey: string, network: NetworkType): ApostilleHash {
        const owner = Account.createFromPrivateKey(privateKey, network);
        const hash = owner.signData(ApostilleHash.hash(data));
        return new ApostilleHash(ApostilleConstants.checksum, hash, ApostilleConstants.checksum + hash);
    }

    /**
     * Hash the file content with SHA256
     * @param {string} data File content (Base64)
     * @return {string} SHA256 hash of the file content
     */
    public static hash(data: string): string {
        const rawContent = CryptoJS.enc.Base64.parse(data);
        return CryptoJS.SHA256(rawContent).toString(CryptoJS.enc.Hex);
    }

}