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

import { NetworkType, PublicAccount, Metadata, Convert } from 'symbol-sdk';
import { ApostilleMetadata } from './ApostilleMetadata';
import { ApostilleUtils } from './ApostilleUtils';
import { ApostilleVerificationResult } from './ApostilleVerificationResult';
import { ApostilleHash } from './ApostilleHash';

export class ApostilleVerification {

    /**
     * Verify an Apostille
     * @param {string} filename - Name of the file in Apostille format (Ex: "MyProject - TBLJAVZXTDY3EXNVC5IMEYZN35OPHAQK5GOQXWPH - 2020-01-29.txt")
     * @param {string} data - File content (as Base64)
     * @param {Metadata[]} metadata - Dedicated account's metadata
     * @return {ApostilleVerificationResult}
     */
    public static verify(filename: string, data: string, metadata: Metadata[]): ApostilleVerificationResult {
        const m = ApostilleMetadata.create(metadata);
        const dedicated = ApostilleUtils.extractDedicatedFromName(filename);
        if (!dedicated) return ApostilleVerificationResult.create(1, false);
        if (!m.name || !m.hash) return ApostilleVerificationResult.create(2, false);
        if (m.name.value !== ApostilleUtils.getOriginalFilename(filename)) return ApostilleVerificationResult.create(3, false, m);
        if (!ApostilleVerification.verifyHash(m.name.senderPublicKey, data, m.hash.value, dedicated.networkType)) return ApostilleVerificationResult.create(4, false, m);
        return ApostilleVerificationResult.create(5, true, m);
    }

    /**
     * Verify an Apostille hash signature
     * @param {string} publicKey - Public key of owner
     * @param {string} data - File content (as Base64)
     * @param {string} hash - Apostille hash
     * @param {NetworkType} network - Network type
     * @return {boolean} - True if hash signature is valid, false otherwise
     */
    public static verifyHash(publicKey: string, data: string, hash: string, network: NetworkType): boolean {
        const owner = PublicAccount.createFromPublicKey(publicKey, network);
        let sha256 = ApostilleHash.hash(data);
        return owner.verifySignature(Convert.utf8ToHex(sha256), hash.substring(10));
    };

}