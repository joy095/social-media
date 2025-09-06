import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
declare class SocialController {
    togglePostLike(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getPostLikes(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    addComment(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getPostComments(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getCommentReplies(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    updateComment(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    deleteComment(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    toggleCommentLike(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    followUser(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    unfollowUser(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getUserFollowers(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getUserFollowing(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getFollowSuggestions(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    private canUserInteractWithPost;
    private detectBotBehavior;
}
declare const _default: SocialController;
export default _default;
//# sourceMappingURL=socialController.d.ts.map