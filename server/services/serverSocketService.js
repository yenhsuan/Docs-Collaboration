
module.exports = (io) => {

    let sessionIdList = {};
    let userInfoMap = {};

    io.on('connection', (socket) => {
        
        let sessionId = socket.handshake.query['sessionId'];
        let userName = socket.handshake.query['userName'];
        let userEmail = socket.handshake.query['userEmail'];

        console.log(`[*] User:${userName}(${socket.id}) - ${userEmail} connected.`);
        console.log(`[*] SESSION ${sessionId}`);
        
        userInfoMap[socket.id] = {};
        userInfoMap[socket.id]['sessionId'] = sessionId;
        userInfoMap[socket.id]['userName'] = userName;
        userInfoMap[socket.id]['userEmail'] = userEmail;

        if (sessionIdList[sessionId]) {
            
        }
        else {
            sessionIdList[sessionId] = {
                users:[]
            };
        }

        sessionIdList[sessionId]['users'].push(socket.id);

        socket.emit('serverSendChatMsg', JSON.stringify({ user: 'Server', text:'Connected! ' }));

        // Send user list to all users in the same session
        
        let allUsers = sessionIdList[sessionId]['users'];
        
        for (let i = 0; i < allUsers.length; i++) {
            console.log('[v] Send UserList to: '+allUsers[i] + ' - Broadcasting');
            io.to(allUsers[i]).emit('serverSendUsersList',JSON.stringify(sessionIdList[sessionId]['users']);
        }        




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


        // Disconnect
        socket.on('disconnect',()=>{
            console.log(`[*] User:${userName}(${socket.id}) requests to disconnect.`);
            if (userInfoMap[socket.id]) {
                let session = userInfoMap[socket.id].sessionId;
                delete userInfoMap[socket.id];

                if (session in sessionIdList) {
                    let idxDel = sessionIdList[session].users.indexOf(socket.id);

                    if (idxDel != -1) {
                        sessionIdList[session].users.splice(idxDel,1);
                        console.log(`[-] User:(${socket.id}) has been removed from server.`);
                    }

                    if (sessionIdList[session].users.length===0) {
                        delete sessionIdList[session];
                        console.log(`[-] Session: ${session} has been removed from server.`);
                    }
                }
            }
            else {
                console.log('[!] ERROR: ' + socket.id + ' is not found in the serever');
            }
        });
    });
}
