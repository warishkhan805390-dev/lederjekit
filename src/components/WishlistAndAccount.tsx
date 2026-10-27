import React, { useState } from 'react';
import {
  X,
  Heart,
  User,
  Package,
  MapPin,
  LogOut,
  ShoppingBag,
  Trash2,
  Plus,
  Search,
} from 'lucide-react';
import { CustomerUser, OrderRecord, Product, SavedAddress, SizeOption } from '../types/store';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  products: Product[];
  onRemoveWishlist: (id: string) => void;
  onMoveToCart: (product: Product, size: SizeOption, color: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  products,
  onRemoveWishlist,
  onMoveToCart,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  const items = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-[#FAF8F5] h-full flex flex-col shadow-2xl border-l border-[#E6DFD6]">
        <div className="px-6 py-4 bg-[#3B0D14] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#E5C39C] fill-current" />
            <h2 className="font-serif-display text-xl font-semibold">
              Saved Wishlist ({items.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close wishlist"
            className="p-1 text-white/80 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-10 h-10 text-[#B8A59C] mx-auto mb-3" />
              <h3 className="font-serif-display text-2xl font-semibold text-[#1A1615] mb-1">
                No Saved Silhouettes Yet
              </h3>
              <p className="text-xs text-[#6E625C]">
                Tap the heart icon on any leather jacket to curate your personal wardrobe list.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-[#E6DFD6] p-3.5 rounded-sm flex gap-3.5"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    onClick={() => {
                      onClose();
                      onSelectProduct(product);
                    }}
                    className="w-20 h-26 object-cover rounded-xs cursor-pointer shrink-0 bg-[#F5F1EB]"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          onClick={() => {
                            onClose();
                            onSelectProduct(product);
                          }}
                          className="text-sm font-semibold text-[#1A1615] hover:text-[#58161E] truncate cursor-pointer"
                        >
                          {product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => onRemoveWishlist(product.id)}
                          aria-label={`Remove ${product.name} from wishlist`}
                          className="text-[#8C7F78] hover:text-rose-700 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-[#6E625C] mt-1">{product.category}</p>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectProduct(product);
                        }}
                        className="text-xs font-semibold text-[#3B0D14] hover:underline cursor-pointer"
                      >
                        View Details
                      </button>

                      <a
                        href={`https://wa.me/${import.meta.env.VITE_STORE_WHATSAPP || '18005550194'}?text=${encodeURIComponent(
                          `Hello VALMONT & CO., I want to book: ${product.name}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-semibold rounded-xs bg-[#1E6B43] text-white hover:bg-[#175636]"
                      >
                        Book Now
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface StoredAccount extends CustomerUser {
  passwordHash: string;
}

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CustomerUser | null;
  guestOrders: OrderRecord[];
  onLoginSuccess: (user: CustomerUser) => void;
  onLogout: () => void;
  onUpdateUser: (updated: CustomerUser) => void;
}

const ACCOUNTS_KEY = 'valmont_registered_accounts_v1';

const loadAccounts = (): StoredAccount[] => {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveAccounts = (accounts: StoredAccount[]) => {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
};

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  guestOrders,
  onLoginSuccess,
  onLogout,
  onUpdateUser,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders' | 'tracking'>('orders');

  // Auth fields
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Profile edit
  const [editName, setEditName] = useState(currentUser?.fullName || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [profileSavedMsg, setProfileSavedMsg] = useState('');

  // New Address
  const [addrLabel, setAddrLabel] = useState('Home');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrZip, setAddrZip] = useState('');
  const [addrCountry, setAddrCountry] = useState('United States');

  // Order Tracking Lookup
  const [trackInput, setTrackInput] = useState('');
  const [trackedResult, setTrackedResult] = useState<OrderRecord | null | 'not-found'>(null);

  React.useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.fullName);
      setEditPhone(currentUser.phone);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const accounts = loadAccounts();
    const cleanEmail = emailInput.trim().toLowerCase();

    if (authMode === 'register') {
      if (!nameInput.trim() || !cleanEmail || passwordInput.length < 6) {
        setAuthError('Please enter your name, valid email, and a password of at least 6 characters.');
        return;
      }
      if (accounts.some((a) => a.email.toLowerCase() === cleanEmail)) {
        setAuthError('An account with this email already exists. Please sign in.');
        return;
      }
      const newUser: StoredAccount = {
        id: `usr-${Date.now()}`,
        fullName: nameInput.trim(),
        email: cleanEmail,
        phone: phoneInput.trim(),
        passwordHash: btoa(passwordInput),
        addresses: [],
        orders: [...guestOrders],
      };
      saveAccounts([...accounts, newUser]);
      const { passwordHash: _, ...publicUser } = newUser;
      onLoginSuccess(publicUser);
    } else {
      const match = accounts.find(
        (a) => a.email.toLowerCase() === cleanEmail && a.passwordHash === btoa(passwordInput)
      );
      if (!match) {
        setAuthError('Invalid email or password.');
        return;
      }
      const { passwordHash: _, ...publicUser } = match;
      onLoginSuccess(publicUser);
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const updated: CustomerUser = {
      ...currentUser,
      fullName: editName.trim() || currentUser.fullName,
      phone: editPhone.trim(),
    };
    const accounts = loadAccounts().map((a) =>
      a.id === updated.id ? { ...a, fullName: updated.fullName, phone: updated.phone } : a
    );
    saveAccounts(accounts);
    onUpdateUser(updated);
    setProfileSavedMsg('Profile preferences updated.');
    setTimeout(() => setProfileSavedMsg(''), 2500);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !addrStreet.trim() || !addrCity.trim() || !addrZip.trim()) return;
    const newAddress: SavedAddress = {
      id: `addr-${Date.now()}`,
      label: addrLabel || 'Residence',
      fullName: currentUser.fullName,
      phone: currentUser.phone || '+1 800 555 0194',
      street: addrStreet.trim(),
      city: addrCity.trim(),
      state: addrState.trim(),
      postalCode: addrZip.trim(),
      country: addrCountry.trim(),
      isDefault: currentUser.addresses.length === 0,
    };
    const updated: CustomerUser = {
      ...currentUser,
      addresses: [...currentUser.addresses, newAddress],
    };
    const accounts = loadAccounts().map((a) =>
      a.id === updated.id ? { ...a, addresses: updated.addresses } : a
    );
    saveAccounts(accounts);
    onUpdateUser(updated);
    setAddrStreet('');
    setAddrCity('');
    setAddrState('');
    setAddrZip('');
  };

  const handleDeleteAddress = (addrId: string) => {
    if (!currentUser) return;
    const updated: CustomerUser = {
      ...currentUser,
      addresses: currentUser.addresses.filter((a) => a.id !== addrId),
    };
    const accounts = loadAccounts().map((a) =>
      a.id === updated.id ? { ...a, addresses: updated.addresses } : a
    );
    saveAccounts(accounts);
    onUpdateUser(updated);
  };

  const allKnownOrders = [
    ...(currentUser?.orders || []),
    ...guestOrders.filter((go) => !(currentUser?.orders || []).some((uo) => uo.id === go.id)),
  ];

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const q = trackInput.trim().toUpperCase();
    const found = allKnownOrders.find((o) => o.orderNumber.toUpperCase() === q);
    setTrackedResult(found || 'not-found');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] border border-[#E6DFD6] rounded-sm max-w-2xl w-full max-h-[88vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#3B0D14] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-[#E5C39C]" />
            <h2 className="font-serif-display text-xl font-semibold">
              {currentUser ? `Welcome, ${currentUser.fullName}` : 'Valmont Client Account'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close account modal"
            className="p-1 text-white/80 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {!currentUser ? (
            <div className="max-w-md mx-auto">
              <div className="grid grid-cols-2 gap-1 p-1 bg-[#EFEAE2] rounded-xs mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setAuthError('');
                  }}
                  className={`py-2 text-xs font-semibold rounded-xs cursor-pointer ${
                    authMode === 'login' ? 'bg-white text-[#1A1615] shadow-2xs' : 'text-[#6E625C]'
                  }`}
                >
                  Client Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setAuthError('');
                  }}
                  className={`py-2 text-xs font-semibold rounded-xs cursor-pointer ${
                    authMode === 'register' ? 'bg-white text-[#1A1615] shadow-2xs' : 'text-[#6E625C]'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                {authMode === 'register' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-[#1A1615] mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="Alexander Vance"
                        className="w-full bg-white border border-[#D8CFC5] rounded-xs px-3 py-2.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1A1615] mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="+1 800 555 0194"
                        className="w-full bg-white border border-[#D8CFC5] rounded-xs px-3 py-2.5 text-xs"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#1A1615] mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="client@domain.com"
                    className="w-full bg-white border border-[#D8CFC5] rounded-xs px-3 py-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1615] mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-white border border-[#D8CFC5] rounded-xs px-3 py-2.5 text-xs"
                  />
                </div>

                {authError && <p className="text-xs text-rose-700 font-medium">{authError}</p>}

                <button
                  type="submit"
                  className="w-full py-3 bg-[#3B0D14] text-white text-xs font-semibold tracking-wider rounded-xs hover:bg-[#58161E] cursor-pointer"
                >
                  {authMode === 'login' ? 'SIGN IN TO ACCOUNT' : 'REGISTER CLIENT ACCOUNT'}
                </button>
              </form>

              {/* Quick Guest Order Status Tracker */}
              <div className="mt-8 pt-6 border-t border-[#E6DFD6]">
                <h4 className="text-xs font-bold tracking-wider uppercase text-[#3B0D14] mb-2">
                  Track Order Status
                </h4>
                <form onSubmit={handleTrackOrder} className="flex gap-2">
                  <input
                    type="text"
                    value={trackInput}
                    onChange={(e) => setTrackInput(e.target.value)}
                    placeholder="Enter Order # (e.g. VLM-123456)"
                    className="flex-1 bg-white border border-[#D8CFC5] rounded-xs px-3 py-2 text-xs uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1A1615] text-white text-xs font-semibold rounded-xs cursor-pointer"
                  >
                    Track
                  </button>
                </form>
                {trackedResult === 'not-found' && (
                  <p className="text-xs text-rose-700 mt-2">No order found matching that reference number.</p>
                )}
                {trackedResult && trackedResult !== 'not-found' && (
                  <div className="mt-3 bg-white border border-[#E6DFD6] p-3 rounded-xs text-xs">
                    <p className="font-semibold text-[#1A1615]">
                      {trackedResult.orderNumber} — <span className="text-emerald-800">{trackedResult.status}</span>
                    </p>
                    <p className="text-[#6E625C] mt-0.5">
                      Placed {trackedResult.createdAt} · {trackedResult.deliveryMethod}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              {/* Logged-in Navigation Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-[#E6DFD6]">
                <div className="flex flex-wrap gap-1.5">
                  {(
                    [
                      { id: 'orders', label: 'Order History', icon: Package },
                      { id: 'tracking', label: 'Track Status', icon: Search },
                      { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
                      { id: 'profile', label: 'Profile Settings', icon: User },
                    ] as const
                  ).map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setActiveTab(t.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xs cursor-pointer ${
                          activeTab === t.id
                            ? 'bg-[#3B0D14] text-white'
                            : 'bg-white text-[#4A403B] border border-[#D8CFC5]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {t.label}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-800 hover:underline cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>

              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {allKnownOrders.length === 0 ? (
                    <p className="text-xs text-[#6E625C] py-8 text-center">
                      You have not placed any orders yet.
                    </p>
                  ) : (
                    allKnownOrders.map((ord) => (
                      <div key={ord.id} className="bg-white border border-[#E6DFD6] p-4 rounded-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#EFEAE2] text-xs">
                          <div>
                            <span className="font-bold text-[#1A1615]">{ord.orderNumber}</span>
                            <span className="text-[#7A6F69] ml-2">· {ord.createdAt}</span>
                          </div>
                          <span className="font-semibold text-emerald-800">{ord.status}</span>
                        </div>
                        <div className="space-y-2 mb-3">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span>
                                {it.name} ({it.size} · {it.color}) × {it.quantity}
                              </span>
                              <span className="font-semibold tabular-nums">
                                ${it.unitPrice * it.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between pt-2 border-t border-[#EFEAE2] text-xs font-bold tabular-nums">
                          <span>Total Paid / Due</span>
                          <span>${ord.total.toFixed(2)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'tracking' && (
                <div className="space-y-4">
                  <form onSubmit={handleTrackOrder} className="flex gap-2">
                    <input
                      type="text"
                      value={trackInput}
                      onChange={(e) => setTrackInput(e.target.value)}
                      placeholder="Enter Order Reference (e.g. VLM-...)"
                      className="flex-1 bg-white border border-[#D8CFC5] rounded-xs px-3 py-2.5 text-xs uppercase"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#3B0D14] text-white text-xs font-semibold rounded-xs cursor-pointer"
                    >
                      Track Shipment
                    </button>
                  </form>
                  {trackedResult === 'not-found' && (
                    <p className="text-xs text-rose-700">Order number not found in your history.</p>
                  )}
                  {trackedResult && trackedResult !== 'not-found' && (
                    <div className="bg-white border border-[#E6DFD6] p-4 rounded-sm space-y-2 text-xs">
                      <p className="font-bold text-sm text-[#1A1615]">
                        Order {trackedResult.orderNumber} — {trackedResult.status}
                      </p>
                      <p className="text-[#6E625C]">Courier: {trackedResult.deliveryMethod}</p>
                      <p className="text-[#6E625C]">
                        Shipping to: {trackedResult.shippingAddress.street}, {trackedResult.shippingAddress.city}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentUser.addresses.map((addr) => (
                      <div key={addr.id} className="bg-white border border-[#E6DFD6] p-3.5 rounded-sm text-xs relative">
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr.id)}
                          aria-label="Delete address"
                          className="absolute top-3 right-3 text-[#8C7F78] hover:text-rose-700 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <p className="font-bold text-[#1A1615] mb-1">{addr.label}</p>
                        <p className="text-[#4A403B]">{addr.street}</p>
                        <p className="text-[#4A403B]">
                          {addr.city}, {addr.state} {addr.postalCode}
                        </p>
                        <p className="text-[#6E625C]">{addr.country}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddAddress} className="bg-white border border-[#E6DFD6] p-4 rounded-sm space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#3B0D14] flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5" /> Add Shipping Address
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        placeholder="Label (Home, Office)"
                        value={addrLabel}
                        onChange={(e) => setAddrLabel(e.target.value)}
                        className="border border-[#D8CFC5] rounded-xs px-3 py-2 text-xs"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Street Address *"
                        value={addrStreet}
                        onChange={(e) => setAddrStreet(e.target.value)}
                        className="border border-[#D8CFC5] rounded-xs px-3 py-2 text-xs"
                      />
                      <input
                        type="text"
                        required
                        placeholder="City *"
                        value={addrCity}
                        onChange={(e) => setAddrCity(e.target.value)}
                        className="border border-[#D8CFC5] rounded-xs px-3 py-2 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={addrState}
                        onChange={(e) => setAddrState(e.target.value)}
                        className="border border-[#D8CFC5] rounded-xs px-3 py-2 text-xs"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Postal Code *"
                        value={addrZip}
                        onChange={(e) => setAddrZip(e.target.value)}
                        className="border border-[#D8CFC5] rounded-xs px-3 py-2 text-xs"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Country *"
                        value={addrCountry}
                        onChange={(e) => setAddrCountry(e.target.value)}
                        className="border border-[#D8CFC5] rounded-xs px-3 py-2 text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#3B0D14] text-white text-xs font-semibold rounded-xs cursor-pointer"
                    >
                      Save Address
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'profile' && (
                <form onSubmit={handleProfileSave} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1615] mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-white border border-[#D8CFC5] rounded-xs px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1615] mb-1">Email (Verified)</label>
                    <input
                      type="email"
                      disabled
                      value={currentUser.email}
                      className="w-full bg-stone-100 border border-[#D8CFC5] rounded-xs px-3 py-2 text-xs text-stone-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1615] mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full bg-white border border-[#D8CFC5] rounded-xs px-3 py-2 text-xs"
                    />
                  </div>
                  {profileSavedMsg && <p className="text-xs text-emerald-800 font-medium">{profileSavedMsg}</p>}
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#3B0D14] text-white text-xs font-semibold rounded-xs cursor-pointer"
                  >
                    Update Profile
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
