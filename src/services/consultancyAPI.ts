const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim();

// ============ Consultancy Types ============

export interface Service {
  id: string;
  stage: 'PRODUCT_RESEARCH' | 'PRODUCT_SELECTION' | 'MARKET_SEARCH' | 'PARTNER_MATCHING' | 'DEAL_COMPLETION';
  name: string;
  description: string;
  icon?: string;
  order: number;
  isActive: boolean;
  canStartHere: boolean;
  pricingRules?: PricingRule[];
  createdAt: string;
  updatedAt: string;
}

export interface PricingRule {
  id: string;
  type: 'FIXED' | 'PERCENTAGE';
  value: number;
  category?: string;
  geography?: string;
  seasonality?: string;
  buyerType?: string;
  minVolume?: number;
  maxVolume?: number;
  isActive: boolean;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  status: 'ACTIVE' | 'SUSPENDED';
  totalLoaded: number;
  totalUsed: number;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: 'WALLET_LOAD' | 'SERVICE_PAYMENT' | 'REFUND';
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  paymentMethod?: string;
  description?: string;
  createdAt: string;
}

export interface WalletTransactionsResponse {
  balance: number;
  currency: string;
  transactions: WalletTransaction[];
}

export interface Partner {
  id: string;
  userId: string;
  name: string;
  type: 'CHA' | 'SHIPPING' | 'DOCUMENTER' | 'LAB' | 'INSPECTOR' | 'BANK' | 'CONSULTANT';
  specialties?: string[];
  rating: number;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  region?: string;
  country?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserService {
  id: string;
  userId: string;
  serviceId: string;
  stage: string;
  status: 'WISH_LIST' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED';
  startedAt: string;
  completedAt?: string;
  amountPaid: number;
  progress: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPricingRule {
  id: string;
  name?: string;
  pricingType: 'FIXED' | 'PERCENTAGE';
  value: number;
  serviceId: string;
  category?: string | null;
  geography?: string | null;
  seasonality?: string | null;
  minVolume?: number | null;
  maxVolume?: number | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminPendingPartner {
  id: string;
  companyName: string;
  type: string;
  specialties?: string[] | null;
  servicesOffered?: string[] | null;
  country?: string | null;
  city?: string | null;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
}

export interface AdminUserRecord {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

export interface AnalyticsSummary {
  totalUsers: number;
  activeServices: number;
  totalRevenue: number;
  completedServices: number;
  conversionRate: number;
}

export interface TopPartner {
  name: string;
  serviceCount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// ============ Helper Function ============

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_URL}${endpoint}`;
  const authHeaders = getAuthHeader();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...authHeaders,
    ...(options.headers as Record<string, string> || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============ Auth API ============

export const authAPI = {
  login: (email: string, password: string) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (email: string, password: string, firstName?: string, lastName?: string) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName }),
    }),
  requestPasswordReset: (email: string) =>
    apiCall('/auth/request-reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token: string, password: string) =>
    apiCall('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
  verifyEmail: (token: string) =>
    apiCall(`/auth/verify-email/${token}`, {
      method: 'GET',
    }),
  resendVerification: (email: string) =>
    apiCall('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

// ============ Services API ============

export const servicesAPI = {
  getAll: () => apiCall<Service[]>('/services'),
  getById: (id: string) => apiCall<Service>(`/services/${id}`),
  calculatePrice: (id: string, data: {
    category?: string;
    geography?: string;
    volume?: number;
    seasonality?: string;
    buyerType?: string;
  }) =>
    apiCall<{
      serviceId: string;
      serviceName: string;
      appliedRule: {
        id: string;
        name: string;
        type: string;
        value: number;
      };
      calculatedPrice: number;
      currency: string;
    }>(
      `/services/${id}/calculate-price`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    ),
  purchase: (id: string, calculatedPrice?: number, paymentMethod?: string) =>
    apiCall<UserService>(`/services/${id}/purchase`, {
      method: 'POST',
      body: JSON.stringify({ calculatedPrice, paymentMethod }),
    }),
  getUserServices: () => apiCall<UserService[]>('/services/user/my-services'),
};

// ============ Wallet API ============

export const walletAPI = {
  getBalance: () => apiCall<Wallet>('/wallet/balance'),
  loadWallet: (amount: number, paymentMethod?: string) =>
    apiCall<WalletTransaction>('/wallet/load', {
      method: 'POST',
      body: JSON.stringify({ amount, paymentMethod }),
    }),
  getTransactions: () => apiCall<WalletTransactionsResponse>('/wallet/transactions'),
};

// ============ Payment API ============

export const paymentAPI = {
  createWalletLoadOrder: (amount: number) =>
    apiCall<{ orderId: string; amount: number; currency: string; keyId?: string }>('/payments/wallet/create-order', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),
  verifyWalletPayment: (
    orderId: string,
    paymentId: string,
    signature: string
  ) =>
    apiCall<{ transaction: WalletTransaction; wallet: Wallet }>('/payments/wallet/verify', {
      method: 'POST',
      body: JSON.stringify({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
      }),
    }),
  createServicePaymentOrder: (userServiceId: string, amount: number, paymentMethod?: 'WALLET' | 'RAZORPAY') =>
    apiCall<{ orderId: string; amount: number; currency: string }>('/payments/service/create-order', {
      method: 'POST',
      body: JSON.stringify({ userServiceId, amount, paymentMethod }),
    }),
  verifyServicePayment: (
    orderId: string,
    paymentId: string,
    signature: string,
    userServiceId: string
  ) =>
    apiCall<{ userService: UserService; transaction: WalletTransaction }>('/payments/service/verify', {
      method: 'POST',
      body: JSON.stringify({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        userServiceId,
      }),
    }),
};

// ============ Admin API ============

export const adminAPI = {
  getPricingRules: () => apiCall<AdminPricingRule[]>('/admin/pricing-rules'),
  createPricingRule: (data: {
    pricingType: 'FIXED' | 'PERCENTAGE';
    value: number;
    serviceId: string;
    name?: string;
    category?: string;
    geography?: string;
    seasonality?: string;
    minVolume?: number | null;
    maxVolume?: number | null;
  }) =>
    apiCall<AdminPricingRule>('/admin/pricing-rules', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updatePricingRule: (id: string, data: Partial<Omit<AdminPricingRule, 'id' | 'serviceId'>> & { pricingType?: 'FIXED' | 'PERCENTAGE' }) =>
    apiCall<AdminPricingRule>(`/admin/pricing-rules/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deletePricingRule: (id: string) =>
    apiCall(`/admin/pricing-rules/${id}`, {
      method: 'DELETE',
    }),
  getPendingPartners: () => apiCall<AdminPendingPartner[]>('/admin/partners/pending'),
  approvePartner: (id: string) =>
    apiCall<AdminPendingPartner>(`/admin/partners/${id}/approve`, {
      method: 'POST',
    }),
  rejectPartner: (id: string) =>
    apiCall<AdminPendingPartner>(`/admin/partners/${id}/reject`, {
      method: 'POST',
    }),
  getUsers: (role?: string) =>
    apiCall<AdminUserRecord[]>(`/admin/users${role ? `?role=${encodeURIComponent(role)}` : ''}`),
  updateUserStatus: (id: string, isVerified: boolean) =>
    apiCall<AdminUserRecord>(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isVerified }),
    }),
  updateUserRole: (id: string, role: string) =>
    apiCall<AdminUserRecord>(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),
  getAnalyticsSummary: () => apiCall<AnalyticsSummary>('/admin/analytics/summary'),
  getTopPartners: () => apiCall<TopPartner[]>('/admin/analytics/top-partners'),
};

// ============ Partners API ============

export const partnersAPI = {
  getAll: (filters?: { type?: string; country?: string; specialty?: string }) =>
    apiCall<Partner[]>(
      `/partners${filters ? `?${new URLSearchParams(filters as any).toString()}` : ''}`
    ),
  getById: (id: string) => apiCall<Partner>(`/partners/${id}`),
  search: (data: { productType?: string; destination?: string; volume?: number; partnerType?: string }) =>
    apiCall<{ internal: any[]; external: any[] }>('/partners/search', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  register: (data: {
    type: string;
    companyName: string;
    description?: string;
    specialties?: string[];
    servicesOffered?: string[];
    country: string;
    city?: string;
    baseFee?: number;
    certifications?: string[];
    documentsUrl?: string;
  }) =>
    apiCall<Partner>('/partners/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  approve: (id: string) =>
    apiCall<Partner>(`/partners/${id}/approve`, {
      method: 'POST',
    }),
};

// ============ Messages API ============

export interface Message {
  id: string;
  fromUserId: string;
  toUserId?: string;
  partnerId?: string;
  subject?: string;
  body: string;
  status: 'SENT' | 'READ' | 'ARCHIVED';
  isSupport: boolean;
  createdAt: string;
  updatedAt: string;
  fromUser?: { id: string; firstName: string | null; lastName: string | null; email: string };
  toUser?: { id: string; firstName: string | null; lastName: string | null; email: string };
}

export const messagesAPI = {
  send: (data: { toUserId?: string; partnerId?: string; subject?: string; body: string; isSupport?: boolean }) =>
    apiCall<Message>('/messages/send', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getReceived: () => apiCall<Message[]>('/messages/received'),
  getSent: () => apiCall<Message[]>('/messages/sent'),
  getSupportTickets: () => apiCall<Message[]>('/messages/support'),
  markAsRead: (messageId: string) =>
    apiCall(`/messages/${messageId}/read`, { method: 'PUT' }),
  archive: (messageId: string) =>
    apiCall(`/messages/${messageId}/archive`, { method: 'PUT' }),
};

// ============ Market Data API ============

export interface MarketData {
  id: string;
  type: string;
  source: string;
  category?: string;
  geography?: string;
  data: any;
  lastCrawled: string;
  isValid: boolean;
  createdAt: string;
}

export const marketDataAPI = {
  getAll: (filters?: { type?: string; category?: string; geography?: string }) =>
    apiCall<MarketData[]>(
      `/market-data${filters ? `?${new URLSearchParams(filters as any).toString()}` : ''}`
    ),
  crawl: (data: { type: string; category?: string; geography?: string }) =>
    apiCall<MarketData[]>('/market-data/crawl', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ─── Notification API ───
export const notificationAPI = {
  sendEmail: (data: {
    type: 'WELCOME' | 'PAYMENT_CONFIRMATION' | 'PARTNER_STATUS' | 'DEAL_UPDATE' | 'CUSTOM';
    recipientEmail: string;
    recipientName?: string;
    subject?: string;
    body?: string;
    data?: Record<string, any>;
  }) =>
    apiCall<{ message: string }>('/notifications/email', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getStatus: () =>
    apiCall<{ configured: boolean; provider: string }>('/notifications/email/status'),
};
