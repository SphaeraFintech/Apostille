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

import { Apostille } from '../src/Apostille';
import { expect } from 'chai';
import { DEDICATED_ACCOUNT, FILE_CONTENT, FILENAME, MAIN_ACCOUNT, METADATA, NETWORK_TYPE, UPDATED_FILE_CONTENT, TAGS, DESCRIPTION, URL, APOSTILLE_DATA_HASH, APOSTILLE_FULL_HASH } from './conf.spec';

describe('Apostille', () => {

    it('should create an Apostille', () => {
        const apostille = Apostille.create(FILENAME, FILE_CONTENT, TAGS, DESCRIPTION, URL, MAIN_ACCOUNT.privateKey, NETWORK_TYPE);
        expect(apostille.filename).to.be.equal(FILENAME);
        expect(apostille.fileContent).to.eql(FILE_CONTENT);
        expect(apostille.hash.data).to.be.equal(APOSTILLE_DATA_HASH);
        expect(apostille.hash.full).to.be.equal(APOSTILLE_FULL_HASH);
        expect(apostille.tags).to.be.equal(TAGS);
        expect(apostille.account).to.eql(DEDICATED_ACCOUNT);
        expect(apostille.owner).to.be.eql(MAIN_ACCOUNT.publicAccount);
        expect(apostille.transactions.length).to.be.equal(7);
    });

    it('should update an existing Apostille', () => {
        let apostille = Apostille.create(FILENAME, UPDATED_FILE_CONTENT, TAGS + ", test, update", DESCRIPTION, URL, MAIN_ACCOUNT.privateKey, NETWORK_TYPE);
        const result = apostille.update(METADATA);
        expect(result).to.be.equal(true);
        expect(apostille.transactions.length).to.be.equal(3);
        expect(apostille.hash.data).to.be.equal("95F1918C85F90B82C798D39EC3DF22DC55F469967C2B9907556E6DC7FD283C0723EED4D794EEF767B7BC35E1B840CC2B14E645C4E5CBEAFA9FC019457D90510E");
        expect(apostille.hash.full).to.be.equal("FE4E54598395F1918C85F90B82C798D39EC3DF22DC55F469967C2B9907556E6DC7FD283C0723EED4D794EEF767B7BC35E1B840CC2B14E645C4E5CBEAFA9FC019457D90510E");
        expect(apostille.account).to.eql(DEDICATED_ACCOUNT);
    });

    it('should not update a non-existing Apostille', () => {
        let apostille = Apostille.create("unknown.pfd", FILE_CONTENT, TAGS, DESCRIPTION, URL, MAIN_ACCOUNT.privateKey, NETWORK_TYPE);
        const result = apostille.update([]);
        expect(result).to.be.equal(false);
        expect(apostille.transactions.length).to.be.equal(7);
        expect(apostille.hash.data).to.be.equal(APOSTILLE_DATA_HASH);
        expect(apostille.hash.full).to.be.equal(APOSTILLE_FULL_HASH);
        expect(apostille.account).to.not.eql(DEDICATED_ACCOUNT);
    });

});