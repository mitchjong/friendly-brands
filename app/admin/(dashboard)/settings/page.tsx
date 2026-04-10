"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import {
  UserPlus,
  Trash2,
  KeyRound,
  Eye,
  EyeOff,
  Shield,
  Loader2,
} from "lucide-react";

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
}

export default function SettingsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Add user form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [addingUser, setAddingUser] = useState(false);

  // Change password
  const [changingPasswordFor, setChangingPasswordFor] = useState<string | null>(null);
  const [newPw, setNewPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Delete confirmation
  const [deletingUser, setDeletingUser] = useState<string | null>(null);

  // Own password change
  const [showOwnPasswordForm, setShowOwnPasswordForm] = useState(false);
  const [ownCurrentPassword, setOwnCurrentPassword] = useState("");
  const [ownNewPassword, setOwnNewPassword] = useState("");
  const [showOwnCurrent, setShowOwnCurrent] = useState(false);
  const [showOwnNew, setShowOwnNew] = useState(false);
  const [updatingOwn, setUpdatingOwn] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const supabase = createSupabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);

      const res = await fetch("/api/auth/users");
      const data = await res.json();
      if (data.users) setUsers(data.users);
      if (data.error) setError(data.error);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  function flash(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  }

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    setAddingUser(true);
    setError("");

    try {
      const res = await fetch("/api/auth/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, password: newPassword }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        flash("User added successfully");
        setNewEmail("");
        setNewPassword("");
        setShowAddForm(false);
        await loadData();
      }
    } catch {
      setError("Failed to add user");
    } finally {
      setAddingUser(false);
    }
  }

  async function handleChangePassword(userId: string) {
    setUpdatingPassword(true);
    setError("");

    try {
      const res = await fetch("/api/auth/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password: newPw }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        flash("Password updated successfully");
        setChangingPasswordFor(null);
        setNewPw("");
      }
    } catch {
      setError("Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  }

  async function handleDeleteUser(userId: string) {
    setError("");
    try {
      const res = await fetch("/api/auth/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        flash("User removed successfully");
        setDeletingUser(null);
        await loadData();
      }
    } catch {
      setError("Failed to remove user");
    }
  }

  async function handleChangeOwnPassword(e: React.FormEvent) {
    e.preventDefault();
    setUpdatingOwn(true);
    setError("");

    try {
      // Verify current password by re-authenticating
      const supabase = createSupabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        setError("Could not verify your identity");
        setUpdatingOwn(false);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: ownCurrentPassword,
      });

      if (signInError) {
        setError("Current password is incorrect");
        setUpdatingOwn(false);
        return;
      }

      // Update password via Supabase client
      const { error: updateError } = await supabase.auth.updateUser({
        password: ownNewPassword,
      });

      if (updateError) {
        setError(updateError.message);
      } else {
        flash("Your password has been updated");
        setShowOwnPasswordForm(false);
        setOwnCurrentPassword("");
        setOwnNewPassword("");
      }
    } catch {
      setError("Failed to update password");
    } finally {
      setUpdatingOwn(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Alerts */}
      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
          <button onClick={() => setError("")} className="float-right font-bold">&times;</button>
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Your Account */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Your Account
          </h2>
        </div>
        <div className="px-6 py-4">
          <p className="text-sm text-gray-600 mb-3">
            Signed in as <strong>{users.find((u) => u.id === currentUserId)?.email || "—"}</strong>
          </p>
          {!showOwnPasswordForm ? (
            <button
              onClick={() => setShowOwnPasswordForm(true)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Change your password
            </button>
          ) : (
            <form onSubmit={handleChangeOwnPassword} className="space-y-3 max-w-sm">
              <div className="relative">
                <input
                  type={showOwnCurrent ? "text" : "password"}
                  value={ownCurrentPassword}
                  onChange={(e) => setOwnCurrentPassword(e.target.value)}
                  placeholder="Current password"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pr-10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
                <button type="button" onClick={() => setShowOwnCurrent(!showOwnCurrent)} className="absolute right-3 top-2.5 text-gray-400">
                  {showOwnCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showOwnNew ? "text" : "password"}
                  value={ownNewPassword}
                  onChange={(e) => setOwnNewPassword(e.target.value)}
                  placeholder="New password (min 6 characters)"
                  required
                  minLength={6}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pr-10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
                <button type="button" onClick={() => setShowOwnNew(!showOwnNew)} className="absolute right-3 top-2.5 text-gray-400">
                  {showOwnNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={updatingOwn}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
                >
                  {updatingOwn ? "Updating..." : "Update Password"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowOwnPasswordForm(false); setOwnCurrentPassword(""); setOwnNewPassword(""); }}
                  className="text-gray-500 hover:text-gray-700 px-4 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Admin Users</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 bg-primary-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-700"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add User
          </button>
        </div>

        {/* Add user form */}
        {showAddForm && (
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
            <form onSubmit={handleAddUser} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Email address"
                required
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
              <div className="relative flex-1">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Password (min 6 chars)"
                  required
                  minLength={6}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pr-10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-2.5 text-gray-400">
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={addingUser}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 whitespace-nowrap"
                >
                  {addingUser ? "Adding..." : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddForm(false); setNewEmail(""); setNewPassword(""); }}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users list */}
        <div className="divide-y divide-gray-100">
          {users.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-gray-400">
              No users found. Add your first admin user above, or check that the Supabase service role key is configured.
            </div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.email}
                      {user.id === currentUserId && (
                        <span className="ml-2 text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Created {new Date(user.created_at).toLocaleDateString()}
                      {user.last_sign_in_at && (
                        <> &middot; Last login {new Date(user.last_sign_in_at).toLocaleDateString()}</>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setChangingPasswordFor(changingPasswordFor === user.id ? null : user.id);
                        setNewPw("");
                      }}
                      className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-50"
                      title="Change password"
                    >
                      <KeyRound className="w-4 h-4" />
                    </button>
                    {user.id !== currentUserId && (
                      <button
                        onClick={() => setDeletingUser(deletingUser === user.id ? null : user.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-50"
                        title="Remove user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Change password inline */}
                {changingPasswordFor === user.id && (
                  <div className="mt-3 flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showPw ? "text" : "password"}
                        value={newPw}
                        onChange={(e) => setNewPw(e.target.value)}
                        placeholder="New password (min 6 chars)"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pr-10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                      />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-2.5 text-gray-400">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <button
                      onClick={() => handleChangePassword(user.id)}
                      disabled={updatingPassword || newPw.length < 6}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 whitespace-nowrap"
                    >
                      {updatingPassword ? "Saving..." : "Save"}
                    </button>
                  </div>
                )}

                {/* Delete confirmation */}
                {deletingUser === user.id && (
                  <div className="mt-3 bg-red-50 rounded-lg p-3 flex items-center justify-between">
                    <p className="text-sm text-red-700">Remove this user? This cannot be undone.</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700"
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => setDeletingUser(null)}
                        className="text-gray-500 hover:text-gray-700 px-3 py-1.5 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
