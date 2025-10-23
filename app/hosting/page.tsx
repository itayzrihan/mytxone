"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HostingPage() {
  const [showPayPalModal, setShowPayPalModal] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  useEffect(() => {
    if (showPayPalModal && !paypalLoaded) {
      const script = document.createElement('script');
      script.src = "https://www.paypal.com/sdk/js?client-id=ARMvBbzMghnZIpuJv0MUfhxI2cAMK8-Bhk-DIganTEWt1qJRbFCPuQx6VKZcKahdjOooF9NOz7KTL5vy&vault=true&intent=subscription";
      script.setAttribute('data-sdk-integration-source', 'button-factory');
      script.async = true;
      
      script.onload = () => {
        setPaypalLoaded(true);
        renderPayPalButton();
      };

      document.body.appendChild(script);
    }
  }, [showPayPalModal, paypalLoaded]);

  const renderPayPalButton = () => {
    if ((window as any).paypal) {
      (window as any).paypal.Buttons({
        style: {
          shape: 'pill',
          color: 'blue',
          layout: 'vertical',
          label: 'subscribe'
        },
        createSubscription: function(data: any, actions: any) {
          return actions.subscription.create({
            plan_id: 'P-2S484518PJ907614EM5T42XQ'
          });
        },
        onApprove: function(data: any, actions: any) {
          alert('Subscription successful! ID: ' + data.subscriptionID);
          setShowPayPalModal(false);
        }
      }).render('#paypal-button-container-P-2S484518PJ907614EM5T42XQ');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-cyan-400">Hosting Plans</span>
          </h1>
          <p className="text-xl text-zinc-400">
            Quality and accessible hosting solutions for every need
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Basic Plan */}
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-3">Basic</h3>
              <p className="text-zinc-400 text-sm mb-2">
                <strong>Hosting package at ₪29/month</strong>
              </p>
              <p className="text-zinc-400 text-sm mb-2">
                <strong>The first step towards your entrepreneurial dreams</strong>
              </p>
              <p className="text-zinc-400 text-sm">
                Quality and accessible hosting solutions for every need
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <h4 className="text-4xl font-bold text-white">₪29</h4>
                <span className="text-zinc-400">/monthly</span>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 flex-shrink-0">✓</span>
                <p className="text-zinc-300 text-sm">600MB storage space</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 flex-shrink-0">✓</span>
                <p className="text-zinc-300 text-sm">Unlimited bandwidth</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 flex-shrink-0">✓</span>
                <p className="text-zinc-300 text-sm">Basic technical support</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 flex-shrink-0">✓</span>
                <p className="text-zinc-300 text-sm">Suitable for small websites</p>
              </div>
            </div>

            <button 
              onClick={() => setShowPayPalModal(true)}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300"
            >
              Get Started Now
            </button>
          </div>

          {/* Advanced Plan */}
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-3">Advanced</h3>
              <p className="text-zinc-400 text-sm mb-2">
                <strong>Hosting package at ₪72/month</strong>
              </p>
              <p className="text-zinc-400 text-sm mb-2">
                <strong>An advanced step towards your entrepreneurial dreams</strong>
              </p>
              <p className="text-zinc-400 text-sm">
                Professional hosting solutions for advanced businesses
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <h4 className="text-4xl font-bold text-white">₪72</h4>
                <span className="text-zinc-400">/monthly</span>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 flex-shrink-0">✓</span>
                <p className="text-zinc-300 text-sm">BASIC +</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 flex-shrink-0">✓</span>
                <p className="text-zinc-300 text-sm">2GB storage space</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 flex-shrink-0">✓</span>
                <p className="text-zinc-300 text-sm">Unlimited bandwidth</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 flex-shrink-0">✓</span>
                <p className="text-zinc-300 text-sm">Basic technical support</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 flex-shrink-0">✓</span>
                <p className="text-zinc-300 text-sm">Free SSL certificate</p>
              </div>
            </div>

            <button className="w-full px-6 py-3 bg-zinc-700 text-zinc-400 font-semibold rounded-lg cursor-not-allowed">
              Not Available
            </button>
          </div>

          {/* Accelerate Plan */}
          <div className="backdrop-blur-md bg-white/5 border-2 border-cyan-500/50 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-cyan-500 text-black px-4 py-1 rounded-full text-xs font-bold">
              POPULAR
            </div>
            
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-3">Accelerate</h3>
              <p className="text-zinc-400 text-sm mb-2">
                <strong>Hosting package at ₪150/month</strong>
              </p>
              <p className="text-zinc-400 text-sm">
                <strong>Accelerate your entrepreneurial dreams</strong>
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <h4 className="text-4xl font-bold text-white">₪150</h4>
                <span className="text-zinc-400">/monthly</span>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 flex-shrink-0">✓</span>
                <p className="text-zinc-300 text-sm">Advanced +</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 flex-shrink-0">✓</span>
                <p className="text-zinc-300 text-sm">Personal and customized technical support</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 flex-shrink-0">✓</span>
                <p className="text-zinc-300 text-sm">5GB storage space</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 flex-shrink-0">✓</span>
                <p className="text-zinc-300 text-sm">Daily backups + full recovery option</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 flex-shrink-0">✓</span>
                <p className="text-zinc-300 text-sm">Access to premium forms, automations, and templates</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 flex-shrink-0">✓</span>
                <p className="text-zinc-300 text-sm">Suitable for small and medium businesses</p>
              </div>
            </div>

            <button className="w-full px-6 py-3 bg-zinc-700 text-zinc-400 font-semibold rounded-lg cursor-not-allowed">
              Not Available
            </button>
          </div>

          {/* Cutting-edge Plan */}
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-3">Cutting-edge</h3>
              <p className="text-zinc-400 text-sm mb-2">
                <strong>Hosting package at ₪500/month</strong>
              </p>
              <p className="text-zinc-400 text-sm mb-2">
                <strong>Exceptional hosting with significant business management benefits</strong>
              </p>
              <p className="text-zinc-400 text-sm">
                Premium hosting solution with maximum performance
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <h4 className="text-4xl font-bold text-white">₪500</h4>
                <span className="text-zinc-400">/monthly</span>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 flex-shrink-0">✓</span>
                <p className="text-zinc-300 text-sm">Accelerate+</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 flex-shrink-0">✓</span>
                <p className="text-zinc-300 text-sm">Flexible plan</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 flex-shrink-0">✓</span>
                <p className="text-zinc-300 text-sm">Dedicated team for website management</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 flex-shrink-0">✓</span>
                <p className="text-zinc-300 text-sm">High-priority technical support</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 flex-shrink-0">✓</span>
                <p className="text-zinc-300 text-sm">Access to premium experts in all digital fields</p>
              </div>
            </div>

            <button className="w-full px-6 py-3 bg-zinc-700 text-zinc-400 font-semibold rounded-lg cursor-not-allowed">
              Not Available
            </button>
          </div>

        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="backdrop-blur-md bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-zinc-300 mb-6">
              Contact us for tailored hosting solutions that fit your specific business requirements.
            </p>
            <Link
              href="mailto:mytxone@gmail.com"
              className="inline-block px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 border border-white/20 hover:bg-white/10 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>

      {/* PayPal Modal */}
      {showPayPalModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowPayPalModal(false)}
        >
          <div 
            className="relative max-w-md w-full mx-4 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowPayPalModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Basic Hosting Plan</h3>
              <p className="text-zinc-300">₪29/month - Start your journey today</p>
            </div>

            {/* PayPal Button Container */}
            <div id="paypal-button-container-P-2S484518PJ907614EM5T42XQ" className="mb-4"></div>

            {/* Loading State */}
            {!paypalLoaded && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                <p className="text-zinc-400 mt-4">Loading PayPal...</p>
              </div>
            )}

            {/* Info Text */}
            <p className="text-sm text-zinc-400 text-center mt-4">
              Secure payment powered by PayPal
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
