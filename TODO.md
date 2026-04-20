# Location CRUD Implementation Plan
✅ **1. Create TODO.md** - Track progress (current)

**2. Update src/pages/organization/Location.jsx**
   - Add location data state (useState + localStorage)
   - Dynamic stats computation (countries.length, activeStates, etc.)
   - AddModal state/logic for full CRUD
   - Pass data/setters/activeTab/search to LocationTable
   - Functional Add button

**3. Update/Create src/pages/organization/LocationTable.jsx**
   - Replace hardcoded tableData with props
   - Dynamic table headers/counts per tab
   - ABC sort on headers
   - Functional ActionButtons (view/edit/delete/status toggle)
   - ViewModal: Hierarchy tree (drill-down data)
   - StatusToggle: Updates parent data.status

**4. Implement Modals (in LocationTable or new components)**
   - ViewModal: Full record + children lists
   - EditModal: Cascading dropdowns (CustomDropdown filtered by parent)
   - Use Modal.jsx, CustomDropdown.jsx, ConfirmModal.jsx
   - Validation: required, unique codes

**5. CRUD Functions**
   - Add: Insert with parentId, update counts
   - Edit: Update record, cascade if parent changes
   - Delete: ConfirmModal + remove + update parent counts
   - ToggleStatus: Flip boolean, persist
   - Search/Filter: Client-side

**6. Enhancements**
   - Auto-refresh table after CRUD
   - Toast notifications (simple component)
   - Dynamic pagination
   - localStorage sync

**7. Test**
   - Add/edit/delete chain (Country→Pincode)
   - Cascading dropdowns
   - View hierarchy popup
   - Persistence across tabs

**8. attempt_completion**

