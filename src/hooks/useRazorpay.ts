import { useCallback } from 'react';

interface RazorpayOptions {
  amount: number;
  currency?: string;
  name?: string;
  description?: string;
  orderId: string;
  onSuccess: (response: any) => void;
  onFailure?: (error: any) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: any) => RazorpayInstance;
  }
}

export const useRazorpay = () => {
  const openCheckout = useCallback((options: RazorpayOptions) => {
    if (!window.Razorpay) {
      console.error('Razorpay SDK not loaded');
      if (options.onFailure) {
        options.onFailure({ message: 'Razorpay SDK not loaded. Please refresh the page.' });
      }
      return;
    }

    // Get key from environment or use test key
    const key = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1234567890';

    const razorpayOptions = {
      key,
      amount: Math.round(options.amount * 100), // Convert to paise
      currency: options.currency || 'INR',
      name: options.name || 'APSE Shopping',
      description: options.description || 'Service Payment',
      order_id: options.orderId,
      handler: function (response: any) {
        console.log('Payment successful:', response);
        options.onSuccess(response);
      },
      prefill: options.prefill || {},
      theme: {
        color: '#3498db',
      },
      modal: {
        ondismiss: function () {
          console.log('Payment modal closed');
          if (options.onFailure) {
            options.onFailure({ message: 'Payment cancelled by user' });
          }
        },
      },
    };

    try {
      const rzp = new window.Razorpay(razorpayOptions);
      rzp.open();
    } catch (error) {
      console.error('Error opening Razorpay:', error);
      if (options.onFailure) {
        options.onFailure(error);
      }
    }
  }, []);

  const isRazorpayLoaded = useCallback(() => {
    return typeof window.Razorpay !== 'undefined';
  }, []);

  return {
    openCheckout,
    isRazorpayLoaded,
  };
};
