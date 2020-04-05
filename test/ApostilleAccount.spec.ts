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

import { expect } from 'chai';
import { ApostilleAccount } from '../src/ApostilleAccount';
import { DEDICATED_ACCOUNT, FILENAME, MAIN_ACCOUNT, NETWORK_TYPE } from './conf.spec';

describe('ApostilleAccount', () => {

    it('should create an Apostille account', () => {
        const dedicatedAccount = ApostilleAccount.create(MAIN_ACCOUNT.privateKey, FILENAME, NETWORK_TYPE);
        expect(dedicatedAccount).to.eql(DEDICATED_ACCOUNT);
    });

});