import { Request, Response, NextFunction } from 'express';
export interface AdminRequest extends Request {
    employee?: any;
}
export declare const adminProtect: (req: AdminRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const authorize: (...roles: string[]) => (req: AdminRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const requirePermission: (permission: string) => (req: AdminRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const adminOnly: (req: AdminRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const managerOrAdmin: (req: AdminRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const accountantOrAbove: (req: AdminRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const logAdminActivity: (action: string) => (req: AdminRequest, res: Response, next: NextFunction) => void;
export declare const adminRateLimit: (windowMs?: number, max?: number) => (req: AdminRequest, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const validateAdminSession: (req: AdminRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
declare const _default: {
    adminProtect: (req: AdminRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    authorize: (...roles: string[]) => (req: AdminRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    requirePermission: (permission: string) => (req: AdminRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    adminOnly: (req: AdminRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    managerOrAdmin: (req: AdminRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    accountantOrAbove: (req: AdminRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    logAdminActivity: (action: string) => (req: AdminRequest, res: Response, next: NextFunction) => void;
    adminRateLimit: (windowMs?: number, max?: number) => (req: AdminRequest, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
    validateAdminSession: (req: AdminRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
};
export default _default;
//# sourceMappingURL=adminAuth.d.ts.map