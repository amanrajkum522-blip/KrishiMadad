// src/services/api.js
// All communication with Google Sheets goes through this file

const API_URL = import.meta.env.VITE_API_URL;

// Helper: makes a GET request
async function get(params) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}?${query}`);
  return res.json();
}

// Helper: makes a POST request
async function post(data) {
  const res = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.json();
}

// ---- Auth ----
export const loginUser = (phone, password) =>
  get({ action: 'login', phone, password });

export const registerUser = (userData) =>
  post({ action: 'register', ...userData });

// ---- Bids ----
export const getAllBids = () =>
  get({ action: 'getBids' });

export const postBid = (bidData) =>
  post({ action: 'postBid', ...bidData });

// ---- Requests ----
export const sendRequest = (requestData) =>
  post({ action: 'sendRequest', ...requestData });

export const getFarmerRequests = (farmerID) =>
  get({ action: 'getRequests', farmerID });

export const getVendorRequests = (vendorID) =>
  get({ action: 'getVendorRequests', vendorID });

export const updateStatus = (reqID, status) =>
  post({ action: 'updateStatus', reqID, status });