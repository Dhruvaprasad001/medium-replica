import { z } from 'zod';
export declare const signupzod: any;
export type SignupInput = z.infer<typeof signupzod>;
export declare const signinzod: any;
export type SigninInput = z.infer<typeof signinzod>;
export declare const createBlogPost: any;
export type CreateBlogpost = z.infer<typeof createBlogPost>;
export declare const updateBlogPost: any;
export type UpdateBlogpost = z.infer<typeof updateBlogPost>;
