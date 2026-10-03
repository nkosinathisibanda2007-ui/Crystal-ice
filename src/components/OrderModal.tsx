import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  CheckCircle,
  Truck,
  Building2,
  Calendar,
  Clock,
  MessageCircle,
  Phone,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Snowflake
} from 'lucide-react';
import { Product, DeliveryArea, OrderItem, WebsiteSettings } from '../types/index.ts';
import { api } from '../services/api.ts';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  deliveryAreas: DeliveryArea[];
  settings: WebsiteSettings;
  preselectedProduct?: Product | null;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  products,
  deliveryAreas,
  settings,
  preselectedProduct
}) => {
  // Step: 1 = Products, 2 = Fulfillment & Time, 3 = Contact & Review, 4 = Confirmation
  const [step, setStep] = useState<number>(1);
  
  // Selected items: productId -> quantity
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>(() => {
    if (preselectedProduct) {
      return { [preselectedProduct.id]: preselectedProduct.min_order_qty || 1 };
    }
    // Default initial selection with first item
    const first = products[0];
    return first ? { [first.id]: first.min_order_qty || 2 } : {};
  });

  // Fulfillment details
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryAreaId, setDeliveryAreaId] = useState<string>(deliveryAreas[0]?.id || '');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [preferredDate, setPreferredDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<string>('09:00 AM - 11:00 AM');
  const [deliveryNotes, setDeliveryNotes] = useState<string>('');

  // Customer Contact Details
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [businessName, setBusinessName] = useState<string>('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  if (!isOpen) return null;

  const handleQuantityChange = (productId: string, delta: number) => {
    setItemQuantities((prev) => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: next };
    });
  };

  // Compute selected items array and estimated total
  const selectedOrderItems: OrderItem[] = Object.entries(itemQuantities)
    .filter(([_, qty]) => Number(qty) > 0)
    .map(([prodId, qty]) => {
      const product = products.find((p) => p.id === prodId);
      const quantity = Number(qty);
      let unitPrice = product && product.price ? product.price : 0;
      // User rule: $0.75 for 100+ packs minimum, $1.00 for less than 100 packs
      if (product && (product.id === 'prod-1' || product.name.includes('2.5kg'))) {
        unitPrice = quantity >= 100 ? 0.75 : 1.0;
      }
      return {
        product_id: prodId,
        product_name: product ? product.name : 'Ice Product',
        quantity: quantity,
        package_size: product ? product.package_size : 'Pack',
        unit_price: unitPrice
      };
    });

  const selectedArea = deliveryAreas.find((a) => a.id === deliveryAreaId);
  const deliveryFee = deliveryType === 'delivery' && selectedArea ? selectedArea.delivery_fee : 0;
  const itemsSubtotal = selectedOrderItems.reduce(
    (sum, item) => sum + (item.unit_price || 0) * item.quantity,
    0
  );
  const estimatedTotal = itemsSubtotal + deliveryFee;

  const handleNextStep = () => {
    setErrorMessage('');
    if (step === 1) {
      if (selectedOrderItems.length === 0) {
        setErrorMessage('Please select at least 1 ice product to proceed.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (deliveryType === 'delivery' && !deliveryAddress.trim()) {
        setErrorMessage('Please provide a delivery address or dock location.');
        return;
      }
      if (!preferredDate) {
        setErrorMessage('Please choose a preferred delivery/pickup date.');
        return;
      }
      setStep(3);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMessage('Please provide your name and contact phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail || undefined,
        business_name: businessName || undefined,
        delivery_type: deliveryType,
        delivery_area_id: deliveryType === 'delivery' ? deliveryAreaId : undefined,
        delivery_address: deliveryType === 'delivery' ? deliveryAddress : undefined,
        preferred_date: preferredDate,
        preferred_time_slot: preferredTimeSlot,
        items: selectedOrderItems,
        total_estimated_amount: estimatedTotal,
        notes: deliveryNotes || undefined
      };

      const res = await api.submitOrder(payload);
      setConfirmedOrder(res.order);
      setStep(4);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit order request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleanWhatsappNumber = settings.whatsapp_number.replace(/[^0-9]/g, '');
  const orderWhatsappText = confirmedOrder
    ? encodeURIComponent(
        `Hello Crystal Ice Zimbabwe dispatch, I have placed order #${confirmedOrder.reference_number} for ${confirmedOrder.customer_name}. Total: $${confirmedOrder.total_estimated_amount.toFixed(2)}. Please confirm receipt.`
      )
    : '';
  const orderWhatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${orderWhatsappText}`;

  return (
    <div
      id="order-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
    >
      <div
        id="order-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <h3 className="text-lg sm:text-xl font-bold font-['Outfit']">
                {step === 4 ? 'Order Request Dispatched' : 'Place Ice Order'}
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {step === 1 && 'Step 1 of 3: Select ice specifications & quantities'}
              {step === 2 && 'Step 2 of 3: Fulfillment method & delivery window'}
              {step === 3 && 'Step 3 of 3: Contact coordinates & review'}
              {step === 4 && 'Reference confirmation & priority dispatch'}
            </p>
          </div>
          <button
            id="close-order-modal-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar (when not confirmed) */}
        {step < 4 && (
          <div className="bg-slate-100 h-1.5 w-full flex">
            <div
              className="bg-cyan-600 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div
              id="order-error-banner"
              className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: PRODUCT SELECTION */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Available Ice Types
                </span>
                <span className="text-xs font-semibold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full">
                  Subtotal: ${itemsSubtotal.toFixed(2)}
                </span>
              </div>

              <div className="space-y-3">
                {products.map((product) => {
                  const qty = itemQuantities[product.id] || 0;
                  return (
                    <div
                      key={product.id}
                      id={`order-item-row-${product.id}`}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        qty > 0
                          ? 'border-cyan-500 bg-cyan-50/40 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Snowflake className="w-6 h-6 text-cyan-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {product.name}
                          </h4>
                          <p className="text-xs text-slate-500">
                            {product.package_size} • {
                              product.id === 'prod-1' || product.name.includes('2.5kg')
                                ? `$1.00 / bag ($0.75 for 100+ packs)`
                                : product.price ? `$${product.price.toFixed(2)}` : 'Pricing On Request'
                            }
                          </p>
                          {(product.id === 'prod-1' || product.name.includes('2.5kg')) && qty >= 100 && (
                            <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-md inline-block mt-0.5">
                              ✓ Wholesale $0.75 Rate Applied (Free Harare Delivery)
                            </span>
                          )}
                          {(product.id === 'prod-1' || product.name.includes('2.5kg')) && qty > 0 && qty < 100 && (
                            <span className="text-[10px] text-cyan-800 bg-cyan-100 font-medium px-2 py-0.5 rounded-md inline-block mt-0.5">
                              Add {100 - qty} more for $0.75/bag wholesale rate
                            </span>
                          )}
                          {product.dimensions && (
                            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                              {product.dimensions}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        {qty === 0 ? (
                          <button
                            id={`add-product-${product.id}`}
                            onClick={() => handleQuantityChange(product.id, product.min_order_qty || 1)}
                            className="px-3 py-1.5 text-xs font-bold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-xl transition-colors"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center bg-white border border-cyan-300 rounded-xl p-0.5 shadow-sm">
                            <button
                              id={`qty-minus-${product.id}`}
                              onClick={() => handleQuantityChange(product.id, -1)}
                              className="p-1.5 text-slate-600 hover:text-cyan-700 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-extrabold text-slate-900">
                              {qty}
                            </span>
                            <button
                              id={`qty-plus-${product.id}`}
                              onClick={() => handleQuantityChange(product.id, 1)}
                              className="p-1.5 text-slate-600 hover:text-cyan-700 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: FULFILLMENT & TIME */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Fulfillment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      deliveryType === 'delivery'
                        ? 'border-cyan-600 bg-cyan-50/50 shadow-sm ring-1 ring-cyan-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <Truck className="w-4 h-4 text-cyan-600" />
                      <span>Refrigerated Delivery</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Direct dock or freezer drop-off by cold fleet.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('pickup')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      deliveryType === 'pickup'
                        ? 'border-cyan-600 bg-cyan-50/50 shadow-sm ring-1 ring-cyan-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <Building2 className="w-4 h-4 text-cyan-600" />
                      <span>Warehouse Pickup</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Free pickup at Cold Bay plant dock.
                    </p>
                  </button>
                </div>
              </div>

              {deliveryType === 'delivery' && (
                <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Delivery Zone / Service Area
                    </label>
                    <select
                      id="delivery-area-select"
                      value={deliveryAreaId}
                      onChange={(e) => setDeliveryAreaId(e.target.value)}
                      className="w-full p-2.5 text-xs bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      {deliveryAreas.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.area_name} ({area.delivery_fee === 0 ? 'Free Delivery' : `$${area.delivery_fee} fee`})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Street Address & Specific Delivery Location *
                    </label>
                    <input
                      id="delivery-address-input"
                      type="text"
                      placeholder="e.g. 120 Market St, Service Alley Dock 2"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full p-2.5 text-xs bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    />
                  </div>
                </div>
              )}

              {deliveryType === 'pickup' && (
                <div className="p-4 bg-cyan-50/60 rounded-2xl border border-cyan-200 text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-cyan-900">Pickup Facility Location:</p>
                  <p>{settings.physical_address}</p>
                  <p className="text-cyan-800">Hours: {settings.business_hours}</p>
                  <p className="text-[11px] text-slate-500">Pull up to Bay Door 3 for expedited loading.</p>
                </div>
              )}

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Requested Date *</span>
                  </label>
                  <input
                    id="order-preferred-date"
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-2.5 text-xs bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Preferred Time Slot</span>
                  </label>
                  <select
                    id="order-preferred-time"
                    value={preferredTimeSlot}
                    onChange={(e) => setPreferredTimeSlot(e.target.value)}
                    className="w-full p-2.5 text-xs bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="05:00 AM - 07:00 AM">Early Morning (05:00 AM - 07:00 AM)</option>
                    <option value="09:00 AM - 11:00 AM">Morning (09:00 AM - 11:00 AM)</option>
                    <option value="01:00 PM - 03:00 PM">Afternoon (01:00 PM - 03:00 PM)</option>
                    <option value="05:00 PM - 07:00 PM">Evening (05:00 PM - 07:00 PM)</option>
                    <option value="ASAP Express (Next Available Route)">ASAP Express Dispatch</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delivery Notes / Gate Code / Dock Instructions (Optional)
                </label>
                <textarea
                  id="order-delivery-notes"
                  rows={2}
                  placeholder="e.g. Ring loading bell on 4th street, store directly in walk-in freezer."
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full p-2.5 text-xs bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
          )}

          {/* STEP 3: CONTACT DETAILS & SUMMARY */}
          {step === 3 && (
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    id="customer-name-input"
                    type="text"
                    required
                    placeholder="e.g. Liam Sullivan"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 text-xs bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    id="customer-phone-input"
                    type="tel"
                    required
                    placeholder="e.g. (555) 234-5678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2.5 text-xs bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Business / Venue Name (Optional)
                  </label>
                  <input
                    id="customer-business-input"
                    type="text"
                    placeholder="e.g. Velvet Lounge"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full p-2.5 text-xs bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    id="customer-email-input"
                    type="email"
                    placeholder="e.g. liam@venue.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full p-2.5 text-xs bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              {/* Order Summary Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 mt-4">
                <div className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-2">
                  Order Summary
                </div>
                <div className="space-y-1.5 text-xs text-slate-600 max-h-32 overflow-y-auto">
                  {selectedOrderItems.map((item) => (
                    <div key={item.product_id} className="flex justify-between">
                      <span>
                        {item.quantity}× {item.product_name} ({item.package_size})
                      </span>
                      <span className="font-semibold text-slate-800">
                        ${((item.unit_price || 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-xs text-slate-600">
                  <span>Fulfillment ({deliveryType === 'delivery' ? 'Refrigerated Fleet' : 'Warehouse Pickup'}):</span>
                  <span>{deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : 'Free'}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                  <span>Total Estimated Amount:</span>
                  <span className="text-cyan-700 font-['Outfit'] text-base">
                    ${estimatedTotal.toFixed(2)}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  * No online card payment required now. Pay upon delivery or through commercial billing account.
                </p>
              </div>

              <div className="pt-2">
                <button
                  id="confirm-submit-order-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Submitting to Cold Dispatch...</span>
                  ) : (
                    <>
                      <span>Submit Order Request</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: CONFIRMATION SUCCESS */}
          {step === 4 && confirmedOrder && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Order Successfully Dispatched
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2 font-['Outfit']">
                  Reference: {confirmedOrder.reference_number}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Thank you, <span className="font-semibold text-slate-800">{confirmedOrder.customer_name}</span>. Your cold supply order has been received by our central dispatch desk.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500">Scheduled Date:</span>
                  <span className="font-semibold text-slate-900">{confirmedOrder.preferred_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time Window:</span>
                  <span className="font-semibold text-slate-900">{confirmedOrder.preferred_time_slot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Method:</span>
                  <span className="font-semibold text-slate-900 capitalize">{confirmedOrder.delivery_type}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                  <span className="text-slate-900">Total Estimated:</span>
                  <span className="text-cyan-700 font-['Outfit'] text-sm">
                    ${confirmedOrder.total_estimated_amount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-2 space-y-2 max-w-md mx-auto">
                <a
                  id="order-success-whatsapp-btn"
                  href={orderWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Reference #{confirmedOrder.reference_number} via WhatsApp</span>
                </a>

                <button
                  id="close-order-success-btn"
                  onClick={onClose}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs transition-colors"
                >
                  Close & Return to Website
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Navigation (Steps 1 & 2) */}
        {step < 3 && (
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 hidden sm:inline">
                {selectedOrderItems.length} product(s) selected
              </span>
              <button
                id="next-order-step-btn"
                type="button"
                onClick={handleNextStep}
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-colors"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
