declare const activeConnections: Map<any, any>;
declare const socketHandler: (socket: any) => void;
declare const emitToUser: (userId: any, event: any, data: any) => boolean;
declare const emitToAdmins: (event: any, data: any) => void;
declare const getOnlineUsers: () => {
    userId: any;
    username: any;
    profilePicture: any;
    connectedAt: any;
}[];
declare const getOnlineUsersCount: () => number;
export { socketHandler, emitToUser, emitToAdmins, getOnlineUsers, getOnlineUsersCount, activeConnections, };
//# sourceMappingURL=socketHandler.d.ts.map