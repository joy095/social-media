import { Response, NextFunction } from 'express';
import { AdminRequest } from '../middleware/adminAuth.js';
declare class AdminController {
    login(req: AdminRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    createEmployee(req: AdminRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getEmployees(req: AdminRequest, res: Response, next: NextFunction): Promise<void>;
    updateEmployee(req: AdminRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    setRevenuePricing(req: AdminRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getRevenuePricing(req: AdminRequest, res: Response, next: NextFunction): Promise<void>;
    getPosts(req: AdminRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    approvePost(req: AdminRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getApprovedPosts(req: AdminRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    processPayment(req: AdminRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    updatePaymentStatus(req: AdminRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getPaymentHistory(req: AdminRequest, res: Response, next: NextFunction): Promise<void>;
    getDashboardStats(req: AdminRequest, res: Response, next: NextFunction): Promise<void>;
    getBotActivityReport(req: AdminRequest, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: AdminController;
export default _default;
//# sourceMappingURL=adminController.d.ts.map