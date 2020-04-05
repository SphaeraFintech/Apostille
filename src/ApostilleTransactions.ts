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

import { Apostille } from './Apostille';
import * as ApostilleConstants from './ApostilleConstants';
import {
    Convert,
    InnerTransaction,
    AccountMetadataTransaction,
    Deadline,
    UInt64,
    MultisigAccountModificationTransaction,
    TransferTransaction,
    NetworkCurrencyPublic,
    NetworkCurrencyLocal,
    PlainMessage
} from 'symbol-sdk';

export class ApostilleTransactions {

    /**
     * Create base transactions for the Apostille
     * @param {Apostille} apostille - An Apostille
     * @return {InnerTransaction[]}
     */
    public static create(apostille: Apostille): InnerTransaction[] {
        const core = ApostilleTransactions.core(apostille);
        const name = ApostilleTransactions.metadata(apostille, ApostilleConstants.metadataKey.name, "", apostille.filename);
        const hash = ApostilleTransactions.metadata(apostille, ApostilleConstants.metadataKey.hash, "", apostille.hash.full);
        const history = ApostilleTransactions.history(apostille);
        let txes = [core, name, hash, history];
        if (apostille.tags.length) txes.push(ApostilleTransactions.metadata(apostille, ApostilleConstants.metadataKey.tags, "", apostille.tags));
        if (apostille.description.length) txes.push(ApostilleTransactions.metadata(apostille, ApostilleConstants.metadataKey.description, "", apostille.description));
        if (apostille.url.length) txes.push(ApostilleTransactions.metadata(apostille, ApostilleConstants.metadataKey.tags, "", apostille.tags));
        return txes;
    }

    /**
     * Create an AccountMetadataTransaction
     * @param {Apostille} apostille - An Apostille
     * @param {string} metadataKey - Metadata hex key
     * @param {string} oldVal - Old metadata value
     * @param {string} newVal - New metadata value
     * @return {InnerTransaction}
     */
    public static metadata(apostille: Apostille, metadataKey: string, oldVal: string, newVal: string): InnerTransaction {
        const currentValueBytes = Convert.utf8ToUint8(oldVal);
        const newValueBytes = Convert.utf8ToUint8(newVal);
        return AccountMetadataTransaction.create(
            Deadline.create(),
            apostille.account.publicKey,
            UInt64.fromHex(metadataKey),
            newValueBytes.length - currentValueBytes.length,
            Convert.decodeHex(Convert.xor(currentValueBytes, newValueBytes)),
            apostille.network
        ).toAggregate(apostille.owner);
    }

    /**
     * Assign ownership of a dedicated account
     * @param {Apostille} apostille - An Apostille
     * @return {InnerTransaction}
     */
    public static ownership(apostille: Apostille): InnerTransaction {
        return MultisigAccountModificationTransaction.create(Deadline.create(), 1, 1, [apostille.owner], [], apostille.network).toAggregate(apostille.account.publicAccount);
    }

    /**
     * Create a core transfer transaction
     * @param {Apostille} apostille - An Apostille
     * @return {InnerTransaction}
     */
    public static core(apostille: Apostille): InnerTransaction {
        return TransferTransaction.create(
            Deadline.create(),
            apostille.account.address,
            [ApostilleConstants.publicNetwork ? NetworkCurrencyPublic.createRelative(10) : NetworkCurrencyLocal.createRelative(10)],
            PlainMessage.create(apostille.hash.full),
            apostille.network).toAggregate(apostille.owner);
    }

    /**
     * Create an history transfer transaction
     * @param {Apostille} apostille - An Apostille
     * @return {InnerTransaction}
     */
    public static history(apostille: Apostille): InnerTransaction {
        return TransferTransaction.create(
            Deadline.create(),
            apostille.history.address,
            [ApostilleConstants.publicNetwork ? NetworkCurrencyPublic.createRelative(10) : NetworkCurrencyLocal.createRelative(10)],
            PlainMessage.create(JSON.stringify({ "filename": apostille.filename, "account": apostille.account.address.plain() })),
            apostille.network).toAggregate(apostille.owner);
    }

}