import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, ArrowLeft } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

export default function EditDonation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ donorName: 'Rajesh Shah', type: 'Devdravya', amount: '51000', date: '2025-01-15', mode: 'Cheque' })
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <div className="space-y-5 max-w-3xl">
      <PageHeader title="Edit Donation" subtitle={`Editing ID: ${id}`} breadcrumbs={[{ label: 'Home' }, { label: 'Donations' }, { label: 'Edit' }]} action={<Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate('/donations')}>Back</Button>} />
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Donor Name" name="donorName" value={form.donorName} onChange={handleChange} required />
          <Input label="Amount (₹)" name="amount" type="number" value={form.amount} onChange={handleChange} required />
          <Input label="Date" name="date" type="date" value={form.date} onChange={handleChange} />
          <Input label="Mode" name="mode" value={form.mode} onChange={handleChange} />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={() => navigate('/donations')}>Cancel</Button>
          <Button icon={Save} onClick={() => navigate('/donations')}>Update</Button>
        </div>
      </div>
    </div>
  )
}