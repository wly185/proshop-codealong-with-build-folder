import express from 'express';
import Order from '../models/Order.js';
import asyncHandler from 'express-async-handler';

//post order
//private or protected
const addOrderItems = asyncHandler(async (req, res) => {
  // console.log('controller', req.body.orderItems);
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    throw new Error('no order items');
    res.status(400);
    return;
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }

  // console.log('controller', createdOrder);
});

// get order by id
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate([
    { path: 'user', select: 'name email' },
    {
      path: 'orderItems.product',
      select: 'name price image'
    }
  ]);

  // console.log('controller', order);

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('order not found');
  }
});

//update order by id
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address
    };
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('order not found');
  }
});

//get logged in user orders
//after order paid or from profile
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
  // console.log('controller', orders);
  // console.log('controller', req.user._id);

  if (!orders) {
    throw new Error('no orders found');
  }
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({});
  res.json(orders);
  // console.log('controller', orders);
  // console.log('controller', req.user._id);

  if (!orders) {
    throw new Error('no orders found');
  }
});

const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('order not found');
  }
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered
};
