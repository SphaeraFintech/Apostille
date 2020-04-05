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

import { ApostilleAccount } from './ApostilleAccount';
import { ApostilleHash } from './ApostilleHash';
import { ApostilleHistory } from './ApostilleHistory';
import { ApostilleMetadata } from './ApostilleMetadata';
import { ApostilleTransactions } from "./ApostilleTransactions";
import { ApostilleUtils } from './ApostilleUtils';
import { Account, InnerTransaction, Metadata, NetworkType, PublicAccount, MetadataEntry } from 'symbol-sdk';
import { Observable } from "rxjs/Observable";

export class Apostille {

    constructor(
        public readonly account: Account,
        public readonly history: Account,
        public readonly owner: PublicAccount,
        public readonly filename: string,
        public readonly fileContent: string,
        public readonly hash: ApostilleHash,
        public readonly tags: string,
        public readonly description: string,
        public readonly url: string,
        public transactions: InnerTransaction[],
        public readonly network: NetworkType) {
        this.transactions = ApostilleTransactions.create(this);
    }

    /**
     * Create an Apostille
     * @param {string} filename - Name of the file (with extension)
     * @param {string} fileContent - Content of the file (as Base64)
     * @param {string} tags - Tags for the file
     * @param {string} description - Description for the file
     * @param {string} url - Url for the file
     * @param {string} privateKey - Private key of owner
     * @param {NetworkType} network - Network type
     * @return {Apostille} - An Apostille
     */
    public static create(filename: string, fileContent: string, tags: string, description: string, url: string, privateKey: string, network: NetworkType): Apostille {
        const owner = Account.createFromPrivateKey(privateKey, network);
        const dedicated = ApostilleAccount.create(privateKey, filename, network);
        const apostilleHash = ApostilleHash.create(fileContent, privateKey, network);
        const history = ApostilleHistory.create(privateKey, network);
        return new Apostille(dedicated, history, owner.publicAccount, filename, fileContent, apostilleHash, tags, description, url, [], network);
    }

    /**
     * Update an Apostille
     * @param {Metadata[]} metadata - Dedicated account's metadata
     * @return {boolean} - True if success, false otherwise
     */
    public update(metadata: Metadata[]): boolean {
        const m = ApostilleMetadata.create(metadata);
        if (m.name) {
            const core = ApostilleTransactions.core(this);
            this.transactions = [core];
            this._update(m.hash, this.hash.full);
            this._update(m.tags, this.tags);
            this._update(m.description, this.description);
            this._update(m.url, this.url);
            return true;
        }
        return false;
    }

    /**
     * @private
     * Update Apostille transactions
     */
    private _update(metadata: MetadataEntry, newVal: string): void {
        const currentVal = metadata ? metadata.value : "";
        if (newVal && !ApostilleUtils.isIdentical(currentVal, newVal)) {
            const tx = ApostilleTransactions.metadata(this, metadata.scopedMetadataKey.toHex(), metadata.value, newVal);
            this.transactions.push(tx);
        }
    }

}