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

import { metadataKey } from './ApostilleConstants';
import * as CryptoJS from 'crypto-js';
import { Account, NetworkType, AccountMetadataTransaction, Deadline, UInt64, Convert, PublicAccount, InnerTransaction } from 'symbol-sdk';
import { Observable } from "rxjs/Observable";

export class ApostilleHistory {

    /**
     * Create an history account used for indexing Apostilles
     * @param {string} privateKey - Private key of owner
     * @param {NetworkType} network - Network type
     * @return {Account} - History Account
     */
    public static create(privateKey: string, network: NetworkType): Account {
        const owner = Account.createFromPrivateKey(privateKey, network);
        const seed = "Apostille-history-of-" + owner.address.plain();
        const hash256 = CryptoJS.SHA256(seed).toString(CryptoJS.enc.Hex);
        let signedFilename = owner.signData(hash256);
        let historyAccountPrivateKey = signedFilename.substring(0, 64);
        return Account.createFromPrivateKey(historyAccountPrivateKey, network);
    }

    /**
     * Create a metadata transaction for recording history account address in owner's account metadata
     * @param {PublicAccount} owner - PublicAccount of owner
     * @param {PublicAccount} history - PublicAccount of history
     * @param {NetworkType} network - Network type
     * @return {InnerTransaction}
     */
    public static metadataTransaction(owner: PublicAccount, history: PublicAccount, network: NetworkType): InnerTransaction {
        const currentValueBytes = Convert.utf8ToUint8("");
        const newValueBytes = Convert.utf8ToUint8(history.address.plain());
        return AccountMetadataTransaction.create(
            Deadline.create(),
            owner.publicKey,
            UInt64.fromHex(metadataKey.history),
            newValueBytes.length - currentValueBytes.length,
            Convert.decodeHex(Convert.xor(currentValueBytes, newValueBytes)),
            network
        ).toAggregate(owner);
    }

}