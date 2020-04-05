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

import { ApostilleHistory } from '../src/ApostilleHistory';
import { expect } from 'chai';
import { HISTORY_ACCOUNT, MAIN_ACCOUNT, NETWORK_TYPE } from './conf.spec';
import { PublicAccount } from 'symbol-sdk';

describe('ApostilleHistory', () => {

    it('should create an history pointer', () => {
        const pointer = ApostilleHistory.create(MAIN_ACCOUNT.privateKey, NETWORK_TYPE);
        expect(pointer).to.eql(HISTORY_ACCOUNT);
    });

    it('should create an history metadata transaction', () => {
        const expectedAddressAsUTF8 = "53444B58445849425557354F47445849425749414E484F495745534F44454759494D534F41353256";
        const owner = PublicAccount.createFromPublicKey(MAIN_ACCOUNT.publicKey, NETWORK_TYPE);
        const pointer = PublicAccount.createFromPublicKey(HISTORY_ACCOUNT.publicKey, NETWORK_TYPE)
        const pointerMetaTransaction = ApostilleHistory.metadataTransaction(owner, pointer, NETWORK_TYPE);
        expect(pointerMetaTransaction.toJSON().transaction.targetPublicKey).to.be.equal(MAIN_ACCOUNT.publicKey);
        expect(pointerMetaTransaction.toJSON().transaction.value).to.be.equal(expectedAddressAsUTF8);
        expect(pointerMetaTransaction.toJSON().transaction.signerPublicKey).to.be.equal(MAIN_ACCOUNT.publicKey);
    });

});