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
import { ApostilleVerificationResult } from '../src/ApostilleVerificationResult';

describe('ApostilleVerificationResult', () => {

    it('Should return a code 1', () => {
        const expectedResult = {
            code: 1,
            result: false,
            message: "File name is not in Apostille format",
            metadata: undefined
        }
        const result = ApostilleVerificationResult.create(1, false);
        expect(result).to.be.eql(expectedResult);
    });

    it('Should return a code 2', () => {
        const expectedResult = {
            code: 2,
            result: false,
            message: "Dedicated account has no valid Apostille metadata",
            metadata: undefined
        }
        const result = ApostilleVerificationResult.create(2, false);
        expect(result).to.be.eql(expectedResult);
    });

    it('Should return a code 3', () => {
        const expectedResult = {
            code: 3,
            result: false,
            message: "Filename does not match the filename stored in metadata",
            metadata: undefined
        }
        const result = ApostilleVerificationResult.create(3, false);
        expect(result).to.be.eql(expectedResult);
    });

    it('Should return a code 4', () => {
        const expectedResult = {
            code: 4,
            result: false,
            message: "Signature in metadata does not match with the hash of your file",
            metadata: undefined
        }
        const result = ApostilleVerificationResult.create(4, false);
        expect(result).to.be.eql(expectedResult);
    });

    it('Should return a code 5', () => {
        const expectedResult = {
            code: 5,
            result: true,
            message: "Apostille is valid",
            metadata: undefined
        }
        const result = ApostilleVerificationResult.create(5, true);
        expect(result).to.be.eql(expectedResult);
    });

});