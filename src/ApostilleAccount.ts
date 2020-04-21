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

import * as CryptoJS from 'crypto-js';
import { Account, NetworkType } from 'symbol-sdk';

export class ApostilleAccount {

    /**
     * Generate an Apostille account for a file. 
     * Will always generate the same account for a given file name and owner private key
     * @param {string} privateKey - Private key of owner
     * @param {string} filename - File name (with extension)
     * @param {NetworkType} network - Network type
     * @return {Account} - Apostille Account
     */
    public static create(privateKey: string, filename: string, network: NetworkType): Account {
        const owner = Account.createFromPrivateKey(privateKey, network);
        const hash256 = CryptoJS.SHA256(filename).toString(CryptoJS.enc.Hex);
        const signedFilename = owner.signData(hash256);
        const dedicatedAccountPrivateKey = signedFilename.substring(0, 64);
        return Account.createFromPrivateKey(dedicatedAccountPrivateKey, network);
    }

}