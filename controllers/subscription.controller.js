import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";
import { SERVER_URL } from "../config/env.js"

export const createSubscription = async (req, res, next) => {
    try {

        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        })

        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id,
            },
            headers: {
                'content-type': 'application/json',
            },
            retries: 0,
        })

        res.status(201).json({ success: true, data: { subscription, workflowRunId } })
    } catch (error) {
        next(error);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        if (req.user.id != req.params.id) {
            const error = new Error("You are not the owner of this account");
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id });
        res.status(200).json({ success: true, data: subscriptions });
    } catch (error) {
        next(error);
    }
}

export const getSubscriptionDetails = async (req, res, next) => {
    try {

        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.status = 404;
            throw error;
        }
        if (subscription.user.toString() != req.user._id.toString()) {
            const error = new Error("You are not the owner of this subscription");
            error.status = 403;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: subscription,
        })

    } catch (error) {
        next(error);
    }
}


export const getAllSubscription = async (req, res, next) => {
    try {

        const subscriptions = await Subscription.find();

        res.status(200).json({
            success: true,
            data: subscriptions
        })

    } catch (error) {
        next(error)
    }
}

export const updateSubscription = async (req, res, next) => {

    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.status = 404;
            throw error;
        }

        if (subscription.user.toString() != req.user._id) {
            const error = new Error("You are not the owner of this subscription");
            error.status = 403;
            throw error;
        }

        //         const {
        //     name,
        //     price,
        //     currency,
        //     frequency,
        //     category,
        //     paymentMethod,
        //     startDate
        // } = req.body;

        const updates = {};

        const allowedFields = [
            'name',
            'price',
            'currency',
            'frequency',
            'category',
            'paymentMethod',
            'startDate'
        ];


        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        const newStartDate = req.body.startDate !== undefined
            ? new Date(req.body.startDate)
            : subscription.startDate;

        const newFrequency = req.body.frequency !== undefined
            ? req.body.frequency
            : subscription.frequency;


        if (
            req.body.startDate !== undefined ||
            req.body.frequency !== undefined
        ) {
            const renewalPeriods = {
                daily: 1,
                weekly: 7,
                monthly: 30,
                yearly: 365,
            };

            const renewalDate = new Date(newStartDate);

            renewalDate.setDate(
                renewalDate.getDate() + renewalPeriods[newFrequency]
            );

            updates.renewalDate = renewalDate;
        }

        subscription.set(updates);
        await subscription.save();

        res.status(200).json({
            success: true,
            data: subscription
        });




    } catch (error) {
        next(error)
    }
}