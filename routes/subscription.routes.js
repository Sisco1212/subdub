import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { createSubscription, getUserSubscriptions, getSubscriptionDetails, getAllSubscription, updateSubscription } from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', getAllSubscription);

subscriptionRouter.get('/:id', authorize, getSubscriptionDetails);

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.patch('/:id', updateSubscription);

subscriptionRouter.delete('/:id', (req, res) => res.send({title: "DELETE subscription"}));

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

subscriptionRouter.put('/:id/cancel', (req, res) => res.send({title: "CANCEL subscription"}));

subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send({title: "GET upcoming renewals"}));

export default subscriptionRouter;