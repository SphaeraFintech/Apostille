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

import { ApostilleHash } from '../src/ApostilleHash';
import { expect } from 'chai';
import { APOSTILLE_CHECKSUM, FILE_CONTENT, MAIN_ACCOUNT, NETWORK_TYPE, APOSTILLE_DATA_HASH } from './conf.spec';

describe('ApostilleHash', () => {

    it('should create a signed Apostille hash', () => {
        const expectedHash = APOSTILLE_DATA_HASH;
        const expectedFullHash = APOSTILLE_CHECKSUM + expectedHash;
        const apostilleHash = ApostilleHash.create(FILE_CONTENT, MAIN_ACCOUNT.privateKey, NETWORK_TYPE);
        expect(apostilleHash.checksum).to.be.equal(APOSTILLE_CHECKSUM);
        expect(apostilleHash.data).to.be.equal(expectedHash);
        expect(apostilleHash.full).to.be.equal(expectedFullHash);
    });

    it('should create an SHA256 hash', () => {
        const expectedHash = "22305246fae3948c035ffcacb8504fcf7abd757613af2c8a0cb4c729991221bb";
        const apostilleHash = ApostilleHash.hash(FILE_CONTENT);
        expect(apostilleHash).to.be.equal(expectedHash);
    });

});