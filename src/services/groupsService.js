import {
    Log
} from '../utils/log';
import { esService } from '../utils/esService';
import bodybuilder from 'bodybuilder';
import { v4 as uuidv4 } from 'uuid';


class GroupsService {
    async createNewGroup(payload) {
        try {
            let timestamp = date.getTime();
            await esService.indexData({
                id: payload.mailID.split('@')[0] + payload.userName + payload.groupName,
                index: 'atclass-groups',
                type: 'groups',
                body: {
                    userName: payload.userName,
                    mailID: payload.mailID,
                    groupName: payload.groupName,
                    groupBio: payload.groupBio,
                    groupType: payload.groupType,
                    groupOwners: [{
                        userName: payload.userName,
                        mailID: payload.mailID,
                        timestamp: timestamp,
                        addedBy: {
                            userName: payload.userName,
                            mailID: payload.mailID
                        }
                    }],
                    groupMember: [{
                        userName: payload.userName,
                        mailID: payload.mailID,
                        timestamp: timestamp
                    }]
                }
            });
        } catch (err) {
            Log.info('Error in userCredentials - isCredentialsUnique ', err);
            throw err;
        }
    }
}

const groupsService = new GroupsService();
export {
    groupsService
};