import { z } from "zod";

export const validate = (schema) => async (req, res, next) => {
    try {
        const parseBody = await schema.parseAsync(req.body);
        req.body = parseBody;
        next();
    } catch(err) {

        const issues = err.issues || err.errors;

        if (issues && Array.isArray(issues)) {
            const errorMessage = issues.map((e) => e.message).join(", ");

            return res.status(400).json({
                success: false,
                message: errorMessage,
                errors: err.errors
            });
        }

        next(err);
    }
};


export const validateQuery = (schema) => async (req, res, next) => {
    try {
        const parseQuery = await schema.parseAsync(req.query);
        
        Object.assign(req.query, parseQuery);
        next();
    } catch(err) {

        const issues = err.issues || err.errors;

        if (issues && Array.isArray(issues)) {
            const errorMessage = issues.map((e) => e.message).join(", ");

            return res.status(400).json({
                success: false,
                message: errorMessage,
                errors: err.errors
            });
        }

        next(err);
    }
};