import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Button from '../../components/common/Button'
import UserDocuments from '../../components/users/UserDocuments'
import { INITIAL_USERS, INITIAL_USER_DOCS } from './userData.jsx'

export default function UserDocumentsPage() {
  var params = useParams(); var userId = parseInt(params.id)
  var navigate = useNavigate()
  var usersState = useState(function() { try { var s = localStorage.getItem('users_full'); return s ? JSON.parse(s) : INITIAL_USERS } catch(e) { return INITIAL_USERS } })[0]
  var users = usersState[0]
  var docsState = useState(function() { try { var s = localStorage.getItem('user_docs'); return s ? JSON.parse(s) : INITIAL_USER_DOCS } catch(e) { return INITIAL_USER_DOCS } })[0]
  var docs = docsState[0]; var setDocs = docsState[1]

  var user = users.find(function(u) { return u.id === userId })
  var userDocs = (docs || []).filter(function(d) { return d.userId === userId })

  if (!user) return (
    <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7 flex items-center justify-center min-h-[calc(100vh-3.5rem)] bg-[#f8fafc]">
      <div className="text-center">
        <p className="text-[14px] font-bold text-slate-600 mb-3">User not found</p>
        <Button variant="secondary" onClick={function() { navigate('/users') }}>Go Back</Button>
      </div>
    </div>
  )

  var handleUpload = function(docData) {
    var newDoc = { id: Date.now(), userId: userId, type: docData.type, fileName: docData.type.toLowerCase().replace(/\s/g, '_') + '.pdf', status: 'Pending', uploadedDate: new Date().toISOString().split('T')[0], uploadedBy: 'Admin', notes: docData.notes || '' }
    setDocs(function(prev) { return prev.concat([newDoc]) })
  }

  var handleDelete = function(docId) { setDocs(function(prev) { return prev.filter(function(d) { return d.id !== docId }) }) }

  return (
    <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7 min-h-[calc(100vh-3.5rem)] bg-[#f8fafc]" style={{ animation: 'pageIn 0.3s ease-out' }}>
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={function() { navigate('/users/' + userId) }} className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors border border-slate-200"><ArrowLeft className="w-4 h-4" /></button>
          <div><h2 className="text-[18px] font-bold text-slate-800">Documents</h2><p className="text-[12px] text-slate-400">{user.name} • {user.role ? user.roleId : ''}</p></div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <UserDocuments documents={userDocs} onUpload={handleUpload} onDelete={handleDelete} />
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: "@keyframes pageIn { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: } } @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); }" }} />
    </div>
  )
}