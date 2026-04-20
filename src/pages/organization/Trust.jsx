import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import CommonPageLayout from '../../components/common/CommonPageLayout';
import Button from '../../components/common/Button';
import TrustCard from '../../components/organization/TrustCard';
import TrustFormModal from './forms/TrustFormModal';
import { INITIAL_TRUSTS } from './orgData';

export default function Trust() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrust, setSelectedTrust] = useState(null);
  const [search, setSearch] = useState('');

  return (
    <CommonPageLayout
      title="All Trusts CRUD"
      subtitle="Master management of trust organizations and registration."
      action={<Button icon={Plus} onClick={() => { setSelectedTrust(null); setIsModalOpen(true); }}>Add New Trust</Button>}
      searchValue={search}
      onSearchChange={setSearch}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {INITIAL_TRUSTS.filter(t => t.name.toLowerCase().includes(search.toLowerCase())).map((trust, index) => (
          <TrustCard 
            key={trust.id} 
            trust={trust} 
            index={index}
            onEdit={() => { setSelectedTrust(trust); setIsModalOpen(true); }}
            onDelete={() => alert("Trust Deleted Successfully")}
          />
        ))}
      </div>
      {isModalOpen && (
        <TrustFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialData={selectedTrust} />
      )}
    </CommonPageLayout>
  );
}