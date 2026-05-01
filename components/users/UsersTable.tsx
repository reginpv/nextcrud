'use client'

import { useState, useTransition } from 'react'
import { createUser, updateUser, softDeleteUser } from '@/lib/actions/user'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  UserPlus,
  UserPen,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { toast } from 'sonner'

type UserRow = {
  id: number
  name: string
  email: string
  role: string
  createdAt: Date
}

export default function UsersTable({
  users,
  page,
  totalPages,
  total,
}: {
  users: UserRow[]
  page: number
  totalPages: number
  total: number
}) {
  const router = useRouter()
  const { data: session } = useSession()
  const [isPending, startTransition] = useTransition()
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string> | null>(
    null,
  )
  const [formMessage, setFormMessage] = useState<string | null>(null)

  function goToPage(p: number) {
    router.push(`/dashboard/users?page=${p}`)
  }

  function openAdd() {
    setFormErrors(null)
    setFormMessage(null)
    setModal('add')
  }

  function openEdit(user: UserRow) {
    setFormErrors(null)
    setFormMessage(null)
    setSelectedUser(user)
    setModal('edit')
  }

  function closeModal() {
    setModal(null)
    setSelectedUser(null)
    setFormErrors(null)
    setFormMessage(null)
  }

  function handleAdd(formData: FormData) {
    startTransition(async () => {
      const result = await createUser(null, formData)
      if (result.success) {
        closeModal()
        router.refresh()
        toast.success('User created successfully')
      } else {
        setFormErrors(result.errors || null)
        const msg = Array.isArray(result.message)
          ? result.message.join(' ')
          : result.message || null
        setFormMessage(msg)
      }
    })
  }

  function handleEdit(formData: FormData) {
    startTransition(async () => {
      const result = await updateUser(null, formData)
      if (result.success) {
        closeModal()
        router.refresh()
        toast.success('User updated successfully')
      } else {
        setFormErrors(result.errors || null)
        setFormMessage(result.message || null)
      }
    })
  }

  function handleDelete(user: UserRow) {
    startTransition(async () => {
      await softDeleteUser(String(user.id))
      setDeleteTarget(null)
      toast.success(`${user.name} deleted`)
      if (users.length === 1 && page > 1) {
        goToPage(page - 1)
      } else {
        router.refresh()
      }
    })
  }

  return (
    <>
      {/* Action bar */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-foreground/60">{total} user(s)</p>
        <button
          className="button button--accent flex items-center gap-2 px-4"
          onClick={openAdd}
        >
          <UserPlus size={24} />
          Add User
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-secondary">
          <thead>
            <tr className="bg-primary border-b border-secondary">
              <th className="text-left py-2 px-3 font-medium">ID</th>
              <th className="text-left py-2 px-3 font-medium">Name</th>
              <th className="text-left py-2 px-3 font-medium">Email</th>
              <th className="text-left py-2 px-3 font-medium">Role</th>
              <th className="text-left py-2 px-3 font-medium">Created</th>
              <th className="py-2 px-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isMe = user.email === session?.user?.email
              return (
                <tr
                  key={user.id}
                  className="border-b border-primary hover:bg-primary/60"
                >
                  <td className="py-2 px-3 text-foreground/40">{user.id}</td>
                  <td className="py-2 px-3">{user.name}</td>
                  <td className="py-2 px-3">{user.email}</td>
                  <td className="py-2 px-3">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="py-2 px-3 text-foreground/60">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-3">
                    {isMe ? (
                      <span className="text-sm text-foreground/50 italic">Your account</span>
                    ) : (
                      <div className="flex gap-1 justify-end">
                        <button
                          className="button button--circle"
                          onClick={() => openEdit(user)}
                          title="Edit"
                        >
                          <UserPen size={24} />
                        </button>
                        <button
                          className="button button--circle"
                          onClick={() => setDeleteTarget(user)}
                          title="Delete"
                        >
                          <Trash2 size={24} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-foreground/40">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-foreground/60">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-1">
            <button
              className="button button--circle"
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              title="Previous page"
            >
              <ChevronLeft size={24} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`button min-w-9 ${page === p ? 'button--accent' : ''}`}
                onClick={() => goToPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="button button--circle"
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              title="Next page"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {modal === 'add' && (
        <Modal title="Add User" onClose={closeModal}>
          <form action={handleAdd} className="flex flex-col gap-4">
            <div className="form-control">
              <label>Name</label>
              <input type="text" name="name" className="w-full" />
              {formErrors?.name && (
                <div className="error">{formErrors.name}</div>
              )}
            </div>
            <div className="form-control">
              <label>Email</label>
              <input type="email" name="email" className="w-full" />
              {formErrors?.email && (
                <div className="error">{formErrors.email}</div>
              )}
            </div>
            <div className="form-control">
              <label>Password</label>
              <input type="password" name="password" className="w-full" />
              {formErrors?.password && (
                <div className="error">{formErrors.password}</div>
              )}
            </div>
            <div className="form-control">
              <label>Role</label>
              <select name="role" className="w-full">
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPERADMIN">Superadmin</option>
              </select>
            </div>
            {formMessage && (
              <div className="alert alert--danger">{formMessage}</div>
            )}
            <button
              className="button button--accent w-full justify-center"
              disabled={isPending}
            >
              {isPending ? 'Creating...' : 'Create User'}
            </button>
          </form>
        </Modal>
      )}

      {/* Edit User Modal */}
      {modal === 'edit' && selectedUser && (
        <Modal title="Edit User" onClose={closeModal}>
          <form action={handleEdit} className="flex flex-col gap-4">
            <input type="hidden" name="id" value={selectedUser.id} />
            <div className="form-control">
              <label>Name</label>
              <input
                type="text"
                name="name"
                className="w-full"
                defaultValue={selectedUser.name}
              />
              {formErrors?.name && (
                <div className="error">{formErrors.name}</div>
              )}
            </div>
            <div className="form-control">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="w-full"
                defaultValue={selectedUser.email}
              />
              {formErrors?.email && (
                <div className="error">{formErrors.email}</div>
              )}
            </div>
            <div className="form-control">
              <label>Role</label>
              <select
                name="role"
                className="w-full"
                defaultValue={selectedUser.role}
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPERADMIN">Superadmin</option>
              </select>
            </div>
            {formMessage && (
              <div className="alert alert--danger">{formMessage}</div>
            )}
            <button
              className="button button--accent w-full justify-center"
              disabled={isPending}
            >
              {isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <Modal title="Delete User" onClose={() => setDeleteTarget(null)}>
          <p className="mb-5">
            Are you sure you want to delete <strong>{deleteTarget.name}</strong>
            ?
          </p>
          <div className="flex gap-2 justify-end">
            <button className="button button--secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </button>
            <button
              className="button button--accent"
              onClick={() => handleDelete(deleteTarget)}
              disabled={isPending}
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    SUPERADMIN: 'bg-accent text-white',
    ADMIN: 'bg-tertiary text-foreground',
    USER: 'bg-secondary text-foreground',
  }
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded font-medium ${styles[role] ?? styles.USER}`}
    >
      {role}
    </span>
  )
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded w-full max-w-md p-6 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg">{title}</h2>
          <button className="button button--circle" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
