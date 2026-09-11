import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import ConfirmDialog from '../../components/ConfirmDialog';
import StatusBadge from '../../components/StatusBadge';
import { PROPERTY_TYPE_LABEL, PURPOSE_LABEL } from '../../utils/format';

const AREA_UNITS = ['GAJ', 'SQFT', 'SQM', 'ACRE', 'HECTARE', 'BIGHA'];
const STATUSES = ['DRAFT', 'PUBLISHED', 'PENDING', 'UNDER_DISCUSSION', 'SOLD', 'RENTED', 'LEASED', 'HIDDEN', 'ARCHIVED'];
const VERIFICATIONS = ['UNVERIFIED', 'CONTACT_VERIFIED', 'DETAILS_VERIFIED', 'DOCUMENTS_PENDING', 'VERIFIED', 'REJECTED'];

const emptyForm = {
  title: '', propertyType: 'PLOT', purpose: 'SALE', status: 'DRAFT', verification: 'UNVERIFIED',
  featured: false, publicPrice: '', priceOnRequest: false, negotiable: false,
  areaValue: '', areaUnit: 'GAJ', address: '', locality: '', city: 'Jewar',
  district: 'Gautam Buddh Nagar', state: 'Uttar Pradesh', pincode: '', landmark: '',
  description: '', seoTitle: '', metaDescription: '',
  ownerAskingPrice: '', minExpectedPrice: '', negotiationFlexibility: '', preferredBuyerType: '',
  preferredTimeline: '', commissionType: '', commissionPercent: '', commissionFixed: '',
  paymentStatus: '', internalNotes: '',
};

const emptyOwner = { fullName: '', phone: '', alternatePhone: '', whatsapp: '', email: '', preferredContact: '', privateNotes: '' };

function toNumber(v) {
  if (v === '' || v === null || v === undefined) return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}

export default function AdminPropertyForm() {
  const { id } = useParams();
  const isEdit = id && id !== 'new';
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [owner, setOwner] = useState(emptyOwner);
  const [useExistingOwner, setUseExistingOwner] = useState(false);
  const [owners, setOwners] = useState([]);
  const [ownerId, setOwnerId] = useState('');
  const [media, setMedia] = useState([]);
  const [activities, setActivities] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.get('/admin/owners').then((res) => setOwners(res.data.data));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/admin/properties/${id}`).then((res) => {
      const p = res.data.data;
      setForm({
        ...emptyForm,
        ...p,
        publicPrice: p.publicPrice ?? '',
        ownerAskingPrice: p.ownerAskingPrice ?? '',
        minExpectedPrice: p.minExpectedPrice ?? '',
        commissionPercent: p.commissionPercent ?? '',
        commissionFixed: p.commissionFixed ?? '',
        areaValue: p.areaValue ?? '',
      });
      setUseExistingOwner(true);
      setOwnerId(p.ownerId);
      setMedia(p.media || []);
      setActivities(p.activities || []);
    });
  }, [id, isEdit]);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  function setOwnerField(key, value) {
    setOwner((o) => ({ ...o, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Guard against the exact failure mode that used to slip through
    // silently: submitting with no owner actually selected/filled.
    if (useExistingOwner && !ownerId) {
      setError('Please select an owner, or switch to "New owner" and fill in their details.');
      return;
    }
    if (!useExistingOwner && (!owner.fullName.trim() || !owner.phone.trim())) {
      setError('Owner name and phone are required.');
      return;
    }
    if (!form.title.trim() || !form.areaValue) {
      setError('Title and area value are required.');
      return;
    }

    setSaving(true);

    // Build the payload explicitly from known fields only — never spread
    // the raw fetched `form` state directly, since on edit it also carries
    // read-only fields (id, slug, propertyCode, media, enquiries,
    // activities, the full nested owner object, timestamps) that have
    // nothing to do with what's being saved.
    const {
      title, propertyType, purpose, status, verification, featured,
      publicPrice, priceOnRequest, negotiable,
      areaValue, areaUnit, address, locality, city, district, state,
      pincode, landmark, description, seoTitle, metaDescription,
      ownerAskingPrice, minExpectedPrice, negotiationFlexibility,
      preferredBuyerType, preferredTimeline, commissionType,
      commissionPercent, commissionFixed, paymentStatus, internalNotes,
    } = form;

    const payload = {
      title, propertyType, purpose, status, verification, featured,
      priceOnRequest, negotiable,
      publicPrice: toNumber(publicPrice),
      areaValue: toNumber(areaValue),
      areaUnit, address, locality, city, district, state, pincode, landmark,
      description, seoTitle, metaDescription,
      ownerAskingPrice: toNumber(ownerAskingPrice),
      minExpectedPrice: toNumber(minExpectedPrice),
      negotiationFlexibility, preferredBuyerType, preferredTimeline, commissionType,
      commissionPercent: toNumber(commissionPercent),
      commissionFixed: toNumber(commissionFixed),
      paymentStatus, internalNotes,
    };

    if (useExistingOwner) {
      payload.ownerId = ownerId;
    } else {
      payload.owner = owner;
    }

    try {
      if (isEdit) {
        await api.put(`/admin/properties/${id}`, payload);
        navigate(0);
      } else {
        const res = await api.post('/admin/properties', payload);
        navigate(`/admin/properties/${res.data.data.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save property. Please check the form.');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const fd = new FormData();
    files.forEach((f) => fd.append('files', f));
    try {
      const res = await api.post(`/admin/properties/${id}/media`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMedia((m) => [...m, ...res.data.data]);
    } catch {
      setError('Image upload failed.');
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteMedia(mediaId) {
    await api.delete(`/admin/properties/${id}/media/${mediaId}`);
    setMedia((m) => m.filter((x) => x.id !== mediaId));
  }

  async function handleSetCover(mediaId) {
    await api.patch(`/admin/properties/${id}/media/${mediaId}/cover`);
    setMedia((m) => m.map((x) => ({ ...x, isCover: x.id === mediaId })));
  }

  async function handleStatusChange(status) {
    await api.patch(`/admin/properties/${id}/status`, { status });
    set('status', status);
  }

  async function handleAddNote() {
    if (!newNote.trim()) return;
    const res = await api.post(`/admin/properties/${id}/activity`, { note: newNote });
    setActivities((a) => [res.data.data, ...a]);
    setNewNote('');
  }

  async function handleArchive() {
    await api.delete(`/admin/properties/${id}`);
    navigate('/admin/properties');
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-stone-900">
          {isEdit ? `Edit ${form.propertyCode || 'Property'}` : 'Add Property'}
        </h1>
        {isEdit && <StatusBadge status={form.status} />}
      </div>

      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      {/* SECTION 1: Basic Information */}
      <fieldset className="card space-y-3 p-4">
        <legend className="px-1 font-semibold text-stone-800">Basic Information</legend>
        <div>
          <label className="label-text">Title</label>
          <input required className="input-field" value={form.title} onChange={(e) => set('title', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div>
            <label className="label-text">Property Type</label>
            <select className="input-field" value={form.propertyType} onChange={(e) => set('propertyType', e.target.value)}>
              {Object.entries(PROPERTY_TYPE_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="label-text">Purpose</label>
            <select className="input-field" value={form.purpose} onChange={(e) => set('purpose', e.target.value)}>
              {Object.entries(PURPOSE_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="label-text">Verification</label>
            <select className="input-field" value={form.verification} onChange={(e) => set('verification', e.target.value)}>
              {VERIFICATIONS.map((v) => <option key={v} value={v}>{v.replace('_', ' ')}</option>)}
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
          Featured property
        </label>
      </fieldset>

      {/* SECTION 2: Pricing */}
      <fieldset className="card space-y-3 p-4">
        <legend className="px-1 font-semibold text-stone-800">Pricing (Public)</legend>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-text">Public Price (₹)</label>
            <input type="number" className="input-field" value={form.publicPrice} onChange={(e) => set('publicPrice', e.target.value)} />
          </div>
          <div className="flex items-end gap-4 pb-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.priceOnRequest} onChange={(e) => set('priceOnRequest', e.target.checked)} />
              Price on Request
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.negotiable} onChange={(e) => set('negotiable', e.target.checked)} />
              Negotiable
            </label>
          </div>
        </div>
      </fieldset>

      {/* SECTION 3: Area */}
      <fieldset className="card space-y-3 p-4">
        <legend className="px-1 font-semibold text-stone-800">Area</legend>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-text">Area Value</label>
            <input required type="number" className="input-field" value={form.areaValue} onChange={(e) => set('areaValue', e.target.value)} />
          </div>
          <div>
            <label className="label-text">Unit</label>
            <select className="input-field" value={form.areaUnit} onChange={(e) => set('areaUnit', e.target.value)}>
              {AREA_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
      </fieldset>

      {/* SECTION 4: Location */}
      <fieldset className="card space-y-3 p-4">
        <legend className="px-1 font-semibold text-stone-800">Location</legend>
        <input className="input-field" placeholder="Address" value={form.address} onChange={(e) => set('address', e.target.value)} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <input className="input-field" placeholder="Locality" value={form.locality} onChange={(e) => set('locality', e.target.value)} />
          <input className="input-field" placeholder="City" value={form.city} onChange={(e) => set('city', e.target.value)} />
          <input className="input-field" placeholder="District" value={form.district} onChange={(e) => set('district', e.target.value)} />
          <input className="input-field" placeholder="State" value={form.state} onChange={(e) => set('state', e.target.value)} />
          <input className="input-field" placeholder="Pincode" value={form.pincode} onChange={(e) => set('pincode', e.target.value)} />
          <input className="input-field" placeholder="Landmark" value={form.landmark} onChange={(e) => set('landmark', e.target.value)} />
        </div>
      </fieldset>

      {/* SECTION 5: Description */}
      <fieldset className="card space-y-3 p-4">
        <legend className="px-1 font-semibold text-stone-800">Description</legend>
        <textarea className="input-field min-h-[120px]" value={form.description} onChange={(e) => set('description', e.target.value)} />
      </fieldset>

      {/* SECTION 6: Media — only available once the property exists */}
      <fieldset className="card space-y-3 p-4">
        <legend className="px-1 font-semibold text-stone-800">Media</legend>
        {!isEdit ? (
          <p className="text-sm text-stone-500">Save the property first, then upload images and videos.</p>
        ) : (
          <>
            <input type="file" multiple accept="image/*,video/*" onChange={handleUpload} disabled={uploading} />
            {uploading && <p className="text-xs text-stone-500">Uploading…</p>}
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {media.map((m) => (
                <div key={m.id} className="relative overflow-hidden rounded-md border border-stone-200">
                  {m.type === 'VIDEO' ? (
                    <video src={m.url} className="h-24 w-full object-cover" />
                  ) : (
                    <img src={m.url} alt="" className="h-24 w-full object-cover" />
                  )}
                  {m.isCover && <span className="absolute left-1 top-1 rounded bg-brand-600 px-1.5 py-0.5 text-[10px] text-white">Cover</span>}
                  <div className="flex divide-x divide-stone-200 border-t border-stone-200 text-[11px]">
                    {!m.isCover && (
                      <button type="button" onClick={() => handleSetCover(m.id)} className="flex-1 py-1 hover:bg-stone-50">
                        Set Cover
                      </button>
                    )}
                    <button type="button" onClick={() => handleDeleteMedia(m.id)} className="flex-1 py-1 text-red-600 hover:bg-red-50">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </fieldset>

      {/* SECTION 8: Owner */}
      <fieldset className="card space-y-3 p-4">
        <legend className="px-1 font-semibold text-stone-800">Owner (Private — never shown publicly)</legend>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="radio" checked={useExistingOwner} onChange={() => setUseExistingOwner(true)} />
            Existing owner
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={!useExistingOwner} onChange={() => setUseExistingOwner(false)} />
            New owner
          </label>
        </div>

        {useExistingOwner ? (
          <select className="input-field" value={ownerId} onChange={(e) => setOwnerId(e.target.value)}>
            <option value="">Select an owner</option>
            {owners.map((o) => <option key={o.id} value={o.id}>{o.fullName} — {o.phone}</option>)}
          </select>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <input className="input-field" placeholder="Full name" value={owner.fullName} onChange={(e) => setOwnerField('fullName', e.target.value)} />
            <input className="input-field" placeholder="Phone" value={owner.phone} onChange={(e) => setOwnerField('phone', e.target.value)} />
            <input className="input-field" placeholder="WhatsApp" value={owner.whatsapp} onChange={(e) => setOwnerField('whatsapp', e.target.value)} />
            <input className="input-field" placeholder="Email" value={owner.email} onChange={(e) => setOwnerField('email', e.target.value)} />
            <textarea className="input-field col-span-2 min-h-[70px]" placeholder="Private notes about the owner" value={owner.privateNotes} onChange={(e) => setOwnerField('privateNotes', e.target.value)} />
          </div>
        )}
      </fieldset>

      {/* SECTION: Private Deal Information */}
      <fieldset className="card space-y-3 border-amber-200 bg-amber-50/30 p-4">
        <legend className="px-1 font-semibold text-stone-800">Private Deal Information (Admin Only)</legend>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-text">Owner Asking Price (₹)</label>
            <input type="number" className="input-field" value={form.ownerAskingPrice} onChange={(e) => set('ownerAskingPrice', e.target.value)} />
          </div>
          <div>
            <label className="label-text">Minimum Expected (₹)</label>
            <input type="number" className="input-field" value={form.minExpectedPrice} onChange={(e) => set('minExpectedPrice', e.target.value)} />
          </div>
          <div>
            <label className="label-text">Negotiation Flexibility</label>
            <input className="input-field" placeholder="low / moderate / high" value={form.negotiationFlexibility} onChange={(e) => set('negotiationFlexibility', e.target.value)} />
          </div>
          <div>
            <label className="label-text">Commission %</label>
            <input type="number" className="input-field" value={form.commissionPercent} onChange={(e) => set('commissionPercent', e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label-text">Internal Notes</label>
          <textarea className="input-field min-h-[80px]" value={form.internalNotes} onChange={(e) => set('internalNotes', e.target.value)} />
        </div>
      </fieldset>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Property'}
        </button>
        {isEdit && (
          <button type="button" onClick={() => setConfirmArchive(true)} className="btn-secondary text-red-600">
            Archive Property
          </button>
        )}
      </div>

      {isEdit && (
        <fieldset className="card space-y-3 p-4">
          <legend className="px-1 font-semibold text-stone-800">Status &amp; Activity</legend>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => handleStatusChange(s)}
                className={`rounded-md border px-2.5 py-1 text-xs font-medium ${
                  form.status === s ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-stone-300 text-stone-600'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input className="input-field" placeholder="Add an internal activity note…" value={newNote} onChange={(e) => setNewNote(e.target.value)} />
            <button type="button" onClick={handleAddNote} className="btn-secondary">Add</button>
          </div>

          <div className="max-h-56 space-y-2 overflow-y-auto text-sm">
            {activities.map((a) => (
              <div key={a.id} className="rounded-md bg-stone-50 p-2">
                <p>{a.note}</p>
                <p className="text-xs text-stone-400">{new Date(a.createdAt).toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
        </fieldset>
      )}

      <ConfirmDialog
        open={confirmArchive}
        title="Archive this property?"
        description="The property will be moved to Archived status. This can be reversed later by changing its status."
        confirmLabel="Archive"
        onConfirm={handleArchive}
        onCancel={() => setConfirmArchive(false)}
      />
    </form>
  );
}
