"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogPost = exports.createBlogPost = exports.signinzod = exports.signupzod = void 0;
const zod_1 = require("zod");
exports.signupzod = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(5),
    name: zod_1.z.string()
});
exports.signinzod = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(5)
});
exports.createBlogPost = zod_1.z.object({
    title: zod_1.z.string(),
    content: zod_1.z.string()
});
exports.updateBlogPost = zod_1.z.object({
    title: zod_1.z.string(),
    content: zod_1.z.string(),
    id: zod_1.z.string().uuid()
});
