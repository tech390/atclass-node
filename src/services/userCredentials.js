import { Log } from '../utils/log';
import { esService } from '../utils/esService';
import bodybuilder from 'bodybuilder';
import { v4 as uuidv4 } from 'uuid';
import { response } from 'express';

class UserCredentials {
    async isCredentialsUnique(userDetails) {
        try {
            let query = {
                'query': {
                    'bool': {
                        'filter': [
                            {
                                'bool': {
                                    'should': [
                                        {
                                            'match': {
                                                'mailID.raw': userDetails.mailID
                                            }
                                        },
                                        {
                                            'match': {
                                                'userName.raw': userDetails.userName
                                            }
                                        },
                                        {
                                            'match': {
                                                'mobileNumber': userDetails.mobileNumber
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                'aggs': {
                    'UniqueMailID': {
                        'terms': {
                            'field': 'mailID.raw'
                        }
                    },
                    'UniqueUserName': {
                        'terms': {
                            'field': 'userName.raw'
                        }
                    },
                    'UniquemobileNumber': {
                        'terms': {
                            'field': 'mobileNumber'
                        }
                    }
                }
            };
            let res = await esService.search('atclass-usercredentials', query);
            // console.log('res', JSON.stringify(res, undefined, 2));
            if (res.hits.total) {
                if (res.aggregations.UniqueMailID.buckets.length !== 0) {
                    return {
                        response: userDetails.mailID,
                        message: 'account exist with the mailID'
                    };
                } if (res.aggregations.UniqueUserName.buckets.length !== 0) {
                    return {
                        response: userDetails.userName,
                        message: 'username already taken choose another username'
                    };
                } if (res.aggregations.UniquemobileNumber.buckets.length !== 0) {
                    return {
                        response: userDetails.mobileNumber,
                        message: 'account already exists with the mobile'
                    };
                }
            } else {
                await esService.indexData({
                    id: payload.mailID.split('@')[0] + payload.userName,
                    index: 'atclass-usercredentials',
                    type: 'usercredentials',
                    body: {
                        userName: userDetails.userName,
                        mailID: userDetails.mailID,
                        mobileNumber: userDetails.mobileNumber,
                        age: userDetails.age,
                        class: userDetails.class,
                        university: userDetails.university,
                        college: userDetails.college,
                        school: userDetails.school,
                        sex: userDetails.sex,
                        branch: userDetails.branch,
                        yearOfPassOut: userDetails.yearOfPassOut,
                        StudyGroup: userDetails.StudyGroup,
                        degree: userDetails.degree,
                        password: userDetails.password,
                        rollNumber: userDetails.rollNumber,
                        bio: userDetails.bio,
                        dateOfbirth: userDetails.dateOfbirth,
                        registeredDate: userDetails.registeredDate,
                        instituteLocation: userDetails.instituteLocation,
                        residenceLocation: userDetails.residenceLocation
                    }
                });
                return {
                    response: 'Account created',
                    message: 'Welcome to AtClass'
                };
            }

        } catch (err) {
            Log.info('Error in userCredentials - isCredentialsUnique ', err);
            throw err;
        }
    }
    async validUser(userCred) {
        try {
            let match = {};
            let query = {
                _source: ['mailID', 'userName', 'mobileNumber'],
                query: {
                    bool: {
                        filter: [
                            {
                                bool: {
                                    must: [
                                        {
                                            match: {
                                                password: userCred.password
                                            }
                                        }]
                                }
                            }]
                    }
                }
            };
            let keys = Object.keys(userCred);
            let key = keys.indexOf('password') === 1 ? keys[0] : keys[1];
            match[key] = userCred[key];
            query.query.bool.filter[0].bool.must.push({
                match
            });
            let res = await esService.search('atclass-usercredentials', query);
            if (res.hits.total === 1) {
                return {
                    validUser: true,
                    userDetails: res.hits.hits.map(x => x._source)[0]
                }
            } else {
                return {
                    validUser: false
                }
            }
        } catch (err) {
            Log.info('Error in userCredentials - validUser ', err);
            throw err;
        }
    }
    async followRequest(payload) {
        try {
            let query = {};
            let index = 'atclass-usercredentials', type = 'usercredentials', id = '', body = {};
            if (payload.cancelRequest) {
                // await esService
            } else if (payload.requesteeAccepted) {
                await esService.update(index, type, id, body)
            } else {
                id = payload.followRequestortMailID.split('@')[0] + payload.followRequestorUserName
                body.doc = {
                    following: {
                        userName: payload.requesteeUserName,
                        mailID: payload.requesteeMailID,
                        accepted: false,
                        timeStamp: date.getTime()
                    }
                }
                await esService.update(index, type, id, body)
                id = payload.requesteeMailID.split('@')[0] + payload.requesteeUserName
                body.doc = {
                    followers: {
                        userName: payload.followRequestorUserName,
                        mailID: payload.followRequestortMailID,
                        accepted: false,
                        timeStamp: date.getTime()
                    }
                }
                await esService.update(index, type, id, body)
                return true;
            }
        } catch (err) {
            Log.info('Error in userCredentials - validUser ', err);
            throw err;
        }
    }
}

const userCredentials = new UserCredentials();
export {
    userCredentials
};