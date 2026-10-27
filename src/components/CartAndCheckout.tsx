import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Tag, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { CartItem, CustomerUser, OrderRecord, Product, SizeOption } from '../types/store';
import { VALID_COUPONS } from '../data/products';

interface CartAndCheckoutProps {
  isOpen: boolean;
  initialStep?: 'cart' | 'checkout';
  onClose: () => void;
  cart: CartItem[];
  products: Product[];
  appliedCoupon: string | null;
  onApplyCoupon: (code: string | null) => void;
  onUpdateQuantity: (index: number, delta: number) => void;
  onUpdateVariant: (index: number, size: SizeOption, color: string) => void;
  onRemoveItem: (index: number) => void;
  currentUser: CustomerUser | null;
  onPlaceOrder: (order: OrderRecord) => void;
}

export const CartAndCheckout: React.FC<CartAndCheckoutProps> = ({
  isOpen,
  initialStep = 'cart',
  onClose,
  cart,
  products,
  appliedCoupon,
  onApplyCoupon,
  onUpdateQuantity,
  onUpdateVariant,
  onRemoveItem,
  currentUser,
  onPlaceOrder,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmation'>(initialStep);
  const [couponInput, setCouponInput] = useState(appliedCoupon || '');
  const [couponMessage, setCouponMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  // Checkout Form State
  const defaultAddr = currentUser?.addresses.find((a) => a.isDefault) || currentUser?.addresses[0];
  const [fullName, setFullName] = useState(defaultAddr?.fullName || currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(defaultAddr?.phone || currentUser?.phone || '');
  const [street, setStreet] = useState(defaultAddr?.street || '');
  const [city, setCity] = useState(defaultAddr?.city || '');
  const [stateProv, setStateProv] = useState(defaultAddr?.state || '');
  const [postalCode, setPostalCode] = useState(defaultAddr?.postalCode || '');
  const [country, setCountry] = useState(defaultAddr?.country || 'United States');
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'whatsapp-concierge' | 'stripe-card'>('cod');
  const [formError, setFormError] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
      setFormError('');
    }
  }, [isOpen, initialStep]);

  if (!isOpen) return null;

  const detailedItems = cart
    .map((item, index) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      return { ...item, index, product };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const subtotal = detailedItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const couponData = appliedCoupon ? VALID_COUPONS[appliedCoupon] : null;
  const discount = couponData ? Math.round((subtotal * couponData.discountPercent) / 100) : 0;
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const shipping =
    detailedItems.length === 0
      ? 0
      : deliveryMethod === 'express'
      ? 25
      : discountedSubtotal >= 350
      ? 0
      : 18;
  const tax = Math.round(discountedSubtotal * 0.08 * 100) / 100;
  const total = Math.round((discountedSubtotal + shipping + tax) * 100) / 100;

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponInput.trim().toUpperCase();
    if (!clean) {
      onApplyCoupon(null);
      setCouponMessage(null);
      return;
    }
    if (VALID_COUPONS[clean]) {
      onApplyCoupon(clean);
      setCouponMessage({
        type: 'ok',
        text: `Applied ${clean}: ${VALID_COUPONS[clean].description}`,
      });
    } else {
      setCouponMessage({
        type: 'err',
        text: 'Invalid privilege code. Try VALMONT15 or HERITAGE10.',
      });
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (detailedItems.length === 0) {
      setFormError('Your shopping bag is empty.');
      return;
    }
    if (!fullName.trim() || !email.trim() || !phone.trim() || !street.trim() || !city.trim() || !postalCode.trim()) {
      setFormError('Please complete all required customer and shipping address fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError('Please enter a valid email address for order confirmation.');
      return;
    }
    if (paymentMethod === 'stripe-card') {
      setFormError(
        'Online card processing requires a live payment gateway connection. To avoid simulating a card charge, please select Cash on Delivery (Pay on Arrival) or Atelier Concierge Invoice.'
      );
      return;
    }

    const orderNum = `VLM-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: OrderRecord = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      status: 'Confirmed',
      items: detailedItems.map((item) => ({
        productId: item.productId,
        name: item.product.name,
        image: item.product.image,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        unitPrice: item.product.price,
      })),
      subtotal,
      discount,
      shipping,
      tax,
      total,
      paymentMethod:
        paymentMethod === 'cod'
          ? 'Cash on Delivery (Verified on Arrival)'
          : 'Atelier Concierge Direct Invoice',
      deliveryMethod:
        deliveryMethod === 'express'
          ? 'DHL Express Air (1–2 Business Days)'
          : 'Complimentary Insured Courier (3–5 Business Days)',
      shippingAddress: {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        street: street.trim(),
        city: city.trim(),
        state: stateProv.trim(),
        postalCode: postalCode.trim(),
        country: country.trim(),
      },
    };

    setConfirmedOrder(newOrder);
    onPlaceOrder(newOrder);
    setStep('confirmation');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl bg-[#FAF8F5] h-full flex flex-col shadow-2xl border-l border-[#E6DFD6]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#3B0D14] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#E5C39C]" />
            <h2 className="font-serif-display text-xl font-semibold tracking-wide">
              {step === 'cart'
                ? `Shopping Bag (${detailedItems.reduce((s, i) => s + i.quantity, 0)})`
                : step === 'checkout'
                ? 'Atelier Checkout'
                : 'Order Confirmation'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="p-1.5 text-white/80 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'cart' && (
            <>
              {detailedItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <ShoppingBag className="w-12 h-12 text-[#B8A59C] mb-4" />
                  <h3 className="font-serif-display text-2xl font-semibold text-[#1A1615] mb-2">
                    Your Shopping Bag is Empty
                  </h3>
                  <p className="text-xs text-[#6E625C] max-w-xs mb-6">
                    Explore our handcrafted full-grain biker, cafe racer, bomber, and velour suede outerwear.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 bg-[#3B0D14] text-white text-xs font-semibold tracking-wider rounded-xs cursor-pointer"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-[#EFEAE2] px-3.5 py-2.5 rounded-xs text-xs text-[#3B2318]">
                    {discountedSubtotal >= 350
                      ? 'You have unlocked Complimentary Insured Courier Shipping.'
                      : `Add $${(350 - discountedSubtotal).toFixed(0)} more for Complimentary Shipping.`}
                  </div>

                  {detailedItems.map((item) => (
                    <div
                      key={`${item.productId}-${item.size}-${item.color}-${item.index}`}
                      className="bg-white border border-[#E6DFD6] p-3.5 rounded-sm flex gap-4"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-20 h-26 object-cover rounded-xs bg-[#F5F1EB] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-[#1A1615] truncate">
                            {item.product.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.index)}
                            aria-label={`Remove ${item.product.name}`}
                            className="text-[#8C7F78] hover:text-rose-700 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Inline Size & Color Selectors */}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <select
                            value={item.size}
                            aria-label="Item size"
                            onChange={(e) =>
                              onUpdateVariant(item.index, e.target.value as SizeOption, item.color)
                            }
                            className="bg-[#FAF8F5] border border-[#DED5CB] text-[11px] px-2 py-1 rounded-xs"
                          >
                            {item.product.sizes.map((sz) => (
                              <option key={sz} value={sz}>
                                Size: {sz}
                              </option>
                            ))}
                          </select>

                          <select
                            value={item.color}
                            aria-label="Item color"
                            onChange={(e) =>
                              onUpdateVariant(item.index, item.size, e.target.value)
                            }
                            className="bg-[#FAF8F5] border border-[#DED5CB] text-[11px] px-2 py-1 rounded-xs"
                          >
                            {item.product.colors.map((c) => (
                              <option key={c.name} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="inline-flex items-center border border-[#DED5CB] rounded-xs">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.index, -1)}
                              className="px-2.5 py-1 text-xs font-bold hover:bg-[#FAF8F5] cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-2.5 py-1 text-xs font-semibold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.index, 1)}
                              className="px-2.5 py-1 text-xs font-bold hover:bg-[#FAF8F5] cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <span className="text-sm font-bold text-[#1A1615] tabular-nums">
                            ${item.product.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Coupon Code Form */}
                  <form onSubmit={handleCouponSubmit} className="pt-3">
                    <label className="block text-xs font-semibold text-[#1A1615] mb-1.5">
                      Privilege / Coupon Code (Try <span className="text-[#58161E]">VALMONT15</span>)
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 text-[#8C7F78] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          placeholder="Enter coupon code"
                          className="w-full bg-white border border-[#D8CFC5] rounded-xs pl-8 pr-3 py-2 text-xs uppercase focus:outline-none focus:border-[#4A1219]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#1A1615] text-white text-xs font-semibold rounded-xs hover:bg-[#3B0D14] transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {couponMessage && (
                      <p
                        className={`text-xs mt-1.5 ${
                          couponMessage.type === 'ok' ? 'text-emerald-800' : 'text-rose-700'
                        }`}
                      >
                        {couponMessage.text}
                      </p>
                    )}
                  </form>
                </div>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-5">
              <div>
                <h3 className="text-xs font-bold tracking-wider text-[#3B0D14] uppercase mb-3">
                  1. Customer Contact
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Full Name *"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-white border border-[#D8CFC5] rounded-xs px-3 py-2.5 text-xs focus:outline-none focus:border-[#4A1219]"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white border border-[#D8CFC5] rounded-xs px-3 py-2.5 text-xs focus:outline-none focus:border-[#4A1219]"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Mobile / WhatsApp Number *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="sm:col-span-2 bg-white border border-[#D8CFC5] rounded-xs px-3 py-2.5 text-xs focus:outline-none focus:border-[#4A1219]"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold tracking-wider text-[#3B0D14] uppercase mb-3">
                  2. Shipping Destination
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Street Address & Apartment *"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="sm:col-span-2 bg-white border border-[#D8CFC5] rounded-xs px-3 py-2.5 text-xs focus:outline-none focus:border-[#4A1219]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="City *"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="bg-white border border-[#D8CFC5] rounded-xs px-3 py-2.5 text-xs focus:outline-none focus:border-[#4A1219]"
                  />
                  <input
                    type="text"
                    placeholder="State / Province"
                    value={stateProv}
                    onChange={(e) => setStateProv(e.target.value)}
                    className="bg-white border border-[#D8CFC5] rounded-xs px-3 py-2.5 text-xs focus:outline-none focus:border-[#4A1219]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Postal / ZIP Code *"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="bg-white border border-[#D8CFC5] rounded-xs px-3 py-2.5 text-xs focus:outline-none focus:border-[#4A1219]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Country *"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="bg-white border border-[#D8CFC5] rounded-xs px-3 py-2.5 text-xs focus:outline-none focus:border-[#4A1219]"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold tracking-wider text-[#3B0D14] uppercase mb-3">
                  3. Delivery Method
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center justify-between bg-white border border-[#D8CFC5] p-3 rounded-xs cursor-pointer text-xs">
                    <span className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === 'standard'}
                        onChange={() => setDeliveryMethod('standard')}
                        className="accent-[#4A1219]"
                      />
                      <span>Insured Standard Courier (3–5 Business Days)</span>
                    </span>
                    <span className="font-semibold tabular-nums">
                      {discountedSubtotal >= 350 ? 'FREE' : '$18'}
                    </span>
                  </label>
                  <label className="flex items-center justify-between bg-white border border-[#D8CFC5] p-3 rounded-xs cursor-pointer text-xs">
                    <span className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === 'express'}
                        onChange={() => setDeliveryMethod('express')}
                        className="accent-[#4A1219]"
                      />
                      <span>DHL Express Priority Air (1–2 Business Days)</span>
                    </span>
                    <span className="font-semibold tabular-nums">$25</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold tracking-wider text-[#3B0D14] uppercase mb-3">
                  4. Payment Method
                </h3>
                <div className="space-y-2">
                  <label className="flex items-start gap-2.5 bg-white border border-[#D8CFC5] p-3 rounded-xs cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => {
                        setPaymentMethod('cod');
                        setFormError('');
                      }}
                      className="accent-[#4A1219] mt-0.5"
                    />
                    <div>
                      <p className="font-semibold text-[#1A1615]">
                        Cash on Delivery / Pay Upon Inspection
                      </p>
                      <p className="text-[#6E625C] mt-0.5">
                        Pay securely via cash or card terminal upon courier arrival.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 bg-white border border-[#D8CFC5] p-3 rounded-xs cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'whatsapp-concierge'}
                      onChange={() => {
                        setPaymentMethod('whatsapp-concierge');
                        setFormError('');
                      }}
                      className="accent-[#4A1219] mt-0.5"
                    />
                    <div>
                      <p className="font-semibold text-[#1A1615]">
                        Atelier Concierge Bank Transfer / Direct Invoice
                      </p>
                      <p className="text-[#6E625C] mt-0.5">
                        Reserve your size now; our stylist sends an official invoice &amp; sizing check.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 bg-white border border-[#D8CFC5] p-3 rounded-xs cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'stripe-card'}
                      onChange={() => setPaymentMethod('stripe-card')}
                      className="accent-[#4A1219] mt-0.5"
                    />
                    <div>
                      <p className="font-semibold text-[#1A1615]">
                        Online Card Gateway (Stripe — Requires Live Merchant Key)
                      </p>
                      <p className="text-[#6E625C] mt-0.5">
                        Disabled in static storefront mode so no simulated card charge ever occurs.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {formError && (
                <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xs text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}
            </form>
          )}

          {step === 'confirmation' && confirmedOrder && (
            <div className="py-6 space-y-6">
              <div className="text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto mb-3" />
                <p className="text-xs font-semibold tracking-widest text-[#58161E] uppercase">
                  Order Confirmed
                </p>
                <h3 className="font-serif-display text-3xl font-semibold text-[#1A1615] mt-1">
                  Thank You, {confirmedOrder.shippingAddress.fullName}
                </h3>
                <p className="text-xs text-[#6E625C] mt-1">
                  Order Reference: <span className="font-bold text-[#1A1615]">{confirmedOrder.orderNumber}</span>
                </p>
              </div>

              <div className="bg-white border border-[#E6DFD6] p-4 rounded-sm space-y-2 text-xs text-[#4A403B]">
                <div className="flex justify-between">
                  <span className="text-[#6E625C]">Status:</span>
                  <span className="font-semibold text-emerald-800">{confirmedOrder.status} — Preparing Garment Bag</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E625C]">Payment Method:</span>
                  <span className="font-medium text-[#1A1615]">{confirmedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E625C]">Delivery:</span>
                  <span className="font-medium text-[#1A1615]">{confirmedOrder.deliveryMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E625C]">Destination:</span>
                  <span className="font-medium text-[#1A1615] text-right">
                    {confirmedOrder.shippingAddress.street}, {confirmedOrder.shippingAddress.city}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#EFEAE2] text-sm font-bold text-[#1A1615] tabular-nums">
                  <span>Total Amount:</span>
                  <span>${confirmedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 bg-[#3B0D14] text-white text-xs font-semibold tracking-wider rounded-xs hover:bg-[#58161E] cursor-pointer"
              >
                CONTINUE EXPLORING COLLECTION
              </button>
            </div>
          )}
        </div>

        {/* Footer Summary & Action Buttons */}
        {step !== 'confirmation' && detailedItems.length > 0 && (
          <div className="p-6 bg-white border-t border-[#E6DFD6] space-y-3">
            <div className="space-y-1.5 text-xs text-[#4A403B] tabular-nums">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-800 font-medium">
                  <span>Privilege Discount ({appliedCoupon})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Insured Shipping</span>
                <span>{shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#EFEAE2] text-base font-bold text-[#1A1615]">
                <span>Order Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-[#3B0D14] text-white text-xs font-semibold tracking-[0.14em] rounded-xs hover:bg-[#58161E] transition-colors cursor-pointer"
              >
                PROCEED TO CHECKOUT
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="py-3 border border-[#D8CFC5] text-xs font-semibold text-[#1A1615] rounded-xs hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Back to Bag
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  className="col-span-2 py-3 bg-[#3B0D14] text-white text-xs font-semibold tracking-wider rounded-xs hover:bg-[#58161E] cursor-pointer"
                >
                  PLACE ORDER · ${total.toFixed(2)}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
