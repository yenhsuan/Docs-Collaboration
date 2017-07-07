let redisClient = require('../modules/redisClient');

const TIMEOUT_IN_SECONDS = 3600;
const sessionPath = '/codocs/';

module.exports = (io) => {

    let sessionIdList = {};
    let userInfoMap = {};

    io.on('connection', (socket) => {

        //let sessionId = socket.handshake.query['sessionId'];
        let userName = socket.handshake.query['userName'];
        let userEmail = socket.handshake.query['userEmail'];
        let userPic = socket.handshake.query['userPic'];

        console.log(`[*] User:${userName}(${socket.id}) - ${userEmail} connected.`);
        //console.log(`[*] SESSION ${sessionId}`);

        userInfoMap[socket.id] = {};
        userInfoMap[socket.id]['sessionId'] = '';
        userInfoMap[socket.id]['userName'] = userName;
        userInfoMap[socket.id]['userEmail'] = userEmail;
        userInfoMap[socket.id]['userPic'] = userPic;


        // Listen clients create sessions

        socket.on('clientCreateSession', (setting) => {
            let settingObj = JSON.parse(setting);
            userInfoMap[socket.id]['sessionId'] = settingObj['sessionId'];

            let sessionId = settingObj['sessionId'];

            if (!sessionIdList[sessionId]) {
                sessionIdList[sessionId] = {
                    users:[],
                    delta:[],
                    doc:''
                };

                sessionIdList[sessionId]['users'].push(socket.id);
                let allUsers = sessionIdList[sessionId]['users'];
        
                let userListAry = [];
                for (let i = 0; i < allUsers.length; i++) {
                    userListAry.push(userInfoMap[allUsers[i]]);
                }

                for (let i = 0; i < allUsers.length; i++) {
                    console.log('[v] Send UserList to: '+allUsers[i] + ' - Broadcasting');
                    io.to(allUsers[i]).emit('serverSendUsersList',JSON.stringify(userListAry));
                }       
                delete userListAry;

            }
            else {
                console.log('[!] ERROR: SessionId has been used!');
            }
        });


        socket.on('clientCheckSession', (sessionIdToJoin) => {
            if (sessionIdList[sessionIdToJoin]) {
                socket.emit('serverCheckSession','y');
            }
            else {
                socket.emit('serverCheckSession','n');
            }
        });


        socket.on('clientJoinSession', (sessionId) => {
            if (sessionIdList[sessionId]) {
                sessionIdList[sessionId]['users'].push(socket.id);
                userInfoMap[socket.id].sessionId = sessionId;

                let allUsers = sessionIdList[sessionId]['users'];
        
                let userListAry = [];
                for (let i = 0; i < allUsers.length; i++) {
                    userListAry.push(userInfoMap[allUsers[i]]);
                }

                for (let i = 0; i < allUsers.length; i++) {
                    console.log('[v] Send UserList to: '+allUsers[i] + ' - Broadcasting');
                    io.to(allUsers[i]).emit('serverSendUsersList',JSON.stringify(userListAry));
                }       
                delete userListAry;

                currentContents = {};
                currentContents.delta = sessionIdList[sessionId]['delta'];
                currentContents.doc = sessionIdList[sessionId]['doc']

                socket.emit('serverSendSessionContent',JSON.stringify(currentContents));

            }
            else {
                console.log('[!] ERROR: SessionId was not created');
            }
        });

        
        // socket.emit('serverSendChatMsg', JSON.stringify({ user: 'Server', text:'Connected! ' }));
        // Send user list to all users in the same session
        

        // Chat - New messsage listening

        socket.on('clientSendChatMsg', (msg) => {
            let session = userInfoMap[socket.id].sessionId;
            console.log('[+] Receive msg: '+msg+'\n    from: ' + socket.id)

            if (sessionIdList[session]) {
                allUsers = sessionIdList[session]['users'];

                for (let i = 0; i < allUsers.length; i++) {
                    console.log('[v] Send msg to: '+allUsers[i]);
                    io.to(allUsers[i]).emit('serverSendChatMsg',msg);
                }

            }
            else {
                console.log('[!] ERROR: ' + socket.id + ' is not in session:' + session);
            }

        });


        socket.on('clientSendEditorChanges', (delta) => {
            let session = userInfoMap[socket.id].sessionId;
            console.log('[+] Receive Editor-Delta: '+delta+'\n    from: ' + socket.id);
            if (sessionIdList[session]) {

                sessionIdList[session]['delta'].push(delta);

                allUsers = sessionIdList[session]['users'];
                for (let i = 0; i < allUsers.length; i++) {
                    if (socket.id !== allUsers[i] ) {
                        console.log('[v] Send Delta to: '+allUsers[i]);
                        io.to(allUsers[i]).emit('severSendEditorChanges',delta);              
                    }
                }
            }
            else {
                console.log('[!] ERROR: ' + socket.id + ' is not in session:' + session);
            }
        });


        // Disconnect
        socket.on('disconnect',()=>{
            console.log(`[*] User:${userName}(${socket.id}) requests to disconnect.`);
            if (userInfoMap[socket.id]) {
                let session = userInfoMap[socket.id].sessionId;
                delete userInfoMap[socket.id];

                if ( session && (session in sessionIdList) ) {
                    let idxDel = sessionIdList[session].users.indexOf(socket.id);

                    if (idxDel != -1) {
                        sessionIdList[session].users.splice(idxDel,1);
                        console.log(`[-] User:(${socket.id}) has been removed from session.`);
                    }

                    if (sessionIdList[session].users.length===0) {
                        delete sessionIdList[session];
                        console.log(`[-] Session: ${session} has been removed from server.`);
                    } 
                    else {

                        // Update user list to all users in the same session
                        if (session) {
                            let allUsers = sessionIdList[session]['users'];
                            
                            let userListAry = [];
                            for (let i = 0; i < allUsers.length; i++) {
                                userListAry.push(userInfoMap[allUsers[i]]);
                            }

                            for (let i = 0; i < allUsers.length; i++) {
                                console.log('[v] Re-Send UserList to: '+allUsers[i] + ' - Broadcasting');
                                io.to(allUsers[i]).emit('serverSendUsersList',JSON.stringify(userListAry));
                            }       
                            delete userListAry;

                        }
                    }
                }
                else {
                    console.log('[-] User: ' + socket.id + ' has disconnected ');
                }
            }
            else {
                console.log('[-] ERROR: ' + socket.id + ' is not found in the serever');
            }
        });
    });
}
